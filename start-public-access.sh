#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e " SMP PLUS AT-THAHIRIN - Public Access"
echo -e "========================================${NC}"
echo

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}[ERROR] Ngrok not found!${NC}"
    echo "Please install ngrok first:"
    echo "1. Download from https://ngrok.com/download"
    echo "2. Or run: npm install -g ngrok"
    echo "3. Get authtoken from ngrok.com and run: ngrok authtoken YOUR_TOKEN"
    echo
    exit 1
fi

echo -e "${GREEN}[OK] Ngrok found!${NC}"
echo

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Function to start services
start_backend() {
    echo -e "${YELLOW}[INFO] Starting Backend Server...${NC}"
    cd "$SCRIPT_DIR"
    gnome-terminal --title="Backend Server" -- bash -c "echo '[BACKEND] Starting...'; npm start; bash" 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "cd '"$SCRIPT_DIR"' && echo \"[BACKEND] Starting...\" && npm start"' 2>/dev/null || \
    echo -e "${YELLOW}Please manually start backend: cd $SCRIPT_DIR && npm start${NC}"
}

start_frontend() {
    echo -e "${YELLOW}[INFO] Starting Frontend Server...${NC}"
    cd "$SCRIPT_DIR/frontend"
    gnome-terminal --title="Frontend Server" -- bash -c "echo '[FRONTEND] Starting...'; npm run dev; bash" 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "cd '"$SCRIPT_DIR/frontend"' && echo \"[FRONTEND] Starting...\" && npm run dev"' 2>/dev/null || \
    echo -e "${YELLOW}Please manually start frontend: cd $SCRIPT_DIR/frontend && npm run dev${NC}"
}

start_ngrok_backend() {
    echo -e "${YELLOW}[INFO] Exposing Backend to Internet...${NC}"
    gnome-terminal --title="Ngrok Backend" -- bash -c "echo '[NGROK] Exposing Backend (Port 5000)...'; ngrok http 5000; bash" 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "echo \"[NGROK] Exposing Backend (Port 5000)...\" && ngrok http 5000"' 2>/dev/null || \
    echo -e "${YELLOW}Please manually start: ngrok http 5000${NC}"
}

start_ngrok_frontend() {
    echo -e "${YELLOW}[INFO] Exposing Frontend to Internet...${NC}"
    gnome-terminal --title="Ngrok Frontend" -- bash -c "echo '[NGROK] Exposing Frontend (Port 3000)...'; ngrok http 3000; bash" 2>/dev/null || \
    osascript -e 'tell app "Terminal" to do script "echo \"[NGROK] Exposing Frontend (Port 3000)...\" && ngrok http 3000"' 2>/dev/null || \
    echo -e "${YELLOW}Please manually start: ngrok http 3000${NC}"
}

# Start all services
start_backend
echo "Waiting for backend to start..."
sleep 15

start_frontend
echo "Waiting for frontend to start..."
sleep 15

start_ngrok_backend
sleep 5

start_ngrok_frontend

echo
echo -e "${GREEN}========================================"
echo -e " SETUP COMPLETE!"
echo -e "========================================${NC}"
echo
echo -e "${BLUE}NEXT STEPS:${NC}"
echo "1. Check the Ngrok terminals for your public URLs"
echo "2. Copy the BACKEND ngrok URL (e.g., https://abc123.ngrok.io)"
echo "3. Update frontend API configuration:"
echo "   - Edit: frontend/src/services/api.js"
echo "   - Change API_BASE_URL to your backend ngrok URL"
echo "4. Restart frontend after updating API URL"
echo "5. Share the FRONTEND ngrok URL with others!"
echo
echo -e "${YELLOW}IMPORTANT NOTES:${NC}"
echo "- Keep all terminals open while sharing"
echo "- Ngrok free tier has limitations (connections, time)"
echo "- URLs change each time you restart ngrok"
echo
echo -e "${BLUE}Opening API configuration file...${NC}"

# Try to open the API config file
if command -v code &> /dev/null; then
    code "$SCRIPT_DIR/frontend/src/services/api.js"
elif command -v nano &> /dev/null; then
    nano "$SCRIPT_DIR/frontend/src/services/api.js"
elif command -v vim &> /dev/null; then
    vim "$SCRIPT_DIR/frontend/src/services/api.js"
else
    echo "Please manually edit: $SCRIPT_DIR/frontend/src/services/api.js"
fi

echo
echo "Update the API_BASE_URL with your backend ngrok URL"
echo "Then restart the frontend server"
echo
