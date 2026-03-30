import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";

interface InlineFixtureCreatorProps {
  playerId?: string;
  onFixtureCreated: (fixtureId: string) => void;
}

export const InlineFixtureCreator = ({ playerId, onFixtureCreated }: InlineFixtureCreatorProps) => {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [opponent, setOpponent] = useState("");
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split("T")[0]);
  const [matchedLogo, setMatchedLogo] = useState<string | null>(null);

  // Look up logo when opponent name changes
  useEffect(() => {
    if (!opponent.trim()) { setMatchedLogo(null); return; }
    const timeout = setTimeout(async () => {
      const name = opponent.trim().toLowerCase();
      // Check analyses for stored team logos
      const { data } = await supabase
        .from("analyses")
        .select("home_team, home_team_logo, away_team, away_team_logo")
        .or(`home_team.ilike.%${name}%,away_team.ilike.%${name}%`)
        .limit(5);
      if (data) {
        for (const row of data) {
          if (row.home_team?.toLowerCase().includes(name) && row.home_team_logo) {
            setMatchedLogo(row.home_team_logo); return;
          }
          if (row.away_team?.toLowerCase().includes(name) && row.away_team_logo) {
            setMatchedLogo(row.away_team_logo); return;
          }
        }
      }
      setMatchedLogo(null);
    }, 400);
    return () => clearTimeout(timeout);
  }, [opponent]);

  const handleCreate = async () => {
    if (!opponent.trim()) { toast.error("Opponent name is required"); return; }
    if (!playerId) { toast.error("Select a player first"); return; }
    setSaving(true);
    try {
      const { data, error } = await supabase.from("fixtures").insert({ home_team: "TBC", away_team: opponent.trim(), match_date: matchDate }).select("id").single();
      if (error) throw error;
      if (data?.id) { await supabase.from("player_fixtures").insert({ player_id: playerId, fixture_id: data.id }); }
      toast.success("Fixture created");
      setShowForm(false);
      setOpponent("");
      setMatchDate(new Date().toISOString().split("T")[0]);
      setMatchedLogo(null);
      onFixtureCreated(data.id);
    } catch (error: any) { toast.error("Failed to create fixture: " + error.message); } finally { setSaving(false); }
  };

  if (!showForm) {
    return (
      <Button variant="outline" size="sm" onClick={() => setShowForm(true)} disabled={!playerId} className="h-9 w-9 p-0 shrink-0" title={playerId ? "Create new fixture" : "Select a player first"}>
        <Plus className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Quick Add Fixture</h4>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="h-6 w-6 p-0"><X className="w-3 h-3" /></Button>
      </div>
      <div>
        <Label className="text-xs">Opponent *</Label>
        <div className="flex items-center gap-2">
          {matchedLogo && <img src={matchedLogo} alt="" className="w-6 h-6 object-contain shrink-0" />}
          <Input value={opponent} onChange={e => setOpponent(e.target.value)} placeholder="e.g. Vlasim" className="h-8 text-sm" onKeyDown={e => e.key === 'Enter' && handleCreate()} />
        </div>
      </div>
      <div>
        <Label className="text-xs">Date</Label>
        <Input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} className="h-8 text-sm" />
      </div>
      <Button onClick={handleCreate} disabled={saving} size="sm" className="w-full">{saving ? "Creating..." : "Create Fixture"}</Button>
    </div>
  );
};
