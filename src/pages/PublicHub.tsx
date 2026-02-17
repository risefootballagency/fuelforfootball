import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Hub } from "@/components/dashboard/Hub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, User, Calendar, TrendingUp, ChevronDown, Home, FileText, Dumbbell, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

// Demo player ID - Joe Bloggs
const DEMO_PLAYER_ID = "e3ae5dcd-0a67-4d49-bf04-879040c4b8c3";

interface PublicHubProps {
  playerId?: string;
  isEmbedded?: boolean;
}

const PublicHub = ({ playerId: propPlayerId, isEmbedded = false }: PublicHubProps) => {
  const { playerId: paramPlayerId } = useParams();
  const [searchParams] = useSearchParams();
  const initialSection = searchParams.get("section") || "hub";
  
  const [loading, setLoading] = useState(true);
  const [playerData, setPlayerData] = useState<any>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [dailyAphorism, setDailyAphorism] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(initialSection);

  // Use prop playerId first, then URL param, then demo
  const targetPlayerId = propPlayerId || paramPlayerId || DEMO_PLAYER_ID;

  const sections = [
    { id: 'hub', label: 'Hub', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'analysis', label: 'Analysis', icon: TrendingUp },
    { id: 'programmes', label: 'Programmes', icon: Dumbbell },
    { id: 'highlights', label: 'Highlights', icon: Video },
  ];

  useEffect(() => {
    const fetchPublicPlayerData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch player data using local supabase client (Joe Bloggs is in local DB)
        const { data: player, error: playerError } = await supabase
          .from("players")
          .select("*")
          .eq("id", targetPlayerId)
          .single();

        if (playerError || !player) {
          setError("Player not found");
          setLoading(false);
          return;
        }

        // For public viewing, only show if player is demo account
        const isDemoPlayer = targetPlayerId === DEMO_PLAYER_ID;
        if (!isDemoPlayer) {
          setError("This profile is private");
          setLoading(false);
          return;
        }

        setPlayerData(player);

        // Fetch analyses
        const { data: analysesData } = await supabase
          .from("player_analysis")
          .select("*")
          .eq("player_id", targetPlayerId)
          .order("analysis_date", { ascending: false });

        setAnalyses(analysesData || []);

        // Fetch programs
        const { data: programsData } = await supabase
          .from("player_programs")
          .select("*")
          .eq("player_id", targetPlayerId)
          .order("created_at", { ascending: false });

        setPrograms(programsData || []);

        // Fetch daily aphorism
        const { data: aphorism } = await supabase
          .from("coaching_aphorisms")
          .select("*")
          .limit(1)
          .maybeSingle();

        setDailyAphorism(aphorism);

      } catch (err) {
        console.error("Error fetching public hub data:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPlayerData();
  }, [targetPlayerId]);

  const containerClass = isEmbedded ? "" : "min-h-screen";

  if (loading) {
    return (
      <div className={`${containerClass} bg-background flex items-center justify-center`} style={{ minHeight: isEmbedded ? '400px' : undefined }}>
        <div className="animate-pulse text-primary font-bebas text-2xl tracking-wider">
          Loading Player Hub...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerClass} bg-background flex flex-col items-center justify-center gap-6`} style={{ minHeight: isEmbedded ? '400px' : undefined }}>
        <User className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bebas text-foreground">{error}</h1>
        {!isEmbedded && (
          <Link to="/players">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Players
            </Button>
          </Link>
        )}
      </div>
    );
  }

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <div className={`${containerClass} bg-background`}>
      {!isEmbedded && (
        <SEO 
          title={`${playerData?.name || 'Player'} Hub | Fuel For Football`}
          description={`View ${playerData?.name}'s performance hub - training programmes, match analysis, and development progress.`}
          url={`/hub/${targetPlayerId}`}
        />
      )}

      {/* Header Bar - Matching Dashboard style */}
      <header className={`${isEmbedded ? '' : 'sticky top-0'} z-50 bg-card/95 backdrop-blur-md border-b border-border`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isEmbedded && (
              <Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            <div className="flex items-center gap-3">
              {playerData?.image_url ? (
                <img 
                  src={playerData.image_url} 
                  alt={playerData.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-accent"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-accent">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <h1 className="font-bebas text-xl tracking-wider text-foreground">
                  {playerData?.name || 'Player Hub'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {playerData?.club || 'Performance Portal'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-accent/20 text-accent rounded font-bebas tracking-wider">
              DEMO PORTAL
            </span>
          </div>
        </div>
      </header>

      {/* Navigation - Dropdown Menu matching Dashboard style exactly */}
      <nav className="w-full z-40">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline" 
              className="w-full justify-center font-bebas uppercase text-xl px-6 py-6 bg-card hover:bg-card/80 border-t-2 border-accent border-x-0 border-b-2 !text-accent hover:!text-accent z-50 rounded-none"
            >
              <span>
                {activeSection === 'hub' && 'Hub'}
                {activeSection === 'schedule' && 'Schedule'}
                {activeSection === 'analysis' && 'Analysis'}
                {activeSection === 'programmes' && 'Programmes'}
                {activeSection === 'highlights' && 'Highlights'}
              </span>
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[280px] bg-card border-2 border-accent shadow-lg shadow-accent/20 z-50">
            {sections.map((section) => (
              <DropdownMenuItem 
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="font-bebas uppercase text-base py-3 cursor-pointer text-accent hover:text-accent/80 hover:bg-accent/10"
              >
                {section.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Main Content - Tab-based like Dashboard */}
      <main className={isEmbedded ? "pb-4" : "pb-24"}>
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          {/* Hub Section */}
          <TabsContent value="hub" className="mt-0">
            <Hub
              programs={programs}
              analyses={analyses}
              playerData={playerData}
              dailyAphorism={dailyAphorism}
              onNavigateToAnalysis={() => setActiveSection('analysis')}
              onNavigateToComparisons={() => setActiveSection('analysis')}
              onNavigateToForm={() => {}}
              onNavigateToSession={() => setActiveSection('programmes')}
              onNavigateToSchedule={() => setActiveSection('schedule')}
            />
          </TabsContent>

          {/* Schedule Section */}
          <TabsContent value="schedule" className="mt-0">
            <div className="container mx-auto px-4 py-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bebas tracking-wider flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Weekly Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Schedule information will appear here when available
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analysis Section */}
          <TabsContent value="analysis" className="mt-0">
            <div className="container mx-auto px-4 py-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bebas tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Recent Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyses.length > 0 ? (
                    <div className="grid gap-4">
                      {analyses.slice(0, 5).map((analysis) => (
                        <div 
                          key={analysis.id}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                        >
                          <div>
                            <p className="font-medium text-foreground">{analysis.opponent || 'Match Analysis'}</p>
                            <p className="text-sm text-muted-foreground">
                              {analysis.analysis_date ? format(new Date(analysis.analysis_date), 'dd MMM yyyy') : 'N/A'}
                            </p>
                          </div>
                          {analysis.r90_score && (
                            <div className="text-right">
                              <p className="text-2xl font-bebas text-accent">{analysis.r90_score.toFixed(2)}</p>
                              <p className="text-xs text-muted-foreground">R90 Score</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No analysis data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Programmes Section */}
          <TabsContent value="programmes" className="mt-0">
            <div className="container mx-auto px-4 py-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bebas tracking-wider flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-accent" />
                    Training Programmes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {programs.length > 0 ? (
                    <div className="grid gap-4">
                      {programs.map((program) => (
                        <div 
                          key={program.id}
                          className="p-4 bg-muted/50 rounded-lg border border-border"
                        >
                          <p className="font-medium text-foreground">{program.program_name}</p>
                          {program.phase_name && (
                            <p className="text-sm text-accent">{program.phase_name}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {program.is_current ? 'Current Programme' : 'Past Programme'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No programmes available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Highlights Section */}
          <TabsContent value="highlights" className="mt-0">
            <div className="container mx-auto px-4 py-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bebas tracking-wider flex items-center gap-2">
                    <Video className="w-5 h-5 text-accent" />
                    Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Video highlights showcase coming soon
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer CTA - Only show when not embedded */}
      {!isEmbedded && (
        <footer className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <p className="text-sm text-muted-foreground hidden md:block">
              Want a performance hub like this for yourself?
            </p>
            <Link to="/services" className="w-full md:w-auto">
              <Button className="w-full md:w-auto bg-accent hover:bg-accent/90 text-black font-bebas tracking-wider">
                Get Your Own Portal
              </Button>
            </Link>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicHub;
