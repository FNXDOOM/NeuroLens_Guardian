import { MapPin, Shield } from 'lucide-react';

interface SafeZoneCardProps {
  name: string;
  distance: string;
  address: string;
  amenities?: string[];
  isNearest?: boolean;
}

export function SafeZoneCard({ name, distance, address, amenities = [], isNearest = false }: SafeZoneCardProps) {
  return (
    <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
            {isNearest && <p className="text-xs text-primary font-medium">Nearest Safe Zone</p>}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">{distance} away</p>
            <p className="text-xs">{address}</p>
          </div>
        </div>

        {amenities.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span key={amenity} className="text-xs bg-secondary/10 text-primary px-2 py-1 rounded-md">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
