
-- Player portal settings table for managing per-player hub widget config
CREATE TABLE public.player_portal_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL,
  hub_widget_type TEXT NOT NULL DEFAULT 'aphorisms' CHECK (hub_widget_type IN ('aphorisms', 'sales_box')),
  current_package_name TEXT,
  current_package_price NUMERIC,
  current_package_currency TEXT DEFAULT 'GBP',
  current_package_features TEXT[],
  upgrade_product_id UUID REFERENCES public.service_catalog(id),
  upgrade_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_id)
);

-- Enable RLS
ALTER TABLE public.player_portal_settings ENABLE ROW LEVEL SECURITY;

-- Open policies (staff managed, player readable)
CREATE POLICY "Allow all access to portal settings" ON public.player_portal_settings FOR ALL USING (true) WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_player_portal_settings_updated_at
  BEFORE UPDATE ON public.player_portal_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
