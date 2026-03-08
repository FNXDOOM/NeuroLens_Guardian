"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Bot, MapPin, Activity, ArrowRight } from "lucide-react"

const showcasePages = [
  {
    id: "ar-vision",
    title: "AR Vision Interface",
    description: "Real-time augmented reality camera view with hazard detection, navigation guidance, and safety overlays",
    icon: Camera,
    href: "/ar-vision",
    color: "bg-blue-500",
  },
  {
    id: "ai-assistant",
    title: "AI Assistant",
    description: "Conversational AI guidance with voice controls, quick actions, and distress response messaging",
    icon: Bot,
    href: "/ai-assistant",
    color: "bg-purple-500",
  },
  {
    id: "safe-zones",
    title: "Safe Zone Discovery",
    description: "Interactive map and list of nearby safe assistance points with detailed information and routing",
    icon: MapPin,
    href: "/safe-zones",
    color: "bg-green-500",
  },
  {
    id: "monitoring",
    title: "Caregiver Command Center",
    description: "Professional monitoring dashboard with live tracking, alerts, emergency response, and event timeline",
    icon: Activity,
    href: "/monitoring",
    color: "bg-orange-500",
  },
]

export default function ARShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">NeuroLens Guardian</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AR and AI-powered assistive mobility interfaces
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {showcasePages.map((page) => {
            const Icon = page.icon
            return (
              <Card key={page.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${page.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{page.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {page.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={page.href}>
                    <Button className="w-full">
                      View Interface
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="bg-slate-900 text-white border-slate-700">
          <CardHeader>
            <CardTitle>About NeuroLens Guardian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              NeuroLens Guardian is an advanced assistive mobility platform designed to help vulnerable users navigate public environments safely using AR technology, AI guidance, and real-time monitoring.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-blue-400">User Features</h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• AR camera with hazard detection</li>
                  <li>• Real-time navigation guidance</li>
                  <li>• AI conversational assistant</li>
                  <li>• Safe Zone discovery</li>
                  <li>• Emergency assistance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-400">Caregiver Features</h4>
                <ul className="space-y-1 text-slate-300">
                  <li>• Live user monitoring</li>
                  <li>• Real-time alerts</li>
                  <li>• Emergency response tools</li>
                  <li>• Event timeline tracking</li>
                  <li>• Route visualization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
