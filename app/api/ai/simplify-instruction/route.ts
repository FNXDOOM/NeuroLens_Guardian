/**
 * Instruction Simplification API Route
 * 
 * Simplifies navigation and safety instructions for users with cognitive
 * or stress-related accessibility needs using Groq LLM.
 * 
 * @route POST /api/ai/simplify-instruction
 */

import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Initialize Groq client (server-side only)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// System prompt for instruction simplification
const SYSTEM_PROMPT = `You are an instruction simplification assistant for NeuroLens Guardian, helping elderly users and people with cognitive disabilities understand navigation and safety guidance.

Your role:
- Simplify complex instructions while preserving meaning
- Use short sentences and simple words
- Remove jargon and technical terms
- Make instructions suitable for voice guidance
- Adapt to user's cognitive needs

Simplification rules:
- Use simple verbs: walk, move, turn, stop, wait, go
- Avoid complex sentences or clauses
- Use concrete, specific language
- Break multi-step instructions into single steps
- Use everyday words, not technical terms
- Keep sentences under 10 words when possible

Examples:
Input: "Proceed along the current route and turn slightly left to avoid the approaching vehicle."
Output: "Walk forward. Move a little left."

Input: "Navigate to the intersection and make a right turn at the traffic signal."
Output: "Walk to the corner. Turn right at the light."

Input: "There is a potential obstacle detected approximately 15 meters ahead on your current trajectory."
Output: "Obstacle ahead. Walk carefully."

Always respond with JSON in this exact format:
{
  "simplifiedMessage": "Simplified version (max 10 words per sentence)",
  "extraShortMessage": "Ultra-short version (max 5 words total)",
  "voiceFriendlyMessage": "Voice-optimized version (max 15 words, natural speech)"
}`

/**
 * Local fallback simplification
 */
function simplifyLocally(originalMessage: string): any {
  // Take first sentence only
  const firstSentence = originalMessage.split(/[.!?]/)[0].trim()
  
  // Extract key action words
  const actionWords = ['walk', 'move', 'turn', 'stop', 'wait', 'go', 'avoid', 'continue']
  const words = firstSentence.toLowerCase().split(' ')
  const keyActions = words.filter(w => actionWords.some(a => w.includes(a)))
  
  // Build simplified versions
  let simplified = firstSentence
  if (simplified.length > 50) {
    simplified = simplified.substring(0, 50).trim() + '...'
  }
  
  let extraShort = keyActions.slice(0, 2).join(' ') || 'Continue'
  if (extraShort.length > 30) {
    extraShort = extraShort.substring(0, 30).trim()
  }
  
  let voiceFriendly = firstSentence
  if (voiceFriendly.length > 80) {
    voiceFriendly = voiceFriendly.substring(0, 80).trim() + '.'
  }
  
  return {
    simplifiedMessage: simplified,
    extraShortMessage: extraShort,
    voiceFriendlyMessage: voiceFriendly,
  }
}

/**
 * POST /api/ai/simplify-instruction
 * Simplify navigation/safety instruction
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { originalMessage, languagePreference, calmGuidanceMode, simplifiedInstructions, userAccessibilityMode } = body

    // Validate required fields
    if (!originalMessage) {
      return NextResponse.json(
        { error: 'Missing required field: originalMessage' },
        { status: 400 }
      )
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not configured, using local simplification')
      return NextResponse.json(simplifyLocally(originalMessage))
    }

    // Build user prompt
    const userPrompt = `Simplify this instruction: "${originalMessage}"

User Preferences:
- Language: ${languagePreference || 'English'}
- Calm Guidance Mode: ${calmGuidanceMode || true}
- Simplified Instructions: ${simplifiedInstructions || true}
- Accessibility Mode: ${userAccessibilityMode || 'cognitive_support'}

Provide three versions:
1. Simplified (clear, short sentences)
2. Extra Short (5 words max)
3. Voice Friendly (natural speech, 15 words max)

Respond ONLY with valid JSON.`

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
      temperature: 0.2, // Low temperature for consistent simplification
      max_tokens: 150,
      response_format: { type: 'json_object' },
    })

    // Extract response
    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      console.warn('Empty response from Groq, using local simplification')
      return NextResponse.json(simplifyLocally(originalMessage))
    }

    // Parse JSON response
    let simplified
    try {
      simplified = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError)
      return NextResponse.json(simplifyLocally(originalMessage))
    }

    // Validate response structure
    if (!simplified.simplifiedMessage || !simplified.extraShortMessage) {
      console.warn('Invalid Groq response structure, using local simplification')
      return NextResponse.json(simplifyLocally(originalMessage))
    }

    // Return simplified instructions
    return NextResponse.json(simplified)

  } catch (error: any) {
    console.error('Error simplifying instruction:', error)

    // Return local simplification on error
    const body = await request.json().catch(() => ({ originalMessage: '' }))
    return NextResponse.json(simplifyLocally(body.originalMessage || ''))
  }
}

/**
 * GET /api/ai/simplify-instruction
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'NeuroLens Guardian Instruction Simplification',
    groqConfigured: !!process.env.GROQ_API_KEY,
  })
}
