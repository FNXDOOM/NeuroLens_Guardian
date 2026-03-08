'use client';

import { Car, MapPin, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';

type RideStatus = 'searching' | 'assigned' | 'arriving' | 'in_progress' | 'shared';

interface SafeRideAssistanceProps {
  isOpen: boolean;
  status?: RideStatus;
  pickupLocation?: string;
  destination?: string;
  estimatedPickup?: string;
  driverName?: string;
  driverVerified?: boolean;
  vehicleInfo?: string;
  guardianNotified?: boolean;
  onRequestRide?: () => void;
  onCancelRide?: () => void;
  onTrackRide?: () => void;
  onClose?: () => void;
}

export function SafeRideAssistance({
  isOpen,
  status = 'searching',
  pickupLocation = '456 Oak Avenue, Downtown',
  destination = 'Central Hospital',
  estimatedPickup = '5 minutes',
  driverName = 'Marcus Johnson',
  driverVerified = true,
  vehicleInfo = 'Blue Honda Civic • License: ABC 123',
  guardianNotified = true,
  onRequestRide,
  onCancelRide,
  onTrackRide,
  onClose,
}: SafeRideAssistanceProps) {
  if (!isOpen) return null;

  const statusConfig = {
    searching: {
      title: 'Finding Safe Ride',
      description: 'Searching for verified driver in your area...',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    assigned: {
      title: 'Driver Assigned',
      description: 'Your verified driver is on the way',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    },
    arriving: {
      title: 'Driver Arriving',
      description: 'Your safe ride is almost here',
      color: 'text-[var(--safe)]',
      bgColor: 'bg-[var(--safe)]/10',
      borderColor: 'border-[var(--safe)]/20',
    },
    in_progress: {
      title: 'Ride in Progress',
      description: 'You are on your way to destination',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    shared: {
      title: 'Trip Shared with Guardian',
      description: 'Your guardian is tracking this trip',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-card rounded-t-2xl md:rounded-2xl shadow-2xl border border-border p-6 max-w-md w-full md:max-h-96 overflow-auto">
        {/* Header */}
        <div className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4 mb-6`}>
          <div className="flex items-center gap-3 mb-2">
            <Car className={`w-6 h-6 ${config.color}`} />
            <h2 className={`text-lg font-bold ${config.color}`}>{config.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>

        {/* Location and destination */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 bg-foreground rounded-full" />
              <div className="w-0.5 h-8 bg-border" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pickup</p>
              <p className="text-sm text-foreground font-medium">{pickupLocation}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 bg-[var(--safe)] rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Destination</p>
              <p className="text-sm text-foreground font-medium">{destination}</p>
            </div>
          </div>
        </div>

        {/* Estimated time */}
        {status === 'searching' || status === 'assigned' ? (
          <div className="flex items-center gap-2 mb-6 p-3 bg-muted/30 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">ETA: {estimatedPickup}</span>
          </div>
        ) : null}

        {/* Driver info */}
        {(status === 'assigned' || status === 'arriving' || status === 'in_progress') && (
          <div className="bg-muted/20 rounded-xl p-4 mb-6 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{driverName}</p>
                <p className="text-xs text-muted-foreground">{vehicleInfo}</p>
              </div>
              {driverVerified && (
                <div className="flex items-center gap-1 bg-[var(--safe)]/10 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3 text-[var(--safe)]" />
                  <span className="text-xs font-medium text-[var(--safe)]">Verified</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">Excellent safety rating</span>
            </div>
          </div>
        )}

        {/* Guardian notification */}
        {guardianNotified && (
          <div className="flex items-center gap-2 p-3 bg-[var(--safe)]/10 rounded-lg mb-6 border border-[var(--safe)]/20">
            <CheckCircle className="w-4 h-4 text-[var(--safe)]" />
            <span className="text-sm text-foreground">Guardian has been notified and is tracking this trip</span>
          </div>
        )}

        {/* Action buttons */}
        {status === 'searching' ? (
          <div className="space-y-3">
            <button
              onClick={onRequestRide}
              className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-4 px-4 rounded-lg transition-all"
            >
              Confirm Safe Ride Request
            </button>
            <button
              onClick={onCancelRide}
              className="w-full border border-border hover:bg-muted/50 font-semibold py-3 px-4 rounded-lg transition-all text-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={onTrackRide}
              className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-4 px-4 rounded-lg transition-all"
            >
              Track Live Location
            </button>
            <button
              onClick={onCancelRide}
              className="w-full border border-border hover:bg-muted/50 font-semibold py-3 px-4 rounded-lg transition-all text-foreground"
            >
              Report Issue
            </button>
          </div>
        )}

        {/* Footer info */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          {status === 'in_progress'
            ? 'Your location is private and only visible to your guardian'
            : 'Your safety is our priority. All drivers are background verified.'}
        </p>
      </div>
    </div>
  );
}
