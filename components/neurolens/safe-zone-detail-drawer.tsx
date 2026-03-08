'use client';

import {
  MapPin,
  Phone,
  Clock,
  Accessibility,
  Coffee,
  Wifi,
  Users,
  Navigation,
  Car,
  Star,
  Heart,
  X,
} from 'lucide-react';

interface SafeZoneDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  safeZoneName?: string;
  distance?: string;
  address?: string;
  hours?: string;
  staffAvailable?: boolean;
  amenities?: string[];
  accessibilityTags?: string[];
  supportServices?: string[];
  rating?: number;
  onRouteHere?: () => void;
  onCallSupport?: () => void;
  onSaveFavorite?: () => void;
  onRequestSafeRide?: () => void;
  isFavorite?: boolean;
}

export function SafeZoneDetailDrawer({
  isOpen,
  onClose,
  safeZoneName = 'Central Hospital',
  distance = '450m away',
  address = '123 Health Avenue, Downtown',
  hours = 'Open 24/7',
  staffAvailable = true,
  amenities = ['Wheelchair Access', 'Restrooms', 'Water Fountain', 'Seating Area'],
  accessibilityTags = ['Wheelchair Accessible', 'Elevator Access', 'Audio Guidance'],
  supportServices = ['Medical Staff', 'Security Personnel', 'Emergency Phone'],
  rating = 4.8,
  onRouteHere,
  onCallSupport,
  onSaveFavorite,
  onRequestSafeRide,
  isFavorite = false,
}: SafeZoneDetailDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-card rounded-l-2xl shadow-2xl border-l border-border overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground truncate">{safeZoneName}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Distance and address */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{distance}</span>
            </div>
            <p className="text-sm text-foreground">{address}</p>
          </div>

          {/* Hours and staff */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{hours}</span>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  staffAvailable
                    ? 'bg-[var(--safe)]/20 text-[var(--safe)]'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {staffAvailable ? 'Staff Available' : 'Staff Offline'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-foreground font-medium">{rating} rating</span>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-primary" />
              Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-muted/50 text-foreground px-3 py-1 rounded-full border border-border"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Accessibility features */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-primary" />
              Accessibility Features
            </h3>
            <div className="space-y-2">
              {accessibilityTags.map((tag, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 bg-[var(--safe)] rounded-full" />
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Support services */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Support Services
            </h3>
            <div className="space-y-2">
              {supportServices.map((service, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4 border-t border-border">
            <button
              onClick={onRouteHere}
              className="w-full flex items-center justify-center gap-2 bg-[var(--safe)] text-[var(--safe-foreground)] hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-all"
            >
              <Navigation className="w-4 h-4" />
              Route Here
            </button>

            <button
              onClick={onRequestSafeRide}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-all"
            >
              <Car className="w-4 h-4" />
              Request Safe Ride
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onCallSupport}
                className="flex items-center justify-center gap-2 bg-muted/50 text-foreground hover:bg-muted/70 font-semibold py-3 px-4 rounded-lg transition-all border border-border"
              >
                <Phone className="w-4 h-4" />
                Call Support
              </button>

              <button
                onClick={onSaveFavorite}
                className={`flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-lg transition-all border ${
                  isFavorite
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-muted/50 text-foreground border-border hover:bg-muted/70'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
