import { motion } from "framer-motion";
import { WhatsAppPulse } from "./WhatsAppPulse";

interface EliteMessagingProps {
  variant?: "fomo" | "challenge" | "exclusivity" | "urgency";
  showCta?: boolean;
  className?: string;
}

const MESSAGING = {
  fomo: {
    headline: "While You Wait, Others Train",
    subline: "Every day you hesitate is another day your competition gets ahead.",
    cta: "Don't get left behind",
  },
  challenge: {
    headline: "Your Competition Isn't Resting",
    subline: "The players who made it didn't wait for the perfect moment. They created it.",
    cta: "Take action now",
  },
  exclusivity: {
    headline: "Only 3% Make It",
    subline: "We work with the ones who will. The question is: are you one of them?",
    cta: "Prove yourself",
  },
  urgency: {
    headline: "The Window Is Closing",
    subline: "Your peak years are limited. The scouts are watching now, not later.",
    cta: "Act before it's too late",
  },
};

export const EliteMessaging = ({ 
  variant = "fomo", 
  showCta = true,
  className = "" 
}: EliteMessagingProps) => {
  const content = MESSAGING[variant];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-center py-12 md:py-20 px-4 ${className}`}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bebas uppercase tracking-wider text-foreground mb-4">
          {content.headline}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {content.subline}
        </p>
        {showCta && (
          <WhatsAppPulse 
            position="inline" 
            message={content.cta}
            showDelay={0}
          />
        )}
      </div>
    </motion.div>
  );
};

// Rotating propaganda messages for use in banners
const ROTATING_MESSAGES = [
  "Your competition is training right now.",
  "The ones who made it didn't wait.",
  "Every delay costs you opportunities.",
  "Scouts don't wait. Neither should you.",
  "3% make it. We work with them.",
  "Your peak years are limited.",
  "Others are getting ahead while you hesitate.",
  "The window is closing.",
];

export const PropagandaBanner = ({ className = "" }: { className?: string }) => (
  <div className={`py-3 bg-primary/10 border-y border-primary/20 overflow-hidden ${className}`}>
    <motion.div
      animate={{ x: [0, -2000] }}
      transition={{ 
        x: { repeat: Infinity, duration: 30, ease: "linear" },
      }}
      className="flex gap-12 whitespace-nowrap"
    >
      {[...ROTATING_MESSAGES, ...ROTATING_MESSAGES].map((msg, i) => (
        <span key={i} className="text-sm font-bebas uppercase tracking-widest text-foreground/80">
          {msg} <span className="text-primary mx-4">•</span>
        </span>
      ))}
    </motion.div>
  </div>
);

// Shadowy elite silhouette section
export const ShadowyEliteSection = ({ className = "" }: { className?: string }) => (
  <div className={`relative py-16 md:py-24 bg-black overflow-hidden ${className}`}>
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0" style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)`
      }} />
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-12">
        <span className="text-xs font-bebas uppercase tracking-[0.3em] text-primary/60 block mb-4">
          Behind The Scenes
        </span>
        <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider text-white mb-4">
          Working With <span className="text-primary">Elite Talent</span>
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto">
          From Premier League stars to rising academy players, we operate in the shadows of the game,
          developing the next generation of world-class footballers.
        </p>
      </div>

      {/* Shadowy stat boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "74", label: "Pro Players" },
          { value: "18", label: "Big 5 Leagues" },
          { value: "10", label: "National Teams" },
          { value: "€100M+", label: "Transfer Value" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-lg p-6 text-center backdrop-blur-sm"
          >
            <div className="text-3xl md:text-4xl font-bebas text-primary">{stat.value}</div>
            <div className="text-xs font-bebas uppercase tracking-widest text-white/50 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-white/30 text-sm italic mb-6">
          "We don't publicize our work. Our players' success speaks for itself."
        </p>
        <WhatsAppPulse position="inline" message="Join the elite" showDelay={0} />
      </div>
    </div>
  </div>
);

export default EliteMessaging;
