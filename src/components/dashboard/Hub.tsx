import * as React from "react";
import { t } from "@/lib/portalTranslations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, ArrowRight, Trophy, X, Eye, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { format, parseISO, isWithinInterval, addDays } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase as localSupabase } from "@/integrations/supabase/client";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { getR90Grade } from "@/lib/gradeCalculations";
import { PerformanceReportDialog } from "@/components/PerformanceReportDialog";
import { createAnalysisSlug } from "@/lib/urlHelpers";
import { QuickStatsComparison } from "./QuickStatsComparison";
import { NewsFeed } from "./NewsFeed";
import { ParallaxHero } from "@/components/portal/ParallaxHero";
import { ProgressSummary } from "@/components/portal/ProgressSummary";
import { checkAndFireConfetti } from "@/lib/confetti";

// Helper: fetches next fixture for player's club and renders ParallaxHero with countdown
const ParallaxHeroWithFixture = ({ playerData, marketingImages, imageFocalPoints }: { playerData: any; marketingImages: string[]; imageFocalPoints: string[] }) => {
  const [nextFixture, setNextFixture] = React.useState<{ home_team: string; away_team: string; match_date: string; venue?: string } | null>(null);
  const [preMatchAnalysis, setPreMatchAnalysis] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchNext = async () => {
      const club = playerData?.current_club || playerData?.club;
      const playerId = playerData?.id;
      if (!club && !playerId) return;
      const today = new Date().toISOString().split("T")[0];

      // Method 1: Check player_fixtures table first (most reliable)
      if (playerId) {
        try {
          const { data: pfData } = await sharedSupabase
            .from("player_fixtures" as any)
            .select("fixture_id, fixtures:fixture_id(id, match_date, home_team, away_team, venue)")
            .eq("player_id", playerId);

          if (pfData && pfData.length > 0) {
            const upcoming = (pfData as any[])
              .filter((pf: any) => pf.fixtures && pf.fixtures.match_date >= today)
              .sort((a: any, b: any) => a.fixtures.match_date.localeCompare(b.fixtures.match_date));

            if (upcoming.length > 0) {
              const fix = upcoming[0].fixtures;
              setNextFixture({ home_team: fix.home_team, away_team: fix.away_team, match_date: fix.match_date, venue: fix.venue });

              // Look up pre-match analysis for this fixture
              const { data: analysisData } = await sharedSupabase
                .from("analyses")
                .select("id, title, home_team, away_team")
                .eq("fixture_id", fix.id)
                .eq("analysis_type", "pre-match")
                .limit(1);

              if (analysisData && analysisData.length > 0) {
                setPreMatchAnalysis(analysisData[0]);
              }
              return;
            }
          }
        } catch {
          // Silently fall through to club name matching
        }
      }

      // Method 2: Fallback to club name matching
      if (club) {
        const { data } = await sharedSupabase
          .from("fixtures")
          .select("id, match_date, home_team, away_team, venue")
          .gte("match_date", today)
          .or(`home_team.ilike.%${club}%,away_team.ilike.%${club}%`)
          .order("match_date", { ascending: true })
          .limit(1);
        if (data && data.length > 0) {
          setNextFixture(data[0]);

          // Look up pre-match analysis for this fixture
          const { data: analysisData } = await sharedSupabase
            .from("analyses")
            .select("id, title, home_team, away_team")
            .eq("fixture_id", data[0].id)
            .eq("analysis_type", "pre-match")
            .limit(1);

          if (analysisData && analysisData.length > 0) {
            setPreMatchAnalysis(analysisData[0]);
          }
        }
      }
    };
    fetchNext();
  }, [playerData?.current_club, playerData?.club, playerData?.id]);

  const imageUrls = React.useMemo(() => {
    const urls: string[] = [];
    if (marketingImages.length > 0) urls.push(...marketingImages);
    else if (playerData?.image_url) urls.push(playerData.image_url);
    return urls;
  }, [marketingImages, playerData?.image_url]);

  return (
    <ParallaxHero
      imageUrl={imageUrls[0] || null}
      imageUrls={imageUrls}
      imageFocalPoints={imageFocalPoints}
      playerName={playerData?.name || "Player"}
      clubName={playerData?.current_club || playerData?.club}
      position={playerData?.position}
      nextFixture={nextFixture}
    />
  );
};

interface PlayerProgram {
  id: string;
  program_name: string;
  weekly_schedules: any;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

interface PlayerAnalysis {
  id: string;
  analysis_date: string;
  opponent: string;
  r90_score: number;
  result: string;
  minutes_played?: number;
  striker_stats?: any;
  fixture_id?: string;
  analysis_writer_id?: string | null;
  analysis_writer_data?: any;
  tagged_analyses?: any[];
  visibility_status?: string;
  placeholder_raw_score?: number | null;
  placeholder_minutes?: number | null;
}

interface UpgradeOffer {
  name: string;
  price: string;
  currency: string;
  features: string[];
  message: string;
  pay_link_url: string;
  product_id?: string;
  payment_type?: string;
  recurring_interval?: string;
}

interface PortalSettings {
  hub_widget_type: "aphorisms" | "sales_box";
  current_package_name: string | null;
  current_package_price: number | null;
  current_package_currency: string;
  current_package_features: string[] | null;
  upgrade_product_id: string | null;
  upgrade_message: string | null;
  upgrade_name: string | null;
  upgrade_price: number | null;
  upgrade_currency: string | null;
  upgrade_features: string[] | null;
  upgrade_pay_link_url: string | null;
  upgrade_offers: UpgradeOffer[] | null;
  hero_images?: string[];
  hero_focal_points?: string[];
  show_aphorisms?: boolean;
  show_quick_stats?: boolean;
}

interface HubProps {
  programs: PlayerProgram[];
  analyses: PlayerAnalysis[];
  playerData: any;
  dailyAphorism?: any;
  portalSettings?: PortalSettings | null;
  portalLanguage?: string | null;
  onNavigateToAnalysis: () => void;
  onNavigateToComparisons?: () => void;
  onNavigateToForm?: () => void;
  onNavigateToSession?: (sessionKey: string) => void;
  onNavigateToSchedule?: () => void;
}

export const Hub = ({ programs, analyses, playerData, dailyAphorism, portalSettings, portalLanguage, onNavigateToAnalysis, onNavigateToComparisons, onNavigateToForm, onNavigateToSession, onNavigateToSchedule }: HubProps) => {
  const navigate = useNavigate();
  const [marketingImages, setMarketingImages] = React.useState<string[]>([]);
  const [imageFocalPoints, setImageFocalPoints] = React.useState<string[]>([]);
  const [imagesPreloaded, setImagesPreloaded] = React.useState(false);
  const hasAnimated = React.useRef(false);
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [tooltipVisible, setTooltipVisible] = React.useState(true);
  const [reportDialogOpen, setReportDialogOpen] = React.useState(false);
  const [selectedReportId, setSelectedReportId] = React.useState<string | null>(null);
  const [postMatchAnalyses, setPostMatchAnalyses] = React.useState<Map<string, { id: string; homeTeam: string; awayTeam: string }>>(new Map());
  const confettiFired = React.useRef(false);

  // Fire confetti on personal best R90
  React.useEffect(() => {
    if (confettiFired.current || analyses.length < 2) return;
    const sorted = [...analyses].sort((a, b) => new Date(b.analysis_date).getTime() - new Date(a.analysis_date).getTime());
    const latest = sorted[0];
    const previousBest = Math.max(...sorted.slice(1).map(a => a.r90_score ?? 0));
    if (latest?.r90_score != null && checkAndFireConfetti(latest.r90_score, previousBest)) {
      confettiFired.current = true;
    }
  }, [analyses]);

  // Fetch post-match analyses linked to fixtures
  React.useEffect(() => {
    const fetchPostMatchAnalyses = async () => {
      const { data } = await sharedSupabase
        .from('analyses')
        .select('id, fixture_id, home_team, away_team')
        .eq('analysis_type', 'post-match')
        .not('fixture_id', 'is', null);

      if (data) {
        const map = new Map<string, { id: string; homeTeam: string; awayTeam: string }>();
        data.forEach(a => {
          if (a.fixture_id) {
            map.set(a.fixture_id, { id: a.id, homeTeam: a.home_team || '', awayTeam: a.away_team || '' });
          }
        });
        setPostMatchAnalyses(map);
      }
    };
    fetchPostMatchAnalyses();
  }, []);

  // Custom Tooltip Component with close button
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length || !tooltipVisible) return null;
    
    const data = payload[0].payload;
    const stats = data.strikerStats;
    
    return (
      <div 
        className="relative bg-black border-2 border-primary rounded-lg p-3 text-white min-w-[200px]"
        style={{ pointerEvents: 'auto' }}
      >
        <button
          onClick={() => setTooltipVisible(false)}
          className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors"
          aria-label="Close tooltip"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="space-y-2 pr-6">
          <div className="font-bold text-white text-base mb-1">{data.result} {data.opponent}</div>
          {data.minutesPlayed && (
            <div className="text-xs text-white/60">Minutes Played: {data.minutesPlayed}</div>
          )}
          {stats && (
            <div className="space-y-1 pt-2 border-t border-white/20">
              <div className="text-xs font-semibold text-white/80">Advanced Stats (per 90):</div>
              {stats.xG_adj_per90 !== undefined && (
                <div className="text-xs text-white/70">xG (adj): {stats.xG_adj_per90.toFixed(2)}</div>
              )}
              {stats.xA_adj_per90 !== undefined && (
                <div className="text-xs text-white/70">xA (adj): {stats.xA_adj_per90.toFixed(2)}</div>
              )}
              {stats.xGChain_per90 !== undefined && (
                <div className="text-xs text-white/70">xGChain: {stats.xGChain_per90.toFixed(2)}</div>
              )}
              {stats.regains_adj_per90 !== undefined && (
                <div className="text-xs text-white/70">Regains (adj): {stats.regains_adj_per90.toFixed(2)}</div>
              )}
              {stats.interceptions_per90 !== undefined && (
                <div className="text-xs text-white/70">Interceptions: {stats.interceptions_per90.toFixed(2)}</div>
              )}
              {stats.progressive_passes_adj_per90 !== undefined && (
                <div className="text-xs text-white/70">Progressive Passes (adj): {stats.progressive_passes_adj_per90.toFixed(2)}</div>
              )}
              {stats.turnovers_adj_per90 !== undefined && (
                <div className="text-xs text-white/70">Turnovers (adj): {stats.turnovers_adj_per90.toFixed(2)}</div>
              )}
              {stats.movement_in_behind_xC_per90 !== undefined && (
                <div className="text-xs text-white/70">Movement In Behind xC: {stats.movement_in_behind_xC_per90.toFixed(2)}</div>
              )}
              {stats.movement_to_feet_xC_per90 !== undefined && (
                <div className="text-xs text-white/70">Movement To Feet xC: {stats.movement_to_feet_xC_per90.toFixed(2)}</div>
              )}
              {stats.crossing_movement_xC_per90 !== undefined && (
                <div className="text-xs text-white/70">Crossing Movement xC: {stats.crossing_movement_xC_per90.toFixed(2)}</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Fetch hero images - prefer portal settings hero_images, fallback to marketing_gallery
  React.useEffect(() => {
    const fetchMarketingImages = async () => {
      // If portal settings have hero images, use those instead of marketing_gallery
      if (portalSettings?.hero_images && portalSettings.hero_images.length > 0) {
        setMarketingImages(portalSettings.hero_images);
        setImageFocalPoints(portalSettings.hero_focal_points || portalSettings.hero_images.map(() => 'center center'));
        
        // Preload
        Promise.all(
          portalSettings.hero_images.slice(0, 4).map((url: string) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve(url);
              img.onerror = () => resolve(url);
              img.src = url;
            });
          })
        ).then(() => setImagesPreloaded(true));
        return;
      }

      if (!playerData?.name) {
        setImagesPreloaded(true);
        return;
      }
      
      // Fallback: Try local DB first, then shared DB
      let imageUrls: string[] = [];
      let focalPoints: string[] = [];
      
      const { data: localImages } = await localSupabase
        .from('marketing_gallery')
        .select('file_url')
        .eq('file_type', 'image')
        .eq('player_id', playerData.id)
        .order('created_at', { ascending: false });
      
      if (localImages && localImages.length > 0) {
        imageUrls = localImages.map(img => img.file_url);
        focalPoints = imageUrls.map(() => 'center center');
      } else {
        const { data: sharedImages } = await sharedSupabase
          .from('marketing_gallery' as any)
          .select('file_url')
          .eq('file_type', 'image')
          .eq('player_id', playerData.id)
          .order('created_at', { ascending: false });
        
        if (sharedImages && sharedImages.length > 0) {
          imageUrls = (sharedImages as any[]).map(img => img.file_url);
          focalPoints = imageUrls.map(() => 'center center');
        }
      }
      
      if (imageUrls.length === 0) {
        setImagesPreloaded(true);
        return;
      }
      
      setMarketingImages(imageUrls);
      setImageFocalPoints(focalPoints);
      
      const priorityCount = Math.min(4, imageUrls.length);
      Promise.all(
        imageUrls.slice(0, priorityCount).map(url => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(url);
            img.src = url;
          });
        })
      ).then(() => {
        setImagesPreloaded(true);
        imageUrls.slice(priorityCount).forEach(url => {
          const img = new Image();
          img.src = url;
        });
      }).catch(() => {
        setImagesPreloaded(true);
      });
    };
    
    fetchMarketingImages();
  }, [playerData?.name, playerData?.id, portalSettings?.hero_images]);
  
  // Set hasAnimated to true after initial animation completes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      hasAnimated.current = true;
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Get current program schedule
  const currentProgram = programs.find(p => p.is_current);
  
  // Find the schedule for a rolling 7-day period starting from today
  const currentSchedule = React.useMemo(() => {
    if (!currentProgram?.weekly_schedules) return null;
    
    const today = new Date();
    
    const matchingSchedule = currentProgram.weekly_schedules.find((schedule: any) => {
      if (!schedule.week_start_date) return false;
      try {
        const weekStart = parseISO(schedule.week_start_date);
        const weekEnd = addDays(weekStart, 6);
        return isWithinInterval(today, { start: weekStart, end: weekEnd });
      } catch {
        return false;
      }
    });
    
    return matchingSchedule || currentProgram.weekly_schedules[0] || null;
  }, [currentProgram]);
  
  // Create a rolling 7-day array starting from today
  const rolling7Days = React.useMemo(() => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      const dayName = format(date, 'EEEE').toLowerCase();
      days.push({
        date,
        dayName,
        displayDay: format(date, 'EEE').toUpperCase(),
        displayDate: format(date, 'd'),
        isToday: i === 0
      });
    }
    
    return days;
  }, []);

  // Session color mapping
  const getSessionColor = (sessionKey: string) => {
    const key = sessionKey.toUpperCase();
    const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
      'A': { bg: 'hsl(220, 70%, 35%)', text: 'hsl(45, 100%, 60%)', hover: 'hsl(220, 70%, 45%)' },
      'B': { bg: 'hsl(140, 50%, 30%)', text: 'hsl(45, 100%, 60%)', hover: 'hsl(140, 50%, 40%)' },
      'C': { bg: 'hsl(0, 50%, 35%)', text: 'hsl(45, 100%, 60%)', hover: 'hsl(0, 50%, 45%)' },
      'D': { bg: 'hsl(47, 70%, 40%)', text: 'hsl(45, 100%, 60%)', hover: 'hsl(47, 70%, 50%)' },
      'E': { bg: 'hsl(70, 20%, 40%)', text: 'hsl(45, 100%, 60%)', hover: 'hsl(70, 20%, 50%)' },
      'F': { bg: 'hsl(270, 60%, 40%)', text: 'hsl(45, 100%, 60%)', hover: 'hsl(270, 60%, 50%)' },
      'G': { bg: 'hsl(190, 70%, 45%)', text: 'hsl(45, 100%, 60%)', hover: 'hsl(190, 70%, 55%)' },
      'H': { bg: 'hsl(30, 80%, 45%)', text: 'hsl(45, 100%, 60%)', hover: 'hsl(30, 80%, 55%)' },
      'T': { bg: 'hsl(47, 100%, 51%)', text: 'hsl(0, 0%, 0%)', hover: 'hsl(47, 100%, 60%)' },
      'TESTING': { bg: 'hsl(47, 100%, 51%)', text: 'hsl(0, 0%, 0%)', hover: 'hsl(47, 100%, 60%)' },
      'REST': { bg: 'hsl(0, 0%, 20%)', text: 'hsl(0, 0%, 100%)', hover: 'hsl(0, 0%, 30%)' },
      'R': { bg: 'hsl(0, 0%, 20%)', text: 'hsl(0, 0%, 100%)', hover: 'hsl(0, 0%, 30%)' },
      'MATCH': { bg: 'hsl(47, 100%, 51%)', text: 'hsl(0, 0%, 0%)', hover: 'hsl(47, 100%, 60%)' },
      'M': { bg: 'hsl(47, 100%, 51%)', text: 'hsl(0, 0%, 0%)', hover: 'hsl(47, 100%, 60%)' },
    };
    return colorMap[key] || { bg: 'hsl(0, 0%, 10%)', text: 'hsl(0, 0%, 100%)', hover: 'hsl(0, 0%, 15%)' };
  };

  // Prepare R90 chart data
  const getEffectiveR90 = (a: PlayerAnalysis): number | null => {
    if (a.visibility_status === "hidden" && a.placeholder_raw_score != null && a.placeholder_minutes) {
      return (a.placeholder_raw_score / a.placeholder_minutes) * 90;
    }
    return a.r90_score;
  };

  const chartData = analyses
    .filter(a => getEffectiveR90(a) != null)
    .sort((a, b) => new Date(a.analysis_date).getTime() - new Date(b.analysis_date).getTime())
    .slice(-5)
    .map(a => ({
      opponent: a.opponent || "Unknown",
      score: getEffectiveR90(a)!,
      result: a.result || "",
      displayLabel: `${a.opponent || "Unknown"}${a.result ? ` (${a.result})` : ""}`,
      analysisId: a.id,
      minutesPlayed: a.minutes_played,
      strikerStats: a.striker_stats
    }));

  const maxScore = chartData.length > 0 
    ? Math.ceil(Math.max(...chartData.map(d => d.score)))
    : 4;

  const averageScore = chartData.length > 0
    ? chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length
    : 0;

  const getR90Color = (score: number) => {
    if (score < 0) return "hsl(0, 93%, 12%)";
    if (score >= 0 && score < 0.2) return "hsl(0, 84%, 60%)";
    if (score >= 0.2 && score < 0.4) return "hsl(0, 91%, 71%)";
    if (score >= 0.4 && score < 0.6) return "hsl(25, 95%, 37%)";
    if (score >= 0.6 && score < 0.8) return "hsl(25, 95%, 53%)";
    if (score >= 0.8 && score < 1.0) return "hsl(48, 96%, 53%)";
    if (score >= 1.0 && score < 1.4) return "hsl(82, 84%, 67%)";
    if (score >= 1.4 && score < 1.8) return "hsl(142, 76%, 36%)";
    if (score >= 1.8 && score < 2.5) return "hsl(142, 72%, 29%)";
    return "hsl(36, 100%, 50%)";
  };

  const recentAnalyses = analyses
    .sort((a, b) => new Date(b.analysis_date).getTime() - new Date(a.analysis_date).getTime())
    .slice(0, 5);

  return (
    <>
      {/* Parallax Hero Header with countdown overlay */}
      {(playerData?.image_url || marketingImages.length > 0) && (
        <ParallaxHeroWithFixture
          playerData={playerData}
          marketingImages={marketingImages}
          imageFocalPoints={imageFocalPoints}
        />
      )}

      <div className="space-y-0 mb-0">
        {/* Gold line above schedule */}
        <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
          <div className="border-t-2 border-accent"></div>
        </div>

        {/* Schedule Card - Full Width */}
        <Card className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] rounded-none border-x-0 border-t-0 border-b-0 z-30">
          <CardHeader marble className="py-2">
            <div className="flex items-center justify-between container mx-auto px-4 pr-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <CardTitle className="font-heading tracking-tight ml-[9px] mt-[1px]">{t(portalLanguage, "schedule")}</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onNavigateToSchedule}
                className="flex items-center justify-center gap-1 text-sm text-accent hover:text-black hover:bg-accent h-10"
              >
                {t(portalLanguage, "view_all")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="container mx-auto px-4 pt-3 pb-3">
            {currentSchedule ? (
              <div className="grid grid-cols-8 gap-1 md:gap-2">
                {/* Today Cell */}
                <div 
                  className="p-2 md:p-4 flex flex-col items-center justify-center rounded-lg bg-accent text-black"
                >
                  <div className="text-center">
                    <div className="text-sm md:text-2xl font-bold mb-1 text-black">{format(new Date(), 'd')}<sup className="text-[8px] md:text-sm">th</sup></div>
                    <div className="text-[8px] md:text-sm font-medium italic text-black">Today</div>
                  </div>
                </div>
              
                {/* Day Cells - Rolling 7 days with 3-tier layout */}
                {rolling7Days.map((dayInfo, index) => {
                  const sessionValue = currentSchedule[dayInfo.dayName] || '';
                  const teamSessionValue = currentSchedule[`${dayInfo.dayName}Team`] || '';
                  const colors = sessionValue ? getSessionColor(sessionValue) : { bg: 'hsl(0, 0%, 10%)', text: 'hsl(0, 0%, 100%)', hover: 'hsl(0, 0%, 15%)' };
                  const dayImageKey = `${dayInfo.dayName}Image`;
                  const clubLogoUrl = currentSchedule[dayImageKey];
                  
                  const isClickableSession = sessionValue && /^[A-H]$/i.test(sessionValue);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => isClickableSession && onNavigateToSession?.(sessionValue.toUpperCase())}
                      disabled={!isClickableSession}
                      className="relative rounded-lg transition-all flex flex-col min-h-[80px] md:min-h-[100px] disabled:cursor-default overflow-hidden"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        cursor: isClickableSession ? 'pointer' : 'default',
                      }}
                    >
                      {/* Top 1/4 - Date */}
                      <div className="h-1/4 flex items-center justify-center px-1 bg-black/20">
                        <div className="text-[8px] md:text-xs font-bold leading-tight">
                          {dayInfo.displayDay} {dayInfo.displayDate}
                        </div>
                      </div>

                      {/* Middle 2/4 - Regular session content */}
                      <div className="h-2/4 flex flex-col items-center justify-center">
                        {clubLogoUrl ? (
                          <img 
                            src={clubLogoUrl} 
                            alt={`${dayInfo.dayName} session`}
                            className="w-6 h-6 md:w-8 md:h-8 object-contain"
                          />
                        ) : sessionValue ? (
                          <div className="text-base md:text-lg font-bold text-center">
                            {sessionValue.toUpperCase()}
                          </div>
                        ) : !teamSessionValue ? (
                          <div className="text-base md:text-lg font-bold text-center opacity-50">-</div>
                        ) : null}
                      </div>

                      {/* Bottom 1/4 - Team training */}
                      <div className="h-1/4 flex items-center justify-center bg-black/30 px-1">
                        {teamSessionValue && (
                          <div className="text-[6px] md:text-[8px] font-bold text-center truncate w-full" style={{ color: 'hsl(45, 100%, 80%)' }}>
                            {teamSessionValue}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active program schedule</p>
            )}
          </CardContent>
        </Card>

        {/* News Feed / Inbox - directly below schedule */}
        {playerData?.id && (
          <NewsFeed
            playerId={playerData.id}
            playerName={playerData.name || "Player"}
            portalLanguage={portalLanguage}
            onNavigateToAnalysis={onNavigateToAnalysis}
            onOpenReport={(id) => {
              setSelectedReportId(id);
              setReportDialogOpen(true);
            }}
          />
        )}

        {/* R90 Performance Chart - Full Width */}
        <Card className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] rounded-none border-0 border-t-[2px] border-t-accent z-20 overflow-visible">
          <CardHeader marble className="py-2">
            <div className="flex items-center justify-between container mx-auto px-4 pr-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <CardTitle className="font-heading tracking-tight ml-[9px] mt-[1px]">Form</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onNavigateToForm || onNavigateToAnalysis}
                className="flex items-center justify-center gap-1 text-sm text-accent hover:text-black hover:bg-accent h-10"
              >
                See All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 pb-0">
            {chartData.length > 0 ? (
              <div ref={chartRef} className="w-full" style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 40, bottom: 0, left: 0, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="opponent"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      height={60}
                      interval={0}
                      tick={(props) => {
                        const { x, y, payload } = props;
                        const data = chartData.find(d => d.opponent === payload.value);
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text 
                              x={0} 
                              y={0} 
                              dy={16} 
                              textAnchor="middle" 
                              fill="white"
                              fontSize={12}
                              fontWeight="bold"
                            >
                              {data?.result || ''}
                            </text>
                          </g>
                        );
                      }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[0, maxScore]}
                      ticks={Array.from({ length: maxScore + 1 }, (_, i) => i)}
                      width={30}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }}
                      wrapperStyle={{ pointerEvents: 'auto' }}
                    />
                    <defs>
                      {chartData.map((entry, index) => {
                        const baseColor = getR90Color(entry.score);
                        const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
                        if (hslMatch) {
                          const [, h, s, l] = hslMatch;
                          const lightness = parseInt(l);
                          return (
                            <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={`hsl(${h}, ${s}%, ${Math.min(lightness + 20, 90)}%)`} />
                              <stop offset="25%" stopColor={`hsl(${h}, ${s}%, ${Math.min(lightness + 10, 85)}%)`} />
                              <stop offset="75%" stopColor={baseColor} />
                              <stop offset="100%" stopColor={`hsl(${h}, ${s}%, ${Math.max(lightness - 15, 5)}%)`} />
                            </linearGradient>
                          );
                        }
                        return null;
                      })}
                    </defs>
                    <Bar
                      dataKey="score" 
                      radius={[8, 8, 0, 0]}
                      isAnimationActive={false}
                      animationBegin={0}
                      animationDuration={1400}
                      animationEasing="ease-in-out"
                      onMouseEnter={() => setTooltipVisible(true)}
                      background={(props: any) => {
                        const { x, y, width, height } = props;
                        const chartHeight = height;
                        const yScale = chartHeight / maxScore;
                        const lineY = y + chartHeight - (averageScore * yScale);
                        
                        return (
                          <g>
                            <line
                              x1={x}
                              y1={lineY}
                              x2={x + width}
                              y2={lineY}
                              stroke="hsl(36, 100%, 50%)"
                              strokeWidth={1.5}
                              strokeDasharray="4 4"
                              opacity={0.6}
                            />
                          </g>
                        );
                      }}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#barGradient-${index})`}
                          style={{
                            animation: !hasAnimated.current ? `barSlideUp 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.25}s both` : 'none',
                            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))'
                          }}
                        />
                      ))}
                      <LabelList 
                        dataKey="score" 
                        position="center"
                        content={(props: any) => {
                          const { x, y, width, height, value, index } = props;
                          if (!x || !y || !width || !height || value === undefined) return null;
                          const delay = index * 0.25;
                          return (
                            <text
                              x={x + width / 2}
                              y={y + height / 2}
                              fill="#ffffff"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize="16"
                              fontWeight="700"
                              style={{
                                opacity: 1,
                                animation: !hasAnimated.current ? `labelFadeIn 0.6s ease-out ${delay + 0.8}s forwards` : 'none'
                              }}
                            >
                              {typeof value === 'number' ? value.toFixed(2) : value}
                            </text>
                          );
                        }}
                      />
                      <LabelList 
                        dataKey="score" 
                        position="top"
                        content={(props: any) => {
                          const { x, y, width, value, index } = props;
                          if (!x || y === undefined || !width || value === undefined) return null;
                          const delay = index * 0.25;
                          const gradeInfo = getR90Grade(value);
                          return (
                            <text
                              x={x + width / 2}
                              y={y - 5}
                              fill={gradeInfo.color}
                              textAnchor="middle"
                              dominantBaseline="baseline"
                              fontSize="18"
                              fontWeight="700"
                              style={{
                                opacity: 1,
                                animation: !hasAnimated.current ? `labelFadeIn 0.6s ease-out ${delay + 0.8}s forwards` : 'none'
                              }}
                            >
                              {gradeInfo.grade}
                            </text>
                          );
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No performance data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Performance Section - Recent Fixtures with PRE/POST buttons */}
        {recentAnalyses.length > 0 && (
          <Card className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] rounded-none border-x-0 border-t-[2px] border-t-accent border-b-0 z-10">
            <CardHeader marble className="py-2">
              <div className="flex items-center justify-between container mx-auto px-4 pr-6">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 mt-[1px]" />
                  <CardTitle className="font-heading tracking-tight ml-[9px]">Performance</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onNavigateToAnalysis}
                  className="flex items-center justify-center gap-1 text-sm text-accent hover:text-black hover:bg-accent h-10"
                >
                  See All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="container mx-auto px-4 pt-3 pb-2">
              <div className="space-y-3">
                {recentAnalyses.map((analysis) => (
                  <button
                    key={analysis.id}
                    onClick={() => {
                      setSelectedReportId(analysis.id);
                      setReportDialogOpen(true);
                    }}
                    className="w-full text-left block border-l-2 border-accent pl-3 pt-0 pb-2 hover:bg-accent/5 transition-colors rounded"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{analysis.opponent}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(analysis.analysis_date), "MMM dd, yyyy")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Pre-match analysis button */}
                        {(() => {
                          const preMatch = (analysis as any).analysis_writer_data?.analysis_type === 'pre-match'
                            ? (analysis as any).analysis_writer_data
                            : (analysis as any).tagged_analyses?.find((ta: any) => ta.analysis_type === 'pre-match');
                          if (!preMatch) return null;
                          return (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-8 w-auto px-2 bg-black text-white border border-white hover:bg-accent hover:text-black rounded font-bold text-[10px] flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                const slug = createAnalysisSlug(preMatch.home_team || '', preMatch.away_team || '', preMatch.id);
                                navigate(slug);
                              }}
                              title="View Pre-Match Analysis"
                            >
                              <Eye className="h-3 w-3" />
                              PRE
                            </Button>
                          );
                        })()}
                        {/* Post-match analysis button */}
                        {(() => {
                          if (postMatchAnalyses.has((analysis as any).fixture_id)) {
                            const postMatch = postMatchAnalyses.get((analysis as any).fixture_id)!;
                            return (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-8 w-auto px-2 bg-black text-white border border-white hover:bg-accent hover:text-black rounded font-bold text-[10px] flex items-center gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const slug = createAnalysisSlug(postMatch.homeTeam, postMatch.awayTeam, postMatch.id);
                                  navigate(slug);
                                }}
                                title="View Post-Match Analysis"
                              >
                                <Eye className="h-3 w-3" />
                                POST
                              </Button>
                            );
                          }
                          const postMatch = (analysis as any).analysis_writer_data?.analysis_type === 'post-match'
                            ? (analysis as any).analysis_writer_data
                            : (analysis as any).tagged_analyses?.find((ta: any) => ta.analysis_type === 'post-match');
                          if (!postMatch) return null;
                          return (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-8 w-auto px-2 bg-black text-white border border-white hover:bg-accent hover:text-black rounded font-bold text-[10px] flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                const slug = createAnalysisSlug(postMatch.home_team || '', postMatch.away_team || '', postMatch.id);
                                navigate(slug);
                              }}
                              title="View Post-Match Analysis"
                            >
                              <Eye className="h-3 w-3" />
                              POST
                            </Button>
                          );
                        })()}
                        {(() => {
                          const effectiveR90 = getEffectiveR90(analysis);
                          if (effectiveR90 == null) return null;
                          return (
                            <div 
                              className="px-3 py-1 rounded text-white text-sm font-bold border-2 border-transparent hover:border-accent transition-colors duration-200"
                              style={{ backgroundColor: getR90Color(effectiveR90) }}
                            >
                              R90: {effectiveR90.toFixed(2)}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Report Dialog */}
      <PerformanceReportDialog 
        open={reportDialogOpen} 
        onOpenChange={setReportDialogOpen}
        analysisId={selectedReportId}
        isPortalView={true}
      />

      {/* Quick Stats Comparison - before aphorism */}
      {playerData?.id && (
        <QuickStatsComparison
          playerId={playerData.id}
          playerName={playerData.name || "You"}
          playerPosition={playerData.position || "CF"}
          analyses={analyses}
          onSeeAll={onNavigateToComparisons || onNavigateToAnalysis}
        />
      )}

      {/* Bottom Widget: Aphorisms or Sales Box */}
      {(() => {
        const showSalesBox = portalSettings?.hub_widget_type === "sales_box";

        if (showSalesBox) {
          const currencySymbol = portalSettings?.current_package_currency === "EUR" ? "€" : portalSettings?.current_package_currency === "USD" ? "$" : "£";
          const hasCurrentPackage = !!portalSettings?.current_package_name;
          
          // Build offers list from upgrade_offers or legacy single offer
          const offers: UpgradeOffer[] = portalSettings?.upgrade_offers && portalSettings.upgrade_offers.length > 0
            ? portalSettings.upgrade_offers
            : portalSettings?.upgrade_name
              ? [{
                  name: portalSettings.upgrade_name,
                  price: portalSettings.upgrade_price?.toString() || "",
                  currency: portalSettings.upgrade_currency || "GBP",
                  features: portalSettings.upgrade_features || [],
                  message: portalSettings.upgrade_message || "",
                  pay_link_url: portalSettings.upgrade_pay_link_url || "",
                }]
              : [];

          return (
            <>
              <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
                <div className="border-t-2 border-accent"></div>
              </div>

              {/* Progress Summary */}
              {playerData?.id && <ProgressSummary playerId={playerData.id} />}

              <div className="px-4 md:px-0 mt-[10px]">
                <Card className="relative overflow-hidden border-accent bg-white/10">
                  <CardContent className="relative py-4 px-4 space-y-4">
                    {hasCurrentPackage ? (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Current Package</p>
                        <p className="text-lg font-bold text-accent">{portalSettings!.current_package_name}</p>
                        {portalSettings!.current_package_price != null && (() => {
                          const currentPkgs = (portalSettings as any)?.current_packages;
                          const freq = Array.isArray(currentPkgs) && currentPkgs[0]?.frequency;
                          const freqLabel = freq === "one-off" ? "/pc" : freq === "weekly" ? "/wk" : freq === "6-monthly" ? "/6mo" : freq === "annual" ? "/yr" : freq === "monthly" ? "/mo" : "";
                          return (
                            <p className="text-sm text-muted-foreground">{currencySymbol}{portalSettings!.current_package_price}{freqLabel}</p>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Package Status</p>
                        <p className="text-base text-muted-foreground">Not currently on a package</p>
                      </div>
                    )}
                    {portalSettings?.current_package_features && portalSettings.current_package_features.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {portalSettings.current_package_features.map((f, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs text-accent">
                            <Check className="w-3 h-3" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upgrade Offers - Shimmer Border Cards */}
                    {offers.length > 0 && (
                      <div className={offers.length > 1 ? "flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-2 px-2" : ""}>
                        {offers.map((offer, idx) => {
                          const offerCurrSym = offer.currency === "EUR" ? "€" : offer.currency === "USD" ? "$" : "£";
                          return (
                            <div 
                              key={idx} 
                              className={`relative rounded-lg p-[2px] ${offers.length > 1 ? "min-w-[280px] snap-center flex-shrink-0" : ""}`}
                              style={{
                                background: "linear-gradient(135deg, hsl(47, 100%, 51%), hsl(47, 100%, 30%), hsl(47, 100%, 51%), hsl(47, 100%, 70%))",
                                backgroundSize: "300% 300%",
                                animation: "shimmer-border 3s ease infinite",
                              }}
                            >
                              <div className="bg-card rounded-[6px] p-4 space-y-3">
                                <div className="text-center">
                                  <p className="text-xs text-accent uppercase tracking-wider font-semibold">
                                    {hasCurrentPackage ? "Upgrade Available" : "Recommended Package"}
                                  </p>
                                  <p className="text-lg font-bold text-accent">{offer.name}</p>
                                  {offer.price && (() => {
                                    const pt = offer.payment_type || offer.recurring_interval;
                                    const freqLabel = pt === "one_off" || pt === "one-off" ? "/pc" : pt === "weekly" ? "/wk" : pt === "6-monthly" || pt === "6_monthly" ? "/6mo" : pt === "annual" || pt === "yearly" ? "/yr" : pt === "monthly" || pt === "month" ? "/mo" : "/pc";
                                    return <p className="text-sm text-muted-foreground">{offerCurrSym}{offer.price}{freqLabel}</p>;
                                  })()}
                                </div>
                                {offer.features && offer.features.length > 0 && (
                                  <div className="space-y-1">
                                    {offer.features.map((f, i) => (
                                      <div key={i} className="flex items-center gap-1.5 text-xs text-foreground/80">
                                        <Check className="w-3 h-3 text-accent flex-shrink-0" />
                                        <span>{f}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {offer.message && (
                                  <p className="text-sm text-foreground/90 text-center">{offer.message}</p>
                                )}
                                {offer.pay_link_url && (
                                  <div className="text-center">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                      <Button
                                        className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                                        onClick={() => window.open(offer.pay_link_url, "_blank")}
                                      >
                                        {hasCurrentPackage ? "Upgrade Now" : "Get Started"}
                                      </Button>
                                    </motion.div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          );
        }

        // Default: show aphorism
        if (!dailyAphorism) return null;
        return (
          <>
            <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
              <div className="border-t-2 border-accent"></div>
            </div>
            <div className="px-4 md:px-0 mt-[10px]">
              <Card className="relative overflow-hidden border-accent bg-white/10">
                <CardContent className="relative py-3 px-3 text-center space-y-3">
                  <div className="bg-black/90 backdrop-blur-sm p-3 rounded-lg inline-block">
                    <p className="text-base md:text-xl font-bold text-accent leading-relaxed tracking-wide">
                      {dailyAphorism.featured_text}
                    </p>
                  </div>
                  {dailyAphorism.author && (
                    <div className="bg-black/90 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
                      <p className="text-xs md:text-sm text-accent/80 italic font-medium">
                        — {dailyAphorism.author}
                      </p>
                    </div>
                  )}
                  {dailyAphorism.body_text && (
                    <div className="bg-black/90 backdrop-blur-sm p-3 rounded-lg max-w-2xl mx-auto">
                      <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
                        {dailyAphorism.body_text}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        );
      })()}
    </>
  );
};
