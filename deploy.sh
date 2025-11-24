#!/bin/bash
# ESG Pro Deployment Script
# This script deploys the updated code with £2,400 pricing

echo "🚀 Starting deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the correct directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building application..."
npm run build

echo "✅ Build complete!"
echo ""
echo "To deploy to Vercel:"
echo "1. Install Vercel CLI: npm i -g vercel"
echo "2. Login to Vercel: vercel login"  
echo "3. Deploy: vercel --prod"
echo ""
echo "Or push to GitHub to trigger automatic deployment:"
echo "git push origin main"

