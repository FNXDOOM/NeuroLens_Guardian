"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Users, Car, MapPin, AlertTriangle } from "lucide-react"

const actions = [
  { id: "1", label: "Call User", icon: Phone, variant: "default" as const, color: "bg-blue-500 hover:bg-blue-600" },
  { id: "2", label: "Notify Guardian", icon: Users, variant: "default" as const, color: "bg-purple-500 hover:bg-purple-600" },
  { id: "3", label: "Dispatch Safe Ride", icon: Car, variant: "default" as const, color: "bg-green-500 hover:bg-green-600" },
  { id: "4", label: "Route to Safe Zone", icon: MapPin, variant: "default" as const, color: "bg-orange-500 hover:bg-orange-600" },
  { id: "5", label: "Escalate Emergency", icon: AlertTriangle, variant: "destructive" as const, color: "bg-red-500 hover:bg-red-600" },
]

export function EmergencyResponsePanel() {
  return (
    <Card className="border-red-500/50">
      <CardHeader className="bg-red-500/5">
        <CardTitle className="text-lg flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Emergency Response
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant={action.variant}
                className={`w-full justify-start h-auto py-4 ${action.color}`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="font-semibold">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
