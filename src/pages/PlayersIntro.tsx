import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import GrassBackground from "@/assets/Grass-Background.png";
import grassSmoky from "@/assets/grass-smoky-3.png";
import { supabase } from "@/integrations/supabase/client";

const PlayersIntro = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<'left' | 'right' | null>(null);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);

  // Fetch background images from marketing gallery (same as RadialMenu)
  useEffect(() => {
    const fetchBackgroundImages = async () => {
      const { data } = await supabase
        .from('marketing_gallery')
        .select('file_url')
        .eq('folder', 'landing')
        .eq('file_type', 'image')
        .not('file_url', 'is', null)
        .limit(54);
      
      if (data && data.length > 0) {
        setBackgroundImages(data.map(item => item.file_url));
      }
    };

    fetchBackgroundImages();
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background images grid from marketing gallery - fewer/wider on mobile */}
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0 z-0">
          {/* Mobile: 3x4 grid (12 images), Desktop: 9x6 grid (54 images) */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-4 md:grid-cols-9 md:grid-rows-6 gap-0">
            {backgroundImages.slice(0, 54).map((url, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden ${index >= 12 ? 'hidden md:block' : ''}`}
                style={{
                  backgroundImage: `url(${url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
          </div>
          {/* Dark overlay on background images */}
          <div className="absolute inset-0 bg-black/70" />
        </div>
      )}
      {/* Header with FFF branding */}
      <header className="py-3 md:py-6 px-4 md:px-8 flex justify-center relative z-10">
        <motion.img
          src="/fff_logo.png"
          alt="Fuel For Football"
          className="h-10 md:h-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
      </header>

      {/* Main content - Two large rectangles */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4 p-3 md:p-8 relative z-10 min-h-0">
        {/* Left - Learn More */}
        <motion.div
          className="relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group border-2 md:border-4 border-accent flex-1 min-h-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/players")}
          onMouseEnter={() => setHoveredCard('left')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Background image - grass field */}
          <img 
            src={GrassBackground} 
            alt="" 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              hoveredCard === 'right' ? 'grayscale' : ''
            }`}
          />
          <div className={`absolute inset-0 transition-all duration-500 ${
            hoveredCard === 'left' 
              ? 'bg-gradient-to-t from-accent/30 via-black/20 to-transparent' 
              : 'bg-black/40'
          }`} />
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-4 md:p-12">
            <div>
              <motion.div
                className="inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full bg-accent/30 border border-accent/50 mb-2 md:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                <span className="text-xs md:text-sm font-medium text-accent">Discover Our Approach</span>
              </motion.div>
              
              <h2 
                className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-4" 
                style={{ transform: 'scaleY(1.15)' }}
              >
                Learn How
                <br />
                <span className="text-accent">We Work</span>
              </h2>
              
              <p className="text-xs md:text-lg text-white/80 max-w-md hidden md:block">
                Discover our methodology, philosophy, and how we fuel players to reach their full potential.
              </p>
            </div>
            
            <motion.button
              className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-lg text-white border-2 border-accent group-hover:gap-5 transition-all duration-300 w-fit"
              style={{ 
                backgroundImage: `url(${grassSmoky})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              whileHover={{ x: 10 }}
            >
              <span>Explore Our Story</span>
              <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
            </motion.button>
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
          </div>
        </motion.div>

        {/* Right - Services */}
        <motion.div
          className="relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group border-2 md:border-4 border-accent flex-1 min-h-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/players/services")}
          onMouseEnter={() => setHoveredCard('right')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Background image - smoky green */}
          <img 
            src={grassSmoky} 
            alt="" 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              hoveredCard === 'left' ? 'grayscale' : ''
            }`}
          />
          <div className={`absolute inset-0 transition-all duration-500 ${
            hoveredCard === 'right' 
              ? 'bg-gradient-to-t from-accent/30 via-black/20 to-transparent' 
              : 'bg-black/30'
          }`} />
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-4 md:p-12">
            <div>
              <motion.div
                className="inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full bg-accent/30 border border-accent/50 mb-2 md:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                <span className="text-xs md:text-sm font-medium text-accent">Premium Services</span>
              </motion.div>
              
              <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-4" style={{ transform: 'scaleY(1.15)' }}>
                View Our
                <br />
                <span className="text-accent">Services</span>
              </h2>
              
              <p className="text-xs md:text-lg text-white/80 max-w-md hidden md:block">
                Explore our comprehensive range of performance services designed to elevate every aspect of your game.
              </p>
            </div>
            
            <motion.button
              className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-lg text-white border-2 border-accent group-hover:gap-5 transition-all duration-300 w-fit"
              style={{ 
                backgroundImage: `url(${grassSmoky})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              whileHover={{ x: 10 }}
            >
              <span>Browse Services</span>
              <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
            </motion.button>
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Footer tagline */}
      <motion.footer 
        className="py-2 md:py-6 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-muted-foreground text-xs md:text-sm tracking-widest uppercase">
          Change The Game
        </p>
      </motion.footer>
    </div>
  );
};

export default PlayersIntro;
