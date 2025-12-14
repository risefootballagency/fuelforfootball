import { useEffect, useRef } from "react";

export const AnimatedSmokyBackground = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden bg-[#0a1a0a] ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d2818]/80 via-[#0a1a0a] to-[#051005]" />
      
      {/* Animated smoke layers */}
      <div className="absolute inset-0">
        {/* Layer 1 - Large slow moving smoke */}
        <div 
          className="absolute w-[200%] h-[200%] opacity-40"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 30%, rgba(34, 139, 34, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 70% 60%, rgba(46, 125, 50, 0.25) 0%, transparent 45%),
              radial-gradient(ellipse 90% 60% at 40% 80%, rgba(27, 94, 32, 0.35) 0%, transparent 55%)
            `,
            animation: 'smokeMove1 25s ease-in-out infinite',
          }}
        />
        
        {/* Layer 2 - Medium movement */}
        <div 
          className="absolute w-[200%] h-[200%] opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 70% 45% at 60% 40%, rgba(56, 142, 60, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 35% at 30% 70%, rgba(67, 160, 71, 0.2) 0%, transparent 45%),
              radial-gradient(ellipse 80% 55% at 80% 20%, rgba(38, 106, 46, 0.25) 0%, transparent 50%)
            `,
            animation: 'smokeMove2 20s ease-in-out infinite',
          }}
        />
        
        {/* Layer 3 - Faster wisps */}
        <div 
          className="absolute w-[200%] h-[200%] opacity-25"
          style={{
            background: `
              radial-gradient(ellipse 40% 30% at 50% 50%, rgba(76, 175, 80, 0.25) 0%, transparent 40%),
              radial-gradient(ellipse 35% 25% at 20% 40%, rgba(102, 187, 106, 0.2) 0%, transparent 35%),
              radial-gradient(ellipse 45% 35% at 75% 65%, rgba(56, 142, 60, 0.2) 0%, transparent 40%)
            `,
            animation: 'smokeMove3 15s ease-in-out infinite',
          }}
        />
        
        {/* Layer 4 - Subtle floating particles */}
        <div 
          className="absolute w-[150%] h-[150%] opacity-20"
          style={{
            background: `
              radial-gradient(circle at 25% 35%, rgba(129, 199, 132, 0.15) 0%, transparent 25%),
              radial-gradient(circle at 65% 55%, rgba(165, 214, 167, 0.1) 0%, transparent 20%),
              radial-gradient(circle at 45% 75%, rgba(200, 230, 201, 0.12) 0%, transparent 22%)
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
