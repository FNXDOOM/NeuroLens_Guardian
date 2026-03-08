/**
 * useVoiceAssistant Hook
 * 
 * Comprehensive voice assistant system with speech recognition,
 * command parsing, conversational AI, and speech synthesis.
 * 
 * @module hooks/useVoiceAssistant
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { parseVoiceCommand, INTENTS, isEmergencyIntent } from '@/utils/voiceCommands'
import { fetchGuidance, buildGuidanceContext } from '@/services/groqGuidance'

/**
 * useVoiceAssistant Hook
 * @param {Object} options - Configuration options
 * @param {Function} options.onCommand - Command handler (intent, params) => void
 * @param {Object} options.appState - Current app state for context
 * @param {boolean} options.enabled - Enable voice assistant
 * @param {string} options.language - Speech recognition language (default: 'en-US')
 * @param {boolean} options.continuous - Continuous listening (default: false)
 * @param {boolean} options.wakeWordEnabled - Enable wake word detection (default: true)
 * @returns {Object} Voice assistant state and controls
 */
export function useVoiceAssistant({
  onCommand = null,
  appState = {},
  enabled = true,
  language = 'en-US',
  continuous = false,
  wakeWordEnabled = true,
} = {}) {
  // State
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [lastCommand, setLastCommand] = useState(null)
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(false)
  const [isAwake, setIsAwake] = useState(!wakeWordEnabled) // If wake word disabled, always awake

  // Refs
  const recognitionRef = useRef(null)
  const synthesisRef = useRef(null)
  const timeoutRef = useRef(null)

  /**
   * Check browser support
   */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const SpeechSynthesis = window.speechSynthesis

    if (SpeechRecognition && SpeechSynthesis) {
      setIsSupported(true)
    } else {
      setIsSupported(false)
      setError('Voice features not supported in this browser')
    }
  }, [])

  /**
   * Initialize speech recognition
   */
  useEffect(() => {
    if (!isSupported || !enabled) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = continuous
    recognition.interimResults = true
    recognition.lang = language
    recognition.maxAlternatives = 1

    // On result
    recognition.onresult = (event) => {
      const last = event.results.length - 1
      const result = event.results[last]
      const transcriptText = result[0].transcript

      setTranscript(transcriptText)

      // Only process final results
      if (result.isFinal) {
        handleTranscript(transcriptText)
      }
    }

    // On error
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    // On end
    recognition.onend = () => {
      setIsListening(false)
      
      // Restart if continuous mode
      if (continuous && enabled) {
        setTimeout(() => {
          try {
            recognition.start()
            setIsListening(true)
          } catch (err) {
            console.error('Failed to restart recognition:', err)
          }
        }, 100)
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isSupported, enabled, language, continuous])

  /**
   * Handle transcript
   */
  const handleTranscript = useCallback(async (transcriptText) => {
    setIsProcessing(true)

    try {
      // Parse command
      const parsed = parseVoiceCommand(transcriptText)
      setLastCommand(parsed)

      console.log('Voice command:', parsed)

      // Check for wake word
      if (wakeWordEnabled && !isAwake) {
        if (parsed.intent === INTENTS.WAKE) {
          setIsAwake(true)
          speak('Yes, I am listening. How can I help you?')
          
          // Auto-sleep after 30 seconds
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(() => {
            setIsAwake(false)
            speak('Going to sleep. Say Guardian Assist to wake me.')
          }, 30000)
        }
        return
      }

      // Handle emergency intents immediately
      if (isEmergencyIntent(parsed.intent)) {
        if (onCommand) {
          onCommand(parsed.intent, parsed.params)
        }
        speak('Emergency alert activated. Notifying guardian.')
        return
      }

      // Handle conversational queries
      if (parsed.intent === INTENTS.CONVERSATIONAL) {
        await handleConversationalQuery(transcriptText)
        return
      }

      // Handle other commands
      if (parsed.intent !== INTENTS.UNKNOWN) {
        if (onCommand) {
          onCommand(parsed.intent, parsed.params)
        }
        
        // Provide voice feedback
        const response = getCommandResponse(parsed.intent, parsed.params)
        speak(response)
      } else {
        speak('Sorry, I did not understand that command.')
      }
    } catch (err) {
      console.error('Error handling transcript:', err)
      setError('Failed to process command')
    } finally {
      setIsProcessing(false)
    }
  }, [wakeWordEnabled, isAwake, onCommand, appState])

  /**
   * Handle conversational query with Groq
   */
  const handleConversationalQuery = useCallback(async (query) => {
    try {
      // Build context for Groq
      const context = buildGuidanceContext({
        ...appState,
        conversationalQuery: query,
      })

      // Fetch guidance from Groq
      const guidance = await fetchGuidance(context)

      // Speak response
      speak(guidance.voiceFriendlyMessage || guidance.message)
    } catch (err) {
      console.error('Error handling conversational query:', err)
      speak('Sorry, I could not process your question.')
    }
  }, [appState])

  /**
   * Get command response
   */
  const getCommandResponse = useCallback((intent, params) => {
    const responses = {
      [INTENTS.START_JOURNEY]: 'Starting your journey.',
      [INTENTS.FIND_SAFE_ZONE]: 'Finding the nearest Safe Zone.',
      [INTENTS.TAKE_ME_HOME]: 'Navigating you home.',
      [INTENTS.BOOK_SAFE_RIDE]: 'Booking a Safe Ride for you.',
      [INTENTS.REPEAT_GUIDANCE]: appState.latestGuidance || 'No guidance to repeat.',
      [INTENTS.GET_STATUS]: `Your status is ${appState.distressStatus || 'safe'}.`,
      [INTENTS.WHAT_IS_AHEAD]: appState.latestHazard ? 
        `${appState.latestHazard.warning}.` : 
        'Clear path ahead.',
      [INTENTS.WHERE_AM_I]: appState.userLocation?.address || 'Location unavailable.',
      [INTENTS.HOW_FAR_SAFE_ZONE]: appState.nearestSafeZone ? 
        `Nearest Safe Zone is ${Math.round(appState.nearestSafeZone.distance / 1000)} kilometers away.` :
        'No Safe Zone nearby.',
      [INTENTS.CHANGE_LANGUAGE]: `Changing language to ${params.language}.`,
      [INTENTS.TOGGLE_CALM_MODE]: params.enabled ? 
        'Calm mode enabled.' : 
        'Calm mode disabled.',
      [INTENTS.SIMPLIFY_INSTRUCTIONS]: 'Instructions simplified.',
    }

    return responses[intent] || 'Command received.'
  }, [appState])

  /**
   * Speak text using speech synthesis
   */
  const speak = useCallback((text, options = {}) => {
    if (!isSupported) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = options.lang || language
    utterance.rate = options.rate || 0.9 // Slightly slower for clarity
    utterance.pitch = options.pitch || 1.0
    utterance.volume = options.volume || 1.0

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }, [isSupported, language])

  /**
   * Start listening
   */
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not available')
      return
    }

    try {
      recognitionRef.current.start()
      setIsListening(true)
      setError(null)
      setTranscript('')
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setError('Failed to start listening')
    }
  }, [isSupported])

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  /**
   * Toggle listening
   */
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  /**
   * Stop speaking
   */
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  /**
   * Change language
   */
  const changeLanguage = useCallback((newLanguage) => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLanguage
    }
  }, [])

  /**
   * Cleanup
   */
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    // State
    isListening,
    isProcessing,
    isSpeaking,
    transcript,
    lastCommand,
    error,
    isSupported,
    isAwake,

    // Controls
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    changeLanguage,
  }
}

export default useVoiceAssistant
