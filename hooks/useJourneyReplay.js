/**
 * useJourneyReplay Hook
 * 
 * Event logging and playback system for journey replay and incident analysis.
 * 
 * @module hooks/useJourneyReplay
 */

import { useState, useCallback, useRef } from 'react'

/**
 * Event types
 */
export const EVENT_TYPES = {
  JOURNEY_STARTED: 'journey_started',
  ROUTE_UPDATED: 'route_updated',
  HAZARD_DETECTED: 'hazard_detected',
  PREDICTIVE_HAZARD: 'predictive_hazard',
  DISTRESS_TRIGGERED: 'distress_triggered',
  SAFE_ZONE_RECOMMENDED: 'safe_zone_recommended',
  GUARDIAN_NOTIFIED: 'guardian_notified',
  EMERGENCY_ACTIVATED: 'emergency_activated',
  SAFE_RIDE_REQUESTED: 'safe_ride_requested',
  RIDE_IN_PROGRESS: 'ride_in_progress',
  RIDE_COMPLETED: 'ride_completed',
  GUIDANCE_RECEIVED: 'guidance_received',
  VOICE_COMMAND: 'voice_command',
  ROUTE_DEVIATION: 'route_deviation',
}

/**
 * Event severity levels
 */
export const EVENT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger',
  EMERGENCY: 'emergency',
}

/**
 * useJourneyReplay Hook
 * @param {Object} options - Configuration options
 * @param {number} options.maxEvents - Maximum events to store (default: 100)
 * @returns {Object} Journey replay state and controls
 */
export function useJourneyReplay({ maxEvents = 100 } = {}) {
  // State
  const [events, setEvents] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEventIndex, setCurrentEventIndex] = useState(-1)
  const [filter, setFilter] = useState('all')

  // Refs
  const eventIdCounter = useRef(0)
  const playbackIntervalRef = useRef(null)

  /**
   * Log an event
   */
  const logEvent = useCallback((eventData) => {
    const event = {
      id: `event-${Date.now()}-${eventIdCounter.current++}`,
      timestamp: new Date(),
      ...eventData,
    }

    setEvents(prev => {
      const updated = [event, ...prev]
      // Keep only maxEvents
      return updated.slice(0, maxEvents)
    })

    return event
  }, [maxEvents])

  /**
   * Log journey started
   */
  const logJourneyStarted = useCallback((destination) => {
    return logEvent({
      eventType: EVENT_TYPES.JOURNEY_STARTED,
      severity: EVENT_SEVERITY.INFO,
      description: `Journey started to ${destination}`,
      metadata: { destination },
    })
  }, [logEvent])

  /**
   * Log route updated
   */
  const logRouteUpdated = useCallback((destination, distance) => {
    return logEvent({
      eventType: EVENT_TYPES.ROUTE_UPDATED,
      severity: EVENT_SEVERITY.INFO,
      description: `Route updated to ${destination}`,
      metadata: { destination, distance },
    })
  }, [logEvent])

  /**
   * Log hazard detected
   */
  const logHazardDetected = useCallback((hazard) => {
    const severity = hazard.severity === 'danger' ? EVENT_SEVERITY.DANGER :
                     hazard.severity === 'caution' ? EVENT_SEVERITY.WARNING :
                     EVENT_SEVERITY.INFO

    return logEvent({
      eventType: EVENT_TYPES.HAZARD_DETECTED,
      severity,
      description: `${hazard.class} detected`,
      metadata: {
        hazardType: hazard.class,
        hazardCategory: hazard.category,
        confidence: hazard.confidence,
        distance: hazard.distance?.distanceCategory,
      },
    })
  }, [logEvent])

  /**
   * Log predictive hazard
   */
  const logPredictiveHazard = useCallback((predictiveHazard) => {
    const severity = predictiveHazard.predictedRiskLevel === 'danger' ? EVENT_SEVERITY.DANGER :
                     predictiveHazard.predictedRiskLevel === 'caution' ? EVENT_SEVERITY.WARNING :
                     EVENT_SEVERITY.INFO

    return logEvent({
      eventType: EVENT_TYPES.PREDICTIVE_HAZARD,
      severity,
      description: predictiveHazard.warningLabel,
      metadata: {
        hazardType: predictiveHazard.predictiveHazardType,
        riskLevel: predictiveHazard.predictedRiskLevel,
        collisionPath: predictiveHazard.predictedCollisionPath,
      },
    })
  }, [logEvent])

  /**
   * Log distress triggered
   */
  const logDistressTriggered = useCallback((distressLevel, reason) => {
    return logEvent({
      eventType: EVENT_TYPES.DISTRESS_TRIGGERED,
      severity: EVENT_SEVERITY.WARNING,
      description: `Distress detected: ${reason}`,
      metadata: { distressLevel, reason },
    })
  }, [logEvent])

  /**
   * Log Safe Zone recommended
   */
  const logSafeZoneRecommended = useCallback((safeZone) => {
    return logEvent({
      eventType: EVENT_TYPES.SAFE_ZONE_RECOMMENDED,
      severity: EVENT_SEVERITY.WARNING,
      description: `Safe Zone recommended: ${safeZone.name}`,
      metadata: {
        safeZoneName: safeZone.name,
        distance: safeZone.distance,
      },
    })
  }, [logEvent])

  /**
   * Log guardian notified
   */
  const logGuardianNotified = useCallback(() => {
    return logEvent({
      eventType: EVENT_TYPES.GUARDIAN_NOTIFIED,
      severity: EVENT_SEVERITY.WARNING,
      description: 'Guardian notified',
      metadata: {},
    })
  }, [logEvent])

  /**
   * Log emergency activated
   */
  const logEmergencyActivated = useCallback(() => {
    return logEvent({
      eventType: EVENT_TYPES.EMERGENCY_ACTIVATED,
      severity: EVENT_SEVERITY.EMERGENCY,
      description: 'Emergency SOS activated',
      metadata: {},
    })
  }, [logEvent])

  /**
   * Log Safe Ride requested
   */
  const logSafeRideRequested = useCallback((destination) => {
    return logEvent({
      eventType: EVENT_TYPES.SAFE_RIDE_REQUESTED,
      severity: EVENT_SEVERITY.INFO,
      description: 'Safe Ride requested',
      metadata: { destination },
    })
  }, [logEvent])

  /**
   * Log ride in progress
   */
  const logRideInProgress = useCallback((driver, vehicle) => {
    return logEvent({
      eventType: EVENT_TYPES.RIDE_IN_PROGRESS,
      severity: EVENT_SEVERITY.INFO,
      description: `Ride in progress with ${driver}`,
      metadata: { driver, vehicle },
    })
  }, [logEvent])

  /**
   * Log ride completed
   */
  const logRideCompleted = useCallback(() => {
    return logEvent({
      eventType: EVENT_TYPES.RIDE_COMPLETED,
      severity: EVENT_SEVERITY.INFO,
      description: 'Ride completed successfully',
      metadata: {},
    })
  }, [logEvent])

  /**
   * Log guidance received
   */
  const logGuidanceReceived = useCallback((guidance) => {
    return logEvent({
      eventType: EVENT_TYPES.GUIDANCE_RECEIVED,
      severity: EVENT_SEVERITY.INFO,
      description: guidance,
      metadata: { guidance },
    })
  }, [logEvent])

  /**
   * Log voice command
   */
  const logVoiceCommand = useCallback((command, intent) => {
    return logEvent({
      eventType: EVENT_TYPES.VOICE_COMMAND,
      severity: EVENT_SEVERITY.INFO,
      description: `Voice command: ${command}`,
      metadata: { command, intent },
    })
  }, [logEvent])

  /**
   * Log route deviation
   */
  const logRouteDeviation = useCallback(() => {
    return logEvent({
      eventType: EVENT_TYPES.ROUTE_DEVIATION,
      severity: EVENT_SEVERITY.WARNING,
      description: 'Route deviation detected',
      metadata: {},
    })
  }, [logEvent])

  /**
   * Get filtered events
   */
  const getFilteredEvents = useCallback(() => {
    if (filter === 'all') {
      return events
    }

    const filterMap = {
      hazard: [EVENT_TYPES.HAZARD_DETECTED, EVENT_TYPES.PREDICTIVE_HAZARD],
      distress: [EVENT_TYPES.DISTRESS_TRIGGERED, EVENT_TYPES.SAFE_ZONE_RECOMMENDED],
      emergency: [EVENT_TYPES.EMERGENCY_ACTIVATED, EVENT_TYPES.GUARDIAN_NOTIFIED],
      ride: [EVENT_TYPES.SAFE_RIDE_REQUESTED, EVENT_TYPES.RIDE_IN_PROGRESS, EVENT_TYPES.RIDE_COMPLETED],
      guidance: [EVENT_TYPES.GUIDANCE_RECEIVED, EVENT_TYPES.VOICE_COMMAND],
    }

    const allowedTypes = filterMap[filter] || []
    return events.filter(e => allowedTypes.includes(e.eventType))
  }, [events, filter])

  /**
   * Start playback
   */
  const startPlayback = useCallback(() => {
    if (events.length === 0) return

    setIsPlaying(true)
    setCurrentEventIndex(0)

    playbackIntervalRef.current = setInterval(() => {
      setCurrentEventIndex(prev => {
        if (prev >= events.length - 1) {
          setIsPlaying(false)
          clearInterval(playbackIntervalRef.current)
          return prev
        }
        return prev + 1
      })
    }, 2000) // 2 seconds per event
  }, [events])

  /**
   * Stop playback
   */
  const stopPlayback = useCallback(() => {
    setIsPlaying(false)
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current)
    }
  }, [])

  /**
   * Step to next event
   */
  const nextEvent = useCallback(() => {
    setCurrentEventIndex(prev => Math.min(prev + 1, events.length - 1))
  }, [events])

  /**
   * Step to previous event
   */
  const previousEvent = useCallback(() => {
    setCurrentEventIndex(prev => Math.max(prev - 1, 0))
  }, [])

  /**
   * Reset playback
   */
  const resetPlayback = useCallback(() => {
    stopPlayback()
    setCurrentEventIndex(-1)
  }, [stopPlayback])

  /**
   * Clear all events
   */
  const clearEvents = useCallback(() => {
    setEvents([])
    resetPlayback()
  }, [resetPlayback])

  return {
    // State
    events,
    filteredEvents: getFilteredEvents(),
    isPlaying,
    currentEventIndex,
    currentEvent: currentEventIndex >= 0 ? events[currentEventIndex] : null,
    filter,

    // Logging functions
    logEvent,
    logJourneyStarted,
    logRouteUpdated,
    logHazardDetected,
    logPredictiveHazard,
    logDistressTriggered,
    logSafeZoneRecommended,
    logGuardianNotified,
    logEmergencyActivated,
    logSafeRideRequested,
    logRideInProgress,
    logRideCompleted,
    logGuidanceReceived,
    logVoiceCommand,
    logRouteDeviation,

    // Playback controls
    startPlayback,
    stopPlayback,
    nextEvent,
    previousEvent,
    resetPlayback,

    // Filters
    setFilter,
    clearEvents,
  }
}

export default useJourneyReplay
