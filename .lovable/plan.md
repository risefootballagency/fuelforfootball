## Problem

The Staff notifications dropdown shows "0 notifications" even though the FFF backend currently has **7,726 notification events** (980 site visitors, 10 public analysis views, 3 error reports, etc. in the last 7 days). RLS, roles, and data are all fine.

Two real root causes:

**1. Local auth session is not actually established.**
Staff sign in with credentials that exist on the **shared** backend. The recent dual-login change calls `localSupabase.auth.signInWithPassword(...)` with the same password, but the local backend has its own independent auth. If the password hash on local doesn't match (very likely, since accounts were originally provisioned only on shared), local login silently fails and the dropdown's `select` runs as anonymous → RLS hides every row → "0 notifications". This is also why site visitors / error reports look empty.

**2. Notifications are split across two backends.**
- Written to **local** (FFF-only): `visitor`, `error_report`, `form_submission`, portal events, clip uploads, etc.
- Written to **shared** (cross-site, both FFF and RISE): `performance_improvement` (`CreatePerformanceReportDialog` uses `sharedSupabase`) and similar cross-site events.

The dropdown only queries local, so even after auth is fixed, performance-improvement notifications and other cross-site events will still be missing.

## Plan

### 1. Reliably establish a local auth session for staff

- Add an edge function `staff-provision-local-session` (service role on local backend) that:
  - Looks up a profile by email on the local backend.
  - If the email exists and `user_roles` has staff / admin / marketeer / analyst, resets the local password to match what the staff member just used on the shared login (`supabase.auth.admin.updateUserById`).
  - If the email doesn't exist locally, creates the user with `createUser({ email_confirm: true })` and inserts the appropriate `user_roles` row mirrored from shared.
  - Returns `{ ok: true }` so the client can retry `signInWithPassword`.
- In `Staff.tsx → handleLogin`, after the shared login succeeds:
  1. Try `localSupabase.auth.signInWithPassword`.
  2. On `invalid_credentials` (or any auth error), call the provisioning function with the email + password, then retry the local sign-in once.
  3. Surface a single toast if the local session still fails, but do not block shared login.
- `handleLogout` already clears both — keep as is.

### 2. Make the notifications dropdown read from both backends

Refactor `StaffNotificationsDropdown.tsx`:

- Fetch the last 7 days of `staff_notification_events` from **both** `localSupabase` and `sharedSupabase` in parallel.
- Tag each row with its `source: 'local' | 'shared'`.
- Merge into a single list, de-duplicate by `${source}:${id}`, sort by `created_at` desc.
- `markAsRead` updates the row on the correct backend based on `source`.
- Realtime: subscribe to inserts on both channels (`staff_notifications_dropdown_local`, `staff_notifications_dropdown_shared`) and prepend new rows with the right `source` tag.
- Keep the existing error UI + Retry button; show per-source error if only one side fails (e.g. "Local feed failed - showing shared only").

### 3. Keep site-only feeds local

- Site visitors (`visitor` events) and error reports remain **only** on the local backend, so they only ever show on FFF and never on RISE — exactly what the user asked for.
- Performance improvements stay on shared so both FFF and RISE see them; the dropdown change above is what makes them visible on FFF again.

### 4. Verify

- After deploy, log in as staff:
  - Notifications badge should reflect ~7,700 historical events (capped to 7-day window in UI).
  - Site Visitors section should populate (~980 in last 7 days).
  - Error reports created via the in-app reporter should appear within seconds (realtime).
  - Manually trigger a performance improvement notification (shared) and confirm it shows alongside local ones.

### Technical details

- Files touched:
  - `supabase/functions/staff-provision-local-session/index.ts` (new, `verify_jwt = false`, uses `SUPABASE_SERVICE_ROLE_KEY`).
  - `src/pages/Staff.tsx` (`handleLogin`).
  - `src/components/staff/StaffNotificationsDropdown.tsx` (dual-source fetch, merge, dual realtime, source-aware mark-as-read).
- No schema changes needed; existing RLS policies already cover `staff/admin/marketeer/analyst`.
- Preserves the rule that visitor + internal-only events stay isolated to FFF's local DB.
