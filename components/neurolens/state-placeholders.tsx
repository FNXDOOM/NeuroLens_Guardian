'use client';

import { Loader, MapPin, AlertTriangle, Signal, AlertOctagon, Heart } from 'lucide-react';

type StateType = 'loading' | 'empty' | 'error';
type LoadingSubtype = 'gps' | 'ar' | 'zones' | 'caregiver';
type EmptySubtype = 'alerts' | 'journey' | 'zones';
type ErrorSubtype = 'camera' | 'location' | 'network' | 'offline';

interface StateProps {
  state: StateType;
  subtype?: LoadingSubtype | EmptySubtype | ErrorSubtype;
  onRetry?: () => void;
}

export function LoadingState({ subtype = 'gps', onRetry }: { subtype?: LoadingSubtype; onRetry?: () => void }) {
  const loadingMessages = {
    gps: {
      title: 'Connecting GPS',
      description: 'Acquiring your location...',
      icon: MapPin,
    },
    ar: {
      title: 'Activating AR Detection',
      description: 'Initializing camera and hazard detection...',
      icon: Signal,
    },
    zones: {
      title: 'Loading Safe Zones',
      description: 'Finding nearby Safe Zones...',
      icon: MapPin,
    },
    caregiver: {
      title: 'Connecting Caregiver Dashboard',
      description: 'Syncing with your guardian...',
      icon: Heart,
    },
  };

  const config = loadingMessages[subtype];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="mb-6">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
          <Icon className="w-8 h-8 text-primary absolute inset-0 m-auto" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{config.title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{config.description}</p>
      <div className="mt-6 flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
      </div>
    </div>
  );
}

export function EmptyState({ subtype = 'alerts', onRetry }: { subtype?: EmptySubtype; onRetry?: () => void }) {
  const emptyMessages = {
    alerts: {
      title: 'No Alerts',
      description: 'Everything looks good! No warnings or alerts at this time.',
      icon: Heart,
    },
    journey: {
      title: 'No Active Journey',
      description: 'Start a new journey to get navigation assistance.',
      icon: MapPin,
    },
    zones: {
      title: 'No Safe Zones Nearby',
      description: 'We could not find any Safe Zones within your current area.',
      icon: MapPin,
    },
  };

  const config = emptyMessages[subtype];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{config.title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{config.description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Refresh
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  subtype = 'network',
  onRetry,
}: {
  subtype?: ErrorSubtype;
  onRetry?: () => void;
}) {
  const errorMessages = {
    camera: {
      title: 'Camera Unavailable',
      description: 'Please enable camera access in settings to use AR hazard detection.',
      icon: AlertTriangle,
    },
    location: {
      title: 'Location Access Denied',
      description: 'Location services are required for navigation. Please enable in settings.',
      icon: MapPin,
    },
    network: {
      title: 'Network Disconnected',
      description: 'Please check your internet connection and try again.',
      icon: Signal,
    },
    offline: {
      title: 'Caregiver Offline',
      description: 'Your guardian is currently offline but your journey is still being tracked.',
      icon: Heart,
    },
  };

  const config = errorMessages[subtype];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-[var(--warning)]/10 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-[var(--warning)]" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{config.title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{config.description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-primary-foreground hover:opacity-90 font-semibold py-2 px-6 rounded-lg text-sm transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function StatePlaceholder({ state, subtype = 'gps', onRetry }: StateProps) {
  switch (state) {
    case 'loading':
      return <LoadingState subtype={subtype as LoadingSubtype} onRetry={onRetry} />;
    case 'empty':
      return <EmptyState subtype={subtype as EmptySubtype} onRetry={onRetry} />;
    case 'error':
      return <ErrorState subtype={subtype as ErrorSubtype} onRetry={onRetry} />;
    default:
      return null;
  }
}
