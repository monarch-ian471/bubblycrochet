#!/bin/bash

echo "🚀 Starting Bubbly Crochet..."

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env not found! Please run ./setup.sh first"
    exit 1
fi

if [ ! -f "frontend/.env" ]; then
    echo "❌ frontend/.env not found! Please run ./setup.sh first"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo "🔧 Starting Backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Bubbly Crochet is running! ✨"
echo ""
echo "🔧 Backend:  http://localhost:5000"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for both processes
wait
