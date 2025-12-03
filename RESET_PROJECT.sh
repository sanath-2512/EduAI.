#!/bin/bash

echo "🧹 EduAI Project Cleaner"
echo "========================"
echo ""

# 1. Stop any running processes (optional, manual step usually better)
echo "⚠️  Please ensure you have stopped all running servers (Ctrl+C) before continuing."
read -p "Press Enter to continue..."

# 2. Clean Backend
echo ""
echo "🧼 Cleaning Backend..."
cd backend
rm -rf node_modules
rm -rf package-lock.json
npm install
npx prisma generate
npx prisma db push
cd ..

# 3. Clean Frontend
echo ""
echo "🧼 Cleaning Frontend..."
cd frontend/EduAi
rm -rf node_modules
rm -rf package-lock.json
npm install
cd ../..

echo ""
echo "✅ Project Reset Complete!"
echo ""
echo "To start fresh:"
echo "1. Terminal 1: cd backend && npm run dev"
echo "2. Terminal 2: cd frontend/EduAi && npm run dev"
