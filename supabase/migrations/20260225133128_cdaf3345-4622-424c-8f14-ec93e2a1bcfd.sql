-- Relax RLS on pay_links to match shared database pattern (cross-site access)
DROP POLICY IF EXISTS "Authenticated users can manage pay links" ON public.pay_links;
DROP POLICY IF EXISTS "Pay links are publicly viewable" ON public.pay_links;

CREATE POLICY "Allow all access to pay links"
ON public.pay_links
FOR ALL
TO public
USING (true)
WITH CHECK (true);