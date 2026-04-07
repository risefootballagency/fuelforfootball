import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Eye } from "lucide-react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { t } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";
import { createAnalysisSlug } from "@/lib/urlHelpers";

interface NextFixtureCountdownProps {
  playerName?: string;
}

export const NextFixtureCountdown = ({ playerName }: NextFixtureCountdownProps) => {
  const lang = usePortalLanguage();
  const navigate = useNavigate();
  const [nextFixture, setNextFixture] = useState<{ id: string; match_date: string; home_team: string; away_team: string; venue?: string } | null>(null);
  const [preMatchAnalysis, setPreMatchAnalysis] = useState<{ id: string; home_team: string; away_team: string } | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const fetchNext = async () => {
      const nowDate = new Date();
      const today = nowDate.toISOString().split("T")[0];

      const { data } = await sharedSupabase
        .from("fixtures")
        .select("id, match_date, home_team, away_team, venue")
        .gte("match_date", today)
        .order("match_date", { ascending: true })
        .limit(30);

      const upcomingFixture = (data || []).find((fixture) => {
        const matchDate = new Date(fixture.match_date);
        return matchDate.getTime() > nowDate.getTime();
      }) || null;

      if (!upcomingFixture) {
        setNextFixture(null);
        setPreMatchAnalysis(null);
        return;
      }

      setNextFixture(upcomingFixture);

      // Fetch pre-match analysis linked to this fixture
      const { data: preMatch } = await sharedSupabase
        .from("analyses")
        .select("id, home_team, away_team")
        .eq("analysis_type", "pre-match")
        .eq("fixture_id", upcomingFixture.id)
        .limit(1);

      if (preMatch && preMatch.length > 0) {
        setPreMatchAnalysis({
          id: preMatch[0].id,
          home_team: preMatch[0].home_team || "",
          away_team: preMatch[0].away_team || "",
        });
      } else {
        setPreMatchAnalysis(null);
      }
    };

    fetchNext();
    const refreshTimer = setInterval(fetchNext, 30000);
    return () => clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    if (!nextFixture) return null;
    const target = new Date(nextFixture.match_date);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, passed: false };
  }, [nextFixture, now]);

  if (!nextFixture || !countdown) return null;

  const units = [
    { label: t(lang, "days_label"), value: countdown.days },
    { label: t(lang, "hrs_label"), value: countdown.hours },
    { label: t(lang, "min_label"), value: countdown.minutes },
    { label: t(lang, "sec_label"), value: countdown.seconds },
  ];

  return (
    <Card className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] rounded-none border-x-0 border-t-[2px] border-t-primary border-b-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-primary/10 pointer-events-none" />
      <CardHeader marble className="py-2 relative z-10">
        <div className="flex items-center gap-2 container mx-auto px-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="font-heading tracking-tight text-primary ml-[9px] mt-[1px]">{t(lang, "next_fixture")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="container mx-auto px-4 pt-1 pb-4 relative z-10">
        <div className="text-center space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            {nextFixture.home_team} vs {nextFixture.away_team}
            {nextFixture.venue && <span className="ml-1">· {nextFixture.venue}</span>}
          </p>

          {countdown.passed ? (
            <div className="flex items-center justify-center gap-3">
              <p className="text-primary font-bold text-lg">{t(lang, "match_day") || "Match day!"}</p>
              {preMatchAnalysis && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 bg-black text-white border border-primary/40 hover:bg-primary hover:text-black rounded font-bold text-[10px] flex items-center gap-1"
                  onClick={() => {
                    const slug = createAnalysisSlug(preMatchAnalysis.home_team, preMatchAnalysis.away_team, preMatchAnalysis.id);
                    navigate(slug);
                  }}
                >
                  <Eye className="h-3 w-3" />
                  Pre-Match
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex justify-center gap-3">
                {units.map(unit => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <div className="bg-black border border-primary/30 rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[52px]">
                      <span className="text-2xl md:text-3xl font-bold text-primary tabular-nums">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-[9px] md:text-[10px] text-muted-foreground mt-1 font-medium">{unit.label}</span>
                  </div>
                ))}
              </div>
              {preMatchAnalysis && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-4 bg-black text-white border border-primary/40 hover:bg-primary hover:text-black rounded font-bold text-xs flex items-center gap-1.5"
                  onClick={() => {
                    const slug = createAnalysisSlug(preMatchAnalysis.home_team, preMatchAnalysis.away_team, preMatchAnalysis.id);
                    navigate(slug);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t(lang, "view_pre_match") || "View Pre-Match Analysis"}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
