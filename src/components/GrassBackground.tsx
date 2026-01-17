// FFF Brand Background Assets
// Renamed for clarity:
// - Grass-Background.png = actual grass field texture
// - Smoky-Background.png = green smoky atmosphere
// - grass-smoky-1 through 8 = variations of smoky green

import grassTextureFull from "@/assets/grass-texture-full.png";
import GrassBackgroundImg from "@/assets/Grass-Background.png";
import SmokyBackgroundImg from "@/assets/Smoky-Background.png";
import grassSmoky1 from "@/assets/grass-smoky-1.png";
import grassSmoky2 from "@/assets/grass-smoky-2.png";
import grassSmoky3 from "@/assets/grass-smoky-3.png";
import grassSmoky4 from "@/assets/grass-smoky-4.png";
import grassSmoky5 from "@/assets/grass-smoky-5.png";
import grassSmoky6 from "@/assets/grass-smoky-6.png";
import grassSmoky7 from "@/assets/grass-smoky-7.png";
import grassSmoky8 from "@/assets/grass-smoky-8.png";

// Export all backgrounds for use across the site
export const GRASS_BACKGROUNDS = {
  textureFull: grassTextureFull,
  grassBackground: GrassBackgroundImg, // Actual grass field texture
  smokyBackground: SmokyBackgroundImg, // Green smoky atmosphere
  smoky1: grassSmoky1,
  smoky2: grassSmoky2,
  smoky3: grassSmoky3,
  smoky4: grassSmoky4,
  smoky5: grassSmoky5,
  smoky6: grassSmoky6,
  smoky7: grassSmoky7,
  smoky8: grassSmoky8,
} as const;

// Wide/banner smoky backgrounds (good for dividers, headers)
export const WIDE_BACKGROUNDS = [grassSmoky1, grassSmoky2, grassSmoky3, grassSmoky4, grassSmoky5, grassSmoky6, grassSmoky7];

// Darker corner backgrounds (good for sections with content overlay)
export const DARK_BACKGROUNDS = [grassSmoky7, grassSmoky8];

// Full texture background (good for full-page backgrounds)
export const FULL_TEXTURE = grassTextureFull;

interface GrassBackgroundProps {
  variant?: 'top' | 'bottom' | 'divider' | 'section' | 'hero' | 'card';
  className?: string;
  backgroundIndex?: number; // Select specific smoky background (0-7)
}

export const GrassBackground = ({ variant = 'divider', className = '', backgroundIndex = 0 }: GrassBackgroundProps) => {
  const smokyBg = WIDE_BACKGROUNDS[backgroundIndex % WIDE_BACKGROUNDS.length];

  if (variant === 'top') {
    return (
      <div className={`w-full overflow-hidden h-16 md:h-24 ${className}`}>
        <img 
          src={smokyBg}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (variant === 'bottom') {
    return (
      <div className={`w-full overflow-hidden rotate-180 h-16 md:h-24 ${className}`}>
        <img 
          src={smokyBg}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (variant === 'divider') {
    return (
      <div className={`w-full overflow-hidden h-12 md:h-16 ${className}`}>
        <img 
          src={smokyBg}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div 
        className={`absolute inset-0 z-0 ${className}`}
        style={{
          backgroundImage: `url(${grassTextureFull})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div 
        className={`absolute inset-0 z-0 opacity-30 ${className}`}
        style={{
          backgroundImage: `url(${DARK_BACKGROUNDS[backgroundIndex % DARK_BACKGROUNDS.length]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
    );
  }

  // section - full atmospheric background
  return (
    <div 
      className={`absolute inset-0 z-0 ${className}`}
      style={{
        backgroundImage: `url(${smokyBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
};

// Smoky section background component for use in content sections
export const SmokyBackground = ({ className = '', backgroundIndex = 0 }: { className?: string; backgroundIndex?: number }) => {
  const bg = WIDE_BACKGROUNDS[backgroundIndex % WIDE_BACKGROUNDS.length];
  
  return (
    <div 
      className={`absolute inset-0 z-0 ${className}`}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
};

// Full grass texture background
export const GrassTextureBackground = ({ className = '' }: { className?: string }) => {
  return (
    <div 
      className={`absolute inset-0 z-0 ${className}`}
      style={{
        backgroundImage: `url(${grassTextureFull})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
};
