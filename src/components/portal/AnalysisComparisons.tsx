import { useState, useEffect, useMemo } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList, CartesianGrid, Tooltip } from "recharts";

interface Props {
  analyses: any[];
  playerData: any;
  embedded?: boolean;
}

const getR90Color = (score: number) => {
  if (score >= 8) return "hsl(var(--accent))";
  if (score >= 6) return "hsl(120, 50%, 45%)";
  if (score >= 4) return "hsl(47, 80%, 50%)";
  return "hsl(0, 60%, 50%)";
};

export const AnalysisComparisons = ({ analyses, playerData, embedded }: Props) => {
  const [comparisonPlayers, setComparisonPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState("r90_score");

  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        const { data } = await sharedSupabase
          .from("comparison_players" as any)
          .select("*")
          .eq("position", playerData?.position || "");
        setComparisonPlayers(data || []);
      } catch {
        // Table may not exist
      }
      setLoading(false);
    };
    fetchComparisons();
  }, [playerData?.position]);

  const statOptions = useMemo(() => {
    const opts = [
      { key: "r90_score", label: "R90 Score" },
      { key: "xG_adj_per90", label: "xG /90" },
      { key: "xA_adj_per90", label: "xA /90" },
      { key: "progressive_passes_adj_per90", label: "Prog. Passes /90" },
      { key: "progressive_carries_adj_per90", label: "Prog. Carries /90" },
    ];
    return opts;
  }, []);

  const chartData = useMemo(() => {
    if (!analyses || analyses.length === 0) return [];

    // Player average
    let playerVal: number;
    if (selectedStat === "r90_score") {
      const scores = analyses.map((a: any) => a.r90_score).filter((v: any): v is number => typeof v === "number");
      playerVal = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    } else {
      const vals = analyses
        .map((a: any) => (a.striker_stats as any)?.[selectedStat])
        .filter((v: any): v is number => typeof v === "number");
      playerVal = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    }

    const surname = (name: string) => {
      const parts = name.trim().split(" ");
      return parts.length > 1 ? parts[parts.length - 1] : parts[0];
    };

    const entries = [
      { name: surname(playerData?.name || "You"), value: Math.round(playerVal * 100) / 100, isPlayer: true },
    ];

    comparisonPlayers.forEach((cp: any) => {
      const metrics = cp.metrics || {};
      const statKey = selectedStat === "r90_score" ? "r90_score" : selectedStat;
      const val = metrics[statKey];
      if (typeof val === "number") {
        entries.push({ name: surname(cp.name), value: Math.round(val * 100) / 100, isPlayer: false });
      }
    });

    return entries.sort((a, b) => b.value - a.value);
  }, [analyses, comparisonPlayers, selectedStat, playerData]);

  if (loading) {
    return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  if (comparisonPlayers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No comparison players configured for this position yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Select value={selectedStat} onValueChange={setSelectedStat}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statOptions.map(opt => (
            <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {chartData.length > 0 && (
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 50, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={({ x, y, payload }: any) => {
                  const entry = chartData.find(d => d.name === payload.value);
                  const color = entry?.isPlayer ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))";
                  return (
                    <text x={x} y={y} dy={4} textAnchor="end" fill={color} fontSize={12} fontWeight={entry?.isPlayer ? 700 : 400}>
                      {payload.value}
                    </text>
                  );
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.isPlayer ? "hsl(var(--accent))" : "hsl(var(--muted-foreground) / 0.35)"}
                  />
                ))}
                <LabelList dataKey="value" position="right" style={{ fontSize: 12, fontWeight: 700, fill: "hsl(var(--foreground))" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
