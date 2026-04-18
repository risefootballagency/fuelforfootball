
Diagnosis

The regression is now clear: the recent shared hidden-R90 logic is wrong.

What happened:
- `src/lib/r90Resolver.ts` now treats `placeholder_per` as the hidden R90 override.
- But in this project, `placeholder_per` is the PER metric, not R90.
- The editor and viewer still prove that:
  - `CreatePerformanceReportDialog.tsx` saves `placeholder_per` as PER and `placeholder_sr` as SR.
  - `HiddenScoresGrid.tsx` renders `placeholderPer` under a "PER" label, while hidden R90 is still calculated from `placeholder_raw_score / placeholder_minutes * 90`.

So the app currently has two conflicting meanings for the same field:
- some places use `placeholder_per` as PER
- newer resolver-based places use `placeholder_per` as hidden R90

That is why hidden reports now show seemingly random R90 values and why different screens disagree.

Implementation plan

1. Fix the shared source of truth
- Rewrite `src/lib/r90Resolver.ts` so hidden R90 is resolved only from:
  - `placeholder_raw_score`
  - `placeholder_minutes`
- Do not use `placeholder_per` for R90 anywhere.
- Keep draft/clipped as `null`, live as `r90_score`.

2. Replace the broken mixed logic everywhere hidden R90 appears
Update all report-score surfaces to use the corrected resolver consistently:
- `src/pages/Dashboard.tsx`
- `src/components/dashboard/Hub.tsx`
- `src/components/portal/AnalysisDataTab.tsx`
- `src/components/portal/ProgressSummary.tsx`
- `src/components/staff/analysis/ActionReportsList.tsx`
- `src/pages/AnalysisViewer.tsx`

3. Audit remaining direct `r90_score` renderers
Any place still reading raw `r90_score` for report display/listing/charting will be corrected if hidden reports can appear there. The main ones I identified:
- `src/components/portal/AllReportsSection.tsx`
- `src/components/dashboard/QuickStatsComparison.tsx`
- `src/components/PlayerDataOverlay.tsx`
- `src/components/staff/ScoutedPlayersSection.tsx`
- any remaining Hub/Dashboard confetti/comparison logic still using raw `r90_score`

4. Keep PER/SR separate and correct
- `HiddenScoresGrid.tsx` should remain:
  - R90 from raw/minutes
  - PER from `placeholder_per`
  - SR from `placeholder_sr`
- Any live/hidden match-stat areas using PER/SR will keep those fields as PER/SR only.

5. Align with RISE where appropriate
- RISE uses raw/minutes for hidden R90 in the viewer and hub flows.
- I will mirror that structure here, but also keep the newer shared resolver so this project has one correct hidden-R90 path instead of scattered copies.

Technical notes

Current broken conflict:
```text
placeholder_raw_score + placeholder_minutes -> hidden R90
placeholder_per -> PER
placeholder_sr -> SR

But current resolver incorrectly does:
hidden R90 = placeholder_per first
```

This explains the exact symptom:
```text
PER values are leaking into R90 displays
while other screens still compute hidden R90 from raw/minutes
```

Verification after implementation

I will verify one hidden report end-to-end across:
- portal Hub form bars
- Dashboard form chart
- Analysis data tables/charts
- report cards/lists
- analysis viewer linked R90 badge
- hidden report viewer cards

Success condition:
- every hidden report shows the same R90 everywhere
- that R90 matches `placeholder_raw_score / placeholder_minutes * 90`
- PER and SR remain separate and unchanged
- no hidden report falls back to raw auto `r90_score` unless it is actually live
