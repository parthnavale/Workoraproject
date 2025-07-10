/*
  # Add work_description field to worker registrations

  1. Changes
    - Add `work_description` text field to worker_registrations table
    - Field is optional to maintain compatibility with existing data

  2. Notes
    - This field will store previous work experience descriptions
    - Helps with better worker matching and verification
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'worker_registrations' AND column_name = 'work_description'
  ) THEN
    ALTER TABLE worker_registrations ADD COLUMN work_description text;
  END IF;
END $$;