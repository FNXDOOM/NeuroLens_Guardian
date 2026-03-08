/**
 * useAIGuidance Hook
 * 
 * Manages AI-generated guidance messages with smart refresh triggers
 * and fallback handling.
 * 
 * @module hooks/useAIGuidance
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchGuidance, buildGuidanceContext, shouldRefreshGuidance } from '@/services/groqGuidance'

/**
 * useAIGuidance Hook
 * @param {Object} options - Configuration options
 * @param {Object} options.appState - Current application state
 * @param {boolean} options.enabled - Enable AI guidance (default: true)
 * @param {number} options.debounceMs - Debounce time in ms (default: 1000)
 * @returns {Object} AI guidance state and controls
 */
export function useAIGuidance({
  appState = {},
  enabled = true,
  debounceMs = 1000,
} = {}) {
  // Guidance state
  const [guidance, setGuidance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  // Refs
  const prevStateRef = useRef(appState)
  const debounceTimerRef = useRef(null)
  const abortControllerRef = useRef(null)

  /**
   * Fetch guidance from API
   */
  const refreshGuidance = useCallback(async (force = false) => {
    if (!enabled) return

    // Check if refresh is needed
    if (!force && !shouldRefreshGuidance(prevStateRef.current, appState)) {
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Debounce the request
    debounceTimerRef.current = setTimeout(async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Build context
        const context = buildGuidanceContext(appState)

        // Fetch guidance
        const newGuidance = await fetchGuidance(context)

        setGuidance(newGuidance)
        setLastRefresh(new Date())
        prevStateRef.current = appState

        console.log('AI Guidance updated:', newGuidance.message)
      } catch (err) {
        console.error('Error refreshing guidance:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)
  }, [enabled, appState, debounceMs])

  /**
   * Manual refresh (for user-triggered actions)
   */
  const manualRefresh = useCallback(() => {
    refreshGuidance(true)
  }, [refreshGuidance])

  /**
   * Simplify current guidance
   */
  const simplifyGuidance = useCallback(() => {
    if (guidance?.alternateShortMessage) {
      setGuidance(prev => ({
        ...prev,
        message: prev.alternateShortMessage,
      }))
    }
  }, [guidance])

  /**
   * Get voice-friendly message
   */
  const getVoiceMessage = useCallback(() => {
    return guidance?.voiceFriendlyMessage || guidance?.message || ''
  }, [guidance])

  /**
   * Auto-refresh when app state changes
   */
  useEffect(() => {
    if (enabled) {
      refreshGuidance()
    }
  }, [
    appState.distressStatus,
    appState.latestHazard?.id,
    appState.isOffRoute,
    appState.safeZoneRecommended,
    appState.isEmergency,
    enabled,
    refreshGuidance,
  ])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    // Guidance data
    guidance,
    message: guidance?.message || 'All clear. Continue with confidence.',
    severity: guidance?.severity || 'safe',
    recommendedAction: guidance?.recommendedAction || 'continue',
    
    // State
    isLoading,
    error,
    lastRefresh,
    
    // Controls
    refreshGuidance: manualRefresh,
    simplifyGuidance,
    getVoiceMessage,
  }
}

export default useAIGuidance
