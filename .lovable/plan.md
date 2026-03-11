
What I found

This is not fully synced from RISE yet. I checked the current files against RISE and found the actual breakpoints causing Nicky’s portal/report to stay in English:

1. `src/pages/Dashboard.tsx`
- It does write `portal_language_hint` to localStorage.
- But it does not keep/use the same `portalLanguageHint` state wiring RISE has.
- It also does not pass `portalLanguage={playerData?.portal_language}` into `Hub`, which RISE does.

2. `src/components/dashboard/Hub.tsx`
- This file is still the older non-localized version.
- It does not accept a `portalLanguage` prop.
- It does not import/use `t(...)` from `portalTranslations`.
- Most importantly, it opens the report dialog without portal mode:
  `analysisId={selectedReportId}`
  instead of RISE’s:
  `analysisId={selectedReportId} isPortalView={true}`

That means the report dialog falls back to English by design.

3. `src/components/dashboard/NewsFeed.tsx`
- This is also the older English-only version.
- RISE’s version localizes inbox labels, relative/absolute dates, and uses `translated_content` for report title/overview/opponent.
- Your current version does none of that.

4. `src/components/PerformanceReportDialog.tsx`
- The translation helpers are there.
- But they only fully kick in for the portal flow when `isPortalView={true}` is passed in.
- Right now Hub is not passing that, so the report is opened in English mode.

Plan to fix it properly

1. Port the RISE portal-language wiring exactly
- Bring over the Dashboard changes that maintain `portalLanguageHint` state.
- Pass `portalLanguage={playerData?.portal_language}` into `Hub` exactly like RISE.

2. Replace the current Hub localization flow with the RISE one
- Add `portalLanguage` prop to `Hub`.
- Import/use `t` from `portalTranslations`.
- Pass `isPortalView={true}` into `PerformanceReportDialog`.
- Mirror the RISE localized labels/tooltips/buttons logic instead of patching one-off strings.

3. Replace `NewsFeed.tsx` with the RISE localized implementation
- Localize Inbox UI text.
- Localize timestamps formatting.
- Use translated report content from `translated_content` where available.
- Keep your branding/styling consistent, but keep RISE logic intact.

4. Keep the existing report translation helpers, but wire them correctly
- Leave `reportTranslations.ts` in place.
- Ensure every portal-opened report uses portal mode.
- Ensure French portal language is the fallback when translated report content exists/doesn’t exist.

5. Sanity-check data before/while implementing
- Confirm Nicky’s player record is actually set to French in the backend path the portal uses.
- Confirm his report rows contain `translated_content` in the shared data source used by the portal.
- If some reports still have no translated content stored, the portal chrome can be French while those report bodies remain English; if that happens I’ll identify that specifically rather than guessing.

6. Also remove the stray portal menu
- I already found the obvious unwanted menu implementation in the public portal surface.
- I’ll remove that cleanup as part of the same pass so the portal view stops showing that dropdown/navigation artifact.

Technical details

- Current bug line of thought:
  - `PerformanceReportDialog` computes:
    `const portalLanguage = isPortalView ? localStorage.getItem("portal_language_hint") || "en" : "en";`
  - Since `Hub` currently does not pass `isPortalView={true}`, report language becomes English.

- RISE already fixes this through the combination of:
  - Dashboard passing `portalLanguage`
  - Hub using localized portal strings
  - Hub opening reports with `isPortalView={true}`
  - NewsFeed using localized report/inbox content

- I also checked the exposed local schema here and it does not show `translated_content` on the local `player_analysis` table, so I’ll preserve the existing shared-data fetch path used by the portal/report flow and not accidentally wire this to the wrong database path.

Expected outcome

After this sync:
- Nicky’s portal UI will render in French.
- His portal-opened performance report will open in portal mode and use French translated content where stored.
- The old English-only Hub/Inbox path will be replaced with the actual RISE behavior rather than another partial patch.
