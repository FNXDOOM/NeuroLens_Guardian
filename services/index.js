/**
 * Services Index
 * 
 * Central export point for all service modules.
 * Import services from this file for consistency.
 * 
 * @example
 * import { supabase, auth, db } from '@/services'
 * import { initializeMap, markers } from '@/services'
 * import { getDirections, TRAVEL_PROFILES } from '@/services'
 */

// Supabase exports
export {
  supabase,
  auth,
  db,
  realtime,
  storage,
} from './supabase'

// Maps exports
export {
  MAP_STYLES,
  DEFAULT_MAP_CONFIG,
  initializeMap,
  markers,
  routes,
  safeZones,
  getStaticMapUrl,
} from './maps'

// Navigation exports
export {
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
} from './navigation'

// AI exports
export {
  getNavigationGuidance,
  analyzeDistress,
  generateResponse,
  simplifyInstructions,
} from './ai'

// Default exports
export { default as supabaseClient } from './supabase'
export { default as mapsService } from './maps'
export { default as navigationService } from './navigation'
export { default as aiService } from './ai'
