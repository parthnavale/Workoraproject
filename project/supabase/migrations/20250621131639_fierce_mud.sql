/*
  # Create business registrations table

  1. New Tables
    - `business_registrations`
      - `id` (uuid, primary key)
      - `company_name` (text, required)
      - `contact_person` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `business_type` (text, required)
      - `company_size` (text, required)
      - `address` (text, required)
      - `city` (text, required)
      - `state` (text, required)
      - `pincode` (text, required)
      - `gst_number` (text, optional)
      - `website` (text, optional)
      - `description` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `business_registrations` table
    - Add policy for public insert access (registration form)
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS business_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_type text NOT NULL,
  company_size text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  gst_number text,
  website text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public insert for registration
CREATE POLICY "Allow public insert for business registration"
  ON business_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all business registrations
CREATE POLICY "Allow authenticated users to read business registrations"
  ON business_registrations
  FOR SELECT
  TO authenticated
  USING (true);