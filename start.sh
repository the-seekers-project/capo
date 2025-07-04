#!/bin/bash

# Capo - Guitar Tab Scraper Startup Script
# This script starts both the backend scraper service and opens the frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEFAULT_BACKEND_PORT=8080
DEFAULT_FRONTEND_PORT=8000
BACKEND_DIR="scraper-service"
FRONTEND_FILE="index.html"
BACKEND_BINARY="capo-scraper"

# Global variables
BACKEND_PORT=$DEFAULT_BACKEND_PORT
FRONTEND_PORT=$DEFAULT_FRONTEND_PORT
BACKEND_PID=""
FRONTEND_PID=""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[CAPO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to find next available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    
    while [ $port -le 65535 ]; do
        if ! check_port $port; then
            echo $port
            return
        fi
        port=$((port + 1))
    done
    
    echo ""
}

# Function to kill process by PID
kill_process() {
    local pid=$1
    if [ -n "$pid" ] && kill -0 $pid 2>/dev/null; then
        print_status "Stopping process $pid..."
        kill $pid 2>/dev/null || true
        sleep 1
        if kill -0 $pid 2>/dev/null; then
            kill -9 $pid 2>/dev/null || true
        fi
    fi
}

# Function to cleanup on exit
cleanup() {
    print_status "Cleaning up..."
    
    # Stop backend
    if [ -n "$BACKEND_PID" ]; then
        kill_process $BACKEND_PID
    fi
    
    # Stop frontend (if we started a server)
    if [ -n "$FRONTEND_PID" ]; then
        kill_process $FRONTEND_PID
    fi
    
    # Kill any remaining capo-scraper processes
    pkill -f "$BACKEND_BINARY" 2>/dev/null || true
    
    print_status "Cleanup complete"
}

# Set up signal handlers
trap cleanup EXIT INT TERM

# Function to build backend
build_backend() {
    print_status "Building backend..."
    
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Backend directory '$BACKEND_DIR' not found!"
        exit 1
    fi
    
    cd "$BACKEND_DIR"
    
    # Check if Go is installed
    if ! command -v go &> /dev/null; then
        print_error "Go is not installed. Please install Go to build the backend."
        exit 1
    fi
    
    # Build the backend
    if go build -o "$BACKEND_BINARY" 2>/dev/null; then
        print_success "Backend built successfully"
    else
        print_error "Failed to build backend"
        exit 1
    fi
    
    cd ..
}

# Function to start backend
start_backend() {
    print_status "Starting backend on port $BACKEND_PORT..."
    
    # Check if port is available
    if check_port $BACKEND_PORT; then
        print_warning "Port $BACKEND_PORT is already in use"
        new_port=$(find_available_port $((BACKEND_PORT + 1)))
        
        if [ -n "$new_port" ]; then
            BACKEND_PORT=$new_port
            print_status "Using port $BACKEND_PORT instead"
        else
            print_error "Could not find available port for backend"
            exit 1
        fi
    fi
    
    # Start backend
    cd "$BACKEND_DIR"
    PORT=$BACKEND_PORT ./"$BACKEND_BINARY" &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    print_status "Waiting for backend to start..."
    for i in {1..30}; do
        if curl -s http://localhost:$BACKEND_PORT/health >/dev/null 2>&1; then
            print_success "Backend started successfully on port $BACKEND_PORT"
            return 0
        fi
        sleep 1
    done
    
    print_error "Backend failed to start"
    return 1
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend..."
    
    if [ ! -f "$FRONTEND_FILE" ]; then
        print_error "Frontend file '$FRONTEND_FILE' not found!"
        exit 1
    fi
    
    # Update frontend to use correct backend port if needed
    if [ $BACKEND_PORT -ne $DEFAULT_BACKEND_PORT ]; then
        print_status "Updating frontend to use backend port $BACKEND_PORT..."
        
        # Check if we need to update the scraper client
        if [ -f "js/scraper-client.js" ]; then
            # Create a backup
            cp js/scraper-client.js js/scraper-client.js.backup
            
            # Update the port in the scraper client
            sed -i.tmp "s/localhost:$DEFAULT_BACKEND_PORT/localhost:$BACKEND_PORT/g" js/scraper-client.js
            rm js/scraper-client.js.tmp 2>/dev/null || true
            
            print_status "Updated scraper client to use port $BACKEND_PORT"
        fi
    fi
    
    # Try to start a simple HTTP server for better CORS handling
    if command -v python3 &> /dev/null; then
        # Find available port for frontend
        if check_port $FRONTEND_PORT; then
            new_port=$(find_available_port $((FRONTEND_PORT + 1)))
            if [ -n "$new_port" ]; then
                FRONTEND_PORT=$new_port
                print_status "Using port $FRONTEND_PORT for frontend"
            fi
        fi
        
        print_status "Starting HTTP server on port $FRONTEND_PORT..."
        python3 -m http.server $FRONTEND_PORT &
        FRONTEND_PID=$!
        
        # Wait a moment for server to start
        sleep 2
        
        # Open in browser
        if command -v open &> /dev/null; then
            open "http://localhost:$FRONTEND_PORT"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:$FRONTEND_PORT"
        else
            print_status "Please open http://localhost:$FRONTEND_PORT in your browser"
        fi
        
        print_success "Frontend server started on http://localhost:$FRONTEND_PORT"
    else
        # Fallback: just open the file directly
        print_warning "Python3 not found, opening file directly"
        if command -v open &> /dev/null; then
            open "$FRONTEND_FILE"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "$FRONTEND_FILE"
        else
            print_status "Please open $FRONTEND_FILE in your browser"
        fi
    fi
}

# Function to get local network IP
get_local_ip() {
    # Try different methods to get local IP
    local ip=""
    
    # Method 1: Use route command (works on most Unix systems)
    if command -v route &> /dev/null; then
        ip=$(route -n get default 2>/dev/null | grep interface | awk '{print $2}' | head -1)
        if [ -n "$ip" ]; then
            ip=$(ifconfig "$ip" 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -1)
        fi
    fi
    
    # Method 2: Use ip command (Linux)
    if [ -z "$ip" ] && command -v ip &> /dev/null; then
        ip=$(ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K\S+' | head -1)
    fi
    
    # Method 3: Use ifconfig directly (fallback)
    if [ -z "$ip" ] && command -v ifconfig &> /dev/null; then
        ip=$(ifconfig 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | grep -v '169.254' | awk '{print $2}' | head -1)
    fi
    
    # Method 4: Use hostname command (macOS/BSD)
    if [ -z "$ip" ] && command -v hostname &> /dev/null; then
        ip=$(hostname -I 2>/dev/null | awk '{print $1}')
    fi
    
    echo "$ip"
}

# Function to show status
show_status() {
    local local_ip=$(get_local_ip)
    
    echo ""
    print_success "🎸 Capo is now running!"
    echo ""
    echo "Backend (Scraper Service):"
    echo "  Local:  http://localhost:$BACKEND_PORT"
    if [ -n "$local_ip" ]; then
        echo "  Network: http://$local_ip:$BACKEND_PORT"
    fi
    echo "  Health: http://localhost:$BACKEND_PORT/health"
    echo ""
    
    if [ -n "$FRONTEND_PID" ]; then
        echo "Frontend (Web App):"
        echo "  Local:   http://localhost:$FRONTEND_PORT"
        if [ -n "$local_ip" ]; then
            echo "  Network: http://$local_ip:$FRONTEND_PORT"
        fi
        echo ""
    fi
    
    if [ -n "$local_ip" ]; then
        echo "📱 Share with others on your WiFi:"
        echo "   Open http://$local_ip:$FRONTEND_PORT on any device"
        echo ""
    fi
    
    echo "Press Ctrl+C to stop all services"
    echo ""
}

# Function to run troubleshooting
troubleshoot() {
    print_status "Running troubleshooting checks..."
    
    # Check Go installation
    if command -v go &> /dev/null; then
        print_success "Go is installed: $(go version)"
    else
        print_error "Go is not installed"
    fi
    
    # Check if backend binary exists
    if [ -f "$BACKEND_DIR/$BACKEND_BINARY" ]; then
        print_success "Backend binary exists"
    else
        print_warning "Backend binary not found, will build"
    fi
    
    # Check if frontend file exists
    if [ -f "$FRONTEND_FILE" ]; then
        print_success "Frontend file exists"
    else
        print_error "Frontend file not found"
    fi
    
    # Check for port conflicts
    if check_port $DEFAULT_BACKEND_PORT; then
        print_warning "Default backend port $DEFAULT_BACKEND_PORT is in use"
    else
        print_success "Default backend port $DEFAULT_BACKEND_PORT is available"
    fi
    
    if check_port $DEFAULT_FRONTEND_PORT; then
        print_warning "Default frontend port $DEFAULT_FRONTEND_PORT is in use"
    else
        print_success "Default frontend port $DEFAULT_FRONTEND_PORT is available"
    fi
    
    echo ""
}

# Main function
main() {
    echo "🎸 Capo - Guitar Tab Scraper"
    echo "================================"
    echo ""
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --backend-port)
                BACKEND_PORT="$2"
                shift 2
                ;;
            --frontend-port)
                FRONTEND_PORT="$2"
                shift 2
                ;;
            --troubleshoot)
                troubleshoot
                exit 0
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "OPTIONS:"
                echo "  --backend-port PORT    Set backend port (default: 8080)"
                echo "  --frontend-port PORT   Set frontend port (default: 8000)"
                echo "  --troubleshoot         Run troubleshooting checks"
                echo "  --help                 Show this help message"
                echo ""
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run initial troubleshooting
    troubleshoot
    
    # Build backend
    build_backend
    
    # Start backend
    if ! start_backend; then
        print_error "Failed to start backend"
        exit 1
    fi
    
    # Start frontend
    start_frontend
    
    # Show status
    show_status
    
    # Wait for user to stop
    wait
}

# Run main function
main "$@"