
-- Open RLS on player_analysis, analyses, fixtures, player_fixtures

-- Drop existing policies using proper record variable
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'player_analysis' AND schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.player_analysis', r.policyname);
  END LOOP;
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'analyses' AND schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.analyses', r.policyname);
  END LOOP;
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'fixtures' AND schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.fixtures', r.policyname);
  END LOOP;
END $$;

ALTER TABLE public.player_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to player_analysis" ON public.player_analysis FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to analyses" ON public.analyses FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to fixtures" ON public.fixtures FOR ALL USING (true) WITH CHECK (true);

-- player_fixtures table
CREATE TABLE IF NOT EXISTS public.player_fixtures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID,
  fixture_id UUID REFERENCES public.fixtures(id),
  status TEXT DEFAULT 'available',
  position TEXT,
  rating NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'player_fixtures' AND schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.player_fixtures', r.policyname);
  END LOOP;
END $$;

ALTER TABLE public.player_fixtures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to player_fixtures" ON public.player_fixtures FOR ALL USING (true) WITH CHECK (true);
