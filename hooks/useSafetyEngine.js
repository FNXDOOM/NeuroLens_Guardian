/**
 * useSafetyEngine Hook
 * 
 * React hook for the advanced AR safety engine.
 * Computes real-time safety assessments based on detections.
 * 
 * @module hooks/useSafetyEngine
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { computeSafetyAssessment } from '@/utils/safetyEngine'

/**
 * useSafetyEngine Hook
 * @param {Object} options - Configuration options
 * @param {Array} options.detections - Current detections
 * @param {Object} options.latestHazard - Primary hazard
 * @param {Object} options.videoElement - Video element reference
 * @param {Object} options.routeState - Route state
 * @param {Object} options.userLocation - User location
 * @param {Object} options.nearestSafeZone - Nearest Safe Zone
 * @param {boolean} options.enabled - Enable safety engine
 * @returns {Object} Safety assessment state
 */
export function useSafetyEngine({
  detections = [],
  latestHazard = null,
  videoElement = null,
  routeState = null,
  userLocation = null,
  nearestSafeZone = null,
  enabled = true,
} = {}) {
  // Safety assessment state
  const [safetyAssessment, setSafetyAssessment] = useState({
    safetyScore: 100,
    currentRiskLevel: 'safe',
    recommendedDirection: 'continue_forward',
    warningLabel: 'Clear path',
    voiceFriendlyWarning: 'All clear. Continue with confidence.',
    primaryHazard: null,
    hazardDistance: null,
    hazardPosition: null,
    criticalHazards: [],
    totalHazards: 0,
    dangerCount: 0,
    cautionCount: 0,
  })

  // Previous assessment for change detection
  const prevAssessmentRef = useRef(safetyAssessment)

  /**
   * Compute safety assessment
   */
  const computeAssessment = useCallback(() => {
    if (!enabled) return

    const assessment = computeSafetyAssessment({
      detections,
      latestHazard,
      videoElement,
      routeState,
      userLocation,
      nearestSafeZone,
    })

    setSafetyAssessment(assessment)
    prevAssessmentRef.current = assessment
  }, [
    enabled,
    detections,
    latestHazard,
    videoElement,
    routeState,
    userLocation,
    nearestSafeZone,
  ])

  /**
   * Auto-compute when inputs change
   */
  useEffect(() => {
    if (enabled) {
      computeAssessment()
    }
  }, [enabled, computeAssessment])

  /**
   * Check if assessment has changed significantly
   */
  const hasSignificantChange = useCallback(() => {
    const prev = prevAssessmentRef.current
    const curr = safetyAssessment

    // Risk level changed
    if (prev.currentRiskLevel !== curr.currentRiskLevel) {
      return true
    }

    // Safety score changed by more than 10 points
    if (Math.abs(prev.safetyScore - curr.safetyScore) > 10) {
      return true
    }

    // Direction changed
    if (prev.recommendedDirection !== curr.recommendedDirection) {
      return true
    }

    // Primary hazard changed
    if (prev.primaryHazard?.id !== curr.primaryHazard?.id) {
      return true
    }

    return false
  }, [safetyAssessment])

  return {
    // Assessment data
    ...safetyAssessment,
    
    // Helpers
    hasSignificantChange,
    computeAssessment,
  }
}

export default useSafetyEngine
