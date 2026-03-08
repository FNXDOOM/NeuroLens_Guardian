/**
 * Public Transport Service
 * 
 * Manages public transport assistance for bus-based journeys.
 * Integrates with navigation, distress engine, and guardian monitoring.
 * 
 * @module services/publicTransport
 */

/**
 * Transit journey states
 */
export const TRANSIT_STATES = {
  INACTIVE: 'inactive',
  WALKING_TO_STOP: 'walking_to_stop',
  WAITING_FOR_BUS: 'waiting_for_bus',
  BUS_IDENTIFIED: 'bus_identified',
  BOARDING: 'boarding',
  IN_TRANSIT: 'in_transit',
  PREPARE_TO_EXIT: 'prepare_to_exit',
  MISSED_STOP_WARNING: 'missed_stop_warning',
  TRANSIT_DISTRESS: 'transit_distress',
  SAFE_RIDE_FALLBACK: 'safe_ride_fallback',
  COMPLETED: 'completed',
}

/**
 * Transit distress reasons
 */
export const TRANSIT_DISTRESS_REASONS = {
  WRONG_STOP: 'wrong_stop',
  ROUTE_MISMATCH: 'route_mismatch',
  WAITING_TOO_LONG: 'waiting_too_long',
  MISSED_STOP: 'missed_stop',
  CONFUSION_DURING_TRANSIT: 'confusion_during_transit',
  MANUAL_HELP_REQUEST: 'manual_help_request',
  BUS_NOT_ARRIVING: 'bus_not_arriving',
}

/**
 * Sample bus routes (BMTC-style for demo)
 */
export const SAMPLE_BUS_ROUTES = [
  {
    id: 'route_1',
    number: '335E',
    name: 'Kempegowda Bus Station to Whitefield',
    stops: [
      { id: 'stop_1', name: 'Kempegowda Bus Station', lat: 12.9776, lng: 77.5718 },
      { id: 'stop_2', name: 'Shivaji Nagar', lat: 12.9866, lng: 77.6006 },
      { id: 'stop_3', name: 'Indiranagar', lat: 12.9716, lng: 77.6412 },
      { id: 'stop_4', name: 'Marathahalli', lat: 12.9591, lng: 77.6974 },
      { id: 'stop_5', name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
    ],
  },
  {
    id: 'route_2',
    number: '500K',
    name: 'Yeshwanthpur to Electronic City',
    stops: [
      { id: 'stop_6', name: 'Yeshwanthpur', lat: 13.0280, lng: 77.5385 },
      { id: 'stop_7', name: 'Rajajinagar', lat: 12.9916, lng: 77.5546 },
      { id: 'stop_8', name: 'Majestic', lat: 12.9776, lng: 77.5718 },
      { id: 'stop_9', name: 'Jayanagar', lat: 12.9250, lng: 77.5838 },
      { id: 'stop_10', name: 'Electronic City', lat: 12.8456, lng: 77.6603 },
    ],
  },
  {
    id: 'route_3',
    number: '201',
    name: 'Hebbal to Banashankari',
    stops: [
      { id: 'stop_11', name: 'Hebbal', lat: 13.0358, lng: 77.5970 },
      { id: 'stop_12', name: 'Mekhri Circle', lat: 13.0096, lng: 77.5771 },
      { id: 'stop_13', name: 'City Market', lat: 12.9634, lng: 77.5855 },
      { id: 'stop_14', name: 'Banashankari', lat: 12.9250, lng: 77.5486 },
    ],
  },
]

/**
 * Find nearest bus stop
 */
export function findNearestBusStop(userLocation, maxDistance = 500) {
  if (!userLocation) return null

  let nearestStop = null
  let minDistance = Infinity

  SAMPLE_BUS_ROUTES.forEach(route => {
    route.stops.forEach(stop => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        stop.lat,
        stop.lng
      )

      if (distance < minDistance && distance <= maxDistance) {
        minDistance = distance
        nearestStop = {
          ...stop,
          distance,
          routes: [route.number],
        }
      }
    })
  })

  return nearestStop
}

/**
 * Find bus routes for a stop
 */
export function findRoutesForStop(stopId) {
  const routes = []

  SAMPLE_BUS_ROUTES.forEach(route => {
    const hasStop = route.stops.some(stop => stop.id === stopId)
    if (hasStop) {
      routes.push({
        id: route.id,
        number: route.number,
        name: route.name,
      })
    }
  })

  return routes
}

/**
 * Get next stop on route
 */
export function getNextStop(routeId, currentStopId) {
  const route = SAMPLE_BUS_ROUTES.find(r => r.id === routeId)
  if (!route) return null

  const currentIndex = route.stops.findIndex(s => s.id === currentStopId)
  if (currentIndex === -1 || currentIndex === route.stops.length - 1) {
    return null
  }

  return route.stops[currentIndex + 1]
}

/**
 * Check if user missed their stop
 */
export function checkMissedStop(routeId, currentStopId, targetStopId) {
  const route = SAMPLE_BUS_ROUTES.find(r => r.id === routeId)
  if (!route) return false

  const currentIndex = route.stops.findIndex(s => s.id === currentStopId)
  const targetIndex = route.stops.findIndex(s => s.id === targetStopId)

  // Missed if current stop is past target stop
  return currentIndex > targetIndex
}

/**
 * Calculate distance between two points (Haversine)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Get transit guidance message
 */
export function getTransitGuidanceMessage(state, context = {}) {
  const messages = {
    [TRANSIT_STATES.WALKING_TO_STOP]: `Your bus stop is ${Math.round(context.distanceToStop || 0)}m ahead.`,
    [TRANSIT_STATES.WAITING_FOR_BUS]: `Waiting for bus ${context.busNumber || ''}. Stay near the stop.`,
    [TRANSIT_STATES.BUS_IDENTIFIED]: `The correct bus has arrived. Please prepare to board.`,
    [TRANSIT_STATES.BOARDING]: `Boarding bus ${context.busNumber || ''}. Take your time.`,
    [TRANSIT_STATES.IN_TRANSIT]: `You are now in transit. ${context.stopsRemaining || 0} stops remaining.`,
    [TRANSIT_STATES.PREPARE_TO_EXIT]: `Your stop is next. Prepare to get down.`,
    [TRANSIT_STATES.MISSED_STOP_WARNING]: `You may have missed your stop. I can help you.`,
    [TRANSIT_STATES.TRANSIT_DISTRESS]: `I am here to help. Notifying your guardian.`,
    [TRANSIT_STATES.SAFE_RIDE_FALLBACK]: `Safe Ride is on the way. Stay where you are.`,
  }

  return messages[state] || 'Continue with your journey.'
}

/**
 * Determine if transit distress should be triggered
 */
export function evaluateTransitDistress(context) {
  const {
    state,
    waitingTime = 0,
    missedStop = false,
    wrongStop = false,
    manualHelpRequest = false,
  } = context

  // Manual help request - highest priority
  if (manualHelpRequest) {
    return {
      isDistress: true,
      reason: TRANSIT_DISTRESS_REASONS.MANUAL_HELP_REQUEST,
      urgency: 'high',
      recommendGuardian: true,
      recommendSafeRide: true,
    }
  }

  // Missed stop
  if (missedStop) {
    return {
      isDistress: true,
      reason: TRANSIT_DISTRESS_REASONS.MISSED_STOP,
      urgency: 'high',
      recommendGuardian: true,
      recommendSafeRide: true,
    }
  }

  // Wrong stop
  if (wrongStop) {
    return {
      isDistress: true,
      reason: TRANSIT_DISTRESS_REASONS.WRONG_STOP,
      urgency: 'medium',
      recommendGuardian: true,
      recommendSafeRide: false,
    }
  }

  // Waiting too long (> 15 minutes)
  if (state === TRANSIT_STATES.WAITING_FOR_BUS && waitingTime > 900) {
    return {
      isDistress: true,
      reason: TRANSIT_DISTRESS_REASONS.WAITING_TOO_LONG,
      urgency: 'medium',
      recommendGuardian: true,
      recommendSafeRide: true,
    }
  }

  return {
    isDistress: false,
    reason: null,
    urgency: 'none',
    recommendGuardian: false,
    recommendSafeRide: false,
  }
}

/**
 * Get transit state label
 */
export function getTransitStateLabel(state) {
  const labels = {
    [TRANSIT_STATES.INACTIVE]: 'Not Active',
    [TRANSIT_STATES.WALKING_TO_STOP]: 'Walking to Stop',
    [TRANSIT_STATES.WAITING_FOR_BUS]: 'Waiting for Bus',
    [TRANSIT_STATES.BUS_IDENTIFIED]: 'Bus Identified',
    [TRANSIT_STATES.BOARDING]: 'Boarding',
    [TRANSIT_STATES.IN_TRANSIT]: 'In Transit',
    [TRANSIT_STATES.PREPARE_TO_EXIT]: 'Prepare to Exit',
    [TRANSIT_STATES.MISSED_STOP_WARNING]: 'Missed Stop',
    [TRANSIT_STATES.TRANSIT_DISTRESS]: 'Transit Distress',
    [TRANSIT_STATES.SAFE_RIDE_FALLBACK]: 'Safe Ride Fallback',
    [TRANSIT_STATES.COMPLETED]: 'Completed',
  }

  return labels[state] || state
}

/**
 * Get transit state color
 */
export function getTransitStateColor(state) {
  const colors = {
    [TRANSIT_STATES.INACTIVE]: 'gray',
    [TRANSIT_STATES.WALKING_TO_STOP]: 'blue',
    [TRANSIT_STATES.WAITING_FOR_BUS]: 'yellow',
    [TRANSIT_STATES.BUS_IDENTIFIED]: 'green',
    [TRANSIT_STATES.BOARDING]: 'blue',
    [TRANSIT_STATES.IN_TRANSIT]: 'green',
    [TRANSIT_STATES.PREPARE_TO_EXIT]: 'orange',
    [TRANSIT_STATES.MISSED_STOP_WARNING]: 'red',
    [TRANSIT_STATES.TRANSIT_DISTRESS]: 'red',
    [TRANSIT_STATES.SAFE_RIDE_FALLBACK]: 'purple',
    [TRANSIT_STATES.COMPLETED]: 'green',
  }

  return colors[state] || 'gray'
}

export default {
  TRANSIT_STATES,
  TRANSIT_DISTRESS_REASONS,
  SAMPLE_BUS_ROUTES,
  findNearestBusStop,
  findRoutesForStop,
  getNextStop,
  checkMissedStop,
  getTransitGuidanceMessage,
  evaluateTransitDistress,
  getTransitStateLabel,
  getTransitStateColor,
}
