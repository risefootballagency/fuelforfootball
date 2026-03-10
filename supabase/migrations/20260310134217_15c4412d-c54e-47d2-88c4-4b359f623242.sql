
DROP POLICY IF EXISTS "Authenticated users can manage sales" ON public.sales;
DROP POLICY IF EXISTS "Sales viewable by authenticated users" ON public.sales;

CREATE POLICY "Authenticated users can manage sales"
  ON public.sales FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
