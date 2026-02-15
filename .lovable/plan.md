

## Fix: Remove Edge Function Dependency for Staff Account Management

### Problem
The `create-staff-account` edge function runs on Lovable Cloud but needs to authenticate against the shared database -- requiring secret keys you don't have access to.

### Solution
Move all account management logic from the edge function to **client-side code** using the shared database client that already works. We'll use `auth.signUp()` with a **separate, non-persisting client** so the admin stays logged in while creating new accounts.

### Changes

**File: `src/components/staff/StaffAccountManagement.tsx`**

1. Remove all `fetch()` calls to the edge function
2. Create a helper function that builds a temporary shared Supabase client (no session persistence) for `signUp` calls -- this prevents the admin from being signed out
3. `handleCreateAccount`: Use `tempClient.auth.signUp()` to create the user, then insert the role into `user_roles` and profile into `profiles` using the main shared client
4. `handleResetPassword`: Use shared client's `auth.updateUser()` -- note: this only works for the currently logged-in user, so we'll need to adjust this to send a password reset email instead via `auth.resetPasswordForEmail()`
5. `handleChangeRole`: Update `user_roles` directly via the shared client (no edge function needed)
6. `handleDeleteAccount`: Remove the role from `user_roles` and profile from `profiles` directly (we cannot delete auth users without a service role key, but removing their role effectively revokes access)

### Technical Details

**Temporary client for signUp (prevents admin session loss):**
```typescript
const createTempClient = () => createClient(SHARED_URL, SHARED_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});
```

**Account creation flow:**
```text
1. tempClient.auth.signUp({ email, password, options: { data: { full_name } } })
2. sharedSupabase.from('user_roles').insert({ user_id, role })
```

**Limitations vs. the edge function approach:**
- Password reset becomes "send reset email" instead of setting a new password directly (no service role key means no `admin.updateUserById`)
- Account deletion removes role + profile but the auth user remains (harmless since they have no role, so access is denied)
- New users may need to confirm their email if the shared project has email confirmation enabled

### Files Modified
- `src/components/staff/StaffAccountManagement.tsx` -- rewrite all handlers to use direct client calls

