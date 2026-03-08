"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Navigation, AlertCircle, Car, Phone } from "lucide-react"

interface Alert {
  id: string
  type: string
  message: string
  timestamp: string
  severity: "critical" | "high" | "medium" | "low"
  icon: any
}

const alerts: Alert[] = [
  { id: "1", type: "Obstacle", message: "Vehicle detected 8m ahead", timestamp: "2s ago", severity: "high", icon: AlertTriangle },
  { id: "2", type: "Route", message: "User deviated from planned route", timestamp: "1m ago", severity: "medium", icon: Navigation },
  { id: "3", type: "Distress", message: "Elevated confusion detected", timestamp: "3m ago", severity: "high", icon: AlertCircle },
  { id: "4", type: "Transport", message: "Safe Ride booked successfully", timestamp: "5m ago", severity: "low", icon: Car },
  { id: "5", type: "Emergency", message: "Guardian contacted", timestamp: "8m ago", severity: "critical", icon: Phone },
]

const severityConfig = {
  critical: { color: "bg-red-500", text: "text-red-600", bg: "bg-red-500/10 border-red-500/20" },
  high: { color: "bg-orange-500", text: "text-orange-600", bg: "bg-orange-500/10 border-orange-500/20" },
  medium: { color: "bg-yellow-500", text: "text-yellow-600", bg: "bg-yellow-500/10 border-yellow-500/20" },
  low: { color: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-500/10 border-blue-500/20" },
}

export function ActiveAlertsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Active Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {alerts.map((alert) => {
              const Icon = alert.icon
              const config = severityConfig[alert.severity]
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${config.bg} transition-all hover:scale-[1.01]`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${config.bg}`}>
                      <Icon className={`h-4 w-4 ${config.text}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className="font-medium text-sm">{alert.type}</h4>
                          <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
                        </div>
                        <Badge className={`${config.color} text-white text-xs shrink-0`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-2">
                        {alert.timestamp}
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
