#!/bin/bash

echo "🎸 Setting up Capo Scraper Service..."

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go first:"
    echo "   https://golang.org/doc/install"
    exit 1
fi

echo "✅ Go is installed"

# Clone the ultimate-guitar-scraper repository
if [ ! -d "ultimate-guitar-scraper" ]; then
    echo "📦 Cloning ultimate-guitar-scraper..."
    git clone https://github.com/Pilfer/ultimate-guitar-scraper.git
    if [ $? -ne 0 ]; then
        echo "❌ Failed to clone ultimate-guitar-scraper"
        exit 1
    fi
    echo "✅ Cloned ultimate-guitar-scraper"
else
    echo "✅ ultimate-guitar-scraper already exists"
fi

# Download dependencies
echo "📥 Downloading Go dependencies..."
go mod tidy
if [ $? -ne 0 ]; then
    echo "❌ Failed to download dependencies"
    exit 1
fi

echo "✅ Dependencies downloaded"

# Build the service
echo "🔨 Building scraper service..."
go build -o capo-scraper main.go
if [ $? -ne 0 ]; then
    echo "❌ Failed to build service"
    exit 1
fi

echo "✅ Service built successfully"
echo ""
echo "🚀 To start the service:"
echo "   ./capo-scraper"
echo ""
echo "🧪 To test the service:"
echo "   curl http://localhost:8080/health"
echo "   curl http://localhost:8080/search?q=wonderwall"
echo ""