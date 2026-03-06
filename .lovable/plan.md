
Goal: restore RISE-equivalent staff notifications so site visitors, portal logins, and performance report views actually appear.

What I found (root cause):
1) `staff_notification_events` is empty (`0` rows) in this project.
2) `site_visits` is actively receiving data (thousands of rows), so tracking exists.
3) `staff_notification_events` RLS currently has only a SELECT policy; no INSERT policy (and no UPDATE read-status policy), so portal-side client inserts are blocked.
4) The DB trigger package that exists in RISE (auto-writing notification events from `site_visits`, `form_submissions`, `playlists`, `players`) is missing here.
5) Realtime publication currently does not include `staff_notification_events`, so bell dropdown live updates won’t fire even when rows exist.
6) Notification settings UI diverged from RISE and is not backed by `staff_notification_settings` like RISE.

Concise implementation plan:
1) Sync backend notification schema/policies from RISE
- Add `staff_notification_settings` table + role/event settings policies + updated_at trigger.
- Ensure `staff_notification_events` matches RISE shape (`title`, `body`, `read_by`) and add missing UPDATE policy for read status.
- Keep staff/admin read policies aligned with current role model.

2) Port RISE notification trigger pipeline
- Add RISE trigger functions and triggers:
  - `log_site_visit_notification` on `site_visits` INSERT
  - `log_form_submission_notification` on `form_submissions` INSERT
  - `log_playlist_change_notification` on `playlists` INSERT/UPDATE/DELETE
  - `log_clip_upload_notification` on `players` UPDATE (highlights diff)
- This removes dependence on staff browser subscriptions for these event sources and matches RISE behavior.

3) Fix portal-origin notification writes (logins + performance views)
- Ensure `portal_login`, `portal_performance_view`, `portal_analysis_view` events can be persisted in this project’s backend path.
- Align `Dashboard.tsx` tracking logic back to RISE behavior (only analysis context generates performance/analysis view events; no broad non-analysis misclassification).
- Keep event payload parity (`player_id`, `player_name`, `sub_tab`, dedupe behavior).

4) Realtime parity for dropdown UX
- Add `staff_notification_events` to realtime publication (as in RISE migration) so dropdown updates instantly on new events.

5) UI parity cleanup
- Replace current `NotificationSettingsManagement.tsx` with RISE role/event matrix behavior backed by `staff_notification_settings`.
- Remove legacy/non-RISE event drift (e.g., outdated IDs that don’t map to actual emitted event types).

Technical details (exact files/touchpoints):
- DB migrations (new migration in this project):
  - create/update policies for `public.staff_notification_events`
  - create `public.staff_notification_settings`
  - create 4 notification trigger functions + 4 triggers
  - `ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_notification_events`
- Frontend:
  - `src/pages/Dashboard.tsx` (restore RISE event emission conditions for portal view events)
  - `src/components/staff/NotificationSettingsManagement.tsx` (RISE settings table-driven version)
  - optional cleanup in `src/components/staff/StaffNotificationsDropdown.tsx` for event label parity (`portal_view` legacy handling)

Validation checklist after implementation:
1) Visit public pages → new `visitor` events appear in bell list.
2) Player login via `/login` → `portal_login` appears.
3) Player opens portal analysis/performance tabs → `portal_performance_view` / `portal_analysis_view` appear.
4) New form submission / playlist change / clip update → corresponding events appear without needing staff page open.
5) Mark-as-read works (UPDATE policy verified).
6) Realtime bell updates without manual refresh.

Expected outcome:
Notification pipeline will match RISE’s working model and stop relying on currently broken paths (missing trigger migrations + blocked inserts), which is why you currently see “literally nothing.”
