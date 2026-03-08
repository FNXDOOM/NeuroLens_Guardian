-- ============================================================================
-- Fix: Infinite Recursion in Users Table RLS Policy
-- ============================================================================
-- 
-- This migration fixes the circular reference in the "Caregivers can read 
-- assigned users" policy that was causing infinite recursion errors.
--
-- Run this in your Supabase SQL Editor to fix the issue.
-- ============================================================================

-- Drop the problematic policy
DROP POLICY IF EXISTS "Caregivers can read assigned users" ON public.users;

-- Recreate the policy without circular reference
-- This checks if the current authenticated user's ID is in the target user's 
-- assigned_user_ids array (meaning the current user is a caregiver for that user)
CREATE POLICY "Caregivers can read assigned users"
  ON public.users FOR SELECT
  USING (
    auth.uid() = ANY(assigned_user_ids)
  );

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this to verify the policy was created successfully:
-- 
-- SELECT * FROM pg_policies WHERE tablename = 'users';
-- 
-- ============================================================================
