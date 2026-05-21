CREATE TABLE IF NOT EXISTS public.player_operating_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL UNIQUE,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.player_operating_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view operating profile"
  ON public.player_operating_profile FOR SELECT USING (true);

CREATE POLICY "Anyone can insert operating profile"
  ON public.player_operating_profile FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update operating profile"
  ON public.player_operating_profile FOR UPDATE USING (true);

CREATE POLICY "Admin can delete operating profile"
  ON public.player_operating_profile FOR DELETE
  TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_player_operating_profile_updated_at
  BEFORE UPDATE ON public.player_operating_profile
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();