'use client';

import { Car, MapPin, Clock, CheckCircle, AlertCircle, Star, Phone, MessageSquare } from 'lucide-react';
import { StatusBadge } from './status-badge';

type RideStatus = 'searching' | 'driver_assigned' | 'arriving' | 'in_progress' | 'shared_with_guardian';

interface TrustedCabAssistanceProps {
  isOpen: boolean;
  status?: RideStatus;
  pickupLocation?: string;
  destination?: string;
  estimatedArrival?: string;
  driverName?: string;
  driverRating?: number;
  vehicleInfo?: string;
  guardianNotified?: boolean;
  verifiedBadge?: boolean;
  onBookRide?: () => void;
  onCancelRide?: () => void;
  onContactDriver?: () => void;
  onShareWithGuardian?: () => void;
  onClose?: () => void;
}

export function TrustedCabAssistance({
  isOpen,
  status = 'searching',
  pickupLocation = '456 Oak Avenue, Downtown',
  destination = 'Central Hospital',
  estimatedArrival = '5 minutes',
  driverName = 'Marcus Johnson',
  driverRating = 4.9,
  vehicleInfo = 'Blue Honda Civic • License: ABC 123',
  guardianNotified = true,
  verifiedBadge = true,
  onBookRide,
  onCancelRide,
  onContactDriver,
  onShareWithGuardian,
  onClose,
}: TrustedCabAssistanceProps) {
  if (!isOpen) return null;

  const statusConfig = {
    searching: {
      title: 'Finding Safe Cab',
      description: 'Searching for verified driver...',
      statusBadge: { status: 'warning' as const, size: 'md' as const, showIcon: true },
      progressPercent: 33,
    },
    driver_assigned: {
      title: 'Driver Assigned',
      description: 'Your trusted driver is confirmed',
      statusBadge: { status: 'safe' as const, size: 'md' as const, showIcon: true },
      progressPercent: 66,
    },
    arriving: {
      title: 'Driver Arriving',
      description: 'Your safe cab will be here soon',
      statusBadge: { status: 'safe' as const, size: 'md' as const, showIcon: true },
      progressPercent: 80,
    },
    in_progress: {
      title: 'Trip in Progress',
      description: 'Safe ride underway to destination',
      statusBadge: { status: 'safe' as const, size: 'md' as const, showIcon: true },
      progressPercent: 100,
    },
    shared_with_guardian: {
      title: 'Trip Shared with Guardian',
      description: 'Your guardian is monitoring this trip',
      statusBadge: { status: 'safe' as const, size: 'md' as const, showIcon: true },
      progressPercent: 100,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border p-8 max-w-md w-full animate-in slide-in-from-bottom-5">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Car className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">{config.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${config.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Location info */}
        <div className="bg-muted/30 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium">Pickup</p>
              <p className="text-sm text-foreground font-medium truncate">{pickupLocation}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium">Destination</p>
              <p className="text-sm text-foreground font-medium truncate">{destination}</p>
            </div>
          </div>
        </div>

        {/* Driver info */}
        {status !== 'searching' && (
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 mb-6 border border-primary/10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Verified Driver</p>
                <p className="font-semibold text-foreground">{driverName}</p>
              </div>
              {verifiedBadge && (
                <div className="flex items-center gap-1 bg-[var(--safe)] text-[var(--safe-foreground)] px-2 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(driverRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{driverRating}</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">{vehicleInfo}</p>
          </div>
        )}

        {/* ETA and status chips */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground font-medium mb-1">Est. Arrival</p>
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-primary" />
              <p className="font-semibold text-foreground">{estimatedArrival}</p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground font-medium mb-1">Status</p>
            <p className="font-semibold text-[var(--safe)]">Protected</p>
          </div>
        </div>

        {/* Guardian notification status */}
        {guardianNotified && (
          <div className="bg-[var(--safe)]/5 border border-[var(--safe)]/20 rounded-lg p-3 mb-6 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[var(--safe)] flex-shrink-0" />
            <p className="text-sm text-foreground">Guardian has been notified</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          {status === 'searching' && (
            <button
              onClick={onBookRide}
              className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Book Safe Ride
            </button>
          )}
          
          {status !== 'searching' && (
            <>
              <button
                onClick={onShareWithGuardian}
                className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-xl transition-all"
              >
                Share Trip with Guardian
              </button>
              <button
                onClick={onContactDriver}
                className="w-full bg-secondary/10 text-primary border border-primary/20 hover:bg-secondary/20 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Contact Driver
              </button>
            </>
          )}

          <button
            onClick={onCancelRide}
            className="w-full bg-muted text-foreground hover:bg-muted/80 font-semibold py-3 px-4 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
