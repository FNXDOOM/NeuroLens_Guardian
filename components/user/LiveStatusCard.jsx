/**
 * Live Status Card Component
 * 
 * Displays dynamic current status based on live application state.
 * Updates in real-time based on distress engine, navigation, and hazard detection.
 * 
 * @module components/user/LiveStatusCard
 */

'use client'

import { StatusBadge } from '@/components/neurolens/status-badge'
import { AlertCircle, Navigation, Shield, Phone, MapPin } from 'lucide-react'

export default function LiveStatusCard({
  status = 'safe',
  statusReason = null,
  distressLevel = 0,
  userMessage = null,
  isNavigating = false,
  destination = null,
  latestHazard = null,
  transitState = null,
  guardianNotified = false,
  safeRideActive = false,
  manualSOS = false,
  onClearSOS = null,
}) {
  /**
   * Get status subtitle based on current state
   */
  const getStatusSubtitle = () => {
    // Emergency
    if (status === 'emergency') {
      return '🚨 Emergency services contacted • Guardian notified'
    }
    
    // Distress
    if (status === 'distress') {
      if (guardianNotified) {
        return '⚠️ Guardian notified • Assistance available'
      }
      return '⚠️ Assistance needed • Help is available'
    }
    
    // Safe Zone Routing
    if (status === 'safe_zone_routing') {
      return `🎯 Routing to Safe Zone${destination ? ` • ${destination.name}` : ''}`
    }
    
    // Transit states
    if (transitState) {
      const transitMessages = {
        walking_to_stop: '🚶 Walking to bus stop',
        waiting_for_bus: '⏳ Waiting for bus',
        bus_identified: '🚌 Bus identified • Ready to board',
        boarding: '🚌 Boarding bus',
        in_transit: '🚌 In transit',
        prepare_to_exit: '🔔 Prepare to exit',
      }
      return transitMessages[transitState] || '🚌 Transit mode active'
    }
    
    // Warning
    if (status === 'warning') {
      if (latestHazard) {
        return `⚡ ${latestHazard.class} detected • Stay alert`
      }
      if (isNavigating) {
        return '⚡ Warning • Continue with caution'
      }
      return '⚡ Attention needed • Stay aware'
    }
    
    // Navigating
    if (status === 'navigating' || isNavigating) {
      if (destination) {
        return `🧭 On route to ${destination.name || 'destination'}`
      }
      return '🧭 Navigation active • Clear path'
    }
    
    // Safe (default)
    if (statusReason) {
      return statusReason
    }
    return 'All systems monitoring • Continue with confidence'
  }

  /**
   * Get status icon
   */
  const getStatusIcon = () => {
    if (status === 'emergency') return Phone
    if (status === 'distress') return Shield
    if (status === 'safe_zone_routing') return MapPin
    if (isNavigating) return Navigation
    return AlertCircle
  }

  const StatusIcon = getStatusIcon()

  return (
    <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-muted-foreground">Current Status</h3>
        {guardianNotified && (
          <span className="text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full border border-purple-500/20">
            Guardian Notified
          </span>
        )}
        {safeRideActive && (
          <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full border border-blue-500/20">
            Safe Ride Active
          </span>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <StatusBadge 
          status={status}
          size="lg" 
        />
        
        {/* Subtitle */}
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <StatusIcon className="w-4 h-4" />
          <p>{getStatusSubtitle()}</p>
        </div>
      </div>

      {/* Alert Level Progress */}
      {distressLevel > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Alert Level</span>
            <span className="font-medium">{distressLevel}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                distressLevel >= 75
                  ? 'bg-red-500'
                  : distressLevel >= 50
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${distressLevel}%` }}
            />
          </div>
        </div>
      )}

      {/* User Message */}
      {userMessage && distressLevel >= 50 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div
            className={`rounded-lg p-4 ${
              status === 'emergency'
                ? 'bg-red-500/10 border border-red-500/20'
                : status === 'distress'
                ? 'bg-orange-500/10 border border-orange-500/20'
                : 'bg-yellow-500/10 border border-yellow-500/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  status === 'emergency'
                    ? 'text-red-500'
                    : status === 'distress'
                    ? 'text-orange-500'
                    : 'text-yellow-500'
                }`}
              />
              <div className="flex-1">
                <p className="text-sm text-foreground">{userMessage}</p>
                {manualSOS && onClearSOS && (
                  <button
                    onClick={onClearSOS}
                    className="mt-2 text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Cancel Emergency
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Journey Mode Indicator */}
      {(isNavigating || transitState) && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>
              {transitState ? 'Transit Mode Active' : 'Navigation Active'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
