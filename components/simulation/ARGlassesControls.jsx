'use client'

/**
 * Demo Scenario Controls for 3D AR Glasses Simulation
 * Allows easy demonstration of different safety scenarios
 */

import { useState } from 'react'
import { 
  Car, Users, AlertTriangle, CheckCircle, 
  Navigation, Shield, Phone, MessageSquare,
  Play, Pause, RotateCcw
} from 'lucide-react'

export default function ARGlassesControls({ 
  onScenarioChange,
  onModeChange,
  onDistressChange,
  onGuardianNotify,
  currentScenario = 'clear',
  currentMode = 'navigation',
  currentDistress = 'safe'
}) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [showControls, setShowControls] = useState(true)
  
  const scenarios = [
    { 
      id: 'clear', 
      label: 'Clear Path', 
      icon: CheckCircle, 
      color: 'bg-green-500',
      hazards: 0,
      distance: null,
      message: 'Path is clear. Continue forward.'
    },
    { 
      id: 'vehicle', 
      label: 'Vehicle Ahead', 
      icon: Car, 
      color: 'bg-red-500',
      hazards: 1,
      distance: 150,
      message: 'Vehicle detected ahead. Proceed with caution.'
    },
    { 
      id: 'obstacle-left', 
      label: 'Obstacle Left', 
      icon: AlertTriangle, 
      color: 'bg-yellow-500',
      hazards: 1,
      distance: 150,
      message: 'Pedestrian on your left. Stay alert.'
    },
    { 
      id: 'obstacle-right', 
      label: 'Obstacle Right', 
      icon: AlertTriangle, 
      color: 'bg-yellow-500',
      hazards: 1,
      distance: 150,
      message: 'Pedestrian on your right. Stay alert.'
    },
    { 
      id: 'crowded', 
      label: 'Crowded Path', 
      icon: Users, 
      color: 'bg-orange-500',
      hazards: 4,
      distance: 150,
      message: 'Multiple hazards detected. Consider alternate route.'
    },
    { 
      id: 'safe-zone', 
      label: 'Safe Zone Guidance', 
      icon: Navigation, 
      color: 'bg-blue-500',
      hazards: 0,
      distance: 150,
      message: 'Safe Zone ahead. Continue straight for 150 meters.'
    }
  ]
  
  const modes = [
    { id: 'navigation', label: 'Navigation', icon: Navigation, color: 'bg-blue-500' },
    { id: 'hazard', label: 'Hazard Detection', icon: AlertTriangle, color: 'bg-yellow-500' },
    { id: 'distress', label: 'Distress', icon: Shield, color: 'bg-orange-500' },
    { id: 'emergency', label: 'Emergency', icon: Phone, color: 'bg-red-500' }
  ]
  
  const distressStates = [
    { id: 'safe', label: 'Safe', color: 'bg-green-500' },
    { id: 'warning', label: 'Warning', color: 'bg-yellow-500' },
    { id: 'distress', label: 'Distress', color: 'bg-orange-500' },
    { id: 'emergency', label: 'Emergency', color: 'bg-red-500' }
  ]
  
  const handleScenarioClick = (scenario) => {
    const scenarioData = scenarios.find(s => s.id === scenario.id)
    if (onScenarioChange) {
      onScenarioChange({
        scenario: scenario.id,
        hazardCount: scenarioData.hazards,
        safeZoneDistance: scenarioData.distance,
        guidanceMessage: scenarioData.message
      })
    }
  }
  
  const handleModeClick = (mode) => {
    if (onModeChange) {
      onModeChange(mode.id)
    }
  }
  
  const handleDistressClick = (state) => {
    if (onDistressChange) {
      onDistressChange(state.id)
    }
  }
  
  const handleGuardianClick = () => {
    if (onGuardianNotify) {
      onGuardianNotify()
    }
  }
  
  const handleReset = () => {
    handleScenarioClick(scenarios[0])
    handleModeClick(modes[0])
    handleDistressClick(distressStates[0])
  }
  
  if (!showControls) {
    return (
      <button
        onClick={() => setShowControls(true)}
        className="fixed bottom-4 right-4 bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium z-50"
      >
        Show Controls
      </button>
    )
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl max-w-md z-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/20">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Play className="w-4 h-4" />
          Demo Controls
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1 hover:bg-white/10 rounded"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowControls(false)}
            className="p-1 hover:bg-white/10 rounded"
            title="Hide"
          >
            ×
          </button>
        </div>
      </div>
      
      {/* Scenarios */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-white/70 mb-2 block">SCENARIOS</label>
        <div className="grid grid-cols-2 gap-2">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon
            const isActive = currentScenario === scenario.id
            return (
              <button
                key={scenario.id}
                onClick={() => handleScenarioClick(scenario)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-all ${
                  isActive 
                    ? `${scenario.color} text-white` 
                    : 'bg-white/10 hover:bg-white/20 text-white/80'
                }`}
              >
                <Icon className="w-3 h-3" />
                {scenario.label}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Modes */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-white/70 mb-2 block">MODE</label>
        <div className="grid grid-cols-2 gap-2">
          {modes.map((mode) => {
            const Icon = mode.icon
            const isActive = currentMode === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => handleModeClick(mode)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-all ${
                  isActive 
                    ? `${mode.color} text-white` 
                    : 'bg-white/10 hover:bg-white/20 text-white/80'
                }`}
              >
                <Icon className="w-3 h-3" />
                {mode.label}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Distress States */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-white/70 mb-2 block">DISTRESS STATE</label>
        <div className="grid grid-cols-2 gap-2">
          {distressStates.map((state) => {
            const isActive = currentDistress === state.id
            return (
              <button
                key={state.id}
                onClick={() => handleDistressClick(state)}
                className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                  isActive 
                    ? `${state.color} text-white` 
                    : 'bg-white/10 hover:bg-white/20 text-white/80'
                }`}
              >
                {state.label}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Actions */}
      <div>
        <label className="text-xs font-semibold text-white/70 mb-2 block">ACTIONS</label>
        <button
          onClick={handleGuardianClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded text-sm font-medium transition-all"
        >
          <Phone className="w-4 h-4" />
          Notify Guardian
        </button>
      </div>
      
      {/* Info */}
      <div className="mt-4 pt-3 border-t border-white/20">
        <p className="text-xs text-white/50">
          Use these controls to demonstrate different safety scenarios during your demo.
        </p>
      </div>
    </div>
  )
}
