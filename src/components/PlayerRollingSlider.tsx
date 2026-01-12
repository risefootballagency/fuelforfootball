import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";

interface Player {
  id: string;
  name: string;
  image: string;
  club?: string;
}

// Placeholder players - will be replaced with database data
const placeholderPlayers: Player[] = [
  { id: "1", name: "John Bostock", image: "https://static.wixstatic.com/media/c4f4b1_7de02c74bb1142dea9ce0997961fd1f5~mv2.jpg", club: "Notts County" },
  { id: "2", name: "Michael Mulligan", image: "https://static.wixstatic.com/media/c4f4b1_aed8df24614a45b29533fede6bae55c7~mv2.jpg", club: "Bohemians" },
  { id: "3", name: "Tyrese Mayingi", image: "https://static.wixstatic.com/media/c4f4b1_c627e66f4e68449590b6f4f745b91472~mv2.jpg", club: "Cheltenham Town" },
  { id: "4", name: "Jaroslav Svoboda", image: "https://static.wixstatic.com/media/c4f4b1_73a12b8d527341e594f266e5b77de8fe~mv2.jpg", club: "MFK Karviná" },
  { id: "5", name: "Tyrese Mayingi", image: "https://static.wixstatic.com/media/c4f4b1_2cc70832de7149aa87f67a71d4390f00~mv2.jpg", club: "Cheltenham Town" },
  { id: "6", name: "Elite Player", image: "https://static.wixstatic.com/media/c4f4b1_7de02c74bb1142dea9ce0997961fd1f5~mv2.jpg", club: "Top Club" },
];

interface PlayerRollingSliderProps {
  title?: string;
  subtitle?: string;
  players?: Player[];
}

export const PlayerRollingSlider = ({ 
  title = "Players We've Worked With",
  subtitle = "From Premier League to emerging talent, we've helped players across all levels elevate their game.",
  players = placeholderPlayers
}: PlayerRollingSliderProps) => {
  const [xOffset, setXOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  
  // Double the players for seamless loop
  const doubledPlayers = [...players, ...players];
  const itemWidth = 180; // Width of each item including gap
  const totalWidth = players.length * itemWidth;

  useAnimationFrame((time, delta) => {
    if (isPaused.current) return;
    // Move at 30px per second
    setXOffset(prev => {
      const next = prev - (delta / 1000) * 30;
      // Reset when first set is fully scrolled
      if (Math.abs(next) >= totalWidth) {
        return next + totalWidth;
      }
      return next;
    });
  });

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-card/40 via-background to-background overflow-hidden">
      <div className="container mx-auto px-4 mb-8 md:mb-12">
        <span className="text-xs font-bebas uppercase tracking-[0.3em] text-primary/60 block mb-2 text-center">
          Anonymous Results
        </span>
        <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider text-center text-foreground mb-4">
          Players Who <span className="text-primary">Took Action</span>
        </h2>
        <p className="text-center text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          They stopped waiting. They stopped hoping. They started training with us—and now they play at the highest level.
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full"
        onMouseEnter={() => isPaused.current = true}
        onMouseLeave={() => isPaused.current = false}
        style={{ perspective: "1000px" }}
      >
        <motion.div 
          className="flex gap-6 py-4"
          style={{ x: xOffset }}
        >
          {doubledPlayers.map((player, index) => (
            <motion.div
              key={`${player.id}-${index}`}
              className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
              whileHover={{ scale: 1.1, z: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* 3D Circle Container */}
              <div 
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl shadow-primary/10 group-hover:border-primary group-hover:shadow-primary/30 transition-all duration-300"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateY(-5deg)",
                }}
              >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 z-10 pointer-events-none" />
                
                {/* Player Image - GRAYSCALE for anonymity */}
                <img 
                  src={player.image} 
                  alt="Elite Player"
                  className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
              </div>

              {/* Anonymous Hover Info - No names */}
              <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-bebas text-sm md:text-base text-primary tracking-wider">
                  FUELLED
                </p>
                <p className="text-xs text-muted-foreground">
                  Professional
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>

      {/* FOMO CTA */}
      <div className="text-center mt-8">
        <p className="text-xs text-muted-foreground italic mb-2">
          While you're reading this, they're training.
        </p>
      </div>
    </section>
  );
};

export default PlayerRollingSlider;
