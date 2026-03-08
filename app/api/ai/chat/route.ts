/**
 * Conversational Assistant API Route
 * 
 * Handles natural user questions in a safe, assistive, mobility-focused way
 * using Groq LLM. Domain-limited to assistive mobility support.
 * 
 * @route POST /api/ai/chat
 */

import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Initialize Groq client (server-side only)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// System prompt for conversational assistant
const SYSTEM_PROMPT = `You are a calm, supportive conversational assistant for NeuroLens Guardian, helping elderly users and people with cognitive disabilities.

Your role:
- Answer natural user questions about their journey and safety
- Provide SHORT, calm, reassuring responses (max 15 words)
- Stay within the assistive mobility domain ONLY
- Prioritize user safety and comfort

Domain limits:
- Navigation and wayfinding
- Safety and hazard awareness
- Safe Zone locations
- Guardian contact
- Safe Ride services
- Current location and route status

DO NOT answer questions about:
- General knowledge or trivia
- News or current events
- Personal advice unrelated to mobility
- Technical troubleshooting
- Medical advice

Response rules:
- Keep responses under 15 words
- Use simple, everyday language
- Be direct and actionable
- Stay calm even in emergencies
- If question is outside domain, politely redirect to mobility assistance

Always respond with JSON in this exact format:
{
  "reply": "Short, calm response (max 15 words)",
  "severity": "safe|info|warning|danger|emergency",
  "recommendedAction": "continue|find_safe_zone|notify_guardian|request_safe_ride|call_emergency|none",
  "shouldNotifyGuardian": true|false,
  "shouldSuggestSafeZone": true|false,
  "shouldSuggestSafeRide": true|false
}`

// Fallback responses for common questions
const FALLBACK_RESPONSES: Record<string, any> = {
  where_am_i: {
    reply: 'You are on your route. I can show you on the map.',
    severity: 'info',
    recommendedAction: 'none',
    shouldNotifyGuardian: false,
    shouldSuggestSafeZone: false,
    shouldSuggestSafeRide: false,
  },
  what_ahead: {
    reply: 'Clear path ahead. Continue with confidence.',
    severity: 'safe',
    recommendedAction: 'continue',
    shouldNotifyGuardian: false,
    shouldSuggestSafeZone: false,
    shouldSuggestSafeRide: false,
  },
  am_i_safe: {
    reply: 'Yes, you are safe. I am monitoring your journey.',
    severity: 'safe',
    recommendedAction: 'continue',
    shouldNotifyGuardian: false,
    shouldSuggestSafeZone: false,
    shouldSuggestSafeRide: false,
  },
  how_far_safe_zone: {
    reply: 'Safe Zone is nearby. Would you like to go there?',
    severity: 'info',
    recommendedAction: 'find_safe_zone',
    shouldNotifyGuardian: false,
    shouldSuggestSafeZone: true,
    shouldSuggestSafeRide: false,
  },
  call_guardian: {
    reply: 'Notifying your guardian now.',
    severity: 'info',
    recommendedAction: 'notify_guardian',
    shouldNotifyGuardian: true,
    shouldSuggestSafeZone: false,
    shouldSuggestSafeRide: false,
  },
  confused: {
    reply: 'I am here to help. Let me guide you to a Safe Zone.',
    severity: 'warning',
    recommendedAction: 'find_safe_zone',
    shouldNotifyGuardian: true,
    shouldSuggestSafeZone: true,
    shouldSuggestSafeRide: false,
  },
  help: {
    reply: 'I can guide you, find Safe Zones, or call your guardian.',
    severity: 'info',
    recommendedAction: 'none',
    shouldNotifyGuardian: false,
    shouldSuggestSafeZone: false,
    shouldSuggestSafeRide: false,
  },
}

/**
 * Get fallback response based on message
 */
function getFallbackResponse(message: string, context: any): any {
  const lowerMessage = message.toLowerCase()

  // Match common questions
  if (lowerMessage.includes('where') && (lowerMessage.includes('am i') || lowerMessage.includes('location'))) {
    return FALLBACK_RESPONSES.where_am_i
  }
  if (lowerMessage.includes('what') && lowerMessage.includes('ahead')) {
    const response = { ...FALLBACK_RESPONSES.what_ahead }
    if (context.latestHazard) {
      response.reply = `${context.latestHazard} ahead. Move carefully.`
      response.severity = context.hazardSeverity === 'high' ? 'warning' : 'info'
    }
    return response
  }
  if (lowerMessage.includes('safe') || lowerMessage.includes('okay')) {
    return FALLBACK_RESPONSES.am_i_safe
  }
  if (lowerMessage.includes('safe zone') || lowerMessage.includes('how far')) {
    const response = { ...FALLBACK_RESPONSES.how_far_safe_zone }
    if (context.nearestSafeZone) {
      response.reply = `${context.nearestSafeZone} is nearby. Let's go there.`
    }
    return response
  }
  if (lowerMessage.includes('guardian') || lowerMessage.includes('call')) {
    return FALLBACK_RESPONSES.call_guardian
  }
  if (lowerMessage.includes('confused') || lowerMessage.includes('lost')) {
    return FALLBACK_RESPONSES.confused
  }
  if (lowerMessage.includes('help')) {
    return FALLBACK_RESPONSES.help
  }

  // Default response
  return {
    reply: 'I understand. How can I assist you?',
    severity: 'info',
    recommendedAction: 'none',
    shouldNotifyGuardian: false,
    shouldSuggestSafeZone: false,
    shouldSuggestSafeRide: false,
  }
}

/**
 * POST /api/ai/chat
 * Generate conversational response
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { message, currentStatus, latestHazard, hazardSeverity, routeSummary, nearestSafeZone, guardianLinkStatus, safeRideStatus, languagePreference, accessibilityPreferences, uiMode } = body

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'Missing required field: message' },
        { status: 400 }
      )
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not configured, using fallback response')
      return NextResponse.json(getFallbackResponse(message, body))
    }

    // Build user prompt
    const userPrompt = `User question: "${message}"

Context:
- Current Status: ${currentStatus || 'safe'}
- Latest Hazard: ${latestHazard || 'none'} (severity: ${hazardSeverity || 'none'})
- Route: ${routeSummary || 'no active route'}
- Nearest Safe Zone: ${nearestSafeZone || 'unknown'}
- Guardian Status: ${guardianLinkStatus || 'connected'}
- Safe Ride Status: ${safeRideStatus || 'not_requested'}
- UI Mode: ${uiMode || 'normal'}

User Preferences:
- Language: ${languagePreference || 'English'}
- Simplified Instructions: ${accessibilityPreferences?.simplifiedInstructions || false}
- Calm Guidance Mode: ${accessibilityPreferences?.calmGuidanceMode || true}

Answer the user's question. Keep response SHORT (max 15 words). Stay within assistive mobility domain. Respond ONLY with valid JSON.`

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
      temperature: 0.4, // Slightly higher for conversational feel
      max_tokens: 150,
      response_format: { type: 'json_object' },
    })

    // Extract response
    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      console.warn('Empty response from Groq, using fallback')
      return NextResponse.json(getFallbackResponse(message, body))
    }

    // Parse JSON response
    let chatResponse
    try {
      chatResponse = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError)
      return NextResponse.json(getFallbackResponse(message, body))
    }

    // Validate response structure
    if (!chatResponse.reply || !chatResponse.severity) {
      console.warn('Invalid Groq response structure, using fallback')
      return NextResponse.json(getFallbackResponse(message, body))
    }

    // Ensure reply is not too long (safety check)
    if (chatResponse.reply.split(' ').length > 20) {
      chatResponse.reply = chatResponse.reply.split(' ').slice(0, 15).join(' ') + '...'
    }

    // Return response
    return NextResponse.json(chatResponse)

  } catch (error: any) {
    console.error('Error generating chat response:', error)

    // Return fallback on error
    const body = await request.json().catch(() => ({ message: '' }))
    return NextResponse.json(getFallbackResponse(body.message || '', body))
  }
}

/**
 * GET /api/ai/chat
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'NeuroLens Guardian Conversational Assistant',
    groqConfigured: !!process.env.GROQ_API_KEY,
  })
}
