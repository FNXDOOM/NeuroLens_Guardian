/**
 * Groq Guidance Service
 * 
 * Frontend service for fetching AI-generated guidance messages
 * from the backend Groq API route.
 * 
 * @module services/groqGuidance
 */

/**
 * Fetch AI guidance from backend
 * @param {Object} context - Application context
 * @param {string} context.currentStatus - Current status (safe, warning, distress, emergency)
 * @param {string} [context.destination] - Destination name
 * @param {string} [context.nearestSafeZone] - Nearest Safe Zone name
 * @param {string} [context.routeSummary] - Route summary
 * @param {string} [context.latestHazard] - Latest hazard type
 * @param {string} [context.hazardSeverity] - Hazard severity (low, medium, high)
 * @param {string[]} [context.detectedObjects] - Detected objects
 * @param {string} [context.distressReason] - Distress reason
 * @param {string} [context.guardianLinkStatus] - Guardian status
 * @param {string} [context.safeRideStatus] - Safe Ride status
 * @param {string} [context.languagePreference] - Language preference
 * @param {string} [context.uiMode] - UI mode (navigation, hazard, distress, emergency)
 * @param {Object} [context.accessibilityPreferences] - Accessibility preferences
 * @returns {Promise<Object>} Guidance response
 */
export async function fetchGuidance(context) {
  try {
    // Try Next.js API route first (if available)
    // Falls back to standalone server if Next.js route not available
    const apiUrl = process.env.NEXT_PUBLIC_GUIDANCE_API_URL || '/api/guidance'
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(context),
    })

    if (!response.ok) {
      throw new Error(`Guidance API error: ${response.status}`)
    }

    const guidance = await response.json()
    return guidance
  } catch (error) {
    console.error('Error fetching guidance:', error)
    
    // Return fallback guidance
    return getFallbackGuidance(context)
  }
}

/**
 * Get fallback guidance when API fails
 * @param {Object} context - Application context
 * @returns {Object} Fallback guidance
 */
function getFallbackGuidance(context) {
  const fallbacks = {
    emergency: {
      message: 'Emergency support is active. Help is coming.',
      severity: 'emergency',
      recommendedAction: 'notify_guardian',
      alternateShortMessage: 'Help is coming.',
      voiceFriendlyMessage: 'Emergency support is active. Your guardian has been notified. Help is on the way.',
    },
    distress: {
      message: 'Let me help you find a Safe Zone.',
      severity: 'warning',
      recommendedAction: 'route_to_safe_zone',
      alternateShortMessage: 'Safe Zone nearby.',
      voiceFriendlyMessage: 'Let me help you find a nearby Safe Zone where you can rest.',
    },
    vehicle: {
      message: 'Vehicle ahead. Please slow down.',
      severity: 'warning',
      recommendedAction: 'avoid_left',
      alternateShortMessage: 'Vehicle ahead.',
      voiceFriendlyMessage: 'Vehicle ahead. Please slow down and move carefully.',
    },
    obstacle: {
      message: 'Obstacle ahead. Move carefully.',
      severity: 'warning',
      recommendedAction: 'avoid_left',
      alternateShortMessage: 'Obstacle ahead.',
      voiceFriendlyMessage: 'Obstacle ahead. Please move carefully around it.',
    },
    crowded: {
      message: 'Crowded path. Stay aware.',
      severity: 'info',
      recommendedAction: 'continue',
      alternateShortMessage: 'Crowded path.',
      voiceFriendlyMessage: 'The path is crowded. Please stay aware of your surroundings.',
    },
    off_route: {
      message: 'You seem off route. I can guide you back.',
      severity: 'warning',
      recommendedAction: 'route_to_safe_zone',
      alternateShortMessage: 'Off route.',
      voiceFriendlyMessage: 'You seem to be off route. I can guide you back to your destination.',
    },
    safe: {
      message: 'All clear. Continue with confidence.',
      severity: 'safe',
      recommendedAction: 'continue',
      alternateShortMessage: 'All clear.',
      voiceFriendlyMessage: 'All clear. Continue with confidence.',
    },
  }

  // Determine which fallback to use
  if (context.currentStatus === 'emergency') {
    return fallbacks.emergency
  }
  if (context.currentStatus === 'distress') {
    return fallbacks.distress
  }
  if (context.latestHazard === 'vehicle' || context.latestHazard === 'car') {
    return fallbacks.vehicle
  }
  if (context.latestHazard === 'obstacle') {
    return fallbacks.obstacle
  }
  if (context.latestHazard === 'person' || context.detectedObjects?.includes('person')) {
    return fallbacks.crowded
  }
  if (context.distressReason?.includes('off_route')) {
    return fallbacks.off_route
  }

  return fallbacks.safe
}

/**
 * Build context object from app state
 * @param {Object} state - Application state
 * @returns {Object} Context for guidance API
 */
export function buildGuidanceContext(state) {
  const context = {
    currentStatus: state.distressStatus || 'safe',
    destination: state.destination?.name || null,
    nearestSafeZone: state.nearestSafeZone?.name || null,
    routeSummary: state.routeSummary || null,
    latestHazard: state.latestHazard?.class || state.latestHazard?.category || null,
    hazardSeverity: state.latestHazard?.severity || null,
    detectedObjects: state.recentDetections?.map(d => d.class) || [],
    distressReason: state.distressReason || null,
    guardianLinkStatus: state.guardianNotified ? 'notified' : 'connected',
    safeRideStatus: state.safeRideActive ? 'requested' : 'not_requested',
    languagePreference: state.languagePreference || 'English',
    uiMode: determineUIMode(state),
    accessibilityPreferences: {
      simplifiedInstructions: state.simplifiedInstructions || false,
      calmGuidanceMode: state.calmGuidanceMode !== false, // Default true
      largeTextMode: state.largeTextMode || false,
    },
  }

  return context
}

/**
 * Determine UI mode from state
 * @param {Object} state - Application state
 * @returns {string} UI mode
 */
function determineUIMode(state) {
  if (state.distressStatus === 'emergency') return 'emergency'
  if (state.distressStatus === 'distress') return 'distress'
  if (state.latestHazard?.severity === 'danger') return 'hazard'
  if (state.isNavigating) return 'navigation'
  return 'safe'
}

/**
 * Check if guidance should be refreshed
 * @param {Object} prevState - Previous state
 * @param {Object} newState - New state
 * @returns {boolean} Should refresh
 */
export function shouldRefreshGuidance(prevState, newState) {
  // Trigger 1: New hazard appears
  if (prevState.latestHazard?.id !== newState.latestHazard?.id) {
    return true
  }

  // Trigger 2: Distress state changes
  if (prevState.distressStatus !== newState.distressStatus) {
    return true
  }

  // Trigger 3: Route deviation occurs
  if (!prevState.isOffRoute && newState.isOffRoute) {
    return true
  }

  // Trigger 4: Safe Zone becomes recommended
  if (!prevState.safeZoneRecommended && newState.safeZoneRecommended) {
    return true
  }

  // Trigger 5: Emergency is triggered
  if (!prevState.isEmergency && newState.isEmergency) {
    return true
  }

  return false
}

/**
 * Simplify guidance message
 * @param {string} message - Original message
 * @returns {string} Simplified message
 */
export function simplifyMessage(message) {
  // Extract key action words
  const simplified = message
    .replace(/Please /gi, '')
    .replace(/You should /gi, '')
    .replace(/I recommend /gi, '')
    .replace(/slightly /gi, '')
    .split('.')[0] // Take first sentence only

  return simplified
}

/**
 * Convert guidance to voice-friendly format
 * @param {Object} guidance - Guidance object
 * @returns {string} Voice-friendly message
 */
export function toVoiceFriendly(guidance) {
  return guidance.voiceFriendlyMessage || guidance.message
}

export default {
  fetchGuidance,
  buildGuidanceContext,
  shouldRefreshGuidance,
  simplifyMessage,
  toVoiceFriendly,
  getFallbackGuidance,
}
