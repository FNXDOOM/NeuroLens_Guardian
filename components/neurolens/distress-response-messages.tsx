"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Phone, MapPin, Car } from "lucide-react"

interface DistressMessage {
  id: string
  title: string
  message: string
  actions: { label: string; icon: any; variant: "default" | "outline" }[]
}

const distressScenarios: DistressMessage[] = [
  {
    id: "1",
    title: "Confusion Detected",
    message: "You seem confused. Would you like me to contact your guardian?",
    actions: [
      { label: "Call Guardian", icon: Phone, variant: "default" },
      { label: "Find Safe Zone", icon: MapPin, variant: "outline" },
    ],
  },
  {
    id: "2",
    title: "Route Assistance",
    message: "I can guide you to the nearest Safe Zone.",
    actions: [
      { label: "Guide Me", icon: MapPin, variant: "default" },
      { label: "Call Help", icon: Phone, variant: "outline" },
    ],
  },
  {
    id: "3",
    title: "Safe Transport",
    message: "I can arrange a safe ride to take you home.",
    actions: [
      { label: "Request Ride", icon: Car, variant: "default" },
      { label: "Contact Guardian", icon: Phone, variant: "outline" },
    ],
  },
]

export function DistressResponseMessages({ scenarioId = "1" }: { scenarioId?: string }) {
  const scenario = distressScenarios.find((s) => s.id === scenarioId) || distressScenarios[0]

  return (
    <Card className="border-orange-500/50 bg-orange-500/5">
      <CardContent className="pt-6">
        <Alert className="bg-orange-500/10 border-orange-500/50">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          <AlertTitle className="text-orange-600 font-semibold">{scenario.title}</AlertTitle>
          <AlertDescription className="text-orange-600 mt-2 mb-4">
            {scenario.message}
          </AlertDescription>
        </Alert>

        <div className="flex gap-3 mt-4">
          {scenario.actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button key={index} variant={action.variant} className="flex-1">
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
