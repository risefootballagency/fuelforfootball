import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Link2, Loader2, Plus, Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";

interface Fixture {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  match_date: string;
  competition: string | null;
}

interface Player {
  id: string;
  name: string;
  club?: string | null;
}

interface AnalysisQuickLinkProps {
  formData: any;
  setFormData: (data: any) => void;
  analysisType: "pre-match" | "post-match";
  defaultOpen?: boolean;
}

export const AnalysisQuickLink = ({
  formData,
  setFormData,
  analysisType,
  defaultOpen = true,
}: AnalysisQuickLinkProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("none");
  const [playerFixtures, setPlayerFixtures] = useState<Fixture[]>([]);
  const [selectedFixtureId, setSelectedFixtureId] = useState<string>("none");
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [loadingFixtures, setLoadingFixtures] = useState(false);
  const [createFixtureOpen, setCreateFixtureOpen] = useState(false);
  const [newFixture, setNewFixture] = useState({
    home_team: '',
    away_team: '',
    match_date: '',
    competition: '',
    home_score: '',
    away_score: '',
  });
  const [creatingFixture, setCreatingFixture] = useState(false);

  // Keyboard shortcuts: Ctrl+Shift+F to open fixture creator, Ctrl+Shift+L to apply link
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+F: Open create fixture dialog
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        if (selectedPlayerId && selectedPlayerId !== "none") {
          setCreateFixtureOpen(true);
        } else {
          toast.error("Select a player first");
        }
      }
      // Ctrl+Shift+L: Apply/import selected fixture
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        handleApplyFixture();
      }
      // Enter key within create fixture dialog to submit
      if (e.key === 'Enter' && createFixtureOpen && !creatingFixture) {
        e.preventDefault();
        handleCreateFixture();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlayerId, selectedFixtureId, createFixtureOpen, creatingFixture]);

  // Fetch players on mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from("players")
          .select("id, name, club")
          .order("name");

        if (error) throw error;
        setPlayers(data || []);
      } catch (error) {
        console.error("Failed to fetch players:", error);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, []);

  // Fetch fixtures when player changes
  useEffect(() => {
    if (selectedPlayerId && selectedPlayerId !== "none") {
      fetchPlayerFixtures(selectedPlayerId);
    } else {
      setPlayerFixtures([]);
      setSelectedFixtureId("none");
    }
  }, [selectedPlayerId]);

  const fetchPlayerFixtures = async (playerId: string) => {
    setLoadingFixtures(true);
    try {
      // First get the player's fixture IDs
      const { data: playerFixtureLinks, error: pfError } = await supabase
        .from("player_fixtures")
        .select("fixture_id")
        .eq("player_id", playerId);

      if (pfError) throw pfError;

      if (playerFixtureLinks && playerFixtureLinks.length > 0) {
        const fixtureIds = playerFixtureLinks.map(pf => pf.fixture_id);
        
        const { data: fixturesData, error: fError } = await supabase
          .from("fixtures")
          .select("*")
          .in("id", fixtureIds)
          .order("match_date", { ascending: false });

        if (fError) throw fError;
        setPlayerFixtures(fixturesData || []);
      } else {
        setPlayerFixtures([]);
      }
    } catch (error) {
      console.error("Failed to fetch fixtures:", error);
      setPlayerFixtures([]);
    } finally {
      setLoadingFixtures(false);
    }
  };

  const handleApplyFixture = () => {
    if (selectedFixtureId === "none") {
      toast.error("Please select a fixture first");
      return;
    }

    const fixture = playerFixtures.find(f => f.id === selectedFixtureId);
    const player = players.find(p => p.id === selectedPlayerId);
    
    if (!fixture || !player) return;

    // Determine which team is the player's team based on their club
    const playerClub = player.club?.toLowerCase() || "";
    const homeTeamLower = fixture.home_team.toLowerCase();
    const awayTeamLower = fixture.away_team.toLowerCase();
    
    // Simple matching - check if player's club contains or is contained by team names
    let playerTeam: "home" | "away" | null = null;
    if (playerClub && (homeTeamLower.includes(playerClub) || playerClub.includes(homeTeamLower))) {
      playerTeam = "home";
    } else if (playerClub && (awayTeamLower.includes(playerClub) || playerClub.includes(awayTeamLower))) {
      playerTeam = "away";
    }

    // Build the update object
    const updateData: any = {
      ...formData,
      match_date: fixture.match_date,
      home_team: fixture.home_team,
      away_team: fixture.away_team,
      home_score: fixture.home_score,
      away_score: fixture.away_score,
    };

    // For pre-match, set player_team for opacity highlight
    if (analysisType === "pre-match" && playerTeam) {
      updateData.player_team = playerTeam;
    }

    // For post-match, also set player name
    if (analysisType === "post-match") {
      updateData.player_name = player.name.toUpperCase();
    }

    setFormData(updateData);
    toast.success("Match details imported from fixture");
  };

  const formatFixtureLabel = (fixture: Fixture) => {
    const date = new Date(fixture.match_date).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    const score = fixture.home_score !== null && fixture.away_score !== null 
      ? ` (${fixture.home_score}-${fixture.away_score})` 
      : '';
    return `${fixture.home_team} vs ${fixture.away_team}${score} - ${date}`;
  };
  const handleCreateFixture = async () => {
    if (!newFixture.home_team || !newFixture.away_team || !newFixture.match_date) {
      toast.error("Please fill in home team, away team, and match date");
      return;
    }
    setCreatingFixture(true);
    try {
      const fixtureData: any = {
        home_team: newFixture.home_team,
        away_team: newFixture.away_team,
        match_date: newFixture.match_date,
      };
      if (newFixture.competition) fixtureData.competition = newFixture.competition;
      if (newFixture.home_score !== '') fixtureData.home_score = parseInt(newFixture.home_score);
      if (newFixture.away_score !== '') fixtureData.away_score = parseInt(newFixture.away_score);

      const { data, error } = await supabase
        .from("fixtures")
        .insert(fixtureData)
        .select()
        .single();

      if (error) throw error;

      // Link fixture to selected player
      if (selectedPlayerId && selectedPlayerId !== "none") {
        await supabase
          .from("player_fixtures")
          .insert({ player_id: selectedPlayerId, fixture_id: data.id });
        
        // Refresh fixtures list and select the new one
        await fetchPlayerFixtures(selectedPlayerId);
        setSelectedFixtureId(data.id);
      }

      setCreateFixtureOpen(false);
      setNewFixture({ home_team: '', away_team: '', match_date: '', competition: '', home_score: '', away_score: '' });
      toast.success("Fixture created successfully");
    } catch (error: any) {
      console.error("Failed to create fixture:", error);
      toast.error(error.message || "Failed to create fixture");
    } finally {
      setCreatingFixture(false);
    }
  };

  return (
    <>
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-lg">QUICK LINK</h3>
          <span className="text-xs text-muted-foreground">(Import from fixture)</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Select a player and their fixture to automatically import match details.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Player</Label>
            <Select 
              value={selectedPlayerId} 
              onValueChange={setSelectedPlayerId}
              disabled={loadingPlayers}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingPlayers ? "Loading players..." : "Select player"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a player</SelectItem>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Fixture</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select 
                  value={selectedFixtureId} 
                  onValueChange={setSelectedFixtureId}
                  disabled={!selectedPlayerId || selectedPlayerId === "none" || loadingFixtures}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      loadingFixtures 
                        ? "Loading fixtures..." 
                        : selectedPlayerId === "none" 
                          ? "Select player first" 
                          : playerFixtures.length === 0 
                            ? "No fixtures found" 
                            : "Select fixture"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select a fixture</SelectItem>
                    {playerFixtures.map((fixture) => (
                      <SelectItem key={fixture.id} value={fixture.id}>
                        {formatFixtureLabel(fixture)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 mt-0"
                disabled={!selectedPlayerId || selectedPlayerId === "none"}
                onClick={() => setCreateFixtureOpen(true)}
                title="Create new fixture"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleApplyFixture}
          disabled={selectedFixtureId === "none" || loadingFixtures}
          className="w-full sm:w-auto"
          variant="outline"
        >
          {loadingFixtures ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 mr-2" />
              Import Match Details
            </>
          )}
        </Button>
      </CollapsibleContent>
    </Collapsible>

    {/* Create Fixture Dialog */}
    <Dialog open={createFixtureOpen} onOpenChange={setCreateFixtureOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Fixture</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Home Team *</Label>
              <Input
                value={newFixture.home_team}
                onChange={(e) => setNewFixture({ ...newFixture, home_team: e.target.value })}
                placeholder="Home team"
              />
            </div>
            <div>
              <Label>Away Team *</Label>
              <Input
                value={newFixture.away_team}
                onChange={(e) => setNewFixture({ ...newFixture, away_team: e.target.value })}
                placeholder="Away team"
              />
            </div>
          </div>
          <div>
            <Label>Match Date *</Label>
            <Input
              type="date"
              value={newFixture.match_date}
              onChange={(e) => setNewFixture({ ...newFixture, match_date: e.target.value })}
            />
          </div>
          <div>
            <Label>Competition</Label>
            <Input
              value={newFixture.competition}
              onChange={(e) => setNewFixture({ ...newFixture, competition: e.target.value })}
              placeholder="e.g. Premier League"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Home Score</Label>
              <Input
                type="number"
                value={newFixture.home_score}
                onChange={(e) => setNewFixture({ ...newFixture, home_score: e.target.value })}
                placeholder="—"
              />
            </div>
            <div>
              <Label>Away Score</Label>
              <Input
                type="number"
                value={newFixture.away_score}
                onChange={(e) => setNewFixture({ ...newFixture, away_score: e.target.value })}
                placeholder="—"
              />
            </div>
          </div>
          <Button 
            onClick={handleCreateFixture} 
            disabled={creatingFixture}
            className="w-full"
          >
            {creatingFixture ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Fixture"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
