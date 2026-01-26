import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { X, Clock, Trophy, ChevronRight } from "lucide-react";

interface CaseStudy {
  id: string;
  player_name: string;
  player_image_url: string | null;
  duration: string | null;
  summary: string | null;
  full_story: string | null;
  services_used: string[] | null;
  achievements: string[] | null;
  testimonial: string | null;
}

export const CaseStudySlider = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [xOffset, setXOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  
  useEffect(() => {
    const fetchCaseStudies = async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
      
      if (data && data.length > 0) {
        setCaseStudies(data);
      }
      // If no data, caseStudies remains empty and component returns null
    };

    fetchCaseStudies();
  }, []);

  // Double the case studies for seamless loop
  const doubledStudies = [...caseStudies, ...caseStudies];
  const itemWidth = 200;
  const totalWidth = caseStudies.length * itemWidth;

  useAnimationFrame((time, delta) => {
    if (isPaused.current || selectedStudy || caseStudies.length === 0) return;
    setXOffset(prev => {
      const next = prev - (delta / 1000) * 25; // Slower speed for case studies
      // Reset to beginning when we've scrolled through one full set
      if (Math.abs(next) >= totalWidth) {
        return next + totalWidth;
      }
      return next;
    });
  });

  // Don't render if no case studies from database
  if (caseStudies.length === 0) return null;

  return (
    <>
      <section className="py-8 md:py-12 bg-gradient-to-b from-background via-card/20 to-background overflow-hidden">
        <div className="container mx-auto px-4 mb-6">
          <span className="text-xs font-bebas uppercase tracking-[0.3em] text-primary/60 block mb-2 text-center">
            Success Stories
          </span>
          <h2 className="text-2xl md:text-4xl font-bebas uppercase tracking-wider text-center text-foreground mb-2">
            Players Who <span className="text-primary">Took Action</span>
          </h2>
          <p className="text-center text-muted-foreground text-xs md:text-sm max-w-xl mx-auto">
            Click on any player to discover their journey with us
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full"
          onMouseEnter={() => isPaused.current = true}
          onMouseLeave={() => isPaused.current = false}
        >
          <motion.div 
            className="flex gap-8 py-4"
            style={{ x: xOffset }}
          >
            {doubledStudies.map((study, index) => (
              <motion.div
                key={`${study.id}-${index}`}
                className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setSelectedStudy(study)}
              >
                {/* Circle Container */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl shadow-primary/10 group-hover:border-primary group-hover:shadow-primary/40 transition-all duration-300">
                  {/* Glossy Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 z-10 pointer-events-none" />
                  
                  {/* Player Image - Grayscale for anonymity */}
                  <img 
                    src={study.player_image_url || 'https://via.placeholder.com/150'} 
                    alt="Elite Player"
                    className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Hover Reveal Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                    <ChevronRight className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-bebas text-xs md:text-sm text-primary tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {study.duration || 'Ongoing'}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        </div>
      </section>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedStudy(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card border border-primary/30 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStudy(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Header with Image */}
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img 
                  src={selectedStudy.player_image_url || 'https://via.placeholder.com/600x300'} 
                  alt="Elite Player"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                {/* Duration Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-primary/90 text-black px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="font-bebas tracking-wider text-sm">{selectedStudy.duration || 'Ongoing'}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Summary */}
                <div>
                  <h3 className="font-bebas text-2xl md:text-3xl text-primary tracking-wider mb-2">
                    FUELLED SUCCESS STORY
                  </h3>
                  <p className="text-foreground text-sm md:text-base">
                    {selectedStudy.summary}
                  </p>
                </div>

                {/* Full Story */}
                {selectedStudy.full_story && (
                  <div>
                    <h4 className="font-bebas text-lg text-white tracking-wider mb-2">THE JOURNEY</h4>
                    <p className="text-muted-foreground text-sm">
                      {selectedStudy.full_story}
                    </p>
                  </div>
                )}

                {/* Services Used */}
                {selectedStudy.services_used && selectedStudy.services_used.length > 0 && (
                  <div>
                    <h4 className="font-bebas text-lg text-white tracking-wider mb-2">SERVICES UTILIZED</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudy.services_used.map((service, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-primary/20 text-primary text-xs font-bebas tracking-wider rounded-full border border-primary/30"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {selectedStudy.achievements && selectedStudy.achievements.length > 0 && (
                  <div>
                    <h4 className="font-bebas text-lg text-white tracking-wider mb-2">KEY ACHIEVEMENTS</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedStudy.achievements.map((achievement, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20"
                        >
                          <Trophy className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="text-foreground text-xs md:text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonial */}
                {selectedStudy.testimonial && (
                  <div className="bg-muted/30 rounded-xl p-4 border-l-4 border-primary">
                    <p className="text-foreground italic text-sm md:text-base">
                      "{selectedStudy.testimonial}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CaseStudySlider;