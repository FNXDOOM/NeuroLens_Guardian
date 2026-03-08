'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Navbar } from '@/components/neurolens/navbar'
import { Bell, Shield, User, Users, ArrowLeft, Plus, X } from 'lucide-react'

export default function CaregiverSettingsPage() {
  const router = useRouter()
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [criticalOnly, setCriticalOnly] = useState(false)
  const [autoAcknowledge, setAutoAcknowledge] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Add user dialog state
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [monitoredUsers, setMonitoredUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active' }
  ])

  const handleSave = () => {
    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      // Show success message (you can add a toast notification here)
      alert('Settings saved successfully!')
      // Navigate back to home page
      router.push('/')
    }, 500)
  }

  const handleCancel = () => {
    router.push('/')
  }

  const handleBackToDashboard = () => {
    router.push('/')
  }

  const handleAddUser = () => {
    if (newUserName && newUserEmail) {
      const newUser = {
        id: Date.now().toString(),
        name: newUserName,
        email: newUserEmail,
        status: 'Active'
      }
      setMonitoredUsers([...monitoredUsers, newUser])
      setNewUserName('')
      setNewUserEmail('')
      setIsAddUserDialogOpen(false)
    }
  }

  const handleRemoveUser = (userId: string) => {
    setMonitoredUsers(monitoredUsers.filter(user => user.id !== userId))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="caregiver" />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToDashboard}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Caregiver Settings</h1>
          <p className="text-muted-foreground">Manage your monitoring preferences and notifications</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Caregiver Profile
              </CardTitle>
              <CardDescription>Your caregiver account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="caregiverName">Full Name</Label>
                <Input id="caregiverName" placeholder="Enter your name" defaultValue="Sarah Johnson" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caregiverEmail">Email</Label>
                <Input id="caregiverEmail" type="email" placeholder="your@email.com" defaultValue="sarah@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caregiverPhone">Phone Number</Label>
                <Input id="caregiverPhone" type="tel" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 987-6543" />
              </div>
            </CardContent>
          </Card>

          {/* Monitored Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Monitored Users
              </CardTitle>
              <CardDescription>People you are monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {monitoredUsers.map(user => (
                <div key={user.id} className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-[var(--safe)] text-[var(--safe-foreground)] px-3 py-1 rounded-full">
                        {user.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsAddUserDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User to Monitor
              </Button>
            </CardContent>
          </Card>

          {/* Alert Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Alert Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via text message</p>
                </div>
                <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Critical Alerts Only</Label>
                  <p className="text-sm text-muted-foreground">Only notify for high-priority events</p>
                </div>
                <Switch checked={criticalOnly} onCheckedChange={setCriticalOnly} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Acknowledge Low Priority</Label>
                  <p className="text-sm text-muted-foreground">Automatically acknowledge minor alerts</p>
                </div>
                <Switch checked={autoAcknowledge} onCheckedChange={setAutoAcknowledge} />
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Monitoring Settings
              </CardTitle>
              <CardDescription>Configure monitoring behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Real-time Location Tracking</Label>
                  <p className="text-sm text-muted-foreground">Track user location in real-time</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Journey History</Label>
                  <p className="text-sm text-muted-foreground">Save and review past journeys</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hazard Detection Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified of detected hazards</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Distress Detection</Label>
                  <p className="text-sm text-muted-foreground">Monitor for signs of distress</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User to Monitor</DialogTitle>
            <DialogDescription>
              Enter the details of the person you want to monitor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name</Label>
              <Input
                id="userName"
                placeholder="Enter user's name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email Address</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={!newUserName || !newUserEmail}
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
