'use client';

import { AlertOctagon, MapPin, Phone, MessageSquare, Navigation, Car, X } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface EmergencySOS {
  isActive: boolean;
  guardianNotified: boolean;
  caregiverNotified: boolean;
  locationShared: boolean;
  nearestSafeZone?: string;
}

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  sosStatus?: EmergencySOS;
  onCallGuardian?: () => void;
  onSendSMS?: () => void;
  onRouteToSafeZone?: () => void;
  onRequestSafeRide?: () => void;
  onCancelAlarm?: () => void;
}

export function EmergencySOSModal({
  isOpen,
  onClose,
  sosStatus = {
    isActive: true,
    guardianNotified: true,
    caregiverNotified: true,
    locationShared: true,
    nearestSafeZone: 'Central Hospital - 450m away',
  },
  onCallGuardian,
  onSendSMS,
  onRouteToSafeZone,
  onRequestSafeRide,
  onCancelAlarm,
}: EmergencySOSModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border p-8 max-w-md w-full mx-4 animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertOctagon className="w-8 h-8 text-[var(--distress)] animate-pulse" />
            <h2 className="text-2xl font-bold text-foreground">Emergency Support Activated</h2>
          </div>
          <p className="text-sm text-muted-foreground">You have triggered emergency support. Help is being coordinated.</p>
        </div>

        {/* Status indicators */}
        <div className="bg-muted/30 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Location Shared</span>
            <div className={`w-2 h-2 rounded-full ${sosStatus.locationShared ? 'bg-[var(--safe)]' : 'bg-muted'}`} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Guardian Notified</span>
            <div className={`w-2 h-2 rounded-full ${sosStatus.guardianNotified ? 'bg-[var(--safe)]' : 'bg-muted'}`} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Caregiver Alerted</span>
            <div className={`w-2 h-2 rounded-full ${sosStatus.caregiverNotified ? 'bg-[var(--safe)]' : 'bg-muted'}`} />
          </div>
        </div>

        {/* Safe Zone suggestion */}
        {sosStatus.nearestSafeZone && (
          <div className="bg-[var(--safe)]/10 border border-[var(--safe)]/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--safe)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Nearest Safe Zone</p>
                <p className="text-sm text-muted-foreground">{sosStatus.nearestSafeZone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={onCallGuardian}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-all"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">Call Guardian</span>
          </button>
          <button
            onClick={onSendSMS}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Send Alert</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={onRouteToSafeZone}
            className="flex items-center justify-center gap-2 bg-[var(--safe)] text-[var(--safe-foreground)] hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span className="text-sm">Go to Safe Zone</span>
          </button>
          <button
            onClick={onRequestSafeRide}
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-all"
          >
            <Car className="w-4 h-4" />
            <span className="text-sm">Request Ride</span>
          </button>
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancelAlarm}
          className="w-full py-3 px-4 border border-border hover:bg-muted/50 font-semibold rounded-lg transition-all text-foreground"
        >
          Cancel False Alarm
        </button>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-4">Emergency services can see your location in real-time</p>
      </div>
    </div>
  );
}
