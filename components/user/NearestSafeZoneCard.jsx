/**
 * Nearest Safe Zone Card Component
 * 
 * Displays dynamic nearest Safe Zone based on live location.
 * Updates in real-time as user location changes.
 * 
 * @module components/user/NearestSafeZoneCard
 */

'use client'

import { SafeZoneCard } from '@/components/neurolens/safe-zone-card'
import { MapPin, Loader2 } from 'lucide-react'

export default function NearestSafeZoneCard({
  nearestSafeZone = null,
  isCalculating = false,
  locationAvailable = true,
  onRouteToSafeZone = null,
  isLoadingRoute = false,
  formatDistance = (distance) => `${Math.round(distance)}m`,
}) {
  /**
   * Loading state
   */
  if (isCalculating) {
    return (
      <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Calculating nearest Safe Zone...</p>
        </div>
      </div>
    )
  }

  /**
   * Location not available
   */
  if (!locationAvailable) {
    return (
      <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MapPin className="w-8 h-8 text-muted-foreground mb-4" />
          <p className="text-sm font-medium text-foreground mb-2">Location Required</p>
          <p className="text-xs text-muted-foreground">
            Enable location services to find nearby Safe Zones
          </p>
        </div>
      </div>
    )
  }

  /**
   * No Safe Zone found
   */
  if (!nearestSafeZone) {
    return (
      <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MapPin className="w-8 h-8 text-muted-foreground mb-4" />
          <p className="text-sm font-medium text-foreground mb-2">No Safe Zones Nearby</p>
          <p className="text-xs text-muted-foreground">
            Safe Zones will appear when you're within range
          </p>
        </div>
      </div>
    )
  }

  /**
   * Display Safe Zone
   */
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Nearest Safe Zone</h2>
        {onRouteToSafeZone && (
          <button
            onClick={onRouteToSafeZone}
            disabled={isLoadingRoute}
            className="text-xs text-primary hover:text-primary/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingRoute ? 'Loading...' : 'Route Here'}
          </button>
        )}
      </div>
      
      <SafeZoneCard
        name={nearestSafeZone.name}
        distance={formatDistance(nearestSafeZone.distance)}
        address={nearestSafeZone.address}
        isNearest={true}
        amenities={nearestSafeZone.amenities?.slice(0, 4) || []}
        supportType={nearestSafeZone.supportType}
        isOpen={nearestSafeZone.isOpen}
      />
      
      {/* Additional Info */}
      {nearestSafeZone.distance && (
        <div className="mt-3 text-xs text-muted-foreground text-center">
          {nearestSafeZone.distance < 500 ? (
            <span className="text-green-500">✓ Within walking distance</span>
          ) : nearestSafeZone.distance < 1000 ? (
            <span className="text-blue-500">Short walk away</span>
          ) : (
            <span>Consider transportation</span>
          )}
        </div>
      )}
    </div>
  )
}
