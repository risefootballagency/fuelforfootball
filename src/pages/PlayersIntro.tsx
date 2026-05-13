import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import GrassBackground from "@/assets/Grass-Background.png";
import grassSmoky from "@/assets/grass-smoky-3.png";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageMapSelector } from "@/components/LanguageMapSelector";
import { SEO } from "@/components/SEO";

const PlayersIntro = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState<'left' | 'right' | null>(null);
  
  // Use preloader hook - 12 for mobile, 54 for desktop (we'll handle this with CSS)
  const { imageUrls, isReady } = useImagePreloader({
    folder: 'landing',
    limit: 54,
    threshold: 0.5,
  });

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      <SEO
        title="For Players | Fuel For Football"
        description="Choose your path with Fuel For Football: career development, representation and performance services for players."
        url="/players-intro"
      />
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
          className="relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group border-2 md:border-4 border-accent flex-1 min-h-0 max-w-[75%] md:max-w-[42%]"
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
          
          {/* Content - always centered */}
          <div className="relative h-full flex flex-col justify-center items-center text-center gap-4 p-4 md:p-6 lg:p-10">
            <motion.div
              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-black/60 border border-accent/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="text-sm md:text-sm font-medium text-white whitespace-nowrap">{t('players_intro.our_approach', 'Our Approach')}</span>
            </motion.div>
            
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-none tracking-wide" 
              style={{ transform: 'scaleY(1.15)' }}
            >
              {t('players_intro.learn_how', 'Learn How')}<br /><span className="text-accent">{t('players_intro.we_work', 'We Work')}</span>
            </h2>
            
            <p className="text-sm md:text-lg text-white/80 max-w-md hidden md:block">
              {t('players_intro.methodology_description', 'Discover our methodology, philosophy, and how we fuel players to reach their full potential.')}
            </p>
            
            <motion.button
              className="inline-flex items-center justify-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-sm md:text-base text-white border-2 border-accent group-hover:gap-4 transition-all duration-300 whitespace-nowrap"
              style={{ 
                backgroundImage: `url(${grassSmoky})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              whileHover={{ x: 10 }}
            >
              <span>{t('players_intro.explore_story', 'Explore Our Story')}</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
          </div>
        </motion.div>

        {/* Right - Services */}
        <motion.div
          className="relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group border-2 md:border-4 border-accent flex-1 min-h-0 max-w-[75%] md:max-w-[42%]"
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
          
          {/* Content - always centered */}
          <div className="relative h-full flex flex-col justify-center items-center text-center gap-4 p-4 md:p-6 lg:p-10">
            <motion.div
              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-black/60 border border-accent/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm md:text-sm font-medium text-white whitespace-nowrap">{t('players_intro.premium_services', 'Premium Services')}</span>
            </motion.div>
            
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-none tracking-wide" 
              style={{ transform: 'scaleY(1.15)' }}
            >
              {t('players_intro.view_our', 'View Our')}<br /><span className="text-accent">{t('players_intro.services', 'Services')}</span>
            </h2>
            
            <p className="text-sm md:text-lg text-white/80 max-w-md hidden md:block">
              {t('players_intro.services_description', 'Explore our comprehensive range of performance services designed to elevate every aspect of your game.')}
            </p>
            
            <motion.button
              className="inline-flex items-center justify-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-semibold text-sm md:text-base text-white border-2 border-accent group-hover:gap-4 transition-all duration-300 whitespace-nowrap"
              style={{ 
                backgroundImage: `url(${grassSmoky})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              whileHover={{ x: 10 }}
            >
              <span>{t('players_intro.browse_services', 'Browse Services')}</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Footer with language selector and tagline */}
      <motion.footer 
        className="py-2 md:py-6 text-center relative z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <LanguageMapSelector />
        <p className="text-muted-foreground text-xs md:text-sm tracking-widest uppercase">
          {t('players_intro.change_the_game', 'Change The Game')}
        </p>
      </motion.footer>
    </div>
  );
};

export default PlayersIntro;
