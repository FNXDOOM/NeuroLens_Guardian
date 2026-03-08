"use client"

import { SafeZoneMap } from "@/components/neurolens/safe-zone-map"
import { SafeZoneListPanel } from "@/components/neurolens/safe-zone-list-panel"
import { SafeZoneDetailCard } from "@/components/neurolens/safe-zone-detail-card"
import { SafetyRatingIndicator } from "@/components/neurolens/safety-rating-indicator"

export default function SafeZonesPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Safe Zone Discovery</h1>
          <p className="text-muted-foreground">
            Find nearby safe assistance points and support centers
          </p>
        </div>

        <SafetyRatingIndicator />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SafeZoneMap />
            <SafeZoneListPanel />
          </div>

          <div>
            <SafeZoneDetailCard />
          </div>
        </div>
      </div>
    </div>
  )
}
