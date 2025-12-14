import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PlayerCard } from "@/components/PlayerCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  name: string;
  age: number;
  position: string;
  nationality: string;
  club: string | null;
  club_logo: string | null;
  league: string | null;
  image_url: string | null;
  hover_image_url: string | null;
  bio: string | null;
  visible_on_stars_page: boolean;
  representation_status: string | null;
}

const Stars = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('visible_on_stars_page', true)
          .eq('representation_status', 'represented')
          .order('name');

        if (error) {
          console.error('Error fetching players:', error);
          return;
        }

        setPlayers(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Our Stars - Professional Football Players | Fuel For Football"
        description="Discover the talented professional footballers represented by Fuel For Football. View player profiles, stats, and career highlights."
        url="/stars"
      />
      <Header />
      
      <main className="pt-24 md:pt-28">
        {/* Hero Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider text-foreground mb-4">
                {t('stars.title', 'Our Stars')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('stars.subtitle', 'Meet the talented professionals we represent')}
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex justify-end mb-8">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="gap-2"
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </div>
            </div>

            {/* Players Grid/List */}
            {loading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className={viewMode === "grid" ? "aspect-[3/4]" : "h-48"} />
                ))}
              </div>
            ) : players.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  {t('stars.no_players', 'No players available at the moment.')}
                </p>
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-0 divide-y divide-border"
              }>
                {players.map((player) => (
                  <PlayerCard key={player.id} player={player} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Stars;
