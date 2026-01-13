-- Fix positional_guides to be publicly readable (for non-logged-in players viewing portal content)
DROP POLICY IF EXISTS "Authenticated users can view positional_guides" ON public.positional_guides;
CREATE POLICY "Anyone can view positional_guides" ON public.positional_guides FOR SELECT USING (true);

-- Ensure player_analysis is publicly readable (already has one but let's ensure it's correct)
DROP POLICY IF EXISTS "Anyone can view player analysis" ON public.player_analysis;
CREATE POLICY "Anyone can view player analysis" ON public.player_analysis FOR SELECT USING (true);