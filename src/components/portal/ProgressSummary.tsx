import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { t } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";

interface ProgressSummaryProps {
  playerId: string;
}

export const ProgressSummary = ({ playerId }: ProgressSummaryProps) => {
  const lang = usePortalLanguage();
  const [data, setData] = useState<{ score: number; date: string }[]>([]);
  const [percentChange, setPercentChange] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data: scores } = await sharedSupabase
        .from("player_analysis")
        .select("r90_score, analysis_date, visibility_status, placeholder_raw_score, placeholder_minutes")
        .eq("player_id", playerId)
        .not("r90_score", "is", null)
        .order("analysis_date", { ascending: true })
        .limit(10);

      if (!scores || scores.length < 3) return;

      const mapped = (scores as any[]).map((s) => {
        let score = s.r90_score;
        if (s.visibility_status === "hidden" && s.placeholder_raw_score != null && s.placeholder_minutes) {
          score = (s.placeholder_raw_score / s.placeholder_minutes) * 90;
        }
        return { score, date: s.analysis_date };
      });

      setData(mapped);

      const latest = mapped[mapped.length - 1].score;
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const baseline = mapped.find(
        (d) => new Date(d.date) <= threeMonthsAgo
      ) || mapped[0];

      if (baseline.score > 0) {
        const change = ((latest - baseline.score) / baseline.score) * 100;
        if (change > 0) setPercentChange(change);
      }
    };
    fetch();
  }, [playerId]);

  if (!percentChange || percentChange <= 0 || data.length < 3) return null;

  return (
    <div className="px-4 md:px-0">
      <Card className="border-accent/30 bg-black/40 backdrop-blur-sm">
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t(lang, "your_progress")}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-bold text-emerald-400">+{percentChange.toFixed(0)}%</span>
                <span className="text-xs text-muted-foreground">{t(lang, "vs_3_months_ago")}</span>
              </div>
            </div>
            <div className="w-24 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
