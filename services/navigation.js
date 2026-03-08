/**
 * OpenRouteService Navigation API
 * 
 * This module provides reusable functions for route calculation,
 * turn-by-turn directions, and navigation features using OpenRouteService.
 * 
 * @module services/navigation
 */

// Validate OpenRouteService API key
const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY

if (!ORS_API_KEY) {
  console.warn('OpenRouteService API key is missing. Navigation features will not work.')
}

const ORS_BASE_URL = 'https://api.openrouteservice.org'

/**
 * Available travel profiles
 */
export const TRAVEL_PROFILES = {
  WALKING: 'foot-walking',
  WHEELCHAIR: 'wheelchair',
  DRIVING: 'driving-car',
  CYCLING: 'cycling-regular',
}

/**
 * Route preferences
 */
export const ROUTE_PREFERENCES = {
  FASTEST: 'fastest',
  SHORTEST: 'shortest',
  RECOMMENDED: 'recommended',
}

/**
 * Get directions between two points
 * 
 * @param {Object} params - Route parameters
 * @param {Array} params.start - Start coordinates [lng, lat]
 * @param {Array} params.end - End coordinates [lng, lat]
 * @param {string} params.profile - Travel profile (default: foot-walking)
 * @param {string} params.preference - Route preference (default: recommended)
 * @param {Array} params.waypoints - Optional waypoints [[lng, lat], ...]
 * @returns {Promise<Object>} Route data with geometry, distance, duration, and instructions
 * 
 * @example
 * const route = await getDirections({
 *   start: [-73.9855, 40.7580],
 *   end: [-73.9765, 40.7614],
 *   profile: TRAVEL_PROFILES.WALKING
 * })
 */
export const getDirections = async ({
  start,
  end,
  profile = TRAVEL_PROFILES.WALKING,
  preference = ROUTE_PREFERENCES.RECOMMENDED,
  waypoints = [],
}) => {
  if (!ORS_API_KEY) {
    throw new Error('OpenRouteService API key is not configured')
  }

  if (!start || !end) {
    throw new Error('Start and end coordinates are required')
  }

  try {
    // Build coordinates array: start, waypoints, end
    const coordinates = [start, ...waypoints, end]

    const response = await fetch(
      `${ORS_BASE_URL}/v2/directions/${profile}/geojson`,
      {
        method: 'POST',
        headers: {
          'Authorization': ORS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates,
          preference,
          instructions: true,
          elevation: false,
          extra_info: ['waytype', 'surface'],
          geometry_simplify: false,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      const errorMessage = error.error?.message || error.message || 'Failed to get directions'
      
      // Handle route distance limit errors gracefully
      if (errorMessage.includes('route distance must not be greater than')) {
        console.warn('Route distance exceeds API limits:', errorMessage)
        return {
          success: false,
          error: 'Route distance too long. Please select closer destinations.',
          errorCode: 'ROUTE_TOO_LONG',
        }
      }
      
      console.error('OpenRouteService API error:', errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }

    const data = await response.json()
    
    // Validate response structure
    if (!data.features || !data.features[0]) {
      return {
        success: false,
        error: 'No route found',
      }
    }
    
    const route = data.features[0]
    const summary = route.properties.summary

    return {
      success: true,
      geometry: route.geometry.coordinates, // Array of [lng, lat]
      distance: summary.distance, // meters
      duration: summary.duration, // seconds
      instructions: route.properties.segments[0].steps.map((step) => ({
        instruction: step.instruction,
        distance: step.distance,
        duration: step.duration,
        type: step.type,
        name: step.name,
      })),
      bbox: data.bbox, // Bounding box
      raw: data, // Full response for advanced use
    }
  } catch (error) {
    console.error('OpenRouteService directions error:', error)
    return {
      success: false,
      error: error.message || 'Failed to get directions',
    }
  }
}

/**
 * Get isochrones (reachable areas within time/distance)
 * 
 * @param {Object} params - Isochrone parameters
 * @param {Array} params.location - Center point [lng, lat]
 * @param {Array} params.range - Time ranges in seconds (e.g., [300, 600, 900])
 * @param {string} params.profile - Travel profile
 * @returns {Promise<Object>} Isochrone polygons
 * 
 * @example
 * const isochrones = await getIsochrones({
 *   location: [-73.9855, 40.7580],
 *   range: [300, 600, 900], // 5, 10, 15 minutes
 *   profile: TRAVEL_PROFILES.WALKING
 * })
 */
export const getIsochrones = async ({
  location,
  range = [300, 600, 900],
  profile = TRAVEL_PROFILES.WALKING,
}) => {
  if (!ORS_API_KEY) {
    throw new Error('OpenRouteService API key is not configured')
  }

  if (!location) {
    throw new Error('Location is required')
  }

  try {
    const response = await fetch(
      `${ORS_BASE_URL}/v2/isochrones/${profile}`,
      {
        method: 'POST',
        headers: {
          'Authorization': ORS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locations: [location],
          range,
          range_type: 'time', // or 'distance'
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to get isochrones')
    }

    const data = await response.json()

    return {
      success: true,
      polygons: data.features.map((feature) => ({
        value: feature.properties.value,
        center: feature.properties.center,
        geometry: feature.geometry.coordinates,
      })),
      raw: data,
    }
  } catch (error) {
    console.error('OpenRouteService isochrones error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Geocode address to coordinates
 * 
 * @param {string} address - Address to geocode
 * @returns {Promise<Object>} Geocoding results
 * 
 * @example
 * const result = await geocodeAddress('Times Square, New York')
 */
export const geocodeAddress = async (address) => {
  if (!ORS_API_KEY) {
    throw new Error('OpenRouteService API key is not configured')
  }

  if (!address) {
    throw new Error('Address is required')
  }

  try {
    const response = await fetch(
      `${ORS_BASE_URL}/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(address)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to geocode address')
    }

    const data = await response.json()

    if (!data.features || data.features.length === 0) {
      return {
        success: false,
        error: 'No results found',
      }
    }

    return {
      success: true,
      results: data.features.map((feature) => ({
        coordinates: feature.geometry.coordinates, // [lng, lat]
        label: feature.properties.label,
        name: feature.properties.name,
        country: feature.properties.country,
        region: feature.properties.region,
        locality: feature.properties.locality,
        confidence: feature.properties.confidence,
      })),
      raw: data,
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Reverse geocode coordinates to address
 * 
 * @param {Array} coordinates - Coordinates [lng, lat]
 * @returns {Promise<Object>} Reverse geocoding results
 * 
 * @example
 * const result = await reverseGeocode([-73.9855, 40.7580])
 */
export const reverseGeocode = async (coordinates) => {
  if (!ORS_API_KEY) {
    throw new Error('OpenRouteService API key is not configured')
  }

  if (!coordinates || coordinates.length !== 2) {
    throw new Error('Valid coordinates [lng, lat] are required')
  }

  try {
    const [lng, lat] = coordinates
    const response = await fetch(
      `${ORS_BASE_URL}/geocode/reverse?api_key=${ORS_API_KEY}&point.lon=${lng}&point.lat=${lat}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to reverse geocode')
    }

    const data = await response.json()

    if (!data.features || data.features.length === 0) {
      return {
        success: false,
        error: 'No results found',
      }
    }

    const feature = data.features[0]

    return {
      success: true,
      address: {
        label: feature.properties.label,
        name: feature.properties.name,
        street: feature.properties.street,
        housenumber: feature.properties.housenumber,
        locality: feature.properties.locality,
        region: feature.properties.region,
        country: feature.properties.country,
        postalcode: feature.properties.postalcode,
      },
      raw: data,
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Calculate distance matrix between multiple points
 * 
 * @param {Object} params - Matrix parameters
 * @param {Array} params.locations - Array of coordinates [[lng, lat], ...]
 * @param {string} params.profile - Travel profile
 * @returns {Promise<Object>} Distance and duration matrix
 * 
 * @example
 * const matrix = await getDistanceMatrix({
 *   locations: [[-73.9855, 40.7580], [-73.9765, 40.7614]],
 *   profile: TRAVEL_PROFILES.WALKING
 * })
 */
export const getDistanceMatrix = async ({
  locations,
  profile = TRAVEL_PROFILES.WALKING,
}) => {
  if (!ORS_API_KEY) {
    throw new Error('OpenRouteService API key is not configured')
  }

  if (!locations || locations.length < 2) {
    throw new Error('At least 2 locations are required')
  }

  try {
    const response = await fetch(
      `${ORS_BASE_URL}/v2/matrix/${profile}`,
      {
        method: 'POST',
        headers: {
          'Authorization': ORS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locations,
          metrics: ['distance', 'duration'],
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to get distance matrix')
    }

    const data = await response.json()

    return {
      success: true,
      distances: data.distances, // 2D array of distances in meters
      durations: data.durations, // 2D array of durations in seconds
      raw: data,
    }
  } catch (error) {
    console.error('Distance matrix error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Format duration to human-readable string
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 * 
 * @example
 * formatDuration(3665) // "1h 1m"
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Format distance to human-readable string
 * 
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance
 * 
 * @example
 * formatDistance(1500) // "1.5 km"
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

/**
 * Navigation instruction types
 */
export const INSTRUCTION_TYPES = {
  LEFT: 'left',
  RIGHT: 'right',
  STRAIGHT: 'straight',
  SLIGHT_LEFT: 'slight left',
  SLIGHT_RIGHT: 'slight right',
  SHARP_LEFT: 'sharp left',
  SHARP_RIGHT: 'sharp right',
  U_TURN: 'u-turn',
  ARRIVE: 'arrive',
  DEPART: 'depart',
}

export default {
  TRAVEL_PROFILES,
  ROUTE_PREFERENCES,
  INSTRUCTION_TYPES,
  getDirections,
  getIsochrones,
  geocodeAddress,
  reverseGeocode,
  getDistanceMatrix,
  formatDuration,
  formatDistance,
}
