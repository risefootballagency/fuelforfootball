
-- Add placeholder_per and placeholder_sr columns to analyses table (shared DB)
-- These are used for hidden visibility status to show PER and SR scores to players
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS placeholder_per numeric;
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS placeholder_sr numeric;
