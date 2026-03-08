"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, MapPin, Navigation, TrendingUp } from "lucide-react"

interface MetricItem {
  label: string
  value: string
  icon: any
  status: "success" | "warning" | "danger" | "info"
}

const metrics: MetricItem[] = [
  { label: "Current Status", value: "Active Journey", icon: Activity, status: "success" },
  { label: "Distress Level", value: "Low", icon: TrendingUp, status: "success" },
  { label: "Last Obstacle", value: "Vehicle - 8m", icon: AlertTriangle, status: "warning" },
  { label: "Nearest Safe Zone", value: "City Pharmacy - 200m", icon: MapPin, status: "info" },
  { label: "Navigation Progress", value: "65% Complete", icon: Navigation, status: "info" },
]

const statusColors = {
  success: "bg-green-500/10 text-green-600 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  danger: "bg-red-500/10 text-red-600 border-red-500/20",
  info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
}

export function LiveMonitoringPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Monitoring</CardTitle>
          <Badge className="bg-green-500 text-white">
            <div className="w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${statusColors[metric.status]}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-background">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="font-semibold">{metric.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
