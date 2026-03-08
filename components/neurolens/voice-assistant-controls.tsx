'use client'

import { Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react'
import { getIntentDescription } from '@/utils/voiceCommands'

interface VoiceAssistantControlsProps {
  isListening: boolean
  isProcessing: boolean
  isSpeaking: boolean
  transcript: string
  lastCommand: {
    intent: string
    confidence: number
    originalText: string
  } | null
  isSupported: boolean
  isAwake: boolean
  onToggleListening: () => void
  onStopSpeaking: () => void
}

export function VoiceAssistantControls({
  isListening,
  isProcessing,
  isSpeaking,
  transcript,
  lastCommand,
  isSupported,
  isAwake,
  onToggleListening,
  onStopSpeaking,
}: VoiceAssistantControlsProps) {
  if (!isSupported) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MicOff className="w-5 h-5" />
          <p className="text-sm">Voice features not supported in this browser</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main Control Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleListening}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
            isListening
              ? 'bg-destructive text-destructive-foreground hover:opacity-90'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
          disabled={isProcessing}
        >
          {isListening ? (
            <>
              <div className="relative">
                <Mic className="w-6 h-6" />
                <div className="absolute -inset-2 bg-destructive-foreground/20 rounded-full animate-ping" />
              </div>
              <span>Listening...</span>
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              <span>Tap to Speak</span>
            </>
          )}
        </button>

        {/* Stop Speaking Button */}
        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="px-4 py-4 bg-secondary text-secondary-foreground rounded-xl hover:opacity-90 transition-all"
            title="Stop speaking"
          >
            <VolumeX className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Wake Status */}
        {!isAwake && (
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg text-xs">
            <div className="w-2 h-2 bg-muted-foreground rounded-full" />
            <span className="text-muted-foreground">Sleeping</span>
          </div>
        )}

        {isAwake && !isListening && (
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg text-xs">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-primary font-medium">Awake</span>
          </div>
        )}

        {/* Listening Status */}
        {isListening && (
          <div className="flex items-center gap-2 bg-destructive/10 px-3 py-1.5 rounded-lg text-xs">
            <Radio className="w-3 h-3 text-destructive animate-pulse" />
            <span className="text-destructive font-medium">Listening</span>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg text-xs">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-primary font-medium">Processing</span>
          </div>
        )}

        {/* Speaking Status */}
        {isSpeaking && (
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg text-xs">
            <Volume2 className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-primary font-medium">Speaking</span>
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">You said:</p>
          <p className="text-sm text-foreground font-medium">{transcript}</p>
        </div>
      )}

      {/* Last Command Display */}
      {lastCommand && lastCommand.intent !== 'UNKNOWN' && (
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Command recognized:</p>
            <span className="text-xs font-semibold text-primary">
              {Math.round(lastCommand.confidence * 100)}% confident
            </span>
          </div>
          <p className="text-sm text-foreground font-medium">
            {getIntentDescription(lastCommand.intent)}
          </p>
        </div>
      )}

      {/* Help Text */}
      {!isListening && !isAwake && (
        <div className="bg-muted/30 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            Say "Guardian Assist" to wake the voice assistant
          </p>
        </div>
      )}

      {isAwake && !isListening && (
        <div className="bg-muted/30 rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            Try: "Find Safe Zone", "What is ahead?", "Call Guardian"
          </p>
        </div>
      )}
    </div>
  )
}
