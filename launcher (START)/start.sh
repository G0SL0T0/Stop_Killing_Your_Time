#!/bin/bash

echo "Starting SKYT Application..."
# Переходим в директорию скрипта, затем в корень проекта
cd "$( dirname -- "$0"; )/.."

# 1. Install/Update Node.js dependencies
echo "[+] Installing/Updating Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "[!] Error installing Node.js dependencies. Please check npm logs."
  exit 1
fi

# 2. Start Docker containers (Postgres, Nginx) in detached mode
echo "[+] Starting Docker containers (Postgres, Nginx)..."
docker-compose up -d
if [ $? -ne 0 ]; then
  echo "[!] Error starting Docker containers. Is Docker running and docker-compose.yml correct?"
  exit 1
fi
echo "[i] NOTE: Database migrations might need to be run separately or using a migration tool."
set -o allexport
source .env || true
set +o allexport
BACKEND_PORT=${PORT:-3000} # PORT из .env или 3000

echo "[+] Starting Node.js backend server (Port: $BACKEND_PORT) in background..."
node backend/server.js &
BACKEND_PID=$!
echo "[i] Backend server started with PID: $BACKEND_PID"
echo "[+] Waiting for services to start..."
sleep 5

# Замена ПОРТа !
FRONTEND_PORT=8080
FRONTEND_URL="http://localhost:${FRONTEND_PORT}"
echo "[+] Opening Frontend ($FRONTEND_URL) in browser..."

if command -v xdg-open &> /dev/null; then
  xdg-open "$FRONTEND_URL" # Linux
elif command -v open &> /dev/null; then
  open "$FRONTEND_URL" # macOS
else
   echo "[!] Could not detect 'xdg-open' or 'open'. Please open $FRONTEND_URL manually."
fi
echo "[+] SKYT startup sequence initiated. Backend running in the background (PID: $BACKEND_PID)."
echo "[i] To stop the backend, run: kill $BACKEND_PID"
echo "[i] To stop Docker containers, run: docker-compose down"
echo ""