/**
 * useDistressEngine Hook
 * 
 * Rule-based distress detection engine for elderly users and people
 * with cognitive disabilities or autism.
 * 
 * Monitors user behavior and provides status updates with recommended actions.
 */

import { useState, useEffect, useCallback, useRef } from 'react'

// Distress status levels
export const DISTRESS_STATUS = {
  SAFE: 'safe',
  NAVIGATING: 'navigating',
  WARNING: 'warning',
  DISTRESS: 'distress',
  EMERGENCY: 'emergency',
  SAFE_ZONE_ROUTING: 'safe_zone_routing',
}

// Recommended actions
export const RECOMMENDED_ACTIONS = {
  CONTINUE_GUIDANCE: 'continue_guidance',
  NOTIFY_GUARDIAN: 'notify_guardian',
  ROUTE_TO_SAFE_ZONE: 'route_to_safe_zone',
  REQUEST_SAFE_RIDE: 'request_safe_ride',
  CALL_EMERGENCY: 'call_emergency',
}

// Configuration thresholds
const DEFAULT_CONFIG = {
  routeDeviationThreshold: 100, // meters
  idleTimeThreshold: 300, // seconds (5 minutes)
  repeatedDeviationThreshold: 3, // count
  maxIdleBeforeDistress: 600, // seconds (10 minutes)
  dangerHazardPersistenceThreshold: 3, // number of consecutive danger detections
  cautionHazardPersistenceThreshold: 5, // number of consecutive caution detections
  safeZoneProximityThreshold: 500, // meters - consider nearby if within this distance
}

/**
 * useDistressEngine Hook
 * @param {Object} options - Configuration options
 * @param {Object} options.currentLocation - Current location {lat, lng}
 * @param {Object} options.routeState - Route state {isActive, coordinates, destination}
 * @param {number} options.idleTime - Time user has been idle (seconds)
 * @param {number} options.deviationCount - Number of route deviations
 * @param {boolean} options.manualSOS - Manual SOS button pressed
 * @param {Object} options.latestHazard - Latest hazard from AR detection {severity, category, class, confidence}
 * @param {Array} options.recentDetections - Recent hazard detections
 * @param {Object} options.nearestSafeZone - Nearest Safe Zone {distance, name}
 * @param {Object} options.config - Custom configuration thresholds
 * @returns {Object} Distress engine state and controls
 */
export function useDistressEngine({
  currentLocation = null,
  routeState = { isActive: false, coordinates: [], destination: null },
  idleTime = 0,
  deviationCount = 0,
  manualSOS = false,
  latestHazard = null,
  recentDetections = [],
  nearestSafeZone = null,
  config = DEFAULT_CONFIG,
} = {}) {
  const [status, setStatus] = useState(DISTRESS_STATUS.SAFE)
  const [reason, setReason] = useState(null)
  const [recommendedActions, setRecommendedActions] = useState([])
  const [distressLevel, setDistressLevel] = useState(0) // 0-100
  const [history, setHistory] = useState([])
  const [userMessage, setUserMessage] = useState(null)

  const previousStatusRef = useRef(status)
  const deviationHistoryRef = useRef([])
  const hazardHistoryRef = useRef([]) // Track hazard persistence

  /**
   * Calculate distance from route
   */
  const calculateRouteDeviation = useCallback(() => {
    if (!currentLocation || !routeState.isActive || !routeState.coordinates.length) {
      return 0
    }

    // Simple distance calculation to nearest route point
    let minDistance = Infinity
    routeState.coordinates.forEach(([lng, lat]) => {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        lat,
        lng
      )
      if (distance < minDistance) {
        minDistance = distance
      }
    })

    return minDistance
  }, [currentLocation, routeState])

  /**
   * Calculate distance between two points (Haversine)
   */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  /**
   * Evaluate distress rules
   */
  const evaluateDistress = useCallback(() => {
    // Rule 1: Manual SOS - Highest priority
    if (manualSOS) {
      return {
        status: DISTRESS_STATUS.EMERGENCY,
        reason: 'Emergency SOS activated',
        actions: [
          RECOMMENDED_ACTIONS.NOTIFY_GUARDIAN,
          RECOMMENDED_ACTIONS.ROUTE_TO_SAFE_ZONE,
          RECOMMENDED_ACTIONS.CALL_EMERGENCY,
        ],
        level: 100,
        message: 'Emergency services have been notified. Help is on the way. Stay calm.',
      }
    }

    // Rule 2: Check if routing to Safe Zone
    if (routeState.isActive && routeState.destination?.isSafeZone) {
      return {
        status: DISTRESS_STATUS.SAFE_ZONE_ROUTING,
        reason: 'Routing to Safe Zone',
        actions: [RECOMMENDED_ACTIONS.CONTINUE_GUIDANCE],
        level: 30,
        message: `Guiding you to ${routeState.destination.name}. You're doing great.`,
      }
    }

    // Rule 3: Hazard-aware distress detection
    // Track hazard persistence
    if (latestHazard) {
      hazardHistoryRef.current.push({
        time: Date.now(),
        severity: latestHazard.severity,
        category: latestHazard.category,
        class: latestHazard.class,
      })

      // Keep only recent hazards (last 30 seconds)
      hazardHistoryRef.current = hazardHistoryRef.current.filter(
        h => Date.now() - h.time < 30000
      )
    }

    // Count persistent danger hazards
    const recentDangerCount = hazardHistoryRef.current.filter(
      h => h.severity === 'danger'
    ).length

    const recentCautionCount = hazardHistoryRef.current.filter(
      h => h.severity === 'caution'
    ).length

    // Rule 3a: Persistent danger hazard (vehicle, etc.)
    if (recentDangerCount >= config.dangerHazardPersistenceThreshold) {
      const hazardType = latestHazard?.class || 'hazard'
      
      // If near Safe Zone, recommend routing there
      if (nearestSafeZone && nearestSafeZone.distance <= config.safeZoneProximityThreshold) {
        return {
          status: DISTRESS_STATUS.DISTRESS,
          reason: `Persistent ${hazardType} detected. Safe Zone nearby.`,
          actions: [
            RECOMMENDED_ACTIONS.ROUTE_TO_SAFE_ZONE,
            RECOMMENDED_ACTIONS.NOTIFY_GUARDIAN,
          ],
          level: 80,
          message: `${hazardType} ahead. A Safe Zone is ${Math.round(nearestSafeZone.distance)}m away. Let's go there.`,
        }
      }

      return {
        status: DISTRESS_STATUS.DISTRESS,
        reason: `Persistent ${hazardType} detected`,
        actions: [
          RECOMMENDED_ACTIONS.NOTIFY_GUARDIAN,
          RECOMMENDED_ACTIONS.REQUEST_SAFE_RIDE,
        ],
        level: 75,
        message: `${hazardType} detected ahead. Please wait for assistance.`,
      }
    }

    // Rule 3b: Persistent caution hazard + route deviation
    const deviation = calculateRouteDeviation()
    if (
      recentCautionCount >= config.cautionHazardPersistenceThreshold &&
      routeState.isActive &&
      deviation > config.routeDeviationThreshold
    ) {
      return {
        status: DISTRESS_STATUS.DISTRESS,
        reason: 'Crowded path and off route',
        actions: [
          RECOMMENDED_ACTIONS.ROUTE_TO_SAFE_ZONE,
          RECOMMENDED_ACTIONS.NOTIFY_GUARDIAN,
        ],
        level: 70,
        message: 'The path is crowded and you seem off route. Let me help you find a clearer path.',
      }
    }

    // Rule 3c: Obstacle + extended idle time
    if (
      latestHazard?.category === 'obstacle' &&
      idleTime >= config.idleTimeThreshold
    ) {
      return {
        status: DISTRESS_STATUS.WARNING,
        reason: 'Obstacle detected and user stationary',
        actions: [
          RECOMMENDED_ACTIONS.CONTINUE_GUIDANCE,
          RECOMMENDED_ACTIONS.NOTIFY_GUARDIAN,
        ],
        level: 60,
        message: 'There seems to be an obstacle. Would you like help navigating around it?',
      }
    }

    // Rule 4: Repeated route deviations
    if (deviationCount >= config.repeatedDeviationThreshold) {
      // If near Safe Zone, recommend routing there
      if (nearestSafeZone && nearestSafeZone.distance <= config.safeZoneProximityThreshold) {
        return {
          status: DISTRESS_STATUS.DISTRESS,
          reason: `Repeated route deviations (${deviationCount} times). Safe Zone nearby.`,
          actions: [
            RECOMMENDED_ACTIONS.ROUTE_TO_SAFE_ZONE,
            RECOMMENDED_ACTIONS.NOTIFY_GUARDIAN,
          ],
          level: 75,
          message: `You've gone off route ${deviationCount} times. There's a Safe Zone ${Math.round(nearestSafeZone.distance)}m away. Let's go there.`,
        }
      }

      return {
        status: DISTRESS_STATUS.DISTRESS,
        reason: `Repeated route deviations (${deviationCount} times)`,
        actions: [
          RECOMMENDED_ACTIONS.NOTIFY_GUARDIAN,
          RECOMMENDED_ACTIONS.ROUTE_TO_SAFE_ZONE,
          RECOMMENDED_ACTIONS.REQUEST_SAFE_RIDE,
        ],
        level: 75,
        message: `You've gone off route ${deviationCount} times. Let me notify your guardian for help.`,
      }
    }

    // Rule 5: Extended idle time
    if (idleTime >= config.maxIdleBeforeDistress) {
      return {
        status: DISTRESS_STATUS.DISTRESS,
        reason: `User idle for ${Math.round(idleTime / 60)} minutes`,
        actions: [
          RECOMMENDED_ACTIONS.NOTIFY_GUARDIAN,
          RECOMMENDED_ACTIONS.ROUTE_TO_SAFE_ZONE,
        ],
        level: 70,
        message: `You've been in the same place for ${Math.round(idleTime / 60)} minutes. Are you okay? I'm notifying your guardian.`,
      }
    }

    // Rule 6: Single danger hazard warning
    if (latestHazard?.severity === 'danger') {
      return {
        status: DISTRESS_STATUS.WARNING,
        reason: `${latestHazard.class} detected`,
        actions: [RECOMMENDED_ACTIONS.CONTINUE_GUIDANCE],
        level: 55,
        message: `${latestHazard.class} ahead. Please proceed with caution.`,
      }
    }

    // Rule 7: Off route beyond threshold
    if (routeState.isActive && deviation > config.routeDeviationThreshold) {
      // Track deviation
      deviationHistoryRef.current.push({
        time: Date.now(),
        distance: deviation,
      })

      // Clean old deviations (older than 10 minutes)
      deviationHistoryRef.current = deviationHistoryRef.current.filter(
        d => Date.now() - d.time < 600000
      )

      return {
        status: DISTRESS_STATUS.WARNING,
        reason: `Off route by ${Math.round(deviation)}m`,
        actions: [
          RECOMMENDED_ACTIONS.CONTINUE_GUIDANCE,
          RECOMMENDED_ACTIONS.ROUTE_TO_SAFE_ZONE,
        ],
        level: 50,
        message: `You're ${Math.round(deviation)}m off route. Let me guide you back.`,
      }
    }

    // Rule 8: Idle time warning
    if (idleTime >= config.idleTimeThreshold) {
      return {
        status: DISTRESS_STATUS.WARNING,
        reason: `User idle for ${Math.round(idleTime / 60)} minutes`,
        actions: [
          RECOMMENDED_ACTIONS.CONTINUE_GUIDANCE,
          RECOMMENDED_ACTIONS.NOTIFY_GUARDIAN,
        ],
        level: 40,
        message: `You've been here for ${Math.round(idleTime / 60)} minutes. Everything okay?`,
      }
    }

    // Rule 9: Caution hazard detected
    if (latestHazard?.severity === 'caution') {
      return {
        status: DISTRESS_STATUS.NAVIGATING,
        reason: `${latestHazard.class} detected`,
        actions: [RECOMMENDED_ACTIONS.CONTINUE_GUIDANCE],
        level: 20,
        message: `${latestHazard.class} nearby. Stay aware of your surroundings.`,
      }
    }

    // Rule 10: Active navigation
    if (routeState.isActive) {
      return {
        status: DISTRESS_STATUS.NAVIGATING,
        reason: `Navigating to ${routeState.destination?.name || 'destination'}`,
        actions: [RECOMMENDED_ACTIONS.CONTINUE_GUIDANCE],
        level: 10,
        message: `On your way to ${routeState.destination?.name || 'your destination'}. You're doing great.`,
      }
    }

    // Default: Safe
    return {
      status: DISTRESS_STATUS.SAFE,
      reason: 'All systems normal',
      actions: [RECOMMENDED_ACTIONS.CONTINUE_GUIDANCE],
      level: 0,
      message: 'All clear. Continue with confidence.',
    }
  }, [
    manualSOS,
    routeState,
    deviationCount,
    idleTime,
    latestHazard,
    recentDetections,
    nearestSafeZone,
    config,
    calculateRouteDeviation,
  ])

  /**
   * Update distress state
   */
  useEffect(() => {
    const result = evaluateDistress()

    // Only update if status actually changed to prevent infinite loops
    setStatus(prevStatus => {
      if (prevStatus !== result.status) {
        return result.status
      }
      return prevStatus
    })
    
    setReason(result.reason)
    setRecommendedActions(result.actions)
    setDistressLevel(result.level)
    setUserMessage(result.message)

    // Log status change
    if (previousStatusRef.current !== result.status) {
      const historyEntry = {
        timestamp: new Date().toISOString(),
        previousStatus: previousStatusRef.current,
        newStatus: result.status,
        reason: result.reason,
        level: result.level,
        message: result.message,
      }

      setHistory(prev => [historyEntry, ...prev].slice(0, 20)) // Keep last 20 entries
      previousStatusRef.current = result.status

      console.log('Distress status changed:', historyEntry)
    }
  }, [
    manualSOS,
    routeState.isActive,
    routeState.destination,
    deviationCount,
    idleTime,
    latestHazard,
    nearestSafeZone,
    // Don't include evaluateDistress as dependency
  ])

  /**
   * Get status color
   */
  const getStatusColor = useCallback(() => {
    const colors = {
      [DISTRESS_STATUS.SAFE]: 'text-green-500',
      [DISTRESS_STATUS.NAVIGATING]: 'text-blue-500',
      [DISTRESS_STATUS.WARNING]: 'text-yellow-500',
      [DISTRESS_STATUS.DISTRESS]: 'text-orange-500',
      [DISTRESS_STATUS.EMERGENCY]: 'text-red-500',
      [DISTRESS_STATUS.SAFE_ZONE_ROUTING]: 'text-purple-500',
    }
    return colors[status] || 'text-gray-500'
  }, [status])

  /**
   * Get status label
   */
  const getStatusLabel = useCallback(() => {
    const labels = {
      [DISTRESS_STATUS.SAFE]: 'Safe',
      [DISTRESS_STATUS.NAVIGATING]: 'Navigating',
      [DISTRESS_STATUS.WARNING]: 'Warning',
      [DISTRESS_STATUS.DISTRESS]: 'Distress',
      [DISTRESS_STATUS.EMERGENCY]: 'Emergency',
      [DISTRESS_STATUS.SAFE_ZONE_ROUTING]: 'Safe Zone Routing',
    }
    return labels[status] || 'Unknown'
  }, [status])

  /**
   * Get action label
   */
  const getActionLabel = useCallback((action) => {
    const labels = {
      [RECOMMENDED_ACTIONS.CONTINUE_GUIDANCE]: 'Continue Guidance',
      [RECOMMENDED_ACTIONS.NOTIFY_GUARDIAN]: 'Notify Guardian',
      [RECOMMENDED_ACTIONS.ROUTE_TO_SAFE_ZONE]: 'Route to Safe Zone',
      [RECOMMENDED_ACTIONS.REQUEST_SAFE_RIDE]: 'Request Safe Ride',
      [RECOMMENDED_ACTIONS.CALL_EMERGENCY]: 'Call Emergency Services',
    }
    return labels[action] || action
  }, [])

  /**
   * Check if action is recommended
   */
  const isActionRecommended = useCallback(
    (action) => {
      return recommendedActions.includes(action)
    },
    [recommendedActions]
  )

  /**
   * Reset distress state
   */
  const reset = useCallback(() => {
    setStatus(DISTRESS_STATUS.SAFE)
    setReason(null)
    setRecommendedActions([])
    setDistressLevel(0)
    setUserMessage(null)
    deviationHistoryRef.current = []
    hazardHistoryRef.current = []
  }, [])

  return {
    // Current state
    status,
    reason,
    recommendedActions,
    distressLevel,
    distressLevelScore: distressLevel, // Alias for compatibility
    history,
    userMessage,

    // Helpers
    getStatusColor,
    getStatusLabel,
    getActionLabel,
    isActionRecommended,
    reset,

    // Constants
    DISTRESS_STATUS,
    RECOMMENDED_ACTIONS,
  }
}

export default useDistressEngine
