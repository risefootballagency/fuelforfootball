-- Add manual upgrade offer fields to player_portal_settings
ALTER TABLE public.player_portal_settings
  ADD COLUMN upgrade_name text,
  ADD COLUMN upgrade_price numeric,
  ADD COLUMN upgrade_currency text DEFAULT 'GBP',
  ADD COLUMN upgrade_features text[],
  ADD COLUMN upgrade_pay_link_url text;
