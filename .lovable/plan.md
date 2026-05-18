# RISE → FFF: Staff & Portal UI Audit

Deep diff between RISE Football and the current Fuel For Football codebase, focused on UI/UX patterns (not agency-specific logic). Each item lists what RISE does, what FFF does, and the suggested action so you can pick & choose.

## Staff — shared chrome & utilities

### 1. `StaffSearchInput` is not debounced in FFF
- **RISE:** wraps the input in local state, debounces parent `onChange` by 300 ms. List-filter screens stay smooth even at thousands of rows.
- **FFF:** every keystroke fires `onChange` immediately, causing lag on big tables (Players, Outreach, Scouting).
- **Fix:** port the debounced version (drop-in, same API).

### 2. `PlayerCombobox` dropdown can hide behind modals
- **RISE:** `PopoverContent` carries `z-[80]`, so the searchable list always renders above dialogs/sheets.
- **FFF:** no z-index override — dropdown disappears when opened inside a Dialog (e.g. Create Invoice).
- **Fix:** add `z-[80]` (or `z-[100]` to be safe).

### 3. `TableSettingsPopover` panel overflows on small phones
- **RISE:** `w-full max-w-full sm:w-[540px]` with explicit `p-4 sm:p-6`, so the sheet fills the screen on mobile.
- **FFF:** hard-coded `w-[400px] sm:w-[540px]` — clips and horizontal-scrolls on 360 px screens.
- **Fix:** copy the responsive width/padding.

### 4. `StaffCardHeader` look
- **RISE:** uses a smudged-marble overlay (`smudged-marble-overlay.png` / `white-marble-overlay.png`) and theme-aware, giving an editorial / luxurious feel.
- **FFF:** dark forest green + grass texture + 2 px gold top line + gradient depth (the look you just dialed in).
- **Choice:** keep current FFF look, or layer a subtle marble overlay on top of the grass for extra depth. (Just flag if you want to try a hybrid.)

### 5. Force dark mode for the Staff page
- **RISE:** `setTheme('dark')` runs on mount in `Staff.tsx`, so a marketeer who flipped to light on the public site does not bleed into the admin UI.
- **FFF:** uses whatever theme is set globally — staff occasionally loads in light mode and looks washed out.
- **Fix:** add the same `useEffect(() => setTheme('dark'), [])`.

## Staff — Overview / Dashboard

### 6. `StaffOverview` race-conditions on save
- **RISE:** auto-save with a dirty-tracker (`savedLayouts`/`savedVisibleWidgets`), `userId === undefined` hydration guard, marketeer filter that hides the financial widget for non-admins.
- **FFF:** simpler `saveSettings(...)` writes on every state change (causing flicker after reload), no marketeer filter, no Vision Board widget in defaults.
- **Fix:** port the dirty-aware save + marketeer filtering. Add Vision Board as a default-visible widget at row 0.

### 7. `RecentPlayersBar` for the Athlete Centre is missing
- **RISE:** pill-row of the last 5 players you opened, persisted to `localStorage`. One tap to switch player. Drives a huge UX win when reviewing many athletes in a row.
- **FFF:** no equivalent — every switch requires reopening the player combobox.
- **Fix:** copy the file + wire it into `AthleteCentre.tsx`.

### 8. `SessionResumeBanner` (Athlete Centre)
- **RISE:** if you closed mid-edit, a banner offers to restore your last session (player, tab, draft).
- **FFF:** missing — refreshes reset everything.
- **Fix:** port `SessionResumeBanner.tsx` and the `saveSession/clearSession` helpers.

## Staff — Page chrome

### 9. Hide grass texture overlay on text-input focus (minor)
- RISE leaves the header static; FFF's grass header can compete visually with overlaid inputs. Worth tuning opacity on cards that contain forms.

### 10. Sidebar tab pinning has no marketeer-aware default
- Same code shared, but RISE seeds different defaults per role. Not high-priority — flag only if you want it.

## Portal — first impression

### 11. `ParallaxHero` is missing from the Hub
- **RISE:** the portal opens with a full-bleed player photo (focal-point aware), name in Bebas, club & position chips, embedded countdown to next fixture, slow scale + crossfade between multiple images every 6 s.
- **FFF:** Hub goes straight into stats — no cinematic landing moment.
- **Fix:** port `ParallaxHero.tsx` and mount it above `<Hub />` in `Dashboard.tsx`. Already uses `usePortalLanguage` translations and `createAnalysisSlug`.

### 12. `PortalWelcomeModal` is missing
- **RISE:** first-time visitors get a friendly 5-card feature tour (Performance Reports, Analysis, Form & Comparisons, Clips, Programmes) with EN/FR copy and one-click navigation into each.
- **FFF:** no onboarding — players land cold.
- **Fix:** port the component; add a `has_seen_welcome` flag on the player record (or `localStorage` if you want zero-DB). Mount in `Dashboard.tsx` with `onNavigate={setActiveTab}`.

### 13. `NextFixtureCountdown` is off by up to 24h
- **RISE:** stores and reads `match_time`, so the countdown ticks to the exact kickoff and flips to "Match Day!" at the right moment. Also filters out fixtures with `category = 'training'`.
- **FFF:** only uses `match_date` — countdown shows 0 the entire day of the match and never lines up with kickoff.
- **Fix:** add `match_time` to the select, build the target with hours/minutes, drop the training fixtures.

### 14. `SectionDivider` colour
- **RISE:** primary green gradient.
- **FFF:** accent (gold) gradient.
- **Choice:** keep current (gold) or revert to primary for a more subtle break.

### 15. `MobileBottomNav` indicator
- **RISE:** soft gradient indicator (`linear-gradient(90deg, transparent, hsl(43,49%,61%), transparent)`) + radial glow on active tab.
- **FFF:** flat white bar + accent hover.
- **Choice:** the RISE version reads more premium; the FFF version reads more functional. Flag if you want me to swap.

### 16. `PortalEmptyState` polish
- RISE uses `rounded-2xl` icon tile with `bg-primary/10 border-primary/20`, motion fade-in, max-w-sm copy. Confirm FFF version (it's already similar) — no change needed.

## Portal — secondary widgets

### 17. `PortalSkeleton` exports
- Both projects export the same set (Performance, Programming, Video, StatCards, Section). FFF already matches. ✅ No change.

### 18. `InjuryLog`
- Identical between both. ✅ No change.

### 19. RISE-only portal components worth porting
- *None besides the items above are agency-neutral.* The remaining differences are scoped player-management features tied to RISE's specific data model.

## Suggested priority order

Quick wins (no risk, big polish):
1. #2 `PlayerCombobox` z-index — fixes the "dropdown disappears under modal" bug from your earlier complaint.
2. #1 debounce `StaffSearchInput`.
3. #3 responsive `TableSettingsPopover`.
4. #5 force dark mode on Staff.
5. #13 fix `NextFixtureCountdown` to use `match_time`.

Medium effort (visible upgrade):
6. #7 `RecentPlayersBar` in Athlete Centre.
7. #8 `SessionResumeBanner`.
8. #6 `StaffOverview` auto-save + marketeer + Vision Board default.
9. #12 `PortalWelcomeModal`.

Bigger but transformative:
10. #11 `ParallaxHero` in the player portal Hub.

Pure aesthetic choices (need your call):
- #4 marble vs grass header
- #14 gold vs green divider
- #15 mobile nav indicator style

---

Tell me which numbered items to implement (e.g. "do 1, 2, 3, 5, 13" or "do all quick wins"), and I'll execute in one pass.
