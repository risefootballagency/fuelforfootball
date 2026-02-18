import { useState, useEffect } from "react";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Edit, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { sortPlayersByRepresentation } from "@/lib/playerSorting";

interface ActionReportsListProps {
  onCreateReport: (playerId: string, playerName: string) => void;
  onEditReport: (playerId: string, playerName: string, analysisId: string) => void;
}

export const ActionReportsList = ({ onCreateReport, onEditReport }: ActionReportsListProps) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: playersData }, { data: reportsData }] = await Promise.all([
      supabase.from("players").select("id, name, position, image_url, representation_status").order("name"),
      supabase.from("player_analysis").select("id, player_id, analysis_date, opponent, r90_score, minutes_played, result").order("analysis_date", { ascending: false }),
    ]);
    setPlayers(playersData || []);
    setReports(reportsData || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  // Group reports by player
  const sorted = sortPlayersByRepresentation(players);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Performance Reports</h3>
      </div>
      <div className="space-y-3">
        {sorted.map(player => {
          const playerReports = reports.filter(r => r.player_id === player.id);
          if (playerReports.length === 0) return null;
          return (
            <div key={player.id} className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{player.name}</span>
                  <Badge variant="outline" className="text-xs">{player.position}</Badge>
                  <Badge variant="secondary" className="text-xs">{playerReports.length} reports</Badge>
                </div>
                <Button size="sm" variant="outline" onClick={() => onCreateReport(player.id, player.name)}>
                  <Plus className="h-3 w-3 mr-1" /> New
                </Button>
              </div>
              <div className="divide-y">
                {playerReports.slice(0, 5).map(report => (
                  <div key={report.id} className="flex items-center justify-between px-3 py-2 hover:bg-muted/20 cursor-pointer" onClick={() => onEditReport(player.id, player.name, report.id)}>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{report.opponent || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground">{format(new Date(report.analysis_date), "dd MMM yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.r90_score && <Badge variant="outline" className="text-xs">R90: {report.r90_score.toFixed(2)}</Badge>}
                      <Edit className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
