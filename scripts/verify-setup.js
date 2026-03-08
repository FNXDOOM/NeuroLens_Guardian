/**
 * Environment Setup Verification Script
 * 
 * Run this script to verify that all environment variables are configured correctly.
 * 
 * Usage: node scripts/verify-setup.js
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying NeuroLens Guardian Environment Setup...\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.error('❌ .env.local file not found!')
  console.log('   Create it by copying .env.example:')
  console.log('   cp .env.example .env.local\n')
  process.exit(1)
}

console.log('✅ .env.local file exists\n')

// Load environment variables
require('dotenv').config({ path: envPath })

// Required environment variables
const requiredVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'Supabase URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase Anonymous Key',
  'NEXT_PUBLIC_MAPTILER_API_KEY': 'MapTiler API Key',
  'NEXT_PUBLIC_ORS_API_KEY': 'OpenRouteService API Key',
}

let allConfigured = true

console.log('Checking required environment variables:\n')

for (const [varName, description] of Object.entries(requiredVars)) {
  const value = process.env[varName]
  
  if (!value || value.includes('your_')) {
    console.log(`❌ ${varName}`)
    console.log(`   ${description} is not configured\n`)
    allConfigured = false
  } else {
    const maskedValue = value.substring(0, 10) + '...' + value.substring(value.length - 4)
    console.log(`✅ ${varName}`)
    console.log(`   ${maskedValue}\n`)
  }
}

// Optional variables
console.log('Optional environment variables:\n')

const optionalVars = {
  'GROQ_API_KEY': 'Groq API Key (Backend only)',
}

for (const [varName, description] of Object.entries(optionalVars)) {
  const value = process.env[varName]
  
  if (!value || value.includes('your_')) {
    console.log(`⚠️  ${varName}`)
    console.log(`   ${description} is not configured (optional)\n`)
  } else {
    const maskedValue = value.substring(0, 10) + '...' + value.substring(value.length - 4)
    console.log(`✅ ${varName}`)
    console.log(`   ${maskedValue}\n`)
  }
}

// Check if services directory exists
const servicesPath = path.join(process.cwd(), 'services')
const servicesExists = fs.existsSync(servicesPath)

if (!servicesExists) {
  console.error('❌ services/ directory not found!')
  allConfigured = false
} else {
  console.log('✅ services/ directory exists')
  
  // Check for service files
  const serviceFiles = ['supabase.js', 'maps.js', 'navigation.js', 'ai.js', 'index.js']
  let allServicesExist = true
  
  for (const file of serviceFiles) {
    const filePath = path.join(servicesPath, file)
    if (!fs.existsSync(filePath)) {
      console.log(`   ❌ ${file} not found`)
      allServicesExist = false
    }
  }
  
  if (allServicesExist) {
    console.log('   ✅ All service files present')
  }
}

console.log('\n' + '='.repeat(60) + '\n')

if (allConfigured) {
  console.log('✅ Environment setup is complete!')
  console.log('\nYou can now run:')
  console.log('  npm run dev\n')
  process.exit(0)
} else {
  console.log('⚠️  Environment setup is incomplete')
  console.log('\nPlease configure the missing environment variables in .env.local')
  console.log('See SERVICES_README.md for detailed setup instructions\n')
  process.exit(1)
}
