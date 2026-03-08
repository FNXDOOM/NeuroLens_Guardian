'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/neurolens/navbar';
import { StatusBadge } from '@/components/neurolens/status-badge';
import { SafeZoneCard } from '@/components/neurolens/safe-zone-card';
import LiveMap from '@/components/map/LiveMap';
import { ActionButton } from '@/components/neurolens/action-button';
import { EventLog } from '@/components/neurolens/event-log';
import { DistressLevelIndicator } from '@/components/neurolens/distress-level-indicator';
import { CaregiverAlertDetailPanel } from '@/components/neurolens/caregiver-alert-detail-panel';
import { useCaregiverMonitoring } from '@/hooks/useCaregiverMonitoring';
import { findNearestSafeZone, formatDistance } from '@/data/safeZones';
import { TEST_USERS } from '@/constants/testUsers';
import {
  MapPin,
  AlertCircle,
  Phone,
  Shield,
  TrendingDown,
  Clock,
  Radio,
  AlertTriangle,
  Navigation,
  Eye,
  MessageSquare,
  Car,
  CheckCircle,
} from 'lucide-react';

interface LogEvent {
  id: string;
  timestamp: string;
  type: 'status' | 'navigation' | 'alert' | 'detection';
  title: string;
  description?: string;
  severity?: 'info' | 'warning' | 'alert';
}

export default function CaregiverDashboard() {
  // Caregiver monitoring hook - FORCE DEMO MODE to avoid database RLS error
  const monitoring = useCaregiverMonitoring({
    userId: TEST_USERS.JOHN,
    useDemoMode: true, // Force demo mode to bypass database
    demoState: {
      profile: {
        id: TEST_USERS.JOHN,
        full_name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        emergency_contact_name: 'Sarah Johnson',
        emergency_contact_phone: '+1 (555) 987-6543',
        preferences: {
          voice_guidance: true,
          volume: 75,
          language: 'en',
        }
      },
      location: {
        latitude: 12.9716,
        longitude: 77.5946,
        accuracy: 10,
        address: 'MG Road, Bangalore',
        recorded_at: new Date().toISOString(),
        battery_level: 85,
        is_moving: false,
      },
      hazards: [],
      distress: [],
      rides: [],
    },
    refreshInterval: 5000,
  })

  // Selected alert for detail panel
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [isAlertDetailOpen, setIsAlertDetailOpen] = useState(false)

  // Nearest Safe Zone
  const [nearestSafeZone, setNearestSafeZone] = useState(null)

  // Update nearest Safe Zone when location changes
  useEffect(() => {
    if (monitoring.userState?.location) {
      const nearest = findNearestSafeZone(
        monitoring.userState.location.latitude,
        monitoring.userState.location.longitude
      )
      setNearestSafeZone(nearest)
    }
  }, [monitoring.userState?.location])

  // Calculate distress level (0-100)
  const calculateDistressLevel = () => {
    if (!monitoring.userState || !monitoring.userState.distress || monitoring.userState.distress.length === 0) {
      return 0
    }

    const latestDistress = monitoring.userState.distress[0]
    const levelMap = {
      none: 0,
      low: 25,
      medium: 50,
      high: 75,
      critical: 100,
    }

    return levelMap[latestDistress.distress_level] || 0
  }

  // Get user status
  const getUserStatus = () => {
    const distressLevel = calculateDistressLevel()
    if (distressLevel >= 75) return 'emergency'
    if (distressLevel >= 50) return 'distress'
    if (distressLevel >= 25) return 'warning'
    return 'safe'
  }

  // Format last update time
  const getLastUpdateTime = () => {
    if (!monitoring.lastUpdate) return 'No data'
    return monitoring.lastUpdate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  // Get user location for map
  const getUserLocation = () => {
    if (!monitoring.userState || !monitoring.userState.location) return null
    return {
      lng: monitoring.userState.location.longitude,
      lat: monitoring.userState.location.latitude,
    }
  }

  // Get latest guidance message
  const getLatestGuidance = () => {
    if (!monitoring.userState || !monitoring.userState.distress || monitoring.userState.distress.length === 0) {
      return 'All clear. Continue with confidence.'
    }
    const latestDistress = monitoring.userState.distress[0]
    return latestDistress.guidance_message || 'Monitoring user safety.'
  }

  // Get Safe Ride status
  const getSafeRideStatus = () => {
    if (!monitoring.userState || !monitoring.userState.rides || monitoring.userState.rides.length === 0) {
      return 'not_requested'
    }
    const latestRide = monitoring.userState.rides[0]
    return latestRide.status
  }

  // Get guardian notification status
  const getGuardianStatus = () => {
    const distressLevel = calculateDistressLevel()
    return distressLevel >= 75 ? 'notified' : 'connected'
  }

  // Handle alert click
  const handleAlertClick = (alert) => {
    setSelectedAlert(alert)
    setIsAlertDetailOpen(true)
  }

  // Format events for EventLog component
  const formatEventsForLog = () => {
    return monitoring.events.slice(0, 20).map(event => ({
      id: event.id,
      timestamp: event.timestamp.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      type: event.type === 'hazard' ? 'detection' : event.type === 'distress' ? 'alert' : 'status',
      title: event.title,
      description: event.description,
      severity: event.severity === 'high' || event.severity === 'critical' || event.severity === 'danger' ? 'alert' : 
                 event.severity === 'medium' || event.severity === 'warning' ? 'warning' : 'info',
    }))
  }

  if (monitoring.isLoading) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading monitoring data...</p>
        </div>
      </div>
    )
  }

  if (monitoring.error) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-2">Error Loading Data</p>
          <p className="text-muted-foreground">{monitoring.error}</p>
        </div>
      </div>
    )
  }

  const userName = monitoring.userState?.profile?.full_name || 'User'
  const userStatus = getUserStatus()
  const lastUpdate = getLastUpdateTime()
  const distressLevel = calculateDistressLevel()
  const userLocation = getUserLocation()
  const latestGuidance = getLatestGuidance()
  const safeRideStatus = getSafeRideStatus()
  const guardianStatus = getGuardianStatus()
  const formattedEvents = formatEventsForLog()

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navbar */}
      <Navbar variant="caregiver" title="NeuroLens Guardian" showNav={true} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Caregiver Monitoring</h1>
            <p className="text-muted-foreground">Monitoring {userName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Last update: {lastUpdate}</span>
          </div>
        </div>

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - User Status */}
          <div className="space-y-6">
            {/* User Status Card */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
              <h3 className="font-semibold text-lg text-foreground mb-4">{userName}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Current Status</p>
                  <StatusBadge status={userStatus as 'safe' | 'warning' | 'distress' | 'emergency'} size="sm" />
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Guardian Status</p>
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${guardianStatus === 'notified' ? 'text-destructive' : 'text-primary'}`} />
                    <span className="text-sm font-medium text-foreground">
                      {guardianStatus === 'notified' ? 'Notified' : 'Connected'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Safe Ride Status</p>
                  <div className="flex items-center gap-2">
                    <Car className={`w-4 h-4 ${safeRideStatus === 'in_progress' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium text-foreground capitalize">
                      {safeRideStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Location Card */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Location</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {monitoring.userState?.location?.address || 'Location unavailable'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated {monitoring.userState?.location ? 
                    Math.round((Date.now() - new Date(monitoring.userState.location.recorded_at).getTime()) / 60000) : 0} minutes ago
                </p>
                {monitoring.userState?.location?.accuracy && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">GPS Accuracy</p>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--safe)]" 
                        style={{ width: `${Math.min(100, (50 / monitoring.userState.location.accuracy) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ±{Math.round(monitoring.userState.location.accuracy)} meters
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Distress Level */}
            <DistressLevelIndicator level={distressLevel} label="Distress Level" showDetails={true} />

            {/* AI Guidance Card */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">AI Guidance</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground italic">
                  "{latestGuidance}"
                </p>
                <p className="text-xs text-muted-foreground">
                  Latest guidance message shown to user
                </p>
              </div>
            </div>

            {/* Nearest Safe Zone */}
            {nearestSafeZone && (
              <SafeZoneCard
                name={nearestSafeZone.name}
                distance={formatDistance(nearestSafeZone.distance)}
                address={nearestSafeZone.address}
                isNearest={true}
                amenities={nearestSafeZone.amenities.slice(0, 2)}
              />
            )}
          </div>

          {/* Center - Main monitoring area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live route map */}
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3">Live Location</h2>
              {userLocation ? (
                <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border overflow-hidden">
                  <LiveMap
                    center={userLocation}
                    zoom={15}
                    style="streets"
                    userLocation={userLocation}
                    safeZones={nearestSafeZone ? [{
                      name: nearestSafeZone.name,
                      type: nearestSafeZone.type,
                      lng: nearestSafeZone.longitude,
                      lat: nearestSafeZone.latitude,
                      distance: nearestSafeZone.distance,
                      status: nearestSafeZone.open_status,
                    }] : []}
                    className="h-96"
                  />
                </div>
              ) : (
                <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-12 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No location data available</p>
                </div>
              )}
            </div>

            {/* Event Timeline */}
            <EventLog 
              events={formattedEvents.length > 0 ? formattedEvents : [{
                id: '1',
                timestamp: 'N/A',
                type: 'status',
                title: 'No recent events',
                description: 'Waiting for activity data',
              }]} 
              title="Activity Timeline" 
              maxHeight="max-h-80" 
            />
          </div>

          {/* Right Sidebar - Controls and alerts */}
          <div className="space-y-6">
            {/* Emergency Controls */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
              <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Emergency Controls
              </h3>
              <div className="space-y-3">
                <ActionButton
                  icon={Phone}
                  label="Call User"
                  size="md"
                  variant="primary"
                  description="Direct call"
                  onClick={monitoring.callUser}
                />
                <ActionButton
                  icon={MessageSquare}
                  label="Call Guardian"
                  size="md"
                  variant="primary"
                  description="Contact guardian"
                  onClick={monitoring.callGuardian}
                />
                <ActionButton
                  icon={MapPin}
                  label="Route to Safe Zone"
                  size="md"
                  variant="secondary"
                  description="Navigate to safety"
                  onClick={() => nearestSafeZone && monitoring.routeToSafeZone(nearestSafeZone.name)}
                />
                <ActionButton
                  icon={Car}
                  label="Request Safe Ride"
                  size="md"
                  variant="secondary"
                  description="Book transport"
                  onClick={monitoring.triggerSafeRide}
                />
                <ActionButton
                  icon={AlertTriangle}
                  label="Escalate Emergency"
                  size="md"
                  variant="danger"
                  description="Emergency services"
                  onClick={monitoring.escalateEmergency}
                />
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-foreground">Active Alerts</h3>
                {monitoring.activeAlerts.length > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                    {monitoring.activeAlerts.filter(a => !a.acknowledged).length}
                  </span>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {monitoring.activeAlerts.length > 0 ? (
                  monitoring.activeAlerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className={`p-3 border rounded-lg flex items-start gap-3 cursor-pointer transition-all hover:bg-muted/50 ${
                        alert.severity === 'danger' ? 'bg-destructive/10 border-destructive/20' :
                        alert.severity === 'warning' ? 'bg-warning/10 border-warning/20' :
                        'bg-muted/10 border-border'
                      } ${alert.acknowledged ? 'opacity-50' : ''}`}
                      onClick={() => handleAlertClick(alert)}
                    >
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        alert.severity === 'danger' ? 'text-destructive' :
                        alert.severity === 'warning' ? 'text-warning' :
                        'text-primary'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {alert.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                        {alert.acknowledged && (
                          <div className="flex items-center gap-1 mt-1">
                            <CheckCircle className="w-3 h-3 text-[var(--safe)]" />
                            <span className="text-xs text-[var(--safe)]">Acknowledged</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No active alerts</p>
                )}
              </div>
              {monitoring.activeAlerts.length > 0 && (
                <button
                  onClick={monitoring.clearAllAlerts}
                  className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All Alerts
                </button>
              )}
            </div>

            {/* Recent Detections */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
              <h3 className="font-semibold text-lg text-foreground mb-4">Recent Detections</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {monitoring.userState?.hazards && monitoring.userState.hazards.length > 0 ? (
                  monitoring.userState.hazards.map(hazard => (
                    <div key={hazard.id} className="p-3 bg-secondary/5 rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-foreground text-sm">
                          {hazard.hazard_type.charAt(0).toUpperCase() + hazard.hazard_type.slice(1)}
                        </p>
                        {hazard.confidence && (
                          <span className="text-xs font-semibold text-muted-foreground">
                            {Math.round(hazard.confidence)}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(hazard.detected_at).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No detections</p>
                )}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
              <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-primary" />
                System Health
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Battery Level</span>
                  <span className="font-medium text-foreground">
                    {monitoring.userState?.location?.battery_level || 'N/A'}
                    {monitoring.userState?.location?.battery_level && '%'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">GPS Accuracy</span>
                  <span className="font-medium text-foreground">
                    {monitoring.userState?.location?.accuracy ? 
                      `±${Math.round(monitoring.userState.location.accuracy)}m` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tracking Status</span>
                  <span className="font-medium text-[var(--safe)]">
                    {monitoring.userState?.location ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Refresh</span>
                  <span className="font-medium text-foreground">
                    {lastUpdate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Detail Panel */}
        {selectedAlert && (
          <CaregiverAlertDetailPanel
            isOpen={isAlertDetailOpen}
            onClose={() => setIsAlertDetailOpen(false)}
            alert={selectedAlert}
            userLocation={userLocation}
            nearestSafeZone={nearestSafeZone}
            latestGuidance={latestGuidance}
            onAcknowledge={() => {
              monitoring.acknowledgeAlert(selectedAlert.id)
              setIsAlertDetailOpen(false)
            }}
            onRouteToSafeZone={() => {
              if (nearestSafeZone) {
                monitoring.routeToSafeZone(nearestSafeZone.name)
              }
            }}
            onTriggerSafeRide={monitoring.triggerSafeRide}
            onEscalate={monitoring.escalateEmergency}
          />
        )}
      </div>
    </div>
  );
}
