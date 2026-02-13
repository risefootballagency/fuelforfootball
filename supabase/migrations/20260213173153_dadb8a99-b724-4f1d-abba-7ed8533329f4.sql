DROP POLICY IF EXISTS "Staff can manage retention_clients" ON public.retention_clients;

CREATE POLICY "Staff can manage retention_clients"
  ON public.retention_clients
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = ANY (ARRAY['staff'::app_role, 'admin'::app_role])
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = ANY (ARRAY['staff'::app_role, 'admin'::app_role])
    )
  );