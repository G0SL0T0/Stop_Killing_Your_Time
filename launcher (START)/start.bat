@echo off
echo Starting SKYT Application...
cd /d "%~dp0.."  
echo [+] Installing/Updating Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo [!] Error installing Node.js dependencies. Please check npm logs.
    pause
    exit /b %errorlevel%
)

echo [+] Starting Docker containers (Postgres, Nginx)...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [!] Error starting Docker containers. Is Docker running and docker-compose.yml correct?
    pause
    exit /b %errorlevel%
)

echo [i] NOTE: Database migrations might need to be run separately or using a migration tool.
echo [+] Starting Node.js backend server (Port: %PORT% or 3000)...
start "SKYT Backend" node backend/server.js
echo [+] Waiting for services to start...
timeout /t 5 /nobreak > nul
REM !! Заменить порт !!
set FRONTEND_PORT=8080
echo [+] Opening Frontend in browser (assuming Nginx on port %FRONTEND_PORT%)...
start http://localhost:%FRONTEND_PORT%
echo [+] SKYT startup sequence initiated. Backend running in a separate window.
echo.
pause