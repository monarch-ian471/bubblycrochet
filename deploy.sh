#!/bin/bash

# Bubbly Crochet - Production Deployment Script
# This script helps with common deployment tasks

set -e

echo "🧶 Bubbly Crochet Deployment Helper"
echo "===================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v)"

# Check for Vercel CLI
if ! command_exists vercel; then
    echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
fi

echo ""
echo "Select an option:"
echo "1) Install all dependencies"
echo "2) Build for production"
echo "3) Deploy to Vercel"
echo "4) Create .env files from examples"
echo "5) Check environment setup"
echo "6) Run local development"
echo "7) Exit"
echo ""
read -p "Enter your choice [1-7]: " choice

case $choice in
    1)
        echo ""
        echo "📦 Installing dependencies..."
        npm install
        cd backend && npm install && cd ..
        cd frontend && npm install && cd ..
        echo "✅ All dependencies installed"
        ;;
    2)
        echo ""
        echo "🔨 Building for production..."
        cd backend && npm run build && cd ..
        cd frontend && npm run build && cd ..
        echo "✅ Build completed"
        ;;
    3)
        echo ""
        if ! command_exists vercel; then
            echo "❌ Vercel CLI not found. Install with: npm i -g vercel"
            exit 1
        fi
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        echo "✅ Deployment completed"
        ;;
    4)
        echo ""
        echo "📝 Creating .env files from examples..."
        
        if [ ! -f ".env" ]; then
            cp .env.example .env
            echo "✅ Created root .env"
        else
            echo "⚠️  Root .env already exists"
        fi
        
        if [ ! -f "backend/.env" ]; then
            cp backend/.env.example backend/.env
            echo "✅ Created backend/.env"
        else
            echo "⚠️  backend/.env already exists"
        fi
        
        if [ ! -f "frontend/.env" ]; then
            cp frontend/.env.example frontend/.env
            echo "✅ Created frontend/.env"
        else
            echo "⚠️  frontend/.env already exists"
        fi
        
        echo ""
        echo "⚠️  Remember to update the .env files with your actual values!"
        ;;
    5)
        echo ""
        echo "🔍 Checking environment setup..."
        echo ""
        
        # Check .env files
        if [ -f "backend/.env" ]; then
            echo "✅ backend/.env exists"
        else
            echo "❌ backend/.env missing"
        fi
        
        if [ -f "frontend/.env" ]; then
            echo "✅ frontend/.env exists"
        else
            echo "❌ frontend/.env missing"
        fi
        
        # Check node_modules
        if [ -d "backend/node_modules" ]; then
            echo "✅ Backend dependencies installed"
        else
            echo "❌ Backend dependencies not installed"
        fi
        
        if [ -d "frontend/node_modules" ]; then
            echo "✅ Frontend dependencies installed"
        else
            echo "❌ Frontend dependencies not installed"
        fi
        
        echo ""
        echo "📋 See PRODUCTION_CHECKLIST.md for complete deployment checklist"
        ;;
    6)
        echo ""
        echo "🚀 Starting local development servers..."
        echo "Backend: http://localhost:5000"
        echo "Frontend: http://localhost:3000"
        echo "Admin: http://localhost:3000/admin.html"
        echo ""
        echo "Press Ctrl+C to stop"
        echo ""
        
        # Check if concurrently is installed
        if command_exists npx; then
            npm run dev
        else
            echo "Starting servers separately..."
            cd backend && npm run dev &
            cd frontend && npm run dev &
            wait
        fi
        ;;
    7)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✨ Done!"
echo ""
echo "📚 Documentation:"
echo "   - DEPLOYMENT.md - Full deployment guide"
echo "   - PRODUCTION_CHECKLIST.md - Pre-deployment checklist"
echo "   - README.md - Project overview"
echo ""
