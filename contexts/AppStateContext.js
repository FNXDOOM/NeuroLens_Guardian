/**
 * AppStateContext
 * 
 * Shared application state context that can be consumed by
 * both the main dashboard and the 3D simulation.
 * 
 * @module contexts/AppStateContext
 */

'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AppStateContext = createContext(null)

export function AppStateProvider({ children, initialState = {} }) {
  const [appState, setAppState] = useState({
    // Location & Navigation
    userLocation: initialState.userLocation || { lat: 40.758000, lng: -73.985500 },
    destination: initialState.destination || null,
    route: initialState.route || [],
    routeInfo: initialState.routeInfo || null,
    isNavigating: initialState.isNavigating || false,
    
    // Hazard Detection
    latestHazard: initialState.latestHazard || null,
    recentDetections: initialState.recentDetections || [],
    
    // Distress Engine
    distressStatus: initialState.distressStatus || 'safe',
    distressReason: initialState.distressReason || null,
    distressLevel: initialState.distressLevel || 0,
    distressMessage: initialState.distressMessage || null,
    
    // Safe Zones
    nearestSafeZone: initialState.nearestSafeZone || null,
    nearbySafeZones: initialState.nearbySafeZones || [],
    
    // Guardian & Emergency
    guardianNotified: initialState.guardianNotified || false,
    isEmergency: initialState.isEmergency || false,
    manualSOS: initialState.manualSOS || false,
    
    // Safe Ride
    safeRideActive: initialState.safeRideActive || false,
    safeRideStatus: initialState.safeRideStatus || null,
    
    // AI Guidance
    guidanceMessage: initialState.guidanceMessage || null,
    
    // Public Transport
    transitState: initialState.transitState || null,
    transitActive: initialState.transitActive || false,
    
    // Demo Mode
    demoMode: initialState.demoMode || null,
    demoScenario: initialState.demoScenario || null,
    
    // AR State
    isARActive: initialState.isARActive || false,
    arViewMode: initialState.arViewMode || 'camera',
    
    // Timestamp
    lastUpdate: Date.now(),
  })

  const updateAppState = (updates) => {
    setAppState(prev => ({
      ...prev,
      ...updates,
      lastUpdate: Date.now(),
    }))
  }

  const value = {
    appState,
    updateAppState,
  }

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}

export default AppStateContext
