ALTER TABLE public.player_portal_settings
ADD COLUMN IF NOT EXISTS current_packages jsonb DEFAULT NULL;