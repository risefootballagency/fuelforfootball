

# Sales & Marketing Enhancement Plan

## What We're Building

Seven improvements across the staff tools, service pages, player portal, and WhatsApp CTA to make the platform more visually premium and conversion-focused.

---

## 1. Image Gallery AI Tagging (Staff - ImageCreator)

Add an "Auto-Tag" button on each gallery image that uses Lovable AI (Gemini Flash) to analyse the image and generate descriptive tags like "training", "match day", "pitch". Tags are stored in a new `tags` column on the `marketing_gallery` table. Filter chips appear above the gallery grid so staff can quickly find images by tag.

- Database migration: add `tags text[] DEFAULT '{}'` to `marketing_gallery`
- New edge function `ai-image-tagger` that accepts an image URL and returns tag suggestions via Gemini Flash
- UI: small tag icon button on each image thumbnail, filter chip row above gallery

---

## 2. Premium Brand Restyling (Staff Sales & Marketing)

Update the visual styling of staff sales and marketing cards to match the FFF premium identity:

- `SalesTracker`, `RetentionTracker`, `SalesHub`, `OutreachKanban`: dark gradient card backgrounds (`from-black/60 to-black/40`), `border-accent/20` borders, `font-bebas` uppercase headings, gold accent on stat numbers and progress bars
- `BTLWriter`, `ContentCreator`, `ContentCalendar`, `ImageCreator`: same treatment
- Animated KPI counters using `framer-motion` `useSpring` for numbers like packages sold, revenue, active clients (counting up on mount)
- All interactive elements (buttons, active tabs, highlights) use FFF Yellow accent

---

## 3. Portal Upgrade Cards Redesign (Hub.tsx)

Enhance the upgrade offer cards on the player Hub:

- Gold gradient shimmer border animation using CSS `@keyframes` on the card border
- Feature list with checkmark icons instead of plain tag chips
- Comparison layout: if the player has a current package, show a side-by-side "Current vs Upgrade" view highlighting what they gain
- Pulsing CTA button with `framer-motion` scale animation on hover
- "Save X%" badge calculated when upgrading (if price difference is available)

No "Most Popular" or "Recommended" ribbon badges.

---

## 4. "Results You Can Expect" Stats Section (Service Pages)

Add a data-driven stats/evidence section to `ServicePageLayout` that appears between the hero and the main content:

- Staff-controlled: add a new `service_page_stats` table with columns: `page_key` (e.g. "analysis", "conditioning"), `stats` (JSONB array of `{label, value, suffix}`), and `updated_at`
- Staff management: new "Service Stats" section in the Service Catalogue staff area where staff can set the counter values per service page (e.g. Analysis page: "25% Physical Improvement", "1200+ Matches Analysed")
- Frontend: `ServiceStatsBar` component fetches stats for the current page key, renders animated count-up numbers using `framer-motion` `whileInView` + `useSpring`
- Displayed as a compact row of 3-4 stat counters with accent-coloured numbers on a dark semi-transparent bar

---

## 5. Portal "Your Progress" Card (Hub.tsx)

Add a compact progress visualisation to the player Hub:

- Fetch last 10 `r90_score` values from `performance_statistics` for the logged-in player
- Calculate percentage change vs 3 months ago
- Only render the card if the percentage change is positive
- Show a mini Recharts sparkline of score trajectory + a green "+X%" badge
- Card styled with dark background and accent border, positioned in the Hub sales box area

---

## 6. Animated "Add to Basket" Button (ServiceDetailPanel)

Enhance the existing Add to Basket button:

- On hover: cart icon bounces using `framer-motion` `animate={{ y: [0, -4, 0] }}`
- On click: brief scale pulse (`scale: [1, 1.1, 1]`) before transitioning to the "Added" state
- The existing colour transitions and "Added" checkmark state remain unchanged
- Applied to both the desktop and mobile button instances

---

## 7. Contextual WhatsApp Pre-fill (WhatsAppPulse)

Update `WhatsAppPulse` to accept an optional `serviceName` prop:

- When provided, the WhatsApp URL pre-fills with: "Hi, I'm interested in your {serviceName} programme. Can you tell me more?"
- When not provided, falls back to the existing default message
- Update all service pages (`Analysis.tsx`, `Conditioning.tsx`, `Mental.tsx`, etc.) to pass their service name to the floating `WhatsAppPulse` component
- Update `ServicePageLayout` to optionally render the floating WhatsApp CTA with the category name pre-filled

---

## Technical Details

### Database Migration
```sql
-- Add tags to marketing_gallery
ALTER TABLE marketing_gallery ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Create service_page_stats table for staff-controlled counters
CREATE TABLE service_page_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text UNIQUE NOT NULL,
  stats jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE service_page_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read" ON service_page_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON service_page_stats FOR SELECT TO anon USING (true);
CREATE POLICY "Allow staff write" ON service_page_stats FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
```

### New Files
- `supabase/functions/ai-image-tagger/index.ts` - Edge function for AI image tagging
- `src/components/services/ServiceStatsBar.tsx` - Animated stats counter bar
- `src/components/portal/ProgressSummary.tsx` - Hub sparkline progress card
- `src/components/staff/sales/ServiceStatsManager.tsx` - Staff UI for managing per-page stats

### Modified Files
- `src/components/staff/marketing/ImageCreator.tsx` - AI tag button + filter chips
- `src/components/staff/sales/SalesTracker.tsx` - Premium restyling + animated counters
- `src/components/staff/sales/RetentionTracker.tsx` - Premium restyling
- `src/components/staff/sales/SalesHub.tsx` - Premium restyling
- `src/components/staff/sales/OutreachKanban.tsx` - Premium restyling
- `src/components/staff/marketing/BTLWriter.tsx` - Premium restyling
- `src/components/staff/marketing/ContentCreator.tsx` - Premium restyling
- `src/components/staff/marketing/ContentCalendar.tsx` - Premium restyling
- `src/components/dashboard/Hub.tsx` - Upgrade card redesign + progress summary
- `src/components/ServiceDetailPanel.tsx` - Animated Add to Basket button
- `src/components/WhatsAppPulse.tsx` - `serviceName` prop + contextual pre-fill
- `src/components/services/ServicePageLayout.tsx` - Stats bar + WhatsApp integration
- Service page files (Analysis, Conditioning, Mental, etc.) - Pass service name to WhatsApp

### Dependencies
No new packages needed. Uses existing `framer-motion`, `recharts`, `lucide-react`, `date-fns`.

