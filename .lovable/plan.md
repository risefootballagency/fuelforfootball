

# Fix R90 Score on Analysis Viewer + Fix Subscription Pay Links

## Problem 1: R90 showing 0.00 for hidden reports
The code fetches `r90_score` from `player_analysis` but the shared database query only selects `r90_score`. For hidden reports, the R90 score IS stored in `r90_score` — the problem is the fallback logic at line 1244 triggers when `linkedR90 === null`, but the Sarpsborg report likely has `r90_score = 0` (not null) stored, and the fallback never fires. Or the query itself is failing silently.

**Root cause**: The code queries the shared DB via `sharedSupabase` but the fallback calculation also uses `supabase` (shared). The issue is likely that the `r90_score` column stores 0 for hidden reports where the score hasn't been "published" yet, while the actual score of 1.97 must be computed from actions. The `linkedR90 === null` check skips the fallback when the stored value is `0`.

**Fix**: Change the fallback condition from `linkedR90 === null` to `!linkedR90` (falsy check — catches both null and 0), so it always computes from actions when there's no meaningful stored score.

**File**: `src/pages/AnalysisViewer.tsx` line 1244

## Problem 2: Subscription pay links not working

Multiple issues:

### 2a. `create-pay-link` edge function creates Stripe payment links correctly for subscriptions (recurring price), but `Serg Monthly` has `stripe_payment_link_url = NULL` — meaning the Stripe link was never generated or failed.

**Fix**: Add a "Regenerate" button flow and ensure existing subscription pay links can regenerate their Stripe links. On the staff UI, when a subscription link has no Stripe URL, clicking Generate should pass the correct `paymentType: 'subscription'`.

### 2b. `create-pay-checkout` edge function (fallback when no Stripe link exists) hardcodes `mode: "payment"` — it doesn't support subscriptions at all.

**Fix**: Update `create-pay-checkout` to accept `paymentType` and `recurringInterval`. When `paymentType === 'subscription'`, use `mode: "subscription"` and set `price_data.recurring`.

### 2c. `PayLink.tsx` doesn't pass `payment_type` or `recurring_interval` to `PortalPaymentMethods`, so the component can't distinguish subscriptions.

**Fix**: 
- Update `PayLink.tsx` interface to include `payment_type` and `recurring_interval`
- Pass these to `PortalPaymentMethods` as new props
- Update `PortalPaymentMethods` to pass `paymentType` and `recurringInterval` to `create-pay-checkout`
- Update button text: "Subscribe £200.00/mo" instead of "Pay £200.00 by Card"
- Update the Badge from "Payment Request" to "Subscription" for recurring links
- Update PayPal link text and bank transfer instructions accordingly

### 2d. The `Serg Monthly` record has no Stripe link — need to generate one.

**Fix**: The staff can click "Generate" on the existing record. Ensure the edge function `create-pay-link` correctly handles this (it already does based on the code).

## Files to modify

1. **`src/pages/AnalysisViewer.tsx`** — Change R90 fallback from `=== null` to `!linkedR90`
2. **`supabase/functions/create-pay-checkout/index.ts`** — Add subscription mode support
3. **`src/pages/PayLink.tsx`** — Add `payment_type`, `recurring_interval` to interface and pass to PortalPaymentMethods
4. **`src/components/portal/PortalPaymentMethods.tsx`** — Accept `paymentType`/`recurringInterval` props, adapt text and checkout call

