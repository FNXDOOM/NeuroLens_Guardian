"use client"

import { ARCameraView } from "@/components/neurolens/ar-camera-view"
import { NavigationGuidanceOverlay } from "@/components/neurolens/navigation-guidance-overlay"
import { HazardDetectionFeed } from "@/components/neurolens/hazard-detection-feed"
import { ARStatusIndicators } from "@/components/neurolens/ar-status-indicators"
import { GuidanceFeedbackBanner } from "@/components/neurolens/guidance-feedback-banner"

export default function ARVisionPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AR Vision Interface</h1>
          <p className="text-muted-foreground">
            Real-time augmented reality guidance for safe navigation
          </p>
        </div>

        <ARStatusIndicators />
        
        <GuidanceFeedbackBanner />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <ARCameraView />
              <NavigationGuidanceOverlay />
            </div>
          </div>

          <div>
            <HazardDetectionFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
