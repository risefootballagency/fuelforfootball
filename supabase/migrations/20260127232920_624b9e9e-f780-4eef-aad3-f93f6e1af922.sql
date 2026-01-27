-- Drop the existing policy
DROP POLICY IF EXISTS "Staff can manage service_catalog" ON public.service_catalog;

-- Recreate with proper WITH CHECK clause
CREATE POLICY "Staff can manage service_catalog"
ON public.service_catalog
FOR ALL
TO public
USING (
  has_role(auth.uid(), 'staff'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'staff'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
);