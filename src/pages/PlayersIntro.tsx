import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import GrassBackground from "@/assets/Grass-Background.png";
import grassSmoky from "@/assets/grass-smoky-3.png";
import { useImagePreloader } from "@/hooks/useImagePreloader";

const PlayersIntro = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<'left' | 'right' | null>(null);
  
  // Use preloader hook - 12 for mobile, 54 for desktop (we'll handle this with CSS)
  const { imageUrls, isReady } = useImagePreloader({
    folder: 'landing',
    limit: 54,
    threshold: 0.8,
  });

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background images grid - fade in when ready */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Mobile: 3x4 grid (12 images), Desktop: 9x6 grid (54 images) */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-4 md:grid-cols-9 md:grid-rows-6 gap-0">
          {imageUrls.slice(0, 54).map((url, index) => (
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
      </motion.div>

      {/* Fallback dark background while loading */}
      {!isReady && <div className="absolute inset-0 bg-black z-0" />}

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
      <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-4 px-6 pb-6 md:px-8 md:pb-8 relative z-10 min-h-0 items-center justify-center">
        {/* Left - Learn More */}
        <motion.div
          className="relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group border-2 md:border-4 border-accent flex-1 min-h-0 max-w-[85%] md:max-w-none"
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
          
          {/* Content - centered on mobile, bottom-aligned on desktop */}
          <div className="relative h-full flex flex-col justify-center md:justify-end gap-4 md:gap-6 p-6 md:p-8 lg:p-12">
            <div className="space-y-3 md:space-y-4">
              <motion.div
                className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-black/60 border border-accent/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="text-sm md:text-sm font-medium text-white">Discover Our Approach</span>
              </motion.div>
              
              <h2 
                className="text-5xl md:text-5xl lg:text-6xl font-bold text-white" 
                style={{ transform: 'scaleY(1.15)' }}
              >
                Learn How
                <br />
                <span className="text-accent">We Work</span>
              </h2>
              
              <p className="text-sm md:text-lg text-white/80 max-w-md hidden md:block">
                Discover our methodology, philosophy, and how we fuel players to reach their full potential.
              </p>
            </div>
            
            <motion.button
              className="inline-flex items-center gap-3 px-6 py-3 md:py-3 rounded-lg font-semibold text-base md:text-lg text-white border-2 border-accent group-hover:gap-5 transition-all duration-300 w-fit"
              style={{ 
                backgroundImage: `url(${grassSmoky})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              whileHover={{ x: 10 }}
            >
              <span>Explore Our Story</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
          </div>
        </motion.div>

        {/* Right - Services */}
        <motion.div
          className="relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group border-2 md:border-4 border-accent flex-1 min-h-0 max-w-[85%] md:max-w-none"
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
          
          {/* Content - centered on mobile, bottom-aligned on desktop */}
          <div className="relative h-full flex flex-col justify-center md:justify-end gap-4 md:gap-6 p-6 md:p-8 lg:p-12">
            <div className="space-y-3 md:space-y-4">
              <motion.div
                className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-black/60 border border-accent/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm md:text-sm font-medium text-white">Premium Services</span>
              </motion.div>
              
              <h2 className="text-5xl md:text-5xl lg:text-6xl font-bold text-white" style={{ transform: 'scaleY(1.15)' }}>
                View Our
                <br />
                <span className="text-accent">Services</span>
              </h2>
              
              <p className="text-sm md:text-lg text-white/80 max-w-md hidden md:block">
                Explore our comprehensive range of performance services designed to elevate every aspect of your game.
              </p>
            </div>
            
            <motion.button
              className="inline-flex items-center gap-3 px-6 py-3 md:py-3 rounded-lg font-semibold text-base md:text-lg text-white border-2 border-accent group-hover:gap-5 transition-all duration-300 w-fit"
              style={{ 
                backgroundImage: `url(${grassSmoky})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              whileHover={{ x: 10 }}
            >
              <span>Browse Services</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
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
