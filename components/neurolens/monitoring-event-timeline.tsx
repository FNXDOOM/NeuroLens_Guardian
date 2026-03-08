"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, AlertTriangle, AlertCircle, MapPin, Car, CheckCircle } from "lucide-react"

interface TimelineEvent {
  id: string
  type: string
  description: string
  timestamp: string
  icon: any
  status: "success" | "warning" | "danger" | "info"
}

const events: TimelineEvent[] = [
  { id: "1", type: "Journey Started", description: "User began navigation to City Center", timestamp: "10:15 AM", icon: Play, status: "info" },
  { id: "2", type: "Hazard Detected", description: "Vehicle detected 8m ahead", timestamp: "10:18 AM", icon: AlertTriangle, status: "warning" },
  { id: "3", type: "Distress Detected", description: "Elevated confusion level", timestamp: "10:22 AM", icon: AlertCircle, status: "danger" },
  { id: "4", type: "Safe Zone Reached", description: "User arrived at City Pharmacy", timestamp: "10:25 AM", icon: MapPin, status: "success" },
  { id: "5", type: "Ride Assistance", description: "Safe Ride booked and confirmed", timestamp: "10:28 AM", icon: Car, status: "info" },
  { id: "6", type: "Journey Complete", description: "User safely arrived at destination", timestamp: "10:45 AM", icon: CheckCircle, status: "success" },
]

const statusConfig = {
  success: { color: "bg-green-500", line: "bg-green-200" },
  warning: { color: "bg-yellow-500", line: "bg-yellow-200" },
  danger: { color: "bg-red-500", line: "bg-red-200" },
  info: { color: "bg-blue-500", line: "bg-blue-200" },
}

export function MonitoringEventTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Event Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px] pr-4">
          <div className="relative space-y-6">
            {/* Timeline Line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200" />
            
            {events.map((event, index) => {
              const Icon = event.icon
              const config = statusConfig[event.status]
              const isLast = index === events.length - 1
              
              return (
                <div key={event.id} className="relative flex gap-4">
                  {/* Timeline Dot */}
                  <div className={`relative z-10 w-8 h-8 rounded-full ${config.color} flex items-center justify-center shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  
                  {/* Event Content */}
                  <div className="flex-1 pb-2">
                    <div className="bg-card border rounded-lg p-3 hover:bg-accent transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{event.type}</h4>
                        <Badge variant="outline" className="text-xs">
                          {event.timestamp}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
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
