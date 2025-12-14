import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import { getCountryFlagUrl } from "@/lib/countryFlags";
import { useLanguage } from "@/contexts/LanguageContext";

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
  highlights: any;
  links: any;
}

interface ParsedBio {
  bio?: string;
  overview?: string;
  description?: string;
  dateOfBirth?: string;
  dob?: string;
  currentClub?: string;
  previousClubs?: string[];
  achievements?: string[];
  seasonStats?: any;
}

const PlayerDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!slug) return;

      try {
        // Convert slug back to searchable name
        const searchName = slug.replace(/-/g, ' ');
        
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .ilike('name', searchName)
          .single();

        if (error) {
          console.error('Error fetching player:', error);
          setError('Player not found');
          return;
        }

        setPlayer(data);
      } catch (err) {
        console.error('Error:', err);
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [slug]);

  // Parse bio JSON
  const parseBio = (bio: string | null): ParsedBio => {
    if (!bio) return {};
    try {
      const parsed = JSON.parse(bio);
      return typeof parsed === 'object' ? parsed : { bio };
    } catch {
      return { bio };
    }
  };

  const bioData = player ? parseBio(player.bio) : {};
  const displayBio = bioData.bio || bioData.overview || bioData.description || '';
  const dateOfBirth = bioData.dateOfBirth || bioData.dob || '';
  const currentClub = bioData.currentClub || player?.club || '';

  // Get translated position
  const positionKey = player?.position?.toUpperCase() || '';
  const translatedPosition = t(`positions.${positionKey}`, positionKey);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 md:pt-28 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-[3/4]" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 md:pt-28 container mx-auto px-4 text-center py-16">
          <h1 className="text-4xl font-bebas uppercase tracking-wider mb-4">
            Player Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the player you're looking for.
          </p>
          <Button asChild>
            <Link to="/stars">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stars
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${player.name} - ${translatedPosition} | Fuel For Football`}
        description={displayBio ? displayBio.substring(0, 160) : `${player.name} - Professional footballer represented by Fuel For Football`}
        image={player.image_url || undefined}
        url={`/stars/${slug}`}
      />
      <Header />
      
      <main className="pt-24 md:pt-28">
        {/* Back Button */}
        <div className="container mx-auto px-4 mb-8">
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/stars">
              <ArrowLeft className="w-4 h-4" />
              {t('player_detail.back', 'Back to Stars')}
            </Link>
          </Button>
        </div>

        {/* Player Hero */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Player Image */}
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                {player.image_url ? (
                  <img 
                    src={player.image_url} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Users className="w-24 h-24 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              
              {/* Position Badge */}
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded">
                <span className="text-2xl font-bebas tracking-wider">{translatedPosition}</span>
              </div>
            </div>

            {/* Player Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider text-foreground mb-4">
                {player.name}
              </h1>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                {/* Nationality */}
                <div className="flex items-center gap-3">
                  <img 
                    src={getCountryFlagUrl(player.nationality)} 
                    alt={player.nationality}
                    className="w-10 h-7 object-cover rounded"
                  />
                  <span className="text-lg text-muted-foreground">{player.nationality}</span>
                </div>

                {/* Age */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-lg text-muted-foreground">
                    {dateOfBirth ? `${dateOfBirth} (${player.age})` : `Age ${player.age}`}
                  </span>
                </div>

                {/* Club */}
                {currentClub && (
                  <div className="flex items-center gap-2">
                    {player.club_logo && (
                      <img 
                        src={player.club_logo} 
                        alt={currentClub}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <span className="text-lg text-muted-foreground">{currentClub}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {displayBio && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {displayBio}
                  </p>
                </div>
              )}

              {/* Season Stats */}
              {bioData.seasonStats && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(bioData.seasonStats).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bebas text-primary">{String(value)}</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wider">{key}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Achievements */}
              {bioData.achievements && bioData.achievements.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bebas uppercase tracking-wider mb-4">Achievements</h3>
                  <ul className="space-y-2">
                    {bioData.achievements.map((achievement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        {player.highlights && Array.isArray(player.highlights) && player.highlights.length > 0 && (
          <section className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bebas uppercase tracking-wider mb-8 text-center">
                {t('player_detail.highlights', 'Highlights')}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {player.highlights.map((highlight: any, index: number) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden bg-background">
                    {highlight.url && (
                      <iframe
                        src={highlight.url.replace('watch?v=', 'embed/')}
                        title={highlight.title || `Highlight ${index + 1}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PlayerDetail;
