-- Drop ALL existing policies on analysis_point_examples
DROP POLICY IF EXISTS "Admin can manage analysis examples" ON public.analysis_point_examples;
DROP POLICY IF EXISTS "Staff can manage analysis_point_examples" ON public.analysis_point_examples;
DROP POLICY IF EXISTS "Staff can view analysis examples" ON public.analysis_point_examples;

-- Ensure RLS is disabled
ALTER TABLE public.analysis_point_examples DISABLE ROW LEVEL SECURITY;