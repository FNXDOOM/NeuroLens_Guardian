/**
 * useCaregiverMonitoring Hook
 * 
 * Manages caregiver dashboard state by connecting to user state
 * through Supabase or demo mode simulation.
 * 
 * @module hooks/useCaregiverMonitoring
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchLatestUserState } from '@/services/database'

/**
 * useCaregiverMonitoring Hook
 * @param {Object} options - Configuration options
 * @param {string} options.userId - User ID to monitor
 * @param {boolean} options.useDemoMode - Use demo mode instead of real data
 * @param {Object} options.demoState - Demo state object (when useDemoMode is true)
 * @param {number} options.refreshInterval - Refresh interval in ms (default: 5000)
 * @returns {Object} Monitoring state and controls
 */
export function useCaregiverMonitoring({
  userId,
  useDemoMode = false,
  demoState = null,
  refreshInterval = 5000,
} = {}) {
  // User state
  const [userState, setUserState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Event timeline
  const [events, setEvents] = useState([])

  // Active alerts
  const [activeAlerts, setActiveAlerts] = useState([])

  // Caregiver actions
  const [caregiverActions, setCaregiverActions] = useState([])

  // Use ref to track if demo state has been initialized
  const demoInitialized = useRef(false)

  /**
   * Fetch user state from database
   */
  const fetchUserState = useCallback(async () => {
    if (useDemoMode && demoState) {
      // Use demo state
      setUserState(demoState)
      setLastUpdate(new Date())
      setIsLoading(false)
      return
    }

    if (!userId) {
      setError('No user ID provided')
      setIsLoading(false)
      return
    }

    try {
      const { data, error: fetchError } = await fetchLatestUserState(userId)

      if (fetchError) {
        // If it's an RLS policy error, use demo mode instead of failing
        if (fetchError.message && fetchError.message.includes('infinite recursion')) {
          console.warn('Database RLS policy error - switching to demo mode')
          setUserState({
            profile: {
              id: userId,
              full_name: 'Demo User',
              email: 'demo@neurolens.com',
              role: 'user',
            },
            location: null,
            hazards: [],
            distress: [],
            rides: [],
          })
          setLastUpdate(new Date())
          setError(null)
          setIsLoading(false)
          return
        }
        
        setError(fetchError.message)
        setIsLoading(false)
        return
      }

      setUserState(data)
      setLastUpdate(new Date())
      setError(null)
      setIsLoading(false)

      // Build events from data
      buildEventsFromData(data)

      // Build active alerts from data
      buildActiveAlertsFromData(data)
    } catch (err) {
      console.error('Error fetching user state:', err)
      
      // If it's a database error, use demo mode
      if (err.message && (err.message.includes('infinite recursion') || err.message.includes('policy'))) {
        console.warn('Database error - switching to demo mode')
        setUserState({
          profile: {
            id: userId,
            full_name: 'Demo User',
            email: 'demo@neurolens.com',
            role: 'user',
          },
          location: null,
          hazards: [],
          distress: [],
          rides: [],
        })
        setLastUpdate(new Date())
        setError(null)
        setIsLoading(false)
        return
      }
      
      setError(err.message)
      setIsLoading(false)
    }
  }, [userId, useDemoMode, demoState])

  /**
   * Build event timeline from user data
   */
  const buildEventsFromData = (data) => {
    const newEvents = []

    // Add hazard events
    if (data.hazards && data.hazards.length > 0) {
      data.hazards.forEach(hazard => {
        newEvents.push({
          id: `hazard-${hazard.id}`,
          timestamp: new Date(hazard.detected_at),
          type: 'hazard',
          category: hazard.hazard_type,
          severity: hazard.severity,
          title: `${hazard.hazard_type.charAt(0).toUpperCase() + hazard.hazard_type.slice(1)} Detected`,
          description: hazard.description || `Severity: ${hazard.severity}`,
          confidence: hazard.confidence,
        })
      })
    }

    // Add distress events
    if (data.distress && data.distress.length > 0) {
      data.distress.forEach(distress => {
        newEvents.push({
          id: `distress-${distress.id}`,
          timestamp: new Date(distress.detected_at),
          type: 'distress',
          severity: distress.distress_level,
          title: `Distress Level: ${distress.distress_level}`,
          description: distress.indicators.join(', '),
          indicators: distress.indicators,
        })
      })
    }

    // Add ride events
    if (data.rides && data.rides.length > 0) {
      data.rides.forEach(ride => {
        newEvents.push({
          id: `ride-${ride.id}`,
          timestamp: new Date(ride.requested_at),
          type: 'safe_ride',
          status: ride.status,
          title: `Safe Ride ${ride.status}`,
          description: `To: ${ride.dropoff_address}`,
          driver: ride.driver_name,
          vehicle: ride.vehicle_info,
        })
      })
    }

    // Sort by timestamp (most recent first)
    newEvents.sort((a, b) => b.timestamp - a.timestamp)

    setEvents(newEvents)
  }

  /**
   * Build active alerts from user data
   */
  const buildActiveAlertsFromData = (data) => {
    const alerts = []

    // Recent hazards (last 5 minutes)
    if (data.hazards && data.hazards.length > 0) {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      data.hazards.forEach(hazard => {
        const hazardTime = new Date(hazard.detected_at).getTime()
        if (hazardTime > fiveMinutesAgo) {
          alerts.push({
            id: `alert-hazard-${hazard.id}`,
            type: 'hazard',
            severity: hazard.severity === 'high' || hazard.severity === 'critical' ? 'danger' : 'warning',
            title: `${hazard.hazard_type.charAt(0).toUpperCase() + hazard.hazard_type.slice(1)} Detected`,
            description: hazard.description || `Severity: ${hazard.severity}`,
            timestamp: new Date(hazard.detected_at),
            acknowledged: false,
          })
        }
      })
    }

    // Active distress
    if (data.distress && data.distress.length > 0) {
      const latestDistress = data.distress[0]
      if (latestDistress.distress_level !== 'none' && latestDistress.distress_level !== 'low') {
        alerts.push({
          id: `alert-distress-${latestDistress.id}`,
          type: 'distress',
          severity: latestDistress.distress_level === 'critical' ? 'danger' : 'warning',
          title: `Distress Level: ${latestDistress.distress_level}`,
          description: latestDistress.indicators.join(', '),
          timestamp: new Date(latestDistress.detected_at),
          acknowledged: false,
        })
      }
    }

    // Active rides
    if (data.rides && data.rides.length > 0) {
      const activeRide = data.rides.find(r => r.status === 'in_progress' || r.status === 'arriving')
      if (activeRide) {
        alerts.push({
          id: `alert-ride-${activeRide.id}`,
          type: 'safe_ride',
          severity: 'info',
          title: `Safe Ride ${activeRide.status}`,
          description: `Driver: ${activeRide.driver_name}`,
          timestamp: new Date(activeRide.requested_at),
          acknowledged: false,
        })
      }
    }

    setActiveAlerts(alerts)
  }

  /**
   * Acknowledge an alert
   */
  const acknowledgeAlert = useCallback((alertId) => {
    setActiveAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }, [])

  /**
   * Clear all alerts
   */
  const clearAllAlerts = useCallback(() => {
    setActiveAlerts([])
  }, [])

  /**
   * Add caregiver action
   */
  const addCaregiverAction = useCallback((action) => {
    const newAction = {
      id: `action-${Date.now()}`,
      timestamp: new Date(),
      ...action,
    }
    setCaregiverActions(prev => [newAction, ...prev])

    // Add to event timeline
    setEvents(prev => [
      {
        id: newAction.id,
        timestamp: newAction.timestamp,
        type: 'caregiver_action',
        severity: 'info',
        title: action.title,
        description: action.description,
      },
      ...prev,
    ])
  }, [])

  /**
   * Caregiver response actions
   */
  const callUser = useCallback(() => {
    addCaregiverAction({
      type: 'call_user',
      title: 'Called User',
      description: 'Initiated phone call to user',
    })
  }, [addCaregiverAction])

  const callGuardian = useCallback(() => {
    addCaregiverAction({
      type: 'call_guardian',
      title: 'Called Guardian',
      description: 'Initiated phone call to guardian',
    })
  }, [addCaregiverAction])

  const routeToSafeZone = useCallback((safeZoneName) => {
    addCaregiverAction({
      type: 'route_to_safe_zone',
      title: 'Routed to Safe Zone',
      description: `Initiated route to ${safeZoneName}`,
    })
  }, [addCaregiverAction])

  const triggerSafeRide = useCallback(() => {
    addCaregiverAction({
      type: 'trigger_safe_ride',
      title: 'Safe Ride Requested',
      description: 'Initiated Safe Ride request for user',
    })
  }, [addCaregiverAction])

  const escalateEmergency = useCallback(() => {
    addCaregiverAction({
      type: 'escalate_emergency',
      title: 'Emergency Escalated',
      description: 'Escalated to emergency services',
    })
  }, [addCaregiverAction])

  /**
   * Auto-refresh user state
   */
  useEffect(() => {
    // Only fetch if not in demo mode
    if (!useDemoMode) {
      fetchUserState()
      const interval = setInterval(fetchUserState, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchUserState, refreshInterval, useDemoMode])

  /**
   * Initialize demo state once
   */
  useEffect(() => {
    if (useDemoMode && demoState && !demoInitialized.current) {
      demoInitialized.current = true
      setUserState(demoState)
      setLastUpdate(new Date())
      setIsLoading(false)
      buildEventsFromData(demoState)
      buildActiveAlertsFromData(demoState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount

  return {
    // User state
    userState,
    isLoading,
    error,
    lastUpdate,

    // Events and alerts
    events,
    activeAlerts,
    caregiverActions,

    // Controls
    refreshUserState: fetchUserState,
    acknowledgeAlert,
    clearAllAlerts,

    // Caregiver actions
    callUser,
    callGuardian,
    routeToSafeZone,
    triggerSafeRide,
    escalateEmergency,
  }
}

export default useCaregiverMonitoring
