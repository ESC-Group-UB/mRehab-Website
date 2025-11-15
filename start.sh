#!/bin/bash
# This script starts both the backend and frontend servers for the application.

backend="./server"
frontend="./mrehab"

echo "🚀 Starting backend server at $backend"
cd "$backend" || exit 1
echo "📦 Installing backend packages..."
npm install || exit 1
echo "▶️ Running backend server..."
npm run dev &  # run in background

cd ..

echo "🚀 Starting frontend server at $frontend"
cd "$frontend" || exit 1
echo "📦 Installing frontend packages..."
npm install || exit 1
echo "▶️ Running frontend server..."
npm run dev &  # run in background

wait  # Wait for both background processes to finish
echo "✅ Both servers are now running."
