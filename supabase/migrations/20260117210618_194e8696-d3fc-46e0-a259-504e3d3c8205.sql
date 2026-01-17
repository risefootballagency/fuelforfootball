-- Add missing kit customisation columns and player team field
ALTER TABLE public.analyses 
ADD COLUMN IF NOT EXISTS kit_collar_color TEXT,
ADD COLUMN IF NOT EXISTS kit_number_color TEXT,
ADD COLUMN IF NOT EXISTS kit_stripe_style TEXT,
ADD COLUMN IF NOT EXISTS player_team TEXT;