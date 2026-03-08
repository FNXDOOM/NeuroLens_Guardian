import { Lightbulb, Volume2, MessageCircle } from 'lucide-react';

interface GuidancePanelProps {
  currentGuidance?: string;
  isListening?: boolean;
  onSpeak?: () => void;
  tone?: 'calm' | 'urgent' | 'normal';
}

export function GuidancePanel({
  currentGuidance = "Continue straight ahead. A safe zone is 150 meters ahead. Remember to stay calm.",
  isListening = false,
  onSpeak,
  tone = 'calm'
}: GuidancePanelProps) {
  const toneColors = {
    calm: 'border-accent/30 bg-accent/5',
    urgent: 'border-warning/30 bg-warning/5',
    normal: 'border-primary/30 bg-primary/5',
  };

  return (
    <div className={`bg-card rounded-2xl shadow-lg shadow-black/5 border-2 ${toneColors[tone]} p-8`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          <h3 className="font-semibold text-lg text-foreground">AI Guidance</h3>
        </div>
        {isListening && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
      </div>

      {/* Guidance message */}
      <div className="mb-4">
        <div className="bg-white/30 backdrop-blur-[10px] border border-white/20 rounded-2xl p-6 shadow-lg mb-3">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <p className="text-sm leading-relaxed text-foreground">{currentGuidance}</p>
          </div>
        </div>
      </div>

      {/* Audio controls */}
      <div className="flex gap-2">
        <button
          onClick={onSpeak}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
        >
          <Volume2 className="w-4 h-4" />
          Repeat Guidance
        </button>
      </div>

      {/* Status indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">AI Assistant active • Always stay aware of surroundings</p>
      </div>
    </div>
  );
}
