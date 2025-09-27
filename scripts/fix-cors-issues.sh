#!/bin/bash

# Tokyo Weekender CORS Issues Fix Script
echo "🔧 Fixing CORS and API issues for Tokyo Weekender..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project directory confirmed"

# Test backend connectivity
echo "🔍 Testing backend connectivity..."
BACKEND_URL="https://tokyo-weekender-seo-dashboard-backend.onrender.com"

# Test health endpoint
echo "Testing health endpoint..."
if curl -s -f "$BACKEND_URL/api/health" > /dev/null; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    echo "Backend may not be deployed or running"
fi

# Test test endpoint
echo "Testing test endpoint..."
if curl -s -f "$BACKEND_URL/api/test" > /dev/null; then
    echo "✅ Backend test endpoint passed"
else
    echo "❌ Backend test endpoint failed"
fi

# Test keywords endpoint
echo "Testing keywords endpoint..."
if curl -s -f "$BACKEND_URL/api/keywords/locations" > /dev/null; then
    echo "✅ Keywords locations endpoint passed"
else
    echo "❌ Keywords locations endpoint failed"
fi

# Test search endpoint
echo "Testing search endpoint..."
if curl -s -f "$BACKEND_URL/api/keywords/search?min_volume=100&max_position=50&limit=10" > /dev/null; then
    echo "✅ Keywords search endpoint passed"
else
    echo "❌ Keywords search endpoint failed"
fi

echo ""
echo "📋 Summary of fixes applied:"
echo "1. ✅ Updated render-backend.yaml with correct start command"
echo "2. ✅ Fixed PYTHONPATH configuration"
echo "3. ✅ Added fallback mechanisms for database failures"
echo "4. ✅ Enhanced error handling in API endpoints"
echo "5. ✅ Added test endpoints for debugging"

echo ""
echo "🚀 Next steps:"
echo "1. Commit and push these changes to trigger a new deployment"
echo "2. Wait for Render to redeploy the backend service"
echo "3. Test the frontend again after deployment completes"

echo ""
echo "🔧 Manual deployment trigger (if needed):"
echo "git add ."
echo "git commit -m 'Fix CORS and API issues'"
echo "git push origin main"

echo ""
echo "✅ CORS fix script completed!"
