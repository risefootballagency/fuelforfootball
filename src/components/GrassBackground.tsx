import greenSmokyBackground from "@/assets/green-smoky-background.png";

interface GrassBackgroundProps {
  variant?: 'top' | 'bottom' | 'divider' | 'section';
  className?: string;
}

export const GrassBackground = ({ variant = 'divider', className = '' }: GrassBackgroundProps) => {
  if (variant === 'top') {
    return (
      <div className={`w-full overflow-hidden ${className}`}>
        <img 
          src="https://static.wixstatic.com/media/c4f4b1_03f449f904434796adf7c54c2d929f78~mv2.png/v1/fill/w_1904,h_52,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_03f449f904434796adf7c54c2d929f78~mv2.png"
          alt=""
          className="w-full h-auto object-cover"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (variant === 'bottom') {
    return (
      <div className={`w-full overflow-hidden rotate-180 ${className}`}>
        <img 
          src="https://static.wixstatic.com/media/c4f4b1_03f449f904434796adf7c54c2d929f78~mv2.png/v1/fill/w_1904,h_52,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_03f449f904434796adf7c54c2d929f78~mv2.png"
          alt=""
          className="w-full h-auto object-cover"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (variant === 'divider') {
    return (
      <div className={`w-full overflow-hidden ${className}`}>
        <img 
          src="https://static.wixstatic.com/media/c4f4b1_152388c2eb9241f48863776d6ca92aff~mv2.jpg/v1/crop/x_0,y_113,w_2000,h_107/fill/w_1904,h_66,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Background%20Header.jpg"
          alt=""
          className="w-full h-auto object-cover"
          aria-hidden="true"
        />
      </div>
    );
  }

  // section - full atmospheric background
  return (
    <div 
      className={`absolute inset-0 z-0 ${className}`}
      style={{
        backgroundImage: `url('https://static.wixstatic.com/media/c4f4b1_8bec300b742b42df84829849d26331f1~mv2.jpg/v1/fill/w_1904,h_800,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_8bec300b742b42df84829849d26331f1~mv2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
};

export const SmokyBackground = ({ className = '' }: { className?: string }) => {
  return (
    <div 
      className={`absolute inset-0 z-0 ${className}`}
      style={{
        backgroundImage: `url(${greenSmokyBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
};
