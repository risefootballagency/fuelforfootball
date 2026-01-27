-- Drop the restrictive policy
DROP POLICY IF EXISTS "Staff can manage service_catalog" ON public.service_catalog;

-- Create a permissive policy that allows all authenticated users to manage
CREATE POLICY "Authenticated users can manage service_catalog"
ON public.service_catalog
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);