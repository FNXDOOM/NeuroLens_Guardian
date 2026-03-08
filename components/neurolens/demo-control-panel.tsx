'use client'

/**
 * DemoControlPanel Component
 * 
 * Visual control panel for demo mode simulation.
 * Provides easy-to-use buttons for triggering demo scenarios.
 * 
 * @component
 */

import { useState } from 'react'
import {
  Play,
  Square,
  AlertTriangle,
  Car,
  Users,
  Navigation,
  Phone,
  MapPin,
  UserCheck,
  Zap,
  Trash2,
  ChevronDown,
  ChevronUp,
  Power,
  PlayCircle,
} from 'lucide-react'

interface DemoControlPanelProps {
  demoMode: any
  className?: string
  compact?: boolean
}

export function DemoControlPanel({ demoMode, className = '', compact = false }: DemoControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(!compact)

  if (!demoMode) return null

  const {
    isDemoMode,
    activeEvent,
    toggleDemoMode,
    simulateObstacle,
    simulateVehicle,
    simulateCrowdedPath,
    simulateRouteDeviation,
    simulateDistress,
    simulateEmergency,
    simulateSafeZoneRecommendation,
    simulateGuardianNotification,
    simulateSafeRideRequest,
    clearAll,
    runDemoSequence,
  } = demoMode

  return (
    <div className={`bg-card rounded-xl shadow-lg border border-border overflow-hidden ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-primary/5 border-b border-border cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDemoMode ? 'bg-green-500' : 'bg-gray-500'}`}>
            <Power className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Demo Control Panel</h3>
            <p className="text-xs text-muted-foreground">
              {isDemoMode ? 'Demo Mode Active' : 'Demo Mode Inactive'}
              {activeEvent && ` • ${activeEvent}`}
            </p>
          </div>
        </div>
        <button className="p-1 hover:bg-secondary rounded">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Controls */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Demo Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Demo Mode</span>
            </div>
            <button
              onClick={toggleDemoMode}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isDemoMode
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              {isDemoMode ? 'ON' : 'OFF'}
            </button>
          </div>

          {isDemoMode && (
            <>
              {/* Hazard Simulations */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  Hazard Simulations
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={simulateObstacle}
                    disabled={!!activeEvent}
                    className="flex items-center gap-2 p-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-medium text-foreground">Obstacle</span>
                  </button>
                  <button
                    onClick={simulateVehicle}
                    disabled={!!activeEvent}
                    className="flex items-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Car className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-medium text-foreground">Vehicle</span>
                  </button>
                  <button
                    onClick={simulateCrowdedPath}
                    disabled={!!activeEvent}
                    className="flex items-center gap-2 p-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed col-span-2"
                  >
                    <Users className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-foreground">Crowded Path</span>
                  </button>
                </div>
              </div>

              {/* Navigation Events */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  Navigation Events
                </h4>
                <button
                  onClick={simulateRouteDeviation}
                  disabled={!!activeEvent}
                  className="w-full flex items-center gap-2 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-foreground">Route Deviation</span>
                </button>
              </div>

              {/* Distress States */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  Distress States
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={simulateDistress}
                    disabled={!!activeEvent}
                    className="flex items-center gap-2 p-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-foreground">Distress</span>
                  </button>
                  <button
                    onClick={simulateEmergency}
                    disabled={!!activeEvent}
                    className="flex items-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Phone className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-medium text-foreground">Emergency</span>
                  </button>
                </div>
              </div>

              {/* Assistance Actions */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  Assistance Actions
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={simulateSafeZoneRecommendation}
                    disabled={!!activeEvent}
                    className="w-full flex items-center gap-2 p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-foreground">Safe Zone</span>
                  </button>
                  <button
                    onClick={simulateGuardianNotification}
                    disabled={!!activeEvent}
                    className="w-full flex items-center gap-2 p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-foreground">Guardian Alert</span>
                  </button>
                  <button
                    onClick={simulateSafeRideRequest}
                    disabled={!!activeEvent}
                    className="w-full flex items-center gap-2 p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-foreground">Safe Ride</span>
                  </button>
                </div>
              </div>

              {/* Sequence & Clear */}
              <div className="pt-2 border-t border-border space-y-2">
                <button
                  onClick={runDemoSequence}
                  disabled={!!activeEvent}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold">Run Full Sequence</span>
                </button>
                <button
                  onClick={clearAll}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-xs font-medium">Clear All</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default DemoControlPanel
