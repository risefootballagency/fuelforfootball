

## Staff Notifications Sync Plan

### Differences Found

The `StaffNotificationsDropdown.tsx` component is already synced (identical structure, categories, UI). The gaps are in **where and how notifications are fired**:

| Area | RISE | This Project |
|------|------|-------------|
| **Dashboard portal views** | Fires `portal_performance_view` and `portal_analysis_view` separately, includes `player_name`, `player_id`, `sub_tab` in event_data, uses `dedupeKey` | Fires generic `portal_view` without player_id, no dedupeKey |
| **GoalsTasksManagement** | Fires `goal_added`, `task_assigned`, `task_completed` notifications | No notification calls at all |

### Changes

**1. Update Dashboard.tsx portal view notifications**
- Replace the generic `portal_view` event with RISE's split approach: `portal_performance_view` vs `portal_analysis_view` when on the analysis tab
- Include `player_name`, `player_id`, and `sub_tab` in `eventData`
- Add `dedupeKey: playerId` to prevent spam

**2. Add notification calls to GoalsTasksManagement.tsx**
- On goal creation: fire `goal_added` with goal title in event_data
- On task assignment: fire `task_assigned` with task title
- On task completion toggle (when marked complete): fire `task_completed` with task title
- Use dynamic `import("@/lib/staffNotifications")` pattern matching RISE

### Technical Detail
All notification inserts use the existing `insertStaffNotification` helper (fire-and-forget, silent failure). The dropdown already has the category configs for `goal_added`, `task_assigned`, `task_completed`, `portal_performance_view`, `portal_analysis_view` so no UI changes needed.

