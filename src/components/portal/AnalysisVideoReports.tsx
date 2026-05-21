import { useState, useEffect, useMemo } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Film, ListVideo } from "lucide-react";
import { downloadVideo } from "@/lib/videoDownload";
import { t, translateActionTypeLabel } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";
import { toTitleCase } from "@/lib/titleCase";
import { ClippedActionsPlayer } from "@/components/ClippedActionsPlayer";
import { canonicalActionType } from "@/lib/actionTypeNormaliser";

interface Analysis {
  id: string;
  analysis_date: string;
  opponent: string | null;
  result: string | null;
  minutes_played: number | null;
}

interface ActionClip {
  id: string;
  analysis_id: string;
  action_number: number;
  action_type: string;
  action_description: string | null;
  action_score: number | null;
  minute: number | null;
  video_url: string | null;
  is_successful: boolean | null;
  clip_start: number | null;
  clip_end: number | null;
  notes: string | null;
  opponent?: string;
  match_date?: string;
}

interface Props {
  analyses: Analysis[];
  playerId: string;
  embedded?: boolean;
}

export const AnalysisVideoReports = ({ analyses, playerId, embedded }: Props) => {
  const lang = usePortalLanguage();
  const [allActions, setAllActions] = useState<ActionClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);
  const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([]);
  const [compilationClips, setCompilationClips] = useState<ActionClip[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [savingToBestClips, setSavingToBestClips] = useState<string | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      if (analyses.length === 0) { setLoading(false); return; }
      const ids = analyses.map(a => a.id);
      const { data, error } = await sharedSupabase
        .from('performance_report_actions')
        .select('*')
        .in('analysis_id', ids)
        .not('video_url', 'is', null)
        .order('action_number');
      if (error) { console.error(error); setLoading(false); return; }
      const enriched = (data || []).map((a: any) => {
        const match = analyses.find(an => an.id === a.analysis_id);
        return { ...a, opponent: match?.opponent || 'Unknown', match_date: match?.analysis_date };
      });
      setAllActions(enriched as ActionClip[]);
      setLoading(false);
    };
    fetchActions();
  }, [analyses]);

  const splitActionTypes = (actionType: string | null | undefined): string[] =>
    (actionType || "").split(/[\/,]/).map(type => type.trim()).filter(Boolean);

  const actionTypes = useMemo(
    () => [...new Set(allActions.flatMap(a => splitActionTypes(a.action_type)))].sort((a, b) => a.localeCompare(b)),
    [allActions]
  );

  const bestActions = useMemo(
    () => allActions.filter(a => a.action_score != null && a.action_score >= 0.05),
    [allActions]
  );

  const toggleMatch = (id: string) => {
    setSelectedMatches(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const selectAllMatches = () => setSelectedMatches(analyses.map(a => a.id));
  const toggleActionType = (type: string) => {
    setSelectedActionTypes(prev => prev.includes(type) ? prev.filter(x => x !== type) : [...prev.filter(x => x !== '__best__'), type]);
  };

  const generateCompilation = () => {
    const isBestMode = selectedActionTypes.includes('__best__');
    const clips = allActions.filter(a => {
      if (!selectedMatches.includes(a.analysis_id)) return false;
      if (isBestMode) return a.action_score != null && a.action_score >= 0.05;
      if (selectedActionTypes.length === 0) return true;
      const parts = splitActionTypes(a.action_type);
      return selectedActionTypes.some(s => parts.includes(s));
    }).sort((a, b) => {
      const dateA = a.match_date || '';
      const dateB = b.match_date || '';
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      return a.action_number - b.action_number;
    });
    if (clips.length === 0) { toast.error(t(lang, 'no_clips_match_selection')); return; }
    setCompilationClips(clips);
    setModalOpen(true);
  };

  const generateFullReport = () => {
    setSelectedMatches(analyses.map(a => a.id));
    setSelectedActionTypes([]);
    const clips = allActions.sort((a, b) => {
      const matchA = analyses.find(an => an.id === a.analysis_id);
      const matchB = analyses.find(an => an.id === b.analysis_id);
      const dateA = matchA?.analysis_date || '';
      const dateB = matchB?.analysis_date || '';
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      return a.action_number - b.action_number;
    });
    if (clips.length === 0) { toast.error(t(lang, 'no_clips_available')); return; }
    setCompilationClips(clips);
    setModalOpen(true);
  };

  const handleDownloadCurrent = (clip: any) => {
    const found = compilationClips.find(c => c.id === clip.id);
    if (!found?.video_url) return;
    if (found.clip_start != null && found.clip_end != null) {
      toast.error("This clip is part of a full match file and can't be downloaded directly. Re-export the report to generate standalone clips.");
      return;
    }
    downloadVideo(found.video_url, `clip-${found.action_number}-${found.action_type}`);
    toast.success('Download started');
  };

  const handleDownloadAll = (clips: any[]) => {
    const valid = clips.filter(c => c.video_url && (c.clip_start == null || c.clip_end == null));
    const skipped = clips.length - valid.length;
    if (valid.length === 0) { toast.error('No standalone clips available to download'); return; }
    valid.forEach((c, i) => {
      setTimeout(() => downloadVideo(c.video_url, `clip-${i + 1}-${c.action_type}`), i * 500);
    });
    toast.success(skipped > 0 ? `Downloading ${valid.length} clips (${skipped} skipped — full match)` : `Downloading ${valid.length} clips…`);
  };

  const handleSaveToBestClips = async (clip: any) => {
    const full = compilationClips.find(c => c.id === clip.id);
    if (!full?.video_url) return;
    setSavingToBestClips(clip.id);
    try {
      const { data: playerData, error: fetchErr } = await sharedSupabase
        .from('players')
        .select('highlights')
        .eq('id', playerId)
        .single();
      if (fetchErr) throw fetchErr;
      const highlights = typeof (playerData as any)?.highlights === 'string'
        ? JSON.parse((playerData as any).highlights)
        : (playerData as any)?.highlights || {};
      const bestClips = Array.isArray(highlights.bestClips) ? highlights.bestClips : [];
      if (bestClips.some((c: any) => c.videoUrl === full.video_url)) {
        toast.info('This clip is already in Best Clips');
        setSavingToBestClips(null);
        return;
      }
      bestClips.push({
        name: `${toTitleCase(full.action_type)} vs ${full.opponent}${full.minute != null ? ` (${full.minute}')` : ''}`,
        videoUrl: full.video_url,
        addedAt: new Date().toISOString(),
      });
      const { error: updateErr } = await sharedSupabase
        .from('players')
        .update({ highlights: { ...highlights, bestClips } })
        .eq('id', playerId);
      if (updateErr) throw updateErr;
      toast.success('Saved to Best Clips');
    } catch (err: any) {
      toast.error('Failed to save: ' + (err.message || 'Unknown error'));
    }
    setSavingToBestClips(null);
  };

  const playerClips = useMemo(() => compilationClips.map(c => ({
    id: c.id,
    action_number: c.action_number,
    action_type: c.action_type,
    action_description: c.action_description || '',
    video_url: c.video_url || '',
    minute: c.minute ?? 0,
    notes: c.notes,
    clip_start: c.clip_start,
    clip_end: c.clip_end,
  })), [compilationClips]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">{t(lang, "video_reports_loading_clips")}</div>
      ) : allActions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">{t(lang, "video_reports_no_clips")}</div>
      ) : (
        <>
          {/* Step 1: Action types */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">{t(lang, "video_reports_step_select_action_types")}</h3>
            <div className="flex flex-wrap gap-2">
              {bestActions.length > 0 && (
                <button
                  onClick={() => setSelectedActionTypes(prev => prev.includes('__best__') ? prev.filter(x => x !== '__best__') : ['__best__'])}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    selectedActionTypes.includes('__best__') ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
                  }`}
                >
                  Best Actions ({bestActions.length})
                </button>
              )}
              {actionTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleActionType(type)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    selectedActionTypes.includes(type) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
                  }`}
                >
                  {translateActionTypeLabel(lang, type)}
                </button>
              ))}
              {selectedActionTypes.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedActionTypes([])}>{t(lang, "clear_filters")}</Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t(lang, "video_reports_leave_empty_action_types")}</p>
          </div>

          {/* Step 2: Matches */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider">{t(lang, "video_reports_step_select_matches")}</h3>
              <Button variant="ghost" size="sm" onClick={selectAllMatches}>{t(lang, "select_all_label")}</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {analyses.filter(a => allActions.some(ac => ac.analysis_id === a.id)).map(a => (
                <button
                  key={a.id}
                  onClick={() => toggleMatch(a.id)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    selectedMatches.includes(a.id) ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
                  }`}
                >
                  {a.opponent ? `${t(lang, "versus_short")} ${a.opponent}` : new Date(a.analysis_date).toLocaleDateString('en-GB')}
                  {a.result && <span className="ml-1 opacity-70">({a.result})</span>}
                </button>
              ))}
            </div>
          </div>

          {selectedMatches.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              <Button onClick={generateCompilation}>
                <Film className="w-4 h-4 mr-2" /> {t(lang, "watch_selected")}
              </Button>
              <Button variant="outline" onClick={generateFullReport}>
                <ListVideo className="w-4 h-4 mr-2" /> {t(lang, "full_action_report_video")}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Shared player — match-report parity */}
      <ClippedActionsPlayer
        open={modalOpen}
        onOpenChange={setModalOpen}
        clips={playerClips}
        title="Video Report"
        language={lang}
        showDownloads
        onDownloadCurrent={handleDownloadCurrent}
        onDownloadAll={handleDownloadAll}
        onSaveToBest={handleSaveToBestClips}
        savingClipId={savingToBestClips}
      />
    </div>
  );
};
