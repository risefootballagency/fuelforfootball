-- Disable RLS on analysis_point_examples table
ALTER TABLE public.analysis_point_examples DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies on the table
DROP POLICY IF EXISTS "Anyone can view examples" ON public.analysis_point_examples;
DROP POLICY IF EXISTS "Anyone can insert examples" ON public.analysis_point_examples;
DROP POLICY IF EXISTS "Anyone can update examples" ON public.analysis_point_examples;
DROP POLICY IF EXISTS "Anyone can delete examples" ON public.analysis_point_examples;
DROP POLICY IF EXISTS "Staff can manage examples" ON public.analysis_point_examples;