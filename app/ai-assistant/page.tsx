"use client"

import { AIAssistantPanel } from "@/components/neurolens/ai-assistant-panel"
import { QuickActionButtons } from "@/components/neurolens/quick-action-buttons"
import { VoiceGuidanceControls } from "@/components/neurolens/voice-guidance-controls"
import { DistressResponseMessages } from "@/components/neurolens/distress-response-messages"
import { ConversationHistoryPanel } from "@/components/neurolens/conversation-history-panel"

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
          <p className="text-muted-foreground">
            Conversational guidance and support for safe navigation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AIAssistantPanel />
            <QuickActionButtons />
            <DistressResponseMessages />
          </div>

          <div className="space-y-6">
            <VoiceGuidanceControls />
            <ConversationHistoryPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
