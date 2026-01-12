-- Drop all existing policies on marketing_gallery
DROP POLICY IF EXISTS "Admin can manage marketing gallery" ON public.marketing_gallery;
DROP POLICY IF EXISTS "Marketeers can manage marketing gallery" ON public.marketing_gallery;
DROP POLICY IF EXISTS "Marketeers can manage marketing_gallery" ON public.marketing_gallery;
DROP POLICY IF EXISTS "Public can view all marketing gallery" ON public.marketing_gallery;
DROP POLICY IF EXISTS "Staff can manage marketing_gallery" ON public.marketing_gallery;

-- Disable RLS completely on marketing_gallery
ALTER TABLE public.marketing_gallery DISABLE ROW LEVEL SECURITY;