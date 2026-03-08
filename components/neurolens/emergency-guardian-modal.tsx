'use client';

import { AlertOctagon, Phone, MessageSquare, Navigation, MapPin, CheckCircle, Clock, X, Car } from 'lucide-react';

type DeliveryStatus = 'pending' | 'call_initiated' | 'sms_sent' | 'notification_delivered' | 'location_shared';

interface GuardianContact {
  name: string;
  relationship: string;
  phone: string;
}

interface EmergencyGuardianModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryGuardian?: GuardianContact;
  secondaryGuardian?: GuardianContact;
  nearestSafeZone?: { name: string; distance: string };
  deliveryStatuses?: Record<DeliveryStatus, boolean>;
  onCallGuardian?: () => void;
  onSendSMS?: () => void;
  onShareLiveLocation?: () => void;
  onNotifyAllContacts?: () => void;
  onRequestCab?: () => void;
}

export function EmergencyGuardianModal({
  isOpen,
  onClose,
  primaryGuardian = { name: 'Sarah Johnson', relationship: 'Primary Guardian', phone: '+1 (555) 123-4567' },
  secondaryGuardian = { name: 'Michael Johnson', relationship: 'Secondary Guardian', phone: '+1 (555) 234-5678' },
  nearestSafeZone = { name: 'Central Hospital', distance: '450m away' },
  deliveryStatuses = {
    pending: false,
    call_initiated: true,
    sms_sent: true,
    notification_delivered: true,
    location_shared: true,
  },
  onCallGuardian,
  onSendSMS,
  onShareLiveLocation,
  onNotifyAllContacts,
  onRequestCab,
}: EmergencyGuardianModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border p-8 max-w-md w-full animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header with alert icon */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[var(--distress)]/10 p-3 rounded-full">
              <AlertOctagon className="w-6 h-6 text-[var(--distress)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Emergency Support</h2>
              <p className="text-xs text-muted-foreground">Activated</p>
            </div>
          </div>
        </div>

        {/* Primary Guardian */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
          <p className="text-xs text-muted-foreground font-medium mb-2">PRIMARY GUARDIAN</p>
          <p className="font-semibold text-foreground mb-1">{primaryGuardian.name}</p>
          <p className="text-xs text-muted-foreground mb-3">{primaryGuardian.relationship}</p>
          <p className="text-sm font-mono text-foreground">{primaryGuardian.phone}</p>
        </div>

        {/* Secondary Guardian */}
        <div className="bg-muted/30 border border-muted/40 rounded-xl p-4 mb-6">
          <p className="text-xs text-muted-foreground font-medium mb-2">SECONDARY GUARDIAN</p>
          <p className="font-semibold text-foreground mb-1">{secondaryGuardian.name}</p>
          <p className="text-xs text-muted-foreground mb-3">{secondaryGuardian.relationship}</p>
          <p className="text-sm font-mono text-foreground">{secondaryGuardian.phone}</p>
        </div>

        {/* Delivery Status Chips */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground font-medium mb-3 uppercase">Emergency Delivery Status</p>
          <div className="grid grid-cols-2 gap-2">
            {deliveryStatuses.call_initiated && (
              <div className="bg-[var(--safe)]/10 border border-[var(--safe)]/30 rounded-lg p-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--safe)] flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">Call Initiated</span>
              </div>
            )}
            {deliveryStatuses.sms_sent && (
              <div className="bg-[var(--safe)]/10 border border-[var(--safe)]/30 rounded-lg p-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--safe)] flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">SMS Sent</span>
              </div>
            )}
            {deliveryStatuses.notification_delivered && (
              <div className="bg-[var(--safe)]/10 border border-[var(--safe)]/30 rounded-lg p-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--safe)] flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">Notified</span>
              </div>
            )}
            {deliveryStatuses.location_shared && (
              <div className="bg-[var(--safe)]/10 border border-[var(--safe)]/30 rounded-lg p-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--safe)] flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">Tracking On</span>
              </div>
            )}
          </div>
        </div>

        {/* Nearest Safe Zone */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Nearest Safe Zone</p>
              <p className="font-semibold text-foreground">{nearestSafeZone?.name}</p>
              <p className="text-xs text-muted-foreground">{nearestSafeZone?.distance}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onCallGuardian}
            className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Call Guardian
          </button>

          <button
            onClick={onSendSMS}
            className="w-full bg-secondary/10 text-primary border border-primary/20 hover:bg-secondary/20 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Send SMS Alert
          </button>

          <button
            onClick={onShareLiveLocation}
            className="w-full bg-secondary/10 text-primary border border-primary/20 hover:bg-secondary/20 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Share Live Location
          </button>

          <button
            onClick={onNotifyAllContacts}
            className="w-full bg-secondary/10 text-primary border border-primary/20 hover:bg-secondary/20 font-semibold py-3 px-4 rounded-xl transition-all"
          >
            Notify All Contacts
          </button>

          <button
            onClick={onRequestCab}
            className="w-full bg-[var(--safe)] text-[var(--safe-foreground)] hover:opacity-90 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Car className="w-4 h-4" />
            Request Cab Pickup
          </button>

          <button
            onClick={onClose}
            className="w-full bg-muted text-foreground hover:bg-muted/80 font-semibold py-3 px-4 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
