import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import { ALL_METRICS } from "@/components/staff/ComparisonPlayerData";

interface QuickStatsComparisonProps {
  playerId: string;
  playerName: string;
  playerPosition: string;
  analyses: { striker_stats?: any; fixture_stats?: any; r90_score?: number | null }[];
  onSeeAll?: () => void;
}

// Use ALL_METRICS as the single source of truth for comparable stats
const COMPARABLE_STATS = ALL_METRICS.map(m => ({
  label: m.label,
  key: m.key,
}));

const surname = (name: string) => {
  const parts = name.trim().split(" ");
  return parts.length > 1 ? parts[parts.length - 1] : parts[0];
};

// Unified stat lookup matching AnalysisDataTab pattern
const getStatValue = (analysis: any, key: string): number | null => {
  if (analysis.fixture_stats?.[key] != null) return Number(analysis.fixture_stats[key]);
  if (analysis.striker_stats?.[key] != null) return Number(analysis.striker_stats[key]);
  return null;
};

export const QuickStatsComparison = ({ playerId, playerName, playerPosition, analyses, onSeeAll }: QuickStatsComparisonProps) => {
  const [loading, setLoading] = React.useState(true);
  const [chartData, setChartData] = React.useState<{ name: string; value: number }[] | null>(null);
  const [statLabel, setStatLabel] = React.useState("");
  const [benchmarkName, setBenchmarkName] = React.useState("");
  const [visible, setVisible] = React.useState(true);

  const benchmarksRef = React.useRef<any[] | null>(null);
  const usedStatsRef = React.useRef<Set<string>>(new Set());
  const statLabelRef = React.useRef("");
  const benchmarkNameRef = React.useRef("");

  // Filter to analyses with r90_score, take last 5
  const recentAnalyses = React.useMemo(() => {
    return analyses
      .filter(a => a.r90_score != null)
      .slice(0, 5);
  }, [analyses]);

  const pickComparison = React.useCallback(() => {
    const benchmarks = benchmarksRef.current;
    if (recentAnalyses.length === 0 || !benchmarks || benchmarks.length === 0) return false;

    if (usedStatsRef.current.size >= COMPARABLE_STATS.length) {
      usedStatsRef.current.clear();
    }

    const available = COMPARABLE_STATS.filter(s => !usedStatsRef.current.has(s.label));
    const shuffledStats = [...available].sort(() => Math.random() - 0.5);
    const shuffledBenchmarks = [...benchmarks].sort(() => Math.random() - 0.5);

    for (const stat of shuffledStats) {
      for (const benchmark of shuffledBenchmarks) {
        const metrics = (benchmark.metrics || {}) as Record<string, number>;
        const benchmarkVal = metrics[stat.key];
        if (stat.label === statLabelRef.current && benchmark.name === benchmarkNameRef.current) continue;

        const playerVals = recentAnalyses
          .map(a => getStatValue(a, stat.key))
          .filter((v): v is number => v !== null);

        if (playerVals.length > 0 && typeof benchmarkVal === "number") {
          const playerAvg = playerVals.reduce((a, b) => a + b, 0) / playerVals.length;

          usedStatsRef.current.add(stat.label);
          statLabelRef.current = stat.label;
          benchmarkNameRef.current = benchmark.name;
          setStatLabel(stat.label);
          setBenchmarkName(benchmark.name);
          setChartData([
            { name: surname(playerName), value: Math.round(playerAvg * 100) / 100 },
            { name: surname(benchmark.name), value: Math.round(benchmarkVal * 100) / 100 },
          ]);
          return true;
        }
      }
    }
    return false;
  }, [playerName, recentAnalyses]);

  // Fetch only benchmarks (analyses come from prop now)
  React.useEffect(() => {
    let cancelled = false;
    const fetchBenchmarks = async () => {
      setLoading(true);
      try {
        let benchmarks: any[] = [];
        try {
          const { data } = await sharedSupabase
            .from("comparison_players" as any)
            .select("name, position, metrics")
            .eq("position", playerPosition);
          benchmarks = data || [];
        } catch {
          // Table doesn't exist yet
        }

        if (cancelled) return;
        benchmarksRef.current = benchmarks;

        if (!pickComparison()) {
          setChartData(null);
        }
      } catch (error) {
        console.error("Error fetching benchmarks:", error);
        if (!cancelled) setChartData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBenchmarks();
    return () => { cancelled = true; };
  }, [playerId, playerPosition, pickComparison]);

  // Auto-rotate every 15 seconds
  React.useEffect(() => {
    if (loading || !benchmarksRef.current) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        pickComparison();
        setVisible(true);
      }, 400);
    }, 15000);
    return () => clearInterval(interval);
  }, [pickComparison, loading]);

  if (!loading && !chartData) return null;

  return (
    <Card className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] rounded-none border-x-0 border-t-[2px] border-t-accent border-b-0">
      <CardHeader marble className="py-2">
        <div className="flex items-center justify-between container mx-auto px-4 pr-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle className="font-heading tracking-tight ml-[9px] mt-[1px]">Comparisons</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {onSeeAll && (
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={onSeeAll}
                 className="flex items-center gap-1 text-sm text-accent hover:text-black hover:bg-accent h-10"
                >
                See All
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="container mx-auto px-4 pt-3 pb-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-8 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : chartData ? (
          <AnimatePresence mode="wait">
            {visible && (
              <motion.div
                key={statLabel + benchmarkName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-xs text-muted-foreground mb-3">
                 <span className="font-semibold text-foreground">{statLabel}</span> — Last 5 games avg vs{" "}
                  <span className="font-semibold text-accent">{benchmarkName}</span>
                </p>
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={80}
                        tick={({ x, y, payload }: any) => {
                          const idx = chartData.findIndex(d => d.name === payload.value);
                          const color = idx === 0 ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))";
                          return (
                            <text x={x} y={y} dy={4} textAnchor="end" fill={color} fontSize={12} fontWeight={idx === 0 ? 700 : 400}>
                              {payload.value}
                            </text>
                          );
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                         {chartData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={index === 0 ? "hsl(var(--accent))" : "hsl(var(--muted-foreground) / 0.4)"}
                          />
                        ))}
                        <LabelList
                          dataKey="value"
                          position="right"
                          style={{ fontSize: 13, fontWeight: 700, fill: "hsl(var(--foreground))" }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : null}
      </CardContent>
    </Card>
  );
};
