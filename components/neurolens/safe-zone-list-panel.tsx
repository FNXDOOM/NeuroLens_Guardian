"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Hospital, Pill, Shield, HelpCircle, Users, MapPin, Clock } from "lucide-react"

interface SafeZone {
  id: string
  name: string
  type: "hospital" | "pharmacy" | "police" | "kiosk" | "community"
  icon: any
  distance: number
  support: string[]
  status: "open" | "closed"
  accessibility: string[]
}

const safeZones: SafeZone[] = [
  {
    id: "1",
    name: "City Pharmacy",
    type: "pharmacy",
    icon: Pill,
    distance: 200,
    support: ["medication", "seating", "water"],
    status: "open",
    accessibility: ["wheelchair", "restroom"],
  },
  {
    id: "2",
    name: "Central Hospital",
    type: "hospital",
    icon: Hospital,
    distance: 450,
    support: ["emergency care", "seating", "water"],
    status: "open",
    accessibility: ["wheelchair", "elevator", "restroom"],
  },
  {
    id: "3",
    name: "Police Station North",
    type: "police",
    icon: Shield,
    distance: 650,
    support: ["emergency", "guidance", "phone"],
    status: "open",
    accessibility: ["wheelchair", "parking"],
  },
  {
    id: "4",
    name: "Community Help Center",
    type: "community",
    icon: Users,
    distance: 800,
    support: ["guidance", "seating", "phone", "water"],
    status: "closed",
    accessibility: ["wheelchair", "restroom", "parking"],
  },
]

const typeColors = {
  hospital: "bg-red-500",
  pharmacy: "bg-green-500",
  police: "bg-blue-500",
  kiosk: "bg-purple-500",
  community: "bg-orange-500",
}

export function SafeZoneListPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Nearby Safe Zones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-3">
            {safeZones.map((zone) => {
              const Icon = zone.icon
              const color = typeColors[zone.type]
              return (
                <div
                  key={zone.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold">{zone.name}</h4>
                        <Badge variant={zone.status === "open" ? "default" : "secondary"}>
                          {zone.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="font-semibold">{zone.distance}m</span>
                          <span>away</span>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Support: </span>
                          <span>{zone.support.join(", ")}</span>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Accessibility: </span>
                          <span>{zone.accessibility.join(", ")}</span>
                        </div>
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
