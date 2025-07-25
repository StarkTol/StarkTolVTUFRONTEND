#!/usr/bin/env node

/**
 * Flutterwave Integration Test Script
 * Run this to verify your setup is correct
 */

const fs = require('fs')
const path = require('path')

console.log('🧪 Testing Flutterwave Integration Setup...\n')

// Test 1: Check if flutterwave-react-v3 is installed
console.log('1. Checking dependencies...')
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))
  const hasFlutterwave = packageJson.dependencies && packageJson.dependencies['flutterwave-react-v3']
  
  if (hasFlutterwave) {
    console.log('   ✅ flutterwave-react-v3 is installed:', hasFlutterwave)
  } else {
    console.log('   ❌ flutterwave-react-v3 is NOT installed')
    console.log('   📝 Run: npm install flutterwave-react-v3')
  }
} catch (error) {
  console.log('   ❌ Could not read package.json')
}

// Test 2: Check if environment variables are set
console.log('\n2. Checking environment variables...')
const envFiles = ['.env.local', '.env.development', '.env']
let envFound = false

for (const envFile of envFiles) {
  const envPath = path.join(__dirname, '..', envFile)
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    if (envContent.includes('NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY')) {
      console.log(`   ✅ Found Flutterwave config in ${envFile}`)
      envFound = true
      
      // Check if it's still the example key
      if (envContent.includes('FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X')) {
        console.log('   ⚠️  Still using example key - replace with your actual key')
      }
    }
  }
}

if (!envFound) {
  console.log('   ❌ No Flutterwave environment variables found')
  console.log('   📝 Copy .env.example to .env.local and add your keys')
}

// Test 3: Check if files are created correctly
console.log('\n3. Checking created files...')
const requiredFiles = [
  'lib/config/flutterwave.ts',
  'components/payments/FlutterwavePayment.tsx',
  'lib/utils/flutterwaveVerification.ts',
  'lib/utils/testData.ts',
  '.env.example',
  'FLUTTERWAVE_SETUP.md'
]

let allFilesExist = true
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, '..', file)
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`)
  } else {
    console.log(`   ❌ ${file} - Missing`)
    allFilesExist = false
  }
}

// Test 4: Check if types are updated
console.log('\n4. Checking type definitions...')
try {
  const typesPath = path.join(__dirname, '../lib/api/types.ts')
  const typesContent = fs.readFileSync(typesPath, 'utf8')
  
  if (typesContent.includes("'flutterwave'")) {
    console.log('   ✅ PaymentMethod types updated to include Flutterwave')
  } else {
    console.log('   ❌ PaymentMethod types not updated')
  }
  
  if (typesContent.includes('flwRef')) {
    console.log('   ✅ Flutterwave metadata types added')
  } else {
    console.log('   ❌ Flutterwave metadata types missing')
  }
} catch (error) {
  console.log('   ❌ Could not check types file')
}

// Test 5: Check if wallet service is updated
console.log('\n5. Checking wallet service...')
try {
  const walletServicePath = path.join(__dirname, '../lib/services/walletService.ts')
  const walletServiceContent = fs.readFileSync(walletServicePath, 'utf8')
  
  if (walletServiceContent.includes("'flutterwave'")) {
    console.log('   ✅ Wallet service updated to support Flutterwave')
  } else {
    console.log('   ❌ Wallet service not updated')
  }
} catch (error) {
  console.log('   ❌ Could not check wallet service file')
}

// Test 6: Check if wallet fund page is updated
console.log('\n6. Checking wallet fund page...')
try {
  const fundPagePath = path.join(__dirname, '../app/(dashboard)/dashboard/wallet/fund/page.tsx')
  const fundPageContent = fs.readFileSync(fundPagePath, 'utf8')
  
  if (fundPageContent.includes('FlutterwavePayment')) {
    console.log('   ✅ Wallet fund page includes Flutterwave component')
  } else {
    console.log('   ❌ Wallet fund page not updated')
  }
  
  if (fundPageContent.includes('grid-cols-4')) {
    console.log('   ✅ Payment method grid updated to 4 columns')
  } else {
    console.log('   ❌ Payment method grid not updated')
  }
} catch (error) {
  console.log('   ❌ Could not check wallet fund page')
}

// Summary
console.log('\n' + '='.repeat(50))
console.log('🎯 SETUP SUMMARY')
console.log('='.repeat(50))

if (allFilesExist && envFound) {
  console.log('✅ Setup looks good! Next steps:')
  console.log('   1. Add your actual Flutterwave keys to .env.local')
  console.log('   2. Update your backend to handle Flutterwave verification')
  console.log('   3. Test the integration with small amounts')
  console.log('   4. Read FLUTTERWAVE_SETUP.md for detailed instructions')
} else {
  console.log('❌ Setup incomplete. Please check the items marked with ❌ above')
}

console.log('\n📚 Documentation:')
console.log('   • Setup Guide: FLUTTERWAVE_SETUP.md')
console.log('   • Flutterwave Docs: https://developer.flutterwave.com/docs')
console.log('   • Test Cards: Check lib/utils/testData.ts')

console.log('\n🚀 To start development server:')
console.log('   npm run dev')
console.log('   Then go to: http://localhost:3000/dashboard/wallet/fund')

console.log('\n🔧 Need help? Check the setup guide or create an issue.')
