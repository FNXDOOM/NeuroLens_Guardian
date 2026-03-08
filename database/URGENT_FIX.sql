-- ============================================================================
-- URGENT FIX: Infinite Recursion Error
-- ============================================================================
-- Copy and paste this entire file into your Supabase SQL Editor and run it.
-- This will fix the "infinite recursion detected in policy for relation users" error.
-- ============================================================================

-- Step 1: Drop the problematic policy
DROP POLICY IF EXISTS "Caregivers can read assigned users" ON public.users;

-- Step 2: Create the corrected policy (no circular reference)
CREATE POLICY "Caregivers can read assigned users"
  ON public.users FOR SELECT
  USING (
    auth.uid() = ANY(assigned_user_ids)
  );

-- Done! Refresh your application.
