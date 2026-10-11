@echo off
title HemoPulse - Blood Donor Finder Web Application
color 0C
echo =====================================================================
echo           BLOOD DONOR FINDER (HEMOPULSE) - WEB APPLICATION
echo =====================================================================
echo.
echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/ to run this project.
    pause
    exit /b 1
)

cd /d "%~dp0backend"

echo [2/3] Checking backend dependencies...
if not exist "node_modules" (
    echo Node modules not found. Installing packages...
    call npm.cmd install
)

echo.
echo [3/3] Starting HemoPulse Express Server...
echo Server will run on: http://localhost:5000
echo Default admin login: admin@hemopulse.org / admin123
echo.
echo Opening browser in 3 seconds...
start "" "http://localhost:5000"

echo.
echo =====================================================================
echo Server is running! Keep this window open while using the web app.
echo Press Ctrl+C in this terminal when you want to stop the server.
echo =====================================================================
echo.
node server.js
pause
