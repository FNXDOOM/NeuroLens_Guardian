/**
 * Simulation Modal Component
 * 
 * Modal wrapper for the 3D AR Glasses Simulation that can be
 * triggered from the main dashboard without disrupting the UI.
 * 
 * @module components/simulation/SimulationModal
 */

'use client'

import { useState, useEffect } from 'react'
import { X, Maximize2, Minimize2, Info, AlertCircle } from 'lucide-react'
import ARGlasses3DScene from './ARGlasses3DScene'
import { useSimulationState } from '@/hooks/useSimulationState'

export default function SimulationModal({ 
  isOpen, 
  onClose, 
  appState = {},
  showControls = false 
}) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [error, setError] = useState(null)
  
  // Transform app state into simulation state
  const simulationState = useSimulationState(appState)
  
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
    setIsFullscreen(!isFullscreen)
  }
  
  // Handle errors from Three.js
  const handleError = (err) => {
    console.error('3D Simulation error:', err)
    setError('3D simulation failed to load. Your browser may not support WebGL.')
  }
  
  if (!isOpen) return null
  
  return (
    <div className={`fixed inset-0 z-50 ${isFullscreen ? '' : 'p-4 md:p-8'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full h-full ${isFullscreen ? '' : 'max-w-7xl mx-auto'} bg-gray-900 rounded-lg overflow-hidden shadow-2xl flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-white font-semibold">3D AR Glasses Simulation</h2>
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {simulationState.simulationMode.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
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
        {showInfo && !error && (
          <div className="absolute top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-gray-700 z-10">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white font-semibold">Live Simulation</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300">
              <p>This 3D simulation reflects your live application state:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Real-time hazard detection</li>
                <li>Live distress monitoring</li>
                <li>Active navigation routes</li>
                <li>Safe Zone recommendations</li>
                <li>Guardian notifications</li>
              </ul>
              
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-medium ${
                    simulationState.distressStatus === 'safe' ? 'text-green-400' :
                    simulationState.distressStatus === 'warning' ? 'text-yellow-400' :
                    simulationState.distressStatus === 'distress' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {simulationState.distressStatus.toUpperCase()}
                  </span>
                </div>
                
                {simulationState.hasHazards && (
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-400">Hazards:</span>
                    <span className="text-red-400 font-medium">
                      {simulationState.hazardMarkers.length} detected
                    </span>
                  </div>
                )}
                
                {simulationState.safeZoneDistance && (
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-400">Safe Zone:</span>
                    <span className="text-blue-400 font-medium">
                      {Math.round(simulationState.safeZoneDistance)}m away
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* 3D Scene or Error */}
        <div className="flex-1 relative">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center max-w-md px-6">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  Simulation Unavailable
                </h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <p className="text-sm text-gray-500">
                  The main application continues to work normally.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Close Simulation
                </button>
              </div>
            </div>
          ) : (
            <ARGlasses3DScene
              simulationState={simulationState}
              onError={handleError}
            />
          )}
        </div>
        
        {/* Status Bar */}
        {!error && (
          <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <span>Mode: <span className="text-white">{simulationState.simulationMode}</span></span>
                {simulationState.isNavigating && (
                  <span>Navigation: <span className="text-green-400">Active</span></span>
                )}
                {simulationState.guardianState.notified && (
                  <span>Guardian: <span className="text-blue-400">Notified</span></span>
                )}
              </div>
              
              <div className="text-gray-500">
                Synced with live app state
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
