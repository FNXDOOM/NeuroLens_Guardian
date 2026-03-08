/**
 * useLocationTracking Hook
 * 
 * Provides real-time browser geolocation tracking with automatic
 * Supabase sync for user location data.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { insertUserLocation } from '@/services/database'

/**
 * Location tracking hook
 * @param {Object} options - Configuration options
 * @param {string} options.userId - User ID for database sync
 * @param {boolean} options.enableTracking - Enable/disable tracking
 * @param {boolean} options.enableSync - Enable/disable Supabase sync
 * @param {number} options.syncInterval - Sync interval in milliseconds (default: 30000 = 30s)
 * @param {number} options.highAccuracy - Use high accuracy GPS (default: true)
 * @returns {Object} Location data and tracking status
 */
export function useLocationTracking({
  userId = null,
  enableTracking = true,
  enableSync = true,
  syncInterval = 30000, // 30 seconds
  highAccuracy = true,
} = {}) {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState('prompt') // 'granted', 'denied', 'prompt'
  
  const watchIdRef = useRef(null)
  const lastSyncRef = useRef(null)
  const syncTimerRef = useRef(null)

  /**
   * Sync location to Supabase
   */
  const syncToDatabase = useCallback(async (locationData) => {
    if (!userId || !enableSync) return

    try {
      // Check if insertUserLocation function exists
      if (typeof insertUserLocation !== 'function') {
        console.warn('insertUserLocation function not available, skipping sync')
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
        is_moving: locationData.speed > 0.5, // Moving if speed > 0.5 m/s
      })

      if (syncError) {
        // Log error but don't throw - allow app to continue
        console.warn('Error syncing location to database:', syncError.message || syncError)
      } else {
        lastSyncRef.current = Date.now()
        console.log('Location synced to database')
      }
    } catch (err) {
      // Catch any errors and log them without breaking the app
      console.warn('Error syncing location:', err.message || err)
    }
  }, [userId, enableSync])

  /**
   * Handle successful geolocation
   */
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

    // Sync to database if interval has passed
    const now = Date.now()
    if (!lastSyncRef.current || now - lastSyncRef.current >= syncInterval) {
      syncToDatabase(locationData)
    }
  }, [syncInterval, syncToDatabase])

  /**
   * Handle geolocation error
   */
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
    console.error('Geolocation error:', errorMessage)
  }, [])

  /**
   * Start tracking
   */
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    // Check permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state)
      })
    }

    // Geolocation options
    const options = {
      enableHighAccuracy: highAccuracy,
      timeout: 30000, // Increased to 30 seconds
      maximumAge: 5000, // Allow cached position up to 5 seconds old
    }

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    )

    console.log('Location tracking started')
  }, [highAccuracy, handleSuccess, handleError])

  /**
   * Stop tracking
   */
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
      setIsTracking(false)
      console.log('Location tracking stopped')
    }

    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current)
      syncTimerRef.current = null
    }
  }, [])

  /**
   * Manually trigger location sync
   */
  const syncNow = useCallback(() => {
    if (location) {
      syncToDatabase(location)
    }
  }, [location, syncToDatabase])

  /**
   * Get current position once (not continuous tracking)
   */
  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          }
          resolve(locationData)
        },
        (err) => {
          reject(err)
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }, [highAccuracy])

  /**
   * Start/stop tracking based on enableTracking prop
   */
  useEffect(() => {
    if (enableTracking) {
      startTracking()
    } else {
      stopTracking()
    }

    return () => {
      stopTracking()
    }
  }, [enableTracking, startTracking, stopTracking])

  return {
    // Location data
    location,
    latitude: location?.latitude || null,
    longitude: location?.longitude || null,
    accuracy: location?.accuracy || null,
    altitude: location?.altitude || null,
    heading: location?.heading || null,
    speed: location?.speed || null,
    timestamp: location?.timestamp || null,
    
    // Status
    isTracking,
    error,
    permissionStatus,
    
    // Controls
    startTracking,
    stopTracking,
    syncNow,
    getCurrentPosition,
  }
}

export default useLocationTracking
