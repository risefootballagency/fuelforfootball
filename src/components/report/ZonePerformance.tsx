import { useMemo, useState } from "react";
import { Grid3X3, LayoutGrid } from "lucide-react";
import { RankedActionsPlayer } from "@/components/report/RankedActionsPlayer";

interface ZoneAction {
  action_score: number;
  zone?: number | null;
  zone_details?: { zone: number; sub?: number }[] | null;
  // Extended fields for video playback (optional)
  id?: string;
  action_number?: number;
  action_type?: string;
  action_description?: string;
  video_url?: string | null;
  minute?: number;
  notes?: string | null;
}

interface ZonePerformanceProps {
  actions: ZoneAction[];
}

const ZONE_GRID = [
  [16, 17, 18],
  [13, 14, 15],
  [10, 11, 12],
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
];

const SUB_GRID = [
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
];

// Same colour scale used on performance report action rows
const getScoreBgColor = (avg: number): string => {
  if (avg >= 0.15) return "bg-green-800 text-white";
  if (avg >= 0.1) return "bg-green-700 text-white";
  if (avg >= 0.05) return "bg-green-600 text-white";
  if (avg >= 0.02) return "bg-green-500 text-white";
  if (avg > 0.005) return "bg-lime-500 text-black";
  if (avg > 0) return "bg-lime-400 text-black";
  if (avg === 0) return "bg-muted text-muted-foreground";
  if (avg > -0.005) return "bg-orange-400 text-black";
  if (avg > -0.02) return "bg-orange-500 text-white";
  if (avg > -0.04) return "bg-red-400 text-white";
  if (avg > -0.06) return "bg-red-500 text-white";
  return "bg-red-700 text-white";
};

// Penalty box border segments
type BorderSide = 'top' | 'right' | 'bottom' | 'left';
interface BoxLine { zone: number; sub: number; side: BorderSide }

const PENALTY_BOX_LINES: BoxLine[] = [
  { zone: 16, sub: 8, side: 'right' },
  { zone: 16, sub: 5, side: 'right' },
  { zone: 16, sub: 6, side: 'bottom' },
  { zone: 17, sub: 4, side: 'bottom' },
  { zone: 17, sub: 5, side: 'bottom' },
  { zone: 17, sub: 6, side: 'bottom' },
  { zone: 18, sub: 4, side: 'bottom' },
  { zone: 18, sub: 7, side: 'right' },
  { zone: 18, sub: 4, side: 'right' },
  { zone: 1, sub: 2, side: 'right' },
  { zone: 1, sub: 5, side: 'right' },
  { zone: 1, sub: 6, side: 'top' },
  { zone: 2, sub: 4, side: 'top' },
  { zone: 2, sub: 5, side: 'top' },
  { zone: 2, sub: 6, side: 'top' },
  { zone: 3, sub: 4, side: 'top' },
  { zone: 3, sub: 1, side: 'right' },
  { zone: 3, sub: 4, side: 'right' },
];

const BOX_LINE_SET = new Set(
  PENALTY_BOX_LINES.map(l => `${l.zone}.${l.sub}.${l.side}`)
);

const hasBoxLine = (zone: number, sub: number, side: BorderSide): boolean => {
  return BOX_LINE_SET.has(`${zone}.${sub}.${side}`);
};

const getBoxBorderStyle = (zone: number, sub: number): string => {
  const borders: string[] = [];
  if (hasBoxLine(zone, sub, 'top')) borders.push('border-t-[2px] border-t-white/40');
  if (hasBoxLine(zone, sub, 'right')) borders.push('border-r-[2px] border-r-white/40');
  if (hasBoxLine(zone, sub, 'bottom')) borders.push('border-b-[2px] border-b-white/40');
  if (hasBoxLine(zone, sub, 'left')) borders.push('border-l-[2px] border-l-white/40');
  return borders.join(' ');
};

export const ZonePerformance = ({ actions }: ZonePerformanceProps) => {
  const [showSubZones, setShowSubZones] = useState(false);
  const [zoneVideoOpen, setZoneVideoOpen] = useState(false);
  const [zoneVideoClips, setZoneVideoClips] = useState<any[]>([]);

  const { zoneAvg, subZoneAvg, zoneCount } = useMemo(() => {
    const zoneTotals: Record<number, { sum: number; count: number }> = {};
    const subTotals: Record<string, { sum: number; count: number }> = {};

    for (const a of actions) {
      if (a.zone_details && Array.isArray(a.zone_details) && a.zone_details.length > 0) {
        for (const zp of a.zone_details) {
          if (zp.zone < 1 || zp.zone > 18) continue;
          if (!zoneTotals[zp.zone]) zoneTotals[zp.zone] = { sum: 0, count: 0 };
          zoneTotals[zp.zone].sum += a.action_score;
          zoneTotals[zp.zone].count++;
          if (zp.sub && zp.sub >= 1 && zp.sub <= 9) {
            const key = `${zp.zone}.${zp.sub}`;
            if (!subTotals[key]) subTotals[key] = { sum: 0, count: 0 };
            subTotals[key].sum += a.action_score;
            subTotals[key].count++;
          }
        }
      } else if (a.zone != null && a.zone >= 1 && a.zone <= 18) {
        if (!zoneTotals[a.zone]) zoneTotals[a.zone] = { sum: 0, count: 0 };
        zoneTotals[a.zone].sum += a.action_score;
        zoneTotals[a.zone].count++;
      }
    }

    const zoneAvg: Record<number, number> = {};
    const zoneCount: Record<number, number> = {};
    for (const [z, d] of Object.entries(zoneTotals)) {
      zoneAvg[Number(z)] = d.sum / d.count;
      zoneCount[Number(z)] = d.count;
    }

    const subZoneAvg: Record<string, number> = {};
    for (const [k, d] of Object.entries(subTotals)) {
      subZoneAvg[k] = d.sum / d.count;
    }

    return { zoneAvg, subZoneAvg, zoneCount };
  }, [actions]);

  const hasData = Object.keys(zoneAvg).length > 0;

  // Get actions for a specific zone (major zone number)
  const getActionsForZone = (zone: number) => {
    return actions.filter(a => {
      if (a.zone_details && Array.isArray(a.zone_details) && a.zone_details.length > 0) {
        return a.zone_details.some(zp => zp.zone === zone);
      }
      return a.zone === zone;
    });
  };

  // Get actions for a specific sub-zone
  const getActionsForSubZone = (zone: number, sub: number) => {
    return actions.filter(a => {
      if (a.zone_details && Array.isArray(a.zone_details) && a.zone_details.length > 0) {
        return a.zone_details.some(zp => zp.zone === zone && zp.sub === sub);
      }
      return false;
    });
  };

  const handleZoneClick = (zone: number) => {
    const zoneActions = getActionsForZone(zone);
    const videoClips = zoneActions
      .filter(a => a.video_url && a.id)
      .map(a => ({
        id: a.id!,
        action_number: a.action_number || 0,
        action_type: a.action_type || '',
        action_description: a.action_description || '',
        action_score: a.action_score,
        video_url: a.video_url!,
        minute: a.minute || 0,
        notes: a.notes,
      }));
    if (videoClips.length > 0) {
      setZoneVideoClips(videoClips);
      setZoneVideoOpen(true);
    }
  };

  const handleSubZoneClick = (zone: number, sub: number) => {
    const subActions = getActionsForSubZone(zone, sub);
    const videoClips = subActions
      .filter(a => a.video_url && a.id)
      .map(a => ({
        id: a.id!,
        action_number: a.action_number || 0,
        action_type: a.action_type || '',
        action_description: a.action_description || '',
        action_score: a.action_score,
        video_url: a.video_url!,
        minute: a.minute || 0,
        notes: a.notes,
      }));
    if (videoClips.length > 0) {
      setZoneVideoClips(videoClips);
      setZoneVideoOpen(true);
    }
  };

  // Check if any actions have video URLs (to show clickable zones)
  const hasVideoActions = actions.some(a => a.video_url && a.id);

  if (!hasData) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No zone data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Zone Performance</h4>
        {/* Slider toggle between 18 and 162 */}
        <div
          className="relative flex items-center bg-muted rounded-full p-0.5 cursor-pointer w-[72px] h-7"
          onClick={() => setShowSubZones(!showSubZones)}
          title={showSubZones ? "Switch to at-a-glance (18 zones)" : "Switch to in-depth (162 zones)"}
        >
          <div
            className={`absolute top-0.5 h-6 w-[34px] rounded-full bg-primary transition-all duration-200 ${
              showSubZones ? "left-[36px]" : "left-0.5"
            }`}
          />
          <div className="relative z-10 flex w-full">
            <div className={`flex-1 flex items-center justify-center ${!showSubZones ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </div>
            <div className={`flex-1 flex items-center justify-center ${showSubZones ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
              <Grid3X3 className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative border border-border/50 rounded-md overflow-hidden bg-green-900/20">
        <div className="text-center text-[8px] text-muted-foreground py-0.5 bg-muted/30">
          ↑ Attacking Direction ↑
        </div>

        {showSubZones ? (
          /* 162-zone view with pitch markings and penalty boxes */
          <div className="relative">
            <div className="grid grid-rows-6 gap-px p-1 relative">
              {ZONE_GRID.map((row, ri) => (
                <div key={ri} className="relative">
                  {ri === 3 && (
                    <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-white/30 z-10" />
                  )}
                  <div className="grid grid-cols-3 gap-px">
                    {row.map(zone => (
                      <div key={zone} className="border border-white/10 rounded-sm overflow-hidden">
                        <div className="grid grid-rows-3 gap-0">
                          {SUB_GRID.map((subRow, sri) => (
                            <div key={sri} className="grid grid-cols-3 gap-0">
                              {subRow.map(sub => {
                                const key = `${zone}.${sub}`;
                                const avg = subZoneAvg[key];
                                const hasValue = avg !== undefined;
                                const boxBorders = getBoxBorderStyle(zone, sub);
                                const clickable = hasVideoActions && hasValue;
                                return (
                                  <div
                                    key={sub}
                                    className={`aspect-square flex items-center justify-center ${
                                      hasValue ? getScoreBgColor(avg) : 'bg-green-900/30'
                                    } ${boxBorders} ${clickable ? 'cursor-pointer hover:ring-1 hover:ring-accent' : ''}`}
                                    title={hasValue ? `Zone ${zone}.${sub}: avg ${avg.toFixed(3)}` : `Zone ${zone}.${sub}`}
                                    onClick={clickable ? () => handleSubZoneClick(zone, sub) : undefined}
                                  />
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 18-zone view with R90 scores */
          <div className="relative">
            <div className="grid grid-rows-6 gap-1 p-1.5">
              {ZONE_GRID.map((row, ri) => (
                <div key={ri} className="relative">
                  {ri === 3 && (
                    <div className="absolute -top-[3px] left-0 right-0 h-[2px] bg-white/30 z-10" />
                  )}
                  <div className="grid grid-cols-3 gap-1">
                    {row.map(zone => {
                      const avg = zoneAvg[zone];
                      const count = zoneCount[zone] || 0;
                      const hasValue = avg !== undefined;
                      const clickable = hasVideoActions && hasValue;
                      return (
                        <div
                          key={zone}
                          className={`flex flex-col items-center justify-center py-3 rounded-sm transition-all ${
                            hasValue ? getScoreBgColor(avg) : 'bg-green-900/30 text-muted-foreground'
                          } ${clickable ? 'cursor-pointer hover:ring-2 hover:ring-accent' : ''}`}
                          title={hasValue ? `Zone ${zone}: avg ${avg.toFixed(3)} (${count} actions)${clickable ? ' — click to watch' : ''}` : `Zone ${zone}`}
                          onClick={clickable ? () => handleZoneClick(zone) : undefined}
                        >
                          {hasValue ? (
                            <>
                              <span className="text-sm font-bold">{avg.toFixed(3)}</span>
                              <span className="text-[8px] opacity-70">{count} action{count !== 1 ? 's' : ''}</span>
                            </>
                          ) : (
                            <span className="text-[9px]">-</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-[8px] text-muted-foreground py-0.5 bg-muted/30">
          Own Goal
        </div>
      </div>

      {/* Zone Video Player */}
      <RankedActionsPlayer
        open={zoneVideoOpen}
        onOpenChange={setZoneVideoOpen}
        clips={zoneVideoClips}
        mode="chronological"
      />
    </div>
  );
};
