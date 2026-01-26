-- Remove all RLS policies from case_studies and disable RLS entirely
DROP POLICY IF EXISTS "Staff can manage case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Anyone can view visible case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Public can view visible case studies" ON public.case_studies;

-- Disable RLS on case_studies table
ALTER TABLE public.case_studies DISABLE ROW LEVEL SECURITY;