'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/neurolens/navbar';
import ARGlassesSimulation from '@/components/detection/ARGlassesSimulation';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useDistressEngine } from '@/hooks/useDistressEngine';
import { findNearestSafeZone } from '@/data/safeZones';
import { TEST_USERS } from '@/constants/testUsers';
import {
  Glasses,
  Info,
  Sparkles,
  Eye,
  Navigation,
  Shield,
  Users,
  Zap,
} from 'lucide-react';

export default function ARGlassesPage() {
  // Location tracking
  const locationTracking = useLocationTracking({
    userId: TEST_USERS.JOHN,
    enableTracking: true,
    enableSync: false,
    syncInterval: 30000,
  });

  const { latitude, longitude, isTracking } = locationTracking;

  // User location state
  const [userLocation, setUserLocation] = useState({
    lng: -73.985500,
    lat: 40.758000,
  });

  // Update user location when GPS data changes
  useEffect(() => {
    if (latitude && longitude) {
      setUserLocation({
        lng: longitude,
        lat: latitude,
      });
    }
  }, [latitude, longitude]);

  // Find nearest Safe Zone
  const [nearestSafeZone, setNearestSafeZone] = useState(null);
  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      const nearest = findNearestSafeZone(userLocation.lat, userLocation.lng);
      setNearestSafeZone(nearest);
    }
  }, [userLocation]);

  // Simulation state
  const [latestHazard, setLatestHazard] = useState(null);
  const [recentDetections, setRecentDetections] = useState([]);
  const [manualSOS, setManualSOS] = useState(false);
  const [routeInfo, setRouteInfo] = useState({
    destination: 'Central Library',
    distance: 350,
    duration: 300,
  });

  // Distress Engine
  const distressEngine = useDistressEngine({
    currentLocation: userLocation,
    routeState: {
      isActive: true,
      coordinates: [],
      destination: { name: routeInfo.destination, isSafeZone: false },
    },
    idleTime: 0,
    deviationCount: 0,
    manualSOS,
    latestHazard: latestHazard as any,
    recentDetections,
    nearestSafeZone: nearestSafeZone as any,
  }) as any;

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navbar */}
      <Navbar variant="user" title="NeuroLens Guardian" showNav={true} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Glasses className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">AR Glasses Simulation</h1>
            </div>
            <p className="text-muted-foreground">
              Experience how NeuroLens Guardian works on future wearable smart glasses
            </p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Demo Mode</span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Simulation */}
          <div className="lg:col-span-8 space-y-6">
            {/* AR Glasses Simulation */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Live AR Glasses View</h2>
              <ARGlassesSimulation
                distressEngine={distressEngine}
                latestHazard={latestHazard as any}
                recentDetections={recentDetections}
                nearestSafeZone={nearestSafeZone as any}
                routeInfo={routeInfo}
                isNavigating={true}
                guidanceMessage={distressEngine?.userMessage || 'All clear. Continue with confidence.'}
                showDemoControls={true}
              />
            </div>

            {/* Info Card */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">About This Simulation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is a visual demonstration of how NeuroLens Guardian would work on future AR smart glasses.
                    The HUD overlay shows real-time navigation guidance, hazard detection, Safe Zone markers, and
                    AI assistant messages - all designed to help elderly users and people with cognitive disabilities
                    navigate safely and independently.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Features and Status */}
          <div className="lg:col-span-4 space-y-6">
            {/* Current Status */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Current Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">Mode</span>
                  <span className="text-sm text-primary font-semibold capitalize">
                    {distressEngine?.status || 'safe'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">Alert Level</span>
                  <span className="text-sm text-foreground font-semibold">
                    {distressEngine?.distressLevel || 0}%
                  </span>
                </div>
                {nearestSafeZone && 'distance' in nearestSafeZone && (
                  <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg border border-border">
                    <span className="text-sm font-medium text-foreground">Safe Zone</span>
                    <span className="text-sm text-foreground font-semibold">
                      {Math.round((nearestSafeZone as any).distance)}m
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* AR Features */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">AR Glasses Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Real-time Vision</p>
                    <p className="text-xs text-muted-foreground">Live hazard detection and object recognition</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Turn-by-Turn Guidance</p>
                    <p className="text-xs text-muted-foreground">Directional arrows and route visualization</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Safety Alerts</p>
                    <p className="text-xs text-muted-foreground">Instant warnings for vehicles and obstacles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Guardian Link</p>
                    <p className="text-xs text-muted-foreground">Automatic caregiver notifications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">AI Assistant</p>
                    <p className="text-xs text-muted-foreground">Calm, context-aware voice guidance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Modes */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Simulation Modes</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="font-medium text-foreground mb-1">Navigation Mode</p>
                  <p className="text-xs text-muted-foreground">Standard route guidance with directional arrows</p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="font-medium text-foreground mb-1">Hazard Mode</p>
                  <p className="text-xs text-muted-foreground">Active hazard detection with avoidance guidance</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <p className="font-medium text-foreground mb-1">Distress Mode</p>
                  <p className="text-xs text-muted-foreground">Simplified UI with Safe Zone recommendations</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="font-medium text-foreground mb-1">Emergency Mode</p>
                  <p className="text-xs text-muted-foreground">High-priority alerts with guardian notification</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
              <h3 className="font-semibold text-foreground mb-3">Try the Demo Controls</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use the "Demo Controls" panel in the top-left of the simulation to trigger different scenarios
                and see how the AR glasses HUD responds to various situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
