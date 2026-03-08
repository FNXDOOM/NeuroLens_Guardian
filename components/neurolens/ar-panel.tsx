import { Camera, AlertTriangle, Eye } from 'lucide-react';

interface Detection {
  id: string;
  name: string;
  confidence: number;
  color?: string;
}

interface ARPanelProps {
  isActive?: boolean;
  detections?: Detection[];
  onToggle?: () => void;
}

export function ARPanel({ isActive = true, detections = [], onToggle }: ARPanelProps) {
  const defaultDetections: Detection[] = [
    { id: '1', name: 'Obstacle Detected', confidence: 95, color: 'warning' },
    { id: '2', name: 'Clear Path Ahead', confidence: 88, color: 'safe' },
  ];

  const displayDetections = detections.length > 0 ? detections : defaultDetections;

  return (
    <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">AR Detection</h3>
        </div>
        {isActive && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
      </div>

      {/* Camera feed placeholder */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-xl overflow-hidden mb-4 aspect-video">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        {/* Camera frame indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-2 border-primary/30 w-3/4 h-3/4 rounded-lg" />
        </div>

        {/* Detection boxes */}
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/4 border-2 border-warning rounded-lg" />
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/4 border-2 border-[var(--safe)] rounded-lg" />

        {/* Camera status indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-xs text-white font-medium">Live</span>
        </div>
      </div>

      {/* Detections list */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Current Detections</p>
        <div className="space-y-2">
          {displayDetections.map((detection) => (
            <div key={detection.id} className="flex items-center justify-between p-2 bg-secondary/5 rounded-lg border border-border">
              <div className="flex items-center gap-2 flex-1">
                <AlertTriangle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{detection.name}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">{detection.confidence}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
