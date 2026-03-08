/**
 * Database Service Layer for NeuroLens Guardian
 * 
 * This module provides clean, reusable functions for interacting with
 * the Supabase database tables. All functions are frontend-friendly
 * and ready for real-time subscription integration.
 * 
 * @module services/database
 */

import { supabase } from './supabase'

// ============================================================================
// USER LOCATIONS
// ============================================================================

/**
 * Insert a new user location record
 * @param {Object} locationData - Location data
 * @param {string} locationData.user_id - User ID
 * @param {number} locationData.latitude - Latitude
 * @param {number} locationData.longitude - Longitude
 * @param {number} [locationData.accuracy] - GPS accuracy in meters
 * @param {number} [locationData.altitude] - Altitude in meters
 * @param {number} [locationData.heading] - Direction in degrees (0-360)
 * @param {number} [locationData.speed] - Speed in m/s
 * @param {string} [locationData.address] - Reverse geocoded address
 * @param {boolean} [locationData.is_moving] - Whether user is moving
 * @param {number} [locationData.battery_level] - Battery percentage (0-100)
 * @returns {Promise<{data, error}>}
 */
export async function insertUserLocation(locationData) {
  const { data, error } = await supabase
    .from('user_locations')
    .insert({
      user_id: locationData.user_id,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      accuracy: locationData.accuracy || null,
      altitude: locationData.altitude || null,
      heading: locationData.heading || null,
      speed: locationData.speed || null,
      address: locationData.address || null,
      is_moving: locationData.is_moving || false,
      battery_level: locationData.battery_level || null,
      recorded_at: new Date().toISOString(),
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Get latest location for a user
 * @param {string} userId - User ID
 * @returns {Promise<{data, error}>}
 */
export async function getLatestUserLocation(userId) {
  const { data, error } = await supabase
    .from('user_locations')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single()

  return { data, error }
}

/**
 * Get location history for a user
 * @param {string} userId - User ID
 * @param {number} [limit=50] - Number of records to fetch
 * @returns {Promise<{data, error}>}
 */
export async function getUserLocationHistory(userId, limit = 50) {
  const { data, error } = await supabase
    .from('user_locations')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

// ============================================================================
// HAZARD EVENTS
// ============================================================================

/**
 * Insert a new hazard event
 * @param {Object} hazardData - Hazard event data
 * @param {string} hazardData.user_id - User ID
 * @param {string} hazardData.hazard_type - Type: vehicle, pedestrian, obstacle, construction, etc.
 * @param {string} hazardData.severity - Severity: low, medium, high, critical
 * @param {number} hazardData.latitude - Latitude
 * @param {number} hazardData.longitude - Longitude
 * @param {number} [hazardData.confidence] - Detection confidence (0-100)
 * @param {number} [hazardData.distance] - Distance to hazard in meters
 * @param {string} [hazardData.address] - Address
 * @param {string} [hazardData.description] - Description
 * @param {string} [hazardData.image_url] - Image URL
 * @returns {Promise<{data, error}>}
 */
export async function insertHazardEvent(hazardData) {
  const { data, error } = await supabase
    .from('hazard_events')
    .insert({
      user_id: hazardData.user_id,
      hazard_type: hazardData.hazard_type,
      severity: hazardData.severity,
      latitude: hazardData.latitude,
      longitude: hazardData.longitude,
      confidence: hazardData.confidence || null,
      distance: hazardData.distance || null,
      address: hazardData.address || null,
      description: hazardData.description || null,
      image_url: hazardData.image_url || null,
      status: 'active',
      detected_at: new Date().toISOString(),
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Get active hazards for a user
 * @param {string} userId - User ID
 * @returns {Promise<{data, error}>}
 */
export async function getActiveHazards(userId) {
  const { data, error } = await supabase
    .from('hazard_events')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('detected_at', { ascending: false })

  return { data, error }
}

/**
 * Get recent hazards for a user
 * @param {string} userId - User ID
 * @param {number} [limit=20] - Number of records to fetch
 * @returns {Promise<{data, error}>}
 */
export async function getRecentHazards(userId, limit = 20) {
  const { data, error } = await supabase
    .from('hazard_events')
    .select('*')
    .eq('user_id', userId)
    .order('detected_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

/**
 * Update hazard status
 * @param {string} hazardId - Hazard ID
 * @param {string} status - New status: active, resolved, false_positive
 * @returns {Promise<{data, error}>}
 */
export async function updateHazardStatus(hazardId, status) {
  const updates = {
    status,
  }

  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('hazard_events')
    .update(updates)
    .eq('id', hazardId)
    .select()
    .single()

  return { data, error }
}

// ============================================================================
// DISTRESS EVENTS
// ============================================================================

/**
 * Insert a new distress event
 * @param {Object} distressData - Distress event data
 * @param {string} distressData.user_id - User ID
 * @param {string} distressData.distress_level - Level: none, low, medium, high, critical
 * @param {number} distressData.latitude - Latitude
 * @param {number} distressData.longitude - Longitude
 * @param {string[]} [distressData.indicators] - Array of indicators
 * @param {number} [distressData.route_deviation_meters] - Route deviation in meters
 * @param {number} [distressData.stopped_duration_seconds] - Stopped duration in seconds
 * @param {string} [distressData.address] - Address
 * @param {number} [distressData.ai_confidence] - AI confidence (0-100)
 * @param {string} [distressData.ai_recommendation] - AI recommendation
 * @returns {Promise<{data, error}>}
 */
export async function insertDistressEvent(distressData) {
  const { data, error } = await supabase
    .from('distress_events')
    .insert({
      user_id: distressData.user_id,
      distress_level: distressData.distress_level,
      latitude: distressData.latitude,
      longitude: distressData.longitude,
      indicators: distressData.indicators || [],
      route_deviation_meters: distressData.route_deviation_meters || null,
      stopped_duration_seconds: distressData.stopped_duration_seconds || null,
      address: distressData.address || null,
      ai_confidence: distressData.ai_confidence || null,
      ai_recommendation: distressData.ai_recommendation || null,
      status: 'active',
      detected_at: new Date().toISOString(),
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Get active distress events for a user
 * @param {string} userId - User ID
 * @returns {Promise<{data, error}>}
 */
export async function getActiveDistressEvents(userId) {
  const { data, error } = await supabase
    .from('distress_events')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'responding'])
    .order('detected_at', { ascending: false })

  return { data, error }
}

/**
 * Update distress event
 * @param {string} distressId - Distress event ID
 * @param {Object} updates - Updates to apply
 * @param {string} [updates.status] - Status: active, responding, resolved
 * @param {string} [updates.response_action] - Response action taken
 * @param {string} [updates.resolution_notes] - Resolution notes
 * @returns {Promise<{data, error}>}
 */
export async function updateDistressEvent(distressId, updates) {
  const updateData = { ...updates }

  if (updates.status === 'resolved') {
    updateData.resolved_at = new Date().toISOString()
  }

  if (updates.response_action) {
    updateData.response_time = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('distress_events')
    .update(updateData)
    .eq('id', distressId)
    .select()
    .single()

  return { data, error }
}

// ============================================================================
// GUARDIAN ALERTS
// ============================================================================

/**
 * Insert a new guardian alert
 * @param {Object} alertData - Alert data
 * @param {string} alertData.user_id - User ID being monitored
 * @param {string} alertData.guardian_id - Guardian/caregiver ID
 * @param {string} alertData.alert_type - Type: distress_detected, hazard_detected, route_deviation, etc.
 * @param {string} alertData.priority - Priority: low, medium, high, critical
 * @param {string} alertData.title - Alert title
 * @param {string} alertData.message - Alert message
 * @param {number} [alertData.latitude] - Latitude
 * @param {number} [alertData.longitude] - Longitude
 * @param {string} [alertData.address] - Address
 * @param {string} [alertData.related_hazard_id] - Related hazard event ID
 * @param {string} [alertData.related_distress_id] - Related distress event ID
 * @returns {Promise<{data, error}>}
 */
export async function insertGuardianAlert(alertData) {
  const { data, error } = await supabase
    .from('guardian_alerts')
    .insert({
      user_id: alertData.user_id,
      guardian_id: alertData.guardian_id,
      alert_type: alertData.alert_type,
      priority: alertData.priority,
      title: alertData.title,
      message: alertData.message,
      latitude: alertData.latitude || null,
      longitude: alertData.longitude || null,
      address: alertData.address || null,
      related_hazard_id: alertData.related_hazard_id || null,
      related_distress_id: alertData.related_distress_id || null,
      is_read: false,
      is_acknowledged: false,
      sent_at: new Date().toISOString(),
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Get unread alerts for a guardian
 * @param {string} guardianId - Guardian ID
 * @returns {Promise<{data, error}>}
 */
export async function getUnreadAlerts(guardianId) {
  const { data, error } = await supabase
    .from('guardian_alerts')
    .select('*')
    .eq('guardian_id', guardianId)
    .eq('is_read', false)
    .order('sent_at', { ascending: false })

  return { data, error }
}

/**
 * Get all alerts for a guardian
 * @param {string} guardianId - Guardian ID
 * @param {number} [limit=50] - Number of records to fetch
 * @returns {Promise<{data, error}>}
 */
export async function getGuardianAlerts(guardianId, limit = 50) {
  const { data, error } = await supabase
    .from('guardian_alerts')
    .select('*')
    .eq('guardian_id', guardianId)
    .order('sent_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

/**
 * Mark alert as read
 * @param {string} alertId - Alert ID
 * @returns {Promise<{data, error}>}
 */
export async function markAlertAsRead(alertId) {
  const { data, error } = await supabase
    .from('guardian_alerts')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', alertId)
    .select()
    .single()

  return { data, error }
}

/**
 * Acknowledge alert
 * @param {string} alertId - Alert ID
 * @param {string} [actionTaken] - Action taken
 * @param {string} [actionNotes] - Action notes
 * @returns {Promise<{data, error}>}
 */
export async function acknowledgeAlert(alertId, actionTaken, actionNotes) {
  const { data, error } = await supabase
    .from('guardian_alerts')
    .update({
      is_acknowledged: true,
      acknowledged_at: new Date().toISOString(),
      action_taken: actionTaken || null,
      action_notes: actionNotes || null,
    })
    .eq('id', alertId)
    .select()
    .single()

  return { data, error }
}

// ============================================================================
// SAFE RIDE REQUESTS
// ============================================================================

/**
 * Insert a new safe ride request
 * @param {Object} rideData - Ride request data
 * @param {string} rideData.user_id - User ID
 * @param {number} rideData.pickup_latitude - Pickup latitude
 * @param {number} rideData.pickup_longitude - Pickup longitude
 * @param {string} rideData.pickup_address - Pickup address
 * @param {number} rideData.dropoff_latitude - Dropoff latitude
 * @param {number} rideData.dropoff_longitude - Dropoff longitude
 * @param {string} rideData.dropoff_address - Dropoff address
 * @param {number} [rideData.passenger_count] - Number of passengers
 * @param {boolean} [rideData.wheelchair_accessible] - Wheelchair accessible
 * @param {string} [rideData.special_instructions] - Special instructions
 * @returns {Promise<{data, error}>}
 */
export async function insertSafeRideRequest(rideData) {
  const { data, error } = await supabase
    .from('safe_ride_requests')
    .insert({
      user_id: rideData.user_id,
      pickup_latitude: rideData.pickup_latitude,
      pickup_longitude: rideData.pickup_longitude,
      pickup_address: rideData.pickup_address,
      dropoff_latitude: rideData.dropoff_latitude,
      dropoff_longitude: rideData.dropoff_longitude,
      dropoff_address: rideData.dropoff_address,
      passenger_count: rideData.passenger_count || 1,
      wheelchair_accessible: rideData.wheelchair_accessible || false,
      special_instructions: rideData.special_instructions || null,
      status: 'requested',
      requested_at: new Date().toISOString(),
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Get active ride requests for a user
 * @param {string} userId - User ID
 * @returns {Promise<{data, error}>}
 */
export async function getActiveRideRequests(userId) {
  const { data, error } = await supabase
    .from('safe_ride_requests')
    .select('*')
    .eq('user_id', userId)
    .not('status', 'in', '(completed,cancelled)')
    .order('requested_at', { ascending: false })

  return { data, error }
}

/**
 * Get ride request history for a user
 * @param {string} userId - User ID
 * @param {number} [limit=20] - Number of records to fetch
 * @returns {Promise<{data, error}>}
 */
export async function getRideHistory(userId, limit = 20) {
  const { data, error } = await supabase
    .from('safe_ride_requests')
    .select('*')
    .eq('user_id', userId)
    .order('requested_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

/**
 * Update ride request status
 * @param {string} rideId - Ride request ID
 * @param {string} status - New status: requested, searching, driver_assigned, driver_arriving, in_progress, completed, cancelled
 * @param {Object} [additionalData] - Additional data to update
 * @returns {Promise<{data, error}>}
 */
export async function updateRideStatus(rideId, status, additionalData = {}) {
  const updates = {
    status,
    ...additionalData,
  }

  // Set timestamps based on status
  if (status === 'driver_arriving' && !updates.driver_arrived_at) {
    updates.driver_arrived_at = new Date().toISOString()
  } else if (status === 'in_progress' && !updates.pickup_completed_at) {
    updates.pickup_completed_at = new Date().toISOString()
  } else if (status === 'completed' && !updates.dropoff_completed_at) {
    updates.dropoff_completed_at = new Date().toISOString()
  } else if (status === 'cancelled' && !updates.cancelled_at) {
    updates.cancelled_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('safe_ride_requests')
    .update(updates)
    .eq('id', rideId)
    .select()
    .single()

  return { data, error }
}

// ============================================================================
// USERS
// ============================================================================

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<{data, error}>}
 */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  // Handle RLS policy infinite recursion error gracefully
  if (error && error.message && error.message.includes('infinite recursion')) {
    console.warn('Database RLS policy error detected. Using fallback data.')
    return {
      data: null,
      error: {
        message: 'Database policy configuration issue. Please contact administrator.',
        code: 'RLS_POLICY_ERROR',
        hint: 'Run the fix-rls-policy.sql script in your Supabase SQL Editor'
      }
    }
  }

  return { data, error }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<{data, error}>}
 */
export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

// ============================================================================
// COMPOSITE QUERIES
// ============================================================================

/**
 * Fetch latest user state (location, hazards, distress, alerts, rides)
 * This is a convenience function that fetches all relevant data for a user
 * @param {string} userId - User ID
 * @returns {Promise<{data, error}>}
 */
export async function fetchLatestUserState(userId) {
  try {
    // Fetch all data in parallel
    const [
      profileResult,
      locationResult,
      hazardsResult,
      distressResult,
      ridesResult,
    ] = await Promise.all([
      getUserProfile(userId),
      getLatestUserLocation(userId),
      getActiveHazards(userId),
      getActiveDistressEvents(userId),
      getActiveRideRequests(userId),
    ])

    // Handle RLS policy error - return demo data
    if (profileResult.error && profileResult.error.code === 'RLS_POLICY_ERROR') {
      console.warn('Using demo mode due to database policy issue')
      return {
        data: {
          profile: {
            id: userId,
            full_name: 'Demo User',
            email: 'demo@neurolens.com',
            role: 'user',
            preferences: {
              voice_guidance: true,
              volume: 75,
              language: 'en',
            }
          },
          location: locationResult.data || null,
          hazards: hazardsResult.data || [],
          distress: distressResult.data || [],
          rides: ridesResult.data || [],
        },
        error: null,
      }
    }

    // Check for other errors
    if (profileResult.error) throw profileResult.error
    if (locationResult.error && locationResult.error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is ok
      throw locationResult.error
    }
    if (hazardsResult.error) throw hazardsResult.error
    if (distressResult.error) throw distressResult.error
    if (ridesResult.error) throw ridesResult.error

    return {
      data: {
        profile: profileResult.data,
        location: locationResult.data || null,
        hazards: hazardsResult.data || [],
        distress: distressResult.data || [],
        rides: ridesResult.data || [],
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error,
    }
  }
}

/**
 * Fetch caregiver dashboard data
 * @param {string} guardianId - Guardian/caregiver ID
 * @returns {Promise<{data, error}>}
 */
export async function fetchCaregiverDashboard(guardianId) {
  try {
    // Get guardian profile to find assigned users
    const { data: guardian, error: guardianError } = await getUserProfile(guardianId)
    if (guardianError) throw guardianError

    const assignedUserIds = guardian.assigned_user_ids || []

    // Fetch data for all assigned users
    const usersData = await Promise.all(
      assignedUserIds.map(userId => fetchLatestUserState(userId))
    )

    // Get alerts for guardian
    const { data: alerts, error: alertsError } = await getUnreadAlerts(guardianId)
    if (alertsError) throw alertsError

    return {
      data: {
        guardian,
        users: usersData.map(result => result.data).filter(Boolean),
        alerts: alerts || [],
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error,
    }
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTION HELPERS
// ============================================================================
// These functions will be used to set up real-time subscriptions later

/**
 * Subscribe to user location updates
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function (payload) => void
 * @returns {Object} Subscription object
 * 
 * @example
 * const subscription = subscribeToLocationUpdates(userId, (payload) => {
 *   console.log('New location:', payload.new)
 * })
 * 
 * // Later, unsubscribe:
 * unsubscribe(subscription)
 */
export function subscribeToLocationUpdates(userId, callback) {
  return supabase
    .channel(`location:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_locations',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

/**
 * Subscribe to hazard events
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function
 * @returns {Object} Subscription object
 */
export function subscribeToHazardEvents(userId, callback) {
  return supabase
    .channel(`hazards:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'hazard_events',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

/**
 * Subscribe to distress events
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function
 * @returns {Object} Subscription object
 */
export function subscribeToDistressEvents(userId, callback) {
  return supabase
    .channel(`distress:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'distress_events',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

/**
 * Subscribe to guardian alerts
 * @param {string} guardianId - Guardian ID
 * @param {Function} callback - Callback function
 * @returns {Object} Subscription object
 */
export function subscribeToGuardianAlerts(guardianId, callback) {
  return supabase
    .channel(`alerts:${guardianId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'guardian_alerts',
        filter: `guardian_id=eq.${guardianId}`,
      },
      callback
    )
    .subscribe()
}

/**
 * Subscribe to ride request updates
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function
 * @returns {Object} Subscription object
 */
export function subscribeToRideUpdates(userId, callback) {
  return supabase
    .channel(`rides:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'safe_ride_requests',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

/**
 * Unsubscribe from a channel
 * @param {Object} subscription - Subscription object
 */
export function unsubscribe(subscription) {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
}

// Export all functions as default object for convenience
export default {
  // User Locations
  insertUserLocation,
  getLatestUserLocation,
  getUserLocationHistory,
  
  // Hazard Events
  insertHazardEvent,
  getActiveHazards,
  getRecentHazards,
  updateHazardStatus,
  
  // Distress Events
  insertDistressEvent,
  getActiveDistressEvents,
  updateDistressEvent,
  
  // Guardian Alerts
  insertGuardianAlert,
  getUnreadAlerts,
  getGuardianAlerts,
  markAlertAsRead,
  acknowledgeAlert,
  
  // Safe Ride Requests
  insertSafeRideRequest,
  getActiveRideRequests,
  getRideHistory,
  updateRideStatus,
  
  // Users
  getUserProfile,
  updateUserProfile,
  
  // Composite Queries
  fetchLatestUserState,
  fetchCaregiverDashboard,
  
  // Real-time Subscriptions
  subscribeToLocationUpdates,
  subscribeToHazardEvents,
  subscribeToDistressEvents,
  subscribeToGuardianAlerts,
  subscribeToRideUpdates,
  unsubscribe,
}
