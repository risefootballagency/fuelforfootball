import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useProductivityTimer } from "@/hooks/useProductivityTimer";
import { createPortal } from "react-dom";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { Input } from "@/components/ui/input";
import { X, Search, Maximize, ChevronLeft, ChevronRight, Crosshair, Move } from "lucide-react";
import { toast } from "sonner";
import { XGPitchMap } from "@/components/staff/XGPitchMap";
import { BoxZoneMap } from "@/components/staff/BoxZoneMap";
import { useVideoPreloader } from "@/hooks/useVideoPreloader";
import { parseMinuteToSeconds } from "@/lib/actionSorting";
import { getPlaybackInstruction } from "@/lib/clipVideoUtils";

interface ScoreEditModeProps {
  analysisId: string;
  playerName: string;
  onClose: () => void;
  onSave?: () => void;
}

interface Action {
  id: string;
  action_type: string;
  action_score: string;
  minute: string;
  video_url: string;
  action_number: number;
  clip_start: number | null;
  clip_end: number | null;
}

interface R90Score {
  id: string;
  category: string;
  title: string;
  score: string;
}

const OFFENSIVE_TYPES = new Set([
  "shot", "shots", "goal", "goals", "assist", "assists",
  "dribble", "dribbles", "take on", "take ons", "take-on",
  "cross", "crosses", "crossing", "through ball", "through balls",
  "key pass", "key passes", "chance created", "chances created",
  "pass into final third", "progressive pass", "progressive passes",
  "attacking cross", "attacking crosses",
]);

const DEFENSIVE_TYPES = new Set([
  "tackle", "tackles", "interception", "interceptions",
  "clearance", "clearances", "block", "blocks", "blocked",
  "recovery", "recoveries", "ball recovery",
  "applied pressure", "applied pressures", "pressure",
  "aerial duel", "aerial duels", "ground duel", "ground duels",
  "defensive action", "defensive actions",
]);

function classifyAction(type: string): "offensive" | "defensive" | "other" {
  const lower = (type || '').toLowerCase().trim();
  if (OFFENSIVE_TYPES.has(lower)) return "offensive";
  if (DEFENSIVE_TYPES.has(lower)) return "defensive";
  return "other";
}

function smartSortActions(actions: Action[]): Action[] {
  if (actions.length === 0) return actions;
  const allHaveType = actions.every(a => a.action_type && a.action_type.trim() !== "");
  if (!allHaveType) return actions;

  const withTime = actions.map(a => ({ ...a, seconds: parseMinuteToSeconds(a.minute) }));
  const byTime = [...withTime].sort((a, b) => a.seconds - b.seconds);

  type ActionWithTime = Action & { seconds: number };
  const clusters: ActionWithTime[][] = [];
  let currentCluster: ActionWithTime[] = [];

  for (const action of byTime) {
    if (currentCluster.length === 0) {
      currentCluster.push(action);
    } else {
      const lastTime = currentCluster[currentCluster.length - 1].seconds;
      if (action.seconds !== Infinity && lastTime !== Infinity && Math.abs(action.seconds - lastTime) <= 10) {
        currentCluster.push(action);
      } else {
        clusters.push(currentCluster);
        currentCluster = [action];
      }
    }
  }
  if (currentCluster.length > 0) clusters.push(currentCluster);

  const classPriority = { offensive: 0, defensive: 1, other: 2 };

  const singleClusters: ActionWithTime[] = clusters.filter(c => c.length === 1).map(c => c[0]);
  const multiClusters: ActionWithTime[][] = clusters.filter(c => c.length > 1);

  singleClusters.sort((a, b) => {
    const ca = classifyAction(a.action_type);
    const cb = classifyAction(b.action_type);
    if (classPriority[ca] !== classPriority[cb]) return classPriority[ca] - classPriority[cb];
    const typeCompare = a.action_type.localeCompare(b.action_type);
    if (typeCompare !== 0) return typeCompare;
    return a.seconds - b.seconds;
  });

  const classifyCluster = (cluster: ActionWithTime[]): "offensive" | "defensive" | "other" => {
    const classes = cluster.map(a => classifyAction(a.action_type));
    if (classes.includes("offensive")) return "offensive";
    if (classes.includes("defensive")) return "defensive";
    return "other";
  };

  multiClusters.sort((a, b) => {
    const ca = classifyCluster(a);
    const cb = classifyCluster(b);
    if (classPriority[ca] !== classPriority[cb]) return classPriority[ca] - classPriority[cb];
    return a[0].seconds - b[0].seconds;
  });

  const result: Action[] = [];
  const typeGroups: Map<string, ActionWithTime[]> = new Map();
  for (const a of singleClusters) {
    const key = a.action_type;
    if (!typeGroups.has(key)) typeGroups.set(key, []);
    typeGroups.get(key)!.push(a);
  }

  const orderedTypes = [...typeGroups.entries()].sort((a, b) => {
    const ca = classifyAction(a[0]);
    const cb = classifyAction(b[0]);
    if (classPriority[ca] !== classPriority[cb]) return classPriority[ca] - classPriority[cb];
    return a[0].localeCompare(b[0]);
  });

  for (const [, group] of orderedTypes) result.push(...group);
  for (const cluster of multiClusters) result.push(...cluster);

  return result;
}

export const ScoreEditMode = ({ analysisId, playerName, onClose, onSave }: ScoreEditModeProps) => {
  const [actions, setActions] = useState<Action[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingWriteCount, setPendingWriteCount] = useState(0);
  const [r90Scores, setR90Scores] = useState<R90Score[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<R90Score[]>([]);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [pendingScore, setPendingScore] = useState<string | null>(null);
  const [sidePanel, setSidePanel] = useState<"shot" | "movement" | null>(null);
  const [panelSide, setPanelSide] = useState<"left" | "right">("left");
  const searchRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const clipIntervalsRef = useRef<(number | null)[]>([null, null, null, null]);

  useEffect(() => {
    const fetchData = async () => {
      const [actionsRes, scoresRes] = await Promise.all([
        supabase
          .from("performance_report_actions")
          .select("id, action_type, action_score, minute, video_url, action_number, clip_start, clip_end")
          .eq("analysis_id", analysisId)
          .not("video_url", "is", null)
          .order("action_number", { ascending: true }),
        supabase
          .from("r90_ratings")
          .select("id, category, title, score")
          .order("category"),
      ]);
      const rawActions = (actionsRes.data || []) as unknown as Action[];
      setActions(smartSortActions(rawActions));
      setR90Scores((scoresRes.data || []) as unknown as R90Score[]);
      setLoading(false);
    };
    fetchData();
  }, [analysisId]);

  const pageActions = useMemo(() => actions.slice(pageIndex * 4, pageIndex * 4 + 4), [actions, pageIndex]);
  const totalPages = Math.ceil(actions.length / 4);
  const scoredCount = actions.filter(a => a.action_score != null && String(a.action_score) !== "").length;
  const completionPct = actions.length > 0 ? Math.round((scoredCount / actions.length) * 100) : 0;
  const { message: timerMessage } = useProductivityTimer({ totalActions: actions.length, scoredCount });

  const allVideoUrls = useMemo(() => {
    return actions.map(a => {
      const instr = getPlaybackInstruction(a);
      return instr.mode !== 'blocked' ? instr.src : null;
    }).filter(Boolean) as string[];
  }, [actions]);
  const { preloadNextVideos } = useVideoPreloader({ videos: allVideoUrls, preloadCount: 4, enabled: true });

  useEffect(() => {
    const currentLastIndex = (pageIndex + 1) * 4 - 1;
    preloadNextVideos(currentLastIndex);
  }, [pageIndex, preloadNextVideos]);

  useEffect(() => {
    clipIntervalsRef.current.forEach(id => { if (id) clearInterval(id); });
    clipIntervalsRef.current = [null, null, null, null];

    pageActions.forEach((action, i) => {
      const instruction = getPlaybackInstruction(action);
      if (instruction.mode !== 'clipped') return;
      const { clipStart, clipEnd } = instruction;
      const vid = videoRefs.current[i];
      if (vid) {
        const onLoaded = () => { vid.currentTime = clipStart; vid.play().catch(() => {}); };
        if (vid.readyState >= 2) vid.currentTime = clipStart;
        else vid.addEventListener('loadeddata', onLoaded, { once: true });
      }
      clipIntervalsRef.current[i] = window.setInterval(() => {
        const v = videoRefs.current[i];
        if (!v) return;
        if (v.currentTime >= clipEnd) v.currentTime = clipStart;
        if (v.currentTime < clipStart - 0.5) v.currentTime = clipStart;
      }, 100);
    });

    return () => { clipIntervalsRef.current.forEach(id => { if (id) clearInterval(id); }); };
  }, [pageActions]);

  const lastAutoAdvanceSignatureRef = useRef("");

  const handleUpdateReport = useCallback(async () => {
    const updates = actions.filter(a => a.action_score != null && String(a.action_score) !== "").map(a =>
      supabase.from("performance_report_actions").update({ action_score: String(a.action_score) } as any).eq("id", a.id)
    );
    await Promise.all(updates);
    toast.success("Report updated");
  }, [actions]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; document.documentElement.style.overflow = prevHtml; };
  }, []);

  useEffect(() => {
    if (activeActionId && !pageActions.some(a => a.id === activeActionId)) setActiveActionId(null);
  }, [activeActionId, pageActions]);

  useEffect(() => { lastAutoAdvanceSignatureRef.current = ""; }, [pageIndex]);

  useEffect(() => {
    if (activeActionId || pendingWriteCount > 0 || pageActions.length === 0) return;
    if (!pageActions.every(a => a.action_score != null && String(a.action_score) !== "")) return;
    const signature = pageActions.map(a => `${a.id}:${a.action_score}`).join('|');
    if (lastAutoAdvanceSignatureRef.current === signature) return;
    lastAutoAdvanceSignatureRef.current = signature;
    const timer = setTimeout(() => {
      if (pageIndex < totalPages - 1) {
        toast.success("Autosaved, moving to next 4 clips");
        setPageIndex(p => p + 1);
      } else {
        toast.success("All clips scored — autosaved");
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [activeActionId, pageActions, pageIndex, pendingWriteCount, totalPages]);

  const handleScoreChange = useCallback(async (actionId: string, score: string) => {
    setActions(prev => prev.map(a => a.id === actionId ? { ...a, action_score: score } : a));
    setPendingWriteCount(count => count + 1);
    const { error } = await supabase
      .from("performance_report_actions")
      .update({ action_score: score } as any)
      .eq("id", actionId);
    if (error) toast.error("Failed to save action score");
    setPendingWriteCount(count => Math.max(0, count - 1));
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); return; }
    const q = query.toLowerCase();
    setSearchResults(r90Scores.filter(s =>
      s.title?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q) || s.score?.toString().includes(q)
    ).slice(0, 16));
  }, [r90Scores]);

  const queueSelectedScore = useCallback((score: string) => {
    setPendingScore(score);
    setSearchQuery("");
    setSearchResults([]);
    setSidePanel(null);
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleFullscreen = (index: number) => {
    const video = videoRefs.current[index];
    if (video) video.requestFullscreen?.();
  };

  const getScoreColor = (score: string) => {
    const n = parseFloat(score);
    if (isNaN(n)) return "bg-muted";
    if (n < 0) return "bg-red-950";
    if (n < 0.4) return "bg-red-600";
    if (n < 0.8) return "bg-orange-500";
    if (n < 1.0) return "bg-yellow-400";
    if (n < 1.4) return "bg-lime-400";
    if (n < 1.8) return "bg-green-500";
    return "bg-green-700";
  };

  const getCornerStackPosition = (i: number) => {
    switch (i) {
      case 0: return "top-1 left-1";
      case 1: return "top-1 right-1";
      case 2: return "bottom-1 left-1";
      case 3: return "bottom-1 right-1";
      default: return "top-1 left-1";
    }
  };

  const getCornerStackAlignment = (i: number) => (i === 0 || i === 2) ? "items-start" : "items-end";
  const getCornerStackDirection = (i: number) => (i < 2 ? "flex-col" : "flex-col-reverse");

  const getScorePosition = (i: number) => {
    switch (i) {
      case 0: return "bottom-[28px] right-2";
      case 1: return "bottom-[28px] left-2";
      case 2: return "top-[28px] right-2";
      case 3: return "top-[28px] left-2";
      default: return "bottom-[28px] right-2";
    }
  };

  if (loading) {
    return createPortal(
      <div className="fixed inset-0 z-[1000] bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading clips...</p>
      </div>,
      document.body
    );
  }

  const overlayContent = (
    <div className="fixed inset-0 z-[1000] bg-background text-foreground">
      {/* Top centre: progress bar + update button */}
      <div className="absolute top-2 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 shadow-lg backdrop-blur-sm">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${completionPct < 30 ? "bg-destructive" : completionPct < 70 ? "bg-accent" : "bg-primary"}`}
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <span className="text-xs font-medium">{completionPct}%</span>
          <span className="text-[10px] text-muted-foreground">Page {pageIndex + 1}/{totalPages}</span>
          {timerMessage && <span className="text-[10px] font-medium text-accent ml-1">{timerMessage}</span>}
        </div>
        <button
          onClick={handleUpdateReport}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
          title="Update report"
        >
          U
        </button>
      </div>

      {/* Close button */}
      <button onClick={onClose} className="absolute top-2 right-2 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 border border-border shadow-lg backdrop-blur-sm text-foreground hover:bg-destructive hover:text-white transition-colors">
        <X className="h-4 w-4" />
      </button>

      {/* Navigation */}
      {pageIndex > 0 && (
        <button onClick={() => setPageIndex(p => p - 1)} className="absolute left-2 top-1/2 z-40 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 border border-border shadow-lg backdrop-blur-sm text-foreground hover:bg-muted transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {pageIndex < totalPages - 1 && (
        <button onClick={() => setPageIndex(p => p + 1)} className="absolute right-2 top-1/2 z-40 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 border border-border shadow-lg backdrop-blur-sm text-foreground hover:bg-muted transition-colors">
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* 2x2 Grid */}
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
        {pageActions.map((action, i) => {
          const instruction = getPlaybackInstruction(action);
          const isActive = activeActionId === action.id;

          return (
            <div key={action.id} className={`relative overflow-hidden bg-black ${isActive ? 'ring-2 ring-accent' : ''}`}>
              {instruction.mode !== 'blocked' && (
                <video
                  ref={el => { videoRefs.current[i] = el; }}
                  src={instruction.src}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  autoPlay
                  loop={instruction.mode === 'standalone'}
                  playsInline
                />
              )}

              {/* Corner info */}
              <div className={`absolute ${getCornerStackPosition(i)} z-10 flex ${getCornerStackDirection(i)} ${getCornerStackAlignment(i)} gap-0.5 max-w-[45%]`}>
                <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white truncate">
                  {action.action_type || '—'}
                </span>
                <span className="rounded bg-black/50 px-1 py-0.5 text-[9px] text-white/70">
                  {action.minute}'
                </span>
                {action.action_score && (
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${getScoreColor(action.action_score)}`}>
                    {action.action_score}
                  </span>
                )}
              </div>

              {/* Score input area */}
              <div className={`absolute ${getScorePosition(i)} z-20`}>
                <div className="flex gap-1">
                  {pendingScore && (
                    <button
                      onClick={() => {
                        handleScoreChange(action.id, pendingScore);
                        setPendingScore(null);
                      }}
                      className="rounded bg-accent px-2 py-1 text-xs font-bold text-black shadow-lg hover:bg-accent/80 transition-colors"
                    >
                      {pendingScore}
                    </button>
                  )}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
                    const score = (n * 0.2).toFixed(1);
                    return (
                      <button
                        key={n}
                        onClick={() => handleScoreChange(action.id, score)}
                        className="h-6 w-6 rounded bg-black/60 text-[10px] font-bold text-white hover:bg-accent hover:text-black transition-colors"
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fullscreen button */}
              <button
                onClick={() => handleFullscreen(i)}
                className="absolute bottom-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded bg-black/50 text-white/70 hover:text-white transition-colors"
              >
                <Maximize className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Central search */}
      <div ref={searchRef} className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 w-72">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search R90 ratings..."
            className="h-8 pl-8 text-xs bg-background/90 backdrop-blur-sm border-border"
          />
        </div>
        {searchResults.length > 0 && (
          <div className="absolute bottom-full mb-1 w-full max-h-48 overflow-y-auto rounded-lg border border-border bg-background/95 backdrop-blur-sm shadow-xl">
            {searchResults.map(s => (
              <button
                key={s.id}
                onClick={() => queueSelectedScore(s.score)}
                className="flex w-full items-center justify-between px-3 py-1.5 text-xs hover:bg-muted transition-colors"
              >
                <span className="truncate">{s.title}</span>
                <span className="ml-2 font-bold text-accent">{s.score}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
};
