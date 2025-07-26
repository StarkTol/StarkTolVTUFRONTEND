#!/usr/bin/env node

/**
 * Quick Start Script
 * 
 * Helps users quickly test both local and production environments
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 StarkTol VTU Platform - Quick Start Guide')
console.log('=============================================\n')

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    })
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })
  })
}

async function checkBackendStatus(url) {
  try {
    const response = await fetch(`${url}/health`)
    return response.ok
  } catch {
    return false
  }
}

async function main() {
  console.log('📋 Current Environment Status:')
  console.log('==============================')
  
  // Show current environment
  try {
    await runCommand('npm', ['run', 'env:status'])
  } catch (error) {
    console.error('❌ Failed to check environment status')
  }
  
  console.log('\n🔧 Setup Instructions:')
  console.log('======================')
  console.log('1. For LOCAL development:')
  console.log('   → Make sure your backend is running on http://localhost:8000')
  console.log('   → Run: npm run env:local')
  console.log('   → Run: npm run dev')
  console.log('')
  console.log('2. For PRODUCTION testing:')
  console.log('   → Run: npm run env:prod')
  console.log('   → Run: npm run dev')
  console.log('   → Your app will connect to https://backend-066c.onrender.com')
  console.log('')
  
  console.log('💡 Quick Commands:')
  console.log('==================')
  console.log('npm run env:local     - Switch to local backend')
  console.log('npm run env:prod      - Switch to production backend')
  console.log('npm run env:status    - Check current environment')
  console.log('')
  
  console.log('🐛 Debug Tools:')
  console.log('===============')
  console.log('→ In development mode, look for "Auth Debug" button (bottom-left)')
  console.log('→ Check browser console for detailed error messages')
  console.log('→ Use environment switcher to test both backends')
  console.log('')
  
  console.log('📚 For detailed setup instructions, see: ENVIRONMENT_SETUP.md')
  console.log('')
  
  // Check if backend is running locally
  console.log('🔍 Backend Connectivity Check:')
  console.log('==============================')
  
  try {
    const localBackend = await checkBackendStatus('http://localhost:8000')
    console.log(`Local Backend (http://localhost:8000): ${localBackend ? '✅ Online' : '❌ Offline'}`)
  } catch {
    console.log('Local Backend (http://localhost:8000): ❌ Offline')
  }
  
  try {
    const prodBackend = await checkBackendStatus('https://backend-066c.onrender.com')
    console.log(`Production Backend (https://backend-066c.onrender.com): ${prodBackend ? '✅ Online' : '❌ Offline'}`)
  } catch {
    console.log('Production Backend (https://backend-066c.onrender.com): ❌ Offline')
  }
  
  console.log('')
  console.log('🎯 Ready to start? Run one of these:')
  console.log('====================================')
  console.log('npm run env:local && npm run dev    # Local development')
  console.log('npm run env:prod && npm run dev     # Production testing')
}

if (require.main === module) {
  main().catch(console.error)
}
