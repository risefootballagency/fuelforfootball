import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BrandFadeOverlayProps {
  duration?: number;
  delay?: number;
}

export const BrandFadeOverlay = ({ 
  duration = 1.2, 
  delay = 0.3 
}: BrandFadeOverlayProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fade out after the delay
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <>
      {/* Fixed gradient background (light → dark green) - revealed as white fades */}
      <div 
        className="fixed inset-0 z-40 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            hsl(152, 100%, 32%) 0%,
            hsl(150, 100%, 20%) 100%
          )`
        }}
      />
      
      {/* White overlay that fades out */}
      <motion.div
        className="fixed inset-0 z-50 bg-white pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ 
          duration: duration, 
          ease: "easeOut" 
        }}
        onAnimationComplete={() => {
          // After fade complete, we can fully hide
          if (!isVisible) {
            // Optionally trigger callback here
          }
        }}
      />
    </>
  );
};
