import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import { Database, Search, Eye, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

interface AnalysisRecord {
  id: string;
  player_name: string;
  match_date: string;
  home_team: string;
  away_team: string;
  minutes_played: number;
  r90_score: number;
  total_actions: number;
  analysis_type: string;
  created_at: string;
}

export const CoachingDataSection = () => {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [playerFilter, setPlayerFilter] = useState("all");
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load player analysis records
      const { data: analyses } = await supabase
        .from("player_analysis" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (analyses) {
        const mapped: AnalysisRecord[] = analyses.map((a: any) => ({
          id: a.id,
          player_name: a.player_name || "Unknown",
          match_date: a.match_date || a.created_at,
          home_team: a.home_team || "",
          away_team: a.away_team || "",
          minutes_played: a.minutes_played || 0,
          r90_score: a.r90_score || 0,
          total_actions: a.total_actions || 0,
          analysis_type: a.analysis_type || "performance",
          created_at: a.created_at,
        }));
        setRecords(mapped);

        const uniquePlayers = [...new Set(mapped.map(r => r.player_name))].sort();
        setPlayers(uniquePlayers);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
    setLoading(false);
  };

  const filtered = records.filter(r => {
    if (playerFilter !== "all" && r.player_name !== playerFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.player_name.toLowerCase().includes(q) ||
        r.home_team.toLowerCase().includes(q) ||
        r.away_team.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Stats summary
  const totalReports = filtered.length;
  const avgR90 = totalReports > 0 ? filtered.reduce((s, r) => s + r.r90_score, 0) / totalReports : 0;
  const totalActions = filtered.reduce((s, r) => s + r.total_actions, 0);
  const uniquePlayersCount = new Set(filtered.map(r => r.player_name)).size;

  const getR90Color = (r90: number) => {
    if (r90 >= 1.5) return "text-green-500";
    if (r90 >= 1.0) return "text-lime-500";
    if (r90 >= 0.7) return "text-yellow-500";
    if (r90 >= 0.4) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Performance Data</h2>
            <p className="text-sm text-muted-foreground">{totalReports} reports across {uniquePlayersCount} players</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold">{totalReports}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className={`text-2xl font-bold ${getR90Color(avgR90)}`}>{avgR90.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg R90</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold">{totalActions}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <p className="text-2xl font-bold">{uniquePlayersCount}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Players</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players, teams..." className="pl-9" />
        </div>
        <Select value={playerFilter} onValueChange={setPlayerFilter}>
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="All players" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Players</SelectItem>
            {players.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Records Table */}
      {loading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No performance records found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Player</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Match</th>
                <th className="text-center py-2 px-3 font-medium text-muted-foreground">Date</th>
                <th className="text-center py-2 px-3 font-medium text-muted-foreground">Min</th>
                <th className="text-center py-2 px-3 font-medium text-muted-foreground">R90</th>
                <th className="text-center py-2 px-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(r => (
                <tr key={r.id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="py-2 px-3 font-medium">{r.player_name}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">
                    {r.home_team && r.away_team ? `${r.home_team} vs ${r.away_team}` : "—"}
                  </td>
                  <td className="py-2 px-3 text-center text-xs text-muted-foreground">
                    {r.match_date ? format(new Date(r.match_date), "dd MMM yy") : "—"}
                  </td>
                  <td className="py-2 px-3 text-center">{r.minutes_played || "—"}</td>
                  <td className={`py-2 px-3 text-center font-bold ${getR90Color(r.r90_score)}`}>
                    {r.r90_score ? r.r90_score.toFixed(2) : "—"}
                  </td>
                  <td className="py-2 px-3 text-center">{r.total_actions || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 50 && (
            <p className="text-xs text-muted-foreground text-center py-2">Showing 50 of {filtered.length} records</p>
          )}
        </div>
      )}
    </div>
  );
};
