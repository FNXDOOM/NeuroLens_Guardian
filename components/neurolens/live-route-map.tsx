"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, AlertTriangle } from "lucide-react"

export function LiveRouteMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-500" />
          Live Route Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300">
            <svg className="w-full h-full opacity-30">
              <defs>
                <pattern id="route-streets" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="gray" strokeWidth="2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#route-streets)" />
            </svg>
          </div>

          {/* Route Path */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 20% 80% Q 40% 60%, 50% 50% T 80% 20%"
              stroke="#3b82f6"
              strokeWidth="4"
              fill="none"
              strokeDasharray="8,4"
            />
          </svg>

          {/* User Location */}
          <div className="absolute" style={{ left: "50%", top: "50%" }}>
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping" />
            </div>
          </div>

          {/* Destination */}
          <div className="absolute" style={{ left: "80%", top: "20%" }}>
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
          </div>

          {/* Safe Zones */}
          <div className="absolute" style={{ left: "30%", top: "40%" }}>
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div className="absolute" style={{ left: "70%", top: "60%" }}>
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </div>

          {/* Hazard Alert */}
          <div className="absolute" style={{ left: "40%", top: "35%" }}>
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div className="p-1 rounded-full bg-red-500 animate-pulse">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-white/90 rounded p-2 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <span>User</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Safe Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Hazard</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
