-- ============================================================================
-- NeuroLens Guardian - Supabase Database Schema (MVP)
-- ============================================================================
-- 
-- This schema defines the core tables for the assistive mobility platform.
-- Designed to be hackathon-friendly, simple, and easy to use from the frontend.
--
-- Tables:
-- 1. users (extends Supabase auth.users)
-- 2. user_locations (real-time location tracking)
-- 3. hazard_events (detected obstacles and hazards)
-- 4. distress_events (user distress detection)
-- 5. guardian_alerts (notifications to caregivers)
-- 6. safe_ride_requests (transportation assistance)
--
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location data (optional but recommended)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
-- Extends Supabase auth.users with additional profile information
-- Note: Supabase auth.users is managed automatically, this is the profile extension

CREATE TABLE public.users (
  -- Primary key references Supabase auth
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic profile
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  
  -- User role
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'caregiver', 'admin')),
  
  -- Emergency contacts
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Medical information (optional)
  medical_conditions TEXT[], -- Array of conditions
  medications TEXT[], -- Array of medications
  allergies TEXT[], -- Array of allergies
  
  -- Preferences
  preferences JSONB DEFAULT '{
    "voice_guidance": true,
    "volume": 75,
    "language": "en",
    "high_contrast": false,
    "large_text": true,
    "notifications_enabled": true
  }'::jsonb,
  
  -- Caregiver relationship (for caregiver role)
  assigned_user_ids UUID[], -- Array of user IDs this caregiver monitors
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_is_active ON public.users(is_active);

-- ============================================================================
-- 2. USER_LOCATIONS TABLE
-- ============================================================================
-- Real-time location tracking for users
-- Optimized for frequent updates and real-time subscriptions

CREATE TABLE public.user_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Location data
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2), -- Accuracy in meters
  altitude DECIMAL(10, 2), -- Altitude in meters (optional)
  heading DECIMAL(5, 2), -- Direction in degrees (0-360)
  speed DECIMAL(10, 2), -- Speed in m/s
  
  -- Context
  address TEXT, -- Reverse geocoded address
  is_moving BOOLEAN DEFAULT false,
  battery_level INTEGER, -- Battery percentage (0-100)
  
  -- Timestamps
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_locations_user_id ON public.user_locations(user_id);
CREATE INDEX idx_user_locations_recorded_at ON public.user_locations(recorded_at DESC);
CREATE INDEX idx_user_locations_user_recorded ON public.user_locations(user_id, recorded_at DESC);

-- Composite index for spatial queries (if using PostGIS)
-- CREATE INDEX idx_user_locations_coords ON public.user_locations USING GIST (
--   ST_MakePoint(longitude, latitude)
-- );

-- ============================================================================
-- 3. HAZARD_EVENTS TABLE
-- ============================================================================
-- Detected hazards and obstacles during navigation

CREATE TABLE public.hazard_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Hazard details
  hazard_type TEXT NOT NULL CHECK (hazard_type IN (
    'vehicle',
    'pedestrian',
    'obstacle',
    'construction',
    'uneven_surface',
    'stairs',
    'traffic',
    'other'
  )),
  
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN (
    'low',
    'medium',
    'high',
    'critical'
  )),
  
  -- Detection details
  confidence DECIMAL(5, 2), -- Detection confidence (0-100)
  distance DECIMAL(10, 2), -- Distance to hazard in meters
  
  -- Location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  
  -- Additional context
  description TEXT,
  image_url TEXT, -- Optional image of the hazard
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_positive')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_hazard_events_user_id ON public.hazard_events(user_id);
CREATE INDEX idx_hazard_events_detected_at ON public.hazard_events(detected_at DESC);
CREATE INDEX idx_hazard_events_severity ON public.hazard_events(severity);
CREATE INDEX idx_hazard_events_status ON public.hazard_events(status);

-- ============================================================================
-- 4. DISTRESS_EVENTS TABLE
-- ============================================================================
-- User distress detection and tracking

CREATE TABLE public.distress_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Distress details
  distress_level TEXT NOT NULL CHECK (distress_level IN (
    'none',
    'low',
    'medium',
    'high',
    'critical'
  )),
  
  -- Indicators
  indicators TEXT[] DEFAULT '{}', -- Array of detected indicators
  -- Examples: 'route_deviation', 'frequent_stops', 'confusion_detected', 
  --           'panic_detected', 'fall_detected', 'no_movement'
  
  -- Context
  route_deviation_meters DECIMAL(10, 2), -- How far off route
  stopped_duration_seconds INTEGER, -- How long stopped
  
  -- Location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  
  -- AI analysis
  ai_confidence DECIMAL(5, 2), -- AI confidence in distress detection (0-100)
  ai_recommendation TEXT, -- AI-suggested action
  
  -- Response
  response_action TEXT, -- Action taken (e.g., 'guardian_notified', 'safe_zone_suggested')
  response_time TIMESTAMP WITH TIME ZONE, -- When response was initiated
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'responding', 'resolved')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  
  -- Timestamps
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_distress_events_user_id ON public.distress_events(user_id);
CREATE INDEX idx_distress_events_detected_at ON public.distress_events(detected_at DESC);
CREATE INDEX idx_distress_events_level ON public.distress_events(distress_level);
CREATE INDEX idx_distress_events_status ON public.distress_events(status);

-- ============================================================================
-- 5. GUARDIAN_ALERTS TABLE
-- ============================================================================
-- Notifications sent to caregivers/guardians

CREATE TABLE public.guardian_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relationships
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, -- User being monitored
  guardian_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE, -- Caregiver receiving alert
  
  -- Alert details
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'distress_detected',
    'hazard_detected',
    'route_deviation',
    'fall_detected',
    'sos_triggered',
    'battery_low',
    'location_update',
    'journey_completed',
    'other'
  )),
  
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN (
    'low',
    'medium',
    'high',
    'critical'
  )),
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Related events (optional references)
  related_hazard_id UUID REFERENCES public.hazard_events(id),
  related_distress_id UUID REFERENCES public.distress_events(id),
  
  -- Location context
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  
  -- Delivery status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  
  -- Actions taken
  action_taken TEXT, -- e.g., 'called_user', 'dispatched_help', 'no_action_needed'
  action_notes TEXT,
  
  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_guardian_alerts_user_id ON public.guardian_alerts(user_id);
CREATE INDEX idx_guardian_alerts_guardian_id ON public.guardian_alerts(guardian_id);
CREATE INDEX idx_guardian_alerts_sent_at ON public.guardian_alerts(sent_at DESC);
CREATE INDEX idx_guardian_alerts_priority ON public.guardian_alerts(priority);
CREATE INDEX idx_guardian_alerts_is_read ON public.guardian_alerts(is_read);
CREATE INDEX idx_guardian_alerts_type ON public.guardian_alerts(alert_type);

-- ============================================================================
-- 6. SAFE_RIDE_REQUESTS TABLE
-- ============================================================================
-- Transportation assistance requests

CREATE TABLE public.safe_ride_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Pickup details
  pickup_latitude DECIMAL(10, 8) NOT NULL,
  pickup_longitude DECIMAL(11, 8) NOT NULL,
  pickup_address TEXT NOT NULL,
  
  -- Dropoff details
  dropoff_latitude DECIMAL(10, 8) NOT NULL,
  dropoff_longitude DECIMAL(11, 8) NOT NULL,
  dropoff_address TEXT NOT NULL,
  
  -- Request details
  passenger_count INTEGER DEFAULT 1,
  wheelchair_accessible BOOLEAN DEFAULT false,
  special_instructions TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN (
    'requested',
    'searching',
    'driver_assigned',
    'driver_arriving',
    'in_progress',
    'completed',
    'cancelled'
  )),
  
  -- Driver information (when assigned)
  driver_name TEXT,
  driver_phone TEXT,
  driver_vehicle TEXT, -- e.g., "Toyota Camry - ABC123"
  driver_photo_url TEXT,
  driver_rating DECIMAL(3, 2), -- e.g., 4.85
  
  -- Estimated times
  estimated_arrival_time TIMESTAMP WITH TIME ZONE,
  estimated_dropoff_time TIMESTAMP WITH TIME ZONE,
  
  -- Actual times
  driver_arrived_at TIMESTAMP WITH TIME ZONE,
  pickup_completed_at TIMESTAMP WITH TIME ZONE,
  dropoff_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Pricing (optional for MVP)
  estimated_price DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  
  -- Cancellation
  cancelled_by TEXT, -- 'user', 'driver', 'system'
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_safe_ride_requests_user_id ON public.safe_ride_requests(user_id);
CREATE INDEX idx_safe_ride_requests_status ON public.safe_ride_requests(status);
CREATE INDEX idx_safe_ride_requests_requested_at ON public.safe_ride_requests(requested_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables for security

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hazard_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distress_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_ride_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Caregivers can read profiles of assigned users
-- Note: This policy checks if the current user is in the target user's assigned_user_ids array
CREATE POLICY "Caregivers can read assigned users"
  ON public.users FOR SELECT
  USING (
    auth.uid() = ANY(assigned_user_ids)
  );

-- ============================================================================
-- USER_LOCATIONS TABLE POLICIES
-- ============================================================================

-- Users can read their own locations
CREATE POLICY "Users can read own locations"
  ON public.user_locations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own locations
CREATE POLICY "Users can insert own locations"
  ON public.user_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Caregivers can read locations of assigned users
CREATE POLICY "Caregivers can read assigned user locations"
  ON public.user_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'caregiver'
      AND user_id = ANY(assigned_user_ids)
    )
  );

-- ============================================================================
-- HAZARD_EVENTS TABLE POLICIES
-- ============================================================================

-- Users can read their own hazard events
CREATE POLICY "Users can read own hazard events"
  ON public.hazard_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own hazard events
CREATE POLICY "Users can insert own hazard events"
  ON public.hazard_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Caregivers can read hazard events of assigned users
CREATE POLICY "Caregivers can read assigned user hazards"
  ON public.hazard_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'caregiver'
      AND user_id = ANY(assigned_user_ids)
    )
  );

-- ============================================================================
-- DISTRESS_EVENTS TABLE POLICIES
-- ============================================================================

-- Users can read their own distress events
CREATE POLICY "Users can read own distress events"
  ON public.distress_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own distress events
CREATE POLICY "Users can insert own distress events"
  ON public.distress_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Caregivers can read distress events of assigned users
CREATE POLICY "Caregivers can read assigned user distress"
  ON public.distress_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'caregiver'
      AND user_id = ANY(assigned_user_ids)
    )
  );

-- Caregivers can update distress events (for resolution)
CREATE POLICY "Caregivers can update assigned user distress"
  ON public.distress_events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'caregiver'
      AND user_id = ANY(assigned_user_ids)
    )
  );

-- ============================================================================
-- GUARDIAN_ALERTS TABLE POLICIES
-- ============================================================================

-- Guardians can read their own alerts
CREATE POLICY "Guardians can read own alerts"
  ON public.guardian_alerts FOR SELECT
  USING (auth.uid() = guardian_id);

-- System can insert alerts (handled by backend/triggers)
CREATE POLICY "System can insert alerts"
  ON public.guardian_alerts FOR INSERT
  WITH CHECK (true); -- Will be restricted by backend logic

-- Guardians can update their own alerts (mark as read, acknowledged)
CREATE POLICY "Guardians can update own alerts"
  ON public.guardian_alerts FOR UPDATE
  USING (auth.uid() = guardian_id);

-- ============================================================================
-- SAFE_RIDE_REQUESTS TABLE POLICIES
-- ============================================================================

-- Users can read their own ride requests
CREATE POLICY "Users can read own ride requests"
  ON public.safe_ride_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own ride requests
CREATE POLICY "Users can insert own ride requests"
  ON public.safe_ride_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ride requests (cancel, etc.)
CREATE POLICY "Users can update own ride requests"
  ON public.safe_ride_requests FOR UPDATE
  USING (auth.uid() = user_id);

-- Caregivers can read ride requests of assigned users
CREATE POLICY "Caregivers can read assigned user rides"
  ON public.safe_ride_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'caregiver'
      AND user_id = ANY(assigned_user_ids)
    )
  );

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for safe_ride_requests table
CREATE TRIGGER update_safe_ride_requests_updated_at
  BEFORE UPDATE ON public.safe_ride_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================
-- Enable realtime for tables that need live updates

-- Enable realtime on user_locations for live tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_locations;

-- Enable realtime on hazard_events for live hazard detection
ALTER PUBLICATION supabase_realtime ADD TABLE public.hazard_events;

-- Enable realtime on distress_events for live distress monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE public.distress_events;

-- Enable realtime on guardian_alerts for instant notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.guardian_alerts;

-- Enable realtime on safe_ride_requests for ride status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.safe_ride_requests;

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================
-- 
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Insert seed data (see seed-data.sql)
-- 3. Test RLS policies
-- 4. Enable realtime subscriptions in your app
--
-- ============================================================================
