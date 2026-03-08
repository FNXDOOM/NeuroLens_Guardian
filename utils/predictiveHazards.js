/**
 * Predictive Hazard Awareness
 * 
 * Tracks object movement across frames and predicts potential collisions
 * or hazards based on simple heuristics.
 * 
 * @module utils/predictiveHazards
 */

/**
 * Object movement types
 */
export const MOVEMENT_TYPES = {
  STATIONARY: 'stationary',
  APPROACHING: 'approaching',
  RECEDING: 'receding',
  CROSSING_LEFT: 'crossing_left',
  CROSSING_RIGHT: 'crossing_right',
  UNKNOWN: 'unknown',
}

/**
 * Predictive hazard types
 */
export const PREDICTIVE_HAZARD_TYPES = {
  APPROACHING_VEHICLE: 'approaching_vehicle',
  CROSSING_HAZARD: 'crossing_hazard',
  CROWDED_PATH: 'crowded_path',
  OBSTACLE_AHEAD: 'obstacle_ahead',
  NONE: 'none',
}

/**
 * Track object movement between frames
 * @param {Object} currentDetection - Current frame detection
 * @param {Object} previousDetection - Previous frame detection
 * @param {number} timeDelta - Time between frames (ms)
 * @returns {Object} Movement analysis
 */
export function analyzeObjectMovement(currentDetection, previousDetection, timeDelta = 1000) {
  if (!currentDetection || !previousDetection) {
    return {
      movementType: MOVEMENT_TYPES.UNKNOWN,
      velocity: 0,
      direction: null,
      isApproaching: false,
      isCrossing: false,
    }
  }

  const [currX, currY, currW, currH] = currentDetection.bbox
  const [prevX, prevY, prevW, prevH] = previousDetection.bbox

  // Calculate center points
  const currCenterX = currX + currW / 2
  const currCenterY = currY + currH / 2
  const prevCenterX = prevX + prevW / 2
  const prevCenterY = prevY + prevH / 2

  // Calculate movement
  const deltaX = currCenterX - prevCenterX
  const deltaY = currCenterY - prevCenterY
  const deltaSize = (currW * currH) - (prevW * prevH)

  // Calculate velocity (pixels per second)
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  const velocity = (distance / timeDelta) * 1000

  // Determine movement type
  let movementType = MOVEMENT_TYPES.STATIONARY
  let isApproaching = false
  let isCrossing = false

  // Stationary threshold
  if (velocity < 5) {
    movementType = MOVEMENT_TYPES.STATIONARY
  }
  // Approaching (getting larger)
  else if (deltaSize > 1000) {
    movementType = MOVEMENT_TYPES.APPROACHING
    isApproaching = true
  }
  // Receding (getting smaller)
  else if (deltaSize < -1000) {
    movementType = MOVEMENT_TYPES.RECEDING
  }
  // Crossing left
  else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -10) {
    movementType = MOVEMENT_TYPES.CROSSING_LEFT
    isCrossing = true
  }
  // Crossing right
  else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 10) {
    movementType = MOVEMENT_TYPES.CROSSING_RIGHT
    isCrossing = true
  }

  return {
    movementType,
    velocity,
    direction: { x: deltaX, y: deltaY },
    deltaSize,
    isApproaching,
    isCrossing,
  }
}

/**
 * Predict collision risk
 * @param {Object} detection - Current detection with movement data
 * @param {Object} distance - Distance estimation
 * @returns {Object} Collision prediction
 */
export function predictCollisionRisk(detection, distance) {
  if (!detection.movement) {
    return {
      collisionRisk: 'none',
      timeToCollision: null,
      collisionPath: null,
    }
  }

  const { movementType, velocity, isApproaching } = detection.movement

  // No risk if stationary or receding
  if (movementType === MOVEMENT_TYPES.STATIONARY || 
      movementType === MOVEMENT_TYPES.RECEDING) {
    return {
      collisionRisk: 'none',
      timeToCollision: null,
      collisionPath: null,
    }
  }

  // Calculate time to collision (rough estimate)
  let timeToCollision = null
  if (isApproaching && velocity > 0 && distance.approximateMeters) {
    // Convert meters to pixels (rough approximation)
    const pixelsPerMeter = 100
    const distancePixels = distance.approximateMeters * pixelsPerMeter
    timeToCollision = distancePixels / velocity // seconds
  }

  // Determine collision risk
  let collisionRisk = 'none'
  if (isApproaching && distance.distanceCategory === 'very_close') {
    collisionRisk = 'critical'
  } else if (isApproaching && distance.distanceCategory === 'close') {
    collisionRisk = 'high'
  } else if (isApproaching && distance.distanceCategory === 'medium') {
    collisionRisk = 'moderate'
  } else if (detection.movement.isCrossing) {
    collisionRisk = 'moderate'
  }

  return {
    collisionRisk,
    timeToCollision,
    collisionPath: movementType,
  }
}

/**
 * Generate predictive hazard assessment
 * @param {Array} detections - Current detections with movement data
 * @returns {Object} Predictive hazard assessment
 */
export function generatePredictiveHazard(detections) {
  if (!detections || detections.length === 0) {
    return {
      predictiveHazardType: PREDICTIVE_HAZARD_TYPES.NONE,
      predictedRiskLevel: 'safe',
      predictedCollisionPath: null,
      affectedDetections: [],
      warningLabel: 'Clear path',
    }
  }

  // Count hazard types
  const approachingVehicles = detections.filter(d => 
    d.category === 'vehicle' && 
    d.movement?.isApproaching &&
    d.collisionPrediction?.collisionRisk !== 'none'
  )

  const crossingHazards = detections.filter(d =>
    d.movement?.isCrossing &&
    d.collisionPrediction?.collisionRisk !== 'none'
  )

  const crowdedPath = detections.filter(d =>
    d.category === 'pedestrian'
  ).length >= 3

  const stationaryObstacles = detections.filter(d =>
    d.category === 'obstacle' &&
    d.distance?.distanceCategory !== 'far'
  )

  // Determine predictive hazard type (priority order)
  let predictiveHazardType = PREDICTIVE_HAZARD_TYPES.NONE
  let predictedRiskLevel = 'safe'
  let warningLabel = 'Clear path'
  let affectedDetections = []

  if (approachingVehicles.length > 0) {
    predictiveHazardType = PREDICTIVE_HAZARD_TYPES.APPROACHING_VEHICLE
    predictedRiskLevel = 'danger'
    warningLabel = 'Vehicle approaching'
    affectedDetections = approachingVehicles
  } else if (crossingHazards.length > 0) {
    predictiveHazardType = PREDICTIVE_HAZARD_TYPES.CROSSING_HAZARD
    predictedRiskLevel = 'caution'
    warningLabel = 'Crossing hazard detected'
    affectedDetections = crossingHazards
  } else if (crowdedPath) {
    predictiveHazardType = PREDICTIVE_HAZARD_TYPES.CROWDED_PATH
    predictedRiskLevel = 'caution'
    warningLabel = 'Crowded path ahead'
    affectedDetections = detections.filter(d => d.category === 'pedestrian')
  } else if (stationaryObstacles.length > 0) {
    predictiveHazardType = PREDICTIVE_HAZARD_TYPES.OBSTACLE_AHEAD
    predictedRiskLevel = 'safe'
    warningLabel = 'Obstacle ahead'
    affectedDetections = stationaryObstacles
  }

  // Determine predicted collision path
  let predictedCollisionPath = null
  if (affectedDetections.length > 0) {
    const primaryHazard = affectedDetections[0]
    predictedCollisionPath = primaryHazard.collisionPrediction?.collisionPath || null
  }

  return {
    predictiveHazardType,
    predictedRiskLevel,
    predictedCollisionPath,
    affectedDetections,
    warningLabel,
  }
}

/**
 * Get predictive warning message
 * @param {string} hazardType - Predictive hazard type
 * @param {Object} primaryHazard - Primary affected detection
 * @returns {string} Warning message
 */
export function getPredictiveWarningMessage(hazardType, primaryHazard) {
  const messages = {
    [PREDICTIVE_HAZARD_TYPES.APPROACHING_VEHICLE]: 
      primaryHazard?.collisionPrediction?.timeToCollision 
        ? `Vehicle approaching. ${Math.round(primaryHazard.collisionPrediction.timeToCollision)} seconds to collision.`
        : 'Vehicle approaching. Please be cautious.',
    [PREDICTIVE_HAZARD_TYPES.CROSSING_HAZARD]: 
      'Hazard crossing your path. Please slow down.',
    [PREDICTIVE_HAZARD_TYPES.CROWDED_PATH]: 
      'Crowded path ahead. Stay aware of your surroundings.',
    [PREDICTIVE_HAZARD_TYPES.OBSTACLE_AHEAD]: 
      'Obstacle ahead. Proceed with caution.',
    [PREDICTIVE_HAZARD_TYPES.NONE]: 
      'Clear path. Continue with confidence.',
  }

  return messages[hazardType] || 'Proceed with caution.'
}

/**
 * Get movement icon for display
 * @param {string} movementType - Movement type
 * @returns {string} Icon/emoji
 */
export function getMovementIcon(movementType) {
  const icons = {
    [MOVEMENT_TYPES.STATIONARY]: '⏸',
    [MOVEMENT_TYPES.APPROACHING]: '⚠️',
    [MOVEMENT_TYPES.RECEDING]: '✅',
    [MOVEMENT_TYPES.CROSSING_LEFT]: '←',
    [MOVEMENT_TYPES.CROSSING_RIGHT]: '→',
    [MOVEMENT_TYPES.UNKNOWN]: '❓',
  }

  return icons[movementType] || '❓'
}

export default {
  MOVEMENT_TYPES,
  PREDICTIVE_HAZARD_TYPES,
  analyzeObjectMovement,
  predictCollisionRisk,
  generatePredictiveHazard,
  getPredictiveWarningMessage,
  getMovementIcon,
}
