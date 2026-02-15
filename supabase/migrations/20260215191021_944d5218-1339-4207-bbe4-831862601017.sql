
-- Drop all existing RLS policies on fixtures
DROP POLICY IF EXISTS "Users can create own fixtures" ON public.fixtures;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.fixtures;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.fixtures;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.fixtures;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.fixtures;

-- Create simple open policies (security handled at app layer)
CREATE POLICY "Allow all select on fixtures" ON public.fixtures FOR SELECT USING (true);
CREATE POLICY "Allow all insert on fixtures" ON public.fixtures FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on fixtures" ON public.fixtures FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on fixtures" ON public.fixtures FOR DELETE USING (true);
