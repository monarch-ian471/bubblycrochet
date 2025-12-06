#!/bin/bash

echo "🚀 Setting up Bubbly Crochet..."

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your MongoDB URI and JWT secret!"
fi

echo "Installing backend dependencies..."
npm install

echo ""
echo "✅ Backend setup complete!"

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
fi

echo "Installing frontend dependencies..."
npm install

echo ""
echo "✅ Frontend setup complete!"

cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup Complete! ✨"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your MongoDB URI"
echo "2. Start MongoDB if running locally"
echo ""
echo "To start the application:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Or use the start script:"
echo "  chmod +x start.sh"
echo "  ./start.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
