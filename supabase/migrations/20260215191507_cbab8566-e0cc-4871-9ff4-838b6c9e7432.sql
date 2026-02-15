
-- Open up player_fixtures RLS
DROP POLICY IF EXISTS "Users can create own player_fixtures" ON public.player_fixtures;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.player_fixtures;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.player_fixtures;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.player_fixtures;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.player_fixtures;
DROP POLICY IF EXISTS "Allow all select on player_fixtures" ON public.player_fixtures;
DROP POLICY IF EXISTS "Allow all insert on player_fixtures" ON public.player_fixtures;
DROP POLICY IF EXISTS "Allow all update on player_fixtures" ON public.player_fixtures;
DROP POLICY IF EXISTS "Allow all delete on player_fixtures" ON public.player_fixtures;

CREATE POLICY "Allow all select on player_fixtures" ON public.player_fixtures FOR SELECT USING (true);
CREATE POLICY "Allow all insert on player_fixtures" ON public.player_fixtures FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on player_fixtures" ON public.player_fixtures FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on player_fixtures" ON public.player_fixtures FOR DELETE USING (true);
