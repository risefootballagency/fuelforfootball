
DROP POLICY IF EXISTS "Authenticated users can manage sales" ON public.sales;

CREATE POLICY "Allow all access to sales"
  ON public.sales FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);
