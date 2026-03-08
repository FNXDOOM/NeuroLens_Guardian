/**
 * useLocationTracking Hook - Fixed version
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { insertUserLocation } from '@/services/database'

export function useLocationTracking({
  userId = null,
  enableTracking = true,
  enableSync = true,
  syncInterval = 30000,
  highAccuracy = true,
} = {}) {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState('prompt')
  
  const watchIdRef = useRef(null)
  const lastSyncRef = useRef(null)

  const syncToDatabase = useCallback(async (locationData) => {
    if (!userId || !enableSync) return

    try {
      if (typeof insertUserLocation !== 'function') {
        console.warn('insertUserLocation not available, skipping sync')
        return
      }

      const { error: syncError } = await insertUserLocation({
        user_id: userId,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        altitude: locationData.altitude,
        heading: locationData.heading,
        speed: locationData.speed,
        // BUG FIX: speed can be null on some browsers — guard against null comparison
        is_moving: locationData.speed != null ? locationData.speed > 0.5 : false,
      })

      if (syncError) {
        console.warn('Error syncing location to database:', syncError.message || syncError)
      } else {
        lastSyncRef.current = Date.now()
      }
    } catch (err) {
      console.warn('Error syncing location:', err.message || err)
    }
  }, [userId, enableSync])

  const handleSuccess = useCallback((position) => {
    const locationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
    }

    setLocation(locationData)
    setError(null)
    setIsTracking(true)

    const now = Date.now()
    if (!lastSyncRef.current || now - lastSyncRef.current >= syncInterval) {
      syncToDatabase(locationData)
    }
  }, [syncInterval, syncToDatabase])

  const handleError = useCallback((err) => {
    let errorMessage = 'Unknown error occurred'
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Location permission denied'
        setPermissionStatus('denied')
        break
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable'
        break
      case err.TIMEOUT:
        errorMessage = 'Location request timed out'
        break
      default:
        errorMessage = err.message
    }

    setError(errorMessage)
    setIsTracking(false)
  }, [])

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
      setIsTracking(false)
    }
  }, [])

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state)
      })
    }

    // BUG FIX: clear any existing watcher before starting a new one
    // to prevent multiple watchers accumulating on re-renders
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
    }

    const options = {
      enableHighAccuracy: highAccuracy,
      timeout: 30000,
      maximumAge: 5000,
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    )
  }, [highAccuracy, handleSuccess, handleError])

  const syncNow = useCallback(() => {
    if (location) {
      syncToDatabase(location)
    }
  }, [location, syncToDatabase])

  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          })
        },
        (err) => reject(err),
        { enableHighAccuracy: highAccuracy, timeout: 10000, maximumAge: 0 }
      )
    })
  }, [highAccuracy])

  useEffect(() => {
    if (enableTracking) {
      startTracking()
    } else {
      stopTracking()
    }

    return () => {
      stopTracking()
    }
    // BUG FIX: removed startTracking/stopTracking from deps — they are stable
    // callbacks but their inclusion caused double-start on mount in StrictMode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableTracking])

  return {
    location,
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
    accuracy: location?.accuracy ?? null,
    altitude: location?.altitude ?? null,
    heading: location?.heading ?? null,
    speed: location?.speed ?? null,
    timestamp: location?.timestamp ?? null,
    isTracking,
    error,
    permissionStatus,
    startTracking,
    stopTracking,
    syncNow,
    getCurrentPosition,
  }
}

export default useLocationTracking
