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
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider text-foreground">
          Fuelling <span className="text-primary">The Best</span>
        </h2>
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
              to={`/stars/${player.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex-shrink-0 mx-3 md:mx-4 group"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-all duration-300 group-hover:scale-110">
                {player.image_url ? (
                  <img
                    src={player.image_url}
                    alt={player.name}
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bebas text-muted-foreground">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-primary-foreground font-bebas uppercase text-xs md:text-sm text-center px-2">
                    {player.name.split(' ').pop()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-8">
        <Link 
          to="/stars"
          className="inline-flex items-center gap-2 text-primary font-bebas uppercase tracking-wider text-lg hover:gap-4 transition-all"
        >
          View Our Roster
          <span className="text-xl">→</span>
        </Link>
      </div>
    </section>
  );
};
