
-- Drop all RLS policies from outreach tables
DROP POLICY IF EXISTS "Staff can manage player_outreach_pro" ON public.player_outreach_pro;
DROP POLICY IF EXISTS "Staff can manage pro outreach" ON public.player_outreach_pro;
DROP POLICY IF EXISTS "Staff can view pro outreach" ON public.player_outreach_pro;
DROP POLICY IF EXISTS "Staff can manage player_outreach_youth" ON public.player_outreach_youth;
DROP POLICY IF EXISTS "Staff can manage youth outreach" ON public.player_outreach_youth;
DROP POLICY IF EXISTS "Staff can view youth outreach" ON public.player_outreach_youth;

-- Disable RLS entirely on these tables
ALTER TABLE public.player_outreach_pro DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_outreach_youth DISABLE ROW LEVEL SECURITY;
