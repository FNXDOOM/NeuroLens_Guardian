'use client';

import { useState } from 'react';
import { Navbar } from '@/components/neurolens/navbar';
import { PublicTransportPanel } from '@/components/neurolens/public-transport-panel';
import { DemoControlPanel } from '@/components/neurolens/demo-control-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bus, Play, SkipForward, AlertTriangle, CheckCircle } from 'lucide-react';
import usePublicTransport from '@/hooks/usePublicTransport';

export default function PublicTransportPage() {
  const [userLocation] = useState({ lat: 12.9716, lng: 77.5946 }); // Bangalore

  const {
    transitState,
    currentStop,
    targetStop,
    targetBus,
    nextStop,
    waitingTime,
    boardingStatus,
    guardianNotified,
    safeRideFallback,
    distressReason,
    startTransitJourney,
    reachBusStop,
    identifyBus,
    boardBus,
    updateCurrentStop,
    completeJourney,
    triggerTransitDistress,
    activateSafeRideFallback,
    cancelTransitJourney,
    findNearestStop,
    getGuidanceMessage,
    TRANSIT_STATES,
    TRANSIT_DISTRESS_REASONS,
  } = usePublicTransport({
    userLocation,
    enabled: true,
    onStateChange: (newState, oldState) => {
      console.log('Transit state changed:', oldState, '->', newState);
    },
    onDistress: (distressInfo) => {
      console.log('Transit distress:', distressInfo);
    },
  });

  /**
   * Demo: Start journey
   */
  const handleDemoStart = () => {
    const bus = {
      id: 'route_1',
      number: '335E',
      name: 'Kempegowda Bus Station to Whitefield',
    };
    const destination = {
      id: 'stop_5',
      name: 'Whitefield',
      lat: 12.9698,
      lng: 77.7499,
    };
    startTransitJourney(bus, destination);
  };

  /**
   * Demo: Reach stop
   */
  const handleDemoReachStop = () => {
    const stop = {
      id: 'stop_2',
      name: 'Shivaji Nagar',
      lat: 12.9866,
      lng: 77.6006,
      distance: 50,
    };
    reachBusStop(stop);
  };

  /**
   * Demo: Identify bus
   */
  const handleDemoIdentifyBus = () => {
    identifyBus();
  };

  /**
   * Demo: Board bus
   */
  const handleDemoBoardBus = () => {
    boardBus();
  };

  /**
   * Demo: Next stop
   */
  const handleDemoNextStop = () => {
    const stop = {
      id: 'stop_3',
      name: 'Indiranagar',
      lat: 12.9716,
      lng: 77.6412,
    };
    updateCurrentStop(stop);
  };

  /**
   * Demo: Prepare to exit
   */
  const handleDemoPrepareExit = () => {
    const stop = {
      id: 'stop_4',
      name: 'Marathahalli',
      lat: 12.9591,
      lng: 77.6974,
    };
    updateCurrentStop(stop);
  };

  /**
   * Demo: Missed stop
   */
  const handleDemoMissedStop = () => {
    const stop = {
      id: 'stop_6',
      name: 'Past Whitefield',
      lat: 12.9800,
      lng: 77.7600,
    };
    updateCurrentStop(stop);
  };

  /**
   * Demo: Transit distress
   */
  const handleDemoDistress = () => {
    triggerTransitDistress(TRANSIT_DISTRESS_REASONS.MANUAL_HELP_REQUEST);
  };

  /**
   * Demo: Safe Ride fallback
   */
  const handleDemoSafeRide = () => {
    activateSafeRideFallback();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bus className="h-8 w-8" />
              Public Transport Assist
            </h1>
            <p className="text-muted-foreground mt-1">
              Safe bus journey assistance for elderly users
            </p>
          </div>
          <Badge variant="default" className="text-sm">
            Demo Mode
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transit Assistance Panel */}
          <div>
            <PublicTransportPanel
              transitState={transitState}
              currentStop={currentStop}
              targetStop={targetStop}
              targetBus={targetBus}
              nextStop={nextStop}
              waitingTime={waitingTime}
              boardingStatus={boardingStatus}
              guardianNotified={guardianNotified}
              safeRideFallback={safeRideFallback}
              distressReason={distressReason}
              onIdentifyBus={identifyBus}
              onBoardBus={boardBus}
              onCallGuardian={() => console.log('Call guardian')}
              onRequestSafeRide={activateSafeRideFallback}
              onCancelJourney={cancelTransitJourney}
            />
          </div>

          {/* Demo Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Demo Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={handleDemoStart}
                  className="w-full"
                  variant="default"
                  disabled={transitState !== TRANSIT_STATES.INACTIVE}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Transit Journey
                </Button>

                <Button
                  onClick={handleDemoReachStop}
                  className="w-full"
                  variant="outline"
                  disabled={transitState !== TRANSIT_STATES.WALKING_TO_STOP}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reach Bus Stop
                </Button>

                <Button
                  onClick={handleDemoIdentifyBus}
                  className="w-full"
                  variant="outline"
                  disabled={transitState !== TRANSIT_STATES.WAITING_FOR_BUS}
                >
                  <Bus className="h-4 w-4 mr-2" />
                  Bus Arrived
                </Button>

                <Button
                  onClick={handleDemoBoardBus}
                  className="w-full"
                  variant="outline"
                  disabled={transitState !== TRANSIT_STATES.BUS_IDENTIFIED}
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Board Bus
                </Button>

                <Button
                  onClick={handleDemoNextStop}
                  className="w-full"
                  variant="outline"
                  disabled={transitState !== TRANSIT_STATES.IN_TRANSIT}
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Next Stop
                </Button>

                <Button
                  onClick={handleDemoPrepareExit}
                  className="w-full"
                  variant="outline"
                  disabled={transitState !== TRANSIT_STATES.IN_TRANSIT}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Prepare to Exit
                </Button>

                <Button
                  onClick={handleDemoMissedStop}
                  className="w-full"
                  variant="destructive"
                  disabled={transitState !== TRANSIT_STATES.IN_TRANSIT}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Simulate Missed Stop
                </Button>

                <Button
                  onClick={handleDemoDistress}
                  className="w-full"
                  variant="destructive"
                  disabled={transitState === TRANSIT_STATES.INACTIVE}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Trigger Transit Distress
                </Button>

                <Button
                  onClick={handleDemoSafeRide}
                  className="w-full"
                  variant="secondary"
                  disabled={transitState !== TRANSIT_STATES.TRANSIT_DISTRESS}
                >
                  <Bus className="h-4 w-4 mr-2" />
                  Activate Safe Ride Fallback
                </Button>

                <Button
                  onClick={cancelTransitJourney}
                  className="w-full"
                  variant="ghost"
                  disabled={transitState === TRANSIT_STATES.INACTIVE}
                >
                  Cancel Journey
                </Button>
              </CardContent>
            </Card>

            {/* Current Guidance */}
            <Card>
              <CardHeader>
                <CardTitle>Current Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {getGuidanceMessage()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Public Transport Assist Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Journey States</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Walking to Stop</li>
                  <li>• Waiting for Bus</li>
                  <li>• Bus Identified</li>
                  <li>• Boarding</li>
                  <li>• In Transit</li>
                  <li>• Prepare to Exit</li>
                  <li>• Missed Stop Warning</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Voice Commands</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "Find my bus"</li>
                  <li>• "Did my bus arrive"</li>
                  <li>• "Which stop is next"</li>
                  <li>• "Tell me when to get down"</li>
                  <li>• "Board bus"</li>
                  <li>• "Call guardian"</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Safety Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Missed stop detection</li>
                  <li>• Transit distress alerts</li>
                  <li>• Guardian notifications</li>
                  <li>• Safe Ride fallback</li>
                  <li>• Real-time monitoring</li>
                  <li>• Journey replay</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
