/**
 * useCaregiverMonitoring Hook - Fixed version
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchLatestUserState } from '@/services/database'

export function useCaregiverMonitoring({
  userId,
  useDemoMode = false,
  demoState = null,
  refreshInterval = 5000,
} = {}) {
  const [userState, setUserState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [events, setEvents] = useState([])
  const [activeAlerts, setActiveAlerts] = useState([])
  const [caregiverActions, setCaregiverActions] = useState([])

  const demoInitialized = useRef(false)

  // BUG FIX: extracted as standalone functions so they can be called from both
  // fetchUserState and the demo-init effect without causing stale closure issues
  const buildEventsFromData = useCallback((data) => {
    const newEvents = []

    if (data.hazards?.length > 0) {
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

    if (data.distress?.length > 0) {
      data.distress.forEach(distress => {
        newEvents.push({
          id: `distress-${distress.id}`,
          timestamp: new Date(distress.detected_at),
          type: 'distress',
          severity: distress.distress_level,
          title: `Distress Level: ${distress.distress_level}`,
          // BUG FIX: indicators may not always be an array — guard with optional chaining
          description: (distress.indicators || []).join(', '),
          indicators: distress.indicators || [],
        })
      })
    }

    if (data.rides?.length > 0) {
      data.rides.forEach(ride => {
        newEvents.push({
          id: `ride-${ride.id}`,
          timestamp: new Date(ride.requested_at),
          type: 'safe_ride',
          status: ride.status,
          title: `Safe Ride ${ride.status}`,
          description: `To: ${ride.dropoff_address}`,
        })
      })
    }

    newEvents.sort((a, b) => b.timestamp - a.timestamp)
    setEvents(newEvents)
  }, [])

  const buildActiveAlertsFromData = useCallback((data) => {
    const alerts = []

    if (data.hazards?.length > 0) {
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

    if (data.distress?.length > 0) {
      const latestDistress = data.distress[0]
      if (latestDistress.distress_level !== 'none' && latestDistress.distress_level !== 'low') {
        alerts.push({
          id: `alert-distress-${latestDistress.id}`,
          type: 'distress',
          severity: latestDistress.distress_level === 'critical' ? 'danger' : 'warning',
          title: `Distress Level: ${latestDistress.distress_level}`,
          description: (latestDistress.indicators || []).join(', '),
          timestamp: new Date(latestDistress.detected_at),
          acknowledged: false,
        })
      }
    }

    if (data.rides?.length > 0) {
      const activeRide = data.rides.find(r => r.status === 'in_progress' || r.status === 'arriving')
      if (activeRide) {
        alerts.push({
          id: `alert-ride-${activeRide.id}`,
          type: 'safe_ride',
          severity: 'info',
          title: `Safe Ride ${activeRide.status}`,
          description: activeRide.driver_name ? `Driver: ${activeRide.driver_name}` : 'Ride in progress',
          timestamp: new Date(activeRide.requested_at),
          acknowledged: false,
        })
      }
    }

    setActiveAlerts(alerts)
  }, [])

  const fetchUserState = useCallback(async () => {
    if (useDemoMode && demoState) {
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
        if (fetchError.message?.includes('infinite recursion')) {
          console.warn('Database RLS policy error — switching to demo mode')
          const fallback = {
            profile: { id: userId, full_name: 'Demo User', email: 'demo@neurolens.com', role: 'user' },
            location: null, hazards: [], distress: [], rides: [],
          }
          setUserState(fallback)
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
      buildEventsFromData(data)
      buildActiveAlertsFromData(data)
    } catch (err) {
      console.error('Error fetching user state:', err)
      if (err.message?.includes('infinite recursion') || err.message?.includes('policy')) {
        const fallback = {
          profile: { id: userId, full_name: 'Demo User', email: 'demo@neurolens.com', role: 'user' },
          location: null, hazards: [], distress: [], rides: [],
        }
        setUserState(fallback)
        setLastUpdate(new Date())
        setError(null)
        setIsLoading(false)
        return
      }
      setError(err.message)
      setIsLoading(false)
    }
  }, [userId, useDemoMode, demoState, buildEventsFromData, buildActiveAlertsFromData])

  const acknowledgeAlert = useCallback((alertId) => {
    setActiveAlerts(prev =>
      prev.map(alert => alert.id === alertId ? { ...alert, acknowledged: true } : alert)
    )
  }, [])

  const clearAllAlerts = useCallback(() => setActiveAlerts([]), [])

  const addCaregiverAction = useCallback((action) => {
    const newAction = { id: `action-${Date.now()}`, timestamp: new Date(), ...action }
    setCaregiverActions(prev => [newAction, ...prev])
    setEvents(prev => [{
      id: newAction.id,
      timestamp: newAction.timestamp,
      type: 'caregiver_action',
      severity: 'info',
      title: action.title,
      description: action.description,
    }, ...prev])
  }, [])

  const callUser = useCallback(() => addCaregiverAction({ type: 'call_user', title: 'Called User', description: 'Initiated phone call to user' }), [addCaregiverAction])
  const callGuardian = useCallback(() => addCaregiverAction({ type: 'call_guardian', title: 'Called Guardian', description: 'Initiated phone call to guardian' }), [addCaregiverAction])
  const routeToSafeZone = useCallback((safeZoneName) => addCaregiverAction({ type: 'route_to_safe_zone', title: 'Routed to Safe Zone', description: `Initiated route to ${safeZoneName}` }), [addCaregiverAction])
  const triggerSafeRide = useCallback(() => addCaregiverAction({ type: 'trigger_safe_ride', title: 'Safe Ride Requested', description: 'Initiated Safe Ride request for user' }), [addCaregiverAction])
  const escalateEmergency = useCallback(() => addCaregiverAction({ type: 'escalate_emergency', title: 'Emergency Escalated', description: 'Escalated to emergency services' }), [addCaregiverAction])

  // BUG FIX: interval was not being cleared properly when useDemoMode changed
  useEffect(() => {
    if (useDemoMode) return
    fetchUserState()
    const interval = setInterval(fetchUserState, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchUserState, refreshInterval, useDemoMode])

  // BUG FIX: demo init now uses buildEventsFromData/buildActiveAlertsFromData
  // which are stable useCallback refs — no more stale closures
  useEffect(() => {
    if (useDemoMode && demoState && !demoInitialized.current) {
      demoInitialized.current = true
      setUserState(demoState)
      setLastUpdate(new Date())
      setIsLoading(false)
      buildEventsFromData(demoState)
      buildActiveAlertsFromData(demoState)
    }
  }, [useDemoMode, demoState, buildEventsFromData, buildActiveAlertsFromData])

  return {
    userState, isLoading, error, lastUpdate,
    events, activeAlerts, caregiverActions,
    refreshUserState: fetchUserState,
    acknowledgeAlert, clearAllAlerts,
    callUser, callGuardian, routeToSafeZone, triggerSafeRide, escalateEmergency,
  }
}

export default useCaregiverMonitoring
