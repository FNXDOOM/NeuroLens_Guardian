"use client"

import { LiveMonitoringPanel } from "@/components/neurolens/live-monitoring-panel"
import { LiveRouteMap } from "@/components/neurolens/live-route-map"
import { ActiveAlertsPanel } from "@/components/neurolens/active-alerts-panel"
import { EmergencyResponsePanel } from "@/components/neurolens/emergency-response-panel"
import { MonitoringEventTimeline } from "@/components/neurolens/monitoring-event-timeline"

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Caregiver Command Center</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and emergency response for user safety
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <LiveMonitoringPanel />
            <LiveRouteMap />
            <MonitoringEventTimeline />
          </div>

          <div className="space-y-6">
            <ActiveAlertsPanel />
            <EmergencyResponsePanel />
          </div>
        </div>
      </div>
    </div>
  )
}
