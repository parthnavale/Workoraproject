/*
  # Create contact inquiries table

  1. New Tables
    - `contact_inquiries`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, required)
      - `phone` (text, optional)
      - `location` (text, optional)
      - `interest` (text, required)
      - `message` (text, required)
      - `status` (text, default 'new')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `contact_inquiries` table
    - Add policy for public insert access (contact form)
    - Add policy for authenticated admin users to read all inquiries
*/

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  interest text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public insert for contact form submissions
CREATE POLICY "Allow public insert for contact inquiries"
  ON contact_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated admin users to read all contact inquiries
CREATE POLICY "Allow authenticated users to read contact inquiries"
  ON contact_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated admin users to update inquiry status
CREATE POLICY "Allow authenticated users to update contact inquiries"
  ON contact_inquiries
  FOR UPDATE
  TO authenticated
  USING (true);