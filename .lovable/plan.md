# Invoicing v2 — Product-aware invoices, searchable dropdowns, portal parity

Reworking the staff invoicing flow so it matches the power of Sales pay links, makes every staff dropdown type-to-search, fixes the player picker, and tightens the portal/hub connection.

## What changes

### 1. Player picker shows everyone, with type-to-search
- Replace the plain `<Select>` for player in the Invoice/Pay-link dialog with the existing `PlayerCombobox` (already supports typing to filter).
- Fetch players with `id, name, position, image_url, club, representation_status` and pass them to the combobox, so Matthias Pieklak and any others currently lost in a 70+ long scroll list become findable by typing 2-3 letters.
- The combobox is grouped by representation_status but every player (including `other`) is rendered — nobody is filtered out.

If Matthias still doesn't appear after this, it means he isn't in the local `players` table at all (he doesn't currently match any row). In that case the user can add him from the Players section, or we can wire a "type a name freehand" fallback later — flag this once tested.

### 2. Every staff dropdown of names becomes type-to-search
- Audit the staff dialogs that use `<Select>` to pick a player and swap them for `PlayerCombobox`. Targeted files (player selectors only — not generic enums like currency):
  - `staff/InvoiceManagement.tsx`
  - `staff/InvoicesManagement.tsx`
  - `staff/SalesManagement.tsx` (player picker)
  - `staff/TransferHub.tsx`
  - `staff/HighlightCompiler.tsx`, `HighlightReelPlayer.tsx`
  - `staff/PlayerScoutingManagement.tsx`, `R90RatingsViewer.tsx`
  - `staff/staffpay/AddEarningDialog.tsx` (staff name picker → reuse same Combobox pattern fed by staff list)
  - Any other player-name dropdowns surfaced during the sweep.
- Generic short dropdowns (currency, payment type, interval, status filters with ≤6 options) stay as `<Select>`.

### 3. Invoice dialog becomes the powerful one — built like Sales pay links
- Widen the dialog: `DialogContent className="max-w-4xl w-[95vw]"`, two-column layout on md+.
- Add a **line-items** section identical in shape to `SalesManagement.tsx`:
  - Pick from existing service catalogue products (with type-to-search), or "Custom item"
  - Per-line: name, qty, unit price, subtotal
  - Auto-sum total and pass the total + line items to `create-pay-link`
  - Persist line items so the portal can render the breakdown
- Keep existing fields: title (auto-fills from first line), description, currency, due date, expires on.
- Add **Invoice type** radio:
  - `agreed` (default) — appears as a normal outstanding invoice
  - `suggestion` — labelled "Suggested / Optional" on hub + sheet; same payment flow but visually distinct, no overdue colouring, copy reads "If you'd like this, you can complete payment below — we haven't discussed this yet."
- Database: add `invoice_kind text default 'agreed'` and `line_items jsonb` to `pay_links`. `is_invoice` stays as the flag, `invoice_kind` distinguishes agreed vs suggestion.

### 4. Portal / Hub connection
- `PlayerInvoicesButton` already queries `pay_links` filtered by `player_id` + `is_invoice=true` + `status != completed`. Verify it for the logged-in player by:
  - Confirming the `player_id` prop is being passed from `Dashboard.tsx` (it is, but double-check after the staff dialog now reliably sets `player_id`).
  - Including suggestion invoices in the count but rendering them in a separate "Suggested" group inside the sheet, with a softer style.
  - Rendering the `line_items` breakdown inside each invoice card.
- Add a realtime + initial-fetch test by creating one invoice from staff and verifying the gold pulse button appears on that player's hub without a refresh.

### 5. Edge function update
- `create-pay-link` accepts a `lineItems` array. When present, build Stripe `line_items` with one `price_data` per line instead of a single computed product. Falls back to current single-product behaviour for plain pay links.

## Technical notes

- New columns on `pay_links`:
  - `invoice_kind text not null default 'agreed'` (`'agreed' | 'suggestion'`)
  - `line_items jsonb` (array of `{product_id, name, quantity, unit_price}`)
- Files touched:
  - `src/components/staff/PayLinksManagement.tsx` — widen dialog, line items UI, combobox player picker, suggestion radio
  - `src/components/staff/SalesManagement.tsx` — reuse product picker, swap player Select for combobox
  - Other staff files listed in §2 — swap Select → PlayerCombobox
  - `src/components/portal/PlayerInvoicesButton.tsx` — render line items, separate suggestion group, copy tweaks
  - `supabase/functions/create-pay-link/index.ts` — multi line-item support
  - Migration adding the two `pay_links` columns

## Out of scope
- Recurring invoices (subscriptions remain via the existing pay-link path).
- Email notifications beyond the existing `invoice_paid` trigger.
