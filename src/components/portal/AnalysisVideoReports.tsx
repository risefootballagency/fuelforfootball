// Stub: AnalysisVideoReports — requires videoDownload utility (already exists) 
// Full port from sister site pending integration

import { useState, useEffect, useRef } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Loader2 } from "lucide-react";

interface Analysis {
  id: string;
  analysis_date: string;
  opponent: string | null;
  result: string | null;
  minutes_played: number | null;
}

interface Props {
  analyses: Analysis[];
  playerId: string;
  embedded?: boolean;
}

export const AnalysisVideoReports = ({ analyses, playerId, embedded }: Props) => {
  const [loading, setLoading] = useState(true);
  const [clipCount, setClipCount] = useState(0);

  useEffect(() => {
    const fetchClips = async () => {
      const analysisIds = analyses.map(a => a.id);
      if (analysisIds.length === 0) { setLoading(false); return; }

      const { count } = await sharedSupabase
        .from("performance_report_actions")
        .select("id", { count: "exact", head: true })
        .in("analysis_id", analysisIds)
        .not("video_url", "is", null);

      setClipCount(count || 0);
      setLoading(false);
    };
    fetchClips();
  }, [analyses]);

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  if (clipCount === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <Film className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No video clips available yet.
      </div>
    );
  }

  return (
    <div className="text-center py-8 text-muted-foreground text-sm">
      <Film className="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p>{clipCount} video clips available across {analyses.length} matches.</p>
      <p className="text-xs mt-1">Full video compilation viewer coming soon.</p>
    </div>
  );
};
