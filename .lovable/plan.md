# Portal & Staff improvements

Six independent changes. Each can be reviewed/rolled back on its own.

## 1. Recolour top grades & R90 gold to FFF Yellow

The "top grade" gold currently resolves to `hsl(43, 49%, 61%)` (a muted orange/khaki). Replace with FFF Yellow `hsl(47, 100%, 51%)` everywhere it's used as the highest-tier R90/grade colour.

Touch points:
- `src/components/report/ActionHeatmap.tsx` — `getR90Color` top band.
- `src/components/report/ChanceCreationFlow.tsx` — same scale.
- Any other report/portal file using the same HSL literal (single sweep).

Leave the lower colour bands alone.

## 2. Fix duplicate "Pre-Match" for Matthias Pieklak on Hub

Investigate `src/components/dashboard/Hub.tsx` — both `preMatchAnalysis` (latest analysis row) and `orphanPreMatchFixtures` (synthesised from fixtures) are rendered. When an analysis exists for the same fixture as the next orphan fixture, both paths fire and render twice.

Fix: deduplicate by fixture id/date before rendering — exclude any orphan fixture whose date matches `preMatchAnalysis.match_date` (or same opponent/date pair).

## 3. Add grade score back on Form chart (Hub)

Re-add the per-game grade number label that previously sat on the Form bars on the Hub. Source value from the same field used historically (`grade` / `r90_grade`). Render as a small label above each bar.

## 4. Performance report header colour match

The colour shown behind the logo in the performance report header (driven by the report editor's chosen accent) should also paint the background of the Raw Score and Minutes blocks at the top, so the whole header reads as one connected band.

File: `src/pages/PerformanceReport.tsx` (and the corresponding viewer section). Pass the same accent token used by the logo strip into the Raw Score/Mins tiles.

## 5. Invoices button + invoicing flow

### UI (player portal)
Next to the existing Notifications and Coach Availability buttons, add a third **Invoices** button. Only render when the player has at least one unpaid invoice. Style it slightly louder than the other two (FFF Yellow background, dark text, subtle pulse) so it draws attention.

Clicking opens a sheet listing each outstanding invoice with title, amount, due date, and a "Pay" CTA that uses the existing pay-link infrastructure.

### Staff side
In Staff → an existing player's profile, add an **Invoice Player** action that:
- Creates a row in a new `player_invoices` table (id, player_id, title, amount, currency, pay_link_id, status, created_at, paid_at).
- Generates a pay link via the existing `notify-pay-link` / pay-link creation flow and stores its id.
- Shows it on the player's portal under the Invoices button.

### Notifications on payment
When the Stripe webhook (or existing pay-link completion handler) marks the invoice paid:
- Insert a `staff_notification_events` row (`event_type: 'invoice_paid'`).
- Send the existing notification email to `info@fuelforfootball.com` via `notify-pay-link` extended for invoice context (or a new small edge function `notify-invoice-paid`).

## 6. Shader-based transitions (parity with RISE)

Read how RISE Football wired the shader background into route transitions and port the same pattern here. We already have `src/components/ui/shader-animation.tsx`; the missing piece is using it as a route/page transition overlay similar to RISE.

Plan: read RISE's transition wrapper, then add an equivalent `ShaderTransition` component used by `TransitionContext` / `PageTransition` in this project, with mobile fallback preserved (RISE constraint memory already covers this).

---

## Technical details

- **Colour token**: add/reuse `--fff-yellow: 47 100% 51%` if not already in `index.css`; use that HSL directly in the report colour scales rather than hard-coded literals so future tweaks are one-line.
- **Invoices schema**: new table `player_invoices` with RLS — players can `SELECT` their own (`player_id` mapped via existing player↔auth link), staff (`has_role(auth.uid(),'admin'|'staff')`) can do everything. Realtime enabled for the portal badge.
- **Invoice pay flow**: reuse existing `pay_links` table where possible — `player_invoices.pay_link_id` references it; webhook handler that already marks pay links completed gets an extra branch to flip the linked invoice to `paid` and emit the staff notification + email.
- **Hub dedupe**: filter `orphanPreMatchFixtures` against `preMatchAnalysis` before the render loop near `Hub.tsx:632`.
- **Shader transitions**: cross-project read of RISE's transition implementation first; reuse our existing `ShaderAnimation` for the visual layer, keep mobile CSS-gradient fallback per existing memory.
