/**
 * TensorFlow.js Model Loader and Detection Utilities
 * Handles COCO-SSD model loading and object detection
 */

import * as tf from '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

let model = null
let isLoading = false
let loadError = null

/**
 * Load COCO-SSD model (call once on app init)
 */
export async function loadModel() {
  if (model) return model
  
  if (isLoading) {
    // Wait for existing load to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return model
  }

  try {
    isLoading = true
    loadError = null
    
    console.log('[TensorFlow] Initializing...')
    
    // Set backend (WebGL for performance)
    await tf.ready()
    await tf.setBackend('webgl')
    
    console.log('[TensorFlow] Loading COCO-SSD model...')
    
    // Load model with lite version for better performance
    model = await cocoSsd.load({
      base: 'lite_mobilenet_v2'
    })
    
    console.log('[TensorFlow] Model loaded successfully')
    return model
    
  } catch (error) {
    console.error('[TensorFlow] Failed to load model:', error)
    loadError = error
    throw error
  } finally {
    isLoading = false
  }
}

/**
 * Get loaded model instance
 */
export function getModel() {
  return model
}

/**
 * Get loading state
 */
export function getLoadingState() {
  return {
    isLoading,
    isLoaded: !!model,
    error: loadError
  }
}

/**
 * Detect objects in image/video element
 */
export async function detectObjects(imageElement, options = {}) {
  if (!model) {
    console.warn('[TensorFlow] Model not loaded, attempting to load...')
    await loadModel()
  }
  
  if (!model) {
    throw new Error('Model failed to load')
  }
  
  try {
    const predictions = await model.detect(imageElement, options.maxDetections || 20)
    return predictions
  } catch (error) {
    console.error('[TensorFlow] Detection error:', error)
    return []
  }
}

/**
 * Hazard classification rules
 */
const HAZARD_CLASSES = {
  // High danger - moving vehicles
  danger: {
    classes: ['car', 'truck', 'bus', 'motorcycle', 'bicycle'],
    minConfidence: 0.6,
    category: 'vehicle',
    description: 'Moving vehicle detected'
  },
  // Caution - people and obstacles
  caution: {
    classes: ['person', 'dog', 'cat', 'chair', 'bench', 'bottle', 'backpack', 'handbag'],
    minConfidence: 0.5,
    category: 'obstacle',
    description: 'Obstacle detected'
  },
  // Warning - traffic infrastructure
  warning: {
    classes: ['traffic light', 'stop sign', 'parking meter', 'fire hydrant'],
    minConfidence: 0.5,
    category: 'infrastructure',
    description: 'Traffic element detected'
  }
}

/**
 * Classify detection into hazard category
 */
export function classifyHazard(detection) {
  const { class: className, score } = detection
  
  // Check each hazard level
  for (const [severity, config] of Object.entries(HAZARD_CLASSES)) {
    if (config.classes.includes(className) && score >= config.minConfidence) {
      return {
        severity,
        category: config.category,
        confidence: score,
        class: className,
        description: config.description,
        bbox: detection.bbox
      }
    }
  }
  
  // Not a hazard
  return {
    severity: 'safe',
    category: 'other',
    confidence: score,
    class: className,
    description: 'Object detected',
    bbox: detection.bbox
  }
}

/**
 * Process detections and return hazard analysis
 */
export function analyzeDetections(predictions) {
  if (!predictions || predictions.length === 0) {
    return {
      detections: [],
      hazards: [],
      highestSeverity: 'safe',
      hazardCount: 0
    }
  }
  
  // Classify all detections
  const classified = predictions.map(pred => ({
    ...pred,
    ...classifyHazard(pred)
  }))
  
  // Filter to only hazards
  const hazards = classified.filter(d => d.severity !== 'safe')
  
  // Determine highest severity
  let highestSeverity = 'safe'
  if (hazards.some(h => h.severity === 'danger')) {
    highestSeverity = 'danger'
  } else if (hazards.some(h => h.severity === 'caution')) {
    highestSeverity = 'caution'
  } else if (hazards.some(h => h.severity === 'warning')) {
    highestSeverity = 'warning'
  }
  
  return {
    detections: classified,
    hazards,
    highestSeverity,
    hazardCount: hazards.length,
    latestHazard: hazards[0] || null
  }
}

/**
 * Draw bounding boxes on canvas
 */
export function drawDetections(canvas, detections, videoWidth, videoHeight) {
  if (!canvas || !detections) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Set canvas size to match video
  canvas.width = videoWidth
  canvas.height = videoHeight
  
  // Draw each detection
  detections.forEach(detection => {
    const [x, y, width, height] = detection.bbox
    const { severity, class: className, score } = detection
    
    // Color based on severity
    const colors = {
      danger: '#ef4444',
      caution: '#f59e0b',
      warning: '#3b82f6',
      safe: '#10b981'
    }
    
    const color = colors[severity] || colors.safe
    
    // Draw bounding box
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.strokeRect(x, y, width, height)
    
    // Draw label background
    const label = `${className} ${Math.round(score * 100)}%`
    ctx.font = '16px sans-serif'
    const textWidth = ctx.measureText(label).width
    
    ctx.fillStyle = color
    ctx.fillRect(x, y - 25, textWidth + 10, 25)
    
    // Draw label text
    ctx.fillStyle = '#ffffff'
    ctx.fillText(label, x + 5, y - 7)
  })
}
