'use client';

import {
  Volume2,
  Vibrate,
  Type,
  Contrast,
  Lightbulb,
  Heart,
  Bell,
  Smartphone,
  Phone,
  Mail,
  Plus,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

interface AccessibilitySettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  audioGuidance?: boolean;
  vibrationAlerts?: boolean;
  largeTextMode?: boolean;
  highContrastMode?: boolean;
  simplifiedInstructions?: boolean;
  calmGuidanceMode?: boolean;
  automaticCaregiverAlerts?: boolean;
  safeRideAssistance?: boolean;
  emergencyContacts?: EmergencyContact[];
  onSettingChange?: (setting: string, value: boolean) => void;
  onAddContact?: (contact: EmergencyContact) => void;
  onRemoveContact?: (id: string) => void;
}

export function AccessibilitySettingsPanel({
  isOpen,
  onClose,
  audioGuidance = true,
  vibrationAlerts = true,
  largeTextMode = false,
  highContrastMode = false,
  simplifiedInstructions = false,
  calmGuidanceMode = true,
  automaticCaregiverAlerts = true,
  safeRideAssistance = true,
  emergencyContacts = [
    {
      id: '1',
      name: 'Margaret Johnson',
      relationship: 'Mother',
      phone: '+1 (555) 123-4567',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      relationship: 'Sister',
      phone: '+1 (555) 234-5678',
    },
  ],
  onSettingChange,
  onAddContact,
  onRemoveContact,
}: AccessibilitySettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'preferences' | 'contacts'>('preferences');
  const [showAddContact, setShowAddContact] = useState(false);

  if (!isOpen) return null;

  const SettingToggle = ({
    icon: Icon,
    label,
    description,
    value,
    onChange,
  }: {
    icon: React.ReactNode;
    label: string;
    description: string;
    value: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <div className="flex items-start justify-between p-4 hover:bg-muted/30 rounded-xl transition-colors cursor-pointer">
      <div className="flex gap-3">
        <div className="text-primary mt-1 flex-shrink-0">{Icon}</div>
        <div className="flex-1">
          <p className="font-medium text-foreground text-sm">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`flex-shrink-0 relative w-12 h-6 rounded-full transition-colors ${
          value ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            value ? 'translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Accessibility & Guidance</h2>
          <p className="text-sm text-muted-foreground mt-1">Customize your assistance preferences</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border flex">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'preferences'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            Assistance Preferences
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'contacts'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            Emergency Contacts
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'preferences' ? (
            <div className="divide-y divide-border">
              {/* Audio & Haptic */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground px-4 py-2 mb-2">Audio & Haptic</h3>
                <SettingToggle
                  icon={<Volume2 className="w-5 h-5" />}
                  label="Audio Guidance"
                  description="Hear spoken directions and alerts"
                  value={audioGuidance}
                  onChange={(val) => onSettingChange?.('audioGuidance', val)}
                />
                <SettingToggle
                  icon={<Vibrate className="w-5 h-5" />}
                  label="Vibration Alerts"
                  description="Feel haptic feedback for important alerts"
                  value={vibrationAlerts}
                  onChange={(val) => onSettingChange?.('vibrationAlerts', val)}
                />
              </div>

              {/* Display */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground px-4 py-2 mb-2">Display</h3>
                <SettingToggle
                  icon={<Type className="w-5 h-5" />}
                  label="Large Text Mode"
                  description="Increase text size for easier reading"
                  value={largeTextMode}
                  onChange={(val) => onSettingChange?.('largeTextMode', val)}
                />
                <SettingToggle
                  icon={<Contrast className="w-5 h-5" />}
                  label="High Contrast Mode"
                  description="Enhance color contrast for visibility"
                  value={highContrastMode}
                  onChange={(val) => onSettingChange?.('highContrastMode', val)}
                />
              </div>

              {/* Assistance */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground px-4 py-2 mb-2">Assistance Options</h3>
                <SettingToggle
                  icon={<Lightbulb className="w-5 h-5" />}
                  label="Simplified Instructions"
                  description="Receive shorter, clearer directions"
                  value={simplifiedInstructions}
                  onChange={(val) => onSettingChange?.('simplifiedInstructions', val)}
                />
                <SettingToggle
                  icon={<Heart className="w-5 h-5" />}
                  label="Calm Guidance Mode"
                  description="Receive supportive, reassuring messages"
                  value={calmGuidanceMode}
                  onChange={(val) => onSettingChange?.('calmGuidanceMode', val)}
                />
                <SettingToggle
                  icon={<Bell className="w-5 h-5" />}
                  label="Automatic Caregiver Alerts"
                  description="Notify guardian of distress automatically"
                  value={automaticCaregiverAlerts}
                  onChange={(val) => onSettingChange?.('automaticCaregiverAlerts', val)}
                />
                <SettingToggle
                  icon={<Smartphone className="w-5 h-5" />}
                  label="Safe Ride Assistance"
                  description="Access protected ride booking feature"
                  value={safeRideAssistance}
                  onChange={(val) => onSettingChange?.('safeRideAssistance', val)}
                />
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Emergency contacts list */}
              {emergencyContacts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Your Emergency Contacts</h3>
                  <div className="space-y-2">
                    {emergencyContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-start justify-between p-4 bg-muted/20 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveContact?.(contact.id)}
                          className="p-2 hover:bg-muted/50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add contact form */}
              {showAddContact ? (
                <div className="bg-muted/20 rounded-xl p-4 border border-border space-y-3">
                  <input
                    type="text"
                    placeholder="Contact name"
                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary text-primary-foreground hover:opacity-90 font-semibold py-2 px-3 rounded-lg text-sm transition-all">
                      Add Contact
                    </button>
                    <button
                      onClick={() => setShowAddContact(false)}
                      className="flex-1 border border-border hover:bg-muted/50 font-semibold py-2 px-3 rounded-lg text-sm transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddContact(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary hover:text-primary text-muted-foreground font-semibold py-4 px-4 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Emergency Contact
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-border hover:bg-muted/50 font-semibold py-3 px-6 rounded-lg transition-all text-foreground"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground hover:opacity-90 font-semibold py-3 px-6 rounded-lg transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
