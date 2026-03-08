'use client'

import { Play, Pause, SkipForward, SkipBack, RotateCcw, Trash2, Filter } from 'lucide-react'
import { EVENT_TYPES, EVENT_SEVERITY } from '@/hooks/useJourneyReplay'

interface JourneyReplayPanelProps {
  events: Array<{
    id: string
    timestamp: Date
    eventType: string
    severity: string
    description: string
    metadata?: any
  }>
  isPlaying: boolean
  currentEventIndex: number
  filter: string
  onStartPlayback: () => void
  onStopPlayback: () => void
  onNextEvent: () => void
  onPreviousEvent: () => void
  onResetPlayback: () => void
  onSetFilter: (filter: string) => void
  onClearEvents: () => void
}

export function JourneyReplayPanel({
  events,
  isPlaying,
  currentEventIndex,
  filter,
  onStartPlayback,
  onStopPlayback,
  onNextEvent,
  onPreviousEvent,
  onResetPlayback,
  onSetFilter,
  onClearEvents,
}: JourneyReplayPanelProps) {
  const getEventIcon = (eventType: string) => {
    const icons: Record<string, string> = {
      [EVENT_TYPES.JOURNEY_STARTED]: '🚶',
      [EVENT_TYPES.ROUTE_UPDATED]: '🗺️',
      [EVENT_TYPES.HAZARD_DETECTED]: '⚠️',
      [EVENT_TYPES.PREDICTIVE_HAZARD]: '🔮',
      [EVENT_TYPES.DISTRESS_TRIGGERED]: '😰',
      [EVENT_TYPES.SAFE_ZONE_RECOMMENDED]: '🏥',
      [EVENT_TYPES.GUARDIAN_NOTIFIED]: '👤',
      [EVENT_TYPES.EMERGENCY_ACTIVATED]: '🚨',
      [EVENT_TYPES.SAFE_RIDE_REQUESTED]: '🚕',
      [EVENT_TYPES.RIDE_IN_PROGRESS]: '🚗',
      [EVENT_TYPES.RIDE_COMPLETED]: '✅',
      [EVENT_TYPES.GUIDANCE_RECEIVED]: '💬',
      [EVENT_TYPES.VOICE_COMMAND]: '🎤',
      [EVENT_TYPES.ROUTE_DEVIATION]: '↪️',
    }
    return icons[eventType] || '📍'
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      [EVENT_SEVERITY.INFO]: 'bg-blue-500/10 border-blue-500/20 text-blue-600',
      [EVENT_SEVERITY.WARNING]: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600',
      [EVENT_SEVERITY.DANGER]: 'bg-orange-500/10 border-orange-500/20 text-orange-600',
      [EVENT_SEVERITY.EMERGENCY]: 'bg-red-500/10 border-red-500/20 text-red-600',
    }
    return colors[severity] || colors[EVENT_SEVERITY.INFO]
  }

  const getSeverityDot = (severity: string) => {
    const colors: Record<string, string> = {
      [EVENT_SEVERITY.INFO]: 'bg-blue-500',
      [EVENT_SEVERITY.WARNING]: 'bg-yellow-500',
      [EVENT_SEVERITY.DANGER]: 'bg-orange-500',
      [EVENT_SEVERITY.EMERGENCY]: 'bg-red-500',
    }
    return colors[severity] || colors[EVENT_SEVERITY.INFO]
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const filters = [
    { value: 'all', label: 'All Events' },
    { value: 'hazard', label: 'Hazards' },
    { value: 'distress', label: 'Distress' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'ride', label: 'Rides' },
    { value: 'guidance', label: 'Guidance' },
  ]

  return (
    <div className="bg-card rounded-2xl shadow-lg shadow-black/5 border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-muted/30 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Journey Replay</h2>
            <p className="text-sm text-muted-foreground">
              {events.length} event{events.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
          
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => onSetFilter(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {filters.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      {events.length > 0 && (
        <div className="bg-muted/20 px-6 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={onPreviousEvent}
                disabled={currentEventIndex <= 0}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous event"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {isPlaying ? (
                <button
                  onClick={onStopPlayback}
                  className="p-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg transition-all"
                  title="Pause playback"
                >
                  <Pause className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onStartPlayback}
                  className="p-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg transition-all"
                  title="Start playback"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onNextEvent}
                disabled={currentEventIndex >= events.length - 1}
                className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next event"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={onResetPlayback}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Reset playback"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentEventIndex >= 0 ? currentEventIndex + 1 : 0} / {events.length}
              </span>
              
              <button
                onClick={onClearEvents}
                className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                title="Clear all events"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Timeline */}
      <div className="max-h-96 overflow-y-auto">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold mb-1">No Events Recorded</p>
            <p className="text-sm text-muted-foreground text-center">
              Journey events will appear here as they occur
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

            {/* Events */}
            <div className="space-y-0">
              {events.map((event, index) => {
                const isActive = index === currentEventIndex
                const isPast = currentEventIndex >= 0 && index < currentEventIndex

                return (
                  <div
                    key={event.id}
                    className={`relative flex gap-4 p-4 transition-all ${
                      isActive
                        ? 'bg-primary/5 border-l-4 border-l-primary'
                        : isPast
                        ? 'opacity-50'
                        : ''
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                          isActive
                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                            : 'bg-card border-2 border-border'
                        }`}
                      >
                        {getEventIcon(event.eventType)}
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-foreground text-sm">
                          {event.description}
                        </p>
                        <span
                          className={`flex-shrink-0 w-2 h-2 rounded-full ${getSeverityDot(
                            event.severity
                          )}`}
                        />
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(event.timestamp)}
                        </span>

                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityColor(
                            event.severity
                          )}`}
                        >
                          {event.severity}
                        </span>
                      </div>

                      {/* Metadata */}
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {Object.entries(event.metadata).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
