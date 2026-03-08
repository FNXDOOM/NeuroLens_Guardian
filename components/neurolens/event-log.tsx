import { Clock, AlertCircle, CheckCircle, Navigation } from 'lucide-react';

interface LogEvent {
  id: string;
  timestamp: string;
  type: 'status' | 'navigation' | 'alert' | 'detection';
  title: string;
  description?: string;
  severity?: 'info' | 'warning' | 'alert';
}

interface EventLogProps {
  events: LogEvent[];
  title?: string;
  maxHeight?: string;
}

export function EventLog({ events, title = 'Activity Log', maxHeight = 'max-h-96' }: EventLogProps) {
  const getEventIcon = (type: LogEvent['type']) => {
    switch (type) {
      case 'status':
        return <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />;
      case 'navigation':
        return <Navigation className="w-5 h-5 text-accent flex-shrink-0" />;
      case 'alert':
      case 'detection':
        return <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />;
    }
  };

  const getSeverityColor = (severity?: LogEvent['severity']) => {
    switch (severity) {
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'alert':
        return 'bg-distress/10 border-distress/20';
      default:
        return 'bg-secondary/5 border-border';
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-8">
      <h3 className="font-semibold text-lg text-foreground mb-4">{title}</h3>

      <div className={`${maxHeight} overflow-y-auto space-y-3 pr-2`}>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className={`flex gap-3 p-3 rounded-lg border ${getSeverityColor(event.severity)}`}>
              {getEventIcon(event.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-foreground text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground flex-shrink-0">{event.timestamp}</p>
                </div>
                {event.description && <p className="text-xs text-muted-foreground mt-1">{event.description}</p>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-sm py-8">No events yet</p>
        )}
      </div>
    </div>
  );
}
