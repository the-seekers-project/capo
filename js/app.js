class CapoApp {
    constructor() {
        this.storage = new StorageManager();
        this.autoScroller = new AutoScroller();
        this.scraper = new ScraperClient();
        this.currentSong = null;
        this.currentTransposition = 0;
        this.originalKey = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.autoScroller.init();
        this.loadSettings();
        this.initTheme();
        
        // Show welcome screen initially
        this.showWelcomeScreen();
    }
    
    bindEvents() {
        // Header buttons
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('search-btn').addEventListener('click', () => this.showSearch());
        document.getElementById('saved-btn').addEventListener('click', () => this.showSaved());
        document.getElementById('start-search').addEventListener('click', () => this.showSearch());
        
        // Search functionality
        document.getElementById('search-input').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(e.target.value);
            }
        });
        document.getElementById('close-search').addEventListener('click', () => this.hideSearch());
        document.getElementById('close-saved').addEventListener('click', () => this.hideSaved());
        
        // Header song controls (primary controls)
        document.getElementById('header-transpose-up').addEventListener('click', () => this.transposeUp());
        document.getElementById('header-transpose-down').addEventListener('click', () => this.transposeDown());
        document.getElementById('header-auto-scroll').addEventListener('click', () => this.toggleAutoScroll());
        document.getElementById('header-save').addEventListener('click', () => this.toggleSaveSong());
        document.getElementById('header-scroll-to-top').addEventListener('click', () => this.scrollToTop());
        
        // Floating controls (backup - now hidden)
        document.getElementById('floating-transpose-up').addEventListener('click', () => this.transposeUp());
        document.getElementById('floating-transpose-down').addEventListener('click', () => this.transposeDown());
        document.getElementById('floating-auto-scroll').addEventListener('click', () => this.toggleAutoScroll());
        document.getElementById('floating-save').addEventListener('click', () => this.toggleSaveSong());
        document.getElementById('scroll-to-top').addEventListener('click', () => this.scrollToTop());
        
        // Chord modal
        document.getElementById('close-chord-modal').addEventListener('click', () => this.hideChordModal());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Click outside to close overlays
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }
    
    showWelcomeScreen() {
        document.getElementById('welcome-screen').classList.remove('hidden');
        document.getElementById('song-view').classList.add('hidden');
        document.getElementById('floating-controls').classList.add('hidden');
        document.getElementById('header-song-controls-container').classList.add('hidden');
    }
    
    showSearch() {
        document.getElementById('search-overlay').classList.remove('hidden');
        document.getElementById('search-input').focus();
    }
    
    hideSearch() {
        document.getElementById('search-overlay').classList.add('hidden');
        document.getElementById('search-results').innerHTML = '';
    }
    
    showSaved() {
        document.getElementById('saved-overlay').classList.remove('hidden');
        this.renderSavedSongs();
    }
    
    hideSaved() {
        document.getElementById('saved-overlay').classList.add('hidden');
    }
    
    async handleSearch(query) {
        if (!query.trim()) {
            document.getElementById('search-results').innerHTML = '';
            return;
        }
        
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
        
        try {
            // First try web scraping
            const results = await this.scraper.searchSongs(query);
            
            if (results.length === 0) {
                // Offer manual input option
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <p>No results found. Try:</p>
                        <button id="manual-input-btn" class="primary-btn">Enter Chord Chart Manually</button>
                        <p style="margin-top: 1rem; font-size: 0.9rem; color: #ccc;">
                            Or paste a URL to a chord chart:
                        </p>
                        <input type="url" id="url-input" placeholder="https://..." style="width: 100%; margin-top: 0.5rem;">
                        <button id="fetch-url-btn" class="control-btn" style="margin-top: 0.5rem;">Fetch</button>
                    </div>
                `;
                
                document.getElementById('manual-input-btn').addEventListener('click', () => this.showManualInput());
                document.getElementById('fetch-url-btn').addEventListener('click', () => this.fetchFromUrl());
                
                return;
            }
            
            this.renderSearchResults(results);
            
        } catch (error) {
            console.error('Search failed:', error);
            resultsContainer.innerHTML = `
                <div class="error">
                    <p>Search failed. Would you like to enter a chord chart manually?</p>
                    <button id="manual-input-btn" class="primary-btn">Enter Manually</button>
                </div>
            `;
            
            document.getElementById('manual-input-btn').addEventListener('click', () => this.showManualInput());
        }
    }
    
    renderSearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No songs found</div>';
            return;
        }
        
        // Sort results by rating (highest first), then by votes
        results.sort((a, b) => {
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            return b.votes - a.votes;
        });
        
        const html = results.map(song => {
            // Format rating display with styling
            const rating = song.rating ? `<span class="rating">★${song.rating.toFixed(1)}</span>` : '';
            const votes = song.votes ? `<span class="votes">(${song.votes} votes)</span>` : '';
            const version = song.version > 1 ? `<span class="version">v${song.version}</span>` : '';
            
            // Create version info elements
            const versionElements = [version, rating, votes].filter(Boolean);
            const versionInfo = versionElements.length > 0 ? ` • ${versionElements.join(' ')}` : '';
            
            return `
                <div class="song-item" data-url="${song.url || 'sample'}" data-title="${song.title}" data-artist="${song.artist}" data-id="${song.id || ''}">
                    <h3>${song.title}</h3>
                    <p>${song.artist} • ${song.source}${versionInfo}</p>
                </div>
            `;
        }).join('');
        
        resultsContainer.innerHTML = html;
        
        // Bind click events
        resultsContainer.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', (event) => {
                const title = item.dataset.title;
                const artist = item.dataset.artist;
                const id = item.dataset.id;
                const url = item.dataset.url;
                
                // Check if it's a sample song (no ID from scraper service)
                if (!id || url === 'sample') {
                    const sampleSong = this.scraper.sampleSongs?.find(song => 
                        song.title === title && song.artist === artist
                    );
                    
                    if (sampleSong) {
                        this.loadSong(sampleSong);
                        this.hideSearch();
                        return;
                    }
                }
                
                // Use the scraper service with the ID
                this.loadSongFromUrl(url, id);
            });
        });
    }
    
    async loadSongFromUrl(url, id = null) {
        try {
            document.getElementById('search-results').innerHTML = '<div class="loading">Loading song...</div>';
            
            // Use the ID if available, otherwise fall back to URL
            const songData = await this.scraper.fetchChordChart(url, id);
            this.loadSong(songData);
            this.hideSearch();
            
        } catch (error) {
            console.error('Failed to load song:', error);
            document.getElementById('search-results').innerHTML = `
                <div class="error">Failed to load song. Try entering manually.</div>
            `;
        }
    }
    
    async fetchFromUrl() {
        const urlInput = document.getElementById('url-input');
        const url = urlInput.value.trim();
        
        if (!url) return;
        
        try {
            const songData = await this.scraper.fetchChordChart(url);
            this.loadSong(songData);
            this.hideSearch();
        } catch (error) {
            alert('Failed to fetch from URL. Please try entering the chord chart manually.');
        }
    }
    
    showManualInput() {
        this.hideSearch();
        
        const modal = document.createElement('div');
        modal.className = 'overlay';
        modal.innerHTML = `
            <div class="search-container">
                <h2>Enter Chord Chart</h2>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
                <textarea id="manual-chart-input" placeholder="Paste or type your chord chart here...
                
Example:
Verse:
C        Am       F        G
Amazing grace how sweet the sound
C        Am       F    G    C
That saved a wretch like me

Chorus:
F        C        Am       G
I once was lost but now am found
F        C        G        C
Was blind but now I see" 
                style="width: 100%; height: 300px; background: #222; border: 1px solid #444; color: #fff; padding: 1rem; border-radius: 8px; font-family: monospace; resize: vertical;"></textarea>
                <div style="margin-top: 1rem;">
                    <input type="text" id="manual-title" placeholder="Song title" style="width: 48%; margin-right: 4%; background: #222; border: 1px solid #444; color: #fff; padding: 0.5rem; border-radius: 4px;">
                    <input type="text" id="manual-artist" placeholder="Artist" style="width: 48%; background: #222; border: 1px solid #444; color: #fff; padding: 0.5rem; border-radius: 4px;">
                </div>
                <button id="load-manual-chart" class="primary-btn" style="margin-top: 1rem; width: 100%;">Load Chart</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('manual-chart-input').focus();
        
        document.getElementById('load-manual-chart').addEventListener('click', () => {
            const content = document.getElementById('manual-chart-input').value;
            const title = document.getElementById('manual-title').value || 'Manual Input';
            const artist = document.getElementById('manual-artist').value || 'Unknown';
            
            if (content.trim()) {
                const songData = {
                    title,
                    artist,
                    content: content.trim(),
                    source: 'Manual'
                };
                
                this.loadSong(songData);
                modal.remove();
            }
        });
    }
    
    loadSong(songData) {
        this.currentSong = songData;
        this.currentTransposition = 0;
        
        // Extract chords to detect key
        const chordMatches = songData.content.match(/\b[A-G](?:#|b)?(?:maj|min|m|7|sus|add|dim|aug)?\d*\b/g);
        this.originalKey = chordMatches ? detectKey(chordMatches) : 'C';
        
        // Parse and render the chord chart
        const parsedChart = parseChordChart(songData.content);
        const renderedChart = renderChordChart(parsedChart);
        
        // Update UI
        document.getElementById('song-title').textContent = songData.title;
        document.getElementById('song-artist').textContent = songData.artist;
        document.getElementById('key-display').textContent = this.originalKey;
        document.getElementById('chord-chart').innerHTML = renderedChart;
        
        // Update save button
        this.updateSaveButton();
        
        // Show song view and header controls
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('song-view').classList.remove('hidden');
        document.getElementById('floating-controls').classList.remove('hidden'); // Keep for compatibility
        document.getElementById('header-song-controls-container').classList.remove('hidden');
        
        // Bind chord click events
        this.bindChordEvents();
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    bindChordEvents() {
        document.querySelectorAll('.chord').forEach(chord => {
            chord.addEventListener('click', () => {
                this.showChordModal(chord.dataset.chord);
            });
        });
    }
    
    showChordModal(chordName) {
        const diagram = getChordDiagram(chordName);
        const alternatives = getChordAlternatives(chordName);
        
        document.getElementById('chord-name').textContent = chordName;
        
        if (diagram) {
            document.getElementById('chord-diagram').innerHTML = `<pre>${diagram.diagram}</pre>`;
        } else {
            document.getElementById('chord-diagram').innerHTML = '<p>Diagram not available</p>';
        }
        
        const altHtml = alternatives.length > 0 ? 
            `<p>Try these alternatives:</p>${alternatives.map(alt => 
                `<span class="alt-chord" onclick="app.showChordModal('${alt}')">${alt}</span>`
            ).join('')}` : 
            '<p>No alternatives available</p>';
        
        document.getElementById('chord-alternatives').innerHTML = altHtml;
        document.getElementById('chord-modal').classList.remove('hidden');
    }
    
    hideChordModal() {
        document.getElementById('chord-modal').classList.add('hidden');
    }
    
    transposeUp() {
        this.currentTransposition++;
        this.applyTransposition();
    }
    
    transposeDown() {
        this.currentTransposition--;
        this.applyTransposition();
    }
    
    applyTransposition() {
        if (!this.currentSong) return;
        
        const chartElement = document.getElementById('chord-chart');
        const transposedChart = transposeChordChart(chartElement.innerHTML, 1);
        chartElement.innerHTML = transposedChart;
        
        // Update key display
        const newKey = getTransposedKey(this.originalKey, this.currentTransposition);
        document.getElementById('key-display').textContent = newKey;
        
        // Re-bind chord events
        this.bindChordEvents();
    }
    
    toggleSaveSong() {
        if (!this.currentSong) return;
        
        const isSaved = this.storage.isSongSaved(this.currentSong.title, this.currentSong.artist);
        
        if (isSaved) {
            this.storage.removeSong(this.currentSong.title, this.currentSong.artist);
        } else {
            this.storage.saveSong({
                ...this.currentSong,
                transposition: this.currentTransposition
            });
        }
        
        this.updateSaveButton();
    }
    
    updateSaveButton() {
        if (!this.currentSong) return;
        
        const isSaved = this.storage.isSongSaved(this.currentSong.title, this.currentSong.artist);
        
        // Update floating save button (for compatibility)
        const floatingSaveBtn = document.getElementById('floating-save');
        if (floatingSaveBtn) {
            floatingSaveBtn.textContent = '💾';
            floatingSaveBtn.title = isSaved ? 'Remove from saved' : 'Save song';
            if (isSaved) {
                floatingSaveBtn.classList.add('active');
            } else {
                floatingSaveBtn.classList.remove('active');
            }
        }
        
        // Update header save button
        const headerSaveBtn = document.getElementById('header-save');
        if (headerSaveBtn) {
            headerSaveBtn.textContent = '💾';
            headerSaveBtn.title = isSaved ? 'Remove from saved' : 'Save song';
            if (isSaved) {
                headerSaveBtn.classList.add('active');
            } else {
                headerSaveBtn.classList.remove('active');
            }
        }
    }
    
    toggleAutoScroll() {
        if (this.autoScroller) {
            this.autoScroller.toggle();
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    renderSavedSongs() {
        const savedList = document.getElementById('saved-list');
        const saved = this.storage.getSavedSongs();
        
        if (saved.length === 0) {
            savedList.innerHTML = '<div class="no-results">No saved songs</div>';
            return;
        }
        
        const html = saved.map(song => `
            <div class="song-item" data-title="${song.title}" data-artist="${song.artist}">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
        `).join('');
        
        savedList.innerHTML = html;
        
        savedList.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', () => {
                const song = saved.find(s => 
                    s.title === item.dataset.title && s.artist === item.dataset.artist
                );
                if (song) {
                    this.loadSong(song);
                    this.hideSaved();
                }
            });
        });
    }
    
    handleKeyboard(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
        
        switch (event.key) {
            case 'Escape':
                this.hideSearch();
                this.hideSaved();
                this.hideChordModal();
                break;
            case 's':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    this.toggleSaveSong();
                }
                break;
            case '/':
                event.preventDefault();
                this.showSearch();
                break;
        }
    }
    
    handleOutsideClick(event) {
        if (event.target.classList.contains('overlay')) {
            event.target.classList.add('hidden');
        }
    }
    
    loadSettings() {
        const settings = this.storage.getSettings();
        
        if (settings.fontSize) {
            document.documentElement.style.setProperty('--base-font-size', settings.fontSize + 'px');
        }
        
        if (settings.scrollSpeed) {
            this.autoScroller.setSpeed(settings.scrollSpeed);
        }
    }
    
    initTheme() {
        // Check for saved theme or default to dark
        const savedTheme = localStorage.getItem('capo-theme') || 'dark';
        this.setTheme(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('capo-theme', theme);
        
        // Update theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
            themeToggle.title = `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`;
        }
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CapoApp();
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}