'use client';

import { Play, AlertTriangle, MapPin, AlertOctagon, Navigation, Car, MapPinCheck, Clock } from 'lucide-react';

type TimelineEventType = 'start' | 'obstacle' | 'deviation' | 'distress' | 'sos' | 'suggestion' | 'ride' | 'complete';

interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'alert';
}

interface JourneyTimelineProps {
  events?: TimelineEvent[];
  currentEventId?: string;
}

export function JourneyTimeline({
  events = [
    {
      id: '1',
      type: 'start',
      title: 'Journey Started',
      description: 'Heading to Central Library',
      timestamp: '2:20 PM',
      severity: 'info',
    },
    {
      id: '2',
      type: 'deviation',
      title: 'Route Deviation',
      description: 'Off planned route, guidance provided',
      timestamp: '2:25 PM',
      severity: 'warning',
    },
    {
      id: '3',
      type: 'obstacle',
      title: 'Obstacle Detected',
      description: 'Construction barrier, route adjusted',
      timestamp: '2:28 PM',
      severity: 'warning',
    },
    {
      id: '4',
      type: 'distress',
      title: 'Distress Detected',
      description: 'System detected confusion at intersection',
      timestamp: '2:34 PM',
      severity: 'alert',
    },
    {
      id: '5',
      type: 'suggestion',
      title: 'Safe Zone Suggested',
      description: 'Central Library recommended',
      timestamp: '2:35 PM',
      severity: 'info',
    },
    {
      id: '6',
      type: 'complete',
      title: 'Safe Zone Reached',
      description: 'Arrived at Central Library',
      timestamp: '2:42 PM',
      severity: 'info',
    },
  ],
  currentEventId = '4',
}: JourneyTimelineProps) {
  const getEventIcon = (type: TimelineEventType) => {
    switch (type) {
      case 'start':
        return Play;
      case 'obstacle':
        return AlertTriangle;
      case 'deviation':
        return Navigation;
      case 'distress':
        return AlertOctagon;
      case 'sos':
        return AlertOctagon;
      case 'suggestion':
        return MapPin;
      case 'ride':
        return Car;
      case 'complete':
        return MapPinCheck;
      default:
        return Clock;
    }
  };

  const getEventColor = (severity?: string, type?: TimelineEventType) => {
    if (severity === 'alert' || type === 'sos')
      return { bg: 'bg-[var(--distress)]/10', border: 'border-[var(--distress)]/30', icon: 'text-[var(--distress)]' };
    if (severity === 'warning')
      return { bg: 'bg-[var(--warning)]/10', border: 'border-[var(--warning)]/30', icon: 'text-[var(--warning)]' };
    return { bg: 'bg-primary/10', border: 'border-primary/30', icon: 'text-primary' };
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border p-6">
      <h3 className="font-semibold text-lg text-foreground mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Journey Timeline
      </h3>

      <div className="space-y-0">
        {events.map((event, index) => {
          const Icon = getEventIcon(event.type);
          const colors = getEventColor(event.severity, event.type);
          const isCurrent = event.id === currentEventId;

          return (
            <div key={event.id}>
              <div className="flex gap-4 pb-6">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                      isCurrent
                        ? `${colors.bg} border-current ${colors.icon} ring-2 ring-current ring-offset-2`
                        : `${colors.bg} border-current ${colors.icon}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < events.length - 1 && (
                    <div className={`w-0.5 h-12 ${isCurrent ? 'bg-current' : 'bg-border'} mt-2`} />
                  )}
                </div>

                {/* Event content */}
                <div
                  className={`flex-1 pt-1 ${
                    isCurrent
                      ? `${colors.bg} border ${colors.border} rounded-xl p-4 -ml-4 pl-4`
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                      )}
                    </div>
                    {isCurrent && (
                      <span className="text-xs font-bold uppercase tracking-wide px-2 py-1 bg-current text-white rounded-full flex-shrink-0 ml-2">
                        Now
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{event.timestamp}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{events.length}</p>
          <p className="text-xs text-muted-foreground">Events</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">
            {Math.floor((Math.random() * 15 + 10) * 1)}m
          </p>
          <p className="text-xs text-muted-foreground">Distance</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">22 min</p>
          <p className="text-xs text-muted-foreground">Duration</p>
        </div>
      </div>
    </div>
  );
}
