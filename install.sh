#!/bin/bash

echo "🚀 EduAI - Complete Installation Script"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18+ first.${NC}"
    echo "Download from: https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo ""

# Backend Setup
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found in backend. Creating from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Please edit backend/.env with your actual credentials:${NC}"
        echo "   - DATABASE_URL (MongoDB connection string)"
        echo "   - JWT_SECRET (random secret key)"
        echo "   - GROQ_API_KEY (from https://console.groq.com)"
        echo ""
        read -p "Press Enter after you've updated backend/.env..."
    else
        echo -e "${RED}❌ .env.example not found. Please create backend/.env manually.${NC}"
        exit 1
    fi
fi

echo "Installing backend dependencies..."
npm install

echo "Generating Prisma Client..."
npx prisma generate

echo "Pushing Prisma schema to MongoDB..."
npx prisma db push

echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo ""

# Frontend Setup
cd ../frontend/EduAi
echo -e "${BLUE}📦 Setting up Frontend...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found in frontend. Creating from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created frontend/.env${NC}"
    fi
fi

echo "Installing frontend dependencies..."
npm install

# Skipping Tailwind CSS installation as we are using Vanilla CSS
echo "Using Vanilla CSS (Custom Styles)"

echo -e "${GREEN}✅ Frontend setup complete!${NC}"
echo ""

# Final Instructions
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}To start the application:${NC}"
echo ""
echo -e "${YELLOW}Backend:${NC}"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Frontend (in a new terminal):${NC}"
echo "  cd frontend/EduAi"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Then open http://localhost:5173 in your browser${NC}"
echo ""
echo -e "${YELLOW}Don't forget to:${NC}"
echo "1. ✅ Set up your MongoDB Atlas database"
echo "2. ✅ Get your Groq API key from https://console.groq.com"
echo "3. ✅ Update backend/.env with your credentials"
echo ""
