'use client';

import { Bus, MapPin, Clock, AlertTriangle, CheckCircle, Navigation, Phone, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Public Transport Assistance Panel
 * 
 * Displays transit journey status, bus information, and assistance controls
 */
export function PublicTransportPanel({
  transitState = 'inactive',
  currentStop = null,
  targetStop = null,
  targetBus = null,
  nextStop = null,
  waitingTime = 0,
  boardingStatus = null,
  guardianNotified = false,
  safeRideFallback = false,
  distressReason = null,
  onIdentifyBus = () => {},
  onBoardBus = () => {},
  onCallGuardian = () => {},
  onRequestSafeRide = () => {},
  onCancelJourney = () => {},
}) {
  /**
   * Get state badge variant
   */
  const getStateBadge = () => {
    const badges = {
      inactive: { variant: 'secondary', label: 'Not Active', icon: null },
      walking_to_stop: { variant: 'default', label: 'Walking to Stop', icon: Navigation },
      waiting_for_bus: { variant: 'secondary', label: 'Waiting for Bus', icon: Clock },
      bus_identified: { variant: 'default', label: 'Bus Identified', icon: CheckCircle },
      boarding: { variant: 'default', label: 'Boarding', icon: Bus },
      in_transit: { variant: 'default', label: 'In Transit', icon: Bus },
      prepare_to_exit: { variant: 'destructive', label: 'Prepare to Exit', icon: AlertTriangle },
      missed_stop_warning: { variant: 'destructive', label: 'Missed Stop', icon: AlertTriangle },
      transit_distress: { variant: 'destructive', label: 'Transit Distress', icon: AlertTriangle },
      safe_ride_fallback: { variant: 'secondary', label: 'Safe Ride Fallback', icon: Car },
      completed: { variant: 'default', label: 'Completed', icon: CheckCircle },
    };

    return badges[transitState] || badges.inactive;
  };

  /**
   * Get assistance message
   */
  const getAssistanceMessage = () => {
    const messages = {
      walking_to_stop: 'Your bus stop is ahead. Follow the navigation.',
      waiting_for_bus: `Waiting for bus ${targetBus?.number || ''}. Stay near the stop.`,
      bus_identified: 'The correct bus has arrived. Please prepare to board.',
      boarding: 'Boarding in progress. Take your time.',
      in_transit: `You are now in transit. ${nextStop ? `Next stop: ${nextStop.name}` : ''}`,
      prepare_to_exit: 'Your stop is next. Prepare to get down.',
      missed_stop_warning: 'You may have missed your stop. I can help you.',
      transit_distress: 'I am here to help. Your guardian has been notified.',
      safe_ride_fallback: 'Safe Ride is on the way. Stay where you are.',
    };

    return messages[transitState] || 'Start a transit journey to get assistance.';
  };

  const stateBadge = getStateBadge();
  const StateBadgeIcon = stateBadge.icon;
  const isActive = transitState !== 'inactive' && transitState !== 'completed';

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Public Transport Assist
          </CardTitle>
          <Badge variant={stateBadge.variant} className="flex items-center gap-1">
            {StateBadgeIcon && <StateBadgeIcon className="h-3 w-3" />}
            {stateBadge.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Assistance Message */}
        <Alert>
          <AlertDescription className="text-sm">
            {getAssistanceMessage()}
          </AlertDescription>
        </Alert>

        {/* Current Stop Info */}
        {currentStop && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Current Stop</p>
                <p className="text-xs text-muted-foreground">{currentStop.name}</p>
                {currentStop.distance && (
                  <p className="text-xs text-muted-foreground">
                    {Math.round(currentStop.distance)}m away
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Target Bus Info */}
        {targetBus && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Bus className="h-4 w-4 mt-0.5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Bus Route</p>
                <p className="text-xs text-muted-foreground">
                  {targetBus.number} - {targetBus.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Target Stop Info */}
        {targetStop && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-orange-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Destination Stop</p>
                <p className="text-xs text-muted-foreground">{targetStop.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Stop Info */}
        {nextStop && transitState === 'in_transit' && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Navigation className="h-4 w-4 mt-0.5 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Next Stop</p>
                <p className="text-xs text-muted-foreground">{nextStop.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Waiting Time */}
        {transitState === 'waiting_for_bus' && waitingTime > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Waiting: {Math.floor(waitingTime / 60)}m {waitingTime % 60}s
            </span>
          </div>
        )}

        {/* Guardian Notification Status */}
        {guardianNotified && (
          <Alert>
            <Phone className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Guardian has been notified and is monitoring your journey.
            </AlertDescription>
          </Alert>
        )}

        {/* Safe Ride Fallback Status */}
        {safeRideFallback && (
          <Alert>
            <Car className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Safe Ride has been requested. Stay at your current location.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {transitState === 'waiting_for_bus' && (
            <Button
              onClick={onIdentifyBus}
              className="w-full"
              variant="default"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              My Bus Arrived
            </Button>
          )}

          {transitState === 'bus_identified' && (
            <Button
              onClick={onBoardBus}
              className="w-full"
              variant="default"
            >
              <Bus className="h-4 w-4 mr-2" />
              Board Bus
            </Button>
          )}

          {(transitState === 'missed_stop_warning' || transitState === 'transit_distress') && (
            <>
              <Button
                onClick={onCallGuardian}
                className="w-full"
                variant="outline"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Guardian
              </Button>
              <Button
                onClick={onRequestSafeRide}
                className="w-full"
                variant="default"
              >
                <Car className="h-4 w-4 mr-2" />
                Request Safe Ride
              </Button>
            </>
          )}

          {isActive && transitState !== 'safe_ride_fallback' && (
            <Button
              onClick={onCancelJourney}
              className="w-full"
              variant="ghost"
              size="sm"
            >
              Cancel Journey
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PublicTransportPanel;
