
-- Add missing columns to staff_notification_events to match Rise schema
ALTER TABLE public.staff_notification_events
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS body TEXT,
  ADD COLUMN IF NOT EXISTS read_by TEXT[] DEFAULT '{}';

-- Drop old columns that don't exist in Rise (read, message, metadata)
-- First check if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_notification_events' AND column_name='read') THEN
    ALTER TABLE public.staff_notification_events DROP COLUMN read;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_notification_events' AND column_name='message') THEN
    ALTER TABLE public.staff_notification_events DROP COLUMN message;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_notification_events' AND column_name='metadata') THEN
    ALTER TABLE public.staff_notification_events DROP COLUMN metadata;
  END IF;
END $$;
