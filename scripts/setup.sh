#!/bin/bash

# KidsStory Setup Script
# This script sets up the development environment for KidsStory

set -e

echo "🚀 Setting up KidsStory Development Environment..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You can still run the app locally without Docker."
    echo "To install Docker, visit: https://www.docker.com/"
else
    echo "✅ Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) found"
fi

# Check if MongoDB is running locally or if we should use Docker
if ! command -v mongod &> /dev/null && ! command -v docker &> /dev/null; then
    echo "❌ Either MongoDB or Docker is required to run the database."
    echo "Please install one of the following:"
    echo "- MongoDB: https://www.mongodb.com/docs/manual/installation/"
    echo "- Docker: https://www.docker.com/"
    exit 1
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

echo ""
echo "📦 Installing Web Dependencies..."
cd ../web
npm install
echo "✅ Web dependencies installed"

echo ""
echo "⚙️  Setting up Environment Files..."
cd ..

# Backend environment
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from example"
    echo "⚠️  Please update backend/.env with your API keys and configuration"
else
    echo "✅ backend/.env already exists"
fi

# Web environment
if [ ! -f "web/.env" ]; then
    cp web/.env.example web/.env
    echo "✅ Created web/.env from example"
else
    echo "✅ web/.env already exists"
fi

# Create necessary directories
mkdir -p backend/uploads
mkdir -p backend/generated_pdfs
mkdir -p backend/logs
echo "✅ Created necessary directories"

echo ""
echo "🎉 Setup Complete!"
echo "==================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Update your environment variables:"
echo "   - Edit backend/.env with your API keys (OpenAI, Gemini, etc.)"
echo "   - Update database connection if needed"
echo ""
echo "2. Start the application:"
echo ""
echo "   Option A - Using Docker (Recommended):"
echo "   docker-compose up"
echo ""
echo "   Option B - Manual startup:"
echo "   # Terminal 1 - Start MongoDB (if local)"
echo "   mongod"
echo ""
echo "   # Terminal 2 - Start Backend"
echo "   cd backend && npm run dev"
echo ""
echo "   # Terminal 3 - Start Web App"
echo "   cd web && npm start"
echo ""
echo "3. Access the application:"
echo "   - Web App: http://localhost:3000"
echo "   - API: http://localhost:3001"
echo "   - Health Check: http://localhost:3001/health"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "🐛 If you encounter issues, check the CLAUDE.md file for troubleshooting"