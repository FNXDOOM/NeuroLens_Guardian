"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Hospital, Pill, Shield, HelpCircle, Users } from "lucide-react"

interface SafeZoneMarker {
  id: string
  name: string
  type: "hospital" | "pharmacy" | "police" | "kiosk" | "community"
  icon: any
  position: { x: number; y: number }
  status: "open" | "closed"
}

const markers: SafeZoneMarker[] = [
  { id: "1", name: "City Hospital", type: "hospital", icon: Hospital, position: { x: 30, y: 40 }, status: "open" },
  { id: "2", name: "Central Pharmacy", type: "pharmacy", icon: Pill, position: { x: 60, y: 25 }, status: "open" },
  { id: "3", name: "Police Station", type: "police", icon: Shield, position: { x: 45, y: 60 }, status: "open" },
  { id: "4", name: "Help Kiosk", type: "kiosk", icon: HelpCircle, position: { x: 75, y: 50 }, status: "open" },
  { id: "5", name: "Community Center", type: "community", icon: Users, position: { x: 20, y: 70 }, status: "closed" },
]

const typeColors = {
  hospital: "bg-red-500",
  pharmacy: "bg-green-500",
  police: "bg-blue-500",
  kiosk: "bg-purple-500",
  community: "bg-orange-500",
}

export function SafeZoneMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Safe Zone Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300">
            {/* Street Grid */}
            <svg className="w-full h-full opacity-30">
              <defs>
                <pattern id="streets" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#streets)" />
            </svg>
          </div>

          {/* User Location */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-lg animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75" />
            </div>
          </div>

          {/* Safe Zone Markers */}
          {markers.map((marker) => {
            const Icon = marker.icon
            const color = typeColors[marker.type]
            return (
              <div
                key={marker.id}
                className="absolute z-10 cursor-pointer group"
                style={{ left: `${marker.position.x}%`, top: `${marker.position.y}%` }}
              >
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover:scale-125`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {marker.name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-xs capitalize">{type}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
