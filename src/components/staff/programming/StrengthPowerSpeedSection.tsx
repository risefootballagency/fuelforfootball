import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import { Dumbbell, Users, ChevronRight } from "lucide-react";
import { ProgrammingManagement } from "@/components/staff/ProgrammingManagement";

export const StrengthPowerSpeedSection = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    const { data } = await supabase
      .from("players" as any)
      .select("id, name, current_club, position")
      .order("name");
    if (data) setPlayers(data);
  };

  const filtered = players.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.current_club?.toLowerCase().includes(q);
  });

  if (selectedPlayer && dialogOpen) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => { setDialogOpen(false); setSelectedPlayer(null); }}>
          ← Back to Players
        </Button>
        <ProgrammingManagement
          isOpen={true}
          onClose={() => { setDialogOpen(false); setSelectedPlayer(null); }}
          playerId={selectedPlayer.id}
          playerName={selectedPlayer.name}
          isAdmin={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Dumbbell className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Strength, Power & Speed</h2>
          <p className="text-sm text-muted-foreground">Select a player to manage their SPS programme</p>
        </div>
      </div>

      <Input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search players..."
      />

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No players found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {filtered.map(p => (
            <Card
              key={p.id}
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => { setSelectedPlayer(p); setDialogOpen(true); }}
            >
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Dumbbell className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.current_club || "No club"} {p.position ? `• ${p.position}` : ""}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
