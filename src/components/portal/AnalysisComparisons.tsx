import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, BarChart3, Target, Box, Crosshair, ChevronsUpDown, X, UserPlus, ScatterChart } from "lucide-react";
import { METRIC_CATEGORIES, ALL_METRICS } from "@/components/staff/ComparisonPlayerData";
import { GoalTracking } from "@/components/portal/GoalTracking";
import { ScoutingComparisonMatrix } from "@/components/portal/ScoutingComparisonMatrix";
import { ScatterComparisonChart } from "@/components/portal/ScatterComparisonChart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { t, translateMetricLabel, translateMetricCategory } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";

const RadarChart3D = lazy(() => import("@/components/portal/RadarChart3D").then(m => ({ default: m.RadarChart3D })));

interface Analysis {
  id: string;
  analysis_date: string;
  r90_score: number;
  minutes_played: number | null;
  striker_stats?: any;
  opponent?: string | null;
  fixture_stats?: Record<string, number>;
}

interface ComparisonPlayer {
  id: string;
  name: string;
  position: string;
  club: string | null;
  season: string;
  image_url: string | null;
  metrics: Record<string, number>;
  r90_average: number | null;
}

const PLAYER_COLOURS = ['hsl(220, 70%, 50%)', 'hsl(0, 70%, 50%)', 'hsl(140, 60%, 40%)', 'hsl(45, 80%, 50%)'];
const PORTAL_COLOUR = 'hsl(43, 49%, 61%)';

interface Props {
  analyses: Analysis[];
  playerData: any;
  embedded?: boolean;
}

export const AnalysisComparisons = ({ analyses, playerData, embedded }: Props) => {
  const lang = usePortalLanguage();
  const [comparisonPlayers, setComparisonPlayers] = useState<ComparisonPlayer[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [formWindow, setFormWindow] = useState<number>(5);
  const [subTab, setSubTab] = useState<string>("scatter");
  const [fixtureAnalyses, setFixtureAnalyses] = useState<Analysis[]>([]);
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>('goals_per90');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  const playerPosition = playerData?.position || '';
  const playerName = playerData?.name || 'You';

  useEffect(() => {
    const fetchFixtureData = async () => {
      if (!playerData?.id) return;
      const { data } = await sharedSupabase
        .from('player_analysis' as any)
        .select('id, analysis_date, r90_score, minutes_played, opponent, fixture_stats')
        .eq('player_id', playerData.id)
        .order('analysis_date', { ascending: false })
        .limit(20);
      if (data) {
        setFixtureAnalyses((data as any[]).map(a => ({
          ...a,
          r90_score: a.r90_score ?? 0,
          fixture_stats: (a.fixture_stats as Record<string, number>) || {},
        })));
      }
    };
    fetchFixtureData();
  }, [playerData?.id]);

  useEffect(() => {
    const fetchComps = async () => {
      const { data } = await sharedSupabase
        .from('comparison_players' as any)
        .select('*')
        .eq('position', playerPosition)
        .order('name');
      if (data) setComparisonPlayers((data as any[]).map(p => ({ ...p, metrics: (p.metrics || {}) as Record<string, number> })));
    };
    if (playerPosition) fetchComps();
  }, [playerPosition]);

  const selectedComps = comparisonPlayers.filter(p => selectedPlayerIds.includes(p.id));
  const unselectedPlayers = comparisonPlayers.filter(p => !selectedPlayerIds.includes(p.id));
  const filteredPlayers = unselectedPlayers.filter(p =>
    p.name.toLowerCase().includes(pickerSearch.toLowerCase())
  );
  const hasNoMatch = pickerSearch.trim().length >= 2 && filteredPlayers.length === 0;

  const togglePlayer = (id: string) => {
    setSelectedPlayerIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRequestPlayer = async () => {
    const name = pickerSearch.trim();
    if (!name) return;
    try {
      await supabase.functions.invoke("notify-staff", {
        body: {
          event_type: "comparison_request",
          title: "Comparison Player Request",
          body: `${playerName} requested: ${name} (${playerPosition})`,
          event_data: {
            player_name: playerName,
            requested_name: name,
            position: playerPosition,
          },
        },
      });
      toast.success(`Request sent for "${name}"`);
      setPickerSearch("");
      setPickerOpen(false);
    } catch {
      toast.error("Failed to send request");
    }
  };

  const portalMetrics = useMemo(() => {
    const windowAnalyses = fixtureAnalyses.slice(0, formWindow);
    const result: Record<string, number | null> = {};
    ALL_METRICS.forEach(m => {
      const vals = windowAnalyses
        .map(a => a.fixture_stats?.[m.key])
        .filter((v): v is number => v != null && !isNaN(v));
      result[m.key] = vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
    });
    return result;
  }, [fixtureAnalyses, formWindow]);

  const hasPortalData = Object.values(portalMetrics).some(v => v != null);

  const selectedMetric = ALL_METRICS.find(m => m.key === selectedMetricKey);
  const barData = useMemo(() => {
    if (!selectedMetric) return [];
    const items: { name: string; value: number; colour: string }[] = [];
    if (hasPortalData && portalMetrics[selectedMetricKey] != null) {
      items.push({ name: playerName, value: portalMetrics[selectedMetricKey]!, colour: PORTAL_COLOUR });
    }
    selectedComps.forEach((cp, idx) => {
      if (cp.metrics[selectedMetricKey] != null) {
        items.push({ name: cp.name, value: cp.metrics[selectedMetricKey], colour: PLAYER_COLOURS[idx % PLAYER_COLOURS.length] });
      }
    });
    return items;
  }, [selectedComps, portalMetrics, hasPortalData, playerName, selectedMetricKey, selectedMetric]);

  return (
    <div className="space-y-6">
      {/* Form window selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{t(lang, "form")}:</span>
        {[5, 10, 20].map(n => (
          <button
            key={n}
            onClick={() => setFormWindow(n)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              formWindow === n
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-muted'
            }`}
          >
            {t(lang, "last_n")} {n}
          </button>
        ))}
      </div>

      {/* Searchable player picker */}
      <div>
        <p className="text-sm font-medium mb-2">{t(lang, "compare_with")} ({playerPosition}):</p>
        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-[300px] justify-between">
              {selectedPlayerIds.length > 0 ? `${selectedPlayerIds.length} ${t(lang, "selected")}` : t(lang, "add_comparison_players")}
              <ChevronsUpDown className="h-4 w-4 opacity-50 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder={t(lang, "search_players")} value={pickerSearch} onValueChange={setPickerSearch} />
              <CommandList>
                {filteredPlayers.length === 0 && !hasNoMatch && (
                  <CommandEmpty>{t(lang, "no_players_for_position")}</CommandEmpty>
                )}
                <CommandGroup>
                  {filteredPlayers.map(cp => (
                    <CommandItem
                      key={cp.id}
                      value={cp.name}
                      onSelect={() => { togglePlayer(cp.id); }}
                      className="cursor-pointer"
                    >
                      <Avatar className="h-5 w-5 mr-2">
                        {cp.image_url ? <AvatarImage src={cp.image_url} /> : null}
                        <AvatarFallback className="text-[10px]">{cp.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {cp.name}
                      <span className="text-xs opacity-60 ml-auto">{cp.club} · {cp.season}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {hasNoMatch && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleRequestPlayer}
                      className="cursor-pointer text-accent"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Request "{pickerSearch.trim()}"
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected chips */}
        {selectedComps.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedComps.map(cp => (
              <Badge
                key={cp.id}
                variant="secondary"
                className="gap-1 pr-1 cursor-pointer hover:bg-destructive/20"
                onClick={() => togglePlayer(cp.id)}
              >
                <Avatar className="h-4 w-4">
                  {cp.image_url ? <AvatarImage src={cp.image_url} /> : null}
                  <AvatarFallback className="text-[8px]">{cp.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {cp.name}
                <X className="h-3 w-3 ml-0.5" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="scatter"><ScatterChart className="w-4 h-4 mr-1" /> {t(lang, "scatter_label")}</TabsTrigger>
          <TabsTrigger value="percentile"><BarChart3 className="w-4 h-4 mr-1" /> {t(lang, "percentile_label")}</TabsTrigger>
          <TabsTrigger value="radar3d"><Box className="w-4 h-4 mr-1" /> {t(lang, "radar_3d_label")}</TabsTrigger>
          <TabsTrigger value="comparison"><Users className="w-4 h-4 mr-1" /> {t(lang, "player_comparison_label")}</TabsTrigger>
          <TabsTrigger value="scouting"><Crosshair className="w-4 h-4 mr-1" /> {t(lang, "scouting_matrix_label")}</TabsTrigger>
          <TabsTrigger value="goals"><Target className="w-4 h-4 mr-1" /> {t(lang, "goals_label")}</TabsTrigger>
        </TabsList>

        {/* Scatter Tab */}
        <TabsContent value="scatter" className="mt-4">
          <ScatterComparisonChart
            playerName={playerName}
            portalMetrics={portalMetrics}
            hasPortalData={hasPortalData}
            comparisonPlayers={comparisonPlayers}
          />
        </TabsContent>

        {/* 3D Radar Tab */}
        <TabsContent value="radar3d" className="mt-4">
          {hasPortalData ? (
            <Suspense fallback={<div className="h-[400px] flex items-center justify-center text-muted-foreground">{t(lang, "loading_3d_radar")}</div>}>
              <RadarChart3D
                playerName={playerName}
                metrics={(() => {
                  const radarMetrics = ALL_METRICS
                    .filter(m => portalMetrics[m.key] != null)
                    .slice(0, 8)
                    .map(m => {
                      const value = portalMetrics[m.key]!;
                      const allVals = comparisonPlayers.map(cp => cp.metrics[m.key]).filter((v): v is number => v != null);
                      const belowCount = allVals.filter(v => v < value).length;
                      const pct = allVals.length > 0 ? Math.round((belowCount / allVals.length) * 100) : 50;
                      return { label: m.label.replace(/ \/ Game$/, ''), value: pct };
                    });
                  return radarMetrics;
                })()}
              />
            </Suspense>
          ) : (
            <p className="text-muted-foreground text-center py-6">{t(lang, "no_fixture_stats_yet")}</p>
          )}
        </TabsContent>

        {/* Percentile Tab */}
        <TabsContent value="percentile" className="space-y-6 mt-4">
          {comparisonPlayers.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No comparison players stored for position: {playerPosition}</p>
          ) : !hasPortalData ? (
            <p className="text-muted-foreground text-center py-6">
              No fixture stats recorded yet. Stats will appear once your performance data is entered.
            </p>
          ) : (
            <div className="space-y-6">
              {METRIC_CATEGORIES.map(cat => {
                const metricsWithValues = cat.metrics.filter(m => portalMetrics[m.key] != null);
                if (metricsWithValues.length === 0) return null;

                return (
                  <div key={cat.category}>
                    <h4 className="font-semibold text-sm mb-3">{translateMetricCategory(lang, cat.category)}</h4>
                    <div className="space-y-3">
                      {metricsWithValues.map(m => {
                        const value = portalMetrics[m.key]!;
                        const allVals = comparisonPlayers
                          .map(cp => cp.metrics[m.key])
                          .filter((v): v is number => v != null);
                        const belowCount = allVals.filter(v => v < value).length;
                        const pct = allVals.length > 0 ? Math.round((belowCount / allVals.length) * 100) : 50;

                        return (
                          <div key={m.key} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{translateMetricLabel(lang, m.key, m.label)}{m.key.endsWith('_pct') ? '' : ` ${t(lang, "per_game")}`}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">{value.toFixed(2)}{m.key.endsWith('_pct') ? '%' : ''}</span>
                                <span className="text-lg font-bold text-primary w-12 text-right">{pct}%</span>
                              </div>
                            </div>
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Direct Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-4">
          {(selectedComps.length > 0 || hasPortalData) && (
            <>
              {/* Stat Picker Comparison */}
              <div className="bg-card border rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h4 className="font-semibold">{t(lang, "stat_comparison")}</h4>
                  <Select value={selectedMetricKey} onValueChange={setSelectedMetricKey}>
                    <SelectTrigger className="w-full sm:w-[260px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                     {METRIC_CATEGORIES.map(cat => (
                        <div key={cat.category}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{translateMetricCategory(lang, cat.category)}</div>
                          {cat.metrics.map(m => (
                            <SelectItem key={m.key} value={m.key}>
                              {translateMetricLabel(lang, m.key, m.label)}{m.key.endsWith('_pct') ? '' : ` ${t(lang, "per_game")}`}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {barData.length > 0 ? (
                  <div className="space-y-3">
                    {(() => {
                      const maxVal = Math.max(...barData.map(d => d.value), 0.01);
                      const isPercentage = selectedMetricKey.endsWith('_pct');
                      return barData.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.name}</span>
                            <span className="font-bold tabular-nums">
                              {item.value.toFixed(2)}{isPercentage ? '%' : ''}
                            </span>
                          </div>
                          <div className="h-6 bg-muted rounded-md overflow-hidden">
                            <div
                              className="h-full rounded-md transition-all duration-700"
                              style={{
                                width: `${(item.value / (isPercentage ? 100 : maxVal)) * 100}%`,
                                backgroundColor: item.colour,
                              }}
                            />
                          </div>
                        </div>
                      ));
                    })()}
                    <p className="text-xs text-muted-foreground pt-1">
                      {translateMetricLabel(lang, selectedMetricKey, selectedMetric?.label || '')}{selectedMetricKey.endsWith('_pct') ? '' : ` ${t(lang, "per_game")}`} · {t(lang, "last_n")} {formWindow} avg
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Select players above to compare stats
                  </p>
                )}
              </div>

              {/* Comparison Table by Category */}
              {METRIC_CATEGORIES.map(cat => {
                const catMetrics = cat.metrics.filter(m =>
                  (hasPortalData && portalMetrics[m.key] != null) ||
                  selectedComps.some(cp => cp.metrics[m.key] != null)
                );
                if (catMetrics.length === 0) return null;

                return (
                  <div key={cat.category} className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2">
                      <h4 className="font-semibold text-sm">{translateMetricCategory(lang, cat.category)}</h4>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{translateMetricLabel(lang, 'metric_per_game', 'Metric')} {t(lang, "per_game")}</TableHead>
                          {hasPortalData && (
                            <TableHead>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PORTAL_COLOUR }} />
                                <div>
                                  <div className="text-xs font-medium">{playerName}</div>
                                  <div className="text-[10px] text-muted-foreground">Last {formWindow} avg</div>
                                </div>
                              </div>
                            </TableHead>
                          )}
                          {selectedComps.map(cp => (
                            <TableHead key={cp.id}>
                              <div className="flex items-center gap-1.5">
                                <Avatar className="h-5 w-5">
                                  {cp.image_url ? <AvatarImage src={cp.image_url} /> : null}
                                  <AvatarFallback className="text-[10px]">{cp.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-xs font-medium">{cp.name}</div>
                                  <div className="text-[10px] text-muted-foreground">{cp.club} · {cp.season}</div>
                                </div>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {catMetrics.map(m => (
                          <TableRow key={m.key}>
                            <TableCell className="font-medium text-sm">{translateMetricLabel(lang, m.key, m.label)}</TableCell>
                            {hasPortalData && (
                              <TableCell className="font-semibold">
                                {portalMetrics[m.key] != null ? portalMetrics[m.key]!.toFixed(2) : '-'}
                              </TableCell>
                            )}
                            {selectedComps.map(cp => {
                              const val = cp.metrics[m.key];
                              return <TableCell key={cp.id}>{val?.toFixed(2) ?? '-'}</TableCell>;
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </>
          )}
        </TabsContent>
        {/* Scouting Matrix Tab */}
        <TabsContent value="scouting" className="mt-4">
          <ScoutingComparisonMatrix
            playerName={playerName}
            portalMetrics={portalMetrics}
            hasPortalData={hasPortalData}
            comparisonPlayers={comparisonPlayers}
            selectedPlayerIds={selectedPlayerIds}
            formWindow={formWindow}
          />
        </TabsContent>
        {/* Goals Tab */}
        <TabsContent value="goals" className="mt-4">
          <GoalTracking playerData={playerData} fixtureAnalyses={fixtureAnalyses} formWindow={formWindow} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
