#!/bin/bash

# ACCUST System Startup Script
# Secure startup for both backend and frontend

echo "🔒 Starting ACCUST Management System..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}🛡️  Starting Backend Server...${NC}"
    
    # Check if backend port is available
    if check_port 3001; then
        echo -e "${YELLOW}⚠️  Port 3001 is already in use. Attempting to kill existing process...${NC}"
        lsof -ti:3001 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    # Navigate to backend directory and start server
    cd backend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
        npm install
    fi
    
    # Start backend server in background
    echo -e "${GREEN}🚀 Launching backend server on port 3001...${NC}"
    NODE_ENV=production npm start &
    BACKEND_PID=$!
    
    # Wait for backend to start
    echo -e "${BLUE}⏳ Waiting for backend to initialize...${NC}"
    sleep 8
    
    # Check if backend is running
    if check_port 3001; then
        echo -e "${GREEN}✅ Backend server started successfully!${NC}"
        echo -e "${GREEN}   Backend API: http://localhost:3001/api${NC}"
        echo -e "${GREEN}   Health Check: http://localhost:3001/health${NC}"
    else
        echo -e "${RED}❌ Failed to start backend server!${NC}"
        exit 1
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}🖥️  Starting Frontend Application...${NC}"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Start Electron application
    echo -e "${GREEN}🚀 Launching Electron application...${NC}"
    npm start
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down ACCUST system...${NC}"
    
    # Kill backend process if it exists
    if [ ! -z "$BACKEND_PID" ]; then
        echo -e "${BLUE}   Stopping backend server...${NC}"
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    # Kill any remaining processes on ports
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    echo -e "${GREEN}✅ System shutdown complete.${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Main execution
echo -e "${GREEN}🔐 Terrorism Analysis & Response Information System${NC}"
echo -e "${BLUE}   Ultra-Secure Law Enforcement Database${NC}"
echo -e "${YELLOW}   Version: 2.1.0${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the ATS project root directory${NC}"
    exit 1
fi

# Start backend first
start_backend

# Wait a moment for backend to fully initialize
sleep 3

# Start frontend
start_frontend

# Keep script running
echo -e "${BLUE}💼 ACCUST system is running...${NC}"
echo -e "${YELLOW}   Press Ctrl+C to stop the system${NC}"
wait