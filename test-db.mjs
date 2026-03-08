/**
 * Database Connection Test Script
 * 
 * Run this script to verify your Supabase database connection and seed data.
 * 
 * Usage: node test-db.mjs
 */

import { createClient } from '@supabase/supabase-js'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kmavjtrmqdjdfvzqpvon.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttYXZqdHJtcWRqZGZ2enFwdm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NDgzMzUsImV4cCI6MjA4ODUyNDMzNX0.sMbWK9ui8tJObe5TkiHNe_hjuoCeipPEGlDT1Gy0pg0'

const supabase = createClient(supabaseUrl, supabaseKey)

const TEST_USER_ID = '11111111-1111-1111-1111-111111111111'

async function testDatabase() {
  console.log('🔍 Testing NeuroLens Guardian Database Connection\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  let allTestsPassed = true

  // Test 1: Get user profile
  console.log('Test 1: Fetching user profile...')
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', TEST_USER_ID)
    .single()

  if (userError) {
    console.error('❌ FAILED:', userError.message)
    allTestsPassed = false
  } else if (user) {
    console.log(`✅ SUCCESS: Found user "${user.full_name}"`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
  } else {
    console.error('❌ FAILED: No user found')
    allTestsPassed = false
  }
  console.log()

  // Test 2: Get user locations
  console.log('Test 2: Fetching location history...')
  const { data: locations, error: locError } = await supabase
    .from('user_locations')
    .select('*')
    .eq('user_id', TEST_USER_ID)
    .order('recorded_at', { ascending: false })
    .limit(5)

  if (locError) {
    console.error('❌ FAILED:', locError.message)
    allTestsPassed = false
  } else if (locations && locations.length > 0) {
    console.log(`✅ SUCCESS: Found ${locations.length} location records`)
    const latest = locations[0]
    console.log(`   Latest: ${latest.address}`)
    console.log(`   Coords: ${latest.latitude}, ${latest.longitude}`)
  } else {
    console.error('❌ FAILED: No locations found')
    allTestsPassed = false
  }
  console.log()

  // Test 3: Get hazard events
  console.log('Test 3: Fetching hazard events...')
  const { data: hazards, error: hazardError } = await supabase
    .from('hazard_events')
    .select('*')
    .eq('user_id', TEST_USER_ID)

  if (hazardError) {
    console.error('❌ FAILED:', hazardError.message)
    allTestsPassed = false
  } else if (hazards) {
    const activeHazards = hazards.filter(h => h.status === 'active')
    console.log(`✅ SUCCESS: Found ${hazards.length} total hazards (${activeHazards.length} active)`)
    if (activeHazards.length > 0) {
      const hazard = activeHazards[0]
      console.log(`   Type: ${hazard.hazard_type}`)
      console.log(`   Severity: ${hazard.severity}`)
      console.log(`   Confidence: ${hazard.confidence}%`)
    }
  } else {
    console.error('❌ FAILED: No hazards found')
    allTestsPassed = false
  }
  console.log()

  // Test 4: Get distress events
  console.log('Test 4: Fetching distress events...')
  const { data: distress, error: distressError } = await supabase
    .from('distress_events')
    .select('*')
    .eq('user_id', TEST_USER_ID)

  if (distressError) {
    console.error('❌ FAILED:', distressError.message)
    allTestsPassed = false
  } else if (distress) {
    const activeDistress = distress.filter(d => d.status === 'active' || d.status === 'responding')
    console.log(`✅ SUCCESS: Found ${distress.length} distress events (${activeDistress.length} active)`)
    if (activeDistress.length > 0) {
      const event = activeDistress[0]
      console.log(`   Level: ${event.distress_level}`)
      console.log(`   Indicators: ${event.indicators.join(', ')}`)
    }
  } else {
    console.error('❌ FAILED: No distress events found')
    allTestsPassed = false
  }
  console.log()

  // Test 5: Get guardian alerts
  console.log('Test 5: Fetching guardian alerts...')
  const { data: alerts, error: alertError } = await supabase
    .from('guardian_alerts')
    .select('*')
    .eq('user_id', TEST_USER_ID)

  if (alertError) {
    console.error('❌ FAILED:', alertError.message)
    allTestsPassed = false
  } else if (alerts) {
    const unreadAlerts = alerts.filter(a => !a.is_read)
    console.log(`✅ SUCCESS: Found ${alerts.length} alerts (${unreadAlerts.length} unread)`)
    if (alerts.length > 0) {
      const alert = alerts[0]
      console.log(`   Type: ${alert.alert_type}`)
      console.log(`   Priority: ${alert.priority}`)
      console.log(`   Title: ${alert.title}`)
    }
  } else {
    console.error('❌ FAILED: No alerts found')
    allTestsPassed = false
  }
  console.log()

  // Test 6: Get safe ride requests
  console.log('Test 6: Fetching safe ride requests...')
  const { data: rides, error: rideError } = await supabase
    .from('safe_ride_requests')
    .select('*')
    .eq('user_id', TEST_USER_ID)

  if (rideError) {
    console.error('❌ FAILED:', rideError.message)
    allTestsPassed = false
  } else if (rides) {
    const activeRides = rides.filter(r => r.status !== 'completed' && r.status !== 'cancelled')
    console.log(`✅ SUCCESS: Found ${rides.length} ride requests (${activeRides.length} active)`)
    if (activeRides.length > 0) {
      const ride = activeRides[0]
      console.log(`   Status: ${ride.status}`)
      console.log(`   From: ${ride.pickup_address}`)
      console.log(`   To: ${ride.dropoff_address}`)
    }
  } else {
    console.error('❌ FAILED: No ride requests found')
    allTestsPassed = false
  }
  console.log()

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!')
    console.log('\nYour database is ready to use.')
    console.log('You can now start the development server with: npm run dev')
  } else {
    console.log('⚠️  SOME TESTS FAILED')
    console.log('\nPlease check:')
    console.log('1. Did you run database/seed-data-simple.sql in Supabase SQL Editor?')
    console.log('2. Are your environment variables correct in .env.local?')
    console.log('3. Is your Supabase project accessible?')
  }
  console.log()
}

// Run the tests
testDatabase().catch(error => {
  console.error('\n❌ Fatal error:', error.message)
  process.exit(1)
})
