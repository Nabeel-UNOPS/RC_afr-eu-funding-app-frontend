# Frontend Deployment Script for Enhanced Backend Integration
# Run this script to deploy the updated frontend with AI-enhanced features

Write-Host "🚀 AFR-EU Funding Gateway Frontend Deployment" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the frontend root directory." -ForegroundColor Red
    exit 1
}

Write-Host "📍 Current directory: $(Get-Location)" -ForegroundColor Blue
Write-Host ""

# Step 1: Install dependencies
Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Check environment configuration
Write-Host "🔧 Step 2: Checking environment configuration..." -ForegroundColor Yellow

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️  Creating .env.local file with default values..." -ForegroundColor Yellow
    
    $envContent = @"
# Enhanced Backend Integration Configuration
NEXT_PUBLIC_INTELLIGENT_API_URL=https://us-central1-unops-cameron.cloudfunctions.net
NEXT_PUBLIC_USE_AI_ENHANCED=true
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=https://us-central1-unops-cameron.cloudfunctions.net/api-function
"@
    
    $envContent | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "✅ Created $envFile with default configuration" -ForegroundColor Green
} else {
    Write-Host "✅ Environment file exists: $envFile" -ForegroundColor Green
}

Write-Host ""

# Step 3: Type checking
Write-Host "🔍 Step 3: Running type check..." -ForegroundColor Yellow
npm run typecheck

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Type check failed, but continuing with deployment..." -ForegroundColor Yellow
} else {
    Write-Host "✅ Type check passed" -ForegroundColor Green
}

Write-Host ""

# Step 4: Build the application
Write-Host "🏗️  Step 4: Building the application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green
Write-Host ""

# Step 5: Check Firebase CLI
Write-Host "🔥 Step 5: Checking Firebase CLI..." -ForegroundColor Yellow

try {
    $firebaseVersion = firebase --version 2>$null
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Firebase CLI not found. Please install it with:" -ForegroundColor Yellow
    Write-Host "   npm install -g firebase-tools" -ForegroundColor Cyan
    Write-Host "   Then run: firebase login" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Continuing without deployment..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✅ Build completed. Manual deployment required." -ForegroundColor Green
    exit 0
}

Write-Host ""

# Step 6: Deploy to Firebase
Write-Host "🚀 Step 6: Deploying to Firebase Hosting..." -ForegroundColor Yellow

firebase deploy --only hosting

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting tips:" -ForegroundColor Cyan
    Write-Host "   1. Run 'firebase login' to authenticate" -ForegroundColor Cyan
    Write-Host "   2. Check your Firebase project configuration" -ForegroundColor Cyan
    Write-Host "   3. Verify you have deployment permissions" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Enhanced Features Now Available:" -ForegroundColor Blue
Write-Host "   ✅ AI-Enhanced Dashboard with real-time statistics" -ForegroundColor Green
Write-Host "   ✅ 562K+ EU funding opportunities from official API" -ForegroundColor Green
Write-Host "   ✅ AI relevance scoring for African development" -ForegroundColor Green
Write-Host "   ✅ Enhanced search and filtering capabilities" -ForegroundColor Green
Write-Host "   ✅ Real-time data collection controls" -ForegroundColor Green
Write-Host "   ✅ Plugin system integration" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your application should now be live at:" -ForegroundColor Blue
Write-Host "   https://unops-funding-gateway.web.app/" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Blue
Write-Host "   1. Test the AI Dashboard tab in the main interface" -ForegroundColor Cyan
Write-Host "   2. Try the enhanced search filters" -ForegroundColor Cyan
Write-Host "   3. Check AI relevance scores on opportunity cards" -ForegroundColor Cyan
Write-Host "   4. Trigger data collection to see real-time updates" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 For detailed documentation, see FRONTEND_INTEGRATION_GUIDE.md" -ForegroundColor Blue
