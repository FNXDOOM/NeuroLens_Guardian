"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Grid3x3, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DetectedObject {
  id: string
  type: "vehicle" | "pedestrian" | "obstacle" | "clear-path"
  label: string
  confidence: number
  position: { x: number; y: number; width: number; height: number }
  distance: number
  status: "danger" | "caution" | "safe"
}

const mockDetections: DetectedObject[] = [
  { id: "1", type: "vehicle", label: "Vehicle Detected", confidence: 92, position: { x: 15, y: 20, width: 25, height: 30 }, distance: 8, status: "danger" },
  { id: "2", type: "pedestrian", label: "Pedestrian", confidence: 97, position: { x: 60, y: 35, width: 15, height: 35 }, distance: 3, status: "caution" },
  { id: "3", type: "clear-path", label: "Clear Path", confidence: 95, position: { x: 40, y: 60, width: 20, height: 25 }, distance: 2, status: "safe" },
  { id: "4", type: "obstacle", label: "Construction Barrier", confidence: 84, position: { x: 75, y: 45, width: 18, height: 20 }, distance: 12, status: "caution" },
]

const statusColors = {
  danger: "border-red-500 bg-red-500/10",
  caution: "border-yellow-500 bg-yellow-500/10",
  safe: "border-green-500 bg-green-500/10",
}

const labelColors = {
  danger: "bg-red-500/90 text-white",
  caution: "bg-yellow-500/90 text-black",
  safe: "bg-green-500/90 text-white",
}

export function ARCameraView() {
  return (
    <Card className="relative overflow-hidden bg-slate-900 border-slate-700">
      <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Camera Feed Placeholder */}
        <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center opacity-40" />
        
        {/* AR Grid Overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-cyan-400 -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-cyan-400 -translate-x-1/2" />
            <div className="absolute left-0 top-1/2 h-0.5 w-4 bg-cyan-400 -translate-y-1/2" />
            <div className="absolute right-0 top-1/2 h-0.5 w-4 bg-cyan-400 -translate-y-1/2" />
          </div>
        </div>

        {/* Detected Objects with Bounding Boxes */}
        {mockDetections.map((obj) => (
          <div
            key={obj.id}
            className={`absolute border-2 ${statusColors[obj.status]} transition-all duration-300`}
            style={{
              left: `${obj.position.x}%`,
              top: `${obj.position.y}%`,
              width: `${obj.position.width}%`,
              height: `${obj.position.height}%`,
            }}
          >
            {/* Object Label */}
            <div className={`absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium rounded ${labelColors[obj.status]}`}>
              {obj.label}
            </div>
            
            {/* Distance Indicator */}
            <div className={`absolute -bottom-5 right-0 px-1.5 py-0.5 text-xs font-mono ${labelColors[obj.status]}`}>
              {obj.distance}m
            </div>

            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current" />
          </div>
        ))}

        {/* Camera Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="icon" variant="secondary" className="bg-slate-800/80 hover:bg-slate-700">
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="bg-slate-800/80 hover:bg-slate-700">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Camera Status */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-red-500 text-white animate-pulse">
            <Camera className="h-3 w-3 mr-1" />
            LIVE
          </Badge>
        </div>
      </div>
    </Card>
  )
}
