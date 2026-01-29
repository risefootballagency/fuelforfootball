-- Disable RLS on service_catalog table entirely as requested
ALTER TABLE public.service_catalog DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on service_catalog
DROP POLICY IF EXISTS "Anyone can view visible services" ON public.service_catalog;
DROP POLICY IF EXISTS "Authenticated users can manage service_catalog" ON public.service_catalog;
DROP POLICY IF EXISTS "Staff can view all services" ON public.service_catalog;