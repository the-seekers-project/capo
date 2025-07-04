# Capo - Musician-First Chord App

A free, fast, and frictionless chord app that eliminates the barriers between finding a song and playing it.

## Features

- **🎸 Advanced Scraping**: Microservice architecture with Go backend using Ultimate Guitar's mobile API
- **🔍 Smart Search**: Reliable song search with caching and fallback mechanisms
- **✍️ Manual Input**: Paste or type chord charts directly when scraping fails
- **🎵 Smart Transposition**: One-tap transpose up/down by semitone with real-time key detection
- **🎯 Chord Help**: Tap any chord to see fingering diagrams and easier alternatives
- **📜 Auto-Scroll**: Variable speed scrolling with spacebar control for hands-free playing
- **💾 Offline Support**: Save songs locally, works completely offline once saved
- **📱 Responsive Design**: Optimized for everything from iPhone mini to desktop monitors
- **⚡ Zero Friction**: No accounts, no popups, no interruptions

## Quick Start

### Prerequisites

- Go 1.21+ (for scraper service)
- Python 3 (optional, for HTTP server)

### Installation & Running

**🚀 One-Command Start** (Recommended):
```bash
git clone <repository-url>
cd capo
./start.sh
```

This single command will:
- Build the Go scraper service
- Start the backend on an available port
- Start the frontend web server  
- Open your browser automatically
- Handle port conflicts automatically

### Manual Setup

If you prefer to run components separately:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd capo
   ```

2. **Start the scraper service:**
   ```bash
   cd scraper-service
   go build -o capo-scraper
   ./capo-scraper
   ```

3. **Start the web app** (in a new terminal):
   ```bash
   cd ..
   python3 -m http.server 8000
   ```

4. **Open your browser** to `http://localhost:8000`

### Startup Script Options

The `start.sh` script supports several options:

```bash
./start.sh                    # Start with default ports
./start.sh --help             # Show all options
./start.sh --troubleshoot     # Run diagnostics only
./start.sh --backend-port 8081 --frontend-port 8001  # Custom ports
```

**Available Options:**
- `--backend-port PORT` - Set backend port (default: 8080)
- `--frontend-port PORT` - Set frontend port (default: 8000)  
- `--troubleshoot` - Run troubleshooting checks and exit
- `--help` - Show help message

The script automatically:
- Detects and resolves port conflicts
- Builds the Go backend service
- Updates frontend to use correct backend port
- Opens your browser to the app
- Provides colored status output
- Handles cleanup on exit (Ctrl+C)

## How to Use

### Finding Songs

1. **Search**: Click the 🔍 button or "Find a Song"
2. **Type song name** (e.g., "Wonderwall Oasis")
3. **Click a result** to load the chord chart
4. **If search fails**: Use "Enter Chord Chart Manually" or paste a URL

### Playing Songs

- **Transpose**: Use ♯/♭ buttons to change key
- **Chord Help**: Tap any yellow chord to see fingering diagram
- **Auto-Scroll**: Press ▶ or spacebar to start scrolling
- **Speed Control**: Use +/- buttons or arrow keys while scrolling
- **Pause**: Tap anywhere or press spacebar again
- **Save**: Click 💾 to save for offline use

### Keyboard Shortcuts

- **Spacebar**: Start/stop auto-scroll
- **Arrow Up/Down**: Adjust scroll speed (while scrolling)
- **/** (slash): Open search
- **Escape**: Close overlays/modals
- **Ctrl/Cmd + S**: Save current song

## Manual Chord Chart Format

When entering charts manually, use this format:

```
Verse:
C        Am       F        G
Amazing grace how sweet the sound
C        Am       F    G    C
That saved a wretch like me

Chorus:
F        C        Am       G
I once was lost but now am found
F        C        G        C
Was blind but now I see
```

**Tips:**
- Put chords on lines above lyrics
- Use standard chord notation (C, Am, F7, Gsus4, etc.)
- Leave blank lines between sections
- Add section labels (Verse:, Chorus:, Bridge:)

## Supported Chord Sites

- Ultimate Guitar (primary)
- Any site with plain text chord charts
- Direct URL import from most chord sites

## Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Offline**: Works as a Progressive Web App (PWA)

## Troubleshooting

### Quick Diagnostics
Run the built-in troubleshooting tool:
```bash
./start.sh --troubleshoot
```

This will check:
- Go installation
- Backend binary status
- Frontend file availability  
- Port availability

### Common Issues

**🔧 Service Not Starting**
- **Missing Go**: Install Go 1.21+ (`go version` to check)
- **Port conflicts**: Script automatically finds available ports
- **Permission errors**: Make sure `start.sh` is executable (`chmod +x start.sh`)

**🔍 Search Not Working**  
- **Backend offline**: Check if `./start.sh` shows backend as running
- **Port mismatch**: Frontend auto-detects backend port, but check browser console
- **No results**: Try different search terms or use "Enter Manually"

**⚙️ Custom Ports**
```bash
./start.sh --backend-port 8081 --frontend-port 8001
```

**🚪 Port Conflicts**
- Script automatically handles port conflicts
- To manually check ports: `lsof -i :8080` 
- To kill processes: `pkill -f capo-scraper`

### Legacy Scraping Issues (fallback)
- **Failed to load**: Copy/paste the chord chart manually
- **Malformed content**: Edit the chart after loading
- **Missing chords**: The parser looks for standard chord notation

### Mobile Issues
- **Small text**: Chord charts adapt to screen size automatically
- **Touch problems**: All buttons are 44px minimum for easy tapping
- **Auto-scroll too fast**: Use the speed controls to slow down

## File Structure

```
capo/
├── start.sh               # 🚀 One-command startup script
├── index.html             # Main app interface
├── styles.css             # All styling (responsive, dark theme)
├── manifest.json          # PWA configuration
├── sw.js                 # Service worker for offline support
├── test-integration.html  # Integration test page
├── js/
│   ├── app.js            # Main application logic
│   ├── chords.js         # Chord parsing and diagram data
│   ├── transpose.js      # Transposition and key detection
│   ├── storage.js        # LocalStorage management
│   ├── scroll.js         # Auto-scroll functionality
│   ├── scraper.js        # Legacy web scraping (fallback)
│   └── scraper-client.js # API client for Go service
└── scraper-service/       # Go microservice for chord scraping
    ├── main.go           # HTTP API server with Ultimate Guitar integration
    ├── go.mod            # Go dependencies
    ├── setup.sh          # Service setup script
    ├── README.md         # Service documentation
    ├── capo-scraper      # Compiled service binary
    └── ultimate-guitar-scraper/ # Ultimate Guitar API library
```

## Development

### Adding New Chord Sites

1. **Edit `js/scraper.js`**
2. **Add new parser** in `parseGenericChart()` method
3. **Test with various URLs** from the site

### Adding Chord Diagrams

1. **Edit `js/chords.js`**
2. **Add to `CHORD_DIAGRAMS`** object
3. **Use ASCII art format** for consistency

### Customizing Appearance

1. **Edit `styles.css`**
2. **Modify CSS variables** at the top for colors
3. **Test on mobile** - all changes should be responsive

## Technical Notes

- **Microservice Architecture** - Go backend service handles scraping, JavaScript frontend handles UI
- **API-First Design** - RESTful API with JSON responses and built-in caching
- **Fallback Support** - Legacy scraping methods available if service is unavailable
- **LocalStorage** provides offline functionality
- **Service Worker** caches the app for offline use
- **Vanilla JavaScript** - no frameworks, fast loading
- **Cross-Origin Handling** - CORS-enabled API service eliminates browser restrictions

## License

MIT License - use freely for any purpose.

## Contributing

This is an MVP focused on core functionality. Key areas for improvement:

1. **More chord sites** - Add parsers for additional sources
2. **Better chord diagrams** - More chords and visual improvements  
3. **Advanced features** - Capo suggestions, chord progression analysis
4. **Performance** - Faster scraping, better caching

---

**Built for musicians, by a musician. No friction, just music.**