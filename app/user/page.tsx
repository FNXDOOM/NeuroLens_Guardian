'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/neurolens/navbar';
import LiveMap from '@/components/map/LiveMap';
import { ActionButton } from '@/components/neurolens/action-button';
import { GuidancePanel } from '@/components/neurolens/guidance-panel';
import SimulationModal from '@/components/simulation/SimulationModal';
import ARDetectionModal from '@/components/detection/ARDetectionModal';
import LiveStatusCard from '@/components/user/LiveStatusCard';
import NearestSafeZoneCard from '@/components/user/NearestSafeZoneCard';
import LiveNavigationPanel from '@/components/user/LiveNavigationPanel';
import { DemoControlPanel } from '@/components/neurolens/demo-control-panel';
import { EventLog } from '@/components/neurolens/event-log';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useDistressEngine } from '@/hooks/useDistressEngine';
import { useDemoMode } from '@/hooks/useDemoMode';
import { findNearestSafeZone, findSafeZonesNearby, formatDistance } from '@/data/safeZones';
import { getDirections } from '@/services/navigation';
import { insertHazardEvent } from '@/services/database';
import { TEST_USERS } from '@/constants/testUsers';
import {
  Navigation,
  MapPin,
  Mic,
  Phone,
  Settings,
  Clock,
  Radio,
  Target,
  AlertCircle,
  Glasses,
  Camera,
} from 'lucide-react';

interface LogEvent {
  id: string;
  timestamp: string;
  type: 'status' | 'navigation' | 'alert' | 'detection';
  title: string;
  description?: string;
  severity?: 'info' | 'warning' | 'alert';
}

export default function UserDashboard() {
  // Location tracking
  const {
    latitude,
    longitude,
    accuracy,
    isTracking,
    error: locationError,
  } = useLocationTracking({
    userId: TEST_USERS.JOHN,
    enableTracking: true,
    enableSync: true,
    syncInterval: 30000, // Sync every 30 seconds
    highAccuracy: 1,
  }) as any;

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

  // Safe Zones state
  const [nearbySafeZones, setNearbySafeZones] = useState<any[]>([]);
  const [nearestSafeZone, setNearestSafeZone] = useState<any>(null);

  // Route state
  const [route, setRoute] = useState<any[]>([]);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [destination, setDestination] = useState<any>(null);

  // AR Detection state
  const [latestHazard, setLatestHazard] = useState<any>(null);
  const [recentDetections, setRecentDetections] = useState<any[]>([]);

  // 3D Simulation Modal state
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  // AR Detection Modal state
  const [isARDetectionOpen, setIsARDetectionOpen] = useState(false);

  // Manual SOS state
  const [manualSOS, setManualSOS] = useState(false);

  // Idle time tracking
  const [idleTime] = useState(0);
  const [deviationCount] = useState(0);

  // Demo Mode
  const demoMode = useDemoMode({
    enabled: false,
    eventDuration: 5000,
  }) as any;

  // Merge demo state with real state
  const effectiveHazard = demoMode.isDemoMode && demoMode.demoHazard ? demoMode.demoHazard : latestHazard;
  const effectiveDetections = demoMode.isDemoMode && demoMode.demoDetections.length > 0 ? demoMode.demoDetections : recentDetections;
  const effectiveDeviationCount = demoMode.isDemoMode ? demoMode.demoDeviationCount : deviationCount;
  const effectiveIdleTime = demoMode.isDemoMode ? demoMode.demoIdleTime : idleTime;
  const effectiveManualSOS = demoMode.isDemoMode && demoMode.demoEmergency ? true : manualSOS;

  // Distress Engine integration
  const distressEngine = useDistressEngine({
    currentLocation: userLocation,
    routeState: {
      isActive: route.length > 0,
      coordinates: route,
      destination: destination ? { ...destination, isSafeZone: false } : null,
    },
    idleTime: effectiveIdleTime,
    deviationCount: effectiveDeviationCount,
    manualSOS: effectiveManualSOS,
    latestHazard: effectiveHazard,
    recentDetections: effectiveDetections,
    nearestSafeZone,
    config: {},
  }) as any;

  // Update Safe Zones when location changes
  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      // Find nearby Safe Zones (within 2km)
      const nearby = findSafeZonesNearby(userLocation.lat, userLocation.lng, 2000);
      setNearbySafeZones(nearby);

      // Find nearest Safe Zone
      const nearest = findNearestSafeZone(userLocation.lat, userLocation.lng);
      setNearestSafeZone(nearest);
    }
  }, [userLocation]);

  // Generate route to destination
  const generateRoute = async (destLat: number, destLng: number, destName: string) => {
    setIsLoadingRoute(true);
    try {
      const result = await getDirections({
        start: [userLocation.lng, userLocation.lat],
        end: [destLng, destLat],
        profile: 'foot-walking',
        preference: 'recommended',
        waypoints: [],
      }) as any;

      if (result.routes && result.routes.length > 0) {
        const routeData = result.routes[0];
        setRoute(routeData.geometry.coordinates);
        setRouteInfo({
          distance: routeData.summary.distance,
          duration: routeData.summary.duration,
          destination: destName,
        });
        setDestination({ lat: destLat, lng: destLng, name: destName });
      }
    } catch (error) {
      console.error('Error generating route:', error);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Route to nearest Safe Zone
  const routeToNearestSafeZone = () => {
    if (nearestSafeZone) {
      generateRoute(
        nearestSafeZone.latitude,
        nearestSafeZone.longitude,
        nearestSafeZone.name
      );
    }
  };

  // Clear route
  const clearRoute = () => {
    setRoute([]);
    setRouteInfo(null);
    setDestination(null);
  };

  // Handle AR detection callback
  const handleARDetection = (detections: any) => {
    setRecentDetections(detections);
  };

  // Handle hazard change callback
  const handleHazardChange = async (hazard: any) => {
    setLatestHazard(hazard);

    // Log hazard to database if it's a danger or caution level
    if (hazard && (hazard.severity === 'danger' || hazard.severity === 'caution')) {
      try {
        // Map severity to database severity levels
        const dbSeverity = hazard.severity === 'danger' ? 'high' : 'medium';

        await insertHazardEvent({
          user_id: TEST_USERS.JOHN,
          hazard_type: hazard.category,
          severity: dbSeverity,
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          confidence: Math.round(hazard.confidence * 100),
          description: `${hazard.class} detected via AR camera`,
        });

        console.log('Hazard logged to database:', hazard);
      } catch (error) {
        console.error('Error logging hazard to database:', error);
      }
    }
  };

  // Handle SOS button
  const handleSOS = () => {
    setManualSOS(true);
    // Log to console for demo
    console.log('🚨 EMERGENCY SOS ACTIVATED');
  };

  // Clear SOS
  const clearSOS = () => {
    setManualSOS(false);
  };

  // Handle Start Journey
  const handleStartJourney = () => {
    // If there's a nearest Safe Zone, route to it
    if (nearestSafeZone) {
      routeToNearestSafeZone();
    } else {
      // Show a message or open a destination selector
      console.log('📍 Start Journey: Please select a destination');
      alert('Please select a destination to start your journey');
    }
  };

  // Handle Speak Guidance
  const handleSpeakGuidance = () => {
    // Use Web Speech API to speak the current guidance
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      
      // Small delay to ensure cancellation is complete
      setTimeout(() => {
        const message = distressEngine.userMessage || 
          'All systems monitoring. Continue with confidence.';
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Add error handling
        utterance.onerror = (event) => {
          console.log('Speech synthesis error:', event.error);
          // Don't show alert for common errors like 'interrupted' or 'canceled'
          if (event.error !== 'interrupted' && event.error !== 'canceled') {
            console.error('Voice guidance error:', event.error);
          }
        };
        
        utterance.onend = () => {
          console.log('🔊 Guidance spoken successfully');
        };
        
        window.speechSynthesis.speak(utterance);
        console.log('🔊 Speaking guidance:', message);
      }, 100);
    } else {
      console.log('❌ Speech synthesis not supported');
      alert('Voice guidance is not supported in your browser');
    }
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Format ETA
  const formatETA = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  };

  // Format distance
  const formatRouteDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Dummy data
  const currentStatus = distressEngine.status;
  const currentLocation = latitude && longitude 
    ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    : '456 Oak Avenue';

  const logEvents: LogEvent[] = [
    {
      id: '1',
      timestamp: '2:34 PM',
      type: 'status',
      title: 'Journey Started',
      description: 'Safe zone: Central Library (250m away)',
      severity: 'info',
    },
    {
      id: '2',
      timestamp: '2:32 PM',
      type: 'detection',
      title: 'Obstacle Detected',
      description: 'Construction barrier ahead, route adjusted',
      severity: 'warning',
    },
    {
      id: '3',
      timestamp: '2:28 PM',
      type: 'navigation',
      title: 'Turning left on Main Street',
      description: 'Continue straight for 100 meters',
    },
    {
      id: '4',
      timestamp: '2:20 PM',
      type: 'status',
      title: 'Safe Zone Reached',
      description: 'Public Park - All amenities available',
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navbar */}
      <Navbar variant="user" title="NeuroLens Guardian" showNav={true} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header with status */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Safe Navigation Mode</h1>
            <p className="text-muted-foreground">
              {routeInfo ? `Navigating to ${routeInfo.destination}` : 'Real-time guidance and monitoring'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Demo Mode Toggle */}
            <button
              onClick={demoMode.toggleDemoMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                demoMode.isDemoMode
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <span>{demoMode.isDemoMode ? '🎬 Demo Mode' : '🎬 Demo Off'}</span>
            </button>

            {isTracking ? (
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">Live Tracking</span>
                {accuracy && (
                  <span className="text-xs text-muted-foreground">±{Math.round(accuracy)}m</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  {locationError || 'Location unavailable'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Navigation and route info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Demo Control Panel */}
            {demoMode.isDemoMode && (
              <DemoControlPanel demoMode={demoMode} compact={true} />
            )}

            {/* Live Map */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3">
                {routeInfo ? 'Active Route' : 'Current Location'}
              </h2>
              <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border overflow-hidden">
                <LiveMap
                  center={{ lng: userLocation.lng, lat: userLocation.lat }}
                  zoom={15}
                  style="streets"
                  userLocation={userLocation}
                  safeZones={nearbySafeZones.slice(0, 10).map(zone => ({
                    name: zone.name,
                    type: zone.type,
                    lng: zone.longitude,
                    lat: zone.latitude,
                    distance: zone.distance,
                    status: zone.open_status,
                  }))}
                  route={route}
                  className="h-64"
                />
              </div>
            </div>

            {/* Live Navigation Panel */}
            <LiveNavigationPanel
              isNavigating={route.length > 0}
              destination={destination}
              routeInfo={routeInfo}
              isLoadingRoute={isLoadingRoute}
              userLocation={userLocation as any}
              accuracy={accuracy}
              transitState={null}
              formatETA={formatETA}
              formatDistance={formatRouteDistance}
            />

            {/* Nearest Safe Zone */}
            <NearestSafeZoneCard
              nearestSafeZone={nearestSafeZone}
              isCalculating={false}
              locationAvailable={latitude && longitude}
              onRouteToSafeZone={routeToNearestSafeZone as any}
              isLoadingRoute={isLoadingRoute}
              formatDistance={formatDistance as any}
            />
          </div>

          {/* Center column - Main status and controls */}
          <div className="lg:col-span-6 space-y-6">
            {/* Live Status Card */}
            <LiveStatusCard
              status={distressEngine.status}
              statusReason={distressEngine.reason}
              distressLevel={distressEngine.distressLevel}
              userMessage={distressEngine.userMessage}
              isNavigating={route.length > 0}
              destination={destination}
              latestHazard={effectiveHazard}
              transitState={null}
              guardianNotified={false}
              safeRideActive={false}
              manualSOS={effectiveManualSOS}
              onClearSOS={clearSOS as any}
            />

            {/* Recommended actions */}
            {distressEngine.recommendedActions.length > 0 && distressEngine.distressLevel >= 50 && (
              <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-6">
                <h3 className="font-semibold text-foreground mb-3">Recommended Actions</h3>
                <div className="space-y-2">
                  {distressEngine.recommendedActions.map((action: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-secondary/5 rounded-lg border border-border"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-foreground">
                        {distressEngine.getActionLabel(action)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons grid */}
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <ActionButton 
                  icon={Navigation} 
                  label="Start Journey" 
                  size="lg" 
                  variant="primary"
                  onClick={handleStartJourney}
                />
                <ActionButton
                  icon={MapPin}
                  label="Find Safe Zone"
                  size="lg"
                  variant="secondary"
                  onClick={routeToNearestSafeZone}
                />
                <ActionButton 
                  icon={Glasses} 
                  label="3D Simulation" 
                  size="lg" 
                  variant="secondary"
                  description="AR Glasses View"
                  onClick={() => setIsSimulationOpen(true)}
                />
                <ActionButton 
                  icon={Mic} 
                  label="Speak Guidance" 
                  size="lg" 
                  variant="secondary"
                  onClick={handleSpeakGuidance}
                />
                <ActionButton
                  icon={Phone}
                  label="Emergency SOS"
                  size="lg"
                  variant="danger"
                  description="One-tap help"
                  onClick={handleSOS}
                />
              </div>
            </div>

            {/* AI Guidance Panel */}
            <GuidancePanel
              currentGuidance={distressEngine.userMessage || "Continue straight ahead. A safe zone is 150 meters ahead. Remember to stay calm and focused."}
              isListening={false}
              tone="calm"
            />
          </div>

          {/* Right column - AR Detection and settings */}
          <div className="lg:col-span-3 space-y-6">
            {/* AR Detection Card */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-6 h-6 text-teal-500" />
                  <h3 className="font-semibold text-lg text-foreground">AR Hazard Detection</h3>
                </div>
                {latestHazard && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    latestHazard.severity === 'danger' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    latestHazard.severity === 'caution' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  }`}>
                    {latestHazard.class}
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Real-time object detection using your camera to identify hazards and obstacles.
                </p>
                
                {recentDetections.length > 0 && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Detections:</span>
                      <span className="font-medium text-foreground">{recentDetections.length} objects</span>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setIsARDetectionOpen(true)}
                  className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Open AR Detection
                </button>
              </div>
            </div>

            {/* Settings card */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-lg text-foreground">Quick Settings</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">Audio Guidance</span>
                  <div className="w-10 h-6 bg-primary rounded-full flex items-center justify-end pr-1">
                    <div className="w-5 h-5 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">Haptic Feedback</span>
                  <div className="w-10 h-6 bg-muted rounded-full flex items-center justify-start pl-1">
                    <div className="w-5 h-5 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div>
          <EventLog events={logEvents} title="Recent Activity" maxHeight="max-h-80" />
        </div>
      </div>
      
      {/* 3D Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        appState={{
          // Location & Navigation
          userLocation,
          destination,
          route,
          routeInfo,
          isNavigating: route.length > 0,
          
          // Hazard Detection
          latestHazard: effectiveHazard,
          recentDetections: effectiveDetections,
          
          // Distress Engine
          distressStatus: distressEngine.status,
          distressReason: distressEngine.reason,
          distressLevel: distressEngine.distressLevel,
          distressMessage: distressEngine.userMessage,
          
          // Safe Zones
          nearestSafeZone,
          nearbySafeZones,
          
          // Guardian & Emergency
          guardianNotified: false,
          isEmergency: effectiveManualSOS || distressEngine.status === 'emergency',
          manualSOS: effectiveManualSOS,
          
          // AI Guidance
          guidanceMessage: distressEngine.userMessage,
          
          // Demo Mode
          demoMode: demoMode.isDemoMode ? demoMode : null,
          demoScenario: demoMode.currentScenario,
        }}
      />
      
      {/* AR Detection Modal */}
      <ARDetectionModal
        isOpen={isARDetectionOpen}
        onClose={() => setIsARDetectionOpen(false)}
        onDetection={handleARDetection as any}
        onHazardChange={handleHazardChange as any}
        simulationState={{
          // Location & Navigation
          userLocation,
          destination,
          route,
          routeInfo,
          isNavigating: route.length > 0,
          
          // Hazard Detection
          latestHazard: effectiveHazard,
          recentDetections: effectiveDetections,
          
          // Distress Engine
          distressStatus: distressEngine.status,
          distressReason: distressEngine.reason,
          distressLevel: distressEngine.distressLevel,
          distressMessage: distressEngine.userMessage,
          
          // Safe Zones
          nearestSafeZone,
          nearbySafeZones,
          
          // Guardian & Emergency
          guardianNotified: false,
          isEmergency: effectiveManualSOS || distressEngine.status === 'emergency',
          manualSOS: effectiveManualSOS,
          
          // AI Guidance
          guidanceMessage: distressEngine.userMessage,
          
          // Demo Mode
          demoMode: demoMode.isDemoMode ? demoMode : null,
          demoScenario: demoMode.currentScenario,
        } as any}
      />
    </div>
  );
}
