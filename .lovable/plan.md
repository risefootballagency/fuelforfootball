

## Fix: JWT Signature Mismatch Between Shared Database and Edge Function

### Root Cause

The app uses **two different Supabase projects**:
- **Shared database** (`qwethimbtaamlhbajmal.supabase.co`) -- where users log in and sessions are created
- **Lovable Cloud** (`wodoiizsonuwtniziicv.supabase.co`) -- where edge functions run

When the admin clicks "Create Account," the client grabs the session token from the **shared** project and sends it to the edge function on the **Lovable Cloud** project. The edge function then calls `auth.getUser(token)` against its own (Lovable Cloud) auth, which rejects it because the token was signed by the shared project. This is the "invalid signature" error in every log.

### Fix

Update the edge function to verify the JWT against the **shared** Supabase project (the one that actually issued the token), not the Lovable Cloud project.

**File: `supabase/functions/create-staff-account/index.ts`**

1. Read the shared database URL and anon key from Deno environment secrets
2. Create the auth-verification client using those shared credentials (not `SUPABASE_URL`/`SUPABASE_ANON_KEY`)
3. Keep the admin/service-role client on Lovable Cloud for any privileged operations that target the shared DB (or switch it to the shared service role key if roles live there)

Since user roles and profiles live on the **shared** database, the service-role admin client also needs to point there. So both clients in the function should target the shared project:

```text
Auth verification client:  shared URL + shared anon key + user's Authorization header
Admin operations client:   shared URL + shared service role key
```

**New secrets needed** (added via the secrets tool):
- `SHARED_SUPABASE_URL` = `https://qwethimbtaamlhbajmal.supabase.co`
- `SHARED_SUPABASE_ANON_KEY` = the shared project's anon key
- `SHARED_SUPABASE_SERVICE_ROLE_KEY` = the shared project's service role key

**Code changes (single file):**
- Replace `Deno.env.get("SUPABASE_URL")` and `Deno.env.get("SUPABASE_ANON_KEY")` in the auth client with `Deno.env.get("SHARED_SUPABASE_URL")` and `Deno.env.get("SHARED_SUPABASE_ANON_KEY")`
- Replace `Deno.env.get("SUPABASE_URL")` and `Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")` in the admin client with `Deno.env.get("SHARED_SUPABASE_URL")` and `Deno.env.get("SHARED_SUPABASE_SERVICE_ROLE_KEY")`
- Redeploy the function

### Important

You will need to provide the **service role key** for the shared Supabase project (`qwethimbtaamlhbajmal`). This is found in that project's Supabase dashboard under Settings > API. I will prompt you to enter it as a secret.

