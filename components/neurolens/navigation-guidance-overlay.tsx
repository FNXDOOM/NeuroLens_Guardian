"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, MapPin, Navigation } from "lucide-react"

export function NavigationGuidanceOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Direction Arrow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center animate-pulse">
            <ArrowUp className="h-8 w-8 text-blue-400" strokeWidth={3} />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <Badge className="bg-blue-500 text-white font-semibold">
              Walk Straight
            </Badge>
          </div>
        </div>
      </div>

      {/* Next Turn Indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <Card className="bg-slate-900/90 border-slate-700 px-4 py-2 pointer-events-auto">
          <div className="flex items-center gap-3">
            <Navigation className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium text-white">Turn right in 50m</div>
              <div className="text-xs text-slate-400">Main Street</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Distance to Destination */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <Card className="bg-slate-900/90 border-slate-700 px-6 py-3 pointer-events-auto">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-400" />
            <div className="text-sm font-medium text-white">
              Destination: <span className="text-green-400">320m</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Safe Zone Marker */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center animate-pulse">
            <MapPin className="h-6 w-6 text-green-400" />
          </div>
          <div className="absolute -right-2 -top-2">
            <Badge className="bg-green-500 text-white text-xs">
              Safe Zone
            </Badge>
          </div>
          <div className="absolute top-full mt-2 right-0 whitespace-nowrap">
            <div className="text-xs text-green-400 font-medium">150m →</div>
          </div>
        </div>
      </div>

      {/* Path Guidance Line */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M 50% 100% Q 50% 50%, 50% 20%"
          stroke="url(#pathGradient)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="10,5"
          className="animate-pulse"
        />
      </svg>
    </div>
  )
}
