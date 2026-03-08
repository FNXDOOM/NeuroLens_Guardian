/**
 * Advanced AR Safety Engine
 * 
 * Combines object detection, hazard classification, severity scoring,
 * directional suggestions, and distance estimation into a unified
 * safety interpretation system.
 * 
 * @module utils/safetyEngine
 */

import { estimateDistance, isCriticalDistance } from './distanceEstimation'

/**
 * Compute comprehensive safety assessment
 * @param {Object} params - Safety engine parameters
 * @param {Array} params.detections - Array of detected hazards
 * @param {Object} params.latestHazard - Primary hazard
 * @param {Object} params.videoElement - Video element for dimensions
 * @param {Object} params.routeState - Current route state
 * @param {Object} params.userLocation - User location
 * @param {Object} params.nearestSafeZone - Nearest Safe Zone
 * @returns {Object} Safety assessment result
 */
export function computeSafetyAssessment({
  detections = [],
  latestHazard = null,
  videoElement = null,
  routeState = null,
  userLocation = null,
  nearestSafeZone = null,
}) {
  // Default safe state
  if (!latestHazard || detections.length === 0) {
    return {
      safetyScore: 100,
      currentRiskLevel: 'safe',
      recommendedDirection: 'continue_forward',
      warningLabel: 'Clear path',
      voiceFriendlyWarning: 'All clear. Continue with confidence.',
      primaryHazard: null,
      hazardDistance: null,
      hazardPosition: null,
      criticalHazards: [],
    }
  }

  // Get video dimensions
  const videoWidth = videoElement?.videoWidth || 1280
  const videoHeight = videoElement?.videoHeight || 720

  // Estimate distance for primary hazard
  const hazardDistance = estimateDistance(latestHazard, videoWidth, videoHeight)

  // Determine hazard position (left/center/right)
  const hazardPosition = getHazardPosition(latestHazard.bbox, videoWidth)

  // Calculate base safety score (0-100, higher = safer)
  let safetyScore = 100

  // Reduce score based on hazard severity
  if (latestHazard.severity === 'danger') {
    safetyScore -= 40
  } else if (latestHazard.severity === 'caution') {
    safetyScore -= 20
  } else {
    safetyScore -= 10
  }

  // Reduce score based on distance
  if (hazardDistance.distanceCategory === 'very_close') {
    safetyScore -= 30
  } else if (hazardDistance.distanceCategory === 'close') {
    safetyScore -= 20
  } else if (hazardDistance.distanceCategory === 'medium') {
    safetyScore -= 10
  }

  // Reduce score based on position (center is more dangerous)
  if (hazardPosition === 'center') {
    safetyScore -= 15
  } else {
    safetyScore -= 5
  }

  // Reduce score for multiple hazards
  const dangerCount = detections.filter(d => d.severity === 'danger').length
  const cautionCount = detections.filter(d => d.severity === 'caution').length
  safetyScore -= (dangerCount * 10)
  safetyScore -= (cautionCount * 5)

  // Ensure score stays in range
  safetyScore = Math.max(0, Math.min(100, safetyScore))

  // Determine risk level
  let currentRiskLevel
  if (safetyScore < 30) {
    currentRiskLevel = 'critical'
  } else if (safetyScore < 50) {
    currentRiskLevel = 'danger'
  } else if (safetyScore < 75) {
    currentRiskLevel = 'caution'
  } else {
    currentRiskLevel = 'safe'
  }

  // Override to critical if high-severity hazard is very close
  if (isCriticalDistance(latestHazard, hazardDistance.distanceCategory)) {
    currentRiskLevel = 'critical'
    safetyScore = Math.min(safetyScore, 25)
  }

  // Determine recommended direction
  const recommendedDirection = getRecommendedDirection(
    latestHazard,
    hazardPosition,
    hazardDistance,
    currentRiskLevel
  )

  // Generate warning labels
  const warningLabel = generateWarningLabel(
    latestHazard,
    hazardDistance,
    hazardPosition
  )

  const voiceFriendlyWarning = generateVoiceWarning(
    latestHazard,
    hazardDistance,
    recommendedDirection,
    nearestSafeZone
  )

  // Identify critical hazards
  const criticalHazards = detections.filter(d =>
    isCriticalDistance(d, estimateDistance(d, videoWidth, videoHeight).distanceCategory)
  )

  return {
    safetyScore,
    currentRiskLevel,
    recommendedDirection,
    warningLabel,
    voiceFriendlyWarning,
    primaryHazard: latestHazard,
    hazardDistance,
    hazardPosition,
    criticalHazards,
    totalHazards: detections.length,
    dangerCount,
    cautionCount,
  }
}

/**
 * Determine hazard position relative to screen
 * @param {Array} bbox - Bounding box [x, y, width, height]
 * @param {number} videoWidth - Video width
 * @returns {string} Position (left/center/right)
 */
function getHazardPosition(bbox, videoWidth) {
  const [x, y, width, height] = bbox
  const centerX = x + width / 2

  if (centerX < videoWidth * 0.33) {
    return 'left'
  } else if (centerX > videoWidth * 0.67) {
    return 'right'
  } else {
    return 'center'
  }
}

/**
 * Get recommended direction based on hazard
 * @param {Object} hazard - Hazard object
 * @param {string} position - Hazard position
 * @param {Object} distance - Distance estimation
 * @param {string} riskLevel - Current risk level
 * @returns {string} Recommended direction
 */
function getRecommendedDirection(hazard, position, distance, riskLevel) {
  // Critical situations - stop
  if (riskLevel === 'critical' && position === 'center') {
    return 'stop'
  }

  // High danger in center - stop or move around
  if (hazard.severity === 'danger' && position === 'center' && distance.distanceCategory !== 'far') {
    return 'stop'
  }

  // Hazard on left - move right
  if (position === 'left') {
    return 'move_right'
  }

  // Hazard on right - move left
  if (position === 'right') {
    return 'move_left'
  }

  // Hazard in center but far - continue with caution
  if (distance.distanceCategory === 'far') {
    return 'continue_forward'
  }

  // Default - continue forward
  return 'continue_forward'
}

/**
 * Generate warning label
 * @param {Object} hazard - Hazard object
 * @param {Object} distance - Distance estimation
 * @param {string} position - Hazard position
 * @returns {string} Warning label
 */
function generateWarningLabel(hazard, distance, position) {
  const distanceText = distance.distanceCategory === 'very_close' ? 'very close' :
                       distance.distanceCategory === 'close' ? 'close' :
                       distance.distanceCategory === 'medium' ? 'ahead' : 'in distance'

  return `${hazard.warning} — ${distanceText}`
}

/**
 * Generate voice-friendly warning
 * @param {Object} hazard - Hazard object
 * @param {Object} distance - Distance estimation
 * @param {string} direction - Recommended direction
 * @param {Object} safeZone - Nearest Safe Zone
 * @returns {string} Voice-friendly warning
 */
function generateVoiceWarning(hazard, distance, direction, safeZone) {
  const directionText = {
    move_left: 'Move slightly left.',
    move_right: 'Move slightly right.',
    stop: 'Please stop.',
    continue_forward: 'Continue forward.',
  }[direction] || 'Proceed with caution.'

  // Critical situations
  if (distance.distanceCategory === 'very_close' && hazard.severity === 'danger') {
    return `${hazard.warning}. ${directionText}`
  }

  // Close hazards
  if (distance.distanceCategory === 'close') {
    return `${hazard.warning} at ${distance.approximateMeters} meters. ${directionText}`
  }

  // Medium distance
  if (distance.distanceCategory === 'medium') {
    return `${hazard.warning}. ${directionText}`
  }

  // Far hazards
  return `${hazard.warning} in distance. Continue with awareness.`
}

/**
 * Get direction arrow for display
 * @param {string} direction - Recommended direction
 * @returns {string} Direction arrow
 */
export function getDirectionArrow(direction) {
  const arrows = {
    move_left: '←',
    move_right: '→',
    stop: '⏸',
    continue_forward: '➡️',
  }
  return arrows[direction] || '➡️'
}

/**
 * Get direction label for display
 * @param {string} direction - Recommended direction
 * @returns {string} Direction label
 */
export function getDirectionLabel(direction) {
  const labels = {
    move_left: 'Move Left',
    move_right: 'Move Right',
    stop: 'Stop',
    continue_forward: 'Continue Forward',
  }
  return labels[direction] || 'Continue Forward'
}

/**
 * Get risk level color
 * @param {string} riskLevel - Risk level
 * @returns {string} Color hex code
 */
export function getRiskLevelColor(riskLevel) {
  const colors = {
    safe: '#10b981',
    caution: '#f59e0b',
    danger: '#ef4444',
    critical: '#dc2626',
  }
  return colors[riskLevel] || '#6b7280'
}

export default {
  computeSafetyAssessment,
  getDirectionArrow,
  getDirectionLabel,
  getRiskLevelColor,
}
