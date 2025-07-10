/*
  # Create waitlist signups table

  1. New Tables
    - `waitlist_signups`
      - `id` (uuid, primary key)
      - `email` (text, required, unique)
      - `signup_type` (text, default 'general') - can be 'business', 'worker', or 'general'
      - `source` (text, optional) - where they signed up from
      - `created_at` (timestamp)
      - `status` (text, default 'active') - active, contacted, converted

  2. Security
    - Enable RLS on `waitlist_signups` table
    - Add policy for public insert access (waitlist form)
    - Add policy for authenticated admin users to read all signups
*/

CREATE TABLE IF NOT EXISTS waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  signup_type text DEFAULT 'general' CHECK (signup_type IN ('general', 'business', 'worker')),
  source text DEFAULT 'homepage_cta',
  status text DEFAULT 'active' CHECK (status IN ('active', 'contacted', 'converted')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow public insert for waitlist signups
CREATE POLICY "Allow public insert for waitlist signups"
  ON waitlist_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated admin users to read all waitlist signups
CREATE POLICY "Allow authenticated users to read waitlist signups"
  ON waitlist_signups
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated admin users to update signup status
CREATE POLICY "Allow authenticated users to update waitlist signups"
  ON waitlist_signups
  FOR UPDATE
  TO authenticated
  USING (true);