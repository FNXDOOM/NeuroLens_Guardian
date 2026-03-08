'use client';

import { Phone, MessageSquare, Navigation, Car, MapPin, AlertOctagon, X } from 'lucide-react';

interface EmergencyActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isPrimaryGuardianAvailable?: boolean;
  isSecondaryGuardianAvailable?: boolean;
  onCallCaregiver?: () => void;
  onCallGuardian?: () => void;
  onSendSMSAlert?: () => void;
  onShareLiveLocation?: () => void;
  onBookSafeRide?: () => void;
  onRouteToNearestSafeZone?: () => void;
}

export function EmergencyActionSheet({
  isOpen,
  onClose,
  isPrimaryGuardianAvailable = true,
  isSecondaryGuardianAvailable = true,
  onCallCaregiver,
  onCallGuardian,
  onSendSMSAlert,
  onShareLiveLocation,
  onBookSafeRide,
  onRouteToNearestSafeZone,
}: EmergencyActionSheetProps) {
  if (!isOpen) return null;

  const actions = [
    {
      icon: Phone,
      label: 'Call Primary',
      description: 'Contact primary guardian',
      onClick: onCallCaregiver,
      available: isPrimaryGuardianAvailable,
      variant: 'primary' as const,
      priority: 1,
    },
    {
      icon: Phone,
      label: 'Call Secondary',
      description: 'Contact secondary guardian',
      onClick: onCallGuardian,
      available: isSecondaryGuardianAvailable,
      variant: 'secondary' as const,
      priority: 2,
    },
    {
      icon: MessageSquare,
      label: 'Send Alert SMS',
      description: 'Send SMS to all contacts',
      onClick: onSendSMSAlert,
      available: true,
      variant: 'secondary' as const,
      priority: 3,
    },
    {
      icon: Navigation,
      label: 'Share Location',
      description: 'Enable live location sharing',
      onClick: onShareLiveLocation,
      available: true,
      variant: 'secondary' as const,
      priority: 4,
    },
    {
      icon: Car,
      label: 'Book Safe Ride',
      description: 'Request verified cab assistance',
      onClick: onBookSafeRide,
      available: true,
      variant: 'secondary' as const,
      priority: 5,
    },
    {
      icon: MapPin,
      label: 'Safe Zone',
      description: 'Route to nearest safe location',
      onClick: onRouteToNearestSafeZone,
      available: true,
      variant: 'secondary' as const,
      priority: 6,
    },
  ];

  // Sort by priority
  const sortedActions = actions.sort((a, b) => a.priority - b.priority);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Action Sheet */}
      <div className="relative bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl border border-border w-full sm:max-w-2xl animate-in slide-in-from-bottom-5 sm:zoom-in-95">
        {/* Handle bar for mobile */}
        <div className="flex items-center justify-center py-2 sm:hidden">
          <div className="w-12 h-1 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--distress)]/10 p-3 rounded-full">
              <AlertOctagon className="w-5 h-5 text-[var(--distress)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Emergency Actions</h2>
              <p className="text-xs text-muted-foreground">Choose your next step</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6">
          {sortedActions.map((action, index) => {
            const Icon = action.icon;

            return (
              <button
                key={index}
                onClick={action.onClick}
                disabled={!action.available}
                className={`relative group rounded-xl p-4 transition-all text-left ${
                  action.variant === 'primary'
                    ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20'
                    : action.variant === 'secondary'
                      ? 'bg-muted/30 text-foreground border border-border hover:bg-muted/50'
                      : 'bg-secondary/10 text-primary border border-primary/20 hover:bg-secondary/20'
                } ${!action.available ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    action.variant === 'primary'
                      ? 'bg-white/20'
                      : action.variant === 'secondary'
                        ? 'bg-primary/10'
                        : 'bg-primary/5'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      action.variant === 'primary'
                        ? 'text-white'
                        : 'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-tight">{action.label}</p>
                    <p className={`text-xs mt-1 ${
                      action.variant === 'primary'
                        ? 'text-white/80'
                        : 'text-muted-foreground'
                    }`}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 rounded-b-t-3xl sm:rounded-b-2xl">
          <p className="text-xs text-muted-foreground text-center">
            All contacts have been pre-configured for rapid emergency response. Your location is secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
