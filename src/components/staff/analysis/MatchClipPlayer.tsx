import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { X, SkipForward, SkipBack, Maximize, Minimize, Play, Pause, ChevronDown, ChevronUp, Pencil, ArrowUpDown, ListOrdered, Layers } from "lucide-react";
import { getPlaybackInstruction } from "@/lib/clipVideoUtils";
import { AnnotationToolbar } from "@/components/staff/annotations/AnnotationToolbar";
import { AnnotationCanvas } from "@/components/staff/annotations/AnnotationCanvas";
import { AnnotationElement } from "@/components/staff/annotations/AnnotationProjects";
import { AnnotationTool } from "@/components/staff/annotations/AnnotationEditor";
import { useIsMobile } from "@/hooks/use-mobile";

interface MatchClipPlayerProps {
  analysisId: string;
  playerName: string;
  opponent: string;
  onClose: () => void;
}

interface ClipAction {
  id: string;
  action_type: string;
  action_score: string;
  minute: string;
  description: string;
  video_url: string;
  clip_start: number | null;
  clip_end: number | null;
}

const getScoreColor = (score: string) => {
  const n = parseFloat(score);
  if (isNaN(n)) return "bg-muted";
  if (n < 0) return "bg-[hsl(0,84%,30%)]";
  if (n < 0.2) return "bg-[hsl(0,84%,45%)]";
  if (n < 0.4) return "bg-[hsl(0,84%,60%)]";
  if (n < 0.6) return "bg-[hsl(25,75%,45%)]";
  if (n < 0.8) return "bg-[hsl(40,85%,50%)]";
  if (n < 1.0) return "bg-[hsl(60,70%,50%)]";
  if (n < 1.2) return "bg-[hsl(142,76%,36%)]";
  if (n < 1.4) return "bg-[hsl(142,70%,40%)]";
  if (n < 1.6) return "bg-[hsl(142,65%,45%)]";
  if (n < 1.8) return "bg-[hsl(142,70%,50%)]";
  if (n < 2.2) return "bg-[hsl(142,76%,55%)]";
  return "bg-accent";
};

const ACTION_CATEGORY_RULES: { group: string; patterns: string[] }[] = [
  { group: 'Key Actions', patterns: ['goal', 'assist', 'key pass', 'penalty', 'big chance', 'chance created'] },
  { group: 'Passing', patterns: ['pass', 'through ball', 'ball retention', 'switch', 'distribution'] },
  { group: 'Movement', patterns: ['offer', 'movement', 'run', 'carry', 'progressive carry', 'rotation'] },
  { group: 'Shooting', patterns: ['shot', 'headed shot', 'shot assist', 'shot blocked'] },
  { group: 'Crossing & Wide Play', patterns: ['cross', 'attacking cross', 'front post', 'back post', 'wide', 'overlap'] },
  { group: 'Pressing & Pressure', patterns: ['press', 'applied pressure', 'defensive positioning', 'closing down'] },
  { group: 'Regains & Interceptions', patterns: ['regain', 'interception', 'recovery', 'ball recovery', 'turnover won'] },
  { group: 'Defending', patterns: ['tackle', 'clearance', 'block', 'header', 'duel', 'aerial', 'defensive'] },
  { group: 'Dribbling', patterns: ['dribble', 'take on', 'take-on', 'skill'] },
];

const GROUP_ORDER = [
  'Key Actions', 'Passing', 'Movement', 'Shooting', 'Crossing & Wide Play',
  'Pressing & Pressure', 'Regains & Interceptions', 'Defending', 'Dribbling', 'Other'
];

function getActionGroup(type: string): string {
  const lower = (type || '').toLowerCase();
  for (const rule of ACTION_CATEGORY_RULES) {
    if (rule.patterns.some(p => lower.includes(p))) return rule.group;
  }
  return 'Other';
}

type SortMode = 'match' | 'score' | 'type';

export const MatchClipPlayer = ({ analysisId, playerName, opponent, onClose }: MatchClipPlayerProps) => {
  const [clips, setClips] = useState<ClipAction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showClipList, setShowClipList] = useState(false);
  const [clipListSort, setClipListSort] = useState<SortMode>('match');
  const videoRef = useRef<HTMLVideoElement>(null);
  const clipEnforcementRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [drawingMode, setDrawingMode] = useState(false);
  const [activeTool, setActiveTool] = useState<AnnotationTool>('arrow');
  const [activeColor, setActiveColor] = useState('hsl(var(--accent))');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [fillOpacity, setFillOpacity] = useState(0.3);
  const [elements, setElements] = useState<AnnotationElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [linkSource, setLinkSource] = useState<string | null>(null);

  useEffect(() => {
    const fetchClips = async () => {
      const { data, error } = await supabase
        .from("performance_report_actions")
        .select("id, action_type, action_score, minute, notes, video_url, clip_start, clip_end")
        .eq("analysis_id", analysisId)
        .not("video_url", "is", null)
        .order("action_number", { ascending: true });

      if (error) console.error("Clip fetch error:", error);
      setClips((data || []).map((c: any) => ({ ...c, description: c.notes || '' })).filter((c: any) => c.video_url));
      setLoading(false);
    };
    fetchClips();
  }, [analysisId]);

  useEffect(() => {
    return () => {
      if (clipEnforcementRef.current) clearInterval(clipEnforcementRef.current);
    };
  }, []);

  const currentClip = clips[currentIndex];

  const avgScoreForType = useMemo(() => {
    if (!currentClip?.action_type) return null;
    const currentType = (currentClip.action_type || '').toLowerCase();
    if (!currentType) return null;
    const matching = clips.filter(c => {
      const t = (c.action_type || '').toLowerCase();
      return t === currentType || t.includes(currentType) || currentType.includes(t);
    });
    if (matching.length === 0) return null;
    const scores = matching.map(c => parseFloat(String(c.action_score))).filter(n => !isNaN(n));
    if (scores.length === 0) return null;
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
  }, [currentClip, clips]);

  const sortedClipIndices = useMemo(() => {
    const indices = clips.map((_, i) => i);
    if (clipListSort === 'score') {
      return [...indices].sort((a, b) => {
        const sa = parseFloat(String(clips[b].action_score)) || -999;
        const sb = parseFloat(String(clips[a].action_score)) || -999;
        return sa - sb;
      });
    }
    if (clipListSort === 'type') {
      return [...indices].sort((a, b) => {
        const ga = GROUP_ORDER.indexOf(getActionGroup(clips[a].action_type));
        const gb = GROUP_ORDER.indexOf(getActionGroup(clips[b].action_type));
        if (ga !== gb) return ga - gb;
        return a - b;
      });
    }
    return indices;
  }, [clips, clipListSort]);

  const clearAnnotations = useCallback(() => {
    setElements([]);
    setSelectedId(null);
    setDrawingMode(false);
  }, []);

  const startEnforcement = useCallback((start: number, end: number) => {
    if (clipEnforcementRef.current) clearInterval(clipEnforcementRef.current);
    clipEnforcementRef.current = window.setInterval(() => {
      const vid = videoRef.current;
      if (!vid) return;
      if (vid.currentTime >= end) vid.currentTime = start;
      if (vid.currentTime < start - 0.5) vid.currentTime = start;
    }, 100);
  }, []);

  const goToClip = useCallback((index: number) => {
    if (clipEnforcementRef.current) clearInterval(clipEnforcementRef.current);
    setCurrentIndex(index);
    setElements([]);
    setSelectedId(null);
    setDrawingMode(false);
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (drawingMode && !vid.paused) {
      vid.pause();
      setIsPlaying(false);
    }
  }, [drawingMode]);

  useEffect(() => {
    const vid = videoRef.current;
    const clip = currentClip;
    if (!vid || !clip) return;

    const instruction = getPlaybackInstruction(clip);
    if (instruction.mode === 'blocked') return;

    vid.src = instruction.src;
    vid.load();

    const onLoaded = () => {
      if (instruction.mode === 'clipped') {
        vid.currentTime = instruction.clipStart;
        startEnforcement(instruction.clipStart, instruction.clipEnd);
      }
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    };

    vid.addEventListener('loadeddata', onLoaded, { once: true });
    return () => vid.removeEventListener('loadeddata', onLoaded);
  }, [currentClip, startEnforcement]);

  const handleVideoEnded = useCallback(() => {
    const vid = videoRef.current;
    const clip = currentClip;
    if (!vid || !clip) return;
    const instruction = getPlaybackInstruction(clip);
    if (instruction.mode === 'clipped') {
      vid.currentTime = instruction.clipStart;
    } else {
      vid.currentTime = 0;
    }
    vid.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [currentClip]);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    } else {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      e.preventDefault();
      if (elements.length > 0) {
        clearAnnotations();
        const vid = videoRef.current;
        if (vid && vid.paused) {
          vid.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    };
    el.addEventListener('contextmenu', handler);
    return () => el.removeEventListener('contextmenu', handler);
  }, [elements.length, clearAnnotations]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setZoom(prev => {
        const next = prev + (e.deltaY < 0 ? 0.2 : -0.2);
        return Math.min(Math.max(next, 1), 5);
      });
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const handleVideoAreaClick = useCallback((e: React.MouseEvent) => {
    if (drawingMode) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) return;
    
    const vid = videoRef.current;
    if (vid && !vid.paused) {
      vid.pause();
      setIsPlaying(false);
    }
    setDrawingMode(true);
  }, [drawingMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (elements.length > 0 || drawingMode) {
          clearAnnotations();
          const vid = videoRef.current;
          if (vid && vid.paused) {
            vid.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        } else {
          onClose();
        }
        return;
      }
      if (e.key === ' ') { e.preventDefault(); togglePlay(); return; }
      if (e.key === 'ArrowRight' && currentIndex < clips.length - 1) goToClip(currentIndex + 1);
      if (e.key === 'ArrowLeft' && currentIndex > 0) goToClip(currentIndex - 1);
      if (e.key === 'd' || e.key === 'D') {
        setDrawingMode(prev => {
          if (prev) { setElements([]); setSelectedId(null); }
          return !prev;
        });
      }
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedId && drawingMode) {
        e.preventDefault();
        setElements(prev => prev.filter(el => el.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, clips.length, goToClip, togglePlay, onClose, elements.length, drawingMode, clearAnnotations, selectedId]);

  const handleToolUsed = useCallback(() => {
    setActiveTool('select');
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (loading) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-[#0a0c10] flex items-center justify-center">
        <div className="text-white/60 text-sm animate-pulse">Loading clips...</div>
      </div>,
      document.body
    );
  }

  if (clips.length === 0) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-[#0a0c10] flex flex-col items-center justify-center gap-4">
        <p className="text-white/60">No clips available for this report.</p>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-[#0a0c10] flex flex-col" style={{ overflow: 'hidden' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-[#12151c] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-1.5 h-5 rounded-full bg-accent shrink-0" />
          <div className="truncate">
            <span className="text-white text-sm font-medium">{playerName}</span>
            <span className="text-white/30 mx-1 md:mx-2">vs</span>
            <span className="text-white/70 text-sm">{opponent}</span>
          </div>
          <span className="text-white/20 text-xs shrink-0">
            {currentIndex + 1}/{clips.length}
          </span>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1">
          <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            disabled={currentIndex === 0} onClick={() => goToClip(currentIndex - 1)}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            onClick={togglePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            disabled={currentIndex >= clips.length - 1} onClick={() => goToClip(currentIndex + 1)}>
            <SkipForward className="h-4 w-4" />
          </Button>

          {!isMobile && (
            <>
              <div className="w-px h-5 bg-white/10 mx-0.5" />
              <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="text-accent hover:text-accent hover:bg-accent/10 h-8 w-8 p-0 ml-0.5"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {drawingMode && !isMobile && (
          <AnnotationToolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            activeColor={activeColor}
            setActiveColor={setActiveColor}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
            fillOpacity={fillOpacity}
            setFillOpacity={setFillOpacity}
          />
        )}

        <div
          className="flex-1 relative flex items-center justify-center bg-[#0a0c10] min-h-0 overflow-hidden cursor-crosshair"
          onClick={handleVideoAreaClick}
        >
          {currentClip && (
            <>
              <div className="relative w-full aspect-video max-h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
                <video
                  ref={videoRef}
                  key={currentClip.id}
                  onEnded={handleVideoEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-fill block"
                  playsInline
                />

                {drawingMode && (
                  <div className="absolute inset-0">
                    <AnnotationCanvas
                      elements={elements}
                      setElements={setElements}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      activeTool={activeTool}
                      activeColor={activeColor}
                      strokeWidth={strokeWidth}
                      fillOpacity={fillOpacity}
                      onToolUsed={handleToolUsed}
                      linkSource={linkSource}
                      setLinkSource={setLinkSource}
                      videoRef={videoRef}
                    />
                  </div>
                )}
              </div>

              {/* Action info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 md:p-4">
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/60 text-xs">{currentClip.minute}'</span>
                      <span className="text-white text-sm font-medium truncate">{currentClip.action_type}</span>
                      {currentClip.action_score && (
                        <span className={`text-xs px-1.5 py-0.5 rounded text-white font-bold ${getScoreColor(currentClip.action_score)}`}>
                          {currentClip.action_score}
                        </span>
                      )}
                    </div>
                    {currentClip.description && (
                      <p className="text-white/50 text-xs line-clamp-2">{currentClip.description}</p>
                    )}
                    {avgScoreForType && (
                      <p className="text-accent text-[10px] mt-1">
                        Avg {currentClip.action_type}: {avgScoreForType}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0"
                      onClick={(e) => { e.stopPropagation(); setShowClipList(!showClipList); }}>
                      {showClipList ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </Button>
                    {drawingMode && (
                      <Button size="sm" variant="ghost" className="text-accent hover:text-accent h-8 w-8 p-0"
                        onClick={(e) => { e.stopPropagation(); clearAnnotations(); const vid = videoRef.current; if (vid && vid.paused) vid.play().then(() => setIsPlaying(true)).catch(() => {}); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Clip list panel */}
      {showClipList && (
        <div className="bg-[#12151c] border-t border-white/5 max-h-[35vh] overflow-y-auto shrink-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
            <span className="text-white/60 text-xs font-medium">Clips</span>
            <div className="flex items-center gap-1">
              {(['match', 'score', 'type'] as SortMode[]).map(mode => (
                <Button key={mode} size="sm" variant={clipListSort === mode ? "secondary" : "ghost"}
                  className="h-6 px-2 text-[10px]" onClick={() => setClipListSort(mode)}>
                  {mode === 'match' ? <ListOrdered className="h-3 w-3" /> : mode === 'score' ? <ArrowUpDown className="h-3 w-3" /> : <Layers className="h-3 w-3" />}
                </Button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {sortedClipIndices.map((origIdx) => {
              const clip = clips[origIdx];
              return (
                <button
                  key={clip.id}
                  onClick={() => { goToClip(origIdx); setShowClipList(false); }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors ${origIdx === currentIndex ? 'bg-white/10' : ''}`}
                >
                  <span className="text-white/30 text-xs w-6 text-right shrink-0">{clip.minute}'</span>
                  <span className="text-white text-xs truncate flex-1">{clip.action_type}</span>
                  {clip.action_score && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded text-white font-bold shrink-0 ${getScoreColor(clip.action_score)}`}>
                      {clip.action_score}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};
