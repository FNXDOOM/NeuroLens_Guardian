'use client'

/**
 * ARGlassesSimulation Component
 * 
 * Visual simulation of AR smart glasses HUD for NeuroLens Guardian.
 * Demonstrates how the assistive mobility system would work on wearable AR glasses.
 * 
 * Features:
 * - Transparent HUD overlay
 * - Directional navigation arrows
 * - Hazard detection overlays
 * - Safe Zone markers
 * - AI assistant guidance
 * - Status indicators
 * - Demo controls for presentations
 * 
 * @component
 */

import { useState, useEffect, useRef } from 'react'
import {
  Navigation,
  MapPin,
  Radio,
  Camera,
  Volume2,
  Shield,
  AlertTriangle,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Phone,
  Users,
  Zap,
  Eye,
  Activity,
  Target,
  ChevronRight,
} from 'lucide-react'

// Simulation modes
const SIMULATION_MODES = {
  NAVIGATION: 'navigation',
  HAZARD: 'hazard',
  DISTRESS: 'distress',
  EMERGENCY: 'emergency',
}

/**
 * ARGlassesSimulation Component
 * @param {Object} props
 * @param {Object} props.distressEngine - Distress engine state
 * @param {Object} props.latestHazard - Latest hazard detection
 * @param {Array} props.recentDetections - Recent detections
 * @param {Object} props.nearestSafeZone - Nearest Safe Zone
 * @param {Object} props.routeInfo - Route information
 * @param {boolean} props.isNavigating - Navigation active
 * @param {string} props.guidanceMessage - AI guidance message
 * @param {boolean} props.showDemoControls - Show demo controls
 */
export default function ARGlassesSimulation({
  distressEngine = null,
  latestHazard = null,
  recentDetections = [],
  nearestSafeZone = null,
  routeInfo = null,
  isNavigating = false,
  guidanceMessage = 'All clear. Continue with confidence.',
  showDemoControls = true,
}) {
  // Simulation state
  const [mode, setMode] = useState(SIMULATION_MODES.NAVIGATION)
  const [demoHazard, setDemoHazard] = useState(null)
  const [demoDirection, setDemoDirection] = useState('forward')
  const [showSafeZoneMarker, setShowSafeZoneMarker] = useState(false)
  const [guardianNotified, setGuardianNotified] = useState(false)
  const [safeRideActive, setSafeRideActive] = useState(false)

  // Determine mode from distress engine
  useEffect(() => {
    if (!distressEngine) return

    if (distressEngine.status === 'emergency') {
      setMode(SIMULATION_MODES.EMERGENCY)
      setGuardianNotified(true)
    } else if (distressEngine.status === 'distress') {
      setMode(SIMULATION_MODES.DISTRESS)
      setShowSafeZoneMarker(true)
    } else if (distressEngine.status === 'warning' || latestHazard?.severity === 'danger') {
      setMode(SIMULATION_MODES.HAZARD)
    } else {
      setMode(SIMULATION_MODES.NAVIGATION)
    }
  }, [distressEngine, latestHazard])

  // Determine navigation direction based on hazards
  useEffect(() => {
    if (latestHazard?.severity === 'danger') {
      setDemoDirection('left') // Move away from danger
    } else if (latestHazard?.severity === 'caution') {
      setDemoDirection('forward-caution')
    } else {
      setDemoDirection('forward')
    }
  }, [latestHazard])

  // Demo control handlers
  const simulateVehicleHazard = () => {
    setDemoHazard({ type: 'vehicle', severity: 'danger', class: 'car' })
    setTimeout(() => setDemoHazard(null), 5000)
  }

  const simulateObstacleHazard = () => {
    setDemoHazard({ type: 'obstacle', severity: 'caution', class: 'chair' })
    setTimeout(() => setDemoHazard(null), 5000)
  }

  const simulateDistress = () => {
    setMode(SIMULATION_MODES.DISTRESS)
    setShowSafeZoneMarker(true)
    setTimeout(() => setMode(SIMULATION_MODES.NAVIGATION), 8000)
  }

  const simulateEmergency = () => {
    setMode(SIMULATION_MODES.EMERGENCY)
    setGuardianNotified(true)
    setTimeout(() => {
      setMode(SIMULATION_MODES.NAVIGATION)
      setGuardianNotified(false)
    }, 10000)
  }

  const simulateSafeZone = () => {
    setShowSafeZoneMarker(true)
    setTimeout(() => setShowSafeZoneMarker(false), 8000)
  }

  const simulateSafeRide = () => {
    setSafeRideActive(true)
    setTimeout(() => setSafeRideActive(false), 8000)
  }

  // Get active hazard (demo or real)
  const activeHazard = demoHazard || latestHazard

  // Get mode color
  const getModeColor = () => {
    switch (mode) {
      case SIMULATION_MODES.EMERGENCY:
        return 'from-red-500/20 to-red-600/10'
      case SIMULATION_MODES.DISTRESS:
        return 'from-orange-500/20 to-orange-600/10'
      case SIMULATION_MODES.HAZARD:
        return 'from-yellow-500/20 to-yellow-600/10'
      default:
        return 'from-blue-500/10 to-purple-600/10'
    }
  }

  // Get mode badge
  const getModeBadge = () => {
    switch (mode) {
      case SIMULATION_MODES.EMERGENCY:
        return { label: 'EMERGENCY', color: 'bg-red-500', icon: Phone }
      case SIMULATION_MODES.DISTRESS:
        return { label: 'ASSISTANCE', color: 'bg-orange-500', icon: AlertTriangle }
      case SIMULATION_MODES.HAZARD:
        return { label: 'CAUTION', color: 'bg-yellow-500', icon: Shield }
      default:
        return { label: 'NAVIGATION', color: 'bg-blue-500', icon: Navigation }
    }
  }

  const modeBadge = getModeBadge()
  const ModeBadgeIcon = modeBadge.icon

  return (
    <div className="relative w-full bg-black rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {/* Background - simulated camera view or scene */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getModeColor()}`}>
        {/* Simulated scene background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-transparent to-gray-800/40" />
          {/* Simulated street/path */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-700/30 to-transparent" />
        </div>
      </div>

      {/* AR Glasses HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Status Strip */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            {/* Left: Mode Badge */}
            <div className={`${modeBadge.color} text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg`}>
              <ModeBadgeIcon className="w-4 h-4" />
              <span className="text-sm font-bold">{modeBadge.label}</span>
            </div>

            {/* Right: System Status Indicators */}
            <div className="flex items-center gap-3">
              <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2">
                <Radio className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-xs text-white font-medium">GPS</span>
              </div>
              <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white font-medium">AR</span>
              </div>
              <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-white font-medium">Audio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Central Field of View - Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-center">
          {mode === SIMULATION_MODES.EMERGENCY ? (
            // Emergency: Large alert
            <div className="text-center">
              <div className="bg-red-500/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-red-400 animate-pulse">
                <Phone className="w-16 h-16 text-white mx-auto mb-4" />
                <p className="text-3xl font-bold text-white mb-2">EMERGENCY ACTIVE</p>
                <p className="text-lg text-white/90">Help is on the way</p>
              </div>
            </div>
          ) : mode === SIMULATION_MODES.DISTRESS ? (
            // Distress: Safe Zone guidance
            <div className="text-center">
              <div className="bg-orange-500/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
                <MapPin className="w-12 h-12 text-white mx-auto mb-3" />
                <p className="text-2xl font-bold text-white mb-2">Safe Zone Ahead</p>
                <p className="text-lg text-white/90">
                  {nearestSafeZone ? `${Math.round(nearestSafeZone.distance)}m` : '250m'}
                </p>
              </div>
              <div className="mt-6">
                <ArrowUp className="w-20 h-20 text-white mx-auto animate-bounce drop-shadow-lg" strokeWidth={3} />
              </div>
            </div>
          ) : demoDirection === 'left' ? (
            // Hazard: Move left
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-4 drop-shadow-lg">Move Left</p>
              <ArrowLeft className="w-24 h-24 text-yellow-400 mx-auto animate-pulse drop-shadow-lg" strokeWidth={3} />
            </div>
          ) : demoDirection === 'right' ? (
            // Hazard: Move right
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-4 drop-shadow-lg">Move Right</p>
              <ArrowRight className="w-24 h-24 text-yellow-400 mx-auto animate-pulse drop-shadow-lg" strokeWidth={3} />
            </div>
          ) : demoDirection === 'forward-caution' ? (
            // Caution: Continue carefully
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-4 drop-shadow-lg">Proceed with Caution</p>
              <ArrowUp className="w-20 h-20 text-yellow-400 mx-auto drop-shadow-lg" strokeWidth={3} />
            </div>
          ) : (
            // Navigation: Continue forward
            <div className="text-center">
              {isNavigating && routeInfo && (
                <>
                  <p className="text-lg font-semibold text-white/90 mb-2 drop-shadow-lg">
                    {routeInfo.destination}
                  </p>
                  <p className="text-sm text-white/70 mb-4 drop-shadow-lg">
                    {routeInfo.distance ? `${Math.round(routeInfo.distance)}m` : '350m'} • {routeInfo.duration ? `${Math.round(routeInfo.duration / 60)} min` : '5 min'}
                  </p>
                </>
              )}
              <ArrowUp className="w-16 h-16 text-blue-400 mx-auto drop-shadow-lg" strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Hazard Detection Overlays */}
        {activeHazard && (
          <div className="absolute top-1/3 left-1/4 right-1/4">
            <div
              className={`p-4 rounded-xl backdrop-blur-sm border-2 ${
                activeHazard.severity === 'danger'
                  ? 'bg-red-500/80 border-red-400'
                  : 'bg-yellow-500/80 border-yellow-400'
              } shadow-xl animate-pulse`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-white" />
                <div>
                  <p className="text-white font-bold text-lg">
                    {activeHazard.class || 'Hazard'} Detected
                  </p>
                  <p className="text-white/90 text-sm">
                    {activeHazard.severity === 'danger' ? 'Move away' : 'Stay aware'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Safe Zone Marker */}
        {(showSafeZoneMarker || mode === SIMULATION_MODES.DISTRESS) && nearestSafeZone && (
          <div className="absolute top-1/4 right-8">
            <div className="bg-green-500/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border-2 border-green-400">
              <MapPin className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white font-bold text-center text-sm">{nearestSafeZone.name}</p>
              <p className="text-white/90 text-center text-xs mt-1">
                {Math.round(nearestSafeZone.distance)}m →
              </p>
            </div>
          </div>
        )}

        {/* Right Side Info Widgets */}
        <div className="absolute right-4 top-1/3 space-y-3">
          {/* Nearest Safe Zone */}
          {nearestSafeZone && !showSafeZoneMarker && mode !== SIMULATION_MODES.DISTRESS && (
            <div className="bg-black/70 backdrop-blur-sm p-3 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-xs text-white font-semibold">Safe Zone</span>
              </div>
              <p className="text-white text-sm">{Math.round(nearestSafeZone.distance)}m</p>
            </div>
          )}

          {/* Distress Level */}
          {distressEngine && distressEngine.distressLevel > 0 && (
            <div className="bg-black/70 backdrop-blur-sm p-3 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-white font-semibold">Alert</span>
              </div>
              <p className="text-white text-sm">{distressEngine.distressLevel}%</p>
            </div>
          )}

          {/* Guardian Status */}
          {guardianNotified && (
            <div className="bg-black/70 backdrop-blur-sm p-3 rounded-xl border border-green-400 animate-pulse">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-xs text-white font-semibold">Guardian</span>
              </div>
              <p className="text-green-400 text-xs">Notified</p>
            </div>
          )}

          {/* Safe Ride Status */}
          {safeRideActive && (
            <div className="bg-black/70 backdrop-blur-sm p-3 rounded-xl border border-blue-400">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white font-semibold">Safe Ride</span>
              </div>
              <p className="text-blue-400 text-xs">Requested</p>
            </div>
          )}
        </div>

        {/* Bottom Assistant Message Strip */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="bg-purple-500 p-2 rounded-full flex-shrink-0">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm mb-1">NeuroLens Assistant</p>
                <p className="text-white/90 text-sm leading-relaxed">
                  {distressEngine?.userMessage || guidanceMessage}
                </p>
              </div>
              {mode === SIMULATION_MODES.EMERGENCY && (
                <div className="flex-shrink-0">
                  <div className="bg-red-500 px-3 py-1 rounded-full">
                    <span className="text-white text-xs font-bold">LIVE</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detection Count Badge */}
        {recentDetections.length > 0 && (
          <div className="absolute bottom-24 right-4">
            <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-semibold">
                  {recentDetections.length} detected
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo Controls */}
      {showDemoControls && (
        <div className="absolute top-4 left-4 pointer-events-auto">
          <details className="bg-black/90 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <summary className="px-4 py-2 text-white text-xs font-semibold cursor-pointer hover:bg-white/10 transition-colors">
              Demo Controls
            </summary>
            <div className="p-3 space-y-2 border-t border-white/10">
              <button
                onClick={simulateVehicleHazard}
                className="w-full px-3 py-2 bg-red-500/80 hover:bg-red-500 text-white text-xs rounded-lg transition-colors"
              >
                Vehicle Hazard
              </button>
              <button
                onClick={simulateObstacleHazard}
                className="w-full px-3 py-2 bg-yellow-500/80 hover:bg-yellow-500 text-white text-xs rounded-lg transition-colors"
              >
                Obstacle Hazard
              </button>
              <button
                onClick={simulateDistress}
                className="w-full px-3 py-2 bg-orange-500/80 hover:bg-orange-500 text-white text-xs rounded-lg transition-colors"
              >
                Distress Mode
              </button>
              <button
                onClick={simulateEmergency}
                className="w-full px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs rounded-lg transition-colors"
              >
                Emergency Mode
              </button>
              <button
                onClick={simulateSafeZone}
                className="w-full px-3 py-2 bg-green-500/80 hover:bg-green-500 text-white text-xs rounded-lg transition-colors"
              >
                Safe Zone Guide
              </button>
              <button
                onClick={simulateSafeRide}
                className="w-full px-3 py-2 bg-blue-500/80 hover:bg-blue-500 text-white text-xs rounded-lg transition-colors"
              >
                Safe Ride
              </button>
            </div>
          </details>
        </div>
      )}

      {/* AR Glasses Frame Overlay (optional visual) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle frame edges */}
        <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-white/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-l from-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r from-white/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-white/20 to-transparent" />
      </div>
    </div>
  )
}
