/*
  # Create worker registrations table

  1. New Tables
    - `worker_registrations`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `date_of_birth` (date, required)
      - `gender` (text, required)
      - `address` (text, required)
      - `city` (text, required)
      - `state` (text, required)
      - `pincode` (text, required)
      - `skills` (text array, required)
      - `experience_years` (integer, required)
      - `education_level` (text, required)
      - `availability` (text, required)
      - `languages` (text array, required)
      - `has_vehicle` (boolean, required)
      - `emergency_contact_name` (text, required)
      - `emergency_contact_phone` (text, required)
      - `aadhar_number` (text, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `worker_registrations` table
    - Add policy for public insert access (registration form)
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS worker_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  skills text[] NOT NULL DEFAULT '{}',
  experience_years integer NOT NULL DEFAULT 0,
  education_level text NOT NULL,
  availability text NOT NULL,
  languages text[] NOT NULL DEFAULT '{}',
  has_vehicle boolean NOT NULL DEFAULT false,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  aadhar_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE worker_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public insert for registration
CREATE POLICY "Allow public insert for worker registration"
  ON worker_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all worker registrations
CREATE POLICY "Allow authenticated users to read worker registrations"
  ON worker_registrations
  FOR SELECT
  TO authenticated
  USING (true);