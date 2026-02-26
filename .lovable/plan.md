

# Portal Audit: Missing RISE Features in FFF

## Differences Found

### 1. Missing: MobileBottomNav Integration in Dashboard.tsx
**Status**: Component exists at `src/components/portal/MobileBottomNav.tsx` but is NOT rendered in `src/pages/Dashboard.tsx`.

RISE Dashboard.tsx (line 4847-4854) renders `<MobileBottomNav>` at the bottom of the page with `activeTab`, `onTabChange`, and `onMoreClick` (scrolls to top and opens the nav dropdown). FFF's Dashboard.tsx does not render it at all.

Also requires: `navDropdownOpen` state + controlled `DropdownMenu` with `open={navDropdownOpen} onOpenChange={setNavDropdownOpen}`. FFF's DropdownMenu is currently uncontrolled.

### 2. Missing: Footer Buttons (Logout + Refresh + Notifications)
**Status**: FFF has the basic logout section but is missing the **improved refresh button** from RISE.

RISE Dashboard.tsx (lines 4796-4836) has:
- `NotificationSettings` button
- Log Out button
- Refresh button that clears ALL offline caches via `CacheManager.clearAllCaches()`, busts browser cache with timestamp URL param, and forces a hard reload

FFF Dashboard.tsx (lines 4788-4811) has a simpler version: the refresh button only calls `window.location.reload()`. It should match RISE's cache-busting behaviour.

### 3. Missing: `VersionManager.initialize()` Call in Dashboard
**Status**: FFF has the `VersionManager` class and calls it from `Staff.tsx` and `main.tsx`, but NOT from `Dashboard.tsx`.

RISE Dashboard.tsx (lines 738-743) calls `VersionManager.initialize()` on mount. FFF Dashboard.tsx does not.

### 4. Missing: Staff Notification Tracking (`insertStaffNotification`)
**Status**: FFF has `src/lib/staffNotifications.ts` but it is NOT imported or used in Dashboard.tsx.

RISE Dashboard.tsx (lines 172-189) tracks portal tab views by calling `insertStaffNotification` when a player views the Analysis or Performance tabs. This creates events in `staff_notification_events` so staff can see which players are engaging.

FFF Dashboard.tsx has no equivalent tracking.

### 5. Missing: `AnimatePresence` Tab Transitions
**Status**: RISE wraps tab content in `<AnimatePresence mode="wait">` with `<motion.div>` for smooth tab transitions (lines 1796-1853). FFF renders tabs without any animation.

### 6. Missing: Hub Fixture Fetch Enhancement
**Status**: RISE Hub.tsx `ParallaxHeroWithFixture` (lines 23-102) fetches fixtures via two methods: first from `player_fixtures` table (most reliable), then falls back to club name matching. It also fetches linked pre-match analyses.

FFF Hub.tsx `ParallaxHeroWithFixture` (lines 21-58) only does club name matching, misses the `player_fixtures` join and the pre-match analysis lookup. It also doesn't pass `preMatchAnalysis` to `ParallaxHero`.

### 7. Missing: `PortalEmptyState` Usage in Dashboard
**Status**: Component exists but is NOT imported or used in FFF's Dashboard.tsx. RISE uses it for empty highlights, empty updates, etc. (e.g., line 4217, 4448).

### 8. Missing: `PortalSettings` fetch on Dashboard.tsx
**Status**: RISE Dashboard has `fetchPortalSettings` called during auth flow (line 873) and stores it in state. FFF Dashboard.tsx has `portalSettings` state but the fetch path differs — FFF does a dual-fetch (shared + local) which was added recently but the RISE version also uses a simpler direct call to `fetchPortalSettings(player.id)`.

### 9. Missing: Nutrition Programs fetch on Dashboard
**Status**: RISE has `nutritionPrograms` state and `fetchNutritionPrograms` (line 872, 1388-1407). FFF has `hasNutritionPrograms` boolean + `checkNutritionPrograms` which is a different, simpler check. The RISE version uses a `coaching_programmes` query matching nutrition category and stores the full data.

### 10. Missing: `navDropdownOpen` Controlled State for Nav Dropdown
**Status**: RISE uses `navDropdownOpen` state (line 164) to programmatically open/close the nav dropdown, especially from the MobileBottomNav "More" button. FFF's dropdown is uncontrolled.

### 11. Missing: `main.pb-16 md:pb-0` for MobileBottomNav Clearance
**Status**: RISE main content area has `pb-16 md:pb-0` (line 1684) to prevent the bottom nav from covering content. FFF has `pb-0`.

---

## Implementation Plan

### Batch 1 — MobileBottomNav + Controlled Dropdown
1. Add `navDropdownOpen` state to Dashboard.tsx
2. Make the nav `DropdownMenu` controlled with `open={navDropdownOpen} onOpenChange={setNavDropdownOpen}`
3. Render `<MobileBottomNav>` at the bottom of the Dashboard return, wired to `activeTab`, `onTabChange`, and `onMoreClick`
4. Add `pb-16 md:pb-0` to `<main>` for clearance
5. Update the nav tab change handlers to close the dropdown: `setNavDropdownOpen(false)`

### Batch 2 — Footer Improvements + VersionManager
1. Update the refresh button to match RISE: clear `CacheManager.clearAllCaches()`, bust cache with timestamp URL, and force hard reload
2. Add `VersionManager.initialize()` call in Dashboard's initial `useEffect`
3. Import `VersionManager` from `@/lib/versionManager`

### Batch 3 — Staff Notification Tracking
1. Import `insertStaffNotification` from `@/lib/staffNotifications`
2. Add portal tab view tracking `useEffect` that fires when `activeTab` or `activeAnalysisTab` changes

### Batch 4 — AnimatePresence Tab Transitions
1. Import `AnimatePresence` from `framer-motion` (already imported in RISE)
2. Wrap Hub content in `<motion.div>` with fade/slide transitions
3. Wrap non-Hub content similarly

### Batch 5 — Hub Fixture Fetch Enhancement
1. Update `ParallaxHeroWithFixture` to first check `player_fixtures` table (join on `fixtures`), fallback to club name match
2. Add pre-match analysis lookup from `analyses` table using `fixture_id`
3. Pass `preMatchAnalysis` prop to `ParallaxHero`

### Batch 6 — PortalEmptyState Integration
1. Import `PortalEmptyState` in Dashboard.tsx
2. Replace bare "No X yet" text in highlights and updates sections with `<PortalEmptyState>` component

---

## Summary

```text
Item                                Status       Priority
────────────────────────────────────────────────────────
MobileBottomNav rendering          NOT WIRED     HIGH
Controlled nav dropdown            MISSING       HIGH  
Footer cache-bust refresh          PARTIAL       MEDIUM
VersionManager in Dashboard        MISSING       MEDIUM
Staff notification tracking        MISSING       MEDIUM
AnimatePresence transitions        MISSING       LOW
Hub fixture fetch (player_fixtures) PARTIAL      MEDIUM
PortalEmptyState usage             NOT IMPORTED  LOW
Nutrition programs fetch           DIFFERENT     LOW
────────────────────────────────────────────────────────
```

All changes are in 2 files: `src/pages/Dashboard.tsx` and `src/components/dashboard/Hub.tsx`. The components themselves (MobileBottomNav, PortalEmptyState, SectionDivider) already exist in FFF.
