/**
 * AI Routes Test Utility
 * 
 * Simple test functions to validate the AI backend routes.
 * Use these in the browser console or demo panel to test AI functionality.
 * 
 * @module utils/testAIRoutes
 */

const AI_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

/**
 * Test distress analysis endpoint
 */
export async function testDistressAnalysis() {
  console.log('🧪 Testing Distress Analysis...')
  
  const payload = {
    currentStatus: 'distress',
    distressReason: 'off_route_with_vehicle_hazard',
    latestHazard: 'vehicle',
    hazardSeverity: 'high',
    routeDeviation: 42,
    idleTime: 18,
    nearestSafeZone: 'City Pharmacy',
    guardianLinkStatus: 'connected',
    safeRideStatus: 'not_requested',
    languagePreference: 'English',
    accessibilityPreferences: {
      simplifiedInstructions: true,
      calmGuidanceMode: true,
    },
  }

  try {
    const response = await fetch(`${AI_API_BASE}/api/ai/distress-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log('✅ Distress Analysis Response:', data)
    return data
  } catch (error) {
    console.error('❌ Distress Analysis Error:', error)
    return null
  }
}

/**
 * Test conversational chat endpoint
 */
export async function testChat(message = 'What is ahead?') {
  console.log(`🧪 Testing Chat with message: "${message}"`)
  
  const payload = {
    message,
    currentStatus: 'warning',
    latestHazard: 'vehicle',
    hazardSeverity: 'high',
    routeSummary: 'Continue straight for 20 meters',
    nearestSafeZone: 'City Pharmacy',
    guardianLinkStatus: 'connected',
    safeRideStatus: 'not_requested',
    languagePreference: 'English',
    accessibilityPreferences: {
      simplifiedInstructions: true,
      calmGuidanceMode: true,
    },
    uiMode: 'hazard',
  }

  try {
    const response = await fetch(`${AI_API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log('✅ Chat Response:', data)
    return data
  } catch (error) {
    console.error('❌ Chat Error:', error)
    return null
  }
}

/**
 * Test instruction simplification endpoint
 */
export async function testSimplifyInstruction(originalMessage = 'Proceed along the current route and turn slightly left to avoid the approaching vehicle.') {
  console.log(`🧪 Testing Simplify Instruction with: "${originalMessage}"`)
  
  const payload = {
    originalMessage,
    languagePreference: 'English',
    calmGuidanceMode: true,
    simplifiedInstructions: true,
    userAccessibilityMode: 'cognitive_support',
  }

  try {
    const response = await fetch(`${AI_API_BASE}/api/ai/simplify-instruction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log('✅ Simplify Instruction Response:', data)
    return data
  } catch (error) {
    console.error('❌ Simplify Instruction Error:', error)
    return null
  }
}

/**
 * Test all AI routes
 */
export async function testAllAIRoutes() {
  console.log('🧪 Testing All AI Routes...\n')
  
  const results = {
    distressAnalysis: await testDistressAnalysis(),
    chat: await testChat(),
    simplifyInstruction: await testSimplifyInstruction(),
  }

  console.log('\n📊 Test Summary:')
  console.log('Distress Analysis:', results.distressAnalysis ? '✅ PASS' : '❌ FAIL')
  console.log('Chat:', results.chat ? '✅ PASS' : '❌ FAIL')
  console.log('Simplify Instruction:', results.simplifyInstruction ? '✅ PASS' : '❌ FAIL')

  return results
}

/**
 * Test health check endpoints
 */
export async function testHealthChecks() {
  console.log('🧪 Testing Health Checks...\n')

  const endpoints = [
    '/api/ai/distress-analysis',
    '/api/ai/chat',
    '/api/ai/simplify-instruction',
  ]

  const results = {}

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${AI_API_BASE}${endpoint}`, {
        method: 'GET',
      })
      const data = await response.json()
      results[endpoint] = data
      console.log(`✅ ${endpoint}:`, data)
    } catch (error) {
      results[endpoint] = { error: error.message }
      console.error(`❌ ${endpoint}:`, error)
    }
  }

  return results
}

/**
 * Sample test payloads for manual testing
 */
export const SAMPLE_PAYLOADS = {
  distressAnalysis: {
    currentStatus: 'distress',
    distressReason: 'off_route_with_vehicle_hazard',
    latestHazard: 'vehicle',
    hazardSeverity: 'high',
    routeDeviation: 42,
    idleTime: 18,
    nearestSafeZone: 'City Pharmacy',
    guardianLinkStatus: 'connected',
    safeRideStatus: 'not_requested',
    languagePreference: 'English',
    accessibilityPreferences: {
      simplifiedInstructions: true,
      calmGuidanceMode: true,
    },
  },
  
  chat: {
    message: 'What is ahead?',
    currentStatus: 'warning',
    latestHazard: 'vehicle',
    hazardSeverity: 'high',
    routeSummary: 'Continue straight for 20 meters',
    nearestSafeZone: 'City Pharmacy',
    guardianLinkStatus: 'connected',
    safeRideStatus: 'not_requested',
    languagePreference: 'English',
    accessibilityPreferences: {
      simplifiedInstructions: true,
      calmGuidanceMode: true,
    },
    uiMode: 'hazard',
  },
  
  simplifyInstruction: {
    originalMessage: 'Proceed along the current route and turn slightly left to avoid the approaching vehicle.',
    languagePreference: 'English',
    calmGuidanceMode: true,
    simplifiedInstructions: true,
    userAccessibilityMode: 'cognitive_support',
  },
}

/**
 * Common test questions for chat
 */
export const TEST_QUESTIONS = [
  'What is ahead?',
  'Where am I?',
  'Am I safe?',
  'How far is the Safe Zone?',
  'What should I do?',
  'Call my guardian',
  'I am confused',
  'Help me',
]

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.testAI = {
    testDistressAnalysis,
    testChat,
    testSimplifyInstruction,
    testAllAIRoutes,
    testHealthChecks,
    SAMPLE_PAYLOADS,
    TEST_QUESTIONS,
  }
  console.log('💡 AI Test utilities loaded. Use window.testAI to test routes.')
}

export default {
  testDistressAnalysis,
  testChat,
  testSimplifyInstruction,
  testAllAIRoutes,
  testHealthChecks,
  SAMPLE_PAYLOADS,
  TEST_QUESTIONS,
}
