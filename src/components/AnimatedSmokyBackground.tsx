import { useEffect, useRef } from "react";

export const AnimatedSmokyBackground = ({ className = '' }: { className?: string }) => {
  // Brand mint color #c5db9e = rgba(197, 219, 158, opacity)
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden bg-[#0a1a0a] ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d2818]/80 via-[#0a1a0a] to-[#051005]" />
      
      {/* Animated smoke layers using brand mint #c5db9e */}
      <div className="absolute inset-0">
        {/* Layer 1 - Large dominant smoke streaks */}
        <div 
          className="absolute w-[300%] h-[300%]"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 15% 25%, rgba(197, 219, 158, 0.5) 0%, transparent 60%),
              radial-gradient(ellipse 100% 70% at 75% 50%, rgba(197, 219, 158, 0.45) 0%, transparent 55%),
              radial-gradient(ellipse 140% 90% at 35% 85%, rgba(180, 205, 140, 0.5) 0%, transparent 65%)
            `,
            animation: 'smokeMove1 25s ease-in-out infinite',
          }}
        />
        
        {/* Layer 2 - Medium bold streaks */}
        <div 
          className="absolute w-[300%] h-[300%]"
          style={{
            background: `
              radial-gradient(ellipse 110% 75% at 55% 35%, rgba(197, 219, 158, 0.45) 0%, transparent 60%),
              radial-gradient(ellipse 90% 60% at 25% 65%, rgba(210, 230, 175, 0.4) 0%, transparent 55%),
              radial-gradient(ellipse 130% 85% at 85% 15%, rgba(180, 205, 140, 0.45) 0%, transparent 60%)
            `,
            animation: 'smokeMove2 20s ease-in-out infinite',
          }}
        />
        
        {/* Layer 3 - Prominent wisps */}
        <div 
          className="absolute w-[250%] h-[250%]"
          style={{
            background: `
              radial-gradient(ellipse 80% 55% at 45% 45%, rgba(210, 230, 175, 0.5) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 15% 35%, rgba(220, 238, 190, 0.45) 0%, transparent 45%),
              radial-gradient(ellipse 85% 60% at 80% 70%, rgba(197, 219, 158, 0.5) 0%, transparent 50%)
            `,
            animation: 'smokeMove3 15s ease-in-out infinite',
          }}
        />
        
        {/* Layer 4 - Large floating clouds */}
        <div 
          className="absolute w-[200%] h-[200%]"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(220, 238, 190, 0.4) 0%, transparent 35%),
              radial-gradient(circle at 70% 50%, rgba(230, 245, 210, 0.35) 0%, transparent 30%),
              radial-gradient(circle at 40% 80%, rgba(220, 238, 190, 0.4) 0%, transparent 32%)
            `,
            animation: 'smokeMove4 30s ease-in-out infinite',
          }}
        />
      </div>
      
      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5, 16, 5, 0.6) 100%)',
        }}
      />
      
      <style>{`
        @keyframes smokeMove1 {
          0% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
          20% { transform: translate(-8%, 4%) scale(1.08) rotate(2deg); }
          40% { transform: translate(-15%, -3%) scale(1.03) rotate(-1deg); }
          60% { transform: translate(-5%, 8%) scale(1.12) rotate(3deg); }
          80% { transform: translate(-12%, 2%) scale(0.98) rotate(-2deg); }
          100% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
        }
        
        @keyframes smokeMove2 {
          0% { transform: translate(-5%, -5%) scale(1.02) rotate(0deg); }
          25% { transform: translate(5%, 3%) scale(0.95) rotate(-3deg); }
          50% { transform: translate(-10%, 8%) scale(1.1) rotate(2deg); }
          75% { transform: translate(3%, -6%) scale(1.05) rotate(-1deg); }
          100% { transform: translate(-5%, -5%) scale(1.02) rotate(0deg); }
        }
        
        @keyframes smokeMove3 {
          0% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
          33% { transform: translate(-20%, 5%) scale(1.15) rotate(4deg); }
          66% { transform: translate(-8%, -8%) scale(0.92) rotate(-3deg); }
          100% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
        }
        
        @keyframes smokeMove4 {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.2; }
          25% { transform: translate(-15%, 10%) scale(1.2); opacity: 0.35; }
          50% { transform: translate(-25%, -5%) scale(1.1); opacity: 0.25; }
          75% { transform: translate(-10%, 15%) scale(1.25); opacity: 0.4; }
          100% { transform: translate(0%, 0%) scale(1); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};
