'use client';

import { useState } from 'react';
import { Navbar } from '@/components/neurolens/navbar';
import { EmergencySOSModal } from '@/components/neurolens/emergency-sos-modal';
import { DistressDetectionPanel } from '@/components/neurolens/distress-detection-panel';
import { SafeRideAssistance } from '@/components/neurolens/safe-ride-panel';
import { SafeZoneDetailDrawer } from '@/components/neurolens/safe-zone-detail-drawer';
import { NotificationCenter } from '@/components/neurolens/notification-center';
import { AccessibilitySettingsPanel } from '@/components/neurolens/accessibility-settings-panel';
import { CaregiverAlertDetailPanel } from '@/components/neurolens/caregiver-alert-detail-panel';
import { JourneyTimeline } from '@/components/neurolens/journey-timeline';
import { OnboardingFlow } from '@/components/neurolens/onboarding-flow';
import { StatePlaceholder } from '@/components/neurolens/state-placeholders';

export default function ComponentsShowcase() {
  const [modals, setModals] = useState({
    emergency: false,
    distress: false,
    ride: false,
    safeZone: false,
    notifications: false,
    settings: false,
    alert: false,
    onboarding: false,
  });

  const [loadingState, setLoadingState] = useState<'gps' | 'ar' | 'zones' | 'caregiver' | null>(null);
  const [emptyState, setEmptyState] = useState<'alerts' | 'journey' | 'zones' | null>(null);
  const [errorState, setErrorState] = useState<'camera' | 'location' | 'network' | 'offline' | null>(null);

  const toggleModal = (key: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar variant="user" title="Component Showcase" showNav={true} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">NeuroLens Guardian - Advanced Components</h1>
          <p className="text-muted-foreground">
            Complete UI toolkit for the assistive mobility platform
          </p>
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Emergency SOS */}
          <button
            onClick={() => toggleModal('emergency')}
            className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all text-left"
          >
            <div className="w-10 h-10 bg-[var(--distress)]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-lg">🚨</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Emergency SOS Modal</h3>
            <p className="text-sm text-muted-foreground">High-priority emergency coordination interface</p>
          </button>

          {/* Distress Detection */}
          <button
            onClick={() => toggleModal('distress')}
            className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all text-left"
          >
            <div className="w-10 h-10 bg-[var(--warning)]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-lg">⚠️</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Distress Detection</h3>
            <p className="text-sm text-muted-foreground">Supportive UI when system detects confusion</p>
          </button>

          {/* Safe Ride */}
          <button
            onClick={() => toggleModal('ride')}
            className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all text-left"
          >
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-lg">🚗</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Safe Ride Assistance</h3>
            <p className="text-sm text-muted-foreground">Protected ride booking for vulnerable users</p>
          </button>

          {/* Safe Zone Detail */}
          <button
            onClick={() => toggleModal('safeZone')}
            className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all text-left"
          >
            <div className="w-10 h-10 bg-[var(--safe)]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-lg">🏥</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Safe Zone Details</h3>
            <p className="text-sm text-muted-foreground">Detailed information drawer for Safe Zones</p>
          </button>

          {/* Notification Center */}
          <button
            onClick={() => toggleModal('notifications')}
            className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all text-left"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-lg">🔔</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Notification Center</h3>
            <p className="text-sm text-muted-foreground">Alerts and event history with filters</p>
          </button>

          {/* Accessibility Settings */}
          <button
            onClick={() => toggleModal('settings')}
            className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all text-left"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-lg">⚙️</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Accessibility Settings</h3>
            <p className="text-sm text-muted-foreground">Full assistive preferences panel</p>
          </button>

          {/* Caregiver Alert */}
          <button
            onClick={() => toggleModal('alert')}
            className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all text-left"
          >
            <div className="w-10 h-10 bg-[var(--distress)]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-lg">👨‍⚕️</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Caregiver Alert Panel</h3>
            <p className="text-sm text-muted-foreground">Alert response interface for guardians</p>
          </button>

          {/* Journey Timeline */}
          <button
            className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all text-left md:col-span-2 lg:col-span-1"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-lg">📍</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Journey Timeline</h3>
            <p className="text-sm text-muted-foreground">Event history with visual timeline</p>
          </button>

          {/* Onboarding Flow */}
          <button
            onClick={() => toggleModal('onboarding')}
            className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all text-left"
          >
            <div className="w-10 h-10 bg-[var(--safe)]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-lg">🎯</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Onboarding Flow</h3>
            <p className="text-sm text-muted-foreground">Multi-step setup experience</p>
          </button>
        </div>

        {/* State Placeholders */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">State Placeholders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setLoadingState(loadingState === 'gps' ? null : 'gps')}
              className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all"
            >
              <p className="font-semibold text-foreground mb-2">Loading States</p>
              <p className="text-xs text-muted-foreground">GPS, AR, Safe Zones, Caregiver</p>
            </button>
            <button
              onClick={() => setEmptyState(emptyState === 'alerts' ? null : 'alerts')}
              className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all"
            >
              <p className="font-semibold text-foreground mb-2">Empty States</p>
              <p className="text-xs text-muted-foreground">No alerts, journey, zones</p>
            </button>
            <button
              onClick={() => setErrorState(errorState === 'network' ? null : 'network')}
              className="p-6 bg-card rounded-2xl shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all"
            >
              <p className="font-semibold text-foreground mb-2">Error States</p>
              <p className="text-xs text-muted-foreground">Camera, Location, Network, Offline</p>
            </button>
          </div>
        </div>

        {/* Journey Timeline Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Journey Timeline Example</h2>
          <JourneyTimeline />
        </div>

        {/* State Preview */}
        {loadingState && (
          <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 mb-8">
            <h3 className="font-semibold text-foreground mb-4">Loading: {loadingState}</h3>
            <StatePlaceholder state="loading" subtype={loadingState} />
          </div>
        )}

        {emptyState && (
          <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 mb-8">
            <h3 className="font-semibold text-foreground mb-4">Empty: {emptyState}</h3>
            <StatePlaceholder state="empty" subtype={emptyState} />
          </div>
        )}

        {errorState && (
          <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 mb-8">
            <h3 className="font-semibold text-foreground mb-4">Error: {errorState}</h3>
            <StatePlaceholder state="error" subtype={errorState} />
          </div>
        )}
      </div>

      {/* Modals */}
      <EmergencySOSModal
        isOpen={modals.emergency}
        onClose={() => toggleModal('emergency')}
        onCallGuardian={() => alert('Calling guardian...')}
        onSendSMS={() => alert('SMS sent...')}
        onRouteToSafeZone={() => alert('Routing to Safe Zone...')}
        onRequestSafeRide={() => alert('Requesting Safe Ride...')}
        onCancelAlarm={() => toggleModal('emergency')}
      />

      <DistressDetectionPanel
        isVisible={modals.distress}
        onDismiss={() => toggleModal('distress')}
        onContactGuardian={() => alert('Contacting guardian...')}
        onRequestSafeRide={() => alert('Requesting Safe Ride...')}
        onContinueNavigation={() => alert('Continuing navigation...')}
      />

      <SafeRideAssistance
        isOpen={modals.ride}
        status="searching"
        onClose={() => toggleModal('ride')}
        onRequestRide={() => alert('Ride requested...')}
        onCancelRide={() => toggleModal('ride')}
        onTrackRide={() => alert('Tracking ride...')}
      />

      <SafeZoneDetailDrawer
        isOpen={modals.safeZone}
        onClose={() => toggleModal('safeZone')}
        onRouteHere={() => alert('Routing here...')}
        onCallSupport={() => alert('Calling support...')}
        onSaveFavorite={() => alert('Saved to favorites...')}
        onRequestSafeRide={() => alert('Requesting Safe Ride...')}
      />

      <NotificationCenter
        isOpen={modals.notifications}
        onClose={() => toggleModal('notifications')}
        onClearAll={() => alert('Notifications cleared...')}
        onMarkAsRead={(id) => console.log('Marked as read:', id)}
      />

      <AccessibilitySettingsPanel
        isOpen={modals.settings}
        onClose={() => toggleModal('settings')}
        onSettingChange={(setting, value) => console.log(setting, value)}
        onAddContact={(contact) => console.log('Added contact:', contact)}
        onRemoveContact={(id) => console.log('Removed contact:', id)}
      />

      <CaregiverAlertDetailPanel
        isOpen={modals.alert}
        onClose={() => toggleModal('alert')}
        onAcknowledge={() => alert('Alert acknowledged...')}
        onCallUser={() => alert('Calling user...')}
        onRouteToSafeZone={() => alert('Routing user...')}
        onDispatchSafeRide={() => alert('Dispatching Safe Ride...')}
        onEscalateEmergency={() => alert('Escalating to emergency...')}
      />

      <OnboardingFlow
        isOpen={modals.onboarding}
        onComplete={() => {
          alert('Onboarding complete!');
          toggleModal('onboarding');
        }}
      />
    </div>
  );
}
