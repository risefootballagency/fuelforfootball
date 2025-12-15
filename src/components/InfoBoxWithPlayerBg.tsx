import React from 'react';

interface InfoBoxWithPlayerBgProps {
  children: React.ReactNode;
  playerImage?: string;
  className?: string;
  imagePosition?: 'left' | 'right' | 'center';
  imageOpacity?: number;
  style?: React.CSSProperties;
}

// Available player images for use across the site
export const PLAYER_BG_IMAGES = [
  '/players/tyrese-omotoye.png',
  '/players/michael-mulligan.png',
  '/players/jaroslav-svoboda.jpg',
  '/players/ongenda.jpg',
  '/players/masangu.jpg',
  '/players/cardoso.png',
  '/players/grujic.png',
  '/players/kiyine.jpg',
  '/players/junior-nsangou.jpg',
  '/players/balaj.png',
  '/players/aboubacar-doumbia.png',
  '/players/bacalu.png',
];

export const InfoBoxWithPlayerBg: React.FC<InfoBoxWithPlayerBgProps> = ({
  children,
  playerImage,
  className = '',
  imagePosition = 'right',
  imageOpacity = 0.15,
  style,
}) => {
  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Player image background */}
      {playerImage && (
        <div 
          className={`absolute ${positionClasses[imagePosition]} top-0 h-full w-2/3 pointer-events-none`}
          style={{
            opacity: imageOpacity,
          }}
        >
          <img
            src={playerImage}
            alt=""
            className="h-full w-full object-cover object-top"
            style={{
              maskImage: 'linear-gradient(to left, transparent, black 30%, black 70%, transparent)',
              WebkitMaskImage: 'linear-gradient(to left, transparent, black 30%, black 70%, transparent)',
            }}
          />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
