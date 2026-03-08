"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Info, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

interface GuidanceMessage {
  id: string
  type: "warning" | "success" | "info" | "safe-zone"
  message: string
  icon: any
}

const messages: GuidanceMessage[] = [
  { id: "1", type: "warning", message: "Obstacle ahead. Please move slightly left.", icon: AlertTriangle },
  { id: "2", type: "safe-zone", message: "You are approaching a Safe Zone.", icon: MapPin },
  { id: "3", type: "success", message: "Clear path detected.", icon: CheckCircle },
  { id: "4", type: "info", message: "Turn right in 50 meters.", icon: Info },
]

const typeConfig = {
  warning: { bg: "bg-yellow-500/10 border-yellow-500/50", text: "text-yellow-600", iconColor: "text-yellow-500" },
  success: { bg: "bg-green-500/10 border-green-500/50", text: "text-green-600", iconColor: "text-green-500" },
  info: { bg: "bg-blue-500/10 border-blue-500/50", text: "text-blue-600", iconColor: "text-blue-500" },
  "safe-zone": { bg: "bg-purple-500/10 border-purple-500/50", text: "text-purple-600", iconColor: "text-purple-500" },
}

export function GuidanceFeedbackBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentMessage = messages[currentIndex]
  const config = typeConfig[currentMessage.type]
  const Icon = currentMessage.icon

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Alert className={`${config.bg} border-2 transition-all duration-500`}>
      <Icon className={`h-5 w-5 ${config.iconColor}`} />
      <AlertDescription className={`${config.text} font-medium text-base ml-2`}>
        {currentMessage.message}
      </AlertDescription>
    </Alert>
  )
}
