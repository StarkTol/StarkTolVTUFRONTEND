#!/usr/bin/env node

/**
 * Environment Switcher Script
 * 
 * Usage:
 *   npm run switch-env local    # Switch to local backend
 *   npm run switch-env prod     # Switch to production backend
 *   npm run switch-env status   # Show current configuration
 */

const fs = require('fs')
const path = require('path')

const ENV_LOCAL_PATH = path.join(process.cwd(), '.env.local')

const LOCAL_CONFIG = {
  'NEXT_PUBLIC_API_BASE': 'http://localhost:8000',
  'NEXT_PUBLIC_BASE_URL': 'http://localhost:8000/api/v1',
  'NEXT_PUBLIC_AUTO_DETECT_BACKEND': 'false',
  'USE_LOCAL_BACKEND': 'true'
}

const PRODUCTION_CONFIG = {
  'NEXT_PUBLIC_API_BASE': 'https://backend-066c.onrender.com',
  'NEXT_PUBLIC_BASE_URL': 'https://backend-066c.onrender.com/api/v1',
  'NEXT_PUBLIC_AUTO_DETECT_BACKEND': 'false',
  'USE_LOCAL_BACKEND': 'false'
}

const AUTO_CONFIG = {
  'NEXT_PUBLIC_API_BASE': 'http://localhost:8000',
  'NEXT_PUBLIC_BASE_URL': 'http://localhost:8000/api/v1',
  'NEXT_PUBLIC_FALLBACK_API_BASE': 'https://backend-066c.onrender.com',
  'NEXT_PUBLIC_FALLBACK_BASE_URL': 'https://backend-066c.onrender.com/api/v1',
  'NEXT_PUBLIC_AUTO_DETECT_BACKEND': 'true',
  'USE_LOCAL_BACKEND': 'auto'
}

function readEnvFile() {
  if (!fs.existsSync(ENV_LOCAL_PATH)) {
    console.error('❌ .env.local file not found!')
    process.exit(1)
  }
  
  return fs.readFileSync(ENV_LOCAL_PATH, 'utf8')
}

function writeEnvFile(content) {
  fs.writeFileSync(ENV_LOCAL_PATH, content, 'utf8')
}

function updateEnvConfig(config) {
  let content = readEnvFile()
  
  Object.entries(config).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm')
    if (content.match(regex)) {
      content = content.replace(regex, `${key}=${value}`)
    } else {
      content += `\n${key}=${value}`
    }
  })
  
  writeEnvFile(content)
}

function getCurrentConfig() {
  const content = readEnvFile()
  const config = {}
  
  // Handle both Unix (\n) and Windows (\r\n) line endings
  content.split(/\r?\n/).forEach(line => {
    // Skip empty lines and comments
    if (line.trim() && !line.trim().startsWith('#')) {
      const match = line.match(/^([^#=]+)=(.*)$/)
      if (match) {
        config[match[1].trim()] = match[2].trim()
      }
    }
  })
  
  return config
}

function showStatus() {
  const config = getCurrentConfig()
  
  console.log('\n🔧 Current Environment Configuration:')
  console.log('=====================================')
  console.log(`API Base:           ${config.NEXT_PUBLIC_API_BASE || 'Not set'}`)
  console.log(`Base URL:           ${config.NEXT_PUBLIC_BASE_URL || 'Not set'}`)
  console.log(`Fallback API Base:  ${config.NEXT_PUBLIC_FALLBACK_API_BASE || 'Not set'}`)
  console.log(`Auto-Detect:        ${config.NEXT_PUBLIC_AUTO_DETECT_BACKEND || 'Not set'}`)
  console.log(`Use Local Backend:  ${config.USE_LOCAL_BACKEND || 'Not set'}`)
  console.log(`Frontend URL:       ${config.NEXT_PUBLIC_APP_URL || 'Not set'}`)
  console.log(`Debug Mode:         ${config.NEXT_PUBLIC_DEBUG_MODE || 'Not set'}`)
  
  // Determine current mode
  let mode = '❓ UNKNOWN'
  if (config.NEXT_PUBLIC_AUTO_DETECT_BACKEND === 'true') {
    mode = '🤖 AUTO-DETECT (Local first, then Production)'
  } else if (config.NEXT_PUBLIC_API_BASE?.includes('localhost')) {
    mode = '🏠 LOCAL ONLY'
  } else if (config.NEXT_PUBLIC_API_BASE?.includes('onrender.com')) {
    mode = '🌐 PRODUCTION ONLY'
  }
  
  console.log(`\n📍 Current Mode: ${mode}`)
  
  console.log('\n💡 Available commands:')
  console.log('  npm run switch-env auto    - Enable smart auto-detection (recommended)')
  console.log('  npm run switch-env local   - Force local backend only')
  console.log('  npm run switch-env prod    - Force production backend only')
  console.log('  npm run switch-env status  - Show this status')
}

function switchToAuto() {
  console.log('🤖 Switching to auto-detection mode...')
  updateEnvConfig(AUTO_CONFIG)
  console.log('✅ Enabled smart auto-detection:')
  console.log('   • Will try local backend first (http://localhost:8000)')
  console.log('   • Falls back to production if local unavailable (https://backend-066c.onrender.com)')
  console.log('   • Automatically handles switching between environments')
  console.log('🔄 Please restart your development server to apply changes')
}

function switchToLocal() {
  console.log('🏠 Switching to local environment (FORCED)...')
  updateEnvConfig(LOCAL_CONFIG)
  console.log('✅ Forced local backend only (http://localhost:8000)')
  console.log('⚠️ Auto-detection disabled - will only use local backend')
  console.log('🔄 Please restart your development server to apply changes')
}

function switchToProduction() {
  console.log('🌐 Switching to production environment (FORCED)...')
  updateEnvConfig(PRODUCTION_CONFIG)
  console.log('✅ Forced production backend only (https://backend-066c.onrender.com)')
  console.log('⚠️ Auto-detection disabled - will only use production backend')
  console.log('🔄 Please restart your development server to apply changes')
}

function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'auto':
    case 'a':
    case 'smart':
      switchToAuto()
      break
      
    case 'local':
    case 'l':
      switchToLocal()
      break
      
    case 'prod':
    case 'production':
    case 'p':
      switchToProduction()
      break
      
    case 'status':
    case 's':
    default:
      showStatus()
      break
  }
}

if (require.main === module) {
  main()
}
