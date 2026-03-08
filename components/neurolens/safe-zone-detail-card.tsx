"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Car, Clock, Shield, Accessibility } from "lucide-react"

export function SafeZoneDetailCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">City Pharmacy</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Verified Safe Zone</p>
          </div>
          <Badge className="bg-green-500 text-white">Open</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">123 Main Street, Downtown</p>
              <p className="text-sm font-semibold text-blue-600 mt-1">200m away</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Support Services</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Medication assistance</li>
                <li>• Comfortable seating area</li>
                <li>• Drinking water available</li>
                <li>• Staff trained in elderly care</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Accessibility className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium">Accessibility Features</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Wheelchair accessible entrance</li>
                <li>• Accessible restroom</li>
                <li>• Clear signage</li>
                <li>• Ground floor access</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <p className="font-medium">Open Hours</p>
              <p className="text-sm text-muted-foreground mt-1">Mon-Fri: 8:00 AM - 8:00 PM</p>
              <p className="text-sm text-muted-foreground">Sat-Sun: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1">
            <MapPin className="h-4 w-4 mr-2" />
            Route Here
          </Button>
          <Button variant="outline" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Call Support
          </Button>
        </div>
        
        <Button variant="secondary" className="w-full">
          <Car className="h-4 w-4 mr-2" />
          Request Safe Ride
        </Button>
      </CardContent>
    </Card>
  )
}
