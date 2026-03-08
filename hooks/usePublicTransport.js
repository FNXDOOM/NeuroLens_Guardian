/**
 * usePublicTransport Hook
 * 
 * Manages public transport journey state and integrates with
 * navigation, distress engine, and guardian monitoring.
 * 
 * @module hooks/usePublicTransport
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  TRANSIT_STATES,
  TRANSIT_DISTRESS_REASONS,
  findNearestBusStop,
  findRoutesForStop,
  getNextStop,
  checkMissedStop,
  getTransitGuidanceMessage,
  evaluateTransitDistress,
  getTransitStateLabel,
  getTransitStateColor,
} from '@/services/publicTransport'

/**
 * usePublicTransport Hook
 * @param {Object} options - Configuration options
 * @param {Object} options.userLocation - Current user location {lat, lng}
 * @param {boolean} options.enabled - Enable transit mode
 * @param {Function} options.onStateChange - State change callback
 * @param {Function} options.onDistress - Distress callback
 * @returns {Object} Transit state and controls
 */
export function usePublicTransport({
  userLocation = null,
  enabled = false,
  onStateChange = null,
  onDistress = null,
} = {}) {
  // Transit state
  const [transitState, setTransitState] = useState(TRANSIT_STATES.INACTIVE)
  const [currentStop, setCurrentStop] = useState(null)
  const [targetStop, setTargetStop] = useState(null)
  const [targetBus, setTargetBus] = useState(null)
  const [boardingStatus, setBoardingStatus] = useState(null)
  const [nextStop, setNextStop] = useState(null)
  const [stopsRemaining, setStopsRemaining] = useState(0)
  const [waitingTime, setWaitingTime] = useState(0)
  const [guardianNotified, setGuardianNotified] = useState(false)
  const [safeRideFallback, setSafeRideFallback] = useState(false)
  const [distressReason, setDistressReason] = useState(null)

  // Refs
  const waitingTimerRef = useRef(null)
  const previousStateRef = useRef(transitState)

  /**
   * Start transit journey
   */
  const startTransitJourney = useCallback((busNumber, destinationStop) => {
    setTargetBus(busNumber)
    setTargetStop(destinationStop)
    setTransitState(TRANSIT_STATES.WALKING_TO_STOP)
    setWaitingTime(0)
    setGuardianNotified(false)
    setSafeRideFallback(false)
    setDistressReason(null)

    console.log('Transit journey started:', { busNumber, destinationStop })
  }, [])

  /**
   * Reach bus stop
   */
  const reachBusStop = useCallback((stop) => {
    setCurrentStop(stop)
    setTransitState(TRANSIT_STATES.WAITING_FOR_BUS)
    
    // Start waiting timer
    waitingTimerRef.current = setInterval(() => {
      setWaitingTime(prev => prev + 1)
    }, 1000)

    console.log('Reached bus stop:', stop)
  }, [])

  /**
   * Identify bus
   */
  const identifyBus = useCallback(() => {
    setTransitState(TRANSIT_STATES.BUS_IDENTIFIED)
    
    // Clear waiting timer
    if (waitingTimerRef.current) {
      clearInterval(waitingTimerRef.current)
      waitingTimerRef.current = null
    }

    console.log('Bus identified:', targetBus)
  }, [targetBus])

  /**
   * Board bus
   */
  const boardBus = useCallback(() => {
    setTransitState(TRANSIT_STATES.BOARDING)
    setBoardingStatus('boarding')

    // Transition to in transit after 5 seconds
    setTimeout(() => {
      setTransitState(TRANSIT_STATES.IN_TRANSIT)
      setBoardingStatus('boarded')
      
      // Calculate next stop
      if (targetBus && currentStop) {
        const next = getNextStop(targetBus.id, currentStop.id)
        setNextStop(next)
      }
    }, 5000)

    console.log('Boarding bus')
  }, [targetBus, currentStop])

  /**
   * Update current stop during transit
   */
  const updateCurrentStop = useCallback((stop) => {
    setCurrentStop(stop)

    // Check if missed target stop
    if (targetBus && targetStop) {
      const missed = checkMissedStop(targetBus.id, stop.id, targetStop.id)
      if (missed) {
        setTransitState(TRANSIT_STATES.MISSED_STOP_WARNING)
        setDistressReason(TRANSIT_DISTRESS_REASONS.MISSED_STOP)
        return
      }
    }

    // Check if next stop is target
    if (targetStop && stop.id === targetStop.id) {
      setTransitState(TRANSIT_STATES.PREPARE_TO_EXIT)
    } else {
      // Update next stop
      if (targetBus) {
        const next = getNextStop(targetBus.id, stop.id)
        setNextStop(next)
        
        // Check if next stop is target
        if (next && targetStop && next.id === targetStop.id) {
          setTransitState(TRANSIT_STATES.PREPARE_TO_EXIT)
        }
      }
    }

    console.log('Current stop updated:', stop)
  }, [targetBus, targetStop])

  /**
   * Complete journey
   */
  const completeJourney = useCallback(() => {
    setTransitState(TRANSIT_STATES.COMPLETED)
    setBoardingStatus(null)
    setWaitingTime(0)

    console.log('Transit journey completed')
  }, [])

  /**
   * Trigger transit distress
   */
  const triggerTransitDistress = useCallback((reason) => {
    setTransitState(TRANSIT_STATES.TRANSIT_DISTRESS)
    setDistressReason(reason)
    setGuardianNotified(true)

    if (onDistress) {
      onDistress({
        reason,
        currentStop,
        targetStop,
        targetBus,
      })
    }

    console.log('Transit distress triggered:', reason)
  }, [currentStop, targetStop, targetBus, onDistress])

  /**
   * Activate Safe Ride fallback
   */
  const activateSafeRideFallback = useCallback(() => {
    setTransitState(TRANSIT_STATES.SAFE_RIDE_FALLBACK)
    setSafeRideFallback(true)

    console.log('Safe Ride fallback activated')
  }, [])

  /**
   * Cancel transit journey
   */
  const cancelTransitJourney = useCallback(() => {
    setTransitState(TRANSIT_STATES.INACTIVE)
    setCurrentStop(null)
    setTargetStop(null)
    setTargetBus(null)
    setBoardingStatus(null)
    setNextStop(null)
    setStopsRemaining(0)
    setWaitingTime(0)
    setGuardianNotified(false)
    setSafeRideFallback(false)
    setDistressReason(null)

    if (waitingTimerRef.current) {
      clearInterval(waitingTimerRef.current)
      waitingTimerRef.current = null
    }

    console.log('Transit journey cancelled')
  }, [])

  /**
   * Find nearest stop
   */
  const findNearestStop = useCallback(() => {
    if (!userLocation) return null
    return findNearestBusStop(userLocation)
  }, [userLocation])

  /**
   * Get guidance message
   */
  const getGuidanceMessage = useCallback(() => {
    const context = {
      busNumber: targetBus?.number,
      distanceToStop: currentStop?.distance,
      stopsRemaining,
    }
    return getTransitGuidanceMessage(transitState, context)
  }, [transitState, targetBus, currentStop, stopsRemaining])

  /**
   * Evaluate distress conditions
   */
  useEffect(() => {
    if (!enabled || transitState === TRANSIT_STATES.INACTIVE) return

    const distressEval = evaluateTransitDistress({
      state: transitState,
      waitingTime,
      missedStop: transitState === TRANSIT_STATES.MISSED_STOP_WARNING,
      wrongStop: false, // TODO: Implement wrong stop detection
      manualHelpRequest: false,
    })

    if (distressEval.isDistress && transitState !== TRANSIT_STATES.TRANSIT_DISTRESS) {
      triggerTransitDistress(distressEval.reason)
    }
  }, [enabled, transitState, waitingTime, triggerTransitDistress])

  /**
   * Notify state changes
   */
  useEffect(() => {
    if (previousStateRef.current !== transitState) {
      if (onStateChange) {
        onStateChange(transitState, previousStateRef.current)
      }
      previousStateRef.current = transitState
    }
  }, [transitState, onStateChange])

  /**
   * Cleanup
   */
  useEffect(() => {
    return () => {
      if (waitingTimerRef.current) {
        clearInterval(waitingTimerRef.current)
      }
    }
  }, [])

  return {
    // State
    transitState,
    currentStop,
    targetStop,
    targetBus,
    boardingStatus,
    nextStop,
    stopsRemaining,
    waitingTime,
    guardianNotified,
    safeRideFallback,
    distressReason,
    isActive: transitState !== TRANSIT_STATES.INACTIVE,

    // Controls
    startTransitJourney,
    reachBusStop,
    identifyBus,
    boardBus,
    updateCurrentStop,
    completeJourney,
    triggerTransitDistress,
    activateSafeRideFallback,
    cancelTransitJourney,
    findNearestStop,

    // Helpers
    getGuidanceMessage,
    getStateLabel: () => getTransitStateLabel(transitState),
    getStateColor: () => getTransitStateColor(transitState),

    // Constants
    TRANSIT_STATES,
    TRANSIT_DISTRESS_REASONS,
  }
}

export default usePublicTransport
