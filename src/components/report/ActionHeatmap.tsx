import { useMemo } from "react";

interface PerformanceAction {
  action_number: number;
  minute: number;
  action_score: number;
  action_type: string;
}

interface ActionHeatmapProps {
  actions: PerformanceAction[];
  minutesPlayed: number;
}

// R15 rating colour scale (same thresholds as R90 but applied to per-15-min rate)
const getR15Color = (r15: number) => {
  if (r15 >= 2.5) return "hsl(43, 49%, 61%)";
  if (r15 >= 1.8) return "hsl(142, 72%, 29%)";
  if (r15 >= 1.4) return "hsl(142, 76%, 36%)";
  if (r15 >= 1.0) return "hsl(82, 84%, 67%)";
  if (r15 >= 0.8) return "hsl(48, 96%, 53%)";
  if (r15 >= 0.6) return "hsl(25, 95%, 53%)";
  if (r15 >= 0.4) return "hsl(25, 95%, 37%)";
  if (r15 >= 0.2) return "hsl(0, 91%, 71%)";
  if (r15 >= 0) return "hsl(0, 84%, 60%)";
  return "hsl(0, 93%, 12%)";
};


export const ActionHeatmap = ({ actions, minutesPlayed }: ActionHeatmapProps) => {
  // Group actions into fixed 15-minute periods, only showing periods the player was active in
  const blocks = useMemo(() => {
    const periods = [
      { start: 0, end: 15, label: "0-15'" },
      { start: 15, end: 30, label: "15-30'" },
      { start: 30, end: 45, label: "30-45'" },
      { start: 45, end: 60, label: "45-60'" },
      { start: 60, end: 75, label: "60-75'" },
      { start: 75, end: 90, label: "75-90+'" },
    ];

    // Determine the player's active range using action minutes
    const actionMinutes = actions.map(a => Math.floor(a.minute));
    const firstActionMinute = actionMinutes.length > 0 ? Math.min(...actionMinutes) : 0;
    const lastActionMinute = actionMinutes.length > 0 ? Math.max(...actionMinutes) : 0;

    const endMinute = lastActionMinute > minutesPlayed ? Math.max(lastActionMinute + 1, minutesPlayed) : minutesPlayed;
    const startMinute = endMinute > minutesPlayed ? Math.max(0, endMinute - minutesPlayed) : 0;

    const result: { range: string; actions: PerformanceAction[]; totalScore: number; count: number; r15: number }[] = [];

    for (const period of periods) {
      if (period.end <= startMinute && minutesPlayed > 0) continue;
      if (period.start >= endMinute && minutesPlayed > 0) continue;

      const blockActions = period.start === 75
        ? actions.filter(a => Math.floor(a.minute) >= 75)
        : actions.filter(a => Math.floor(a.minute) >= period.start && Math.floor(a.minute) < period.end);

      const totalScore = blockActions.reduce((sum, a) => sum + a.action_score, 0);

      const effectiveStart = Math.max(period.start, startMinute);
      const effectiveEnd = period.start === 75 ? Math.max(endMinute, 90) : Math.min(period.end, endMinute);
      const periodMinutes = Math.max(effectiveEnd - effectiveStart, 0);

      // R15: divide by period minutes, multiply by 15 (not 90)
      const r15 = periodMinutes > 0 ? (totalScore / periodMinutes) * 15 : 0;

      result.push({
        range: period.label,
        actions: blockActions,
        totalScore,
        count: blockActions.length,
        r15,
      });
    }

    return result;
  }, [actions, minutesPlayed]);

  if (actions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No action data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Period Grade Map</h4>
        <span className="text-xs text-muted-foreground">{actions.length} actions across {minutesPlayed} min</span>
      </div>

      <div className="grid grid-cols-6 gap-1">
        {blocks.map((block, idx) => {
          const color = block.count > 0 ? getR15Color(block.r15) : "hsl(var(--muted))";

          return (
            <div
              key={idx}
              className="relative rounded-md flex flex-col items-center justify-center py-3 px-1 transition-all hover:scale-105"
              style={{
                backgroundColor: color,
                opacity: block.count > 0 ? 0.85 : 0.2,
              }}
              title={`${block.range}: ${block.count} actions, R15 ${block.r15.toFixed(2)}`}
            >
              <span className="text-[10px] font-bold text-black drop-shadow-sm">{block.range}</span>
              <span className="text-[9px] text-black/70">
                {block.count} act{block.count !== 1 ? "s" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
