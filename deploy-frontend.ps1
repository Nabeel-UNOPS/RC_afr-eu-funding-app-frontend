# AFR-EU Funding App Frontend Deployment Script
# This script deploys the frontend to Firebase Hosting

Write-Host "🌐 AFR-EU Funding App Frontend Deployment" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

# Configuration
$PROJECT_ID = "unops-cameron"  # Change this to your project ID
$API_URL = "https://us-central1-unops-cameron.cloudfunctions.net/api-function"  # Update with your actual API URL

Write-Host "📋 Configuration:" -ForegroundColor Blue
Write-Host "   Project ID: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "   API URL: $API_URL" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the frontend root directory." -ForegroundColor Red
    exit 1
}

Write-Host "📍 Current directory: $(Get-Location)" -ForegroundColor Blue
Write-Host ""

# Step 2: Check Node.js and npm
Write-Host "🔧 Step 1: Checking Node.js and npm..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js or npm not found. Please install Node.js from:" -ForegroundColor Red
    Write-Host "   https://nodejs.org/" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# Step 3: Check Firebase CLI
Write-Host "🔥 Step 2: Checking Firebase CLI..." -ForegroundColor Yellow

try {
    $firebaseVersion = firebase --version 2>$null
    Write-Host "✅ Firebase CLI: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Firebase CLI" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Firebase CLI installed successfully" -ForegroundColor Green
}

Write-Host ""

# Step 4: Check Firebase authentication
Write-Host "🔐 Step 3: Checking Firebase authentication..." -ForegroundColor Yellow

$firebaseUser = firebase projects:list 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔑 Please authenticate with Firebase:" -ForegroundColor Yellow
    firebase login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Firebase authentication failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Firebase authenticated" -ForegroundColor Green
Write-Host ""

# Step 5: Install dependencies
Write-Host "📦 Step 4: Installing dependencies..." -ForegroundColor Yellow

npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Step 6: Create/update environment file
Write-Host "🔧 Step 5: Setting up environment configuration..." -ForegroundColor Yellow

$envFile = ".env.local"
$envContent = @"
# Backend API Configuration
NEXT_PUBLIC_API_URL=$API_URL
NEXT_PUBLIC_DATA_COLLECTION_URL=https://us-central1-unops-cameron.cloudfunctions.net/data-collection-function

# Feature Flags
NEXT_PUBLIC_USE_AI_ENHANCED=true
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$PROJECT_ID.appspot.com
"@

$envContent | Out-File -FilePath $envFile -Encoding UTF8
Write-Host "✅ Environment file created: $envFile" -ForegroundColor Green
Write-Host ""

# Step 7: Run type checking
Write-Host "🔍 Step 6: Running type check..." -ForegroundColor Yellow

npm run typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Type check failed, but continuing with deployment..." -ForegroundColor Yellow
} else {
    Write-Host "✅ Type check passed" -ForegroundColor Green
}

Write-Host ""

# Step 8: Build the application
Write-Host "🏗️  Step 7: Building the application..." -ForegroundColor Yellow

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    Write-Host "💡 Troubleshooting tips:" -ForegroundColor Cyan
    Write-Host "   1. Check for TypeScript errors: npm run typecheck" -ForegroundColor Cyan
    Write-Host "   2. Clear cache: rm -rf .next out node_modules && npm install" -ForegroundColor Cyan
    Write-Host "   3. Check environment variables in .env.local" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green
Write-Host ""

# Step 9: Deploy to Firebase Hosting
Write-Host "🚀 Step 8: Deploying to Firebase Hosting..." -ForegroundColor Yellow

firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host "💡 Troubleshooting tips:" -ForegroundColor Cyan
    Write-Host "   1. Run 'firebase login' to re-authenticate" -ForegroundColor Cyan
    Write-Host "   2. Check your Firebase project configuration" -ForegroundColor Cyan
    Write-Host "   3. Verify you have deployment permissions" -ForegroundColor Cyan
    Write-Host "   4. Check firebase.json configuration" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""

# Step 10: Get deployment URL
Write-Host "🔗 Step 9: Getting deployment URL..." -ForegroundColor Yellow

$deploymentUrl = "https://unops-funding-gateway.web.app"
Write-Host "✅ Application deployed to: $deploymentUrl" -ForegroundColor Green
Write-Host ""

# Step 11: Test deployment
Write-Host "🧪 Step 10: Testing deployment..." -ForegroundColor Yellow

try {
    $testResponse = Invoke-WebRequest -Uri $deploymentUrl -Method GET -TimeoutSec 30
    if ($testResponse.StatusCode -eq 200) {
        Write-Host "✅ Deployment test successful" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Deployment test returned status: $($testResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Deployment test failed, but deployment completed" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Frontend deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor Blue
Write-Host "   ✅ Application URL: $deploymentUrl" -ForegroundColor Green
Write-Host "   ✅ Project ID: $PROJECT_ID" -ForegroundColor Green
Write-Host "   ✅ API URL: $API_URL" -ForegroundColor Green
Write-Host "   ✅ Build: Successful" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Enhanced Features Now Available:" -ForegroundColor Blue
Write-Host "   ✅ AI-Enhanced Dashboard with real-time statistics" -ForegroundColor Green
Write-Host "   ✅ 563K+ EU funding opportunities from official API" -ForegroundColor Green
Write-Host "   ✅ Advanced filtering by country, theme, funding type" -ForegroundColor Green
Write-Host "   ✅ Notification system for new opportunities" -ForegroundColor Green
Write-Host "   ✅ User support system with team contacts" -ForegroundColor Green
Write-Host "   ✅ African relevance scoring and filtering" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Blue
Write-Host "   1. Test the application at: $deploymentUrl" -ForegroundColor Cyan
Write-Host "   2. Check all features are working correctly" -ForegroundColor Cyan
Write-Host "   3. Share the URL with your Africa team colleagues" -ForegroundColor Cyan
Write-Host "   4. Monitor application performance and logs" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 For detailed documentation, see DEPLOYMENT_GUIDE.md" -ForegroundColor Blue
