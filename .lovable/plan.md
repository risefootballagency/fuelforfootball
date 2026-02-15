

## Fix: Switch Fixtures to Shared Database

### Problem
`PlayerFixtures.tsx` and `CreatePerformanceReportDialog.tsx` import from the **local** database client, but the `fixtures` and `player_fixtures` tables need to live on the **shared** database alongside players and analyses. This causes foreign key failures and data isolation issues.

### Changes

**1. `src/components/staff/PlayerFixtures.tsx`**
- Change import from `@/integrations/supabase/client` to `@/integrations/supabase/sharedClient` (aliased as `supabase`)

**2. `src/components/staff/CreatePerformanceReportDialog.tsx`**
- Change import from `@/integrations/supabase/client` to `@/integrations/supabase/sharedClient` (aliased as `supabase`)

These are the only two files still using the local client for fixture operations. The other files (`FixturesManagement.tsx`, `StaffSchedule.tsx`, `AnalysisQuickLink.tsx`, `Dashboard.tsx`) already use the shared client.

### Prerequisite
The `fixtures` and `player_fixtures` tables must already exist on the shared database. If they were created locally via migrations, they may need to be created on the shared database as well. Since you mentioned Lovable set up the shared database, these tables should already be there if `FixturesManagement.tsx` (which already uses the shared client) has been working.

### No local database changes needed
The local `fixtures` and `player_fixtures` tables can remain but will no longer be actively used.
