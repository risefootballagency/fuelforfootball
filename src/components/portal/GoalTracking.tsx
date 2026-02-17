import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingUp, Award, Clock, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GoalTrackingProps {
  playerData: any;
  fixtureAnalyses: any[];
  formWindow: number;
}

const getR90Color = (score: number) => {
  if (score >= 8) return "hsl(var(--accent))";
  if (score >= 6) return "hsl(120, 50%, 45%)";
  if (score >= 4) return "hsl(47, 80%, 50%)";
  return "hsl(0, 60%, 50%)";
};

export const GoalTracking = ({ playerData, fixtureAnalyses, formWindow }: GoalTrackingProps) => {
  const metrics = useMemo(() => {
    if (!fixtureAnalyses || fixtureAnalyses.length === 0) return null;

    const scores = fixtureAnalyses
      .map((a: any) => a.r90_score)
      .filter((s: any): s is number => typeof s === "number" && s > 0);

    if (scores.length === 0) return null;

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const best = Math.max(...scores);
    const totalMinutes = fixtureAnalyses.reduce((sum: number, a: any) => sum + (a.minutes_played || 0), 0);
    const matchesAnalysed = scores.length;

    // Form window average
    const recentScores = scores.slice(0, formWindow);
    const formAvg = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;

    // Count how many times they hit 7+ and 8+
    const sevenPlus = scores.filter(s => s >= 7).length;
    const eightPlus = scores.filter(s => s >= 8).length;

    return { avg, best, totalMinutes, matchesAnalysed, formAvg, sevenPlus, eightPlus };
  }, [fixtureAnalyses, formWindow]);

  if (!metrics) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No analysis data available to track goals.
      </div>
    );
  }

  const targets = [
    {
      label: "Average R90",
      value: metrics.avg,
      target: 7.0,
      format: (v: number) => v.toFixed(2),
      icon: TrendingUp,
    },
    {
      label: "Personal Best",
      value: metrics.best,
      target: 9.0,
      format: (v: number) => v.toFixed(2),
      icon: Award,
    },
    {
      label: `Form (Last ${formWindow})`,
      value: metrics.formAvg,
      target: 7.5,
      format: (v: number) => v.toFixed(2),
      icon: Zap,
    },
    {
      label: "7+ Performances",
      value: metrics.sevenPlus,
      target: Math.max(10, metrics.matchesAnalysed),
      format: (v: number) => `${v}/${metrics.matchesAnalysed}`,
      icon: Target,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Total Minutes</p>
            <p className="text-xl font-bebas text-foreground">{metrics.totalMinutes.toLocaleString()}'</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Award className="h-4 w-4 mx-auto mb-1 text-accent" />
            <p className="text-xs text-muted-foreground">8+ Performances</p>
            <p className="text-xl font-bebas" style={{ color: "hsl(var(--accent))" }}>{metrics.eightPlus}</p>
          </CardContent>
        </Card>
      </div>

      {targets.map((t) => {
        const pct = Math.min(100, (t.value / t.target) * 100);
        const Icon = t.icon;
        return (
          <div key={t.label} className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{t.label}</span>
              </div>
              <span className="text-sm font-bebas" style={{ color: getR90Color(t.value) }}>
                {t.format(t.value)}
              </span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
        );
      })}
    </div>
  );
};
