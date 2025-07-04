package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/Pilfer/ultimate-guitar-scraper/pkg/ultimateguitar"
)

type SearchRequest struct {
	Query string `json:"query"`
}

type SearchResult struct {
	ID      int     `json:"id"`
	Title   string  `json:"title"`
	Artist  string  `json:"artist"`
	Type    string  `json:"type"`
	URL     string  `json:"url"`
	Source  string  `json:"source"`
	Rating  float64 `json:"rating"`
	Version int     `json:"version"`
	Votes   int     `json:"votes"`
}

type TabResult struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Artist  string `json:"artist"`
	Content string `json:"content"`
	Type    string `json:"type"`
	Source  string `json:"source"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

// In-memory cache for demo purposes
var cache = make(map[string]interface{})
var cacheExpiry = make(map[string]time.Time)

// Initialize Ultimate Guitar scraper
var scraper ultimateguitar.Scraper

func main() {
	// Initialize scraper
	scraper = ultimateguitar.New()
	
	r := mux.NewRouter()
	
	// Health check endpoint
	r.HandleFunc("/health", healthHandler).Methods("GET")
	
	// Search endpoint
	r.HandleFunc("/search", searchHandler).Methods("GET")
	
	// Get tab by ID
	r.HandleFunc("/tab/{id}", getTabHandler).Methods("GET")
	
	// Popular tabs
	r.HandleFunc("/popular", popularHandler).Methods("GET")

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(r)

	// Allow port configuration via environment variable
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	port = ":" + port

	fmt.Printf("🎸 Capo Scraper Service starting on port %s\n", port)
	fmt.Println("Endpoints:")
	fmt.Println("  GET /health - Health check")
	fmt.Println("  GET /search?q=song+artist - Search for tabs")
	fmt.Println("  GET /tab/{id} - Get tab content by ID")
	fmt.Println("  GET /popular - Get popular tabs")
	
	log.Fatal(http.ListenAndServe(port, handler))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
		"service": "capo-scraper",
		"version": "1.0.0",
	})
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")
	
	query := r.URL.Query().Get("q")
	if query == "" {
		writeError(w, "Missing query parameter 'q'", http.StatusBadRequest)
		return
	}

	// Check cache first
	cacheKey := "search:" + query
	if cached, exists := getFromCache(cacheKey); exists {
		json.NewEncoder(w).Encode(cached)
		return
	}

	// Search using Ultimate Guitar scraper - only chord charts for MVP
	searchParams := ultimateguitar.SearchParams{
		Title: query,
		Type:  []ultimateguitar.TabType{ultimateguitar.TabTypeChords},
		Page:  1,
	}

	ugResults, err := scraper.Search(searchParams)
	if err != nil {
		log.Printf("Error searching tabs: %v", err)
		// Return empty results instead of error to allow app to continue
		results := []SearchResult{}
		setCache(cacheKey, results, time.Hour)
		json.NewEncoder(w).Encode(results)
		return
	}

	// Convert Ultimate Guitar results to our format - filter for chord charts only
	var results []SearchResult
	for _, tab := range ugResults.Tabs {
		// Only include chord charts for MVP
		if isChordChart(tab.Type) {
			results = append(results, SearchResult{
				ID:      int(tab.ID),
				Title:   tab.SongName,
				Artist:  string(tab.ArtistName),
				Type:    "Chords",
				URL:     fmt.Sprintf("https://tabs.ultimate-guitar.com/tab/%s", tab.SongName),
				Source:  "Ultimate Guitar",
				Rating:  tab.Rating,
				Version: int(tab.Version),
				Votes:   int(tab.Votes),
			})
		}
	}

	// Cache results for 1 hour
	setCache(cacheKey, results, time.Hour)
	
	json.NewEncoder(w).Encode(results)
}

func getTabHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	vars := mux.Vars(r)
	idStr := vars["id"]
	
	id, err := strconv.Atoi(idStr)
	if err != nil {
		writeError(w, "Invalid tab ID", http.StatusBadRequest)
		return
	}

	// Check cache first
	cacheKey := "tab:" + idStr
	if cached, exists := getFromCache(cacheKey); exists {
		json.NewEncoder(w).Encode(cached)
		return
	}

	// Fetch tab using Ultimate Guitar scraper
	ugTab, err := scraper.GetTabByID(int64(id))
	if err != nil {
		log.Printf("Error fetching tab %d: %v", id, err)
		// Return a basic tab result instead of error
		result := TabResult{
			ID:      id,
			Title:   "Tab not found",
			Artist:  "Unknown",
			Type:    "Chords",
			Source:  "Ultimate Guitar",
			Content: "Tab content could not be loaded. Please try again later.",
		}
		setCache(cacheKey, result, 24*time.Hour)
		json.NewEncoder(w).Encode(result)
		return
	}

	// Convert Ultimate Guitar tab to our format
	result := TabResult{
		ID:      int(ugTab.ID),
		Title:   ugTab.SongName,
		Artist:  ugTab.ArtistName,
		Type:    ugTab.Type,
		Source:  "Ultimate Guitar",
		Content: cleanChordContent(ugTab.Content),
	}

	// Cache result for 24 hours
	setCache(cacheKey, result, 24*time.Hour)
	
	json.NewEncoder(w).Encode(result)
}

func popularHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Check cache first
	cacheKey := "popular"
	if cached, exists := getFromCache(cacheKey); exists {
		json.NewEncoder(w).Encode(cached)
		return
	}

	// Get popular chord charts using Ultimate Guitar scraper - only chords for MVP
	exploreParams := ultimateguitar.ExploreParameters{
		Type:  []ultimateguitar.TabType{ultimateguitar.TabTypeChords},
		Order: ultimateguitar.ExploreOrderTodaysMostPopular,
		Page:  1,
	}

	ugResults, err := scraper.Explore(exploreParams)
	if err != nil {
		log.Printf("Error exploring tabs: %v", err)
		// Return empty results instead of error to allow app to continue
		results := []SearchResult{}
		setCache(cacheKey, results, 6*time.Hour)
		json.NewEncoder(w).Encode(results)
		return
	}

	// Convert Ultimate Guitar results to our format - filter for chord charts only
	var results []SearchResult
	for _, tab := range ugResults {
		// Only include chord charts for MVP
		if isChordChart(tab.Type) {
			results = append(results, SearchResult{
				ID:      int(tab.ID),
				Title:   tab.SongName,
				Artist:  tab.ArtistName,
				Type:    "Chords",
				URL:     fmt.Sprintf("https://tabs.ultimate-guitar.com/tab/%s", tab.SongName),
				Source:  "Ultimate Guitar",
				Rating:  tab.Rating,
				Version: int(tab.Version),
				Votes:   int(tab.Votes),
			})
		}
	}

	// Cache for 6 hours
	setCache(cacheKey, results, 6*time.Hour)
	
	json.NewEncoder(w).Encode(results)
}

func writeError(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{
		Error:   "API Error",
		Message: message,
	})
}

func getFromCache(key string) (interface{}, bool) {
	if expiry, exists := cacheExpiry[key]; exists {
		if time.Now().Before(expiry) {
			if data, exists := cache[key]; exists {
				return data, true
			}
		} else {
			// Clean up expired cache
			delete(cache, key)
			delete(cacheExpiry, key)
		}
	}
	return nil, false
}

func setCache(key string, data interface{}, duration time.Duration) {
	cache[key] = data
	cacheExpiry[key] = time.Now().Add(duration)
}

// Helper function to check if a tab type is a chord chart
func isChordChart(ugType ultimateguitar.Type) bool {
	switch ugType {
	case "Chords":
		return true
	default:
		return false
	}
}

// Helper function to clean Ultimate Guitar markup tags from content
func cleanChordContent(content string) string {
	if content == "" {
		return content
	}
	
	// Remove Ultimate Guitar markup tags
	content = regexp.MustCompile(`\[tab\]`).ReplaceAllString(content, "")
	content = regexp.MustCompile(`\[/tab\]`).ReplaceAllString(content, "")
	content = regexp.MustCompile(`\[ch\]`).ReplaceAllString(content, "")
	content = regexp.MustCompile(`\[/ch\]`).ReplaceAllString(content, "")
	
	// Clean up other common markup
	content = regexp.MustCompile(`\[verse\]`).ReplaceAllString(content, "[Verse]")
	content = regexp.MustCompile(`\[/verse\]`).ReplaceAllString(content, "")
	content = regexp.MustCompile(`\[chorus\]`).ReplaceAllString(content, "[Chorus]")
	content = regexp.MustCompile(`\[/chorus\]`).ReplaceAllString(content, "")
	content = regexp.MustCompile(`\[bridge\]`).ReplaceAllString(content, "[Bridge]")
	content = regexp.MustCompile(`\[/bridge\]`).ReplaceAllString(content, "")
	
	// Clean up excessive whitespace
	content = regexp.MustCompile(`\r\n`).ReplaceAllString(content, "\n")
	content = regexp.MustCompile(`\r`).ReplaceAllString(content, "\n")
	content = regexp.MustCompile(`\n{3,}`).ReplaceAllString(content, "\n\n")
	
	// Trim whitespace from lines
	lines := strings.Split(content, "\n")
	var cleanedLines []string
	for _, line := range lines {
		cleanedLines = append(cleanedLines, strings.TrimSpace(line))
	}
	
	return strings.TrimSpace(strings.Join(cleanedLines, "\n"))
}

// Helper function to map Ultimate Guitar tab types to our format
func mapTabType(ugType ultimateguitar.Type) string {
	switch ugType {
	case "Chords":
		return "Chords"
	case "Tab":
		return "Tabs"
	case "Bass":
		return "Bass"
	case "Drums":
		return "Drums"
	case "Ukulele":
		return "Ukulele"
	default:
		return "Chords"
	}
}