import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import GrassBackground from "@/assets/Grass-Background.png";
import grassSmoky from "@/assets/grass-smoky-3.png";

const PlayersIntro = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<'left' | 'right' | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with FFF branding */}
      <header className="py-6 px-8 flex justify-center">
        <motion.img
          src="/fff_logo.png"
          alt="Fuel For Football"
          className="h-16 md:h-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
      </header>

      {/* Main content - Two large rectangles */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-8">
        {/* Left - Learn More */}
        <motion.div
          className="relative overflow-hidden rounded-2xl cursor-pointer group border-4 border-accent flex-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/players")}
          onMouseEnter={() => setHoveredCard('left')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ minHeight: '300px' }}
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
          <div className="relative h-full flex flex-col justify-between p-8 md:p-12 min-h-[300px] md:min-h-[400px]">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/30 border border-accent/50 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Discover Our Approach</span>
              </motion.div>
              
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" 
                style={{ transform: 'scaleY(1.15)' }}
              >
                Learn How
                <br />
                <span className="text-accent">We Work</span>
              </h2>
              
              <p className="text-lg text-white/80 max-w-md mb-6">
                Discover our methodology, philosophy, and how we fuel players to reach their full potential.
              </p>
            </div>
            
            <motion.button
              className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-lg text-white border-2 border-accent group-hover:gap-5 transition-all duration-300"
              style={{ 
                backgroundImage: `url(${grassSmoky})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              whileHover={{ x: 10 }}
            >
              <span>Explore Our Story</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
          </div>
        </motion.div>

        {/* Right - Services */}
        <motion.div
          className="relative overflow-hidden rounded-2xl cursor-pointer group border-4 border-accent flex-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/players/services")}
          onMouseEnter={() => setHoveredCard('right')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ minHeight: '300px' }}
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
          <div className="relative h-full flex flex-col justify-between p-8 md:p-12 min-h-[300px] md:min-h-[400px]">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/30 border border-accent/50 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Premium Services</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ transform: 'scaleY(1.15)' }}>
                View Our
                <br />
                <span className="text-accent">Services</span>
              </h2>
              
              <p className="text-lg text-white/80 max-w-md mb-6">
                Explore our comprehensive range of performance services designed to elevate every aspect of your game.
              </p>
            </div>
            
            <motion.button
              className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-lg text-white border-2 border-accent group-hover:gap-5 transition-all duration-300"
              style={{ 
                backgroundImage: `url(${grassSmoky})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              whileHover={{ x: 10 }}
            >
              <span>Browse Services</span>
              <ArrowRight className="w-6 h-6" />
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
        className="py-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-muted-foreground text-sm tracking-widest uppercase">
          Change The Game
        </p>
      </motion.footer>
    </div>
  );
};

export default PlayersIntro;
