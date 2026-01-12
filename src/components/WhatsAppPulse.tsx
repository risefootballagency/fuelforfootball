import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface WhatsAppPulseProps {
  /** Delay before showing in ms */
  showDelay?: number;
  /** Position on screen */
  position?: "bottom-right" | "bottom-left" | "inline";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom message */
  message?: string;
  /** Show urgency text */
  showUrgency?: boolean;
}

const WHATSAPP_NUMBER = "447508342901";

export const WhatsAppPulse = ({ 
  showDelay = 3000, 
  position = "bottom-right",
  size = "md",
  message = "Speak to us now",
  showUrgency = true
}: WhatsAppPulseProps) => {
  const [isVisible, setIsVisible] = useState(showDelay === 0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (showDelay > 0) {
      const timer = setTimeout(() => setIsVisible(true), showDelay);
      return () => clearTimeout(timer);
    }
  }, [showDelay]);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-14 h-14 md:w-16 md:h-16",
    lg: "w-16 h-16 md:w-20 md:h-20"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6 md:w-7 md:h-7",
    lg: "w-7 h-7 md:w-9 md:h-9"
  };

  const positionClasses = {
    "bottom-right": "fixed bottom-6 right-6 z-50",
    "bottom-left": "fixed bottom-6 left-6 z-50",
    "inline": "relative"
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("I want to take my game to the next level.")}`;

  if (position === "inline") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-full font-bebas uppercase tracking-wider transition-all duration-300 hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
        <span>{message}</span>
        {showUrgency && (
          <span className="text-xs opacity-80 normal-case font-sans">• Response in minutes</span>
        )}
      </a>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className={positionClasses[position]}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Expanded message on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
              >
                <div className="bg-black/90 backdrop-blur-sm border border-[#25D366]/30 rounded-lg px-4 py-2">
                  <p className="text-white font-bebas uppercase tracking-wider text-sm">{message}</p>
                  {showUrgency && (
                    <p className="text-[#25D366] text-xs mt-0.5">Your competition isn't waiting.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizeClasses[size]} flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] rounded-full shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 relative`}
          >
            {/* Pulse rings */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse opacity-20" style={{ animationDelay: "0.5s" }} />
            
            <MessageCircle className={`${iconSizes[size]} text-white relative z-10`} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppPulse;
