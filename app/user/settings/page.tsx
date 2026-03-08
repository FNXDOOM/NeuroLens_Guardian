'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Navbar } from '@/components/neurolens/navbar'
import { Globe, Accessibility, Lock, ArrowLeft, Save } from 'lucide-react'

export default function UserSettingsPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [language, setLanguage] = useState('english')
  const [voiceGuidance, setVoiceGuidance] = useState(true)
  const [largeText, setLargeText] = useState(false)
  const [locationSharing, setLocationSharing] = useState(true)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Settings saved!')
      router.push('/')
    }, 500)
  }

  const handleBack = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="user" />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Voice Guidance</Label>
                <Switch checked={voiceGuidance} onCheckedChange={setVoiceGuidance} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Large Text</Label>
                <Switch checked={largeText} onCheckedChange={setLargeText} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>Location Sharing</Label>
                <Switch checked={locationSharing} onCheckedChange={setLocationSharing} />
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-4">
            <Button size="lg" className="flex-1" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={handleBack} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
