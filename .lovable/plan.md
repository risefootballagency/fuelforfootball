# Staff Pay + Performance Plan

## 1. New "Staff Pay" section (replaces "Expenses" entry in sidebar)

Sidebar `Financial > Tracking` group:
- Replace the standalone `Expenses` link with a single `Staff Pay` link (id `staffpay`).
- `Tax Records` stays as-is.

The `staffpay` page renders a `Tabs` component with three sub-tabs:

1. **My Earnings** (default) - per-staff client/earnings ledger
2. **Payslip** - month-end summary + push-to-admin button
3. **Expenses** - the existing `ExpensesManagement` component, unchanged

Admin sees a fourth tab: **All Staff** (cross-staff view + approve payslips).

## 2. Earnings model

New table `staff_client_earnings`:

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| staff_user_id | uuid | auth.users.id of the staff member |
| client_name | text | free text (player or external client) |
| player_id | uuid null | optional link to `players` |
| invoice_id | uuid null | optional link to `invoices` (auto-pulls amount when paid) |
| earning_type | text | `'work_75'` \| `'commission_10'` \| `'manual'` |
| amount_due | numeric | computed from invoice or manual |
| percentage | numeric | 75 / 10 / custom |
| currency | text | default GBP |
| period_month | text | `YYYY-MM` for grouping |
| status | text | `'pending'` \| `'received'` \| `'paid_out'` |
| received_at | date null | when the client paid the company |
| paid_out_at | date null | when staff was paid |
| notes | text | |
| created_at, updated_at | timestamptz | |

New table `staff_payslips`:

| column | type | notes |
|---|---|---|
| id | uuid pk | |
| staff_user_id | uuid | |
| period_month | text | `YYYY-MM` (unique per staff) |
| gross_amount | numeric | sum of earnings.amount_due where status=received |
| tax_estimate | numeric | configurable rate, default 20% |
| net_amount | numeric | gross - tax |
| currency | text | |
| status | text | `'draft'` \| `'submitted'` \| `'approved'` \| `'paid'` |
| submitted_at, approved_at, paid_at | timestamptz null | |
| admin_notes | text | |

RLS:
- `staff_client_earnings`: staff can CRUD own rows (`staff_user_id = auth.uid()`); admins can read all + update status to `paid_out`.
- `staff_payslips`: staff can read/insert own; admins can read all + update status.

## 3. My Earnings tab

- Table of the staff member's earnings rows for the current month (month picker at top).
- "Add Client Earning" dialog with:
  - Client name (with optional player picker that auto-fills name + links player_id)
  - Optional invoice picker (filter by player). When selected, auto-fills amount.
  - Earning type radio: `Did the work (75%)` / `Sale commission (10%)` / `Manual`
  - Amount field (read-only computed for the first two; editable for manual)
  - Notes
- Inline status toggle: pending -> received (with received_at date) -> paid_out (admin only).
- Totals strip: pending / received-not-paid / paid-out for the selected month.

When an invoice's `amount_paid` increases (via existing payments flow) and a linked earning is `pending`, automatically mark the earning `received` with `received_at = today`. Implemented as a Postgres trigger on `invoices` UPDATE OF amount_paid.

## 4. Payslip tab

- Month selector (defaults to current month, or previous if today >= 28).
- Auto-computed summary: gross (sum of `received` earnings for the period), tax estimate (rate from `staff_pay_settings`, see below), net.
- Breakdown table grouped by client.
- "Submit to Admin" button:
  - Inserts a `staff_payslips` row with status `submitted` and `submitted_at = now()`.
  - Inserts a `staff_notification_events` row of type `payslip_submitted` (existing notification system already surfaces this in admin dropdown).
- Auto-prompt banner shown from the 28th of each month onward if no payslip submitted for the period yet.
- Once submitted: shows status badge (Submitted / Approved / Paid) with admin notes.

## 5. All Staff tab (admin only)

- Two sub-views: `Payslips` (list of submitted payslips with Approve / Mark Paid buttons) and `Earnings Ledger` (filterable by staff member + month).
- Approve sets status `approved` + `approved_at`. Mark Paid sets status `paid` + `paid_at` and bulk-flips that period's earnings to `paid_out`.
- Each action also writes a `staff_notification_events` row so the staff member sees it.

## 6. Global income / salary / tax aggregation

New small settings table `staff_pay_settings` (one row per staff_user_id): default tax rate (%), preferred currency, default earning type. Used by `FinancialReports`, `FinancialOverviewWidget`, and the Payslip tab.

`FinancialReports` updated:
- Add a "Staff Costs" line: sum of `staff_payslips` with status in (`approved`, `paid`) for the selected period, treated as an outgoing alongside expenses + payments-out.
- Net Position = invoice income - expenses - payments out - approved staff payslips.
- Add a per-staff breakdown card (admin only).

`FinancialOverviewWidget` adds a 6th tile: "Staff Costs (month)".

`PaymentsManagement` (Payments In/Out) gains a quick filter chip "Staff Salary" that only shows payments tagged with `payment_method = 'staff_salary'`. When admin marks a payslip as Paid, a corresponding `payments` row (`type='out'`, method `staff_salary`, reference = payslip id) is auto-inserted, so all existing financial views stay correct without duplicate accounting.

## 7. Performance: lazy-load Staff sections

Current state: `src/pages/Staff.tsx` statically imports 83 staff components. Every tab loads on first render even though only one is visible. This is the main reason the staff page feels heavy.

Changes:
- Convert all section components (the ones rendered inside the `expandedSection === 'x' && <X />` block, lines ~1225-1316) to `React.lazy(() => import(...))`.
- Wrap the active-section render area in a single `<Suspense fallback={<TableSkeleton />}>`.
- Keep small, always-visible pieces (`StaffOverview`, `StaffBreadcrumb`, header tab bar, sidebar) eager.
- Switch the conditional `expandedSection === 'x' && <X />` pattern to a small `componentMap` keyed by id so only the active section ever gets imported. The two existing "always-mounted" sections (`analysis` and `videoanalysis`, currently using `<div className="hidden">`) stay eager-mounted but lazy-imported once first opened.
- Drop the `useEffect`-based section preloads if any, and rely on Vite's dynamic import chunking.

Other quick wins applied in the same pass:
- `FinancialOverviewWidget` and similar widgets: skip data fetching while their parent section is not active (gate the `useEffect` on an `enabled` prop, default true, set false from `StaffOverview` widgets that are off-screen).
- Memoise `buildCategories()` (currently called on every keystroke / search) with `useMemo` keyed on `[isAdmin, isMarketeer, isAnalyst]`.
- Debounce `searchQuery` (already has `searchTimeoutRef` for search-results; also gate the categories filter behind the same debounce).

Expected impact: initial Staff bundle drops from ~all-sections to overview + sidebar only; subsequent section opens fetch a small chunk.

## 8. Files touched

- `src/pages/Staff.tsx` - sidebar entry change, lazy imports + Suspense + componentMap, debounce/memo.
- `src/components/staff/StaffPay.tsx` (new) - tab container.
- `src/components/staff/staffpay/MyEarnings.tsx` (new)
- `src/components/staff/staffpay/AddEarningDialog.tsx` (new)
- `src/components/staff/staffpay/PayslipTab.tsx` (new)
- `src/components/staff/staffpay/AllStaffTab.tsx` (new, admin)
- `src/components/staff/FinancialReports.tsx` - add staff costs line + per-staff card.
- `src/components/staff/widgets/FinancialOverviewWidget.tsx` - 6th tile + enabled prop.
- `src/components/staff/PaymentsManagement.tsx` - "Staff Salary" filter chip.
- One DB migration creating `staff_client_earnings`, `staff_payslips`, `staff_pay_settings`, RLS policies, and the invoice -> earning auto-receive trigger.

## 9. Notifications

Reuses existing `staff_notification_events`:
- `payslip_submitted` (staff -> admin)
- `payslip_approved`, `payslip_paid` (admin -> staff)
- `earning_received_auto` (when invoice payment auto-flips an earning, light toast only; suppressed if user already on Staff Pay)
