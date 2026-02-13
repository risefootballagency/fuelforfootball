

## Fix: Retention Client "Failed to Add" Error

### Root Cause

The RLS policy on the `retention_clients` table is missing a `WITH CHECK` clause. The current policy only defines a `USING` (read) condition but has `with_check = NULL`, which means **all INSERT and UPDATE operations are silently denied** by Postgres even for authenticated staff users.

### Fix

**1. Database Migration -- Fix the RLS policy**

Drop the existing broken policy and recreate it with both `USING` and `WITH CHECK` clauses:

```sql
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
```

**2. No code changes needed** -- the component logic is correct; it's purely a database policy issue blocking writes.

