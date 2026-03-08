/**
 * AR Detection Modal Component
 * 
 * Full-screen modal for AR Hazard Detection with multiple camera modes.
 * Supports: Webcam, Mobile Camera, and AR Glasses View
 * 
 * @module components/detection/ARDetectionModal
 */

'use client'

import { useState, useEffect } from 'react'
import { X, Maximize2, Minimize2, Info, Camera, Smartphone, Glasses, Monitor } from 'lucide-react'
import ARCameraOverlay from './ARCameraOverlay'
import ARGlasses3DScene from '@/components/simulation/ARGlasses3DScene'

// Camera modes
const CAMERA_MODES = {
  WEBCAM: 'webcam',
  MOBILE: 'mobile',
  AR_GLASSES: 'ar_glasses',
}

export default function ARDetectionModal({ 
  isOpen, 
  onClose,
  onDetection = null,
  onHazardChange = null,
  simulationState = null, // For AR glasses mode sync
}) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [detectionCount, setDetectionCount] = useState(0)
  const [latestHazard, setLatestHazard] = useState(null)
  const [cameraMode, setCameraMode] = useState(CAMERA_MODES.WEBCAM)
  const [recentDetections, setRecentDetections] = useState([])
  
  // Auto-hide info after 5 seconds
  useEffect(() => {
    if (isOpen && showInfo) {
      const timer = setTimeout(() => {
        setShowInfo(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, showInfo])
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  
  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])
  
  // Handle detections - store them for AR Glasses mode
  const handleDetection = (detections) => {
    setDetectionCount(detections.length)
    setRecentDetections(detections)
    if (onDetection) {
      onDetection(detections)
    }
  }
  
  // Handle hazard changes
  const handleHazardChange = (hazard) => {
    setLatestHazard(hazard)
    if (onHazardChange) {
      onHazardChange(hazard)
    }
  }
  
  // Build real-time simulation state from camera detections
  const liveSimulationState = {
    ...simulationState,
    // Override with live camera detections
    latestHazard: latestHazard,
    recentDetections: recentDetections,
  }
  
  // Get camera mode label
  const getCameraModeLabel = () => {
    switch (cameraMode) {
      case CAMERA_MODES.WEBCAM:
        return 'Webcam'
      case CAMERA_MODES.MOBILE:
        return 'Mobile Camera'
      case CAMERA_MODES.AR_GLASSES:
        return 'AR Glasses View'
      default:
        return 'Camera'
    }
  }
  
  // Get camera mode icon
  const getCameraModeIcon = () => {
    switch (cameraMode) {
      case CAMERA_MODES.WEBCAM:
        return Monitor
      case CAMERA_MODES.MOBILE:
        return Smartphone
      case CAMERA_MODES.AR_GLASSES:
        return Glasses
      default:
        return Camera
    }
  }
  
  const ModeIcon = getCameraModeIcon()
  
  if (!isOpen) return null
  
  return (
    <div className={`fixed inset-0 z-50 ${isFullscreen ? '' : 'p-4 md:p-8'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full h-full ${isFullscreen ? '' : 'max-w-7xl mx-auto'} bg-gray-900 rounded-lg overflow-hidden shadow-2xl flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <ModeIcon className="w-5 h-5 text-teal-500" />
            <h2 className="text-white font-semibold">AR Hazard Detection</h2>
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {getCameraModeLabel()}
            </span>
            {cameraMode !== CAMERA_MODES.AR_GLASSES && (
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                LIVE
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Camera Mode Switcher */}
            <div className="flex items-center gap-1 bg-gray-700 rounded p-1">
              <button
                onClick={() => setCameraMode(CAMERA_MODES.WEBCAM)}
                className={`p-2 rounded transition-colors ${
                  cameraMode === CAMERA_MODES.WEBCAM
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
                title="Webcam"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCameraMode(CAMERA_MODES.MOBILE)}
                className={`p-2 rounded transition-colors ${
                  cameraMode === CAMERA_MODES.MOBILE
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
                title="Mobile Camera"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCameraMode(CAMERA_MODES.AR_GLASSES)}
                className={`p-2 rounded transition-colors ${
                  cameraMode === CAMERA_MODES.AR_GLASSES
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
                title="AR Glasses View"
              >
                <Glasses className="w-4 h-4" />
              </button>
            </div>
            
            {/* Detection Count */}
            {detectionCount > 0 && cameraMode !== CAMERA_MODES.AR_GLASSES && (
              <div className="flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded text-teal-500 text-sm">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <span>{detectionCount} detected</span>
              </div>
            )}
            
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Toggle Info"
            >
              <Info className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Info Panel */}
        {showInfo && (
          <div className="absolute top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700 z-10">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white font-semibold">
                {cameraMode === CAMERA_MODES.AR_GLASSES ? 'AR Glasses Simulation' : 'Live Detection'}
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300">
              {cameraMode === CAMERA_MODES.AR_GLASSES ? (
                <>
                  <p>3D AR glasses view with real-time sync:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Shows detected objects in 3D space</li>
                    <li>Displays warning signs for hazards</li>
                    <li>Provides directional guidance</li>
                    <li>Synced with live detections</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>Real-time object detection using TensorFlow.js:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Detects vehicles, pedestrians, obstacles</li>
                    <li>Shows bounding boxes and labels</li>
                    <li>Classifies hazard severity</li>
                    <li>Updates distress engine</li>
                    <li>{cameraMode === CAMERA_MODES.MOBILE ? 'Optimized for mobile devices' : 'Desktop webcam mode'}</li>
                  </ul>
                </>
              )}
              
              {latestHazard && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Latest Hazard:</span>
                    <span className={`font-medium ${
                      latestHazard.severity === 'danger' ? 'text-red-400' :
                      latestHazard.severity === 'caution' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {latestHazard.class.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="text-white font-medium">
                      {Math.round(latestHazard.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Camera View / AR Glasses View */}
        <div className="flex-1 relative bg-black">
          {/* Always run camera in background for real-time detection */}
          <div className={cameraMode === CAMERA_MODES.AR_GLASSES ? 'hidden' : 'block w-full h-full'}>
            <ARCameraOverlay
              enabled={isOpen}
              onDetection={handleDetection}
              onHazardChange={handleHazardChange}
              detectionInterval={cameraMode === CAMERA_MODES.MOBILE ? 1500 : 1000}
              confidenceThreshold={0.5}
              showOverlay={true}
              showWarnings={true}
              facingMode={cameraMode === CAMERA_MODES.MOBILE ? 'environment' : 'user'}
            />
          </div>
          
          {/* AR Glasses 3D View - overlaid when in AR mode */}
          {cameraMode === CAMERA_MODES.AR_GLASSES && (
            <div className="absolute inset-0">
              <ARGlasses3DScene
                simulationState={liveSimulationState}
                enableControls={false}
              />
            </div>
          )}
        </div>
        
        {/* Status Bar */}
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span>
                Mode: <span className="text-white">{getCameraModeLabel()}</span>
              </span>
              {cameraMode !== CAMERA_MODES.AR_GLASSES && (
                <>
                  <span>
                    Status: <span className="text-teal-500">Active</span>
                  </span>
                  {detectionCount > 0 && (
                    <span>
                      Objects: <span className="text-white">{detectionCount}</span>
                    </span>
                  )}
                  {latestHazard && (
                    <span>
                      Hazard: <span className={
                        latestHazard.severity === 'danger' ? 'text-red-400' :
                        latestHazard.severity === 'caution' ? 'text-yellow-400' :
                        'text-blue-400'
                      }>
                        {latestHazard.severity.toUpperCase()}
                      </span>
                    </span>
                  )}
                </>
              )}
              {cameraMode === CAMERA_MODES.AR_GLASSES && liveSimulationState && (
                <span>
                  Hazards: <span className="text-white">{liveSimulationState.hazardMarkers?.length || recentDetections.length || 0}</span>
                </span>
              )}
            </div>
            
            <div className="text-gray-500">
              {cameraMode === CAMERA_MODES.AR_GLASSES 
                ? '3D Simulation • Live camera sync'
                : 'Live camera feed • TensorFlow.js'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
