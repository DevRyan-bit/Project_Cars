#!/bin/bash

# Vercel Deployment Checklist
# Run this before deploying to ensure everything is configured correctly

echo "🔍 Vercel Deployment Checklist"
echo "================================"
echo ""

# Check environment files
echo "✓ Checking environment configuration..."
if [ -f "frontend/.env.production" ]; then
    if grep -q "VITE_API_URL=/api" frontend/.env.production; then
        echo "  ✅ Frontend production API URL configured"
    else
        echo "  ❌ Frontend API URL not set to /api"
    fi
else
    echo "  ❌ frontend/.env.production not found"
fi

echo ""
echo "✓ Checking API structure..."

# Check API endpoints
if [ -d "api/auth" ] && [ -f "api/auth/login.js" ] && [ -f "api/auth/profile.js" ]; then
    echo "  ✅ Auth endpoints exist"
else
    echo "  ❌ Auth endpoints missing"
fi

if [ -d "api/cars" ] && [ -f "api/cars/index.js" ] && [ -f "api/cars/[id].js" ]; then
    echo "  ✅ Cars endpoints exist"
else
    echo "  ❌ Cars endpoints missing"
fi

if [ -d "api/orders" ] && [ -f "api/orders/index.js" ]; then
    echo "  ✅ Orders endpoints exist"
else
    echo "  ❌ Orders endpoints missing"
fi

if [ -d "api/transactions" ] && [ -f "api/transactions/index.js" ]; then
    echo "  ✅ Transactions endpoints exist"
else
    echo "  ❌ Transactions endpoints missing"
fi

if [ -f "api/health.js" ] && [ -f "api/hello.js" ]; then
    echo "  ✅ Health check endpoints exist"
else
    echo "  ❌ Health check endpoints missing"
fi

echo ""
echo "✓ Checking dependencies..."

if [ -f "api/package.json" ]; then
    if grep -q "\"better-sqlite3\"" api/package.json; then
        echo "  ✅ API dependencies configured"
    else
        echo "  ❌ API dependencies missing better-sqlite3"
    fi
else
    echo "  ❌ api/package.json not found"
fi

echo ""
echo "✓ Checking Vercel configuration..."

if [ -f "vercel.json" ]; then
    echo "  ✅ vercel.json exists"
else
    echo "  ❌ vercel.json not found"
fi

if [ -f ".vercelignore" ]; then
    echo "  ✅ .vercelignore exists"
else
    echo "  ❌ .vercelignore not found"
fi

echo ""
echo "✓ Checking documentation..."

if [ -f "API_ENDPOINTS.md" ]; then
    echo "  ✅ API documentation exists"
else
    echo "  ⚠️  API_ENDPOINTS.md not found"
fi

if [ -f "VERCEL_SETUP_GUIDE.md" ]; then
    echo "  ✅ Deployment guide exists"
else
    echo "  ⚠️  VERCEL_SETUP_GUIDE.md not found"
fi

echo ""
echo "================================"
echo "✨ Pre-deployment checklist complete!"
echo ""
echo "📝 Next steps:"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. Run: vercel"
echo "3. Set environment variables in Vercel dashboard:"
echo "   - JWT_SECRET=<your-secret>"
echo "   - CORS_ORIGIN=<your-domain>"
echo "4. Test: vercel logs --prod"
echo ""
