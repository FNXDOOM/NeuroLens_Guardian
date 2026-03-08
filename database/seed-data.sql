-- ============================================================================
-- NeuroLens Guardian - Seed Data (MVP)
-- ============================================================================
-- 
-- Mock data for testing and development
-- Run this AFTER creating the schema
--
-- Note: Replace the UUIDs with actual auth.users IDs from your Supabase project
-- or create test users first through Supabase Auth
--
-- ============================================================================

-- ============================================================================
-- SEED DATA FOR USERS TABLE
-- ============================================================================
-- Note: These users should already exist in auth.users
-- This just adds their profile information

-- Example User 1: John Doe (elderly user with mild cognitive impairment)
INSERT INTO public.users (
  id,
  full_name,
  email,
  phone,
  role,
  emergency_contact_name,
  emergency_contact_phone,
  emergency_contact_relationship,
  medical_conditions,
  medications,
  allergies,
  preferences
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with actual auth.users ID
  'John Doe',
  'john.doe@example.com',
  '+1-555-0101',
  'user',
  'Jane Doe',
  '+1-555-0102',
  'Daughter',
  ARRAY['Mild cognitive impairment', 'Hypertension'],
  ARRAY['Aricept 10mg', 'Lisinopril 20mg'],
  ARRAY['Penicillin'],
  '{
    "voice_guidance": true,
    "volume": 85,
    "language": "en",
    "high_contrast": true,
    "large_text": true,
    "notifications_enabled": true
  }'::jsonb
);

-- Example User 2: Maria Garcia (user with autism)
INSERT INTO public.users (
  id,
  full_name,
  email,
  phone,
  role,
  emergency_contact_name,
  emergency_contact_phone,
  emergency_contact_relationship,
  medical_conditions,
  preferences
) VALUES (
  '00000000-0000-0000-0000-000000000002', -- Replace with actual auth.users ID
  'Maria Garcia',
  'maria.garcia@example.com',
  '+1-555-0201',
  'user',
  'Carlos Garcia',
  '+1-555-0202',
  'Father',
  ARRAY['Autism Spectrum Disorder'],
  '{
    "voice_guidance": true,
    "volume": 70,
    "language": "es",
    "high_contrast": false,
    "large_text": true,
    "notifications_enabled": true
  }'::jsonb
);

-- Example Caregiver 1: Jane Doe (daughter, monitoring John)
INSERT INTO public.users (
  id,
  full_name,
  email,
  phone,
  role,
  assigned_user_ids
) VALUES (
  '00000000-0000-0000-0000-000000000003', -- Replace with actual auth.users ID
  'Jane Doe',
  'jane.doe@example.com',
  '+1-555-0102',
  'caregiver',
  ARRAY['00000000-0000-0000-0000-000000000001']::UUID[] -- John's ID
);

-- Example Caregiver 2: Carlos Garcia (father, monitoring Maria)
INSERT INTO public.users (
  id,
  full_name,
  email,
  phone,
  role,
  assigned_user_ids
) VALUES (
  '00000000-0000-0000-0000-000000000004', -- Replace with actual auth.users ID
  'Carlos Garcia',
  'carlos.garcia@example.com',
  '+1-555-0202',
  'caregiver',
  ARRAY['00000000-0000-0000-0000-000000000002']::UUID[] -- Maria's ID
);

-- ============================================================================
-- SEED DATA FOR USER_LOCATIONS TABLE
-- ============================================================================
-- Recent location updates for users

-- John's current location (Times Square, NYC)
INSERT INTO public.user_locations (
  user_id,
  latitude,
  longitude,
  accuracy,
  heading,
  speed,
  address,
  is_moving,
  battery_level,
  recorded_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  40.758000,
  -73.985500,
  10.5,
  45.0,
  1.2,
  'Times Square, Manhattan, NY 10036',
  true,
  75,
  NOW() - INTERVAL '30 seconds'
);

-- John's previous location (5 minutes ago)
INSERT INTO public.user_locations (
  user_id,
  latitude,
  longitude,
  accuracy,
  address,
  is_moving,
  battery_level,
  recorded_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  40.757500,
  -73.986000,
  12.0,
  '7th Avenue, Manhattan, NY 10036',
  true,
  76,
  NOW() - INTERVAL '5 minutes'
);

-- Maria's current location (Central Park)
INSERT INTO public.user_locations (
  user_id,
  latitude,
  longitude,
  accuracy,
  address,
  is_moving,
  battery_level,
  recorded_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  40.785091,
  -73.968285,
  8.0,
  'Central Park, Manhattan, NY 10024',
  false,
  92,
  NOW() - INTERVAL '1 minute'
);

-- ============================================================================
-- SEED DATA FOR HAZARD_EVENTS TABLE
-- ============================================================================
-- Recent hazard detections

-- Vehicle detected near John
INSERT INTO public.hazard_events (
  user_id,
  hazard_type,
  severity,
  confidence,
  distance,
  latitude,
  longitude,
  address,
  description,
  status,
  detected_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'vehicle',
  'high',
  92.5,
  8.0,
  40.758100,
  -73.985400,
  'Times Square, Manhattan, NY 10036',
  'Moving vehicle detected in crosswalk area',
  'active',
  NOW() - INTERVAL '2 minutes'
);

-- Construction barrier detected
INSERT INTO public.hazard_events (
  user_id,
  hazard_type,
  severity,
  confidence,
  distance,
  latitude,
  longitude,
  address,
  description,
  status,
  detected_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'construction',
  'medium',
  84.0,
  12.0,
  40.757800,
  -73.985600,
  '7th Avenue, Manhattan, NY 10036',
  'Construction barrier blocking sidewalk',
  'resolved',
  NOW() - INTERVAL '10 minutes'
);

-- Pedestrian crossing detected near Maria
INSERT INTO public.hazard_events (
  user_id,
  hazard_type,
  severity,
  confidence,
  distance,
  latitude,
  longitude,
  address,
  status,
  detected_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'pedestrian',
  'low',
  97.0,
  3.0,
  40.785200,
  -73.968300,
  'Central Park West, Manhattan, NY 10024',
  'active',
  NOW() - INTERVAL '30 seconds'
);

-- ============================================================================
-- SEED DATA FOR DISTRESS_EVENTS TABLE
-- ============================================================================
-- Distress detection events

-- John showing signs of confusion
INSERT INTO public.distress_events (
  user_id,
  distress_level,
  indicators,
  route_deviation_meters,
  stopped_duration_seconds,
  latitude,
  longitude,
  address,
  ai_confidence,
  ai_recommendation,
  response_action,
  status,
  detected_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'medium',
  ARRAY['route_deviation', 'frequent_stops', 'confusion_detected'],
  150.0,
  180,
  40.758000,
  -73.985500,
  'Times Square, Manhattan, NY 10036',
  78.5,
  'Suggest nearby Safe Zone and notify guardian',
  'guardian_notified',
  'responding',
  NOW() - INTERVAL '5 minutes'
);

-- Maria - low distress (just stopped to rest)
INSERT INTO public.distress_events (
  user_id,
  distress_level,
  indicators,
  stopped_duration_seconds,
  latitude,
  longitude,
  address,
  ai_confidence,
  ai_recommendation,
  status,
  detected_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'low',
  ARRAY['stopped'],
  120,
  40.785091,
  -73.968285,
  'Central Park, Manhattan, NY 10024',
  45.0,
  'Continue monitoring',
  'active',
  NOW() - INTERVAL '2 minutes'
);

-- ============================================================================
-- SEED DATA FOR GUARDIAN_ALERTS TABLE
-- ============================================================================
-- Alerts sent to caregivers

-- Alert to Jane about John's distress
INSERT INTO public.guardian_alerts (
  user_id,
  guardian_id,
  alert_type,
  priority,
  title,
  message,
  related_distress_id,
  latitude,
  longitude,
  address,
  is_read,
  sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- John
  '00000000-0000-0000-0000-000000000003', -- Jane
  'distress_detected',
  'high',
  'Distress Detected - John Doe',
  'John appears confused and has deviated from his route by 150 meters. He has stopped multiple times in the last 5 minutes.',
  (SELECT id FROM public.distress_events WHERE user_id = '00000000-0000-0000-0000-000000000001' ORDER BY detected_at DESC LIMIT 1),
  40.758000,
  -73.985500,
  'Times Square, Manhattan, NY 10036',
  false,
  NOW() - INTERVAL '4 minutes'
);

-- Alert to Jane about hazard detection
INSERT INTO public.guardian_alerts (
  user_id,
  guardian_id,
  alert_type,
  priority,
  title,
  message,
  related_hazard_id,
  latitude,
  longitude,
  address,
  is_read,
  read_at,
  sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- John
  '00000000-0000-0000-0000-000000000003', -- Jane
  'hazard_detected',
  'medium',
  'Hazard Detected - Vehicle',
  'A moving vehicle was detected near John in a crosswalk area.',
  (SELECT id FROM public.hazard_events WHERE user_id = '00000000-0000-0000-0000-000000000001' AND hazard_type = 'vehicle' ORDER BY detected_at DESC LIMIT 1),
  40.758100,
  -73.985400,
  'Times Square, Manhattan, NY 10036',
  true,
  NOW() - INTERVAL '1 minute',
  NOW() - INTERVAL '2 minutes'
);

-- Location update alert to Carlos
INSERT INTO public.guardian_alerts (
  user_id,
  guardian_id,
  alert_type,
  priority,
  title,
  message,
  latitude,
  longitude,
  address,
  is_read,
  sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000002', -- Maria
  '00000000-0000-0000-0000-000000000004', -- Carlos
  'location_update',
  'low',
  'Location Update - Maria Garcia',
  'Maria has arrived at Central Park and is currently resting.',
  40.785091,
  -73.968285,
  'Central Park, Manhattan, NY 10024',
  false,
  NOW() - INTERVAL '1 minute'
);

-- ============================================================================
-- SEED DATA FOR SAFE_RIDE_REQUESTS TABLE
-- ============================================================================
-- Transportation requests

-- John's active ride request
INSERT INTO public.safe_ride_requests (
  user_id,
  pickup_latitude,
  pickup_longitude,
  pickup_address,
  dropoff_latitude,
  dropoff_longitude,
  dropoff_address,
  passenger_count,
  wheelchair_accessible,
  special_instructions,
  status,
  driver_name,
  driver_phone,
  driver_vehicle,
  driver_rating,
  estimated_arrival_time,
  requested_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  40.758000,
  -73.985500,
  'Times Square, Manhattan, NY 10036',
  40.748817,
  -73.985428,
  '350 5th Ave, New York, NY 10118', -- Empire State Building
  1,
  false,
  'Please call when arriving. User may need assistance.',
  'driver_arriving',
  'Michael Johnson',
  '+1-555-0301',
  'Toyota Camry - ABC123',
  4.85,
  NOW() + INTERVAL '3 minutes',
  NOW() - INTERVAL '8 minutes'
);

-- Maria's completed ride from earlier today
INSERT INTO public.safe_ride_requests (
  user_id,
  pickup_latitude,
  pickup_longitude,
  pickup_address,
  dropoff_latitude,
  dropoff_longitude,
  dropoff_address,
  passenger_count,
  status,
  driver_name,
  driver_phone,
  driver_vehicle,
  driver_rating,
  estimated_price,
  final_price,
  driver_arrived_at,
  pickup_completed_at,
  dropoff_completed_at,
  requested_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  40.730610,
  -73.935242,
  '123 Main St, Queens, NY 11375',
  40.785091,
  -73.968285,
  'Central Park, Manhattan, NY 10024',
  1,
  'completed',
  'Sarah Williams',
  '+1-555-0401',
  'Honda Accord - XYZ789',
  4.92,
  25.50,
  25.50,
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '1 hour 55 minutes',
  NOW() - INTERVAL '1 hour 30 minutes',
  NOW() - INTERVAL '2 hours 10 minutes'
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify your seed data was inserted correctly

-- Check users
-- SELECT id, full_name, email, role FROM public.users;

-- Check recent locations
-- SELECT u.full_name, ul.latitude, ul.longitude, ul.address, ul.recorded_at
-- FROM public.user_locations ul
-- JOIN public.users u ON u.id = ul.user_id
-- ORDER BY ul.recorded_at DESC;

-- Check active hazards
-- SELECT u.full_name, he.hazard_type, he.severity, he.status, he.detected_at
-- FROM public.hazard_events he
-- JOIN public.users u ON u.id = he.user_id
-- WHERE he.status = 'active'
-- ORDER BY he.detected_at DESC;

-- Check active distress events
-- SELECT u.full_name, de.distress_level, de.indicators, de.status, de.detected_at
-- FROM public.distress_events de
-- JOIN public.users u ON u.id = de.user_id
-- WHERE de.status IN ('active', 'responding')
-- ORDER BY de.detected_at DESC;

-- Check unread guardian alerts
-- SELECT 
--   u.full_name as user_name,
--   g.full_name as guardian_name,
--   ga.alert_type,
--   ga.priority,
--   ga.title,
--   ga.sent_at
-- FROM public.guardian_alerts ga
-- JOIN public.users u ON u.id = ga.user_id
-- JOIN public.users g ON g.id = ga.guardian_id
-- WHERE ga.is_read = false
-- ORDER BY ga.sent_at DESC;

-- Check active ride requests
-- SELECT u.full_name, sr.status, sr.pickup_address, sr.dropoff_address, sr.requested_at
-- FROM public.safe_ride_requests sr
-- JOIN public.users u ON u.id = sr.user_id
-- WHERE sr.status NOT IN ('completed', 'cancelled')
-- ORDER BY sr.requested_at DESC;

-- ============================================================================
-- SEED DATA COMPLETE
-- ============================================================================
