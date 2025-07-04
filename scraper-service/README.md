# Capo Scraper Service

A Go-based HTTP service that provides chord chart data for the Capo application by interfacing with Ultimate Guitar's mobile API.

## Features

- 🎸 **Search** - Find chord charts by song and artist
- 📊 **Popular** - Get trending chord charts
- 🔍 **Fetch** - Retrieve full chord chart content
- 💾 **Caching** - In-memory caching for better performance
- 🌐 **CORS** - Cross-origin support for web applications
- 🏥 **Health Check** - Service monitoring endpoint

## Quick Start

1. **Setup the service:**
   ```bash
   ./setup.sh
   ```

2. **Start the service:**
   ```bash
   ./capo-scraper
   ```

3. **Test the service:**
   ```bash
   curl http://localhost:8080/health
   curl http://localhost:8080/search?q=wonderwall
   ```

## API Endpoints

### Health Check
```
GET /health
```
Returns service status and version information.

### Search
```
GET /search?q={query}
```
Search for chord charts. The query can include song name, artist, or both.

**Example:**
```bash
curl "http://localhost:8080/search?q=wonderwall+oasis"
```

### Get Tab
```
GET /tab/{id}
```
Fetch full chord chart content by tab ID.

**Example:**
```bash
curl http://localhost:8080/tab/123456
```

### Popular
```
GET /popular
```
Get currently popular chord charts.

**Example:**
```bash
curl http://localhost:8080/popular
```

## Response Format

### Search Results
```json
[
  {
    "id": 123456,
    "title": "Wonderwall",
    "artist": "Oasis",
    "type": "Chords",
    "url": "https://tabs.ultimate-guitar.com/tab/oasis/wonderwall-chords-123456",
    "source": "Ultimate Guitar"
  }
]
```

### Tab Content
```json
{
  "id": 123456,
  "title": "Wonderwall",
  "artist": "Oasis",
  "content": "[Verse 1]\nEm7       G           D           C\nToday is gonna be the day...",
  "type": "Chords",
  "source": "Ultimate Guitar"
}
```

## Development

### Prerequisites
- Go 1.21 or later
- Git (for cloning dependencies)

### Building
```bash
go build -o capo-scraper main.go
```

### Running
```bash
./capo-scraper
```

The service will start on `http://localhost:8080`

## Configuration

The service uses the following defaults:
- **Port:** 8080
- **Cache Duration:** 1 hour (search), 24 hours (tabs), 6 hours (popular)
- **CORS:** Enabled for all origins (development mode)

## Integration

The service is designed to work with the Capo web application. Update your JavaScript code to use the `ScraperClient` class:

```javascript
const scraper = new ScraperClient();
const results = await scraper.searchSongs('wonderwall');
```

## Notes

- This service is for educational and personal use only
- Respects Ultimate Guitar's terms of service
- Includes caching to minimize API requests
- Currently returns mock data - integration with actual scraper pending

## Next Steps

1. ✅ Basic HTTP service setup
2. ⏳ Integrate with ultimate-guitar-scraper library
3. ⏳ Add Redis caching for production
4. ⏳ Add rate limiting
5. ⏳ Add Docker support
6. ⏳ Add monitoring and logging