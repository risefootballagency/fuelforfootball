import { useState, useEffect } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Play, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ActionVideoPopup } from "@/components/ActionVideoPopup";

interface Analysis {
  id: string;
  analysis_date: string;
  opponent: string | null;
  result: string | null;
  minutes_played: number | null;
}

interface VideoClip {
  id: string;
  analysis_id: string;
  action_type: string | null;
  action_description: string | null;
  minute: number | null;
  action_score: number | null;
  video_url: string;
  opponent: string | null;
  analysis_date: string;
}

interface Props {
  analyses: Analysis[];
  playerId: string;
  embedded?: boolean;
}

export const AnalysisVideoReports = ({ analyses, playerId, embedded }: Props) => {
  const [loading, setLoading] = useState(true);
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchClips = async () => {
      const analysisIds = analyses.map(a => a.id);
      if (analysisIds.length === 0) { setLoading(false); return; }

      const { data } = await sharedSupabase
        .from("performance_report_actions")
        .select("id, analysis_id, action_type, action_description, minute, action_score, video_url")
        .in("analysis_id", analysisIds)
        .not("video_url", "is", null)
        .order("minute", { ascending: true });

      const enriched: VideoClip[] = (data || []).map(clip => {
        const match = analyses.find(a => a.id === clip.analysis_id);
        return {
          ...clip,
          video_url: clip.video_url!,
          opponent: match?.opponent || "Unknown",
          analysis_date: match?.analysis_date || "",
        };
      });

      setClips(enriched);
      setLoading(false);
    };
    fetchClips();
  }, [analyses]);

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  if (clips.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <Film className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No video clips available yet.
      </div>
    );
  }

  // Group by match
  const grouped = clips.reduce<Record<string, VideoClip[]>>((acc, clip) => {
    const key = clip.analysis_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(clip);
    return acc;
  }, {});

  const matchEntries = Object.entries(grouped).sort((a, b) => {
    const dateA = a[1][0]?.analysis_date || "";
    const dateB = b[1][0]?.analysis_date || "";
    return dateB.localeCompare(dateA);
  });

  const displayedEntries = expanded ? matchEntries : matchEntries.slice(0, 3);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {clips.length} clips across {matchEntries.length} matches
      </p>

      {displayedEntries.map(([analysisId, matchClips]) => (
        <Card key={analysisId}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">
                  vs {matchClips[0].opponent}
                </p>
                <p className="text-xs text-muted-foreground">
                  {matchClips[0].analysis_date ? format(new Date(matchClips[0].analysis_date), "dd MMM yyyy") : ""}
                  {" · "}{matchClips.length} clips
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {matchClips.map((clip) => (
                <button
                  key={clip.id}
                  onClick={() => setActiveVideo(clip.video_url)}
                  className="flex items-center gap-1.5 p-2 rounded bg-muted/50 hover:bg-muted transition-colors text-left"
                >
                  <Play className="h-3 w-3 text-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate text-foreground">
                      {clip.action_type || "Action"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {clip.minute != null ? `${clip.minute}'` : ""}
                      {clip.action_score != null ? ` · ${clip.action_score}` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {matchEntries.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 text-xs text-accent hover:text-accent/80 py-1"
        >
          {expanded ? <><ChevronUp className="h-3 w-3" /> Show Less</> : <><ChevronDown className="h-3 w-3" /> Show All ({matchEntries.length} matches)</>}
        </button>
      )}

      {activeVideo && (
        <ActionVideoPopup
          open={!!activeVideo}
          onOpenChange={(open) => { if (!open) setActiveVideo(null); }}
          videoUrl={activeVideo}
        />
      )}
    </div>
  );
};
