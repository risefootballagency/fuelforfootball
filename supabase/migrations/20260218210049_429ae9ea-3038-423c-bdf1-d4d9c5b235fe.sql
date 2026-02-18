-- Add upgrade_offers JSONB column to store multiple upgrade offers
ALTER TABLE public.player_portal_settings 
ADD COLUMN IF NOT EXISTS upgrade_offers jsonb DEFAULT NULL;