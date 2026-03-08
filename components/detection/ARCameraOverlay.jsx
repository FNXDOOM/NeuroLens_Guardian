'use client'

/**
 * Stable AR Camera Overlay with TensorFlow.js Detection
 * Production-ready hazard detection component
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { AlertTriangle, Loader2, XCircle, Camera, CameraOff } from 'lucide-react'
import { loadModel, detectObjects, analyzeDetections, drawDetections, getLoadingState } from '@/utils/tensorflowLoader'

export default function ARCameraOverlay({
  enabled = true,
  onDetection = null,
  onHazardChange = null,
  detectionInterval = 1000, // 1 second for demo stability
  showOverlay = true,
  showWarnings = true,
  confidenceThreshold = 0.5,
  facingMode = 'user', // 'user' for webcam, 'environment' for mobile rear camera
}) {
  // Refs
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const detectionLoopRef = useRef(null)
  
  // State
  const [isInitialized, setIsInitialized] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [modelLoading, setModelLoading] = useState(true)
  const [modelError, setModelError] = useState(null)
  const [detections, setDetections] = useState([])
  const [latestHazard, setLatestHazard] = useState(null)
  const [isDetecting, setIsDetecting] = useState(false)

  /**
   * Initialize camera stream
   */
  const initCamera = useCallback(async () => {
    try {
      setCameraError(null)
      
      // Stop existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for video to be ready before playing
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              // Ignore AbortError as it's expected when switching modes
              if (err.name !== 'AbortError') {
                console.error('[Camera] Play error:', err)
              }
            })
          }
        }
        
        setIsInitialized(true)
      }
      
    } catch (error) {
      console.error('[Camera] Failed to access camera:', error)
      setCameraError(error.message || 'Camera access denied')
    }
  }, [facingMode])

  /**
   * Stop camera stream
   */
  const stopCamera = useCallback(() => {
    // Stop detection loop first
    if (detectionLoopRef.current) {
      clearInterval(detectionLoopRef.current)
      detectionLoopRef.current = null
    }
    
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
      videoRef.current.onloadedmetadata = null
    }
    
    setIsInitialized(false)
    setDetections([])
    setLatestHazard(null)
  }, [])

  /**
   * Load TensorFlow model
   */
  useEffect(() => {
    let mounted = true
    
    const initModel = async () => {
      try {
        setModelLoading(true)
        setModelError(null)
        await loadModel()
        
        if (mounted) {
          setModelLoading(false)
        }
      } catch (error) {
        console.error('[Model] Failed to load:', error)
        if (mounted) {
          setModelError(error.message || 'Failed to load detection model')
          setModelLoading(false)
        }
      }
    }
    
    initModel()
    
    return () => {
      mounted = false
    }
  }, [])

  /**
   * Initialize camera when enabled or facingMode changes
   */
  useEffect(() => {
    if (enabled && !cameraError) {
      // Reinitialize camera when facingMode changes
      if (isInitialized) {
        stopCamera()
      }
      initCamera()
    } else if (!enabled && isInitialized) {
      stopCamera()
    }
    
    return () => {
      if (isInitialized) {
        stopCamera()
      }
    }
  }, [enabled, facingMode, cameraError]) // Added facingMode to dependencies

  /**
   * Run detection loop
   */
  const runDetection = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !enabled || modelLoading || modelError) {
      return
    }
    
    try {
      setIsDetecting(true)
      
      // Detect objects
      const predictions = await detectObjects(videoRef.current, {
        maxDetections: 20
      })
      
      // Analyze detections
      const analysis = analyzeDetections(predictions)
      
      // Update state
      setDetections(analysis.detections)
      
      // Update hazard if changed
      if (analysis.latestHazard) {
        setLatestHazard(analysis.latestHazard)
        
        if (onHazardChange) {
          onHazardChange(analysis.latestHazard)
        }
      } else if (latestHazard) {
        // Clear hazard if none detected
        setLatestHazard(null)
        if (onHazardChange) {
          onHazardChange(null)
        }
      }
      
      // Callback with all detections
      if (onDetection) {
        onDetection(analysis.detections)
      }
      
      // Draw on canvas
      if (showOverlay && canvasRef.current && videoRef.current) {
        drawDetections(
          canvasRef.current,
          analysis.detections,
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        )
      }
      
    } catch (error) {
      console.error('[Detection] Error:', error)
    } finally {
      setIsDetecting(false)
    }
  }, [enabled, modelLoading, modelError, latestHazard, onDetection, onHazardChange, showOverlay])

  /**
   * Start/stop detection loop
   */
  useEffect(() => {
    if (enabled && isInitialized && !modelLoading && !modelError) {
      // Start detection loop
      detectionLoopRef.current = setInterval(runDetection, detectionInterval)
      
      return () => {
        if (detectionLoopRef.current) {
          clearInterval(detectionLoopRef.current)
        }
      }
    }
  }, [enabled, isInitialized, modelLoading, modelError, detectionInterval, runDetection])

  /**
   * Render loading state
   */
  if (modelLoading) {
    return (
      <div className="relative w-full h-full bg-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <p className="text-lg font-medium">Loading AI Detection Model...</p>
          <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
        </div>
      </div>
    )
  }

  /**
   * Render model error
   */
  if (modelError) {
    return (
      <div className="relative w-full h-full bg-red-900/20 border-2 border-red-500 rounded-lg flex items-center justify-center">
        <div className="text-center text-white p-6">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium">Detection Unavailable</p>
          <p className="text-sm text-gray-300 mt-2">{modelError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  /**
   * Render camera error
   */
  if (cameraError) {
    return (
      <div className="relative w-full h-full bg-yellow-900/20 border-2 border-yellow-500 rounded-lg flex items-center justify-center">
        <div className="text-center text-white p-6">
          <CameraOff className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <p className="text-lg font-medium">Camera Access Required</p>
          <p className="text-sm text-gray-300 mt-2">{cameraError}</p>
          <button
            onClick={initCamera}
            className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-sm font-medium text-black"
          >
            Enable Camera
          </button>
        </div>
      </div>
    )
  }

  /**
   * Render AR view
   */
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* Video feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />
      
      {/* Canvas overlay */}
      {showOverlay && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      )}
      
      {/* Status indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-2 rounded-lg">
        <Camera className={`w-4 h-4 ${isDetecting ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
        <span className="text-white text-sm font-medium">
          {isDetecting ? 'Detecting...' : 'Ready'}
        </span>
      </div>
      
      {/* Detection count */}
      {detections.length > 0 && (
        <div className="absolute top-4 right-4 bg-black/70 px-3 py-2 rounded-lg">
          <span className="text-white text-sm font-medium">
            {detections.length} object{detections.length !== 1 ? 's' : ''} detected
          </span>
        </div>
      )}
      
      {/* Latest hazard warning */}
      {showWarnings && latestHazard && latestHazard.severity !== 'safe' && (
        <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-lg ${
          latestHazard.severity === 'danger' ? 'bg-red-500/90' :
          latestHazard.severity === 'caution' ? 'bg-yellow-500/90' :
          'bg-blue-500/90'
        }`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-white flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-bold text-lg">
                {latestHazard.class.toUpperCase()} DETECTED
              </p>
              <p className="text-white/90 text-sm">
                {latestHazard.description} - {Math.round(latestHazard.confidence * 100)}% confidence
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Detection list (optional debug) */}
      {process.env.NODE_ENV === 'development' && detections.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-black/80 p-3 rounded-lg max-w-xs max-h-48 overflow-y-auto">
          <p className="text-white text-xs font-bold mb-2">Detections:</p>
          {detections.slice(0, 5).map((det, idx) => (
            <div key={idx} className="text-white text-xs mb-1">
              {det.class} ({Math.round(det.score * 100)}%) - {det.severity}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
