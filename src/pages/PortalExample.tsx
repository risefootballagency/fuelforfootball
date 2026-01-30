import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Hub } from "@/components/dashboard/Hub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

// Demo player ID - Joe Bloggs
const DEMO_PLAYER_ID = "e3ae5dcd-0a67-4d49-bf04-879040c4b8c3";

interface PortalExampleProps {
  isEmbedded?: boolean;
}

export const PortalExample = ({ isEmbedded = false }: PortalExampleProps) => {
  const [activeSection, setActiveSection] = useState("hub");
  const [loading, setLoading] = useState(true);
  const [playerData, setPlayerData] = useState<any>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [dailyAphorism, setDailyAphorism] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemoPlayerData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch player data
        const { data: player, error: playerError } = await supabase
          .from("players")
          .select("*")
          .eq("id", DEMO_PLAYER_ID)
          .single();

        if (playerError || !player) {
          setError("Demo player not found");
          setLoading(false);
          return;
        }

        setPlayerData(player);

        // Fetch analyses
        const { data: analysesData } = await supabase
          .from("player_analysis")
          .select("*")
          .eq("player_id", DEMO_PLAYER_ID)
          .order("analysis_date", { ascending: false });

        setAnalyses(analysesData || []);

        // Fetch programs
        const { data: programsData } = await supabase
          .from("player_programs")
          .select("*")
          .eq("player_id", DEMO_PLAYER_ID)
          .order("created_at", { ascending: false });

        setPrograms(programsData || []);

        // Fetch daily aphorism
        const { data: aphorism } = await supabase
          .from("coaching_aphorisms")
          .select("*")
          .limit(1)
          .single();

        setDailyAphorism(aphorism);

      } catch (err) {
        console.error("Error fetching demo hub data:", err);
        setError("Failed to load demo portal");
      } finally {
        setLoading(false);
      }
    };

    fetchDemoPlayerData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`example-${sectionId}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-bebas text-2xl tracking-wider">
          Loading Demo Portal...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <User className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bebas text-foreground">{error}</h1>
        {!isEmbedded && (
          <Link to="/analysis">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analysis
            </Button>
          </Link>
        )}
      </div>
    );
  }

  const containerClass = isEmbedded ? "" : "min-h-screen";

  return (
    <div className={`${containerClass} bg-background`}>
      {!isEmbedded && (
        <SEO 
          title="Demo Player Portal | Fuel For Football"
          description="Experience our player performance hub with demo content - training programmes, match analysis, and development tracking."
          url="/portal-example"
        />
      )}

      {/* Header Bar */}
      <header className={`${isEmbedded ? '' : 'sticky top-0'} z-50 bg-card/95 backdrop-blur-md border-b border-border`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isEmbedded && (
              <Link to="/analysis" className="text-muted-foreground hover:text-foreground transition-colors">
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
                  {playerData?.name || 'Demo Player'}
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

      {/* Quick Navigation */}
      <nav className={`bg-card border-b border-border ${isEmbedded ? '' : 'sticky top-[57px]'} z-40`}>
        <div className="container mx-auto px-4 flex gap-1 overflow-x-auto py-2">
          {[
            { id: 'hub', label: 'Hub' },
            { id: 'schedule', label: 'Schedule' },
            { id: 'analysis', label: 'Analysis' },
            { id: 'programmes', label: 'Programmes' },
            { id: 'highlights', label: 'Highlights' },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => scrollToSection(nav.id)}
              className={`px-4 py-2 text-sm font-bebas uppercase tracking-wider whitespace-nowrap rounded transition-colors ${
                activeSection === nav.id 
                  ? 'bg-accent text-black' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className={isEmbedded ? "pb-4" : "pb-24"}>
        <div id="example-hub-section">
          <Hub
            programs={programs}
            analyses={analyses}
            playerData={playerData}
            dailyAphorism={dailyAphorism}
            onNavigateToAnalysis={() => scrollToSection('analysis')}
            onNavigateToForm={() => {}}
            onNavigateToSession={() => {}}
          />
        </div>

        {/* Schedule Section Placeholder */}
        <section id="example-schedule-section" className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Training schedule and sessions would appear here
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Analysis Section */}
        <section id="example-analysis-section" className="container mx-auto px-4 py-8">
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
        </section>

        {/* Programmes Section */}
        <section id="example-programmes-section" className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
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
        </section>

        {/* Highlights Section */}
        <section id="example-highlights-section" className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas tracking-wider">Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Video highlights showcase coming soon
              </p>
            </CardContent>
          </Card>
        </section>
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

export default PortalExample;
