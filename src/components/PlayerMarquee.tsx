import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Player {
  id: string;
  name: string;
  image_url: string | null;
  position: string;
  club: string | null;
}

export const PlayerMarquee = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('id, name, image_url, position, club')
        .eq('visible_on_stars_page', true)
        .eq('representation_status', 'represented')
        .limit(20);

      if (!error && data) {
        setPlayers(data);
      }
    };

    fetchPlayers();
  }, []);

  if (players.length === 0) return null;

  // Duplicate players for seamless loop
  const duplicatedPlayers = [...players, ...players];

  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-card/30">
      {/* Section Header - Anonymous Elite Messaging */}
      <div className="text-center mb-8">
        <span className="text-xs font-bebas uppercase tracking-[0.3em] text-primary/60 block mb-2">
          The Shadows of The Game
        </span>
        <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider text-foreground">
          Elite <span className="text-primary">Talent</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          We work with players you've watched. You just don't know it yet.
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-card/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-card/30 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex animate-marquee hover:pause-animation">
          {duplicatedPlayers.map((player, index) => (
            <Link
              key={`${player.id}-${index}`}
              to="/stars"
              className="flex-shrink-0 mx-3 md:mx-4 group"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-all duration-300 group-hover:scale-110">
                {player.image_url ? (
                  <img
                    src={player.image_url}
                    alt="Elite Player"
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bebas text-muted-foreground">?</span>
                  </div>
                )}
                
                {/* Hover Overlay - Anonymous */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-primary-foreground font-bebas uppercase text-xs md:text-sm text-center px-2">
                    Elite
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA - FOMO messaging */}
      <div className="text-center mt-8">
        <p className="text-xs text-muted-foreground mb-3 italic">
          They didn't wait. Neither should you.
        </p>
        <Link 
          to="/stars"
          className="inline-flex items-center gap-2 text-primary font-bebas uppercase tracking-wider text-lg hover:gap-4 transition-all"
        >
          See Who Made It
          <span className="text-xl">→</span>
        </Link>
      </div>
    </section>
  );
};
