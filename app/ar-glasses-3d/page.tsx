'use client'

/**
 * 3D AR Glasses Simulation Page
 * Demonstrates NeuroLens Guardian through immersive 3D visualization
 */

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/neurolens/navbar'
import ARGlasses3DScene from '@/components/simulation/ARGlasses3DScene'
import ARGlassesControls from '@/components/simulation/ARGlassesControls'
import { ArrowLeft, Maximize2, Minimize2, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ARGlasses3DPage() {
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  
  // Simulation state
  const [scenario, setScenario] = useState('clear')
  const [mode, setMode] = useState('navigation')
  const [distressState, setDistressState] = useState('safe')
  const [hazardCount, setHazardCount] = useState(0)
  const [safeZoneDistance, setSafeZoneDistance] = useState(null)
  const [guidanceMessage, setGuidanceMessage] = useState('Path is clear. Continue forward.')
  const [guardianNotified, setGuardianNotified] = useState(false)
  
  const handleScenarioChange = (data) => {
    setScenario(data.scenario)
    setHazardCount(data.hazardCount)
    setSafeZoneDistance(data.safeZoneDistance)
    setGuidanceMessage(data.guidanceMessage)
    
    // Auto-adjust distress based on hazards
    if (data.hazardCount >= 3) {
      setDistressState('distress')
    } else if (data.hazardCount >= 1) {
      setDistressState('warning')
    } else {
      setDistressState('safe')
    }
  }
  
  const handleModeChange = (newMode) => {
    setMode(newMode)
    
    // Update guidance message based on mode
    if (newMode === 'emergency') {
      setGuidanceMessage('🚨 Emergency services have been contacted. Help is on the way.')
      setGuardianNotified(true)
    } else if (newMode === 'distress') {
      setGuidanceMessage('⚠️ Distress detected. Guardian has been notified.')
      setGuardianNotified(true)
    } else if (newMode === 'navigation') {
      setGuidanceMessage('Continue straight. Safe Zone ahead.')
    } else if (newMode === 'hazard') {
      setGuidanceMessage('Hazard detection active. Stay alert.')
    }
  }
  
  const handleDistressChange = (newState) => {
    setDistressState(newState)
    
    // Update mode based on distress
    if (newState === 'emergency') {
      setMode('emergency')
      setGuardianNotified(true)
    } else if (newState === 'distress') {
      setMode('distress')
      setGuardianNotified(true)
    }
  }
  
  const handleGuardianNotify = () => {
    setGuardianNotified(true)
    setGuidanceMessage('Guardian has been notified of your location and status.')
    
    // Auto-reset after 3 seconds
    setTimeout(() => {
      setGuardianNotified(false)
    }, 3000)
  }
  
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
  
  // Auto-hide info after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfo(false)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="min-h-screen bg-black">
      {!isFullscreen && <Navbar variant="user" />}
      
      <div className="relative" style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 64px)' }}>
        {/* Back button (not in fullscreen) */}
        {!isFullscreen && (
          <button
            onClick={() => router.push('/')}
            className="absolute top-4 left-4 z-40 bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        
        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-40 bg-black/80 hover:bg-black text-white p-2 rounded-lg"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        
        {/* Info panel */}
        {showInfo && !isFullscreen && (
          <div className="absolute top-20 left-4 right-4 md:left-auto md:right-auto md:left-1/2 md:transform md:-translate-x-1/2 z-40 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg max-w-2xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">3D AR Glasses Simulation</h3>
                <p className="text-sm text-white/80 mb-3">
                  This simulation demonstrates how NeuroLens Guardian would work through smart AR glasses. 
                  Use the demo controls to explore different safety scenarios.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowInfo(false)}
                    className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 3D Scene */}
        <ARGlasses3DScene
          mode={mode}
          distressState={distressState}
          scenario={scenario}
          hazardCount={hazardCount}
          safeZoneDistance={safeZoneDistance}
          guidanceMessage={guidanceMessage}
          guardianNotified={guardianNotified}
          enableControls={false}
        />
        
        {/* Demo Controls */}
        <ARGlassesControls
          onScenarioChange={handleScenarioChange}
          onModeChange={handleModeChange}
          onDistressChange={handleDistressChange}
          onGuardianNotify={handleGuardianNotify}
          currentScenario={scenario}
          currentMode={mode}
          currentDistress={distressState}
        />
      </div>
    </div>
  )
}
