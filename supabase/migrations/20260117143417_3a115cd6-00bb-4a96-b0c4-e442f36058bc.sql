-- Add player_name column to analyses table for post-match reports
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS player_name TEXT;