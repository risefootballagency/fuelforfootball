import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { LocalizedLink } from "@/components/LocalizedLink";
import { LanguageMapSelector } from "@/components/LanguageMapSelector";
import { HoverText } from "@/components/HoverText";
import { LazyPlayer3D } from "@/components/LazyPlayer3D";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeBackground } from "@/components/HomeBackground";
import { LightConeBackground } from "@/components/LightConeBackground";
import { LandingImageWall } from "@/components/LandingImageWall";
import { XRayProvider, useXRay } from "@/contexts/XRayContext";
import { LandingCursor } from "@/components/LandingCursor";
import { RepresentationDialog } from "@/components/RepresentationDialog";
import { DeclareInterestPlayerDialog } from "@/components/DeclareInterestPlayerDialog";
import { Button } from "@/components/ui/button";
import { useRoleSubdomain, pathToRole, RoleSubdomain } from "@/hooks/useRoleSubdomain";
import { useIsPWA } from "@/hooks/useIsPWA";
import { usePerformanceCheck } from "@/hooks/usePerformanceCheck";
import { StaticLandingFallback } from "@/components/StaticLandingFallback";
import fffLogo from "@/assets/fff_logo.png";

// Inner component that uses the XRay context for full-page tracking
function LandingContent() {
  const {
    t
  } = useLanguage();
  const {
    getRoleUrl
  } = useRoleSubdomain();
  const isPWA = useIsPWA();
  
  const [languagePopupOpen, setLanguagePopupOpen] = useState(false);
  const [showRepresentation, setShowRepresentation] = useState(false);
  const [showDeclareInterest, setShowDeclareInterest] = useState(false);
  const [topLogoHovered, setTopLogoHovered] = useState(false);
  const [coneAngle, setConeAngle] = useState(26); // Dynamic angle based on viewport
  const [viewportReady, setViewportReady] = useState(false);
  const {
    setXrayState,
    xrayState
  } = useXRay();
  const lastInteractionRef = useRef(0);

  // Calculate cone angle based on viewport aspect ratio
  // Cone apex at (49.3%, 65%), edges go to (-0.7%, 100%) and (99.3%, 100%)
  // Calculate cone angle based on viewport aspect ratio - with PWA support
  useEffect(() => {
    const calculateConeAngle = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Horizontal distance from apex to edge: 50% of viewport width
      const horizontalPx = 0.50 * vw;
      // Vertical distance: 35% of viewport height (from 65% to 100%)
      const verticalPx = 0.35 * vh;
      // Calculate angle in degrees
      const angleRad = Math.atan2(verticalPx, horizontalPx);
      const angleDeg = (angleRad * 180) / Math.PI;
      setConeAngle(angleDeg);
    };

    if (isPWA) {
      // Delay for PWA to ensure viewport is stable
      const timer = setTimeout(() => {
        calculateConeAngle();
        setViewportReady(true);
      }, 100);
      
      const secondTimer = setTimeout(() => {
        calculateConeAngle();
      }, 500);
      
      window.addEventListener('resize', calculateConeAngle);
      return () => {
        clearTimeout(timer);
        clearTimeout(secondTimer);
        window.removeEventListener('resize', calculateConeAngle);
      };
    } else {
      calculateConeAngle();
      setViewportReady(true);
      window.addEventListener('resize', calculateConeAngle);
      return () => window.removeEventListener('resize', calculateConeAngle);
    }
  }, [isPWA]);
  const navigateToRole = (path: string) => {
    const role = pathToRole[path];
    
    if (role) {
      const roleUrl = getRoleUrl(role as Exclude<RoleSubdomain, null>);
      
      if (roleUrl.startsWith('http')) {
        window.location.href = roleUrl;
      } else {
        window.location.href = roleUrl;
      }
    } else {
      window.location.href = path;
    }
  };

  // Desktop navigation - reordered: Agents first, Players in middle, swap Business/Media
  const desktopNavLinks = [{
    to: "/agents",
    labelKey: "landing.nav_agents",
    fallback: "AGENT"
  }, {
    to: "/coaches",
    labelKey: "landing.nav_coaches",
    fallback: "COACH"
  }, {
    to: "/clubs",
    labelKey: "landing.nav_clubs",
    fallback: "CLUB"
  }, {
    to: "/players",
    labelKey: "landing.nav_players",
    fallback: "PLAYER"
  }, {
    to: "/scouts",
    labelKey: "landing.nav_scouts",
    fallback: "SCOUT"
  }, {
    to: "/media",
    labelKey: "landing.nav_media",
    fallback: "MEDIA"
  }, {
    to: "/business",
    labelKey: "landing.nav_business",
    fallback: "BUSINESS"
  }];

  // Mobile navigation
  const mobileNavLinks = [{
    to: "/players",
    labelKey: "landing.nav_players",
    fallback: "PLAYER"
  }, {
    to: "/coaches",
    labelKey: "landing.nav_coaches",
    fallback: "COACH"
  }, {
    to: "/clubs",
    labelKey: "landing.nav_clubs",
    fallback: "CLUB"
  }, {
    to: "/agents",
    labelKey: "landing.nav_agents",
    fallback: "AGENT"
  }, {
    to: "/scouts",
    labelKey: "landing.nav_scouts",
    fallback: "SCOUT"
  }, {
    to: "/business",
    labelKey: "landing.nav_business",
    fallback: "BUSINESS"
  }, {
    to: "/media",
    labelKey: "landing.nav_media",
    fallback: "MEDIA"
  }];

  // Full-page X-ray tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastInteractionRef.current = Date.now();
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setXrayState({
        isActive: true,
        intensity: 1,
        position: {
          x,
          y
        }
      });
    };
    const handleMouseLeave = () => {
      setXrayState({
        isActive: false,
        intensity: 0,
        position: {
          x: 0.5,
          y: 0.5
        }
      });
    };

    // Check for inactivity to fade out x-ray
    const checkInactivity = () => {
      const timeSinceInteraction = Date.now() - lastInteractionRef.current;
      if (timeSinceInteraction > 2000) {
        setXrayState({
          isActive: false,
          intensity: 0,
          position: {
            x: 0.5,
            y: 0.5
          }
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    const inactivityInterval = setInterval(checkInactivity, 500);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(inactivityInterval);
    };
  }, [setXrayState]);
  const pwaClass = isPWA ? 'pwa-standalone' : '';
  
  return <div className={`landing-no-scroll bg-[hsl(147,40%,7%)] flex flex-col items-center justify-end relative overflow-hidden cursor-none md:cursor-none ${pwaClass}`} style={{
    height: '100dvh',
    maxHeight: '100dvh',
    overflow: 'hidden'
  }}>
      
      {/* Custom Landing Page Cursor */}
      <LandingCursor />
      
      {/* Subtle data-driven background on white */}
      <HomeBackground />
      
      {/* Image Wall Background - revealed by X-Ray */}
      <LandingImageWall />
      
      {/* Light Cone Background - revealed by X-Ray */}
      <LightConeBackground />
      
      
      {/* Top Center Logo - disappears on xray or when hovering CHANGE THE GAME area */}
      <div className={`absolute top-4 md:top-6 z-[1] transition-opacity duration-500 w-full flex justify-center ${xrayState.isActive || topLogoHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Desktop */}
        <div className="hidden md:block">
          <img src={fffLogo} alt="Fuel For Football" className="h-[55px] w-auto" loading="eager" fetchPriority="high" />
        </div>
        {/* Mobile */}
        <div className="md:hidden">
          <img src={fffLogo} alt="Fuel For Football" className="h-[42px] w-auto" loading="eager" fetchPriority="high" />
        </div>
      </div>
      
      {/* Hidden text revealed by X-ray - CHANGE THE GAME - hidden until hover */}
      <div className="absolute left-1/2 transform -translate-x-1/2 z-[1] opacity-0 hover:opacity-100 transition-opacity duration-500" style={{
      top: 'calc(4rem - 50px)'
    }} onMouseEnter={() => setTopLogoHovered(true)} onMouseLeave={() => setTopLogoHovered(false)}>
        <span className="font-bebas text-2xl md:text-6xl lg:text-7xl tracking-[0.2em] md:tracking-[0.3em] text-light-green/90 uppercase whitespace-nowrap">
          <HoverText text={t("landing.change_the_game", "CHANGE THE GAME")} className="hover-text-slow" />
        </span>
      </div>
      
      
      {/* Language Selector - fixed position, centered horizontally, between slider menu and instruction text */}
      <div className="hidden md:block fixed z-[60] pointer-events-auto left-1/2 bottom-[50px] lg:bottom-[54px]" style={{ transform: 'translateX(calc(-50% - 3px)) scale(1.5)' }}>
        <LanguageMapSelector onOpenChange={setLanguagePopupOpen} />
      </div>
      
      {/* Staff, Scout & Portal links - subtle top right */}
      <div className="absolute top-6 md:top-8 right-4 md:right-8 z-50 flex items-center gap-2 md:gap-3">
        <Link to="/staff" className="text-light-green/30 hover:text-light-green/60 text-[10px] md:text-xs font-bebas uppercase tracking-wider transition-colors duration-300">
          {t("header.staff", "Staff")}
        </Link>
        <button onClick={() => navigateToRole("/scouts")} className="text-light-green/30 hover:text-light-green/60 text-[10px] md:text-xs font-bebas uppercase tracking-wider transition-colors duration-300">
          {t("landing.nav_scouts", "Scout")}
        </button>
        <LocalizedLink to="/portal" className="text-light-green/30 hover:text-light-green/60 text-[10px] md:text-xs font-bebas uppercase tracking-wider transition-colors duration-300">
          {t("header.portal", "Portal")}
        </LocalizedLink>
      </div>
      
      {/* 3D Player Effect - Single instance with responsive CSS positioning */}
      {viewportReady && (
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {/* Mobile: translateX(1px) translateY(32px), Desktop: translateX(-39px) translateY(-28px) */}
          <div 
            className="absolute inset-0 translate-x-[1px] translate-y-[32px] md:translate-x-[-39px] md:translate-y-[-28px]"
          >
            <LazyPlayer3D className="pointer-events-none w-full h-full" />
          </div>
        </div>
      )}

      {/* Bottom Section - Menu area */}
      <div className="pb-0 md:pb-8 z-50 relative w-full pointer-events-auto">
        <div className="relative max-w-6xl mx-auto md:min-h-[180px]">
          
          {/* Content container - pushed down to align with triangle body */}
          <div className="relative z-10 px-4 md:px-8 pt-8 md:pt-24 pb-1 md:py-3" style={{
          transform: 'translateY(32px)'
        }}>
            {/* Desktop & Tablet Layout - Horizontal Slider */}
            <div className="hidden md:block md:translate-y-2 lg:translate-y-0">
              <RoleSlider navLinks={desktopNavLinks} navigateToRole={navigateToRole} t={t} setShowRepresentation={setShowRepresentation} setShowDeclareInterest={setShowDeclareInterest} />
            </div>

            {/* OLD Tablet Layout - REMOVED, now uses desktop slider */}
            <div className="hidden flex-col items-center gap-0 mt-4">
              
              {/* Top row: Players, Coaches, Clubs */}
              <div className="border-t border-primary/40 pt-1 pb-1" style={{
              width: '70%'
            }}>
                <nav className="flex items-center justify-center gap-2">
                  {desktopNavLinks.slice(0, 3).map((link, index) => <div key={link.to} className="flex items-center">
                      <button onClick={() => navigateToRole(link.to)} className="px-2 py-1 text-[17px] font-bebas uppercase tracking-[0.15em] text-light-green/80 hover:text-primary transition-colors duration-300 whitespace-nowrap">
                        <HoverText text={t(link.labelKey, link.fallback)} />
                      </button>
                      {index < 2 && <div className="w-px h-3 bg-primary/40" />}
                    </div>)}
                </nav>
              </div>
              
              {/* Bottom row: Agents, Scouts, Business, Media */}
              <div className="border-t border-primary/40 pt-1" style={{
              width: '90%'
            }}>
                <nav className="flex items-center justify-center gap-1">
                  {desktopNavLinks.slice(3).map((link, index) => <div key={link.to} className="flex items-center">
                      <button onClick={() => navigateToRole(link.to)} className="px-2 py-1 text-[17px] font-bebas uppercase tracking-[0.15em] text-light-green/80 hover:text-primary transition-colors duration-300 whitespace-nowrap">
                        <HoverText text={t(link.labelKey, link.fallback)} />
                      </button>
                      {index < 3 && <div className="w-px h-3 bg-primary/40" />}
                    </div>)}
                </nav>
              </div>
              
              {/* Select role text */}
              <div className="text-center pt-1">
                <span className="text-[10px] font-bebas uppercase tracking-[0.15em] text-light-green/40">
                  {t("landing.select_role_enter", "Select Your Role To Enter Site")}
                </span>
              </div>
            </div>

            {/* Mobile Layout - Rise style with action buttons */}
            <div className="md:hidden flex flex-col items-center gap-0 mt-0 hover-text-no-shift" style={{
            transform: 'translateY(-25px) translateX(-4px)'
          }}>
              
              {/* Action buttons row - mobile */}
              <div className="flex gap-2 mb-3 w-full max-w-xs justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRepresentation(true)}
                  className="font-bebas uppercase tracking-wider text-xs border-[hsl(var(--mint)/0.4)] text-[hsl(var(--mint)/0.8)] hover:text-primary hover:border-primary bg-transparent"
                >
                  {t("landing.represent_me", "Represent Me")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowDeclareInterest(true)}
                  className="font-bebas uppercase tracking-wider text-xs"
                >
                  {t("landing.declare_interest", "Declare Interest")}
                </Button>
              </div>
              
              {/* Top row: Players, Coaches, Clubs - with divider */}
              <div className="border-t border-[hsl(var(--mint)/0.4)] pt-0.5 pb-0.5" style={{
              width: '60%'
            }}>
                <nav className="flex items-center justify-center gap-1">
                {mobileNavLinks.slice(0, 3).map((link, index) => <div key={link.to} className="flex items-center">
                      <button onClick={() => navigateToRole(link.to)} className="px-2 py-0.5 text-[17px] font-bebas uppercase tracking-[0.15em] text-[hsl(var(--mint)/0.8)] hover:text-[hsl(var(--mint))] transition-colors duration-300 whitespace-nowrap">
                        <HoverText text={t(link.labelKey, link.fallback)} />
                      </button>
                      {index < 2 && <div className="w-px h-3 bg-[hsl(var(--mint)/0.4)]" />}
                    </div>)}
                </nav>
              </div>
              
              {/* Bottom row: Agents, Scouts, Business, Media - widest */}
              <div className="border-t border-[hsl(var(--mint)/0.4)] pt-0.5" style={{
              width: '82%'
            }}>
                <nav className="flex items-center justify-center gap-1">
                  {mobileNavLinks.slice(3).map((link, index) => <div key={link.to} className="flex items-center">
                      <button onClick={() => navigateToRole(link.to)} className="px-2 py-0.5 text-[17px] font-bebas uppercase tracking-[0.15em] text-[hsl(var(--mint)/0.8)] hover:text-[hsl(var(--mint))] transition-colors duration-300 whitespace-nowrap">
                        <HoverText text={t(link.labelKey, link.fallback)} />
                      </button>
                      {index < 3 && <div className="w-px h-3 bg-[hsl(var(--mint)/0.4)]" />}
                    </div>)}
                </nav>
              </div>
              
              {/* Language Selector - Mobile only - single instance, centered */}
              <div className="flex justify-center w-full pt-2">
                <div className="scale-[1.2]">
                  <LanguageMapSelector onOpenChange={setLanguagePopupOpen} />
                </div>
              </div>
              
              {/* Select role text - mobile */}
              <div className="text-center pt-1 w-full">
                <span className="text-[10px] font-bebas uppercase tracking-[0.15em] text-[hsl(var(--mint)/0.4)]">
                  {t("landing.select_role_enter", "Select Your Role To Enter Site")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dialogs */}
      <RepresentationDialog open={showRepresentation} onOpenChange={setShowRepresentation} />
      <DeclareInterestPlayerDialog open={showDeclareInterest} onOpenChange={setShowDeclareInterest} starsOnly />
    </div>;
}
// Role Slider Component for Desktop - Elegant minimal slider with drag-and-drop
function RoleSlider({
  navLinks,
  navigateToRole,
  t,
  setShowRepresentation,
  setShowDeclareInterest
}: {
  navLinks: {
    to: string;
    labelKey: string;
    fallback: string;
  }[];
  navigateToRole: (path: string) => void;
  t: (key: string, fallback: string) => string;
  setShowRepresentation: (open: boolean) => void;
  setShowDeclareInterest: (open: boolean) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // null = no selection yet
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<number | null>(null); // percentage position while dragging
  const [isAnimatingBack, setIsAnimatingBack] = useState(false);
  const [nearestSnapIndex, setNearestSnapIndex] = useState<number | null>(null); // track nearest snap point during drag
  const sliderRef = useRef<HTMLDivElement>(null);
  const centerIndex = 3; // Center position for snap-back

  const getPositionFromIndex = (index: number) => {
    return index / (navLinks.length - 1) * 100;
  };
  const getIndexFromPosition = (clientX: number): {
    index: number;
    isSnapped: boolean;
  } => {
    if (!sliderRef.current) return {
      index: selectedIndex,
      isSnapped: false
    };
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const exactIndex = percentage * (navLinks.length - 1);
    const roundedIndex = Math.round(exactIndex);
    // Consider "snapped" if within 0.45 of a stop point (easier snapping)
    const isSnapped = Math.abs(exactIndex - roundedIndex) < 0.45;
    return {
      index: roundedIndex,
      isSnapped
    };
  };
  const getPercentageFromClientX = (clientX: number): number => {
    if (!sliderRef.current) return 0;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, x / rect.width * 100));
  };
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragPosition(getPositionFromIndex(centerIndex));
    setNearestSnapIndex(null);
  };
  const handleTrackClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    const {
      index,
      isSnapped
    } = getIndexFromPosition(e.clientX);
    if (isSnapped) {
      setSelectedIndex(index);
      navigateToRole(navLinks[index].to);
    }
  };
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const { index, isSnapped } = getIndexFromPosition(e.clientX);
    
    // If near a snap point, snap visually to it
    if (isSnapped) {
      setDragPosition(getPositionFromIndex(index));
      setNearestSnapIndex(index);
    } else {
      const percentage = getPercentageFromClientX(e.clientX);
      setDragPosition(percentage);
      setNearestSnapIndex(null);
    }
  }, [isDragging]);
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    setNearestSnapIndex(null);
    const {
      index,
      isSnapped
    } = getIndexFromPosition(e.clientX);
    if (isSnapped) {
      // Snapped to a valid stop - navigate
      setDragPosition(null);
      setSelectedIndex(index);
      navigateToRole(navLinks[index].to);
    } else {
      // Dropped between stops - animate back to center
      setIsAnimatingBack(true);
      const centerPosition = getPositionFromIndex(centerIndex);
      setDragPosition(centerPosition);

      // Reset after animation
      setTimeout(() => {
        setDragPosition(null);
        setIsAnimatingBack(false);
      }, 300);
    }
  }, [isDragging, navLinks, navigateToRole]);
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  const handleRoleClick = (index: number) => {
    setSelectedIndex(index);
    navigateToRole(navLinks[index].to);
  };

  // Calculate current thumb position - use center when no selection
  const thumbPosition = dragPosition !== null ? dragPosition : getPositionFromIndex(selectedIndex !== null ? selectedIndex : centerIndex);
  // Detect tablet screen
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  return <div className="flex flex-col items-center hover-text-no-shift" style={{
    paddingTop: isTablet ? '35px' : '35px',
    paddingBottom: isTablet ? '8px' : '0px',
    transform: 'translateX(-2px)'
  }}>
      {/* Unified Slider Container - all elements in one parent */}
      <div className="relative" style={{
      width: isTablet ? '80%' : '85%',
      paddingLeft: isTablet ? '30px' : '100px',
      paddingRight: isTablet ? '30px' : '100px'
    }}>
        
        {/* Slider Track with labels and bullets */}
        <div ref={sliderRef} className="relative cursor-pointer overflow-visible" style={{ height: '140px', marginTop: '0px' }} onClick={handleTrackClick}>
          {/* SVG curved tracks */}
          <svg 
            className="absolute w-full h-full z-0" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {/* Lower curve - for slider thumb - moved up 8px by adjusting y values */}
            <path 
              d="M0,87 Q50,15 100,87" 
              fill="none" 
              stroke="hsl(var(--mint) / 0.2)" 
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {/* Filled lower track line - uses clipPath based on thumb position */}
            <defs>
              <clipPath id="filledClip">
                <rect x="0" y="0" width={`${thumbPosition}%`} height="100%" />
              </clipPath>
            </defs>
            <path 
              d="M0,87 Q50,15 100,87"
              fill="none" 
              stroke="hsl(var(--mint) / 0.6)" 
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              clipPath="url(#filledClip)"
              className={isAnimatingBack ? 'transition-all duration-300 ease-out' : isDragging ? '' : 'transition-all duration-150'}
            />
          </svg>
          
          {/* Stop markers and labels - positioned along the slider curve */}
          {navLinks.map((link, index) => {
            const xPercent = getPositionFromIndex(index);
            // Use actual quadratic Bezier formula for M0,87 Q50,15 100,87
            const bezierT = xPercent / 100;
            const controlY = 15;
            const yPos = Math.pow(1-bezierT, 2) * 87 + 2 * (1-bezierT) * bezierT * controlY + Math.pow(bezierT, 2) * 87;
            const yPercent = (yPos / 100) * 100;
            
            const isHovered = hoveredIndex === index || nearestSnapIndex === index;
            const isSelected = selectedIndex === index;
            
            return (
              <div key={index}>
                {/* Label directly above bullet */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRoleClick(index); }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`absolute z-10 text-[15px] font-bebas uppercase tracking-[0.12em] transition-all duration-300 whitespace-nowrap ${
                    isSelected ? 'text-[hsl(var(--mint))] font-bold' : 
                    isHovered ? 'text-[hsl(var(--mint))] font-bold' : 
                    'text-[hsl(var(--mint)/0.4)]'
                  }`}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                    transform: `translate(-50%, -100%) translateY(${index === 3 ? '-14px' : '-10px'})`
                  }}
                >
                  {t(link.labelKey, link.fallback)}
                </button>
                {/* Bullet marker on curve */}
                <div 
                  className={`absolute z-10 w-2 h-2 rounded-full transition-all duration-200 ${
                    selectedIndex !== null && index === selectedIndex 
                      ? 'bg-[hsl(var(--mint))] scale-125' 
                      : selectedIndex !== null && index < selectedIndex 
                        ? 'bg-[hsl(var(--mint)/0.6)]' 
                        : 'bg-[hsl(var(--mint)/0.3)]'
                  }`}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                    transform: 'translate(-50%, -50%)'
                  }} 
                />
              </div>
            );
          })}
          
          {/* Draggable Thumb Handle - positioned along LOWER curve */}
          {(() => {
            // Use actual quadratic Bezier formula for M0,87 Q50,15 100,87
            const bezierT = thumbPosition / 100;
            const controlY = 15;
            const yPos = Math.pow(1-bezierT, 2) * 87 + 2 * (1-bezierT) * bezierT * controlY + Math.pow(bezierT, 2) * 87;
            const yPercent = (yPos / 100) * 100;
            
            return (
              <div 
                className={`absolute z-20 cursor-grab active:cursor-grabbing ${isAnimatingBack ? 'transition-all duration-300 ease-out' : isDragging ? '' : 'transition-all duration-150'}`} 
                style={{
                  left: `${thumbPosition}%`,
                  top: `${yPercent}%`,
                  transform: 'translate(-50%, -50%)'
                }} 
                onMouseDown={handleThumbMouseDown}
              >
                {/* Outer glow - larger and more visible */}
                <div className={`absolute inset-0 rounded-full bg-[hsl(var(--mint)/0.4)] blur-lg ${isDragging ? 'scale-[2]' : 'scale-150'} transition-transform duration-150`} style={{
                  width: '32px',
                  height: '32px',
                  marginLeft: '-4px',
                  marginTop: '-4px'
                }} />
                {/* Main thumb - larger and more obvious */}
                <div className={`relative w-6 h-6 rounded-full bg-[hsl(var(--mint))] shadow-lg flex items-center justify-center ${isDragging ? 'scale-125' : 'hover:scale-110'} transition-transform duration-150`} style={{
                  boxShadow: '0 0 20px hsl(var(--mint) / 0.7), 0 0 40px hsl(var(--mint) / 0.3)'
                }}>
                  {/* Grip lines - more visible */}
                  <div className="flex gap-[3px]">
                    <div className="w-[2px] h-3 bg-black/50 rounded-full" />
                    <div className="w-[2px] h-3 bg-black/50 rounded-full" />
                    <div className="w-[2px] h-3 bg-black/50 rounded-full" />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Instruction text - shows hovered role name or default - fixed height to prevent layout shift */}
        <div className="text-center h-6 flex items-center justify-center" style={{ marginTop: isTablet ? '-20px' : '-8px' }}>
          {hoveredIndex !== null ? (
            <span className="text-lg font-bebas font-bold uppercase tracking-[0.15em] text-[hsl(var(--mint))] transition-all duration-200">
              {t(navLinks[hoveredIndex].labelKey, navLinks[hoveredIndex].fallback)}
            </span>
          ) : nearestSnapIndex !== null ? (
            <span className="text-lg font-bebas font-bold uppercase tracking-[0.15em] text-[hsl(var(--mint))] transition-all duration-200">
              {t(navLinks[nearestSnapIndex].labelKey, navLinks[nearestSnapIndex].fallback)}
            </span>
          ) : (
            <span className="text-[10px] font-bebas uppercase tracking-[0.25em] text-[hsl(var(--mint)/0.3)]">
              {isDragging ? t("landing.drag_to_role", "Drag to a role to select") : t("landing.drag_slider_select", "Drag slider to select role")}
            </span>
          )}
        </div>
      </div>
    </div>;
}
export default function Landing() {
  const { isLowPerformance, isChecking, reason } = usePerformanceCheck();

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[hsl(147,40%,7%)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLowPerformance) {
    return <StaticLandingFallback performanceReason={reason} />;
  }

  return (
    <XRayProvider>
      <LandingContent />
    </XRayProvider>
  );
}