# Claude Code Context - Capo Guitar Chord App

## Project Overview

**Capo** is a musician-first chord chart application designed for guitarists. It eliminates friction between finding a song and playing it by providing instant access to chord charts with professional features like transposition, auto-scroll, and chord diagrams.

### Key Philosophy
- **Zero friction**: No accounts, popups, or interruptions
- **Mobile-first**: Optimized for phone use while playing guitar
- **Offline-capable**: Works without internet once songs are saved
- **Musician-focused**: Features designed by and for actual guitar players

## Architecture

### Frontend (Client-side)
- **Vanilla JavaScript**: No frameworks, fast loading
- **PWA**: Progressive Web App with offline capability
- **Responsive Design**: Works on all devices
- **Local Storage**: Saves songs and settings locally

### Backend (Go Service)
- **Go HTTP Server**: Fast, lightweight scraper service
- **Ultimate Guitar Integration**: Uses mobile API via git submodule
- **Chord-only Filtering**: Only returns chord charts, no tablature
- **Content Cleaning**: Removes markup tags from scraped content

## File Structure

```
capo/
├── index.html              # Main application page
├── styles.css              # Complete styling with light/dark themes
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker for offline functionality
├── start.sh                # Main startup script (builds & runs both services)
├── js/
│   ├── app.js              # Main application controller
│   ├── scraper-client.js   # Backend API client with cache-busting
│   ├── chords.js           # Chord parsing and highlighting
│   ├── transpose.js        # Chord transposition logic
│   ├── storage.js          # LocalStorage management
│   └── scroll.js           # Auto-scroll functionality
├── scraper-service/
│   ├── main.go             # Go HTTP server with UG integration
│   ├── go.mod              # Go module dependencies
│   ├── setup.sh            # Backend build script
│   ├── ultimate-guitar-scraper/  # Git submodule
│   └── README.md           # Backend documentation
└── CLAUDE.md               # This context file
```

## Key Features Implemented

### 🎸 Core Functionality
- **Smart Search**: Searches Ultimate Guitar for chord charts only
- **Manual Input**: Paste/type chord charts when scraping fails
- **Chord Highlighting**: Automatic chord detection and styling
- **Save Locally**: Offline storage of favorite songs

### 🎵 Musical Features
- **Real-time Transposition**: Up/down by semitone with ♯/♭ buttons
- **Key Detection**: Automatically detects and displays song key
- **Chord Diagrams**: Click any chord to see fingering (modal)
- **Chord Alternatives**: Suggests easier chord variations

### 📱 UX Features
- **Floating Controls**: Right-side controls that scroll with page
- **Auto-scroll**: Variable speed scrolling for hands-free playing
- **Light/Dark Mode**: Theme toggle with persistent preference
- **Network Sharing**: Local network access for WiFi sharing
- **Keyboard Shortcuts**: Space for auto-scroll, arrow keys for speed

### ⚡ Performance Features
- **Cache-busting**: Prevents browser caching of search results
- **Fallback Mode**: Works without backend service
- **Instant Loading**: No external dependencies
- **Mobile Optimized**: Touch-friendly floating controls

## Technical Implementation Details

### Theme System
- **CSS Variables**: Complete theming via custom properties
- **Dark Mode (default)**: `--bg-primary: #000`, gold chords
- **Light Mode**: `--bg-primary: #fff`, blue chords  
- **Toggle**: 🌙/☀️ button in header, saves to localStorage

### Floating Controls (Key Innovation)
- **Position**: Fixed right side, vertically centered
- **Groups**: Transpose, Auto-scroll/Save, Scroll-to-top
- **Mobile-first**: Responsive sizing, touch-friendly
- **Auto-hide**: Only visible when viewing songs

### Auto-scroll Engine
- **Smart Pause**: Click anywhere to pause/resume
- **Speed Control**: Arrow keys or buttons
- **Keyboard**: Spacebar toggle, Escape to stop
- **End Detection**: Auto-stops at bottom of content

### Search & Scraping
- **Ultimate Guitar**: Uses mobile API for better reliability
- **Chord Filtering**: `TabTypeChords` only, excludes tabs/bass/drums
- **Content Cleaning**: Removes `[tab]`, `[ch]`, etc. markup
- **Rating Display**: Shows ★ ratings and version info
- **Cache Prevention**: Headers to prevent stale results

### Backend Service
- **Port**: Runs on :8080 (configurable)
- **Endpoints**: `/health`, `/search?q=`, `/tab/{id}`, `/popular`
- **CORS**: Enabled for cross-origin requests
- **Network Access**: Detects local IP for WiFi sharing

## Development Workflow

### Starting the App
```bash
./start.sh  # Builds Go service, starts both frontend and backend
```

### Backend Only
```bash
cd scraper-service && ./setup.sh && ./capo-scraper
```

### Testing
- **Integration Test**: `/test-integration.html`
- **Health Check**: `curl http://localhost:8080/health`
- **Search Test**: `curl "http://localhost:8080/search?q=wonderwall"`

### Building
- **Frontend**: Static files, no build step needed
- **Backend**: `go build -o capo-scraper main.go`
- **Git Submodule**: `git submodule update --init --recursive`

## Common Tasks

### Adding New Features
1. **UI Changes**: Update `index.html` and `styles.css`
2. **Logic**: Add to appropriate JS module (`app.js`, `chords.js`, etc.)
3. **Theming**: Use CSS variables for colors
4. **Mobile**: Test on floating controls and responsive layout

### Fixing Search Issues
1. **Cache Problems**: Check cache-busting headers in `scraper-client.js`
2. **Backend Issues**: Check Go service logs and `/health` endpoint
3. **Content Problems**: Update content cleaning in `main.go`

### UI/UX Improvements
1. **Floating Controls**: Modify `.floating-controls` CSS
2. **Theme**: Update CSS variables in `:root` and `[data-theme="light"]`
3. **Mobile**: Check responsive breakpoints at 768px and 480px

## Code Patterns

### Error Handling
```javascript
try {
    const results = await this.scraper.searchSongs(query);
    // Handle success
} catch (error) {
    console.error('Search failed:', error);
    // Show fallback UI
}
```

### Theme-aware Styling
```css
.element {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
}
```

### Chord Processing
```javascript
// Highlight chords in text
const processedContent = ChordParser.highlightChords(songData.content);
// Transpose chords
const transposed = this.transposer.transposeText(content, semitones);
```

## Important Notes

### Legal Considerations
- **Educational use only**: Comprehensive disclaimer in README
- **Respects terms of service**: Rate limiting and caching
- **No redistribution**: Content not stored or redistributed

### Performance Considerations
- **Cache-busting**: Essential for search functionality
- **Mobile-first**: Floating controls designed for touch
- **Network sharing**: Local IP detection for WiFi access

### Git Workflow
- **Submodules**: Ultimate Guitar scraper is a git submodule
- **Binaries**: `capo-scraper` binary in .gitignore
- **Clean commits**: Descriptive messages without co-authorship

## Dependencies

### Frontend
- **None**: Pure vanilla JavaScript, HTML, CSS
- **PWA**: Uses standard Service Worker APIs

### Backend  
- **Go 1.21+**: Required for building
- **Gorilla Mux**: HTTP routing (`github.com/gorilla/mux`)
- **Ultimate Guitar Scraper**: Git submodule for API access

### External Services
- **Ultimate Guitar**: Mobile API for chord chart data
- **No other external dependencies**

## Quick Debugging

### Search Not Working
1. Check backend: `curl http://localhost:8080/health`
2. Check cache headers in `scraper-client.js`
3. Verify Ultimate Guitar scraper submodule

### UI Issues
1. Check CSS variables for theming
2. Test both light and dark modes
3. Verify floating controls on mobile

### Auto-scroll Problems
1. Check `scroll.js` event bindings
2. Verify floating controls integration
3. Test keyboard shortcuts (Space, arrows, Escape)

This context should give future Claude Code sessions everything needed to work effectively on the Capo project!