/**
 * useSimulationState Hook
 * 
 * Adapter layer that transforms live app state into simulation-friendly values.
 * Isolates the 3D simulation from raw app state complexity.
 * 
 * @module hooks/useSimulationState
 */

import { useMemo } from 'react'
import { DISTRESS_STATUS } from '@/hooks/useDistressEngine'
import { TRANSIT_STATES } from '@/services/publicTransport'

/**
 * Simulation modes
 */
export const SIMULATION_MODES = {
  NAVIGATION: 'navigation',
  HAZARD: 'hazard',
  DISTRESS: 'distress',
  EMERGENCY: 'emergency',
  TRANSIT: 'transit',
  SAFE_ZONE_ROUTING: 'safe_zone_routing',
}

/**
 * useSimulationState Hook
 * @param {Object} appState - Live application state
 * @returns {Object} Normalized simulation state
 */
export function useSimulationState(appState = {}) {
  const simulationState = useMemo(() => {
    // Extract app state
    const {
      // Distress engine
      distressStatus = DISTRESS_STATUS.SAFE,
      distressReason = null,
      distressLevel = 0,
      distressMessage = null,
      
      // Location & Navigation
      userLocation = null,
      destination = null,
      route = [],
      routeInfo = null,
      isNavigating = false,
      
      // Hazard detection
      latestHazard = null,
      recentDetections = [],
      
      // Safe Zones
      nearestSafeZone = null,
      nearbySafeZones = [],
      
      // Guardian & Emergency
      guardianNotified = false,
      isEmergency = false,
      manualSOS = false,
      
      // Safe Ride
      safeRideActive = false,
      safeRideStatus = null,
      
      // AI Guidance
      guidanceMessage = null,
      
      // Public Transport
      transitState = null,
      transitActive = false,
      
      // Demo mode
      demoMode = null,
      demoScenario = null,
    } = appState

    // Determine simulation mode
    const simulationMode = determineSimulationMode({
      distressStatus,
      transitState,
      transitActive,
      isEmergency,
      latestHazard,
      isNavigating,
    })

    // Build hazard markers
    const hazardMarkers = buildHazardMarkers({
      latestHazard,
      recentDetections,
      demoMode,
      demoScenario,
    })

    // Determine route arrow direction
    const routeArrowDirection = determineRouteDirection({
      route,
      userLocation,
      destination,
      isNavigating,
    })

    // Build Safe Zone marker
    const safeZoneMarker = buildSafeZoneMarker({
      nearestSafeZone,
      distressStatus,
      destination,
    })

    // Determine guardian state
    const guardianState = {
      notified: guardianNotified || isEmergency,
      tracking: guardianNotified || isEmergency,
      visible: guardianNotified || isEmergency || distressStatus === DISTRESS_STATUS.DISTRESS,
    }

    // Build HUD message
    const hudMessage = buildHUDMessage({
      guidanceMessage,
      distressMessage,
      distressStatus,
      simulationMode,
      latestHazard,
      nearestSafeZone,
      transitState,
    })

    // Determine emergency state
    const emergencyState = {
      active: isEmergency || distressStatus === DISTRESS_STATUS.EMERGENCY,
      manualSOS,
      guardianNotified: guardianNotified || isEmergency,
      safeRideActive,
      safeRideStatus,
    }

    // Determine movement recommendation
    const movementRecommendation = determineMovementRecommendation({
      latestHazard,
      routeArrowDirection,
      distressStatus,
    })

    // Build transit state
    const transitSimState = buildTransitState({
      transitState,
      transitActive,
    })

    return {
      // Core state
      simulationMode,
      distressLevel,
      distressStatus,
      
      // Visual elements
      hazardMarkers,
      routeArrowDirection,
      safeZoneMarker,
      
      // Status indicators
      guardianState,
      emergencyState,
      transitState: transitSimState,
      
      // HUD
      hudMessage,
      movementRecommendation,
      
      // Metadata
      isNavigating,
      hasHazards: hazardMarkers.length > 0,
      safeZoneDistance: nearestSafeZone?.distance || null,
      
      // Raw data (for advanced use)
      raw: {
        distressStatus,
        latestHazard,
        nearestSafeZone,
        userLocation,
        destination,
      },
    }
  }, [appState])

  return simulationState
}

/**
 * Determine simulation mode from app state
 */
function determineSimulationMode({
  distressStatus,
  transitState,
  transitActive,
  isEmergency,
  latestHazard,
  isNavigating,
}) {
  // Emergency takes highest priority
  if (isEmergency || distressStatus === DISTRESS_STATUS.EMERGENCY) {
    return SIMULATION_MODES.EMERGENCY
  }

  // Transit mode
  if (transitActive && transitState && transitState !== 'inactive') {
    return SIMULATION_MODES.TRANSIT
  }

  // Distress mode
  if (distressStatus === DISTRESS_STATUS.DISTRESS) {
    return SIMULATION_MODES.DISTRESS
  }

  // Safe Zone routing
  if (distressStatus === DISTRESS_STATUS.SAFE_ZONE_ROUTING) {
    return SIMULATION_MODES.SAFE_ZONE_ROUTING
  }

  // Hazard mode
  if (latestHazard && latestHazard.severity === 'danger') {
    return SIMULATION_MODES.HAZARD
  }

  // Navigation mode (default)
  if (isNavigating || distressStatus === DISTRESS_STATUS.NAVIGATING) {
    return SIMULATION_MODES.NAVIGATION
  }

  return SIMULATION_MODES.NAVIGATION
}

/**
 * Build hazard markers for 3D scene
 */
function buildHazardMarkers({ latestHazard, recentDetections, demoMode, demoScenario }) {
  const markers = []

  // Use demo scenario if active
  if (demoMode?.enabled && demoScenario) {
    return buildDemoHazards(demoScenario)
  }

  // Use latest hazard from AR detection
  if (latestHazard) {
    markers.push({
      id: 'latest',
      type: mapDetectionToType(latestHazard.category || latestHazard.class),
      class: latestHazard.class || 'unknown',
      severity: latestHazard.severity || 'warning',
      position: determineHazardPosition(latestHazard, 0),
      color: getSeverityColor(latestHazard.severity),
      label: latestHazard.class || 'Hazard',
      confidence: latestHazard.confidence || 0.8,
    })
  }

  // Add recent detections from AR (up to 5 more for better visualization)
  if (recentDetections && recentDetections.length > 0) {
    recentDetections.slice(0, 5).forEach((detection, index) => {
      // Skip if it's the same as latest hazard
      if (latestHazard && detection.class === latestHazard.class && index === 0) {
        return
      }
      
      markers.push({
        id: detection.id || `detection-${index}`,
        type: mapDetectionToType(detection.category || detection.class),
        class: detection.class || 'unknown',
        severity: detection.severity || 'warning',
        position: determineHazardPosition(detection, index + 1),
        color: getSeverityColor(detection.severity),
        label: detection.class || 'Object',
        confidence: detection.confidence || 0.7,
      })
    })
  }

  return markers
}

/**
 * Map AR detection class to 3D object type
 */
function mapDetectionToType(detectionClass) {
  const typeMap = {
    // Vehicles
    'car': 'vehicle',
    'truck': 'vehicle',
    'bus': 'vehicle',
    'motorcycle': 'vehicle',
    'bicycle': 'vehicle',
    
    // People
    'person': 'person',
    'pedestrian': 'person',
    
    // Obstacles
    'traffic light': 'obstacle',
    'stop sign': 'obstacle',
    'fire hydrant': 'obstacle',
    'bench': 'obstacle',
    'chair': 'obstacle',
    'potted plant': 'obstacle',
    'backpack': 'obstacle',
    'umbrella': 'obstacle',
    'handbag': 'obstacle',
    'suitcase': 'obstacle',
  }
  
  const normalized = detectionClass?.toLowerCase() || 'unknown'
  return typeMap[normalized] || 'obstacle'
}

/**
 * Build demo hazards based on scenario
 */
function buildDemoHazards(scenario) {
  const demoHazards = {
    vehicle: [
      { id: 'demo-vehicle', type: 'vehicle', class: 'car', severity: 'danger', position: [0, 0, -10], color: '#ef4444', label: 'Vehicle' }
    ],
    'obstacle-left': [
      { id: 'demo-ped-left', type: 'person', class: 'person', severity: 'caution', position: [-3, 0, -8], color: '#f59e0b', label: 'Pedestrian' }
    ],
    'obstacle-right': [
      { id: 'demo-ped-right', type: 'person', class: 'person', severity: 'caution', position: [3, 0, -8], color: '#f59e0b', label: 'Pedestrian' }
    ],
    crowded: [
      { id: 'demo-ped-1', type: 'person', class: 'person', severity: 'caution', position: [-2, 0, -8], color: '#f59e0b', label: 'Person' },
      { id: 'demo-ped-2', type: 'person', class: 'person', severity: 'caution', position: [2, 0, -10], color: '#f59e0b', label: 'Person' },
      { id: 'demo-vehicle', type: 'vehicle', class: 'car', severity: 'danger', position: [0, 0, -15], color: '#ef4444', label: 'Vehicle' },
      { id: 'demo-ped-3', type: 'person', class: 'person', severity: 'caution', position: [-1, 0, -12], color: '#f59e0b', label: 'Person' }
    ],
    clear: [],
    'safe-zone': [],
  }

  return demoHazards[scenario] || []
}

/**
 * Determine hazard position in 3D space
 * Positions objects based on detection type and index for realistic placement
 */
function determineHazardPosition(hazard, index) {
  const type = mapDetectionToType(hazard.category || hazard.class)
  
  // Base positions based on hazard type
  const basePositions = {
    vehicle: [0, 0, -10 - index * 3], // Center lane, staggered
    person: [
      // Alternate left/right sidewalk
      index % 2 === 0 ? -4 : 4, 
      0, 
      -8 - index * 2.5
    ],
    obstacle: [
      // Alternate sides, closer to sidewalk
      index % 2 === 0 ? -2.5 : 2.5, 
      0, 
      -6 - index * 2
    ],
  }

  return basePositions[type] || [
    // Default: alternate sides
    index % 2 === 0 ? -2 : 2, 
    0, 
    -8 - index * 2
  ]
}

/**
 * Get color based on severity
 */
function getSeverityColor(severity) {
  const colors = {
    danger: '#ef4444',
    caution: '#f59e0b',
    warning: '#eab308',
    safe: '#22c55e',
  }
  return colors[severity] || '#6b7280'
}

/**
 * Determine route arrow direction
 */
function determineRouteDirection({ route, userLocation, destination, isNavigating }) {
  if (!isNavigating || !route || route.length === 0) {
    return 'forward' // Default
  }

  // Simple direction logic (can be enhanced with actual route analysis)
  return 'forward'
}

/**
 * Build Safe Zone marker
 */
function buildSafeZoneMarker({ nearestSafeZone, distressStatus, destination }) {
  if (!nearestSafeZone) return null

  const isRouting = destination?.isSafeZone || distressStatus === DISTRESS_STATUS.SAFE_ZONE_ROUTING

  return {
    visible: true,
    name: nearestSafeZone.name,
    distance: nearestSafeZone.distance,
    position: [0, 0, -15], // Fixed position ahead
    isDestination: isRouting,
    color: isRouting ? '#8b5cf6' : '#3b82f6',
  }
}

/**
 * Build HUD message with AR detection context
 */
function buildHUDMessage({
  guidanceMessage,
  distressMessage,
  distressStatus,
  simulationMode,
  latestHazard,
  nearestSafeZone,
  transitState,
}) {
  // Priority order: distress message > guidance message > hazard-specific > default

  if (distressMessage) {
    return distressMessage
  }

  if (guidanceMessage) {
    return guidanceMessage
  }

  // Hazard-specific messages from AR detection
  if (latestHazard && simulationMode === SIMULATION_MODES.HAZARD) {
    const hazardMessages = {
      'car': '🚗 Vehicle detected ahead. Maintain safe distance.',
      'truck': '🚚 Large vehicle approaching. Stay alert.',
      'bus': '🚌 Bus detected. Watch for passengers.',
      'motorcycle': '🏍️ Motorcycle nearby. Be cautious.',
      'bicycle': '🚴 Cyclist ahead. Give space.',
      'person': '🚶 Pedestrian detected. Slow down.',
      'traffic light': '🚦 Traffic signal ahead. Prepare to stop.',
      'stop sign': '🛑 Stop sign detected. Come to complete stop.',
      'fire hydrant': '🚒 Fire hydrant on path. Navigate around.',
      'bench': '🪑 Bench obstacle detected. Move to the side.',
    }
    
    const message = hazardMessages[latestHazard.class?.toLowerCase()]
    if (message) return message
    
    return `⚠️ ${latestHazard.class} detected. Proceed with caution.`
  }

  // Fallback messages based on mode
  const fallbackMessages = {
    [SIMULATION_MODES.EMERGENCY]: '🚨 Emergency services contacted. Help is on the way.',
    [SIMULATION_MODES.DISTRESS]: '⚠️ Distress detected. Guardian has been notified.',
    [SIMULATION_MODES.HAZARD]: 'Hazard detection active. Stay alert.',
    [SIMULATION_MODES.SAFE_ZONE_ROUTING]: nearestSafeZone ? `Routing to ${nearestSafeZone.name}. ${Math.round(nearestSafeZone.distance)}m ahead.` : 'Routing to Safe Zone.',
    [SIMULATION_MODES.TRANSIT]: 'Public transport assist active.',
    [SIMULATION_MODES.NAVIGATION]: 'Continue forward. Path is clear.',
  }

  return fallbackMessages[simulationMode] || 'All systems operational.'
}

/**
 * Determine movement recommendation based on AR detections
 */
function determineMovementRecommendation({ latestHazard, routeArrowDirection, distressStatus }) {
  if (!latestHazard) {
    return {
      direction: 'forward',
      action: 'continue',
      urgency: 'normal',
      message: 'Path clear',
    }
  }

  const type = mapDetectionToType(latestHazard.category || latestHazard.class)
  
  // Determine avoidance based on hazard type and severity
  const avoidanceMap = {
    vehicle: { 
      direction: 'left', 
      action: 'move_left', 
      urgency: latestHazard.severity === 'danger' ? 'high' : 'medium',
      message: 'Move to sidewalk'
    },
    person: { 
      direction: 'right', 
      action: 'move_right', 
      urgency: 'medium',
      message: 'Give space to pedestrian'
    },
    obstacle: { 
      direction: 'left', 
      action: 'move_left', 
      urgency: latestHazard.severity === 'danger' ? 'high' : 'low',
      message: 'Navigate around obstacle'
    },
  }

  return avoidanceMap[type] || {
    direction: 'forward',
    action: 'slow_down',
    urgency: 'medium',
    message: 'Proceed with caution',
  }
}

/**
 * Build transit state for simulation
 */
function buildTransitState({ transitState, transitActive }) {
  if (!transitActive || !transitState) {
    return {
      active: false,
      state: null,
      label: null,
    }
  }

  const stateLabels = {
    [TRANSIT_STATES.WALKING_TO_STOP]: 'Walking to Stop',
    [TRANSIT_STATES.WAITING_FOR_BUS]: 'Waiting for Bus',
    [TRANSIT_STATES.BUS_IDENTIFIED]: 'Bus Identified',
    [TRANSIT_STATES.BOARDING]: 'Boarding',
    [TRANSIT_STATES.IN_TRANSIT]: 'In Transit',
    [TRANSIT_STATES.PREPARE_TO_EXIT]: 'Prepare to Exit',
  }

  return {
    active: true,
    state: transitState,
    label: stateLabels[transitState] || transitState,
  }
}

export default useSimulationState
