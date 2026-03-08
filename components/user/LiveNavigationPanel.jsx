/**
 * Live Navigation Panel Component
 * 
 * Displays dynamic navigation state instead of static placeholder.
 * Shows route info, ETA, distance, and current navigation status.
 * 
 * @module components/user/LiveNavigationPanel
 */

'use client'

import { Navigation, MapPin, Clock, Target, AlertCircle } from 'lucide-react'

export default function LiveNavigationPanel({
  isNavigating = false,
  destination = null,
  routeInfo = null,
  isLoadingRoute = false,
  userLocation = null,
  accuracy = null,
  transitState = null,
  formatETA = (seconds) => `${Math.round(seconds / 60)} min`,
  formatDistance = (meters) => `${(meters / 1000).toFixed(1)}km`,
}) {
  /**
   * Loading state
   */
  if (isLoadingRoute) {
    return (
      <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
        <h3 className="font-semibold text-lg text-foreground mb-4">Calculating Route...</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  /**
   * Active navigation
   */
  if (isNavigating && routeInfo && destination) {
    return (
      <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-foreground">Live Navigation</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-500 font-medium">Active</span>
          </div>
        </div>

        {/* Destination */}
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Destination</p>
              <p className="font-semibold text-foreground">{destination.name || 'Unknown'}</p>
              {destination.address && (
                <p className="text-xs text-muted-foreground mt-1">{destination.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="space-y-4">
          <div className="border-t border-border pt-4 flex gap-3">
            <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Estimated Time</p>
              <p className="font-medium text-foreground">{formatETA(routeInfo.duration)}</p>
            </div>
          </div>
          
          <div className="border-t border-border pt-4 flex gap-3">
            <Navigation className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="font-medium text-foreground">{formatDistance(routeInfo.distance)}</p>
            </div>
          </div>

          {/* Transit Mode Indicator */}
          {transitState && (
            <div className="border-t border-border pt-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Transit Mode</p>
                <p className="font-medium text-foreground capitalize">
                  {transitState.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Movement Status */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Tracking your movement</span>
          </div>
        </div>
      </div>
    )
  }

  /**
   * No active journey - show current location
   */
  return (
    <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
      <h3 className="font-semibold text-lg text-foreground mb-4">Current Location</h3>
      
      <div className="space-y-4">
        {/* Location Coordinates */}
        {userLocation && (
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Coordinates</p>
              <p className="font-medium text-foreground text-sm">
                {userLocation.lat?.toFixed(6)}, {userLocation.lng?.toFixed(6)}
              </p>
            </div>
          </div>
        )}

        {/* GPS Accuracy */}
        {accuracy && (
          <div className="border-t border-border pt-4 flex gap-3">
            <Target className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">GPS Accuracy</p>
              <p className="font-medium text-foreground">±{Math.round(accuracy)} meters</p>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>No active journey</span>
          </div>
        </div>
      </div>

      {/* Start Journey Prompt */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Start a journey to see live navigation
        </p>
      </div>
    </div>
  )
}
