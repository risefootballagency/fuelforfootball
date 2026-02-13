DROP POLICY IF EXISTS "Staff can manage retention_clients" ON public.retention_clients;

-- Local DB has no auth session (auth is on shared DB).
-- Access control is enforced at the application layer via sharedSupabase auth + role checks.
CREATE POLICY "Allow retention_clients access"
  ON public.retention_clients
  FOR ALL
  USING (true)
  WITH CHECK (true);