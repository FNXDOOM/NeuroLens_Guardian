/**
 * Voice Command Parser
 * 
 * Maps natural language phrases to structured intents
 * for the NeuroLens Guardian voice assistant.
 * 
 * @module utils/voiceCommands
 */

/**
 * Command intent types
 */
export const INTENTS = {
  // Navigation
  START_JOURNEY: 'START_JOURNEY',
  FIND_SAFE_ZONE: 'FIND_SAFE_ZONE',
  TAKE_ME_HOME: 'TAKE_ME_HOME',
  
  // Emergency
  SOS_ALERT: 'SOS_ALERT',
  CALL_GUARDIAN: 'CALL_GUARDIAN',
  
  // Assistance
  BOOK_SAFE_RIDE: 'BOOK_SAFE_RIDE',
  REPEAT_GUIDANCE: 'REPEAT_GUIDANCE',
  
  // Public Transport
  FIND_MY_BUS: 'FIND_MY_BUS',
  DID_BUS_ARRIVE: 'DID_BUS_ARRIVE',
  WHICH_STOP_NEXT: 'WHICH_STOP_NEXT',
  TELL_ME_WHEN_TO_EXIT: 'TELL_ME_WHEN_TO_EXIT',
  BOARD_BUS: 'BOARD_BUS',
  
  // Information
  GET_STATUS: 'GET_STATUS',
  WHAT_IS_AHEAD: 'WHAT_IS_AHEAD',
  WHERE_AM_I: 'WHERE_AM_I',
  HOW_FAR_SAFE_ZONE: 'HOW_FAR_SAFE_ZONE',
  
  // Settings
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
  TOGGLE_CALM_MODE: 'TOGGLE_CALM_MODE',
  SIMPLIFY_INSTRUCTIONS: 'SIMPLIFY_INSTRUCTIONS',
  
  // Wake phrase
  WAKE: 'WAKE',
  
  // Conversational (send to Groq)
  CONVERSATIONAL: 'CONVERSATIONAL',
  
  // Unknown
  UNKNOWN: 'UNKNOWN',
}

/**
 * Command patterns for intent matching
 */
const COMMAND_PATTERNS = [
  // Wake phrase
  {
    patterns: ['guardian assist', 'hey guardian', 'hello guardian'],
    intent: INTENTS.WAKE,
    priority: 10,
  },
  
  // Emergency (highest priority)
  {
    patterns: ['help me', 'emergency', 'call guardian now', 'i need help', 'help'],
    intent: INTENTS.SOS_ALERT,
    priority: 9,
  },
  {
    patterns: ['call guardian', 'contact guardian', 'notify guardian'],
    intent: INTENTS.CALL_GUARDIAN,
    priority: 8,
  },
  
  // Navigation
  {
    patterns: ['start journey', 'begin journey', 'start navigation', 'lets go', "let's go"],
    intent: INTENTS.START_JOURNEY,
    priority: 7,
  },
  {
    patterns: ['find safe zone', 'take me to safe zone', 'nearest safe zone', 'safe place'],
    intent: INTENTS.FIND_SAFE_ZONE,
    priority: 7,
  },
  {
    patterns: ['take me home', 'go home', 'navigate home', 'home'],
    intent: INTENTS.TAKE_ME_HOME,
    priority: 7,
  },
  
  // Assistance
  {
    patterns: ['book safe ride', 'call a cab', 'get a ride', 'request ride', 'safe ride'],
    intent: INTENTS.BOOK_SAFE_RIDE,
    priority: 6,
  },
  
  // Public Transport
  {
    patterns: ['find my bus', 'where is my bus', 'find bus', 'bus location'],
    intent: INTENTS.FIND_MY_BUS,
    priority: 7,
  },
  {
    patterns: ['did my bus arrive', 'is my bus here', 'bus arrived', 'has the bus come'],
    intent: INTENTS.DID_BUS_ARRIVE,
    priority: 7,
  },
  {
    patterns: ['which stop is next', 'next stop', 'what is the next stop', 'where are we'],
    intent: INTENTS.WHICH_STOP_NEXT,
    priority: 7,
  },
  {
    patterns: ['tell me when to get down', 'alert me at my stop', 'remind me to exit', 'when should i get down'],
    intent: INTENTS.TELL_ME_WHEN_TO_EXIT,
    priority: 7,
  },
  {
    patterns: ['board bus', 'get on bus', 'boarding', 'entering bus'],
    intent: INTENTS.BOARD_BUS,
    priority: 7,
  },
  {
    patterns: ['repeat guidance', 'say again', 'repeat', 'what did you say'],
    intent: INTENTS.REPEAT_GUIDANCE,
    priority: 6,
  },
  
  // Information
  {
    patterns: ['what is ahead', 'whats ahead', "what's ahead", 'what do you see'],
    intent: INTENTS.WHAT_IS_AHEAD,
    priority: 5,
  },
  {
    patterns: ['where am i', 'my location', 'current location', 'where'],
    intent: INTENTS.WHERE_AM_I,
    priority: 5,
  },
  {
    patterns: ['am i safe', 'is it safe', 'status', 'how am i doing'],
    intent: INTENTS.GET_STATUS,
    priority: 5,
  },
  {
    patterns: ['how far is safe zone', 'distance to safe zone', 'safe zone distance'],
    intent: INTENTS.HOW_FAR_SAFE_ZONE,
    priority: 5,
  },
  
  // Settings - Language
  {
    patterns: ['speak hindi', 'change to hindi', 'hindi language'],
    intent: INTENTS.CHANGE_LANGUAGE,
    priority: 4,
    params: { language: 'hi-IN' },
  },
  {
    patterns: ['speak kannada', 'change to kannada', 'kannada language'],
    intent: INTENTS.CHANGE_LANGUAGE,
    priority: 4,
    params: { language: 'kn-IN' },
  },
  {
    patterns: ['speak english', 'change to english', 'english language'],
    intent: INTENTS.CHANGE_LANGUAGE,
    priority: 4,
    params: { language: 'en-US' },
  },
  
  // Settings - Modes
  {
    patterns: ['turn on calm mode', 'enable calm mode', 'calm mode on'],
    intent: INTENTS.TOGGLE_CALM_MODE,
    priority: 4,
    params: { enabled: true },
  },
  {
    patterns: ['turn off calm mode', 'disable calm mode', 'calm mode off'],
    intent: INTENTS.TOGGLE_CALM_MODE,
    priority: 4,
    params: { enabled: false },
  },
  {
    patterns: ['simplify instructions', 'simple mode', 'make it simpler', 'easier instructions'],
    intent: INTENTS.SIMPLIFY_INSTRUCTIONS,
    priority: 4,
  },
]

/**
 * Parse voice command into intent
 * @param {string} transcript - Voice transcript
 * @returns {Object} Parsed intent
 */
export function parseVoiceCommand(transcript) {
  if (!transcript || typeof transcript !== 'string') {
    return {
      intent: INTENTS.UNKNOWN,
      confidence: 0,
      originalText: transcript,
    }
  }

  const normalizedText = transcript.toLowerCase().trim()

  // Find matching pattern
  let bestMatch = null
  let highestPriority = -1

  for (const command of COMMAND_PATTERNS) {
    for (const pattern of command.patterns) {
      if (normalizedText.includes(pattern)) {
        if (command.priority > highestPriority) {
          bestMatch = command
          highestPriority = command.priority
        }
      }
    }
  }

  if (bestMatch) {
    return {
      intent: bestMatch.intent,
      confidence: 0.9,
      originalText: transcript,
      params: bestMatch.params || {},
    }
  }

  // Check if it's a conversational query
  if (isConversationalQuery(normalizedText)) {
    return {
      intent: INTENTS.CONVERSATIONAL,
      confidence: 0.7,
      originalText: transcript,
    }
  }

  // Unknown command
  return {
    intent: INTENTS.UNKNOWN,
    confidence: 0,
    originalText: transcript,
  }
}

/**
 * Check if text is a conversational query
 * @param {string} text - Normalized text
 * @returns {boolean} True if conversational
 */
function isConversationalQuery(text) {
  const conversationalKeywords = [
    'what', 'where', 'when', 'why', 'how',
    'can you', 'could you', 'would you',
    'tell me', 'show me', 'explain',
    'is there', 'are there',
  ]

  return conversationalKeywords.some(keyword => text.includes(keyword))
}

/**
 * Get intent description for display
 * @param {string} intent - Intent type
 * @returns {string} Human-readable description
 */
export function getIntentDescription(intent) {
  const descriptions = {
    [INTENTS.START_JOURNEY]: 'Starting journey',
    [INTENTS.FIND_SAFE_ZONE]: 'Finding Safe Zone',
    [INTENTS.TAKE_ME_HOME]: 'Navigating home',
    [INTENTS.SOS_ALERT]: 'Emergency alert',
    [INTENTS.CALL_GUARDIAN]: 'Calling guardian',
    [INTENTS.BOOK_SAFE_RIDE]: 'Booking Safe Ride',
    [INTENTS.REPEAT_GUIDANCE]: 'Repeating guidance',
    [INTENTS.GET_STATUS]: 'Getting status',
    [INTENTS.WHAT_IS_AHEAD]: 'Checking ahead',
    [INTENTS.WHERE_AM_I]: 'Getting location',
    [INTENTS.HOW_FAR_SAFE_ZONE]: 'Checking Safe Zone distance',
    [INTENTS.CHANGE_LANGUAGE]: 'Changing language',
    [INTENTS.TOGGLE_CALM_MODE]: 'Toggling calm mode',
    [INTENTS.SIMPLIFY_INSTRUCTIONS]: 'Simplifying instructions',
    [INTENTS.WAKE]: 'Listening',
    [INTENTS.CONVERSATIONAL]: 'Processing question',
    [INTENTS.UNKNOWN]: 'Unknown command',
  }

  return descriptions[intent] || 'Processing'
}

/**
 * Check if intent is emergency
 * @param {string} intent - Intent type
 * @returns {boolean} True if emergency
 */
export function isEmergencyIntent(intent) {
  return intent === INTENTS.SOS_ALERT || intent === INTENTS.CALL_GUARDIAN
}

export default {
  INTENTS,
  parseVoiceCommand,
  getIntentDescription,
  isEmergencyIntent,
}
