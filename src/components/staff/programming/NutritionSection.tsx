import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { Apple, Users, ChevronRight } from "lucide-react";
import { NutritionProgramManagement } from "@/components/staff/NutritionProgramManagement";

export const NutritionSection = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    const { data } = await supabase
      .from("players" as any)
      .select("id, name, club, position")
      .order("name");
    if (data) setPlayers(data.map((p: any) => ({ ...p, current_club: p.club })));
  };

  const filtered = players.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.current_club?.toLowerCase().includes(q);
  });

  if (selectedPlayer) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelectedPlayer(null)}>
          ← Back to Players
        </Button>
        <NutritionProgramManagement
          playerId={selectedPlayer.id}
          playerName={selectedPlayer.name}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Apple className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Nutrition</h2>
          <p className="text-sm text-muted-foreground">Select a player to manage nutrition plans</p>
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
              onClick={() => setSelectedPlayer(p)}
            >
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Apple className="w-4 h-4 text-primary shrink-0" />
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
