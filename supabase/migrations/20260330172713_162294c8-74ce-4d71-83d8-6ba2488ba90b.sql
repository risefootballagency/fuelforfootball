-- Add visibility_status column to analyses table (for pre-match/post-match/concept analyses)
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS visibility_status text DEFAULT 'live';

-- Add visibility_status column to player_analysis table (for performance reports)
ALTER TABLE public.player_analysis ADD COLUMN IF NOT EXISTS visibility_status text DEFAULT 'live';