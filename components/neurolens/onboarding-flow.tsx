'use client';

import { useState } from 'react';
import { ChevronRight, MapPin, Settings, Smartphone, Heart, Shield } from 'lucide-react';

type OnboardingStep = 'welcome' | 'assistance' | 'contacts' | 'permissions' | 'complete';

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function OnboardingFlow({ isOpen, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [userAssistanceLevel, setUserAssistanceLevel] = useState('moderate');
  const [emergencyContacts, setEmergencyContacts] = useState<Array<{ name: string; phone: string }>>([]);
  const [permissions, setPermissions] = useState({
    location: false,
    camera: false,
    microphone: false,
  });

  if (!isOpen) return null;

  const handleNext = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('assistance');
        break;
      case 'assistance':
        setCurrentStep('contacts');
        break;
      case 'contacts':
        setCurrentStep('permissions');
        break;
      case 'permissions':
        setCurrentStep('complete');
        break;
      case 'complete':
        onComplete();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'assistance':
        setCurrentStep('welcome');
        break;
      case 'contacts':
        setCurrentStep('assistance');
        break;
      case 'permissions':
        setCurrentStep('contacts');
        break;
      default:
        break;
    }
  };

  // Welcome step
  if (currentStep === 'welcome') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-card rounded-2xl shadow-2xl border border-border p-12 max-w-2xl w-full mx-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to NeuroLens Guardian</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Your AI-powered companion for safe, independent mobility
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Let's set up your preferences to get started. This will take about 2 minutes.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Safe</p>
            </div>
            <div className="text-center">
              <Smartphone className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Smart</p>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Supportive</p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-4 px-6 rounded-lg transition-all text-lg flex items-center justify-center gap-2"
          >
            Get Started
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Assistance level step
  if (currentStep === 'assistance') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-card rounded-2xl shadow-2xl border border-border p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">Assistance Level</h2>
          <p className="text-sm text-muted-foreground mb-6">
            How much guidance would you like to receive?
          </p>

          <div className="space-y-3 mb-8">
            {[
              { id: 'light', label: 'Light', description: 'Basic alerts only' },
              { id: 'moderate', label: 'Moderate', description: 'Guidance + alerts' },
              { id: 'intensive', label: 'Intensive', description: 'Full support' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setUserAssistanceLevel(option.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  userAssistanceLevel === option.id
                    ? 'bg-primary/10 border-primary'
                    : 'bg-muted/20 border-border hover:border-primary/50'
                }`}
              >
                <p className="font-semibold text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 border border-border hover:bg-muted/50 font-semibold py-3 px-4 rounded-lg transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Emergency contacts step
  if (currentStep === 'contacts') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-card rounded-2xl shadow-2xl border border-border p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">Emergency Contacts</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Add at least one emergency contact who will be alerted if you need help.
          </p>

          <div className="space-y-3 mb-6 max-h-40 overflow-y-auto">
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} className="p-3 bg-muted/20 rounded-lg border border-border">
                <p className="text-sm font-medium text-foreground">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.phone}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Guardian name"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button className="w-full border-2 border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary font-semibold py-3 px-4 rounded-lg transition-colors text-sm">
              + Add Contact
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 border border-border hover:bg-muted/50 font-semibold py-3 px-4 rounded-lg transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Permissions step
  if (currentStep === 'permissions') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-card rounded-2xl shadow-2xl border border-border p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">Enable Permissions</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We need these permissions to keep you safe.
          </p>

          <div className="space-y-3 mb-8">
            {[
              { id: 'location', label: 'Location', description: 'For navigation and safety' },
              { id: 'camera', label: 'Camera', description: 'For AR hazard detection' },
              { id: 'microphone', label: 'Microphone', description: 'For audio guidance' },
            ].map((perm) => (
              <button
                key={perm.id}
                onClick={() =>
                  setPermissions({
                    ...permissions,
                    [perm.id]: !permissions[perm.id as keyof typeof permissions],
                  })
                }
                className="w-full p-4 rounded-xl border-2 border-border hover:border-primary/50 bg-muted/20 transition-all text-left flex items-start justify-between"
              >
                <div>
                  <p className="font-semibold text-foreground text-sm">{perm.label}</p>
                  <p className="text-xs text-muted-foreground">{perm.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={permissions[perm.id as keyof typeof permissions]}
                  onChange={() => {}}
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 border border-border hover:bg-muted/50 font-semibold py-3 px-4 rounded-lg transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Complete step
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border p-12 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-[var(--safe)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-[var(--safe)]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">All Set!</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Your profile is configured. You're ready to navigate safely.
        </p>
        <button
          onClick={handleNext}
          className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-4 px-6 rounded-lg transition-all"
        >
          Start Journey
        </button>
      </div>
    </div>
  );
}
