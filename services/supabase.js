/**
 * Supabase Client Configuration
 * 
 * This module initializes and exports the Supabase client for database operations,
 * authentication, and real-time subscriptions.
 * 
 * @module services/supabase
 */

import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

/**
 * Supabase client instance
 * Configured with real-time enabled for live updates
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

/**
 * Authentication helpers
 */
export const auth = {
  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user, session, error}>}
   */
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { user: data?.user, session: data?.session, error }
  },

  /**
   * Sign up with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} metadata - Additional user metadata
   * @returns {Promise<{user, session, error}>}
   */
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { user: data?.user, session: data?.session, error }
  },

  /**
   * Sign out current user
   * @returns {Promise<{error}>}
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  /**
   * Get current user session
   * @returns {Promise<{session, error}>}
   */
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    return { session: data?.session, error }
  },

  /**
   * Get current user
   * @returns {Promise<{user, error}>}
   */
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    return { user: data?.user, error }
  },

  /**
   * Listen to auth state changes
   * @param {Function} callback - Callback function for auth state changes
   * @returns {Object} Subscription object with unsubscribe method
   */
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

/**
 * Database helpers
 */
export const db = {
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<{data, error}>}
   */
  getUserProfile: async (userId) => {
    return await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<{data, error}>}
   */
  updateUserProfile: async (userId, updates) => {
    return await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
  },

  /**
   * Get Safe Zones within radius
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} radius - Radius in meters (default: 5000)
   * @returns {Promise<{data, error}>}
   */
  getSafeZones: async (lat, lng, radius = 5000) => {
    // Note: This requires PostGIS extension and proper spatial queries
    // For now, returning all safe zones (to be optimized with spatial queries)
    return await supabase
      .from('safe_zones')
      .select('*')
      .eq('status', 'open')
      .order('name')
  },

  /**
   * Get user's active journey
   * @param {string} userId - User ID
   * @returns {Promise<{data, error}>}
   */
  getActiveJourney: async (userId) => {
    return await supabase
      .from('journeys')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()
  },

  /**
   * Create new journey
   * @param {Object} journeyData - Journey data
   * @returns {Promise<{data, error}>}
   */
  createJourney: async (journeyData) => {
    return await supabase
      .from('journeys')
      .insert(journeyData)
      .select()
      .single()
  },

  /**
   * Update journey
   * @param {string} journeyId - Journey ID
   * @param {Object} updates - Journey updates
   * @returns {Promise<{data, error}>}
   */
  updateJourney: async (journeyId, updates) => {
    return await supabase
      .from('journeys')
      .update(updates)
      .eq('id', journeyId)
      .select()
      .single()
  },

  /**
   * Get alerts for user
   * @param {string} userId - User ID
   * @param {boolean} unresolvedOnly - Get only unresolved alerts
   * @returns {Promise<{data, error}>}
   */
  getAlerts: async (userId, unresolvedOnly = true) => {
    let query = supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })

    if (unresolvedOnly) {
      query = query.eq('resolved', false)
    }

    return await query
  },

  /**
   * Create alert
   * @param {Object} alertData - Alert data
   * @returns {Promise<{data, error}>}
   */
  createAlert: async (alertData) => {
    return await supabase
      .from('alerts')
      .insert(alertData)
      .select()
      .single()
  },
}

/**
 * Real-time subscriptions
 */
export const realtime = {
  /**
   * Subscribe to user location updates
   * @param {string} userId - User ID
   * @param {Function} callback - Callback for location updates
   * @returns {Object} Subscription object
   */
  subscribeToUserLocation: (userId, callback) => {
    return supabase
      .channel(`user-location:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },

  /**
   * Subscribe to alerts
   * @param {string} userId - User ID
   * @param {Function} callback - Callback for new alerts
   * @returns {Object} Subscription object
   */
  subscribeToAlerts: (userId, callback) => {
    return supabase
      .channel(`alerts:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe()
  },

  /**
   * Subscribe to journey updates
   * @param {string} journeyId - Journey ID
   * @param {Function} callback - Callback for journey updates
   * @returns {Object} Subscription object
   */
  subscribeToJourney: (journeyId, callback) => {
    return supabase
      .channel(`journey:${journeyId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'journeys',
          filter: `id=eq.${journeyId}`,
        },
        callback
      )
      .subscribe()
  },

  /**
   * Unsubscribe from channel
   * @param {Object} subscription - Subscription object
   */
  unsubscribe: (subscription) => {
    if (subscription) {
      supabase.removeChannel(subscription)
    }
  },
}

/**
 * Storage helpers (for future use with profile images, etc.)
 */
export const storage = {
  /**
   * Upload file to storage
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path
   * @param {File} file - File to upload
   * @returns {Promise<{data, error}>}
   */
  uploadFile: async (bucket, path, file) => {
    return await supabase.storage.from(bucket).upload(path, file)
  },

  /**
   * Get public URL for file
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path
   * @returns {string} Public URL
   */
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },
}

export default supabase
