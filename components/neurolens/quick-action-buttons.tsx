"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Repeat, Lightbulb, MapPin, Phone, Car } from "lucide-react"

const actions = [
  { id: "1", label: "Repeat Guidance", icon: Repeat, variant: "outline" as const },
  { id: "2", label: "Simplify Instructions", icon: Lightbulb, variant: "outline" as const },
  { id: "3", label: "Find Safe Zone", icon: MapPin, variant: "default" as const },
  { id: "4", label: "Call Guardian", icon: Phone, variant: "outline" as const },
  { id: "5", label: "Request Safe Ride", icon: Car, variant: "default" as const },
]

export function QuickActionButtons() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant={action.variant}
                className="h-auto flex-col gap-2 py-4"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs text-center leading-tight">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
