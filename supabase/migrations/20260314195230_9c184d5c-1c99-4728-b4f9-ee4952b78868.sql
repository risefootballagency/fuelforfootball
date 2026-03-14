-- Allow public (anon) read access to bank_details for pay link pages
CREATE POLICY "Public can view bank_details"
  ON public.bank_details
  FOR SELECT
  TO anon
  USING (true);
