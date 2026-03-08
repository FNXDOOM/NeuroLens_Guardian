/**
 * Distance Estimation Utility
 * 
 * Provides approximate distance estimation for detected objects
 * based on bounding box size and screen coverage.
 * 
 * Note: This is a heuristic approximation for MVP purposes,
 * not true depth sensing.
 * 
 * @module utils/distanceEstimation
 */

/**
 * Estimate distance category based on bounding box size
 * @param {Object} detection - Detection object with bbox
 * @param {number} videoWidth - Video width in pixels
 * @param {number} videoHeight - Video height in pixels
 * @returns {Object} Distance estimation result
 */
export function estimateDistance(detection, videoWidth, videoHeight) {
  const [x, y, width, height] = detection.bbox
  
  // Calculate bounding box area
  const bboxArea = width * height
  
  // Calculate screen area
  const screenArea = videoWidth * videoHeight
  
  // Calculate coverage percentage
  const coveragePercent = (bboxArea / screenArea) * 100
  
  // Calculate aspect ratio (helps distinguish close vs far objects)
  const aspectRatio = width / height
  
  // Determine distance category based on coverage
  let distanceCategory
  let approximateMeters
  let proximityScore // 0-100, higher = closer
  
  if (coveragePercent > 25) {
    // Very close - object takes up >25% of screen
    distanceCategory = 'very_close'
    approximateMeters = 1
    proximityScore = 95
  } else if (coveragePercent > 15) {
    // Close - object takes up 15-25% of screen
    distanceCategory = 'close'
    approximateMeters = 3
    proximityScore = 75
  } else if (coveragePercent > 5) {
    // Medium - object takes up 5-15% of screen
    distanceCategory = 'medium'
    approximateMeters = 8
    proximityScore = 50
  } else {
    // Far - object takes up <5% of screen
    distanceCategory = 'far'
    approximateMeters = 15
    proximityScore = 25
  }
  
  // Adjust for object type (vehicles appear larger at same distance)
  if (detection.category === 'vehicle') {
    // Vehicles are larger, so adjust distance upward
    approximateMeters = Math.round(approximateMeters * 1.5)
  } else if (detection.category === 'pedestrian') {
    // People are medium-sized
    approximateMeters = Math.round(approximateMeters * 1.0)
  } else if (detection.category === 'obstacle') {
    // Small objects, adjust distance downward
    approximateMeters = Math.round(approximateMeters * 0.7)
  }
  
  return {
    distanceCategory,
    approximateMeters,
    proximityScore,
    coveragePercent: Math.round(coveragePercent * 10) / 10,
    bboxArea,
    screenArea,
  }
}

/**
 * Get distance label for display
 * @param {string} distanceCategory - Distance category
 * @returns {string} Human-readable distance label
 */
export function getDistanceLabel(distanceCategory) {
  const labels = {
    very_close: 'Very Close',
    close: 'Close',
    medium: 'Medium Distance',
    far: 'Far',
  }
  return labels[distanceCategory] || 'Unknown'
}

/**
 * Get distance emoji for visual indication
 * @param {string} distanceCategory - Distance category
 * @returns {string} Emoji representing distance
 */
export function getDistanceEmoji(distanceCategory) {
  const emojis = {
    very_close: '🔴',
    close: '🟠',
    medium: '🟡',
    far: '🟢',
  }
  return emojis[distanceCategory] || '⚪'
}

/**
 * Determine if distance is critical for given hazard
 * @param {Object} hazard - Hazard object
 * @param {string} distanceCategory - Distance category
 * @returns {boolean} True if distance is critical
 */
export function isCriticalDistance(hazard, distanceCategory) {
  // High severity hazards are critical when close
  if (hazard.severity === 'danger') {
    return distanceCategory === 'very_close' || distanceCategory === 'close'
  }
  
  // Medium severity hazards are critical only when very close
  if (hazard.severity === 'caution') {
    return distanceCategory === 'very_close'
  }
  
  // Low severity hazards are rarely critical
  return false
}

export default {
  estimateDistance,
  getDistanceLabel,
  getDistanceEmoji,
  isCriticalDistance,
}
