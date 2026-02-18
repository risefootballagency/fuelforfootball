

# Full Rise Agency Sync -- Implementation Plan

This plan covers all remaining gaps between this site and the Rise Agency repository, spanning Staff portal restructure, missing components, RLS fixes, and portal data visibility.

---

## Phase 1: Staff.tsx Complete Rewrite (Critical)

Rewrite `src/pages/Staff.tsx` to match Rise's architecture exactly:

### Header Tab System
- Add draggable, reorderable tab pills in the header bar (left side)
- Tabs stored in localStorage (`staff_open_tabs`), max 12 stored, max 3 visible (2 on mobile)
- Each tab is a rounded pill with icon + title, draggable via native HTML5 drag
- Popover on each tab to remove it
- Overflow dialog for tabs beyond visible limit
- "+" button to add current section as a new tab
- Centre-aligned logo (absolutely positioned)
- Right side: notifications + logout (no theme toggle per your instruction)

### Sidebar Categories (exact Rise structure)
- **Overview**: Overview, Schedule group (Schedule, Meetings, Staff Schedules), Tasks group (Focused Tasks, Vision Board)
- **Apps**: Docs, Sheets, Design Studio, Annotations, Video Analysis, Streams
- **Coaching**: Coaching Database, Analysis group (Analysis, Data), Planning group (Athlete Centre, Tactics Board), Programming group (Strength Power & Speed, Nutrition)
- **Management**: Players, Transfers group (Transfer Hub, Player Updates, Requests)
- **Network & Recruitment**: Network group (Club Network, Player List, Case Studies), Scouting group (Recruitment, Player Database, Scouting Centre, Form Submissions)
- **Marketing & Brand**: Content group (Marketing, Content Creator, Public Content), Commercial group (Sales Deck, Site Visitors)
- **Financial**: Billing group (Invoices, Payments), Tracking group (Expenses, Tax Records), Overview group (Budgets, Reports)
- **Legal**: Legal, Partners, Jobs
- **Admin**: Site group (Site Text, Languages), Communications group (Notifications, SMS -- email-gated to jolonlevene98@gmail.com), Access group (Passwords, Staff Accounts -- admin only), Data group (Activity Log, Data Export -- admin only), System group (PWA Install, Offline Content, Push Notifications)

### FFF-Only Extras (kept from current site, placed into the new structure)
These sections exist on FFF but not Rise. They will be added into the most appropriate Rise category:
- **Coaching**: AI Chat, Service Audit (under Planning)
- **Management**: Highlight Maker
- **Marketing & Brand**: Marketing Ideas, Tips & Lessons, News Articles, Daily Fuel, Press Releases (under Publishing sub-group)
- **Sales** (entire category kept as-is): Sales & Pay Links, Service Catalogue, Shop Catalogue, Sales Tracker, Retention, Outreach, Sales Hub
- **Legal**: Contracts
- **Admin**: Goals & Tasks (under Tasks in Overview), Time Management

### Group label styling
Rise uses `text-primary/60` for group labels; this site currently has `text-white/80`. Will match Rise's `text-primary/60`.

### Sections removed from FFF (no longer on Rise)
- Scouts (separate section -- merged into Scouting Centre)
- KlipDraw (replaced by Annotations)
- Site Management (replaced by Site Text)

### Content area section routing
Wire up all new section IDs to their components (stub components for those not yet created).

---

## Phase 2: Create Missing Staff Components (Stubs)

Create stub/placeholder components for sections that don't exist yet on this site. Each will be a simple Card with an icon and description, ready to be fleshed out later:

1. **`src/components/staff/annotations/AnnotationProjects.tsx`** -- Stub for annotation/draw-on-video system
2. **`src/components/staff/coaching/VideoAnalysis.tsx`** -- Stub for video analysis tool
3. **`src/components/staff/coaching/TacticsBoard.tsx`** -- Stub for tactical board
4. **`src/components/staff/coaching/Meetings.tsx`** -- Stub for meetings management
5. **`src/components/staff/CoachingDataSection.tsx`** -- Performance data overview (list of player_analysis records)
6. **`src/components/staff/programming/StrengthPowerSpeedSection.tsx`** -- SPS programming section
7. **`src/components/staff/programming/NutritionSection.tsx`** -- Nutrition programming section
8. **`src/components/staff/ActivityLog.tsx`** -- Activity/audit log
9. **`src/components/staff/DatabaseExport.tsx`** -- Data export tool
10. **`src/components/staff/RequestsManagement.tsx`** -- Player/transfer requests
11. **`src/components/staff/PublicContentManagement.tsx`** -- Public-facing content management
12. **`src/components/staff/MessagingCaseStudies.tsx`** -- Replaces CaseStudyManagement (or alias)
13. **`src/components/staff/SiteTextManagement.tsx`** -- Replaces SiteManagement
14. **`src/components/staff/NotificationSettingsManagement.tsx`** -- Notification settings (admin)
15. **`src/components/staff/StaffSMSNotifications.tsx`** -- SMS notifications (email-gated)
16. **`src/components/staff/KeyboardShortcutsDialog.tsx`** -- Keyboard shortcuts help dialog
17. **`src/components/staff/marketing/SalesDeck.tsx`** -- Sales deck component

Existing components that need renaming/aliasing:
- `KlipDraw` -> keep file but replace sidebar entry with `AnnotationProjects`
- `SiteManagement` -> keep but add `SiteTextManagement` as wrapper/alias
- `CaseStudyManagement` -> keep but add `MessagingCaseStudies` as wrapper/alias
- `StreamsManagement` -> keep (Rise calls it `StreamsSection` but functionality is same)
- `DesignStudio` -> keep (Rise calls it `DesignProjects` but functionality is same)

---

## Phase 3: RLS Policy Fixes (Data Visibility)

Open RLS policies on the shared database tables to match Rise's permissive configuration. Run SQL migrations on the shared database for:
- `player_analysis` -- allow all SELECT, INSERT, UPDATE, DELETE
- `analyses` -- allow all SELECT, INSERT, UPDATE, DELETE
- `fixtures` -- allow all SELECT, INSERT, UPDATE, DELETE
- `player_fixtures` -- allow all SELECT, INSERT, UPDATE, DELETE

This is required for post-match analysis, scouting reports, and video reports to appear on the portal.

---

## Phase 4: Keyboard Shortcuts Dialog

Create `KeyboardShortcutsDialog.tsx` showing:
- `Cmd+K` / `Ctrl+K`: Search
- `?`: Show shortcuts
- `Escape`: Go to Overview
- `1-9`: Jump to category
- `Arrow Up/Down`: Navigate sections

Add `?` keyboard shortcut to Staff.tsx and help button in footer bar.

---

## Technical Notes

- All Rise imports use `supabase` (single client). This site uses `sharedSupabase`. Imports in Staff.tsx already use `sharedSupabase as supabase` so no change needed there.
- No theme toggle will be added (per your instruction). The marble background stays dark-only.
- The header height increases from `h-14` to `h-16` to match Rise, with content offset updated from `top-14`/`pt-16` to `top-16`/`pt-20`.
- The `addSectionAsTab` and `removeTab` functions, plus all drag state variables (`tabOverflowOpen`, `draggingTabId`, `dragOverTabId`, `dragStartXRef`, `isDragConfirmedRef`) will be ported exactly from Rise.
- Stub components will use a consistent pattern: icon, title, and "Coming soon" or descriptive text so the staff portal doesn't crash when navigating to new sections.

---

## Files to Create
- `src/components/staff/annotations/AnnotationProjects.tsx`
- `src/components/staff/coaching/VideoAnalysis.tsx`
- `src/components/staff/coaching/TacticsBoard.tsx`
- `src/components/staff/coaching/Meetings.tsx`
- `src/components/staff/CoachingDataSection.tsx`
- `src/components/staff/programming/StrengthPowerSpeedSection.tsx`
- `src/components/staff/programming/NutritionSection.tsx`
- `src/components/staff/ActivityLog.tsx`
- `src/components/staff/DatabaseExport.tsx`
- `src/components/staff/RequestsManagement.tsx`
- `src/components/staff/PublicContentManagement.tsx`
- `src/components/staff/MessagingCaseStudies.tsx`
- `src/components/staff/SiteTextManagement.tsx`
- `src/components/staff/NotificationSettingsManagement.tsx`
- `src/components/staff/StaffSMSNotifications.tsx`
- `src/components/staff/KeyboardShortcutsDialog.tsx`
- `src/components/staff/marketing/SalesDeck.tsx`

## Files to Edit
- `src/pages/Staff.tsx` (major rewrite)

