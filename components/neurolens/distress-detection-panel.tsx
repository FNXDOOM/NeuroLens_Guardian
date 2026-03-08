'use client';

import { AlertTriangle, MapPin, Phone, Car, Navigation } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface DistressDetectionPanelProps {
  isVisible: boolean;
  message?: string;
  nearestSafeZone?: string;
  onContactGuardian?: () => void;
  onRequestSafeRide?: () => void;
  onContinueNavigation?: () => void;
  onDismiss?: () => void;
}

export function DistressDetectionPanel({
  isVisible,
  message = 'You seem off route. Would you like help returning to the safe path?',
  nearestSafeZone = 'City Library - 280m away',
  onContactGuardian,
  onRequestSafeRide,
  onContinueNavigation,
  onDismiss,
}: DistressDetectionPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-in slide-in-from-bottom">
      <div className="max-w-2xl mx-auto px-4 pb-4">
        <div className="bg-card rounded-2xl shadow-2xl border border-[var(--warning)]/20 p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-[var(--warning)]" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">We're Here to Help</h3>
                <p className="text-sm text-muted-foreground">Let us support you</p>
              </div>
            </div>
            <StatusBadge status="warning" size="md" showIcon={true} />
          </div>

          {/* Message */}
          <div className="bg-[var(--warning)]/5 rounded-xl p-4 border border-[var(--warning)]/10">
            <p className="text-foreground leading-relaxed">{message}</p>
          </div>

          {/* Safe Zone suggestion */}
          {nearestSafeZone && (
            <div className="bg-[var(--safe)]/10 border border-[var(--safe)]/20 rounded-xl p-3 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--safe)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Nearest Safe Zone</p>
                <p className="text-sm text-muted-foreground">{nearestSafeZone}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              onClick={onContactGuardian}
              className="flex flex-col items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 font-semibold py-4 px-3 rounded-lg transition-all"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs font-medium">Contact Guardian</span>
            </button>
            <button
              onClick={onRequestSafeRide}
              className="flex flex-col items-center justify-center gap-2 bg-accent text-accent-foreground hover:opacity-90 font-semibold py-4 px-3 rounded-lg transition-all"
            >
              <Car className="w-5 h-5" />
              <span className="text-xs font-medium">Request Safe Ride</span>
            </button>
            <button
              onClick={onContinueNavigation}
              className="flex flex-col items-center justify-center gap-2 bg-[var(--safe)] text-[var(--safe-foreground)] hover:opacity-90 font-semibold py-4 px-3 rounded-lg transition-all"
            >
              <Navigation className="w-5 h-5" />
              <span className="text-xs font-medium">Continue Guide</span>
            </button>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="w-full text-sm text-muted-foreground hover:text-foreground font-medium py-2 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
