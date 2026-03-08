"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Camera, Satellite, Shield, Volume2, MapPin } from "lucide-react"

interface StatusIndicator {
  id: string
  label: string
  icon: any
  active: boolean
  status: "active" | "inactive" | "warning"
}

const indicators: StatusIndicator[] = [
  { id: "1", label: "Camera Active", icon: Camera, active: true, status: "active" },
  { id: "2", label: "GPS Connected", icon: Satellite, active: true, status: "active" },
  { id: "3", label: "Hazard Detection", icon: Shield, active: true, status: "active" },
  { id: "4", label: "Audio Guidance", icon: Volume2, active: true, status: "active" },
  { id: "5", label: "Safe Zone Awareness", icon: MapPin, active: true, status: "active" },
]

export function ARStatusIndicators() {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 flex-wrap">
        {indicators.map((indicator) => {
          const Icon = indicator.icon
          const isActive = indicator.active
          
          return (
            <Badge
              key={indicator.id}
              variant={isActive ? "default" : "secondary"}
              className={`flex items-center gap-1.5 px-3 py-1.5 ${
                isActive 
                  ? "bg-green-500/10 text-green-600 border-green-500/20" 
                  : "bg-slate-500/10 text-slate-500"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{indicator.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              )}
            </Badge>
          )
        })}
      </div>
    </Card>
  )
}
