class ChordScraper {
    constructor() {
        // Simplified approach - focus on what actually works
        this.corsProxies = [
            'https://api.allorigins.win/get?url=',
            'https://corsproxy.io/?',
            'https://api.codetabs.com/v1/proxy?quest='
        ];
        
        // Instead of scraping, we'll focus on manual input and known working sources
        this.workingSources = [
            'https://www.guitaretab.com/',
            'https://www.e-chords.com/',
            'https://www.songsterr.com/' // Has API
        ];
    }

    async searchSongs(query) {
        console.log('Searching for:', query);
        
        // Since scraping is blocked, let's try a different approach
        const results = [];
        
        try {
            // Try Songsterr API first (they have a public API)
            const songsterrResults = await this.searchSongsterr(query);
            results.push(...songsterrResults);
            
            // Try a simple Google search approach
            const googleResults = await this.searchViaGoogle(query);
            results.push(...googleResults);
            
        } catch (error) {
            console.error('All search methods failed:', error);
        }
        
        // If no results, suggest manual input
        if (results.length === 0) {
            results.push({
                title: `No results found for "${query}"`,
                artist: 'Try Manual Input',
                content: `We couldn't find chord charts for "${query}". 

Common reasons:
1. Websites are blocking automated requests
2. Song name might be spelled differently
3. Try searching for just the artist name

You can paste chord charts manually using the "Manual Input" option.`,
                source: 'Manual Input Suggested',
                isManualSuggestion: true
            });
        }
        
        return results.slice(0, 5);
    }

    async searchSongsterr(query) {
        const results = [];
        
        try {
            // Songsterr has a public API
            const apiUrl = `https://www.songsterr.com/a/ra/songs.json?pattern=${encodeURIComponent(query)}`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data && Array.isArray(data)) {
                    for (let song of data.slice(0, 3)) {
                        results.push({
                            title: this.sanitizeTitle(song.title || 'Unknown'),
                            artist: this.sanitizeArtist(song.artist?.name || 'Unknown'),
                            url: `https://www.songsterr.com/a/wa/song?id=${song.id}`,
                            source: 'Songsterr',
                            content: null // Will need to be fetched separately
                        });
                    }
                }
            }
        } catch (error) {
            console.log('Songsterr API failed:', error.message);
        }
        
        return results;
    }

    async searchViaGoogle(query) {
        const results = [];
        
        try {
            // Try searching for chord sites specifically
            const searchQueries = [
                `"${query}" site:ultimate-guitar.com chords`,
                `"${query}" site:azchords.com`,
                `"${query}" chords lyrics`,
                `${query} guitar chords`
            ];
            
            for (let searchQuery of searchQueries) {
                try {
                    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                    const html = await this.fetchWithProxy(googleUrl);
                    
                    if (html) {
                        const googleResults = this.parseGoogleResults(html, query);
                        results.push(...googleResults);
                        
                        if (results.length >= 3) break;
                    }
                } catch (error) {
                    console.log(`Google search failed for "${searchQuery}":`, error.message);
                }
            }
        } catch (error) {
            console.log('Google search completely failed:', error.message);
        }
        
        return results;
    }

    async fetchWithProxy(url) {
        console.log('Attempting to fetch:', url);
        
        const strategies = [
            () => this.tryDirectFetch(url),
            () => this.tryAllOriginsProxy(url),
            () => this.tryCorsproxy(url)
        ];
        
        for (let i = 0; i < strategies.length; i++) {
            try {
                console.log(`Trying fetch strategy ${i + 1}...`);
                const result = await strategies[i]();
                
                if (result && result.length > 200) {
                    console.log(`Strategy ${i + 1} succeeded`);
                    return result;
                }
            } catch (error) {
                console.log(`Strategy ${i + 1} failed:`, error.message);
            }
        }
        
        throw new Error('All fetch strategies failed - likely blocked by anti-scraping measures');
    }

    async tryDirectFetch(url) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                signal: controller.signal,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            clearTimeout(timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            clearTimeout(timeout);
            throw error;
        }
    }

    async tryAllOriginsProxy(url) {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Proxy returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.contents) {
            throw new Error('Invalid proxy response');
        }
        
        return data.contents;
    }

    async tryCorsproxy(url) {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });
        
        if (!response.ok) {
            throw new Error(`CORS proxy returned ${response.status}`);
        }
        
        return await response.text();
    }

    parseGoogleResults(html, originalQuery) {
        const results = [];
        
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            if (!doc || !doc.body) {
                return results;
            }
            
            // Look for chord site links in Google results
            const linkSelectors = [
                'a[href*="ultimate-guitar.com"]',
                'a[href*="azchords.com"]',
                'a[href*="chordie.com"]',
                'a[href*="e-chords.com"]',
                'a[href*="guitaretab.com"]'
            ];
            
            for (const selector of linkSelectors) {
                const links = doc.querySelectorAll(selector);
                
                for (let link of links) {
                    const href = link.getAttribute('href');
                    const text = link.textContent?.trim();
                    
                    if (href && text && !href.includes('search') && !href.includes('google')) {
                        // Extract actual URL from Google redirect
                        let actualUrl = href;
                        if (href.includes('/url?q=')) {
                            const match = href.match(/\/url\?q=([^&]+)/);
                            if (match) actualUrl = decodeURIComponent(match[1]);
                        }
                        
                        if (actualUrl.includes('http')) {
                            // Try to parse title and artist from link text
                            const cleanText = text.replace(/\s*-\s*(Ultimate Guitar|AzChords|Chordie).*$/i, '');
                            const parts = cleanText.split(/\s*[-–|]\s*/);
                            
                            let title = originalQuery;
                            let artist = 'Unknown';
                            
                            if (parts.length >= 2) {
                                artist = this.sanitizeArtist(parts[0]);
                                title = this.sanitizeTitle(parts[1]);
                            } else if (parts.length === 1 && parts[0]) {
                                title = this.sanitizeTitle(parts[0]);
                            }
                            
                            results.push({
                                title: title,
                                artist: artist,
                                url: actualUrl,
                                source: this.getSourceFromUrl(actualUrl),
                                content: null
                            });
                        }
                    }
                }
                
                if (results.length >= 3) break;
            }
        } catch (error) {
            console.error('Error parsing Google results:', error);
        }
        
        return results.slice(0, 3);
    }

    getSourceFromUrl(url) {
        if (url.includes('ultimate-guitar.com')) return 'Ultimate Guitar';
        if (url.includes('azchords.com')) return 'AzChords';
        if (url.includes('chordie.com')) return 'Chordie';
        if (url.includes('e-chords.com')) return 'E-Chords';
        if (url.includes('guitaretab.com')) return 'GuitareTab';
        return 'Web';
    }

    async fetchChordChart(url) {
        console.log('Attempting to fetch chord chart from:', url);
        
        try {
            const html = await this.fetchWithProxy(url);
            
            if (!html || html.length < 200) {
                throw new Error('Empty or invalid response');
            }
            
            // Try to parse based on the source
            if (url.includes('ultimate-guitar.com')) {
                return this.parseUltimateGuitarChart(html);
            } else if (url.includes('songsterr.com')) {
                return this.parseSongsterrChart(html);
            } else {
                return this.parseGenericChart(html, url);
            }
            
        } catch (error) {
            console.error('Failed to fetch chord chart:', error);
            
            // Return a helpful error message
            return {
                title: 'Failed to Load',
                artist: 'Unknown',
                content: `Unable to load chord chart from ${url}

This is likely because:
1. The website is blocking automated requests
2. The page structure has changed
3. A captcha or login is required

Try copying the chord chart manually from the website and using the "Manual Input" option instead.`,
                source: 'Error',
                isError: true
            };
        }
    }

    parseUltimateGuitarChart(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        let content = '';
        let title = 'Unknown';
        let artist = 'Unknown';
        
        // Try to find JSON data first
        const jsonMatch = html.match(/window\.UGAPP\.store\.page\s*=\s*({.+?});/);
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[1]);
                if (data.data?.tab_view?.wiki_tab?.content) {
                    content = data.data.tab_view.wiki_tab.content;
                    title = data.data.tab_view.song?.title || title;
                    artist = data.data.tab_view.song?.artist || artist;
                }
            } catch (e) {
                console.log('Failed to parse UG JSON data');
            }
        }
        
        // Fallback to DOM parsing
        if (!content) {
            const pre = doc.querySelector('pre.js-tab-content, pre[class*="chord"], div.js-tab-content pre');
            if (pre) {
                content = pre.textContent || '';
            }
        }
        
        if (!content) {
            throw new Error('No chord content found on Ultimate Guitar page');
        }
        
        return {
            title: this.sanitizeTitle(title),
            artist: this.sanitizeArtist(artist),
            content: this.cleanChordChart(content),
            source: 'Ultimate Guitar'
        };
    }

    parseSongsterrChart(html) {
        // Songsterr is primarily for tabs, not chords
        throw new Error('Songsterr contains tabs, not chord charts. Try a different source.');
    }

    parseGenericChart(html, url) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Remove scripts and styles
        doc.querySelectorAll('script, style, noscript').forEach(el => el.remove());
        
        let content = '';
        let title = 'Unknown';
        let artist = 'Unknown';
        
        // Look for chord content
        const containers = doc.querySelectorAll('pre, .chord-sheet, .chord-content, .lyrics, .song-content');
        
        for (let container of containers) {
            const text = container.textContent || '';
            if (this.looksLikeChordChart(text)) {
                content = text;
                break;
            }
        }
        
        // Extract title and artist
        const h1 = doc.querySelector('h1');
        if (h1) title = this.sanitizeTitle(h1.textContent);
        
        const h2 = doc.querySelector('h2');
        if (h2 && h2.textContent?.toLowerCase().includes('by')) {
            const match = h2.textContent.match(/by\s+(.+)/i);
            if (match) artist = this.sanitizeArtist(match[1]);
        }
        
        if (!content) {
            throw new Error('No chord content found on page');
        }
        
        return {
            title: title,
            artist: artist,
            content: this.cleanChordChart(content),
            source: this.getSourceFromUrl(url)
        };
    }

    looksLikeChordChart(text) {
        if (!text || text.length < 20) return false;
        
        const chordPattern = /\b[A-G](?:#|b)?(?:maj|min|m|dim|aug|sus|add)?(?:\d+)?(?:\/[A-G](?:#|b)?)?\b/g;
        const matches = text.match(chordPattern);
        
        return matches && matches.length >= 3;
    }

    cleanChordChart(content) {
        if (!content) return '';
        
        return content
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\n{4,}/g, '\n\n\n')
            .replace(/^\s+|\s+$/gm, '')
            .replace(/\[tab\]|\[\/tab\]/gi, '')
            .trim();
    }

    parseManualInput(text) {
        if (!text || typeof text !== 'string') {
            return {
                title: 'Manual Input',
                artist: 'Unknown',
                content: '',
                source: 'Manual'
            };
        }
        
        const lines = text.split('\n').filter(l => l.trim());
        let title = 'Manual Input';
        let artist = 'Unknown';
        let contentStartIndex = 0;
        
        // Try to extract title and artist from first few lines
        for (let i = 0; i < Math.min(3, lines.length); i++) {
            const line = lines[i].trim();
            
            if (this.containsChords(line)) {
                contentStartIndex = i;
                break;
            }
            
            if (i === 0 && line.length < 100) {
                title = line;
            } else if (i === 1 && line.length < 100) {
                if (line.toLowerCase().startsWith('by ')) {
                    artist = line.substring(3).trim();
                } else if (line.includes(' - ')) {
                    const parts = line.split(' - ');
                    artist = parts[0].trim();
                    if (parts[1]) title = parts[1].trim();
                } else {
                    artist = line;
                }
            }
        }
        
        const content = lines.slice(contentStartIndex).join('\n');
        
        return {
            title: this.sanitizeTitle(title),
            artist: this.sanitizeArtist(artist),
            content: this.cleanChordChart(content),
            source: 'Manual'
        };
    }

    containsChords(line) {
        if (!line) return false;
        
        const chordPattern = /\b[A-G](?:#|b)?(?:maj|min|m|dim|aug|sus|add)?(?:\d+)?(?:\/[A-G](?:#|b)?)?\b/g;
        const matches = line.match(chordPattern);
        
        return matches && matches.length >= 1 && line.length < 200;
    }

    sanitizeTitle(title) {
        if (!title) return 'Unknown';
        
        return title
            .replace(/\s*\(chords?\)?\s*$/i, '')
            .replace(/\s*chords?\s*$/i, '')
            .replace(/\s*tab\s*$/i, '')
            .trim() || 'Unknown';
    }

    sanitizeArtist(artist) {
        if (!artist) return 'Unknown';
        
        return artist
            .replace(/^by\s+/i, '')
            .replace(/\s*\(.*?\)\s*$/, '')
            .trim() || 'Unknown';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChordScraper;
}