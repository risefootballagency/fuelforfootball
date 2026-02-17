import { useState, useEffect } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Card, CardContent } from "@/components/ui/card";
import { Film, Play, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ActionVideoPopup } from "@/components/ActionVideoPopup";

interface PlayerMatchClipperProps {
  playerId: string;
  playerEmail: string;
}

interface MatchVideo {
  id: string;
  analysis_id: string;
  opponent: string;
  analysis_date: string;
  video_url: string;
  clip_count: number;
}

export const PlayerMatchClipper = ({ playerId, playerEmail }: PlayerMatchClipperProps) => {
  const [loading, setLoading] = useState(true);
  const [matchVideos, setMatchVideos] = useState<MatchVideo[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Fetch analyses that have video URLs
        const { data: analyses } = await sharedSupabase
          .from("player_analysis")
          .select("id, analysis_date, opponent, video_url")
          .eq("player_id", playerId)
          .not("video_url", "is", null)
          .order("analysis_date", { ascending: false });

        if (analyses && analyses.length > 0) {
          // Get clip counts per analysis
          const analysisIds = analyses.map(a => a.id);
          const { data: actions } = await sharedSupabase
            .from("performance_report_actions")
            .select("analysis_id, video_url")
            .in("analysis_id", analysisIds)
            .not("video_url", "is", null);

          const clipCounts: Record<string, number> = {};
          (actions || []).forEach((a: any) => {
            clipCounts[a.analysis_id] = (clipCounts[a.analysis_id] || 0) + 1;
          });

          const videos: MatchVideo[] = analyses.map((a: any) => ({
            id: a.id,
            analysis_id: a.id,
            opponent: a.opponent || "Unknown",
            analysis_date: a.analysis_date,
            video_url: a.video_url,
            clip_count: clipCounts[a.id] || 0,
          }));

          setMatchVideos(videos);
        }
      } catch {
        // Graceful fail
      }
      setLoading(false);
    };
    fetchVideos();
  }, [playerId]);

  if (loading) {
    return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  if (matchVideos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <Film className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No match videos available yet.
      </div>
    );
  }

  const displayed = expanded ? matchVideos : matchVideos.slice(0, 5);

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{matchVideos.length} match videos</p>
      {displayed.map((video) => (
        <Card key={video.id}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">vs {video.opponent}</p>
                <p className="text-xs text-muted-foreground">
                  {video.analysis_date ? format(new Date(video.analysis_date), "dd MMM yyyy") : ""}
                  {video.clip_count > 0 && ` · ${video.clip_count} clips`}
                </p>
              </div>
              <button
                onClick={() => setActiveVideo(video.video_url)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent/10 hover:bg-accent/20 transition-colors text-accent text-sm font-medium"
              >
                <Play className="h-3.5 w-3.5" />
                Watch
              </button>
            </div>
          </CardContent>
        </Card>
      ))}

      {matchVideos.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 text-xs text-accent hover:text-accent/80 py-1"
        >
          {expanded ? <><ChevronUp className="h-3 w-3" /> Show Less</> : <><ChevronDown className="h-3 w-3" /> Show All ({matchVideos.length})</>}
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
