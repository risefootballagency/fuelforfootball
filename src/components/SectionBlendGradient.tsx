// Section blend gradient for smooth transitions between different colored sections
interface SectionBlendGradientProps {
  fromColor?: string; // HSL or CSS color
  toColor?: string;   // HSL or CSS color
  height?: string;
  className?: string;
  direction?: 'down' | 'up';
}

export const SectionBlendGradient = ({
  fromColor = 'hsl(var(--background))',
  toColor = 'hsl(var(--background))',
  height = '6rem',
  className = '',
  direction = 'down'
}: SectionBlendGradientProps) => {
  const gradientDirection = direction === 'down' ? 'to bottom' : 'to top';
  
  return (
    <div 
      className={`w-full pointer-events-none ${className}`}
      style={{
        height,
        background: `linear-gradient(${gradientDirection}, ${fromColor}, ${toColor})`
      }}
      aria-hidden="true"
    />
  );
};

// Preset gradients for common section transitions
export const BackgroundToCard = () => (
  <SectionBlendGradient 
    fromColor="hsl(var(--background))" 
    toColor="hsl(var(--card))" 
  />
);

export const CardToBackground = () => (
  <SectionBlendGradient 
    fromColor="hsl(var(--card))" 
    toColor="hsl(var(--background))" 
  />
);

export const BackgroundToPrimary = () => (
  <SectionBlendGradient 
    fromColor="hsl(var(--background))" 
    toColor="hsl(var(--primary) / 0.1)" 
  />
);

export const PrimaryToBackground = () => (
  <SectionBlendGradient 
    fromColor="hsl(var(--primary) / 0.1)" 
    toColor="hsl(var(--background))" 
  />
);

// Dark to transparent fade for overlays
export const FadeFromDark = ({ height = '8rem' }: { height?: string }) => (
  <div 
    className="w-full pointer-events-none"
    style={{
      height,
      background: 'linear-gradient(to bottom, hsl(var(--background)), transparent)'
    }}
    aria-hidden="true"
  />
);

export const FadeToDark = ({ height = '8rem' }: { height?: string }) => (
  <div 
    className="w-full pointer-events-none"
    style={{
      height,
      background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))'
    }}
    aria-hidden="true"
  />
);
