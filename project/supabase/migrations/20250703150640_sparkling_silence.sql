/*
  # Add license number field to business registrations

  1. Changes
    - Add `license_number` text field to business_registrations table
    - Field is optional to maintain compatibility with existing data

  2. Notes
    - This field will store store/shop license numbers
    - Helps with business verification and compliance
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'business_registrations' AND column_name = 'license_number'
  ) THEN
    ALTER TABLE business_registrations ADD COLUMN license_number text;
  END IF;
END $$;