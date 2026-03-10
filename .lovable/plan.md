

# Fix: RLS Policy Violation on `sales` Table

## Problem
The error "new row violates row-level security policy for table sales" occurs when trying to record a sale from the staff dashboard. The RLS policy requires `authenticated` role, but the stripe webhook inserts using the service role key (which bypasses RLS) — so the issue is client-side.

## Root Cause
The existing ALL policy targets `authenticated`, which should work. However, the stripe webhook also inserts into `sales` using `SUPABASE_SERVICE_ROLE_KEY` — that path bypasses RLS and is fine.

The client-side insert is likely failing because either:
1. The user's auth session has expired/is invalid
2. There's a conflict between the two overlapping policies (the ALL + SELECT policies)

## Plan

### 1. Clean up conflicting RLS policies on `sales`
- Drop the redundant `Sales viewable by authenticated users` SELECT policy (the ALL policy already covers SELECT)
- Recreate the ALL policy to be explicit: separate INSERT, SELECT, UPDATE, DELETE policies for `authenticated`
- Also add a policy for the `service_role` or `anon` role if the webhook needs it (though service_role bypasses RLS)

### 2. Add `anon` INSERT policy for webhook compatibility
The stripe webhook creates a Supabase client with `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS entirely — so no change needed there.

### 3. Migration
```sql
DROP POLICY IF EXISTS "Authenticated users can manage sales" ON public.sales;
DROP POLICY IF EXISTS "Sales viewable by authenticated users" ON public.sales;

CREATE POLICY "Authenticated users can manage sales"
  ON public.sales FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
```

This is essentially recreating the same policy. The real fix may be simpler — the session might just be stale. But to be safe, we'll also ensure the code checks for an active session before inserting.

### 4. Add auth session check in SalesManagement
Before the insert call, verify the user has an active session. If not, show an error asking them to log in again. This prevents cryptic RLS errors when sessions expire.

