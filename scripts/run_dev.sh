#!/usr/bin/env bash
set -e

# Cleanup trap to kill background processes on exit
trap 'kill 0' SIGINT

echo "🚀 Starting CanopyML in Development Mode..."

# 1. Start FastAPI backend (Port 8000)
echo "⚡ Starting backend (Uvicorn)..."
if [ -d "venv" ]; then
  source venv/bin/activate
fi
PYTHONPATH=. uvicorn apps.backend.src.main:app --reload --port 8000 &

# 2. Start React frontend (Port 5173)
echo "⚡ Starting frontend (Vite)..."
cd apps/frontend
npm run dev &

echo "✨ CanopyML is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000/api/docs"
echo "Press Ctrl+C to stop both servers."

wait
