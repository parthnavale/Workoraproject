/*
  # Fix Business Registration RLS Policy

  1. Security Updates
    - Update RLS policy to allow authenticated users to insert their own business registration
    - Remove the anonymous insert policy as it's not needed for the current flow
    - Add policy for authenticated users to insert data where the ID matches their auth.uid()

  2. Changes
    - Drop existing INSERT policy for anonymous users
    - Add new INSERT policy for authenticated users
    - Ensure users can only insert their own registration data
*/

-- Drop the existing anonymous insert policy
DROP POLICY IF EXISTS "Allow public insert for business registration" ON business_registrations;

-- Create new policy for authenticated users to insert their own business registration
CREATE POLICY "Allow authenticated users to insert own business registration"
  ON business_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also ensure authenticated users can read their own business registration
DROP POLICY IF EXISTS "Allow authenticated users to read business registrations" ON business_registrations;

CREATE POLICY "Allow authenticated users to read own business registration"
  ON business_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);