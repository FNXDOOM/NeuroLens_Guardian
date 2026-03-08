'use client'

import { X, AlertTriangle, MapPin, Eye, Clock, Car, Phone, Navigation } from 'lucide-react'

interface CaregiverAlertDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  alert: {
    id: string
    type: string
    severity: string
    title: string
    description: string
    timestamp: Date
    acknowledged?: boolean
  }
  userLocation?: { lat: number; lng: number } | null
  nearestSafeZone?: { name: string; distance: number; address: string } | null
  latestGuidance?: string
  onAcknowledge?: () => void
  onRouteToSafeZone?: () => void
  onTriggerSafeRide?: () => void
  onEscalate?: () => void
}

export function CaregiverAlertDetailPanel({
  isOpen,
  onClose,
  alert,
  userLocation,
  nearestSafeZone,
  latestGuidance = 'No guidance available',
  onAcknowledge,
  onRouteToSafeZone,
  onTriggerSafeRide,
  onEscalate,
}: CaregiverAlertDetailPanelProps) {
  if (!isOpen) return null

  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'danger':
      case 'critical':
      case 'high':
        return 'text-destructive'
      case 'warning':
      case 'medium':
        return 'text-warning'
      default:
        return 'text-primary'
    }
  }

  const getSeverityBg = () => {
    switch (alert.severity) {
      case 'danger':
      case 'critical':
      case 'high':
        return 'bg-destructive/10 border-destructive/20'
      case 'warning':
      case 'medium':
        return 'bg-warning/10 border-warning/20'
      default:
        return 'bg-primary/10 border-primary/20'
    }
  }

  const getRecommendedAction = () => {
    switch (alert.type) {
      case 'hazard':
        return 'Monitor user movement and provide guidance if needed'
      case 'distress':
        return 'Route user to nearest Safe Zone or contact guardian'
      case 'safe_ride':
        return 'Monitor ride progress and ensure safe arrival'
      default:
        return 'Monitor situation and take action if needed'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border w-full sm:max-w-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-5 sm:zoom-in-95">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-border ${getSeverityBg()}`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-6 h-6 ${getSeverityColor()}`} />
            <div>
              <h2 className="text-xl font-bold text-foreground">Alert Details</h2>
              <p className="text-xs text-muted-foreground capitalize">{alert.type} • {alert.severity}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Alert Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">{alert.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{alert.timestamp.toLocaleString()}</span>
            </div>
          </div>

          {/* Current Location */}
          {userLocation && (
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">Current Location</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
              </p>
            </div>
          )}

          {/* Nearest Safe Zone */}
          {nearestSafeZone && (
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">Nearest Safe Zone</h4>
              </div>
              <p className="text-sm font-medium text-foreground">{nearestSafeZone.name}</p>
              <p className="text-xs text-muted-foreground">{nearestSafeZone.address}</p>
              <p className="text-xs text-primary mt-1">
                {(nearestSafeZone.distance / 1000).toFixed(2)} km away
              </p>
            </div>
          )}

          {/* Latest Guidance */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-foreground">AI Guidance to User</h4>
            </div>
            <p className="text-sm text-muted-foreground italic">"{latestGuidance}"</p>
          </div>

          {/* Recommended Action */}
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold text-sm text-foreground mb-2">Recommended Action</h4>
            <p className="text-sm text-muted-foreground">{getRecommendedAction()}</p>
          </div>
        </div>

        {/* Footer - Actions */}
        <div className="border-t border-border p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {!alert.acknowledged && onAcknowledge && (
              <button
                onClick={onAcknowledge}
                className="bg-primary text-primary-foreground hover:opacity-90 font-semibold py-2 px-4 rounded-lg transition-all text-sm"
              >
                Acknowledge
              </button>
            )}
            {onRouteToSafeZone && nearestSafeZone && (
              <button
                onClick={onRouteToSafeZone}
                className="bg-secondary text-secondary-foreground hover:opacity-90 font-semibold py-2 px-4 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Route to Safe Zone
              </button>
            )}
            {onTriggerSafeRide && (
              <button
                onClick={onTriggerSafeRide}
                className="bg-secondary text-secondary-foreground hover:opacity-90 font-semibold py-2 px-4 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4" />
                Request Safe Ride
              </button>
            )}
            {onEscalate && (
              <button
                onClick={onEscalate}
                className="bg-destructive text-destructive-foreground hover:opacity-90 font-semibold py-2 px-4 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Escalate Emergency
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
