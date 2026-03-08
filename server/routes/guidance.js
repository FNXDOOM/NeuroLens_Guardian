/**
 * Guidance API Routes
 * 
 * Handles Groq API calls for AI-generated guidance messages.
 */

import express from 'express'
import Groq from 'groq-sdk'

const router = express.Router()

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// System prompt for NeuroLens Guardian assistant
const SYSTEM_PROMPT = `You are a calm, supportive mobility assistant for NeuroLens Guardian, helping elderly users and people with cognitive disabilities navigate safely.

Your role:
- Provide SHORT, clear navigation guidance (max 15 words)
- Use simple, everyday language
- Prioritize immediate safety
- Be reassuring but not patronizing
- Sound like a gentle real-world guide, not a robot

Response rules:
- Keep messages under 15 words
- Use simple verbs: walk, move, turn, stop, wait
- Avoid technical terms or jargon
- No complex sentences
- Be direct and actionable
- Stay calm even in emergencies

Safety priorities:
1. Immediate hazards (vehicles, obstacles)
2. Route guidance (stay on path)
3. Safe Zone recommendations (when distressed)
4. Guardian support (when needed)
5. Safe Ride (last resort)

Tone examples:
✓ "Vehicle ahead. Move left."
✓ "Walk straight for 20 meters."
✓ "You're off route. Let me guide you back."
✓ "Safe Zone nearby. Would you like to go there?"
✗ "Please be advised that a vehicular obstruction has been detected."
✗ "Initiating route recalculation protocol."

Always respond with JSON in this exact format:
{
  "message": "Main guidance message (max 15 words)",
  "severity": "safe|info|warning|danger|emergency",
  "recommendedAction": "continue|avoid_left|avoid_right|stop|route_to_safe_zone|notify_guardian|request_safe_ride",
  "alternateShortMessage": "Even shorter version (max 5 words)",
  "voiceFriendlyMessage": "Slightly expanded for voice (max 20 words)"
}`

// Fallback responses
const FALLBACK_RESPONSES = {
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
  distress: {
    message: 'Let me help you find a Safe Zone.',
    severity: 'warning',
    recommendedAction: 'route_to_safe_zone',
    alternateShortMessage: 'Safe Zone nearby.',
    voiceFriendlyMessage: 'Let me help you find a nearby Safe Zone where you can rest.',
  },
  emergency: {
    message: 'Emergency support is active. Help is coming.',
    severity: 'emergency',
    recommendedAction: 'notify_guardian',
    alternateShortMessage: 'Help is coming.',
    voiceFriendlyMessage: 'Emergency support is active. Your guardian has been notified. Help is on the way.',
  },
  safe: {
    message: 'All clear. Continue with confidence.',
    severity: 'safe',
    recommendedAction: 'continue',
    alternateShortMessage: 'All clear.',
    voiceFriendlyMessage: 'All clear. Continue with confidence.',
  },
}

/**
 * Generate user prompt from context
 */
function generateUserPrompt(context) {
  const parts = []

  parts.push(`Current status: ${context.currentStatus || 'safe'}`)

  if (context.destination) {
    parts.push(`Destination: ${context.destination}`)
  }

  if (context.routeSummary) {
    parts.push(`Route: ${context.routeSummary}`)
  }

  if (context.latestHazard) {
    parts.push(`Hazard detected: ${context.latestHazard} (severity: ${context.hazardSeverity || 'medium'})`)
  }

  if (context.detectedObjects && context.detectedObjects.length > 0) {
    parts.push(`Objects: ${context.detectedObjects.join(', ')}`)
  }

  if (context.distressReason) {
    parts.push(`Issue: ${context.distressReason}`)
  }

  if (context.nearestSafeZone) {
    parts.push(`Nearest Safe Zone: ${context.nearestSafeZone}`)
  }

  if (context.uiMode) {
    parts.push(`Mode: ${context.uiMode}`)
  }

  if (context.accessibilityPreferences) {
    const prefs = context.accessibilityPreferences
    if (prefs.simplifiedInstructions) {
      parts.push('User needs: simplified instructions')
    }
    if (prefs.calmGuidanceMode) {
      parts.push('User needs: calm, reassuring tone')
    }
  }

  if (context.guardianLinkStatus === 'notified') {
    parts.push('Guardian has been notified')
  }
  if (context.safeRideStatus === 'requested') {
    parts.push('Safe Ride has been requested')
  }

  parts.push('\nProvide SHORT, calm guidance (max 15 words). Respond ONLY with valid JSON.')

  return parts.join('\n')
}

/**
 * Get fallback response based on context
 */
function getFallbackResponse(context) {
  if (context.currentStatus === 'emergency') {
    return FALLBACK_RESPONSES.emergency
  }
  if (context.currentStatus === 'distress') {
    return FALLBACK_RESPONSES.distress
  }
  if (context.latestHazard === 'vehicle' || context.latestHazard === 'car') {
    return FALLBACK_RESPONSES.vehicle
  }
  if (context.latestHazard === 'obstacle') {
    return FALLBACK_RESPONSES.obstacle
  }
  if (context.latestHazard === 'person' || context.detectedObjects?.includes('person')) {
    return FALLBACK_RESPONSES.crowded
  }
  if (context.distressReason?.includes('off_route')) {
    return FALLBACK_RESPONSES.off_route
  }
  
  return FALLBACK_RESPONSES.safe
}

/**
 * POST /api/guidance
 * Generate AI guidance based on app context
 */
router.post('/', async (req, res) => {
  try {
    const context = req.body

    // Validate required fields
    if (!context.currentStatus) {
      return res.status(400).json({
        error: 'Missing required field: currentStatus',
      })
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not configured, using fallback response')
      return res.json(getFallbackResponse(context))
    }

    // Generate user prompt
    const userPrompt = generateUserPrompt(context)

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.3,
      max_tokens: 150,
      top_p: 0.9,
      response_format: { type: 'json_object' },
    })

    // Extract response
    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      console.warn('Empty response from Groq, using fallback')
      return res.json(getFallbackResponse(context))
    }

    // Parse JSON response
    let guidance
    try {
      guidance = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError)
      return res.json(getFallbackResponse(context))
    }

    // Validate response structure
    if (!guidance.message || !guidance.severity) {
      console.warn('Invalid Groq response structure, using fallback')
      return res.json(getFallbackResponse(context))
    }

    // Ensure message is not too long
    if (guidance.message.split(' ').length > 20) {
      guidance.message = guidance.message.split(' ').slice(0, 15).join(' ') + '...'
    }

    // Return guidance
    res.json(guidance)

  } catch (error) {
    console.error('Error generating guidance:', error)
    res.json(getFallbackResponse(req.body))
  }
})

/**
 * GET /api/guidance
 * Health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    endpoint: 'Guidance API',
    groqConfigured: !!process.env.GROQ_API_KEY,
  })
})

export default router
