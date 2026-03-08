/**
 * Database Service Usage Examples
 * 
 * This file demonstrates how to use the database service layer
 * in your components and pages.
 */

import {
  // User Locations
  insertUserLocation,
  getLatestUserLocation,
  getUserLocationHistory,
  
  // Hazard Events
  insertHazardEvent,
  getActiveHazards,
  updateHazardStatus,
  
  // Distress Events
  insertDistressEvent,
  getActiveDistressEvents,
  updateDistressEvent,
  
  // Guardian Alerts
  insertGuardianAlert,
  getUnreadAlerts,
  markAlertAsRead,
  
  // Safe Ride Requests
  insertSafeRideRequest,
  getActiveRideRequests,
  updateRideStatus,
  
  // Composite Queries
  fetchLatestUserState,
  fetchCaregiverDashboard,
  
  // Real-time Subscriptions
  subscribeToLocationUpdates,
  subscribeToHazardEvents,
  unsubscribe,
} from '@/services/database'

import { TEST_USERS } from '@/constants/testUsers'

// ============================================================================
// EXAMPLE 1: Track User Location
// ============================================================================

async function trackUserLocation() {
  // Insert a new location record
  const { data, error } = await insertUserLocation({
    user_id: TEST_USERS.JOHN,
    latitude: 40.758000,
    longitude: -73.985500,
    accuracy: 10.5,
    heading: 45.0,
    speed: 1.2,
    address: 'Times Square, Manhattan, NY 10036',
    is_moving: true,
    battery_level: 75,
  })

  if (error) {
    console.error('Error inserting location:', error)
    return
  }

  console.log('Location inserted:', data)
}

// ============================================================================
// EXAMPLE 2: Get Latest User Location
// ============================================================================

async function getLatestLocation() {
  const { data, error } = await getLatestUserLocation(TEST_USERS.JOHN)

  if (error) {
    console.error('Error fetching location:', error)
    return
  }

  console.log('Latest location:', data)
  // Use data.latitude, data.longitude for map display
}

// ============================================================================
// EXAMPLE 3: Report a Hazard
// ============================================================================

async function reportHazard() {
  const { data, error } = await insertHazardEvent({
    user_id: TEST_USERS.JOHN,
    hazard_type: 'vehicle',
    severity: 'high',
    latitude: 40.758100,
    longitude: -73.985400,
    confidence: 92.5,
    distance: 8.0,
    address: 'Times Square, Manhattan, NY 10036',
    description: 'Moving vehicle detected in crosswalk area',
  })

  if (error) {
    console.error('Error reporting hazard:', error)
    return
  }

  console.log('Hazard reported:', data)
}

// ============================================================================
// EXAMPLE 4: Get Active Hazards
// ============================================================================

async function getHazards() {
  const { data, error } = await getActiveHazards(TEST_USERS.JOHN)

  if (error) {
    console.error('Error fetching hazards:', error)
    return
  }

  console.log('Active hazards:', data)
  // Display hazards on map or in a list
}

// ============================================================================
// EXAMPLE 5: Report Distress
// ============================================================================

async function reportDistress() {
  const { data, error } = await insertDistressEvent({
    user_id: TEST_USERS.JOHN,
    distress_level: 'medium',
    latitude: 40.758000,
    longitude: -73.985500,
    indicators: ['route_deviation', 'frequent_stops', 'confusion_detected'],
    route_deviation_meters: 150.0,
    stopped_duration_seconds: 180,
    address: 'Times Square, Manhattan, NY 10036',
    ai_confidence: 78.5,
    ai_recommendation: 'Suggest nearby Safe Zone and notify guardian',
  })

  if (error) {
    console.error('Error reporting distress:', error)
    return
  }

  console.log('Distress event created:', data)
}

// ============================================================================
// EXAMPLE 6: Send Guardian Alert
// ============================================================================

async function sendGuardianAlert() {
  const { data, error } = await insertGuardianAlert({
    user_id: TEST_USERS.JOHN,
    guardian_id: TEST_USERS.JANE,
    alert_type: 'distress_detected',
    priority: 'high',
    title: 'Distress Detected - John Doe',
    message: 'John appears confused and has deviated from his route by 150 meters.',
    latitude: 40.758000,
    longitude: -73.985500,
    address: 'Times Square, Manhattan, NY 10036',
  })

  if (error) {
    console.error('Error sending alert:', error)
    return
  }

  console.log('Alert sent:', data)
}

// ============================================================================
// EXAMPLE 7: Request Safe Ride
// ============================================================================

async function requestSafeRide() {
  const { data, error } = await insertSafeRideRequest({
    user_id: TEST_USERS.JOHN,
    pickup_latitude: 40.758000,
    pickup_longitude: -73.985500,
    pickup_address: 'Times Square, Manhattan, NY 10036',
    dropoff_latitude: 40.748817,
    dropoff_longitude: -73.985428,
    dropoff_address: '350 5th Ave, New York, NY 10118',
    passenger_count: 1,
    wheelchair_accessible: false,
    special_instructions: 'Please call when arriving. User may need assistance.',
  })

  if (error) {
    console.error('Error requesting ride:', error)
    return
  }

  console.log('Ride requested:', data)
}

// ============================================================================
// EXAMPLE 8: Fetch Complete User State
// ============================================================================

async function getUserState() {
  const { data, error } = await fetchLatestUserState(TEST_USERS.JOHN)

  if (error) {
    console.error('Error fetching user state:', error)
    return
  }

  console.log('User profile:', data.profile)
  console.log('Latest location:', data.location)
  console.log('Active hazards:', data.hazards)
  console.log('Active distress:', data.distress)
  console.log('Active rides:', data.rides)

  // Use this data to populate your dashboard
}

// ============================================================================
// EXAMPLE 9: Real-time Location Updates
// ============================================================================

function setupLocationTracking() {
  // Subscribe to location updates
  const subscription = subscribeToLocationUpdates(TEST_USERS.JOHN, (payload) => {
    console.log('New location received:', payload.new)
    
    // Update map marker
    updateMapMarker(payload.new.latitude, payload.new.longitude)
  })

  // Cleanup function (call when component unmounts)
  return () => {
    unsubscribe(subscription)
  }
}

// ============================================================================
// EXAMPLE 10: Real-time Hazard Alerts
// ============================================================================

function setupHazardAlerts() {
  const subscription = subscribeToHazardEvents(TEST_USERS.JOHN, (payload) => {
    console.log('New hazard detected:', payload.new)
    
    // Show notification
    showNotification({
      title: 'Hazard Detected',
      message: `${payload.new.hazard_type} detected nearby`,
      severity: payload.new.severity,
    })
    
    // Add hazard marker to map
    addHazardMarker(payload.new)
  })

  return () => {
    unsubscribe(subscription)
  }
}

// ============================================================================
// EXAMPLE 11: Use in React Component
// ============================================================================

/*
import { useEffect, useState } from 'react'
import { fetchLatestUserState, subscribeToLocationUpdates, unsubscribe } from '@/services/database'
import { TEST_USERS } from '@/constants/testUsers'

export function UserDashboard() {
  const [userState, setUserState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial state
    async function loadUserState() {
      const { data, error } = await fetchLatestUserState(TEST_USERS.JOHN)
      if (!error) {
        setUserState(data)
      }
      setLoading(false)
    }
    
    loadUserState()

    // Subscribe to real-time updates
    const subscription = subscribeToLocationUpdates(TEST_USERS.JOHN, (payload) => {
      setUserState(prev => ({
        ...prev,
        location: payload.new,
      }))
    })

    // Cleanup
    return () => {
      unsubscribe(subscription)
    }
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Location: {userState?.location?.address}</p>
      <p>Active Hazards: {userState?.hazards?.length || 0}</p>
      <p>Distress Level: {userState?.distress?.[0]?.distress_level || 'none'}</p>
    </div>
  )
}
*/

// ============================================================================
// EXAMPLE 12: Caregiver Dashboard
// ============================================================================

async function getCaregiverDashboard() {
  const { data, error } = await fetchCaregiverDashboard(TEST_USERS.JANE)

  if (error) {
    console.error('Error fetching caregiver dashboard:', error)
    return
  }

  console.log('Guardian profile:', data.guardian)
  console.log('Assigned users:', data.users)
  console.log('Unread alerts:', data.alerts)

  // Display all assigned users on map
  data.users.forEach(user => {
    if (user.location) {
      addUserMarkerToMap(user.profile, user.location)
    }
  })
}

// ============================================================================
// Helper functions (implement these in your components)
// ============================================================================

function updateMapMarker(lat, lng) {
  // Update map marker position
  console.log('Update map marker:', lat, lng)
}

function showNotification({ title, message, severity }) {
  // Show toast notification
  console.log('Notification:', title, message, severity)
}

function addHazardMarker(hazard) {
  // Add hazard marker to map
  console.log('Add hazard marker:', hazard)
}

function addUserMarkerToMap(profile, location) {
  // Add user marker to caregiver map
  console.log('Add user marker:', profile.full_name, location)
}

// Export examples for testing
export {
  trackUserLocation,
  getLatestLocation,
  reportHazard,
  getHazards,
  reportDistress,
  sendGuardianAlert,
  requestSafeRide,
  getUserState,
  setupLocationTracking,
  setupHazardAlerts,
  getCaregiverDashboard,
}
