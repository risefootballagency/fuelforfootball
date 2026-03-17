

# Plan: Fix Staff Notifications, Portal Buttons, Mobile Tabs & Edge Function Error Handling

## Issues Identified

### 1. Staff Notifications — Duplicate insertions & missing event types
- **Duplicate visitors**: The `log_site_visit_notification` DB trigger AND the `useStaffNotifications` hook both insert into `staff_notification_events` on every site visit, causing every visitor notification to appear twice.
- **Missing event types**: The DB only has `visitor`, `portal_performance_view`, `portal_analysis_view`, `portal_login`, and `form_submission`. Missing: `clip_upload`, `playlist_change`, `task_assigned`, `task_completed`, `goal_added`, `performance_improvement`, `contract_signed`, `comparison_request`, `player_birthday`. The DB triggers exist for `clip_upload`, `playlist_change`, `form_submission`, and `visitor` but the `useStaffNotifications` hook ALSO listens via realtime and inserts duplicates for the same events.
- **Fix**: Remove the realtime-based `useStaffNotifications` hook invocations that duplicate what the DB triggers already do. The hook should be removed entirely since DB triggers handle `visitor`, `form_submission`, `playlist_change`, and `clip_upload` already. For events not covered by triggers (like `performance_improvement`), those are inserted directly in code (e.g., `CreatePerformanceReportDialog`), which is correct.

### 2. Portal Overview — Analysis & Programming buttons not working
- The `MobileBottomNav` conditionally hides the Analysis and Programming buttons via `hasAnalysis={analyses.length > 0}` and `hasProgramming={programs.some(p => !!p.is_current)}`. If a player has no analyses or no current program, these tabs are completely hidden.
- **Fix**: Always show both tabs in the bottom nav (remove conditional hiding). When a player has no content, show an empty state on the tab instead of hiding navigation entirely. The user expects these buttons to always be clickable.

### 3. Staff Tabs — Mobile should show icons only
- On mobile, staff header tabs show `<TabIcon>` + `<span>{tab.title}</span>`, taking too much horizontal space.
- **Fix**: On mobile (`isMobile`), hide the text label in each tab and show only the icon. Keep the title visible on desktop.

### 4. Edge Function Error Handling Audit
- **45 files** use `supabase.functions.invoke()` directly without `FunctionsHttpError` handling. Only 8 files use the existing `invokeEdgeFunction` helper (which already handles `FunctionsHttpError` correctly).
- The remaining ~37 files catch errors but get the generic "Edge Function returned a non-2xx status code" message instead of the actual error body.
- **Fix**: Migrate all `supabase.functions.invoke()` calls to use the existing `invokeEdgeFunction` helper from `@/lib/edgeFunctionHelper.ts`, which already extracts the real error body from `FunctionsHttpError`. Files to update include:
  - `useAutoTranslate.ts`, `usePageTracking.ts`, `ServiceDetail.tsx`, `PlaylistContent.tsx` (4 calls), `PortalManagementAdmin.tsx` (3 calls), `LanguagesManagement.tsx`, `ImageCreator.tsx`, `MessagePathways.tsx`, `Cart.tsx`, `replaceProgramHelper.ts`, `EmailResponseDialog.tsx`, `RecruitmentManagement.tsx`, `PortalManagement.tsx` (2 calls), `DeclareInterestDialog.tsx`, `ContractCrossReference.tsx`, `AnalysisComparisons.tsx`, `ScoutingCentre.tsx`, `AISessionSuggestions.tsx`, `CognisanceSection.tsx`, `useTranslateContent.ts` (2 calls), `LanguageContext.tsx`, plus others from the 45-file list.
  - For calls using `sharedSupabase`, pass it as the third `client` parameter to `invokeEdgeFunction`.

## Implementation Order

1. **Fix duplicate notifications** — Remove `useStaffNotifications` hook usage from `Staff.tsx` since DB triggers already handle all those events. Remove or deprecate the hook itself.
2. **Fix portal bottom nav** — Remove `hasAnalysis` and `hasProgramming` conditional filtering so tabs always show.
3. **Fix staff mobile tabs** — Hide tab title text on mobile, show icon only.
4. **Migrate edge function calls** — Update all 37+ files to use `invokeEdgeFunction` instead of raw `supabase.functions.invoke()`.

