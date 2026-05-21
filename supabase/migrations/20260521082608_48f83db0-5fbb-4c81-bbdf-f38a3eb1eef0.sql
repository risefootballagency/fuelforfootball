CREATE TABLE IF NOT EXISTS public.portal_welcome_seen (
  player_id uuid PRIMARY KEY,
  seen_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.portal_welcome_seen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portal welcome seen records"
  ON public.portal_welcome_seen
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create portal welcome seen records"
  ON public.portal_welcome_seen
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update portal welcome seen records"
  ON public.portal_welcome_seen
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete portal welcome seen records"
  ON public.portal_welcome_seen
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));