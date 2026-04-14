

# Payment Audit & RISE Football Sync Plan

## Part 1: Payment Infrastructure Audit

### Current State
The payment setup is **functional but fragmented**:
- **Pay Links** (`create-pay-checkout`, `create-pay-link`): Working for one-off and subscription payments via Stripe Checkout sessions that redirect externally. Bank transfer and PayPal options also available inline.
- **Service Checkout** (`create-service-checkout`): Creates Stripe Checkout sessions for shop/service purchases, also redirects externally.
- **Stripe Webhook** (`stripe-webhook`): Handles `checkout.session.completed` events to update order status and notify staff.
- **Cart** (`Cart.tsx`): Uses `create-service-checkout` for the first item only — does NOT support multi-item carts properly.

### Issues Identified
1. **Cart only checks out the first item** — ignores additional items in the basket
2. **All card payments redirect to Stripe's hosted checkout** — user leaves the site
3. **No embedded/inline payment UI** — could use Stripe Elements for on-site card processing
4. **No webhook secret configured** — webhook falls back to unverified parsing (security risk)

### Improvements to Implement
1. **Fix multi-item cart checkout** — modify `create-service-checkout` to accept an array of line items and create a single session with all cart products
2. **Add Stripe Embedded Checkout** — use `@stripe/react-stripe-js` with `EmbeddedCheckoutProvider` so customers stay on-site for card payments instead of being redirected
3. **Webhook hardening** — prompt user to set `STRIPE_WEBHOOK_SECRET` if missing

## Part 2: RISE Football Feature Sync

### Missing Components to Port (with FFF branding)
These components exist in RISE but are completely absent from FFF:

1. **`ScoreEditMode.tsx`** (680 lines) — Full-screen 2x2 video grid for rapid R90 scoring with central search, auto-advance, XG pitch map popups
2. **`MatchClipPlayer.tsx`** (611 lines) — Full-screen match clip-by-clip player with repeat, skip, sort modes (match/score/type), annotation support
3. **`SPSTimeline.tsx`** — Year-long visual calendar for SPS programs
4. **`UsageSection.tsx`** (183 lines) — Admin usage dashboard showing AI/cloud consumption
5. **`CorporationTaxSection.tsx`** (502 lines) — Corporation tax module with TinyTax export

### Missing Integration Points
6. **`ActionReportsList.tsx`** — RISE has status subtabs (Draft/Clipped/Hidden/Live), Play button for MatchClipPlayer, Score Edit button. FFF version lacks all three.
7. **Performance Report opposition strip** — FFF already has `club_logo_url` and `opposition_color` columns and basic rendering, but the RISE version has `crossOrigin="anonymous"` and slightly different styling (`h-10 md:h-12 rounded-lg` vs FFF's `h-8 md:h-10 rounded-t-lg`). Will align.

### Database Tables Needed
- `corporation_tax_records` table for the Corporation Tax module

## Implementation Steps

### Step 1: Fix multi-item cart checkout
- Update `create-service-checkout` to accept `items[]` array
- Update `Cart.tsx` to send all cart items

### Step 2: Add Stripe Embedded Checkout
- Install `@stripe/react-stripe-js` and `@stripe/stripe-js`
- Create `EmbeddedCheckout.tsx` component
- Update cart flow to embed checkout on-site instead of redirecting

### Step 3: Port ScoreEditMode
- Copy from RISE with FFF branding (accent yellow instead of rise gold)
- Integrate into `ActionReportsList.tsx` and `CreatePerformanceReportDialog.tsx`

### Step 4: Port MatchClipPlayer
- Copy from RISE with FFF branding
- Add Play button to ActionReportsList

### Step 5: Port ActionReportsList subtabs
- Add Draft/Clipped/Hidden/Live status tabs matching RISE implementation

### Step 6: Port SPSTimeline, UsageSection, CorporationTaxSection
- Copy components, create `corporation_tax_records` migration
- Register in `Staff.tsx`

### Step 7: Align opposition color strip
- Update `PerformanceReport.tsx` strip to match RISE styling (`h-10 md:h-12 rounded-lg`, `crossOrigin="anonymous"`, `drop-shadow-lg`)

## Technical Details
- All RISE components use `supabase` client directly; FFF equivalents may need `sharedSupabase` for cross-site data
- ScoreEditMode uses `createPortal(document.body)` for full-screen overlay — same approach for FFF
- FFF accent color `hsl(var(--accent))` replaces RISE gold throughout
- MatchClipPlayer includes `getPlaybackInstruction` from `clipVideoUtils` (already synced)

