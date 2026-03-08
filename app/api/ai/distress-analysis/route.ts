/**
 * Distress Analysis API Route
 * 
 * Analyzes user safety context and returns structured distress-support recommendations
 * using Groq LLM. Keeps API key secure on the backend.
 * 
 * @route POST /api/ai/distress-analysis
 */

import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Initialize Groq client (server-side only)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// System prompt for distress analysis
const SYSTEM_PROMPT = `You are a safety analysis assistant for NeuroLens Guardian, analyzing distress situations for elderly users and people with cognitive disabilities.

Your role:
- Analyze the user's current safety context
- Determine urgency level
- Recommend appropriate support actions
- Generate calm, supportive messages

Response rules:
- Be objective but compassionate
- Prioritize user safety
- Recommend escalation when needed
- Keep user messages SHORT and calm (max 15 words)
- Keep caregiver messages clear and operational

Always respond with JSON in this exact format:
{
  "distressSummary": "Brief analysis of the situation",
  "urgencyLevel": "low|medium|high|critical",
  "recommendedPrimaryAction": "continue_monitoring|route_to_safe_zone|notify_guardian|request_safe_ride|call_emergency",
  "recommendedSecondaryAction": "continue_monitoring|route_to_safe_zone|notify_guardian|request_safe_ride|call_emergency",
  "safeZoneRecommendation": true|false,
  "guardianRecommendation": true|false,
  "safeRideRecommendation": true|false,
  "userFacingMessage": "Calm, short message for user (max 15 words)",
  "caregiverFacingMessage": "Clear operational message for caregiver"
}`

/**
 * Generate fallback distress analysis
 */
function getFallbackAnalysis(context: any): any {
  const status = context.currentStatus || 'safe'
  const hazardSeverity = context.hazardSeverity || 'low'
  const routeDeviation = context.routeDeviation || 0
  const idleTime = context.idleTime || 0

  // Determine urgency
  let urgencyLevel = 'low'
  let primaryAction = 'continue_monitoring'
  let secondaryAction = 'continue_monitoring'
  let userMessage = 'All clear. Continue with confidence.'
  let caregiverMessage = 'User status normal. Continue monitoring.'
  let safeZoneRec = false
  let guardianRec = false
  let safeRideRec = false

  if (status === 'emergency') {
    urgencyLevel = 'critical'
    primaryAction = 'call_emergency'
    secondaryAction = 'notify_guardian'
    userMessage = 'Help is on the way. Stay calm.'
    caregiverMessage = 'EMERGENCY: User activated SOS. Immediate response required.'
    guardianRec = true
    safeZoneRec = true
  } else if (status === 'distress') {
    urgencyLevel = 'high'
    primaryAction = 'notify_guardian'
    secondaryAction = 'route_to_safe_zone'
    userMessage = 'Let me help you find a Safe Zone.'
    caregiverMessage = 'DISTRESS: User showing distress indicators. Guardian notification recommended.'
    guardianRec = true
    safeZoneRec = true
  } else if (hazardSeverity === 'high' || hazardSeverity === 'critical') {
    urgencyLevel = 'medium'
    primaryAction = 'route_to_safe_zone'
    secondaryAction = 'notify_guardian'
    userMessage = 'Hazard detected. Moving to safer path.'
    caregiverMessage = 'WARNING: High-severity hazard detected. Monitor closely.'
    safeZoneRec = true
  } else if (routeDeviation > 100 || idleTime > 300) {
    urgencyLevel = 'medium'
    primaryAction = 'route_to_safe_zone'
    secondaryAction = 'notify_guardian'
    userMessage = 'You seem off route. Let me guide you.'
    caregiverMessage = 'ALERT: User off route or idle. Guidance recommended.'
    safeZoneRec = true
  }

  return {
    distressSummary: `Status: ${status}, Hazard: ${hazardSeverity}, Deviation: ${routeDeviation}m, Idle: ${idleTime}s`,
    urgencyLevel,
    recommendedPrimaryAction: primaryAction,
    recommendedSecondaryAction: secondaryAction,
    safeZoneRecommendation: safeZoneRec,
    guardianRecommendation: guardianRec,
    safeRideRecommendation: safeRideRec,
    userFacingMessage: userMessage,
    caregiverFacingMessage: caregiverMessage,
  }
}

/**
 * POST /api/ai/distress-analysis
 * Analyze distress context and return recommendations
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const context = await request.json()

    // Validate required fields
    if (!context.currentStatus) {
      return NextResponse.json(
        { error: 'Missing required field: currentStatus' },
        { status: 400 }
      )
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not configured, using fallback analysis')
      return NextResponse.json(getFallbackAnalysis(context))
    }

    // Build analysis prompt
    const userPrompt = `Analyze this user safety situation:

Current Status: ${context.currentStatus}
Distress Reason: ${context.distressReason || 'none'}
Latest Hazard: ${context.latestHazard || 'none'} (severity: ${context.hazardSeverity || 'none'})
Route Deviation: ${context.routeDeviation || 0} meters
Idle Time: ${context.idleTime || 0} seconds
Nearest Safe Zone: ${context.nearestSafeZone || 'unknown'}
Guardian Status: ${context.guardianLinkStatus || 'connected'}
Safe Ride Status: ${context.safeRideStatus || 'not_requested'}

User Preferences:
- Language: ${context.languagePreference || 'English'}
- Simplified Instructions: ${context.accessibilityPreferences?.simplifiedInstructions || false}
- Calm Guidance Mode: ${context.accessibilityPreferences?.calmGuidanceMode || true}

Provide distress analysis and recommendations. Respond ONLY with valid JSON.`

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
      temperature: 0.2, // Very low for consistent safety analysis
      max_tokens: 300,
      response_format: { type: 'json_object' },
    })

    // Extract response
    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      console.warn('Empty response from Groq, using fallback')
      return NextResponse.json(getFallbackAnalysis(context))
    }

    // Parse JSON response
    let analysis
    try {
      analysis = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError)
      return NextResponse.json(getFallbackAnalysis(context))
    }

    // Validate response structure
    if (!analysis.urgencyLevel || !analysis.userFacingMessage) {
      console.warn('Invalid Groq response structure, using fallback')
      return NextResponse.json(getFallbackAnalysis(context))
    }

    // Return analysis
    return NextResponse.json(analysis)

  } catch (error: any) {
    console.error('Error analyzing distress:', error)

    // Return fallback on error
    const context = await request.json().catch(() => ({}))
    return NextResponse.json(getFallbackAnalysis(context))
  }
}

/**
 * GET /api/ai/distress-analysis
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'NeuroLens Guardian Distress Analysis',
    groqConfigured: !!process.env.GROQ_API_KEY,
  })
}
