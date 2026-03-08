import { Map as MapIcon } from 'lucide-react';

interface MapPlaceholderProps {
  height?: string;
  title?: string;
  showRoute?: boolean;
}

export function MapPlaceholder({ height = 'h-96', title = 'Live Navigation', showRoute = false }: MapPlaceholderProps) {
  return (
    <div className={`${height} relative rounded-2xl overflow-hidden bg-card shadow-lg shadow-black/5 border border-border`}>
      {/* Map background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="w-4 h-4 bg-primary rounded-full shadow-lg" />
          <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/30 animate-pulse" />
        </div>
      </div>

      {/* Route line (if enabled) */}
      {showRoute && (
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
          <path
            d="M 100 200 Q 300 100, 500 250 T 800 300"
            stroke="oklch(0.55 0.15 195)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8,4"
            opacity="0.6"
          />
        </svg>
      )}

      {/* Safe zones markers (if enabled) */}
      {showRoute && (
        <>
          <div className="absolute top-1/3 left-1/3 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-[var(--safe)] rounded-full border-2 border-white shadow-md" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 z-10">
            <div className="w-3 h-3 bg-[var(--safe)] rounded-full border-2 border-white shadow-md" />
          </div>
        </>
      )}

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <MapIcon className="w-12 h-12 text-primary/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
        </div>
      </div>
    </div>
  );
}
