/**
 * useDemoMode Hook
 * 
 * Demo-friendly simulation control system for NeuroLens Guardian.
 * Provides predictable state changes for hackathon recordings and presentations.
 * 
 * Features:
 * - Simulate hazards (vehicle, obstacle, crowded path)
 * - Simulate navigation events (route deviation)
 * - Simulate distress states
 * - Simulate emergency scenarios
 * - Simulate Safe Zone recommendations
 * - Simulate guardian notifications
 * - Simulate Safe Ride requests
 * - Toggle demo mode on/off
 * - Clear separation from real input logic
 * 
 * @module hooks/useDemoMode
 */

import { useState, useCallback, useRef, useEffect } from 'react'

// Demo event types
export const DEMO_EVENTS = {
  OBSTACLE: 'obstacle',
  VEHICLE: 'vehicle',
  CROWDED_PATH: 'crowded_path',
  ROUTE_DEVIATION: 'route_deviation',
  DISTRESS: 'distress',
  EMERGENCY: 'emergency',
  SAFE_ZONE_RECOMMENDATION: 'safe_zone_recommendation',
  GUARDIAN_NOTIFICATION: 'guardian_notification',
  SAFE_RIDE_REQUEST: 'safe_ride_request',
  CLEAR_ALL: 'clear_all',
}

// Demo hazard templates
const DEMO_HAZARDS = {
  [DEMO_EVENTS.OBSTACLE]: {
    class: 'chair',
    category: 'obstacle',
    severity: 'safe',
    confidence: 0.85,
    warning: 'Obstacle ahead',
    bbox: [100, 150, 200, 250],
  },
  [DEMO_EVENTS.VEHICLE]: {
    class: 'car',
    category: 'vehicle',
    severity: 'danger',
    confidence: 0.92,
    warning: 'Vehicle ahead',
    bbox: [150, 100, 300, 300],
  },
  [DEMO_EVENTS.CROWDED_PATH]: {
    class: 'person',
    category: 'pedestrian',
    severity: 'caution',
    confidence: 0.88,
    warning: 'Crowded path',
    bbox: [120, 120, 220, 320],
  },
}

/**
 * useDemoMode Hook
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Enable demo mode (default: false)
 * @param {number} options.eventDuration - Duration of demo events in ms (default: 5000)
 * @returns {Object} Demo mode state and controls
 */
export function useDemoMode({
  enabled = false,
  eventDuration = 5000,
} = {}) {
  // Demo mode state
  const [isDemoMode, setIsDemoMode] = useState(enabled)
  const [activeEvent, setActiveEvent] = useState(null)
  const [demoHazard, setDemoHazard] = useState(null)
  const [demoDetections, setDemoDetections] = useState([])
  const [demoRouteDeviation, setDemoRouteDeviation] = useState(false)
  const [demoDistress, setDemoDistress] = useState(false)
  const [demoEmergency, setDemoEmergency] = useState(false)
  const [demoSafeZoneRecommendation, setDemoSafeZoneRecommendation] = useState(false)
  const [demoGuardianNotified, setDemoGuardianNotified] = useState(false)
  const [demoSafeRideActive, setDemoSafeRideActive] = useState(false)
  const [demoDeviationCount, setDemoDeviationCount] = useState(0)
  const [demoIdleTime, setDemoIdleTime] = useState(0)

  // Event history
  const [eventHistory, setEventHistory] = useState([])

  // Timers
  const eventTimerRef = useRef(null)
  const hazardTimerRef = useRef(null)

  /**
   * Clear all demo state
   */
  const clearDemoState = useCallback(() => {
    setActiveEvent(null)
    setDemoHazard(null)
    setDemoDetections([])
    setDemoRouteDeviation(false)
    setDemoDistress(false)
    setDemoEmergency(false)
    setDemoSafeZoneRecommendation(false)
    setDemoGuardianNotified(false)
    setDemoSafeRideActive(false)
    setDemoDeviationCount(0)
    setDemoIdleTime(0)

    // Clear timers
    if (eventTimerRef.current) {
      clearTimeout(eventTimerRef.current)
      eventTimerRef.current = null
    }
    if (hazardTimerRef.current) {
      clearTimeout(hazardTimerRef.current)
      hazardTimerRef.current = null
    }
  }, [])

  /**
   * Log event to history
   */
  const logEvent = useCallback((eventType, description) => {
    const entry = {
      timestamp: new Date().toISOString(),
      eventType,
      description,
    }
    setEventHistory(prev => [entry, ...prev].slice(0, 20)) // Keep last 20
    console.log('Demo Event:', entry)
  }, [])

  /**
   * Simulate obstacle hazard
   */
  const simulateObstacle = useCallback(() => {
    if (!isDemoMode) return

    clearDemoState()
    setActiveEvent(DEMO_EVENTS.OBSTACLE)
    
    const hazard = {
      ...DEMO_HAZARDS[DEMO_EVENTS.OBSTACLE],
      id: `demo-obstacle-${Date.now()}`,
      timestamp: Date.now(),
    }
    
    setDemoHazard(hazard)
    setDemoDetections([hazard])
    logEvent(DEMO_EVENTS.OBSTACLE, 'Obstacle detected - chair ahead')

    // Auto-clear after duration
    eventTimerRef.current = setTimeout(() => {
      setDemoHazard(null)
      setDemoDetections([])
      setActiveEvent(null)
    }, eventDuration)
  }, [isDemoMode, eventDuration, clearDemoState, logEvent])

  /**
   * Simulate vehicle hazard
   */
  const simulateVehicle = useCallback(() => {
    if (!isDemoMode) return

    clearDemoState()
    setActiveEvent(DEMO_EVENTS.VEHICLE)
    
    const hazard = {
      ...DEMO_HAZARDS[DEMO_EVENTS.VEHICLE],
      id: `demo-vehicle-${Date.now()}`,
      timestamp: Date.now(),
    }
    
    setDemoHazard(hazard)
    setDemoDetections([hazard])
    logEvent(DEMO_EVENTS.VEHICLE, 'Vehicle detected - car ahead')

    // Simulate persistent vehicle (3 detections for distress trigger)
    let detectionCount = 0
    const persistentInterval = setInterval(() => {
      detectionCount++
      const newHazard = {
        ...hazard,
        id: `demo-vehicle-${Date.now()}-${detectionCount}`,
        timestamp: Date.now(),
      }
      setDemoDetections(prev => [...prev, newHazard].slice(-5))
      
      if (detectionCount >= 3) {
        clearInterval(persistentInterval)
      }
    }, 1000)

    // Auto-clear after duration
    eventTimerRef.current = setTimeout(() => {
      clearInterval(persistentInterval)
      setDemoHazard(null)
      setDemoDetections([])
      setActiveEvent(null)
    }, eventDuration)
  }, [isDemoMode, eventDuration, clearDemoState, logEvent])

  /**
   * Simulate crowded path
   */
  const simulateCrowdedPath = useCallback(() => {
    if (!isDemoMode) return

    clearDemoState()
    setActiveEvent(DEMO_EVENTS.CROWDED_PATH)
    
    // Simulate multiple people detections
    const people = []
    for (let i = 0; i < 5; i++) {
      people.push({
        ...DEMO_HAZARDS[DEMO_EVENTS.CROWDED_PATH],
        id: `demo-person-${Date.now()}-${i}`,
        timestamp: Date.now(),
        bbox: [100 + i * 30, 120, 180 + i * 30, 320],
      })
    }
    
    setDemoHazard(people[0])
    setDemoDetections(people)
    logEvent(DEMO_EVENTS.CROWDED_PATH, 'Crowded path detected - 5 people ahead')

    // Auto-clear after duration
    eventTimerRef.current = setTimeout(() => {
      setDemoHazard(null)
      setDemoDetections([])
      setActiveEvent(null)
    }, eventDuration)
  }, [isDemoMode, eventDuration, clearDemoState, logEvent])

  /**
   * Simulate route deviation
   */
  const simulateRouteDeviation = useCallback(() => {
    if (!isDemoMode) return

    clearDemoState()
    setActiveEvent(DEMO_EVENTS.ROUTE_DEVIATION)
    setDemoRouteDeviation(true)
    setDemoDeviationCount(prev => prev + 1)
    logEvent(DEMO_EVENTS.ROUTE_DEVIATION, 'Route deviation detected - off route by 150m')

    // Auto-clear after duration
    eventTimerRef.current = setTimeout(() => {
      setDemoRouteDeviation(false)
      setActiveEvent(null)
    }, eventDuration)
  }, [isDemoMode, eventDuration, clearDemoState, logEvent])

  /**
   * Simulate distress state
   */
  const simulateDistress = useCallback(() => {
    if (!isDemoMode) return

    clearDemoState()
    setActiveEvent(DEMO_EVENTS.DISTRESS)
    setDemoDistress(true)
    setDemoSafeZoneRecommendation(true)
    setDemoDeviationCount(3) // Trigger distress threshold
    logEvent(DEMO_EVENTS.DISTRESS, 'Distress state activated - repeated deviations')

    // Auto-clear after duration
    eventTimerRef.current = setTimeout(() => {
      setDemoDistress(false)
      setDemoSafeZoneRecommendation(false)
      setActiveEvent(null)
    }, eventDuration * 1.5) // Longer duration for distress
  }, [isDemoMode, eventDuration, clearDemoState, logEvent])

  /**
   * Simulate emergency
   */
  const simulateEmergency = useCallback(() => {
    if (!isDemoMode) return

    clearDemoState()
    setActiveEvent(DEMO_EVENTS.EMERGENCY)
    setDemoEmergency(true)
    setDemoGuardianNotified(true)
    setDemoSafeZoneRecommendation(true)
    logEvent(DEMO_EVENTS.EMERGENCY, 'Emergency SOS activated - guardian notified')

    // Auto-clear after duration
    eventTimerRef.current = setTimeout(() => {
      setDemoEmergency(false)
      setDemoGuardianNotified(false)
      setDemoSafeZoneRecommendation(false)
      setActiveEvent(null)
    }, eventDuration * 2) // Longer duration for emergency
  }, [isDemoMode, eventDuration, clearDemoState, logEvent])

  /**
   * Simulate Safe Zone recommendation
   */
  const simulateSafeZoneRecommendation = useCallback(() => {
    if (!isDemoMode) return

    setActiveEvent(DEMO_EVENTS.SAFE_ZONE_RECOMMENDATION)
    setDemoSafeZoneRecommendation(true)
    logEvent(DEMO_EVENTS.SAFE_ZONE_RECOMMENDATION, 'Safe Zone recommended - 250m away')

    // Auto-clear after duration
    eventTimerRef.current = setTimeout(() => {
      setDemoSafeZoneRecommendation(false)
      setActiveEvent(null)
    }, eventDuration)
  }, [isDemoMode, eventDuration, logEvent])

  /**
   * Simulate guardian notification
   */
  const simulateGuardianNotification = useCallback(() => {
    if (!isDemoMode) return

    setActiveEvent(DEMO_EVENTS.GUARDIAN_NOTIFICATION)
    setDemoGuardianNotified(true)
    logEvent(DEMO_EVENTS.GUARDIAN_NOTIFICATION, 'Guardian notified - alert sent')

    // Auto-clear after duration
    eventTimerRef.current = setTimeout(() => {
      setDemoGuardianNotified(false)
      setActiveEvent(null)
    }, eventDuration)
  }, [isDemoMode, eventDuration, logEvent])

  /**
   * Simulate Safe Ride request
   */
  const simulateSafeRideRequest = useCallback(() => {
    if (!isDemoMode) return

    setActiveEvent(DEMO_EVENTS.SAFE_RIDE_REQUEST)
    setDemoSafeRideActive(true)
    logEvent(DEMO_EVENTS.SAFE_RIDE_REQUEST, 'Safe Ride requested - searching for driver')

    // Auto-clear after duration
    eventTimerRef.current = setTimeout(() => {
      setDemoSafeRideActive(false)
      setActiveEvent(null)
    }, eventDuration)
  }, [isDemoMode, eventDuration, logEvent])

  /**
   * Clear all demo events
   */
  const clearAll = useCallback(() => {
    clearDemoState()
    logEvent(DEMO_EVENTS.CLEAR_ALL, 'All demo events cleared')
  }, [clearDemoState, logEvent])

  /**
   * Toggle demo mode
   */
  const toggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => {
      const newValue = !prev
      if (!newValue) {
        clearDemoState()
      }
      console.log('Demo Mode:', newValue ? 'ENABLED' : 'DISABLED')
      return newValue
    })
  }, [clearDemoState])

  /**
   * Enable demo mode
   */
  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true)
    console.log('Demo Mode: ENABLED')
  }, [])

  /**
   * Disable demo mode
   */
  const disableDemoMode = useCallback(() => {
    setIsDemoMode(false)
    clearDemoState()
    console.log('Demo Mode: DISABLED')
  }, [clearDemoState])

  /**
   * Run demo sequence (for automated demos)
   */
  const runDemoSequence = useCallback(async () => {
    if (!isDemoMode) return

    console.log('Running demo sequence...')
    
    // Sequence: obstacle → vehicle → crowded → deviation → distress → emergency
    const sequence = [
      { action: simulateObstacle, delay: 0, name: 'Obstacle' },
      { action: simulateVehicle, delay: eventDuration + 1000, name: 'Vehicle' },
      { action: simulateCrowdedPath, delay: eventDuration + 1000, name: 'Crowded Path' },
      { action: simulateRouteDeviation, delay: eventDuration + 1000, name: 'Route Deviation' },
      { action: simulateDistress, delay: eventDuration + 1000, name: 'Distress' },
      { action: simulateEmergency, delay: eventDuration * 1.5 + 1000, name: 'Emergency' },
    ]

    let totalDelay = 0
    for (const step of sequence) {
      setTimeout(() => {
        console.log(`Demo Sequence: ${step.name}`)
        step.action()
      }, totalDelay)
      totalDelay += step.delay
    }
  }, [
    isDemoMode,
    eventDuration,
    simulateObstacle,
    simulateVehicle,
    simulateCrowdedPath,
    simulateRouteDeviation,
    simulateDistress,
    simulateEmergency,
  ])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearDemoState()
    }
  }, [clearDemoState])

  return {
    // Demo mode state
    isDemoMode,
    activeEvent,
    
    // Demo data
    demoHazard,
    demoDetections,
    demoRouteDeviation,
    demoDistress,
    demoEmergency,
    demoSafeZoneRecommendation,
    demoGuardianNotified,
    demoSafeRideActive,
    demoDeviationCount,
    demoIdleTime,
    
    // Event history
    eventHistory,
    
    // Controls
    toggleDemoMode,
    enableDemoMode,
    disableDemoMode,
    
    // Simulation actions
    simulateObstacle,
    simulateVehicle,
    simulateCrowdedPath,
    simulateRouteDeviation,
    simulateDistress,
    simulateEmergency,
    simulateSafeZoneRecommendation,
    simulateGuardianNotification,
    simulateSafeRideRequest,
    clearAll,
    runDemoSequence,
    
    // Constants
    DEMO_EVENTS,
  }
}

export default useDemoMode
