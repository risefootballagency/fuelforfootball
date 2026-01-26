import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Dumbbell, Zap, Target, Lightbulb, ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverText } from "@/components/HoverText";

interface FuelCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  link: string;
  description: string;
  highlights: string[];
}

// Categories in alphabetical order with Psychological/Mental added
const fuelCategories: FuelCategory[] = [
  {
    id: "conditioning",
    name: "Conditioning",
    icon: Dumbbell,
    link: "/conditioning",
    description: "Build an engine that outlasts opponents. Our conditioning programmes extend your capacity and maintain performance when others fade.",
    highlights: ["Energy system development", "Position-specific training", "Workload tolerance"],
  },
  {
    id: "nutrition",
    name: "Nutrition",
    icon: Utensils,
    link: "/nutrition",
    description: "Optimise your body's fuel system with bespoke nutrition plans. From match day prep to body composition, our expert guidance removes the guesswork.",
    highlights: ["Personalised meal plans", "Match day fuelling", "Body composition support"],
  },
  {
    id: "psychological",
    name: "Psychological",
    icon: Brain,
    link: "/mental",
    description: "Develop mental skills in consistency, commitment, confidence, resilience, and focus. Outwill opponents to overcome skill differences and dominate.",
    highlights: ["Mental resilience", "Performance psychology", "Focus & consistency"],
  },
  {
    id: "sps",
    name: "Strength, Power & Speed",
    icon: Zap,
    link: "/strength-power-speed",
    description: "Become faster, stronger and more explosive. Our individualised programmes push your physical limits while reducing injury risk.",
    highlights: ["Speed development", "Power training", "Injury prevention"],
  },
  {
    id: "tactical",
    name: "Tactical",
    icon: Target,
    link: "/tactical",
    description: "Unlock new dimensions to your game. Transform decision-making and positional awareness through detailed analysis and tactical education.",
    highlights: ["Opposition analysis", "Position-specific insights", "Game reading"],
  },
  {
    id: "technical",
    name: "Technical",
    icon: Lightbulb,
    link: "/technical",
    description: "Master ball control and execution. Our evidence-based approach refines your technical abilities through structured training and programming.",
    highlights: ["Ball mastery", "Finishing techniques", "Under-pressure execution"],
  },
];

export const ChooseYourFuel = () => {
  const [activeCategory, setActiveCategory] = useState<string>("conditioning");
  const [hasInteracted, setHasInteracted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const activeItem = fuelCategories.find(cat => cat.id === activeCategory);

  // Auto slideshow - 5 seconds, stops when user interacts
  useEffect(() => {
    if (hasInteracted) return;
    
    intervalRef.current = setInterval(() => {
      setActiveCategory(prev => {
        const currentIndex = fuelCategories.findIndex(cat => cat.id === prev);
        const nextIndex = (currentIndex + 1) % fuelCategories.length;
        return fuelCategories[nextIndex].id;
      });
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasInteracted]);

  const handleCategoryClick = (categoryId: string) => {
    setHasInteracted(true);
    setActiveCategory(categoryId);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto">
        {/* Title with smoky background */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8 md:mb-12">
          <div 
            className="w-screen relative left-1/2 -translate-x-1/2 py-4 md:py-6 overflow-hidden border-y-4 border-accent"
            style={{
              backgroundImage: `url('/grass-bg-smoky.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider text-center text-white container mx-auto drop-shadow-lg">
              <HoverText text="Choose Your Fuel" />
            </h2>
          </div>
        </div>
        
        <p className="text-center text-muted-foreground text-sm md:text-lg max-w-3xl mx-auto mb-8 md:mb-12">
          Already aware of where you need to work to make the greatest improvements to your game? Select a category to learn more.
        </p>

        {/* Category Selector - 3x2 grid on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 max-w-4xl mx-auto">
          {fuelCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 rounded-lg font-bebas uppercase tracking-wider text-sm md:text-base transition-all duration-300 ${
                  isActive 
                    ? "bg-accent text-accent-foreground scale-105" 
                    : "bg-card/50 border border-border/50 text-foreground hover:bg-card hover:border-accent/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto bg-card/50 border border-border/50 rounded-xl p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50">
                      <activeItem.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bebas uppercase tracking-wider text-foreground">
                      {activeItem.name}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                    {activeItem.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeItem.highlights.map((highlight, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-xs font-medium text-accent"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link to={activeItem.link} className="w-full md:w-auto">
                  <Button 
                    className="w-full md:w-auto gap-2 font-bebas uppercase tracking-wider text-white relative overflow-hidden border-2 border-accent"
                  >
                    <div 
                      className="absolute inset-0 z-0"
                      style={{
                        backgroundImage: `url('/grass-bg-smoky.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};