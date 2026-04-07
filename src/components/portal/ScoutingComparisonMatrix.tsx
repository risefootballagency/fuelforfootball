import { useMemo } from "react";
import { Users } from "lucide-react";
import { t, translateMetricLabel } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";
import { getMetricsForPosition } from "@/components/staff/ComparisonPlayerData";

interface Props {
  playerName: string;
  portalMetrics: Record<string, number | null>;
  hasPortalData: boolean;
  comparisonPlayers: any[];
  selectedPlayerIds: string[];
  formWindow: number;
  position?: string;
}

const getCellColor = (val: number, best: number, worst: number) => {
  if (best === worst) return "hsl(var(--muted))";
  const pct = (val - worst) / (best - worst);
  if (pct >= 0.75) return "hsl(var(--accent) / 0.3)";
  if (pct >= 0.5) return "hsl(120, 50%, 45%, 0.2)";
  if (pct >= 0.25) return "hsl(47, 80%, 50%, 0.15)";
  return "hsl(0, 60%, 50%, 0.15)";
};

export const ScoutingComparisonMatrix = ({ playerName, portalMetrics, hasPortalData, comparisonPlayers, selectedPlayerIds, position }: Props) => {
  const lang = usePortalLanguage();
  const positionMetrics = useMemo(() => getMetricsForPosition(position), [position]);
  const metricLabels = useMemo(
    () => Object.fromEntries(positionMetrics.map(metric => [metric.key, metric.label])) as Record<string, string>,
    [positionMetrics]
  );

  const allPlayers = useMemo(() => {
    const result: { name: string; metrics: Record<string, number> }[] = [];
    const filteredComparisonPlayers = selectedPlayerIds.length > 0
      ? comparisonPlayers.filter(player => selectedPlayerIds.includes(player.id))
      : comparisonPlayers;

    if (hasPortalData && portalMetrics) {
      const cleaned: Record<string, number> = {};
      Object.entries(portalMetrics).forEach(([k, v]) => {
        if (v != null) cleaned[k] = v;
      });
      result.push({ name: playerName, metrics: cleaned });
    }

    filteredComparisonPlayers.forEach(p => {
      result.push({ name: p.name, metrics: p.metrics || {} });
    });

    return result;
  }, [comparisonPlayers, selectedPlayerIds, playerName, portalMetrics, hasPortalData]);

  const metricKeys = useMemo(() => {
    return positionMetrics.map(metric => metric.key).filter(key =>
      allPlayers.some(p => typeof p.metrics[key] === "number")
    );
  }, [allPlayers, positionMetrics]);

  if (allPlayers.length < 2) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
        {t(lang, "not_enough_players")}
      </div>
    );
  }

  const surname = (name: string) => {
    const parts = name.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  };

  return (
    <div className="overflow-x-auto -mx-3">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left p-2 font-medium text-muted-foreground sticky left-0 bg-background z-10">{t(lang, "metric_label")}</th>
            {allPlayers.map((p, i) => (
              <th key={i} className="p-2 text-center font-medium text-foreground min-w-[70px]">
                {surname(p.name)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metricKeys.map(key => {
            const vals = allPlayers.map(p => p.metrics[key]).filter((v): v is number => typeof v === "number");
            const best = Math.max(...vals);
            const worst = Math.min(...vals);
            return (
              <tr key={key} className="border-t border-border/30">
                <td className="p-2 font-medium text-muted-foreground sticky left-0 bg-background z-10 whitespace-nowrap">
                  {translateMetricLabel(lang, key, metricLabels[key] || key)}
                </td>
                {allPlayers.map((p, i) => {
                  const val = p.metrics[key];
                  return (
                    <td
                      key={i}
                      className="p-2 text-center font-medium"
                      style={{
                        backgroundColor: typeof val === "number" ? getCellColor(val, best, worst) : undefined,
                      }}
                    >
                      {typeof val === "number" ? val.toFixed(2) : "—"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
