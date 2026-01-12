-- Add published_date column to press_releases if it doesn't exist
ALTER TABLE public.press_releases 
ADD COLUMN IF NOT EXISTS published_date TIMESTAMP WITH TIME ZONE;