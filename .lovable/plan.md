# RISE → FFF: last 7 days of RISE additions worth porting

Pulled from RISE's chat history (15–18 May 2026). Filtered to agency-neutral items that would benefit FFF. Pick whichever you want and I'll execute.

## A. Highlights Maker Portal (big feature, fully built on RISE)

A separate, low-security portal for external highlight editors. Login is just a username (no email, no password required), staff assigns specific players to each maker, and the maker logs in to a stripped-down portal that shows only those players.

What they get in the portal:
- Player picker with club logo, name, date pulled from performance reports.
- The exact staff `ClippedActionsPlayer` (same controls, autoplay-next, R90 / Action Score) — not a custom mini player.
- Per-player playlists in the saved order, with individual clip download + full-playlist ZIP download (JSZip).
- Wyscout-style Video Reports tab: positive-only clips grouped by action category, colour-coded action-score tiles, click a tile to play.
- "My Playlists" tab where the maker can create/upload their own playlists, shared with staff (so they feed into the same tables you already use).

Supporting plumbing:
- `highlight_makers` and `highlight_maker_players` tables, RLS denies direct access, all reads via edge functions with service role.
- `highlight-maker-login-check` + `highlight-maker-data` edge functions (`verify_jwt = false`).
- Staff UI: "Highlights Makers" management embedded directly inside Staff Accounts, with Add maker + Manage Players dialogs.
- `is_favourite` boolean on `playlists` — only starred playlists appear in the highlights portal. Star toggle added to `PlaylistContent` and `PlaylistManager`.

## B. Investor Portal (also big, fully built on RISE)

Private dashboard at `/investors-portal` (added to `robots.txt` disallow). Single hardcoded login (`levene` / `England4`) via bcrypt-checked edge function, structured so multi-user invite can be added later.

Sections:
1. **Overview** — monthly spend, remaining budget, active players, active mandates, key activity summary.
2. **Activity Log** — auto-ingestible feed (date, person, category, description). Categories: outreach / analysis / admin / travel / deal / communication.
3. **Spending Tracker** — categorised (tools, travel, staff, misc), monthly + running totals, Recharts bar/line.
4. **Player Pipeline** — table of players: name, age group, region, status (lead/contact/mandate/active/deal in progress), notes, expected value.
5. **Deals & Opportunities** — stage-based negotiation tracker with timeline notes.
6. **System Notes / Strategy Log** — founder reflections.

Tables: `investor_users`, `investor_sessions`, `investor_activity_log`, `investor_spending`, `investor_pipeline`, `investor_deals`, `investor_notes` — all RLS-denied, all access via `investor-login` / `investor-data` / `investor-write` edge functions.

Visual: dark premium, shader intro before login, second shader transition after login, success chime with mute toggle.

(Would need an FFF-specific login + branding. If you don't want investors as a use case, this could also be repurposed as an internal "ops dashboard" for you.)

## C. Quick UX wins (small, high value)

1. **Stats Updater sidebar — flat when ≤7 sections.** In `Staff.tsx` `applyRoleVisibility`, if a role has 7 or fewer visible sections, drop category wrappers and just render the section buttons in order. Cleaner sidebar for scoped roles.

2. **Username-or-email login everywhere.** Staff login + create-account flow accept either. If no `@` is present, append a synthetic domain (e.g. `@fff.local`) before calling Supabase auth. Email field switches to `type="text"`, label becomes "Email or username".

3. **Password optional for limited roles.** When creating a stats-updater (or similar low-trust role), password is optional — if blank, auto-generate and show in the post-create credentials panel. Other roles keep `minLength=8` required.

4. **Playlist `is_favourite` star.** Even without the highlights portal, this is useful: stops half-finished/internal playlists cluttering the player Hub. Add a star toggle to `PlaylistContent`/`PlaylistManager`, and filter the portal feed to favourites only.

## D. Performance Report polish (matches issues you've hit before)

5. **H1 toggle in the 45–51 minute overlap window.** Add `is_first_half?: boolean` to `PerformanceAction`. In `ActionTypeEditor`, show an inline `H1` toggle next to the minute input only for actions in 45–51. Sorting bucket: 0–45 = H1, ≥51 = H2, 45–51 = H1 toggle wins. This is the only way to keep a 47.00 H1 action above a 46.30 H2 action consistently across edit view, shared report, flow chart and clip players.

6. **Blank stats handling.** Raw/count stats: treat blank as 0 across the full window (divide by `analyses.length`). Percentage stats: still exclude blanks (divide by `present.length`). Apply centrally in `statAggregation.ts` so portal averages, transfer comparisons, data tab, radar/percentile and `QuickStatsComparison` all match.

7. **Action type normaliser for Video Reports.** New `src/lib/actionTypeNormaliser.ts` with `normaliseActionType()` — strips punctuation, lowercases, collapses variants and misspellings ("Not Held" → "Tackle - Not Held", typos merged into canonical form). Stops the giant lists of near-duplicate action types.

## E. PDF Signing improvements (only relevant if you use SignContract)

8. **Audit log appended to signed PDFs.** `pdfExport.ts` gains `appendAuditPage()` — extra page with title, doc ID, SHA-256 hash, signer name/email, signed-at, intent-consent-at, IP, user agent. Wired into `exportSignedContractPDF`.
9. **"Download PDF" button under Submit Signature** so signers can save outside the browser.
10. **"Signing Electronically" pre-ticked + "More Options" collapsible** with print-to-sign fallback inside. Less friction.
11. **Date field centering + dynamic font sizing** so dates fill their box instead of wrapping.
12. **Signed URL resolution for private `signature-contracts` bucket** — fixes the "Unable to display PDF" error on shared signing links after the bucket was made private.

---

## Suggested priority order

Pure quick wins (do anytime): C1, C2, C3, D5, D6, D7.
Medium upgrade: C4 (playlist star), E8–E12 (if SignContract is in use).
Big features: A (Highlights Maker Portal), B (Investor / Ops Portal).

Tell me which items (e.g. "C1, C2, C3, D5, D6, D7" or "all of C and D, plus A") and I'll execute in one pass.
