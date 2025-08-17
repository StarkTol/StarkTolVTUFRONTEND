#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process...\n');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  if (fs.existsSync('.next')) {
    execSync('rmdir /s /q .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('out')) {
    execSync('rmdir /s /q out', { stdio: 'inherit' });
  }
} catch (error) {
  console.log('Clean completed (some files may not have existed)');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm ci --production=false', { stdio: 'inherit' });
} catch (error) {
  console.log('Falling back to npm install...');
  execSync('npm install', { stdio: 'inherit' });
}

// Check for required environment variables
console.log('\n📋 Checking environment configuration...');
const requiredEnvVars = ['NEXT_PUBLIC_API_BASE', 'NEXT_PUBLIC_BASE_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
  console.log('Using fallback values from next.config.js');
}

// Run lint (but don't fail on errors)
console.log('\n🔍 Running linter...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Linting completed with warnings (ignored for deployment)');
}

// Build the application
console.log('\n🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Check build output
console.log('\n📊 Build summary:');
const buildPath = path.join(process.cwd(), '.next');
if (fs.existsSync(buildPath)) {
  const stats = fs.statSync(buildPath);
  console.log(`✅ Build directory created: ${buildPath}`);
  console.log(`📅 Build time: ${stats.mtime}`);
} else {
  console.error('❌ Build directory not found');
  process.exit(1);
}

console.log('\n🎉 Deployment preparation completed successfully!');
console.log('\n📝 Next steps:');
console.log('  1. Upload the project to your hosting platform');
console.log('  2. Ensure environment variables are set in production');
console.log('  3. Run "npm start" to start the production server');
