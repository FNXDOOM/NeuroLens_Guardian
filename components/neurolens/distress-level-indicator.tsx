interface DistressLevelIndicatorProps {
  level: number; // 0-100
  label?: string;
  showDetails?: boolean;
}

export function DistressLevelIndicator({ level, label = 'Distress Level', showDetails = true }: DistressLevelIndicatorProps) {
  const getColor = (value: number) => {
    if (value < 25) return 'bg-[var(--safe)]';
    if (value < 50) return 'bg-warning';
    if (value < 75) return 'bg-distress';
    return 'bg-destructive';
  };

  const getLabel = (value: number) => {
    if (value < 25) return 'Low';
    if (value < 50) return 'Moderate';
    if (value < 75) return 'High';
    return 'Critical';
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground">{label}</h3>
        <span className="text-2xl font-bold text-primary">{level}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${getColor(level)} transition-all duration-300`}
          style={{ width: `${level}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{getLabel(level)}</span>
          <span>Monitoring active</span>
        </div>
      )}

      {/* Gauge visualization */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-end justify-between h-16">
          {[...Array(5)].map((_, i) => {
            const barValue = (i + 1) * 20;
            const isActive = level >= barValue;
            return (
              <div
                key={i}
                className={`flex-1 mx-0.5 rounded-t-lg transition-all ${
                  isActive ? getColor(barValue) : 'bg-muted'
                }`}
                style={{ height: `${(i + 1) * 20}%` }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
