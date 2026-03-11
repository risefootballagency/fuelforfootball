CREATE TABLE IF NOT EXISTS public.transfermarkt_shortlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  position TEXT,
  age INTEGER,
  nationality TEXT,
  club TEXT,
  market_value TEXT,
  agent_status TEXT,
  transfermarkt_url TEXT,
  shortlisted_by TEXT,
  contacted BOOLEAN NOT NULL DEFAULT false,
  contacted_by TEXT,
  contacted_at TIMESTAMPTZ,
  added_to_outreach BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transfermarkt_shortlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to transfermarkt_shortlist"
  ON public.transfermarkt_shortlist FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);