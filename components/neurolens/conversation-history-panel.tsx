"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Clock, MessageSquare } from "lucide-react"

interface ConversationEntry {
  id: string
  message: string
  timestamp: string
  type: "guidance" | "response" | "alert"
}

const history: ConversationEntry[] = [
  { id: "1", message: "Walk straight for 20 meters.", timestamp: "10:23 AM", type: "guidance" },
  { id: "2", message: "You seem off route. I can guide you back.", timestamp: "10:24 AM", type: "alert" },
  { id: "3", message: "Turn right at the next intersection.", timestamp: "10:25 AM", type: "guidance" },
  { id: "4", message: "Safe Zone nearby at City Pharmacy.", timestamp: "10:26 AM", type: "response" },
  { id: "5", message: "Clear path detected ahead.", timestamp: "10:27 AM", type: "guidance" },
]

const typeConfig = {
  guidance: { color: "bg-blue-500/10 border-blue-500/20", badge: "bg-blue-500" },
  response: { color: "bg-green-500/10 border-green-500/20", badge: "bg-green-500" },
  alert: { color: "bg-orange-500/10 border-orange-500/20", badge: "bg-orange-500" },
}

export function ConversationHistoryPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Conversation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-3">
            {history.map((entry) => {
              const config = typeConfig[entry.type]
              return (
                <div
                  key={entry.id}
                  className={`p-3 rounded-lg border ${config.color} transition-all hover:scale-[1.01]`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm flex-1">{entry.message}</p>
                    <Badge className={`${config.badge} text-white text-xs shrink-0`}>
                      {entry.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {entry.timestamp}
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
