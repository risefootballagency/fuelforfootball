import { useState, useEffect, useMemo } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import { t, translateMetricLabel } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";

interface Props {
  playerName: string;
  portalMetrics: Record<string, number | null>;
  hasPortalData: boolean;
  comparisonPlayers: any[];
  selectedPlayerIds: string[];
  formWindow: number;
}

const METRIC_LABELS: Record<string, string> = {
  r90_score: "R90",
  xG_adj_per90: "xG /90",
  xA_adj_per90: "xA /90",
  progressive_passes_adj_per90: "Prog. Passes",
  progressive_carries_adj_per90: "Prog. Carries",
  duels_won_pct: "Duels Won %",
  pass_accuracy_pct: "Pass Acc %",
  tackles_won_per90: "Tackles /90",
  interceptions_per90: "Int /90",
};

const getCellColor = (val: number, best: number, worst: number) => {
  if (best === worst) return "hsl(var(--muted))";
  const pct = (val - worst) / (best - worst);
  if (pct >= 0.75) return "hsl(var(--accent) / 0.3)";
  if (pct >= 0.5) return "hsl(120, 50%, 45%, 0.2)";
  if (pct >= 0.25) return "hsl(47, 80%, 50%, 0.15)";
  return "hsl(0, 60%, 50%, 0.15)";
};

export const ScoutingComparisonMatrix = ({ playerName, portalMetrics, hasPortalData, comparisonPlayers }: Props) => {
  const lang = usePortalLanguage();
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await sharedSupabase
          .from("comparison_players" as any)
          .select("*");
        setPlayers(data || []);
      } catch {
        // Table may not exist
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const allPlayers = useMemo(() => {
    const result: { name: string; metrics: Record<string, number> }[] = [];

    if (hasPortalData && portalMetrics) {
      const cleaned: Record<string, number> = {};
      Object.entries(portalMetrics).forEach(([k, v]) => {
        if (v != null) cleaned[k] = v;
      });
      result.push({ name: playerName, metrics: cleaned });
    }

    players.forEach(p => {
      result.push({ name: p.name, metrics: p.metrics || {} });
    });

    return result;
  }, [players, playerName, portalMetrics, hasPortalData]);

  const metricKeys = useMemo(() => {
    return Object.keys(METRIC_LABELS).filter(key =>
      allPlayers.some(p => typeof p.metrics[key] === "number")
    );
  }, [allPlayers]);

  if (loading) {
    return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

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
            <th className="text-left p-2 font-medium text-muted-foreground sticky left-0 bg-background z-10">Metric</th>
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
                  {METRIC_LABELS[key] || key}
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
