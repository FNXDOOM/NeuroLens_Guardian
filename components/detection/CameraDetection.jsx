'use client'

/**
 * CameraDetection Component
 * 
 * Webcam-based hazard detection using TensorFlow.js and COCO-SSD model.
 * Detects common objects and classifies potential hazards.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { Camera, AlertTriangle, Loader2, XCircle, CheckCircle } from 'lucide-react'

// Hazard classification mapping
const HAZARD_TYPES = {
  car: { type: 'vehicle', severity: 'high', icon: '🚗' },
  bus: { type: 'vehicle', severity: 'high', icon: '🚌' },
  truck: { type: 'vehicle', severity: 'high', icon: '🚚' },
  bicycle: { type: 'vehicle', severity: 'medium', icon: '🚲' },
  motorcycle: { type: 'vehicle', severity: 'high', icon: '🏍️' },
  person: { type: 'pedestrian', severity: 'low', icon: '🚶' },
  dog: { type: 'obstacle', severity: 'low', icon: '🐕' },
  cat: { type: 'obstacle', severity: 'low', icon: '🐈' },
  chair: { type: 'obstacle', severity: 'low', icon: '🪑' },
  bench: { type: 'obstacle', severity: 'low', icon: '🪑' },
  potted_plant: { type: 'obstacle', severity: 'low', icon: '🪴' },
  traffic_light: { type: 'traffic', severity: 'medium', icon: '🚦' },
  stop_sign: { type: 'traffic', severity: 'medium', icon: '🛑' },
}

/**
 * CameraDetection Component
 * @param {Object} props
 * @param {Function} props.onDetection - Callback when hazard detected (hazard) => void
 * @param {boolean} props.enabled - Enable/disable detection
 * @param {number} props.detectionInterval - Detection interval in ms (default: 1000)
 * @param {number} props.confidenceThreshold - Minimum confidence (default: 0.5)
 */
export default function CameraDetection({
  onDetection = null,
  enabled = true,
  detectionInterval = 1000,
  confidenceThreshold = 0.5,
}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const detectionIntervalRef = useRef(null)
  const modelRef = useRef(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [detections, setDetections] = useState([])
  const [latestHazard, setLatestHazard] = useState(null)

  /**
   * Load TensorFlow.js and COCO-SSD model
   */
  const loadModel = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Dynamically import TensorFlow.js
      const tf = await import('@tensorflow/tfjs')
      const cocoSsd = await import('@tensorflow-models/coco-ssd')

      // Load COCO-SSD model
      console.log('Loading COCO-SSD model...')
      const model = await cocoSsd.load()
      modelRef.current = model
      setIsModelLoaded(true)
      console.log('Model loaded successfully')
    } catch (err) {
      console.error('Error loading model:', err)
      setError('Failed to load detection model')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Start webcam
   */
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment', // Use back camera on mobile
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraReady(true)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Camera access denied or unavailable')
    }
  }, [])

  /**
   * Stop webcam
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setIsCameraReady(false)
    }
  }, [])

  /**
   * Classify detection as hazard
   */
  const classifyHazard = useCallback((detection) => {
    const className = detection.class.toLowerCase()
    const hazardInfo = HAZARD_TYPES[className]

    if (!hazardInfo) return null

    return {
      id: `${className}-${Date.now()}`,
      class: detection.class,
      confidence: detection.score,
      bbox: detection.bbox,
      type: hazardInfo.type,
      severity: hazardInfo.severity,
      icon: hazardInfo.icon,
      timestamp: Date.now(),
    }
  }, [])

  /**
   * Run object detection
   */
  const detectObjects = useCallback(async () => {
    if (!modelRef.current || !videoRef.current || !canvasRef.current) return
    if (videoRef.current.readyState !== 4) return

    try {
      // Run detection
      const predictions = await modelRef.current.detect(videoRef.current)

      // Filter by confidence threshold
      const validPredictions = predictions.filter(
        pred => pred.score >= confidenceThreshold
      )

      // Classify hazards
      const hazards = validPredictions
        .map(classifyHazard)
        .filter(Boolean)

      setDetections(hazards)

      // Find highest severity hazard
      if (hazards.length > 0) {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        const topHazard = hazards.reduce((prev, current) => {
          return severityOrder[current.severity] > severityOrder[prev.severity]
            ? current
            : prev
        })

        setLatestHazard(topHazard)

        // Notify parent
        if (onDetection) {
          onDetection(topHazard)
        }
      } else {
        setLatestHazard(null)
      }

      // Draw detections on canvas
      drawDetections(hazards)
    } catch (err) {
      console.error('Detection error:', err)
    }
  }, [confidenceThreshold, classifyHazard, onDetection])

  /**
   * Draw detection boxes and labels on canvas
   */
  const drawDetections = useCallback((hazards) => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw each detection
    hazards.forEach(hazard => {
      const [x, y, width, height] = hazard.bbox

      // Set color based on severity
      const colors = {
        critical: '#dc2626',
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#10b981',
      }
      const color = colors[hazard.severity] || '#10b981'

      // Draw bounding box
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, width, height)

      // Draw label background
      const label = `${hazard.icon} ${hazard.class} ${Math.round(hazard.confidence * 100)}%`
      ctx.font = '16px sans-serif'
      const textWidth = ctx.measureText(label).width
      ctx.fillStyle = color
      ctx.fillRect(x, y - 25, textWidth + 10, 25)

      // Draw label text
      ctx.fillStyle = 'white'
      ctx.fillText(label, x + 5, y - 7)
    })
  }, [])

  /**
   * Initialize detection
   */
  useEffect(() => {
    if (enabled) {
      loadModel()
      startCamera()
    }

    return () => {
      stopCamera()
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [enabled, loadModel, startCamera, stopCamera])

  /**
   * Start detection loop
   */
  useEffect(() => {
    if (isModelLoaded && isCameraReady && enabled) {
      detectionIntervalRef.current = setInterval(detectObjects, detectionInterval)
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [isModelLoaded, isCameraReady, enabled, detectionInterval, detectObjects])

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-foreground font-semibold mb-2">Loading Detection Model</p>
          <p className="text-sm text-muted-foreground">This may take a moment...</p>
        </div>
      </div>
    )
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <XCircle className="w-12 h-12 text-destructive mb-4" />
          <p className="text-foreground font-semibold mb-2">Detection Unavailable</p>
          <p className="text-sm text-muted-foreground text-center">{error}</p>
          <button
            onClick={() => {
              setError(null)
              loadModel()
              startCamera()
            }}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Camera View */}
      <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border overflow-hidden">
        <div className="relative">
          {/* Video element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
            style={{ maxHeight: '400px' }}
          />

          {/* Canvas overlay for detections */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

          {/* Status indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 px-3 py-2 rounded-lg">
            {isCameraReady && isModelLoaded ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">Detecting</span>
              </>
            ) : (
              <>
                <Loader2 className="w-4 h-4 text-white animate-spin" />
                <span className="text-white text-sm font-medium">Starting...</span>
              </>
            )}
          </div>

          {/* Detection count */}
          {detections.length > 0 && (
            <div className="absolute top-4 left-4 bg-black/70 px-3 py-2 rounded-lg">
              <span className="text-white text-sm font-medium">
                {detections.length} object{detections.length !== 1 ? 's' : ''} detected
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Detections List */}
      <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          Detected Objects
        </h3>

        {detections.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {detections.map((detection, index) => (
              <div
                key={`${detection.id}-${index}`}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  detection.severity === 'high' || detection.severity === 'critical'
                    ? 'bg-destructive/10 border-destructive/20'
                    : detection.severity === 'medium'
                    ? 'bg-warning/10 border-warning/20'
                    : 'bg-secondary/5 border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{detection.icon}</span>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {detection.class}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {detection.type} • {detection.severity} severity
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {Math.round(detection.confidence * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">confidence</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No objects detected</p>
            <p className="text-xs text-muted-foreground mt-1">Clear path ahead</p>
          </div>
        )}
      </div>

      {/* Latest Hazard Alert */}
      {latestHazard && (latestHazard.severity === 'high' || latestHazard.severity === 'critical') && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-semibold text-foreground mb-1">
                {latestHazard.icon} {latestHazard.class} Detected
              </p>
              <p className="text-sm text-muted-foreground">
                {latestHazard.severity === 'critical' ? 'Critical' : 'High'} severity hazard ahead. 
                Please proceed with caution.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
