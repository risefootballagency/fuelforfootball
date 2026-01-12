import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";

const PlayersIntro = () => {
  const navigate = useNavigate();

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
          className="flex-1 relative overflow-hidden rounded-2xl cursor-pointer group"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/players")}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(120,80%,8%)] via-[hsl(120,70%,12%)] to-[hsl(120,60%,18%)]" />
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-8 md:p-12 min-h-[300px] md:min-h-[400px]">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Discover Our Approach</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ transform: 'scaleY(1.15)' }}>
                Learn How
                <br />
                <span className="text-primary">We Work</span>
              </h2>
              
              <p className="text-lg text-white/70 max-w-md">
                Discover our methodology, philosophy, and how we fuel players to reach their full potential.
              </p>
            </div>
            
            <motion.div 
              className="flex items-center gap-3 text-primary font-semibold text-lg group-hover:gap-5 transition-all duration-300"
              whileHover={{ x: 10 }}
            >
              <span>Explore Our Story</span>
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
        </motion.div>

        {/* Right - Services */}
        <motion.div
          className="flex-1 relative overflow-hidden rounded-2xl cursor-pointer group"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/players/services")}
        >
          {/* Background gradient - Orange/Gold theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(36,100%,15%)] via-[hsl(36,90%,20%)] to-[hsl(36,80%,25%)]" />
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(36,100%,50%) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-8 md:p-12 min-h-[300px] md:min-h-[400px]">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(36,100%,50%)]/20 border border-[hsl(36,100%,50%)]/30 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-[hsl(36,100%,50%)]" />
                <span className="text-sm font-medium text-[hsl(36,100%,50%)]">Premium Services</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ transform: 'scaleY(1.15)' }}>
                View Our
                <br />
                <span className="text-[hsl(36,100%,50%)]">Services</span>
              </h2>
              
              <p className="text-lg text-white/70 max-w-md">
                Explore our comprehensive range of performance services designed to elevate every aspect of your game.
              </p>
            </div>
            
            <motion.div 
              className="flex items-center gap-3 text-[hsl(36,100%,50%)] font-semibold text-lg group-hover:gap-5 transition-all duration-300"
              whileHover={{ x: 10 }}
            >
              <span>Browse Services</span>
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </div>
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(36,100%,50%)]/20 to-transparent" />
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
          Fuel Your Potential
        </p>
      </motion.footer>
    </div>
  );
};

export default PlayersIntro;
