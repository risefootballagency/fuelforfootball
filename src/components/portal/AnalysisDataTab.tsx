import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

interface Analysis {
  id: string;
  analysis_date: string;
  r90_score: number;
  opponent: string | null;
  result: string | null;
  minutes_played: number | null;
  striker_stats?: any;
}

interface Props {
  analyses: Analysis[];
  playerData: any;
  embedded?: boolean;
}

const getR90Color = (score: number) => {
  if (score >= 8) return "hsl(var(--accent))";
  if (score >= 6) return "hsl(120, 50%, 45%)";
  if (score >= 4) return "hsl(47, 80%, 50%)";
  return "hsl(0, 60%, 50%)";
};

export const AnalysisDataTab = ({ analyses, playerData, embedded }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const sortedAnalyses = useMemo(() => 
    [...analyses].sort((a, b) => new Date(b.analysis_date).getTime() - new Date(a.analysis_date).getTime()),
    [analyses]
  );

  const chartData = useMemo(() => 
    [...sortedAnalyses].reverse().slice(-15).map(a => ({
      date: format(new Date(a.analysis_date), "dd MMM"),
      opponent: a.opponent || "Unknown",
      r90: a.r90_score,
      minutes: a.minutes_played || 0,
    })),
    [sortedAnalyses]
  );

  const averageR90 = useMemo(() => {
    if (analyses.length === 0) return 0;
    return analyses.reduce((sum, a) => sum + (a.r90_score || 0), 0) / analyses.length;
  }, [analyses]);

  const recentTrend = useMemo(() => {
    if (sortedAnalyses.length < 3) return "neutral";
    const recent3 = sortedAnalyses.slice(0, 3).reduce((s, a) => s + a.r90_score, 0) / 3;
    const older = sortedAnalyses.slice(3, 6);
    if (older.length === 0) return "neutral";
    const older3 = older.reduce((s, a) => s + a.r90_score, 0) / older.length;
    if (recent3 > older3 + 0.3) return "up";
    if (recent3 < older3 - 0.3) return "down";
    return "neutral";
  }, [sortedAnalyses]);

  const displayedAnalyses = expanded ? sortedAnalyses : sortedAnalyses.slice(0, 5);

  if (analyses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No analysis data available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Avg R90</p>
            <p className="text-2xl font-bebas" style={{ color: getR90Color(averageR90) }}>
              {averageR90.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Matches</p>
            <p className="text-2xl font-bebas text-foreground">{analyses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Trend</p>
            <div className="flex items-center justify-center">
              {recentTrend === "up" && <TrendingUp className="h-6 w-6 text-green-500" />}
              {recentTrend === "down" && <TrendingDown className="h-6 w-6 text-red-500" />}
              {recentTrend === "neutral" && <Minus className="h-6 w-6 text-muted-foreground" />}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* R90 Chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader className="px-3 py-2">
            <CardTitle className="text-sm font-bebas tracking-wider">R90 Performance</CardTitle>
          </CardHeader>
          <CardContent className="px-1 pb-2">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value: number) => [value.toFixed(2), "R90"]}
                />
                <ReferenceLine y={averageR90} stroke="hsl(var(--accent))" strokeDasharray="3 3" opacity={0.5} />
                <Bar dataKey="r90" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={getR90Color(entry.r90)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Match List */}
      <div className="space-y-1">
        {displayedAnalyses.map((analysis) => (
          <div
            key={analysis.id}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {analysis.opponent || "Match"}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(analysis.analysis_date), "dd MMM yyyy")}
                {analysis.minutes_played ? ` · ${analysis.minutes_played}'` : ""}
                {analysis.result ? ` · ${analysis.result}` : ""}
              </p>
            </div>
            <div className="text-right ml-2">
              <span
                className="text-lg font-bebas"
                style={{ color: getR90Color(analysis.r90_score) }}
              >
                {analysis.r90_score?.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {sortedAnalyses.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 text-xs text-accent hover:text-accent/80 py-1"
        >
          {expanded ? <><ChevronUp className="h-3 w-3" /> Show Less</> : <><ChevronDown className="h-3 w-3" /> Show All ({sortedAnalyses.length})</>}
        </button>
      )}
    </div>
  );
};
