"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Users, AlertCircle } from "lucide-react"

interface SafetyFeature {
  id: string
  label: string
  icon: any
  active: boolean
}

const features: SafetyFeature[] = [
  { id: "1", label: "Verified Safe Zone", icon: ShieldCheck, active: true },
  { id: "2", label: "Community Supported", icon: Users, active: true },
  { id: "3", label: "Emergency Support Available", icon: AlertCircle, active: true },
]

export function SafetyRatingIndicator() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Badge
                key={feature.id}
                variant={feature.active ? "default" : "secondary"}
                className={`flex items-center gap-1.5 px-3 py-1.5 ${
                  feature.active 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : "bg-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{feature.label}</span>
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
