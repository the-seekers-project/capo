class ScraperClient {
    constructor() {
        this.baseUrl = this.detectBackendUrl();
        this.timeout = 10000; // 10 seconds
    }

    detectBackendUrl() {
        // Check if we're running in production (deployed)
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            // Production: use Cloudflare Workers backend URL
            return 'https://capo-scraper.the-seekers-project.workers.dev';
        }
        
        // Local development: use localhost
        const host = window.location.hostname;
        const possiblePorts = [8080, 8081, 8082, 8083, 8084, 8085];
        
        // If we're on a custom frontend port, try to detect backend port
        if (window.location.port && window.location.port !== '80' && window.location.port !== '443') {
            // Add some common backend ports relative to frontend port
            const frontendPort = parseInt(window.location.port);
            if (frontendPort >= 8000) {
                possiblePorts.unshift(8080, frontendPort - 1000, frontendPort + 80);
            }
        }
        
        // Use the same host as the frontend (works for both localhost and network IPs)
        return `http://${host}:${possiblePorts[0]}`;
    }

    async searchSongs(query) {
        console.log('Searching for:', query);
        
        try {
            const response = await this.makeRequest(`/search?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`);
            }
            
            const results = await response.json();
            
            // Transform results to match the expected format
            return results.map(result => ({
                title: result.title,
                artist: result.artist,
                url: result.url,
                source: result.source,
                content: null, // Will be fetched separately
                id: result.id,
                rating: result.rating,
                version: result.version,
                votes: result.votes
            }));
            
        } catch (error) {
            console.error('Search failed:', error);
            return this.getFallbackResults(query);
        }
    }

    async fetchChordChart(url, id) {
        console.log('Fetching chord chart for ID:', id);
        
        try {
            // Extract ID from URL if not provided
            if (!id && url) {
                const match = url.match(/(\d+)$/);
                if (match) {
                    id = match[1];
                }
            }
            
            if (!id) {
                throw new Error('No tab ID found');
            }
            
            const response = await this.makeRequest(`/tab/${id}`);
            
            if (!response.ok) {
                throw new Error(`Tab fetch failed: ${response.status}`);
            }
            
            const result = await response.json();
            
            return {
                title: result.title,
                artist: result.artist,
                content: result.content,
                source: result.source
            };
            
        } catch (error) {
            console.error('Failed to fetch chord chart:', error);
            return this.getFallbackChordChart(url);
        }
    }

    async getPopularSongs() {
        console.log('Fetching popular songs...');
        
        try {
            const response = await this.makeRequest('/popular');
            
            if (!response.ok) {
                throw new Error(`Popular fetch failed: ${response.status}`);
            }
            
            const results = await response.json();
            
            return results.map(result => ({
                title: result.title,
                artist: result.artist,
                url: result.url,
                source: result.source,
                content: null,
                id: result.id,
                rating: result.rating,
                version: result.version,
                votes: result.votes
            }));
            
        } catch (error) {
            console.error('Failed to fetch popular songs:', error);
            return [];
        }
    }

    async checkHealth() {
        try {
            const response = await this.makeRequest('/health');
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async makeRequest(endpoint) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            // If first attempt fails, try other ports
            if (endpoint === '/health' || !this.hasTriedOtherPorts) {
                this.hasTriedOtherPorts = true;
                const alternativeUrl = await this.findWorkingBackend();
                if (alternativeUrl) {
                    this.baseUrl = alternativeUrl;
                    return this.makeRequest(endpoint);
                }
            }
            
            throw error;
        }
    }

    async findWorkingBackend() {
        const host = window.location.hostname;
        const possiblePorts = [8080, 8081, 8082, 8083, 8084, 8085];
        
        for (const port of possiblePorts) {
            try {
                const testUrl = `http://${host}:${port}`;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000); // Shorter timeout for port testing
                
                const response = await fetch(`${testUrl}/health`, {
                    method: 'GET',
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    console.log(`Found working backend on port ${port}`);
                    return testUrl;
                }
            } catch (error) {
                // Continue to next port
            }
        }
        
        return null;
    }

    getFallbackResults(query) {
        return [{
            title: `Service Unavailable for "${query}"`,
            artist: 'Scraper Service',
            content: `The scraper service is not available. 

To start the service:
1. Open a terminal in the capo directory
2. Run: ./start.sh

Or manually:
1. Navigate to the scraper-service directory
2. Run: ./capo-scraper

Or use the Manual Input option to paste chord charts directly.`,
            source: 'Service Error',
            isError: true
        }];
    }

    getFallbackChordChart(url) {
        return {
            title: 'Service Unavailable',
            artist: 'Unknown',
            content: `Unable to fetch chord chart from the scraper service.

To start the service:
1. Open a terminal in the capo directory
2. Run: ./start.sh

Or manually:
1. Navigate to the scraper-service directory  
2. Run: ./capo-scraper

The service should be running on http://localhost:8081

You can also use the Manual Input option to paste chord charts directly.`,
            source: 'Service Error',
            isError: true
        };
    }

    // Helper method to parse manual input (reused from original scraper)
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
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScraperClient;
}