"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Car, User, Construction, CheckCircle } from "lucide-react"

interface HazardDetection {
  id: string
  type: string
  icon: any
  confidence: number
  distance: number
  timestamp: string
  status: "danger" | "caution" | "safe"
}

const detections: HazardDetection[] = [
  { id: "1", type: "Vehicle detected", icon: Car, confidence: 92, distance: 8, timestamp: "2s ago", status: "danger" },
  { id: "2", type: "Pedestrian crossing", icon: User, confidence: 97, distance: 3, timestamp: "3s ago", status: "caution" },
  { id: "3", type: "Construction barrier", icon: Construction, confidence: 84, distance: 12, timestamp: "5s ago", status: "caution" },
  { id: "4", type: "Clear path ahead", icon: CheckCircle, confidence: 95, distance: 2, timestamp: "1s ago", status: "safe" },
  { id: "5", type: "Obstacle detected", icon: AlertTriangle, confidence: 88, distance: 6, timestamp: "7s ago", status: "caution" },
]

const statusConfig = {
  danger: { color: "text-red-500", bg: "bg-red-500/10", badge: "bg-red-500" },
  caution: { color: "text-yellow-500", bg: "bg-yellow-500/10", badge: "bg-yellow-500" },
  safe: { color: "text-green-500", bg: "bg-green-500/10", badge: "bg-green-500" },
}

export function HazardDetectionFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Hazard Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {detections.map((detection) => {
              const Icon = detection.icon
              const config = statusConfig[detection.status]
              
              return (
                <div
                  key={detection.id}
                  className={`p-3 rounded-lg border ${config.bg} transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${config.bg}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-sm">{detection.type}</h4>
                        <Badge className={`${config.badge} text-white text-xs`}>
                          {detection.confidence}%
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-semibold">{detection.distance}m</span>
                          <span>away</span>
                        </div>
                        <div>{detection.timestamp}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
