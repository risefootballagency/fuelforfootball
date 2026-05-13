## Diagnosis

Two separate problems are happening:

1. **Notifications** are still using the local backend client in `StaffNotificationsDropdown`, while Staff authentication and most Staff data on this project use the shared Staff backend client. That mismatch means the logged-in Staff session is not consistently attached to notification reads/writes, so the dropdown can fail instantly even though notification records exist.
2. **Staff Pay** is using the local backend client inside `StaffPay`, `MyEarnings`, `AddEarningDialog`, `PayslipTab`, `AllStaffTab`, and `useStaffList`, but the Staff page logs users in through the shared Staff backend. That is why Staff members do not show, and why adding earnings is blocked or confusing. The database currently only has one local profile/role anyway, so querying local roles cannot build the expected Staff list.

## Plan

### 1. Fix notification loading and reporting
- Change `StaffNotificationsDropdown` to use the same shared Staff backend client as the Staff page.
- Change the global error-report action in `main.tsx` so reported errors go through the same client as Staff notifications, instead of disappearing into the wrong backend.
- Keep the existing notification UI, but add a visible dropdown error state so it does not silently look empty when a request fails.
- Bring across the safer RISE notification handling for unknown event types and recent event categories such as `error_report`, `staff_activity`, `message_sent`, `player_updated`, and `player_created`.

### 2. Fix Staff Pay data access
- Move Staff Pay components to the shared Staff backend client so they use the active Staff session and shared `user_roles` / `profiles` data.
- Update `useStaffList` so it loads all Staff/Admin/Analyst/Marketeer users from the shared Staff roles table, with loading and error feedback.
- Make `AddEarningDialog` block saving only when an admin has no assigned Staff member selected, and show a clear message instead of a generic backend error.
- Keep the existing earnings, payslip, and admin tabs intact, but ensure all reads/writes hit the same backend as Staff login.

### 3. Make Staff Pay more intuitive without changing the business rules
- Add a compact explanatory header in Staff Pay: “Log client work -> mark received -> submit payslip -> admin pays out”.
- In the Add Earning dialog, show loading/empty states for Staff members, players, and invoices.
- Default admins to their own account if available, but allow assigning work to any Staff member.
- Improve form validation messages for missing client, missing Staff member, and zero-value earnings.

### 4. Backend policy check after code alignment
- Check the shared backend policies for `staff_notification_events`, Staff roles/profiles, and Staff Pay tables.
- If any required shared access policies or Staff Pay tables are missing, add the minimal secure migration there: Staff can manage their own earnings/settings/payslips, admins can manage all, and Staff roles remain in `user_roles` only.

### Files expected to change
- `src/components/staff/StaffNotificationsDropdown.tsx`
- `src/main.tsx`
- `src/components/staff/StaffPay.tsx`
- `src/components/staff/staffpay/useStaffList.ts`
- `src/components/staff/staffpay/AddEarningDialog.tsx`
- `src/components/staff/staffpay/MyEarnings.tsx`
- `src/components/staff/staffpay/PayslipTab.tsx`
- `src/components/staff/staffpay/AllStaffTab.tsx`
- Possibly one backend migration if the shared Staff backend is missing the necessary Staff Pay access rules.

## Validation
- Open Staff notifications and confirm the dropdown shows actual categories instead of an instant failure.
- Trigger an error report and confirm it appears under notifications.
- Open Staff Pay as admin and confirm Staff members populate.
- Add a client earning and confirm it appears in My Earnings / All Staff without an RLS or empty-staff failure.