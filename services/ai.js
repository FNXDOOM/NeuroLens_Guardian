/**
 * AI Service - Groq Integration (Backend Only)
 * 
 * This module provides AI-powered features for the NeuroLens Guardian platform.
 * 
 * IMPORTANT: Groq API integration should ONLY be done through backend API routes
 * to keep the API key secure. Never expose the Groq API key in client-side code.
 * 
 * @module services/ai
 */

/**
 * Backend API endpoint for AI features
 * This should point to your Next.js API routes
 */
const AI_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

/**
 * AI Service Functions
 * 
 * These functions call backend API routes which then communicate with Groq.
 * The Groq API key is stored securely in backend environment variables.
 */

/**
 * Get AI guidance for navigation
 * 
 * @param {Object} context - Navigation context
 * @param {Object} context.location - Current location {lat, lng}
 * @param {Object} context.destination - Destination {lat, lng, name}
 * @param {Array} context.detections - Recent hazard detections
 * @param {string} context.userState - User's current state (calm, confused, distressed)
 * @returns {Promise<Object>} AI guidance response
 * 
 * @example
 * const guidance = await getNavigationGuidance({
 *   location: { lat: 40.7580, lng: -73.9855 },
 *   destination: { lat: 40.7614, lng: -73.9765, name: 'City Pharmacy' },
 *   detections: [{ type: 'vehicle', distance: 8, status: 'danger' }],
 *   userState: 'calm'
 * })
 */
export const getNavigationGuidance = async (context) => {
  try {
    // TODO: Implement backend API route at /api/ai/guidance
    // Backend route will use Groq API to generate contextual guidance
    
    const response = await fetch(`${AI_API_BASE}/api/ai/guidance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(context),
    })

    if (!response.ok) {
      throw new Error('Failed to get AI guidance')
    }

    const data = await response.json()
    return {
      success: true,
      message: data.message,
      priority: data.priority, // low, medium, high, critical
      actions: data.actions, // Suggested actions
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('AI guidance error:', error)
    
    // Fallback to simple guidance if AI service is unavailable
    return getFallbackGuidance(context)
  }
}

/**
 * Analyze user distress level
 * 
 * @param {Object} context - User safety context
 * @param {string} context.currentStatus - Current status (safe, warning, distress, emergency)
 * @param {string} context.distressReason - Reason for distress
 * @param {string} context.latestHazard - Latest detected hazard
 * @param {string} context.hazardSeverity - Hazard severity level
 * @param {number} context.routeDeviation - How far off route (meters)
 * @param {number} context.idleTime - Time user has been idle (seconds)
 * @param {string} context.nearestSafeZone - Nearest Safe Zone name
 * @param {string} context.guardianLinkStatus - Guardian connection status
 * @param {string} context.safeRideStatus - Safe Ride request status
 * @param {string} context.languagePreference - User's language preference
 * @param {Object} context.accessibilityPreferences - Accessibility settings
 * @returns {Promise<Object>} Distress analysis with recommendations
 * 
 * @example
 * const analysis = await analyzeDistress({
 *   currentStatus: 'distress',
 *   distressReason: 'off_route_with_vehicle_hazard',
 *   latestHazard: 'vehicle',
 *   hazardSeverity: 'high',
 *   routeDeviation: 42,
 *   idleTime: 18,
 *   nearestSafeZone: 'City Pharmacy',
 *   guardianLinkStatus: 'connected',
 *   safeRideStatus: 'not_requested',
 *   languagePreference: 'English',
 *   accessibilityPreferences: { simplifiedInstructions: true, calmGuidanceMode: true }
 * })
 */
export const analyzeDistress = async (context) => {
  try {
    const response = await fetch(`${AI_API_BASE}/api/ai/distress-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(context),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze distress')
    }

    const data = await response.json()
    return {
      success: true,
      distressSummary: data.distressSummary,
      urgencyLevel: data.urgencyLevel,
      recommendedPrimaryAction: data.recommendedPrimaryAction,
      recommendedSecondaryAction: data.recommendedSecondaryAction,
      safeZoneRecommendation: data.safeZoneRecommendation,
      guardianRecommendation: data.guardianRecommendation,
      safeRideRecommendation: data.safeRideRecommendation,
      userFacingMessage: data.userFacingMessage,
      caregiverFacingMessage: data.caregiverFacingMessage,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('Distress analysis error:', error)
    
    // Fallback to rule-based analysis
    return getFallbackDistressAnalysis(context)
  }
}

/**
 * Generate conversational response
 * 
 * @param {Object} params - Conversation parameters
 * @param {string} params.message - User's message/question
 * @param {string} params.currentStatus - Current status (safe, warning, distress, emergency)
 * @param {string} params.latestHazard - Latest detected hazard
 * @param {string} params.hazardSeverity - Hazard severity level
 * @param {string} params.routeSummary - Current route summary
 * @param {string} params.nearestSafeZone - Nearest Safe Zone name
 * @param {string} params.guardianLinkStatus - Guardian connection status
 * @param {string} params.safeRideStatus - Safe Ride request status
 * @param {string} params.languagePreference - User's language preference
 * @param {Object} params.accessibilityPreferences - Accessibility settings
 * @param {string} params.uiMode - Current UI mode
 * @returns {Promise<Object>} AI conversational response
 * 
 * @example
 * const response = await generateResponse({
 *   message: 'What is ahead?',
 *   currentStatus: 'warning',
 *   latestHazard: 'vehicle',
 *   hazardSeverity: 'high',
 *   routeSummary: 'Continue straight for 20 meters',
 *   nearestSafeZone: 'City Pharmacy',
 *   guardianLinkStatus: 'connected',
 *   safeRideStatus: 'not_requested',
 *   languagePreference: 'English',
 *   accessibilityPreferences: { simplifiedInstructions: true, calmGuidanceMode: true },
 *   uiMode: 'hazard'
 * })
 */
export const generateResponse = async (params) => {
  try {
    const response = await fetch(`${AI_API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to generate response')
    }

    const data = await response.json()
    return {
      success: true,
      reply: data.reply,
      severity: data.severity,
      recommendedAction: data.recommendedAction,
      shouldNotifyGuardian: data.shouldNotifyGuardian,
      shouldSuggestSafeZone: data.shouldSuggestSafeZone,
      shouldSuggestSafeRide: data.shouldSuggestSafeRide,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('AI chat error:', error)
    
    // Fallback to template responses
    return getFallbackResponse(params.message, params)
  }
}

/**
 * Simplify navigation/safety instruction
 * 
 * @param {Object} params - Simplification parameters
 * @param {string} params.originalMessage - Complex instruction to simplify
 * @param {string} params.languagePreference - User's language preference
 * @param {boolean} params.calmGuidanceMode - Calm guidance mode enabled
 * @param {boolean} params.simplifiedInstructions - Simplified instructions enabled
 * @param {string} params.userAccessibilityMode - User's accessibility mode
 * @returns {Promise<Object>} Simplified instruction versions
 * 
 * @example
 * const simplified = await simplifyInstructions({
 *   originalMessage: 'Proceed along the current route and turn slightly left to avoid the approaching vehicle.',
 *   languagePreference: 'English',
 *   calmGuidanceMode: true,
 *   simplifiedInstructions: true,
 *   userAccessibilityMode: 'cognitive_support'
 * })
 */
export const simplifyInstructions = async (params) => {
  try {
    const response = await fetch(`${AI_API_BASE}/api/ai/simplify-instruction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to simplify instructions')
    }

    const data = await response.json()
    return {
      success: true,
      simplifiedMessage: data.simplifiedMessage,
      extraShortMessage: data.extraShortMessage,
      voiceFriendlyMessage: data.voiceFriendlyMessage,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('Instruction simplification error:', error)
    
    // Fallback to basic simplification
    const originalMessage = params.originalMessage || ''
    const firstSentence = originalMessage.split(/[.!?]/)[0].trim()
    return {
      success: true,
      simplifiedMessage: firstSentence,
      extraShortMessage: firstSentence.split(' ').slice(0, 5).join(' '),
      voiceFriendlyMessage: firstSentence,
      timestamp: new Date(),
    }
  }
}

/**
 * Fallback functions when AI service is unavailable
 * These provide basic functionality without AI
 */

const getFallbackGuidance = (context) => {
  const messages = [
    'Continue straight ahead.',
    'Stay on your current path.',
    'You are heading in the right direction.',
  ]

  // Check for hazards
  if (context.detections && context.detections.length > 0) {
    const dangerousDetections = context.detections.filter(d => d.status === 'danger')
    if (dangerousDetections.length > 0) {
      return {
        success: true,
        message: 'Obstacle detected ahead. Please proceed with caution.',
        priority: 'high',
        actions: ['stop', 'wait'],
        timestamp: new Date(),
      }
    }
  }

  return {
    success: true,
    message: messages[Math.floor(Math.random() * messages.length)],
    priority: 'low',
    actions: ['continue'],
    timestamp: new Date(),
  }
}

const getFallbackDistressAnalysis = (context) => {
  const status = context.currentStatus || 'safe'
  const hazardSeverity = context.hazardSeverity || 'low'
  
  let urgencyLevel = 'low'
  let primaryAction = 'continue_monitoring'
  let userMessage = 'All clear. Continue with confidence.'
  let caregiverMessage = 'User status normal. Continue monitoring.'

  if (status === 'emergency') {
    urgencyLevel = 'critical'
    primaryAction = 'call_emergency'
    userMessage = 'Help is on the way. Stay calm.'
    caregiverMessage = 'EMERGENCY: User activated SOS. Immediate response required.'
  } else if (status === 'distress') {
    urgencyLevel = 'high'
    primaryAction = 'notify_guardian'
    userMessage = 'Let me help you find a Safe Zone.'
    caregiverMessage = 'DISTRESS: User showing distress indicators. Guardian notification recommended.'
  } else if (hazardSeverity === 'high') {
    urgencyLevel = 'medium'
    primaryAction = 'route_to_safe_zone'
    userMessage = 'Hazard detected. Moving to safer path.'
    caregiverMessage = 'WARNING: High-severity hazard detected. Monitor closely.'
  }

  return {
    success: true,
    distressSummary: `Status: ${status}, Hazard: ${hazardSeverity}`,
    urgencyLevel,
    recommendedPrimaryAction: primaryAction,
    recommendedSecondaryAction: 'continue_monitoring',
    safeZoneRecommendation: urgencyLevel !== 'low',
    guardianRecommendation: urgencyLevel === 'high' || urgencyLevel === 'critical',
    safeRideRecommendation: false,
    userFacingMessage: userMessage,
    caregiverFacingMessage: caregiverMessage,
    timestamp: new Date(),
  }
}

const getFallbackResponse = (userMessage, context) => {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes('where') && (lowerMessage.includes('am i') || lowerMessage.includes('location'))) {
    return {
      success: true,
      reply: 'You are on your route. I can show you on the map.',
      severity: 'info',
      recommendedAction: 'none',
      shouldNotifyGuardian: false,
      shouldSuggestSafeZone: false,
      shouldSuggestSafeRide: false,
      timestamp: new Date(),
    }
  }

  if (lowerMessage.includes('what') && lowerMessage.includes('ahead')) {
    return {
      success: true,
      reply: context.latestHazard ? `${context.latestHazard} ahead. Move carefully.` : 'Clear path ahead. Continue with confidence.',
      severity: context.hazardSeverity === 'high' ? 'warning' : 'safe',
      recommendedAction: 'continue',
      shouldNotifyGuardian: false,
      shouldSuggestSafeZone: false,
      shouldSuggestSafeRide: false,
      timestamp: new Date(),
    }
  }

  if (lowerMessage.includes('safe') || lowerMessage.includes('okay')) {
    return {
      success: true,
      reply: 'Yes, you are safe. I am monitoring your journey.',
      severity: 'safe',
      recommendedAction: 'continue',
      shouldNotifyGuardian: false,
      shouldSuggestSafeZone: false,
      shouldSuggestSafeRide: false,
      timestamp: new Date(),
    }
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('lost') || lowerMessage.includes('confused')) {
    return {
      success: true,
      reply: 'I am here to help. Let me guide you to a Safe Zone.',
      severity: 'warning',
      recommendedAction: 'find_safe_zone',
      shouldNotifyGuardian: true,
      shouldSuggestSafeZone: true,
      shouldSuggestSafeRide: false,
      timestamp: new Date(),
    }
  }

  if (lowerMessage.includes('guardian') || lowerMessage.includes('call')) {
    return {
      success: true,
      reply: 'Notifying your guardian now.',
      severity: 'info',
      recommendedAction: 'notify_guardian',
      shouldNotifyGuardian: true,
      shouldSuggestSafeZone: false,
      shouldSuggestSafeRide: false,
      timestamp: new Date(),
    }
  }

  return {
    success: true,
    reply: 'I understand. How can I assist you?',
    severity: 'info',
    recommendedAction: 'none',
    shouldNotifyGuardian: false,
    shouldSuggestSafeZone: false,
    shouldSuggestSafeRide: false,
    timestamp: new Date(),
  }
}

/**
 * BACKEND ROUTES IMPLEMENTED:
 * 
 * ✓ /api/ai/distress-analysis - POST
 *   Analyzes user safety context and returns structured distress-support recommendations
 * 
 * ✓ /api/ai/chat - POST
 *   Handles conversational queries with domain-limited assistive mobility responses
 * 
 * ✓ /api/ai/simplify-instruction - POST
 *   Simplifies complex instructions for users with cognitive accessibility needs
 * 
 * All routes use Groq LLM with secure backend-only API key handling.
 * All routes include comprehensive fallback logic when Groq is unavailable.
 */

export default {
  getNavigationGuidance,
  analyzeDistress,
  generateResponse,
  simplifyInstructions,
}
