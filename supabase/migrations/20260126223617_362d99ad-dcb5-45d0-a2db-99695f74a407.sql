-- Fix the case_studies RLS policy to properly check for authenticated users
DROP POLICY IF EXISTS "Authenticated users can manage case studies" ON public.case_studies;

-- Create proper policy for staff/admin to manage case studies
CREATE POLICY "Staff can manage case studies" 
ON public.case_studies 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));