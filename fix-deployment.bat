@echo off
echo ===============================================
echo 🚀 StarkTol VTU Platform - Deployment Fix
echo ===============================================
echo.

echo 🧹 Step 1: Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo ✅ Cleanup completed

echo.
echo 📋 Step 2: Backing up current package.json...
copy package.json package.json.backup
echo ✅ Backup created

echo.
echo 📦 Step 3: Using clean dependency configuration...
copy package-clean.json package.json
echo ✅ Clean dependencies applied

echo.
echo 🔧 Step 4: Installing dependencies...
npm cache clean --force
npm install --force
if %errorlevel% neq 0 (
    echo ❌ Installation failed, restoring backup...
    copy package.json.backup package.json
    exit /b 1
)
echo ✅ Dependencies installed successfully

echo.
echo 🔨 Step 5: Testing build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed, check the error messages above
    exit /b 1
)
echo ✅ Build completed successfully!

echo.
echo 🎉 DEPLOYMENT FIX COMPLETED!
echo ===============================================
echo Your project is now ready for deployment.
echo.
echo Next Steps:
echo 1. Deploy to Vercel: vercel --prod
echo 2. Deploy to Netlify: netlify deploy --prod
echo 3. Deploy to Railway: railway up
echo.
echo Environment Variables to set in your platform:
echo NEXT_PUBLIC_API_BASE=https://backend-066c.onrender.com
echo NEXT_PUBLIC_BASE_URL=https://backend-066c.onrender.com/api/v1
echo ===============================================
pause
