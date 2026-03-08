"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User } from "lucide-react"

interface Message {
  id: string
  sender: "ai" | "user"
  content: string
  timestamp: string
  type?: "normal" | "distress"
}

const messages: Message[] = [
  { id: "1", sender: "ai", content: "Walk straight for 20 meters.", timestamp: "10:23 AM", type: "normal" },
  { id: "2", sender: "user", content: "Where am I?", timestamp: "10:24 AM" },
  { id: "3", sender: "ai", content: "You seem off route. I can guide you back.", timestamp: "10:24 AM", type: "normal" },
  { id: "4", sender: "ai", content: "There is a Safe Zone nearby at City Pharmacy, 150 meters ahead.", timestamp: "10:25 AM", type: "normal" },
]

export function AIAssistantPanel() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-2 rounded-full bg-blue-500/10">
              <Bot className="h-5 w-5 text-blue-500" />
            </div>
            AI Assistant
          </CardTitle>
          <Badge className="bg-green-500 text-white">
            <div className="w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className={message.sender === "ai" ? "bg-blue-500/10" : "bg-slate-200"}>
                    {message.sender === "ai" ? (
                      <Bot className="h-4 w-4 text-blue-500" />
                    ) : (
                      <User className="h-4 w-4 text-slate-600" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 ${message.sender === "user" ? "flex flex-col items-end" : ""}`}>
                  <div
                    className={`inline-block px-4 py-2.5 rounded-2xl max-w-[85%] ${
                      message.sender === "ai"
                        ? message.type === "distress"
                          ? "bg-orange-500/10 border border-orange-500/20"
                          : "bg-blue-500/10 border border-blue-500/20"
                        : "bg-slate-200"
                    }`}
                  >
                    <p className={`text-sm ${message.sender === "ai" ? "text-blue-900" : "text-slate-900"}`}>
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 px-1">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
