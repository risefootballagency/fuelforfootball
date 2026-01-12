import { useEffect, useRef } from "react";

export const AnimatedSmokyBackground = ({ className = '' }: { className?: string }) => {
  // Forest green smoke effect - deep emerald tones matching reference
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden bg-[#050d08] ${className}`}>
      {/* Base gradient - deeper forest green */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f12]/90 via-[#061109] to-[#030806]" />
      
      {/* Noise texture overlay for organic feel */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Animated smoke layers - forest green palette */}
      <div className="absolute inset-0">
        {/* Layer 1 - Large dominant smoke clouds */}
        <div 
          className="absolute w-[300%] h-[300%]"
          style={{
            background: `
              radial-gradient(ellipse 150% 100% at 10% 80%, rgba(45, 90, 60, 0.7) 0%, rgba(30, 70, 45, 0.3) 40%, transparent 70%),
              radial-gradient(ellipse 120% 80% at 80% 20%, rgba(35, 80, 50, 0.6) 0%, rgba(25, 60, 40, 0.2) 45%, transparent 65%),
              radial-gradient(ellipse 100% 120% at 50% 100%, rgba(50, 100, 70, 0.5) 0%, transparent 60%)
            `,
            animation: 'smokeMove1 30s ease-in-out infinite',
            filter: 'blur(40px)',
          }}
        />
        
        {/* Layer 2 - Mid-tone swirling mist */}
        <div 
          className="absolute w-[300%] h-[300%]"
          style={{
            background: `
              radial-gradient(ellipse 100% 80% at 70% 60%, rgba(40, 85, 55, 0.6) 0%, transparent 55%),
              radial-gradient(ellipse 80% 100% at 20% 30%, rgba(55, 110, 75, 0.5) 0%, transparent 50%),
              radial-gradient(ellipse 120% 70% at 90% 80%, rgba(35, 75, 50, 0.55) 0%, transparent 60%)
            `,
            animation: 'smokeMove2 25s ease-in-out infinite',
            filter: 'blur(50px)',
          }}
        />
        
        {/* Layer 3 - Lighter accent wisps */}
        <div 
          className="absolute w-[250%] h-[250%]"
          style={{
            background: `
              radial-gradient(ellipse 90% 70% at 30% 70%, rgba(70, 130, 90, 0.45) 0%, transparent 50%),
              radial-gradient(ellipse 70% 90% at 75% 40%, rgba(60, 120, 80, 0.4) 0%, transparent 45%),
              radial-gradient(ellipse 100% 60% at 15% 50%, rgba(80, 140, 100, 0.35) 0%, transparent 55%)
            `,
            animation: 'smokeMove3 20s ease-in-out infinite',
            filter: 'blur(35px)',
          }}
        />
        
        {/* Layer 4 - Deep shadow clouds */}
        <div 
          className="absolute w-[200%] h-[200%]"
          style={{
            background: `
              radial-gradient(circle at 25% 75%, rgba(20, 50, 30, 0.8) 0%, transparent 40%),
              radial-gradient(circle at 80% 30%, rgba(15, 40, 25, 0.7) 0%, transparent 35%),
              radial-gradient(circle at 50% 50%, rgba(25, 55, 35, 0.6) 0%, transparent 45%)
            `,
            animation: 'smokeMove4 35s ease-in-out infinite',
            filter: 'blur(60px)',
          }}
        />
        
        {/* Layer 5 - Bright highlight wisps */}
        <div 
          className="absolute w-[200%] h-[200%]"
          style={{
            background: `
              radial-gradient(ellipse 60% 40% at 60% 80%, rgba(90, 150, 110, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 60% at 20% 20%, rgba(100, 160, 120, 0.25) 0%, transparent 45%)
            `,
            animation: 'smokeMove5 18s ease-in-out infinite',
            filter: 'blur(30px)',
          }}
        />
      </div>
      
      {/* Vignette overlay - stronger edges */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at center, transparent 20%, rgba(3, 8, 5, 0.7) 80%, rgba(2, 5, 3, 0.95) 100%)',
        }}
      />
      
      <style>{`
        @keyframes smokeMove1 {
          0% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
          20% { transform: translate(-10%, 6%) scale(1.1) rotate(1deg); }
          40% { transform: translate(-18%, -4%) scale(1.05) rotate(-2deg); }
          60% { transform: translate(-8%, 10%) scale(1.15) rotate(2deg); }
          80% { transform: translate(-15%, 3%) scale(0.95) rotate(-1deg); }
          100% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
        }
        
        @keyframes smokeMove2 {
          0% { transform: translate(-5%, -5%) scale(1.02) rotate(0deg); }
          25% { transform: translate(8%, 5%) scale(0.92) rotate(-2deg); }
          50% { transform: translate(-12%, 10%) scale(1.12) rotate(3deg); }
          75% { transform: translate(5%, -8%) scale(1.08) rotate(-1deg); }
          100% { transform: translate(-5%, -5%) scale(1.02) rotate(0deg); }
        }
        
        @keyframes smokeMove3 {
          0% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
          33% { transform: translate(-25%, 8%) scale(1.18) rotate(3deg); }
          66% { transform: translate(-10%, -10%) scale(0.88) rotate(-4deg); }
          100% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
        }
        
        @keyframes smokeMove4 {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
          25% { transform: translate(-18%, 12%) scale(1.25); opacity: 0.8; }
          50% { transform: translate(-30%, -8%) scale(1.15); opacity: 0.5; }
          75% { transform: translate(-12%, 18%) scale(1.3); opacity: 0.75; }
          100% { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
        }
        
        @keyframes smokeMove5 {
          0% { transform: translate(0%, 0%) scale(1); opacity: 0.3; }
          50% { transform: translate(-15%, 5%) scale(1.1); opacity: 0.5; }
          100% { transform: translate(0%, 0%) scale(1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
