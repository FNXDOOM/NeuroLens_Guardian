'use client';

import { Car, MapPin, Clock, Users, CheckCircle, AlertCircle, Navigation } from 'lucide-react';

type TransportMode = 'safe_ride' | 'guardian_pickup' | 'safe_zone_transfer';

interface AssistedTransportStatusCardProps {
  mode?: TransportMode;
  driverOrPickupName?: string;
  etaMinutes?: number;
  isLiveTracking?: boolean;
  linkedGuardians?: string[];
  currentSafetyStatus?: 'safe' | 'warning' | 'distress';
  destination?: string;
  currentLocation?: string;
  onTrackLive?: () => void;
  onContactGuardian?: () => void;
  onCancelTrip?: () => void;
}

export function AssistedTransportStatusCard({
  mode = 'safe_ride',
  driverOrPickupName = 'Marcus Johnson',
  etaMinutes = 8,
  isLiveTracking = true,
  linkedGuardians = ['Sarah Johnson'],
  currentSafetyStatus = 'safe',
  destination = 'Central Hospital',
  currentLocation = '456 Oak Avenue',
  onTrackLive,
  onContactGuardian,
  onCancelTrip,
}: AssistedTransportStatusCardProps) {
  const modeConfig = {
    safe_ride: {
      title: 'Safe Ride',
      icon: Car,
      description: 'Verified assisted transport',
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
    },
    guardian_pickup: {
      title: 'Guardian Pickup',
      icon: Users,
      description: 'Arranged by guardian',
      color: 'text-accent',
      bgColor: 'bg-accent/5',
      borderColor: 'border-accent/20',
    },
    safe_zone_transfer: {
      title: 'Safe Zone Transfer',
      icon: MapPin,
      description: 'To nearby safe location',
      color: 'text-[var(--safe)]',
      bgColor: 'bg-[var(--safe)]/5',
      borderColor: 'border-[var(--safe)]/20',
    },
  };

  const safetyConfig = {
    safe: {
      label: 'Safe',
      color: 'text-[var(--safe)]',
      bgColor: 'bg-[var(--safe)]/10',
      borderColor: 'border-[var(--safe)]/20',
      icon: CheckCircle,
    },
    warning: {
      label: 'Caution',
      color: 'text-[var(--warning)]',
      bgColor: 'bg-[var(--warning)]/10',
      borderColor: 'border-[var(--warning)]/20',
      icon: AlertCircle,
    },
    distress: {
      label: 'Alert',
      color: 'text-[var(--distress)]',
      bgColor: 'bg-[var(--distress)]/10',
      borderColor: 'border-[var(--distress)]/20',
      icon: AlertCircle,
    },
  };

  const modeConfig_ = modeConfig[mode];
  const safetyConfig_ = safetyConfig[currentSafetyStatus];
  const ModeIcon = modeConfig_.icon;
  const SafetyIcon = safetyConfig_.icon;

  return (
    <div className={`${modeConfig_.bgColor} border ${modeConfig_.borderColor} rounded-2xl shadow-lg shadow-black/5 p-6 max-w-md`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg ${modeConfig_.bgColor}`}>
              <ModeIcon className={`w-5 h-5 ${modeConfig_.color}`} />
            </div>
            <h3 className="text-lg font-bold text-foreground">{modeConfig_.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{modeConfig_.description}</p>
        </div>
        <div className={`${safetyConfig_.bgColor} border ${safetyConfig_.borderColor} px-3 py-1 rounded-full flex items-center gap-1`}>
          <SafetyIcon className={`w-4 h-4 ${safetyConfig_.color}`} />
          <span className={`text-xs font-semibold ${safetyConfig_.color}`}>{safetyConfig_.label}</span>
        </div>
      </div>

      {/* Driver/Pickup Info */}
      <div className="bg-background rounded-xl p-3 mb-4 border border-border">
        <p className="text-xs text-muted-foreground font-medium mb-1">Driver/Pickup</p>
        <p className="font-semibold text-foreground">{driverOrPickupName}</p>
      </div>

      {/* Locations */}
      <div className="space-y-3 mb-4">
        <div className="flex gap-3">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium">Current Location</p>
            <p className="text-sm text-foreground font-medium truncate">{currentLocation}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Navigation className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium">Destination</p>
            <p className="text-sm text-foreground font-medium truncate">{destination}</p>
          </div>
        </div>
      </div>

      {/* ETA and Live Tracking */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-background rounded-lg p-3 border border-border text-center">
          <p className="text-xs text-muted-foreground font-medium mb-1">ETA</p>
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-4 h-4 text-primary" />
            <p className="font-semibold text-foreground">{etaMinutes}m</p>
          </div>
        </div>
        <div className={`${isLiveTracking ? 'bg-[var(--safe)]/5 border border-[var(--safe)]/20' : 'bg-background border-border'} rounded-lg p-3 border text-center`}>
          <p className="text-xs text-muted-foreground font-medium mb-1">Live Tracking</p>
          <p className={`font-semibold ${isLiveTracking ? 'text-[var(--safe)]' : 'text-muted-foreground'}`}>
            {isLiveTracking ? 'Active' : 'Off'}
          </p>
        </div>
      </div>

      {/* Linked Guardians */}
      <div className="bg-background rounded-lg p-3 mb-4 border border-border">
        <p className="text-xs text-muted-foreground font-medium mb-2">Linked Guardian(s)</p>
        <div className="flex flex-wrap gap-2">
          {linkedGuardians.map((guardian, idx) => (
            <span key={idx} className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
              {guardian}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={onTrackLive}
          className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-2 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Track Live
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onContactGuardian}
            className="bg-secondary/10 text-primary border border-primary/20 hover:bg-secondary/20 font-semibold py-2 px-4 rounded-xl transition-all text-sm"
          >
            Contact Guardian
          </button>
          <button
            onClick={onCancelTrip}
            className="bg-muted text-foreground hover:bg-muted/80 font-semibold py-2 px-4 rounded-xl transition-all text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
