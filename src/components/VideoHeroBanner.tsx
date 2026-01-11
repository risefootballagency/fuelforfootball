import { useRef, useEffect } from 'react';

interface VideoHeroBannerProps {
  videoSrc: string;
  title?: string;
}

export const VideoHeroBanner = ({ videoSrc, title = "FUEL FOR FOOTBALL" }: VideoHeroBannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked - video will show first frame
      });
    }
  }, []);

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden bg-black">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Camera Viewfinder Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner Brackets */}
        {/* Top Left */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8">
          <div className="w-12 md:w-20 h-12 md:h-20 border-l-2 border-t-2 border-white/60" />
        </div>
        {/* Top Right */}
        <div className="absolute top-4 md:top-8 right-4 md:right-8">
          <div className="w-12 md:w-20 h-12 md:h-20 border-r-2 border-t-2 border-white/60" />
        </div>
        {/* Bottom Left */}
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8">
          <div className="w-12 md:w-20 h-12 md:h-20 border-l-2 border-b-2 border-white/60" />
        </div>
        {/* Bottom Right */}
        <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8">
          <div className="w-12 md:w-20 h-12 md:h-20 border-r-2 border-b-2 border-white/60" />
        </div>
        
        {/* Center Crosshairs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Horizontal line */}
          <div className="absolute w-8 md:w-12 h-px bg-white/40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          {/* Vertical line */}
          <div className="absolute w-px h-8 md:h-12 bg-white/40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        {/* Recording Indicator */}
        <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/80 text-xs md:text-sm font-mono tracking-wider">REC</span>
        </div>
        
        {/* Focus Indicators on sides */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 space-y-1">
          <div className="w-1 h-4 md:h-6 bg-white/30" />
          <div className="w-1 h-6 md:h-8 bg-white/50" />
          <div className="w-1 h-8 md:h-10 bg-primary/70" />
          <div className="w-1 h-6 md:h-8 bg-white/50" />
          <div className="w-1 h-4 md:h-6 bg-white/30" />
        </div>
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 space-y-1">
          <div className="w-1 h-4 md:h-6 bg-white/30" />
          <div className="w-1 h-6 md:h-8 bg-white/50" />
          <div className="w-1 h-8 md:h-10 bg-primary/70" />
          <div className="w-1 h-6 md:h-8 bg-white/50" />
          <div className="w-1 h-4 md:h-6 bg-white/30" />
        </div>
        
        {/* Lens Vignette Effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
          }}
        />
        
        {/* Subtle scan lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
          }}
        />
      </div>
      
      {/* Center Title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bebas uppercase tracking-[0.2em] md:tracking-[0.3em] text-white drop-shadow-2xl">
            {title}
          </h1>
          <div className="mt-2 md:mt-4 flex items-center justify-center gap-3 md:gap-4">
            <div className="w-12 md:w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <span className="text-primary text-xs md:text-sm font-bebas tracking-[0.4em] uppercase">Performance</span>
            <div className="w-12 md:w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </div>
      </div>
      
      {/* Bottom Timecode */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2">
        <span className="text-white/60 text-xs md:text-sm font-mono tracking-wider">
          00:00:00:00
        </span>
      </div>
    </section>
  );
};
