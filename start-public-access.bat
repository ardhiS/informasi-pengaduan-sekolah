@echo off
title School Complaints - Public Access Setup
color 0A

echo ========================================
echo  SMP PLUS AT-THAHIRIN - Public Access
echo ========================================
echo.

echo [INFO] Starting public access setup...
echo.

:: Check if ngrok is installed
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Ngrok not found! Please install ngrok first:
    echo 1. Download from https://ngrok.com/download
    echo 2. Or run: npm install -g ngrok
    echo 3. Get authtoken from ngrok.com and run: ngrok authtoken YOUR_TOKEN
    echo.
    pause
    exit
)

echo [OK] Ngrok found!
echo.

:: Start Backend
echo [INFO] Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0 && echo [BACKEND] Starting... && npm start"

:: Wait for backend
echo [INFO] Waiting for backend to start...
timeout /t 15 /nobreak >nul

:: Start Frontend
echo [INFO] Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && echo [FRONTEND] Starting... && npm run dev"

:: Wait for frontend
echo [INFO] Waiting for frontend to start...
timeout /t 15 /nobreak >nul

:: Start Ngrok for Backend
echo [INFO] Exposing Backend to Internet...
start "Ngrok Backend" cmd /k "echo [NGROK] Exposing Backend (Port 5000)... && ngrok http 5000"

:: Wait a bit
timeout /t 5 /nobreak >nul

:: Start Ngrok for Frontend
echo [INFO] Exposing Frontend to Internet...
start "Ngrok Frontend" cmd /k "echo [NGROK] Exposing Frontend (Port 3000)... && ngrok http 3000"

echo.
echo ========================================
echo  SETUP COMPLETE!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Check the Ngrok windows for your public URLs
echo 2. Copy the BACKEND ngrok URL (e.g., https://abc123.ngrok.io)
echo 3. Update frontend API configuration:
echo    - Edit: frontend/src/services/api.js
echo    - Change API_BASE_URL to your backend ngrok URL
echo 4. Restart frontend after updating API URL
echo 5. Share the FRONTEND ngrok URL with others!
echo.
echo IMPORTANT NOTES:
echo - Keep all windows open while sharing
echo - Ngrok free tier has limitations (connections, time)
echo - URLs change each time you restart ngrok
echo.
echo Press any key to open configuration help...
pause >nul

:: Open API config file
start notepad "%~dp0frontend\src\services\api.js"

echo.
echo [INFO] Opened API configuration file
echo Update the API_BASE_URL with your backend ngrok URL
echo Then restart the frontend server
echo.
pause
