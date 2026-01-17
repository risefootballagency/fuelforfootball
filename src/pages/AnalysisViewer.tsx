import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { ArrowLeft, ChevronDown, Play, Plus, Minus, Download } from "lucide-react";
import { toast } from "sonner";
import { extractAnalysisIdFromSlug } from "@/lib/urlHelpers";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HoverText } from "@/components/HoverText";
import { AnalysisVideo } from "@/components/AnalysisVideo";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import fffLogo from "@/assets/fff_logo.png";
import smokyBackground from "@/assets/Smoky-Background.png";

interface Analysis {
  id: string;
  analysis_type: string;
  title: string | null;
  home_team: string | null;
  away_team: string | null;
  home_score: number | null;
  away_score: number | null;
  match_date: string | null;
  home_team_logo: string | null;
  away_team_logo: string | null;
  home_team_bg_color: string | null;
  away_team_bg_color: string | null;
  selected_scheme: string | null;
  starting_xi: any;
  kit_primary_color: string | null;
  kit_secondary_color: string | null;
  kit_collar_color: string | null;
  kit_number_color: string | null;
  kit_stripe_style: string | null;
  player_team: string | null;
  key_details: string | null;
  opposition_strengths: string | null;
  opposition_weaknesses: string | null;
  matchups: any;
  scheme_title: string | null;
  scheme_paragraph_1: string | null;
  scheme_paragraph_2: string | null;
  scheme_image_url: string | null;
  player_image_url: string | null;
  match_image_url: string | null;
  strengths_improvements: string | null;
  concept: string | null;
  explanation: string | null;
  points: any;
  video_url: string | null;
  player_name: string | null;
}

// Brand colors - GLOBAL TOKENS
const BRAND = {
  gold: "#fdc61b",
  darkGreen: "#12571e",
  contentBg: "#c7d4ca",
  bodyText: "#000000",
};

// Section IDs for quick navigation
const SECTION_IDS = {
  overview: "section-overview",
  strengths: "section-strengths",
  weaknesses: "section-weaknesses",
  matchups: "section-matchups",
  scheme: "section-scheme",
  improvements: "section-improvements",
};

// Enhanced Kit SVG Component with more styling options - THINNER design
interface KitProps {
  primaryColor: string;
  secondaryColor: string;
  collarColor?: string;
  numberColor?: string;
  stripeStyle?: 'none' | 'thin' | 'thick' | 'halves';
  number: string;
}

const PlayerKit = ({ primaryColor, secondaryColor, collarColor, numberColor = 'white', stripeStyle = 'thick', number }: KitProps) => {
  const collar = collarColor || secondaryColor;
  
  return (
    <svg width="50" height="60" viewBox="0 0 100 120" className="drop-shadow-lg">
      <defs>
        {/* Pattern for thin stripes */}
        <pattern id={`thinStripes-${number}`} patternUnits="userSpaceOnUse" width="6" height="120">
          <rect width="3" height="120" fill={primaryColor} />
          <rect x="3" width="3" height="120" fill={secondaryColor} />
        </pattern>
        {/* Pattern for thick stripes */}
        <pattern id={`thickStripes-${number}`} patternUnits="userSpaceOnUse" width="16" height="120">
          <rect width="8" height="120" fill={primaryColor} />
          <rect x="8" width="8" height="120" fill={secondaryColor} />
        </pattern>
      </defs>
      
      {/* Main shirt body - THINNER proportions */}
      <path 
        d="M30 28 L25 38 L25 95 L35 100 L65 100 L75 95 L75 38 L70 28 L62 24 L58 28 L42 28 L38 24 Z" 
        fill={stripeStyle === 'thin' ? `url(#thinStripes-${number})` : 
              stripeStyle === 'thick' ? `url(#thickStripes-${number})` :
              stripeStyle === 'halves' ? primaryColor : primaryColor}
        stroke={secondaryColor} 
        strokeWidth="2"
      />
      
      {/* Halves - right side overlay */}
      {stripeStyle === 'halves' && (
        <path 
          d="M50 28 L58 28 L62 24 L70 28 L75 38 L75 95 L65 100 L50 100 Z" 
          fill={secondaryColor}
        />
      )}
      
      {/* Sleeves - thinner and tighter */}
      <path d="M25 38 L18 48 L22 58 L25 52 Z" fill={primaryColor} stroke={secondaryColor} strokeWidth="1.5"/>
      <path d="M75 38 L82 48 L78 58 L75 52 Z" fill={stripeStyle === 'halves' ? secondaryColor : primaryColor} stroke={secondaryColor} strokeWidth="1.5"/>
      
      {/* Collar - V-neck style */}
      <path d="M42 28 L50 40 L58 28" fill="none" stroke={collar} strokeWidth="3" strokeLinecap="round"/>
      <path d="M44 26 L50 36 L56 26" fill="none" stroke={collar} strokeWidth="2"/>
      
      {/* Collar base */}
      <ellipse cx="50" cy="25" rx="10" ry="3" fill={collar} />
      
      {/* Number on shirt - with editable color */}
      <text 
        x="50" 
        y="72" 
        textAnchor="middle" 
        fontSize="26" 
        fontWeight="bold" 
        fill={numberColor}
        stroke={numberColor === 'white' || numberColor === '#ffffff' || numberColor === '#FFFFFF' ? 'black' : 'rgba(0,0,0,0.3)'}
        strokeWidth="0.8"
        fontFamily="Arial Black, sans-serif"
      >
        {number}
      </text>
      
      {/* Subtle shading for depth */}
      <path 
        d="M30 28 L25 38 L25 95 L35 100 L38 95 L38 35 Z" 
        fill="rgba(0,0,0,0.12)"
      />
      {/* Highlight on right side */}
      <path 
        d="M62 28 L70 28 L75 38 L75 95 L72 95 L72 40 L68 30 Z" 
        fill="rgba(255,255,255,0.08)"
      />
    </svg>
  );
};

// Tactical symbols SVG background - football analysis style
const TacticalSymbols = () => (
  <svg 
    className="absolute inset-0 w-full h-full pointer-events-none"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="tacticalPattern" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
        {/* Player position markers (circles with X) */}
        <g opacity="0.06">
          <circle cx="50" cy="50" r="18" stroke={BRAND.gold} strokeWidth="2" fill="none" />
          <line x1="38" y1="38" x2="62" y2="62" stroke={BRAND.gold} strokeWidth="2" />
          <line x1="62" y1="38" x2="38" y2="62" stroke={BRAND.gold} strokeWidth="2" />
        </g>
        
        {/* Defensive block (rectangle) */}
        <rect x="180" y="40" width="40" height="25" stroke={BRAND.gold} strokeWidth="2" fill="none" opacity="0.05" />
        
        {/* Movement arrows */}
        <g stroke={BRAND.gold} strokeWidth="2" opacity="0.07" fill="none">
          <path d="M80 150 L140 150" strokeDasharray="8 4" />
          <polygon points="140,145 150,150 140,155" fill={BRAND.gold} />
        </g>
        
        <g stroke={BRAND.gold} strokeWidth="2" opacity="0.06" fill="none">
          <path d="M200 180 L200 240" />
          <polygon points="195,240 200,252 205,240" fill={BRAND.gold} />
        </g>
        
        {/* Passing lane (curved arrow) */}
        <path d="M40 200 Q100 160 160 200" stroke={BRAND.gold} strokeWidth="2" fill="none" strokeDasharray="6 3" opacity="0.05" />
        
        {/* Zone shading triangle */}
        <polygon points="250,120 290,180 210,180" stroke={BRAND.gold} strokeWidth="1.5" fill="none" opacity="0.04" />
        
        {/* Player marker (filled circle) */}
        <circle cx="120" cy="250" r="10" fill={BRAND.gold} opacity="0.05" />
        
        {/* Pressing trigger line */}
        <line x1="20" y1="280" x2="100" y2="280" stroke={BRAND.gold} strokeWidth="2" strokeDasharray="15 5" opacity="0.06" />
        
        {/* Formation dots */}
        <circle cx="260" cy="260" r="6" fill={BRAND.gold} opacity="0.07" />
        <circle cx="280" cy="280" r="6" fill={BRAND.gold} opacity="0.07" />
        <circle cx="240" cy="280" r="6" fill={BRAND.gold} opacity="0.07" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#tacticalPattern)" />
  </svg>
);

// Section title with grass image background - with scroll letter effect on hover
const SectionTitle = ({ title, icon }: { title: string; icon?: "plus" | "minus" | null }) => (
  <div className="relative mb-4">
    <div 
      className="relative rounded-lg overflow-hidden cursor-pointer group"
      style={{
        backgroundImage: `url('/analysis-grass-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: `2px solid ${BRAND.gold}`
      }}
    >
      <div className="py-3 md:py-4 px-4">
        <div className="flex items-center justify-center gap-3">
          {icon === "plus" && (
            <Plus className="w-5 h-5 md:w-6 md:h-6" style={{ color: BRAND.gold }} />
          )}
          {icon === "minus" && (
            <Minus className="w-5 h-5 md:w-6 md:h-6" style={{ color: BRAND.gold }} />
          )}
          <h2 
            className="text-xl md:text-2xl font-bebas uppercase tracking-widest text-center drop-shadow-md"
            style={{ color: BRAND.gold }}
          >
            <HoverText text={title} />
          </h2>
        </div>
      </div>
    </div>
  </div>
);

// Content card with correct background (#c7d4ca) and black text
const ContentCard = ({ children, className = "", transparent = false }: { children: React.ReactNode; className?: string; transparent?: boolean }) => (
  <div 
    className={`rounded-lg p-4 md:p-6 ${className}`}
    style={{ backgroundColor: transparent ? 'transparent' : BRAND.contentBg }}
  >
    {children}
  </div>
);

// Global flag to prevent auto-open during navigation - persists until page refresh
let navigationUsed = false;

// Section component that auto-opens on scroll DOWN only, closes when scrolling off screen
const ExpandableSection = ({ 
  title, 
  children, 
  id,
  defaultOpen = false,
  icon,
  transparentContent = false,
  forceOpen = false
}: { 
  title: string; 
  children: React.ReactNode; 
  id?: string;
  defaultOpen?: boolean;
  icon?: "plus" | "minus" | null;
  transparentContent?: boolean;
  forceOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || forceOpen);
  
  // Force open when forceOpen prop changes
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);
  const [wasManuallyToggled, setWasManuallyToggled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-10% 0px -30% 0px" });
  
  // Track scroll direction and auto-open/close
  useEffect(() => {
    const handleScroll = () => {
      // Disable ALL auto-open/close if navigation was ever used (until page refresh)
      if (navigationUsed) return;
      
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      setLastScrollY(currentScrollY);
      
      // Only auto-manage if not manually toggled
      if (!wasManuallyToggled) {
        if (isInView && isScrollingDown && !isOpen) {
          // Auto-open when scrolling DOWN into view
          setIsOpen(true);
        } else if (!isInView && isOpen) {
          // Close when scrolling off screen
          setIsOpen(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView, isOpen, lastScrollY, wasManuallyToggled]);
  
  // Reset manual toggle flag when section goes off screen
  useEffect(() => {
    if (!isInView) {
      setWasManuallyToggled(false);
    }
  }, [isInView]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setWasManuallyToggled(true);
  };

  // When forceOpen (for PDF), render content directly without animation
  if (forceOpen) {
    return (
      <section 
        ref={sectionRef}
        id={id}
        data-expandable
        className="relative w-full"
        style={{
          backgroundImage: `url('/analysis-page-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Shader vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)',
            mixBlendMode: 'multiply'
          }}
        />
        <TacticalSymbols />
        <div className="relative px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
          <div className="w-full">
            <SectionTitle title={title} icon={icon} />
            <div className="flex justify-center -mt-2 mb-2">
              <ChevronDown className="w-5 h-5" style={{ color: BRAND.gold, transform: 'rotate(180deg)' }} />
            </div>
            <ContentCard transparent={transparentContent}>
              {children}
            </ContentCard>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      id={id}
      data-expandable
      className="relative w-full"
      style={{
        backgroundImage: `url('/analysis-page-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Shader vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)',
          mixBlendMode: 'multiply'
        }}
      />
      <TacticalSymbols />
      <div className="relative px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
        <motion.div 
          className="w-full overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <button
            onClick={handleToggle}
            className="w-full"
          >
            <SectionTitle title={title} icon={icon} />
            <motion.div
              className="flex justify-center -mt-2 mb-2"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5" style={{ color: BRAND.gold }} />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ContentCard transparent={transparentContent}>
                  {children}
                </ContentCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

// Text reveal animation component
const TextReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

// Main Header - ONE set of club logos BEHIND color bars, double size, higher up
const AnalysisHeader = ({ 
  homeTeam, 
  awayTeam, 
  homeLogo, 
  awayLogo, 
  homeBgColor, 
  awayBgColor,
  homeScore,
  awayScore,
  matchDate,
  isPostMatch = false,
  onSave,
  isSaving = false,
  playerTeam
}: { 
  homeTeam: string | null;
  awayTeam: string | null;
  homeLogo: string | null;
  awayLogo: string | null;
  homeBgColor: string | null;
  awayBgColor: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  matchDate?: string | null;
  isPostMatch?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  playerTeam?: string | null; // Now expects "home" or "away"
}) => {
  const navigate = useNavigate();
  
  // Determine which team is the player's team based on explicit selection
  const isHomePlayerTeam = playerTeam === 'home';
  const isAwayPlayerTeam = playerTeam === 'away';
  
  return (
    <motion.div 
      className="w-full relative z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top gold border removed as requested */}
      
      {/* Top section - COMPACT, with buttons integrated */}
      <div 
        className="relative py-2 px-3"
        style={{
          backgroundImage: `url('/analysis-page-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Top fade gradient */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        {/* Bottom fade gradient */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        
        {/* Back button - consistent dimensions with Save button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="absolute left-4 md:left-8 top-4 bg-black/50 backdrop-blur-sm border-white/30 hover:bg-black/70 text-white h-8 py-1.5 px-3 text-xs z-20"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Back
        </Button>
        
        {/* Save button - consistent dimensions with Back button */}
        {onSave && (
          <Button
            onClick={onSave}
            disabled={isSaving}
            size="sm"
            className="absolute right-4 md:right-8 top-4 font-bebas uppercase tracking-wider shadow-lg h-8 py-1.5 px-3 text-xs z-20"
            style={{ backgroundColor: BRAND.gold, color: 'black' }}
          >
            <Download className="w-3 h-3 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
        
        <div className="relative flex items-center justify-center py-2">
          <img 
            src={fffLogo} 
            alt="Fuel For Football" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
        </div>
      </div>

      {/* Team colors bar with logos BEHIND the color containers - dark green background behind VS, NO fades to blend with date section */}
      <div 
        className="relative h-10 md:h-14 overflow-visible"
        style={{
          backgroundColor: '#0a2e12'
        }}
      >
        
        {/* Club logos - responsive scaling with vw units */}
        {homeLogo && (
          <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-[15vw] h-[15vw] min-w-16 max-w-28 md:min-w-20 md:max-w-36 z-20 -mt-2">
            <img src={homeLogo} alt="" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
        )}
        {awayLogo && (
          <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-[15vw] h-[15vw] min-w-16 max-w-28 md:min-w-20 md:max-w-36 z-20 -mt-2">
            <img src={awayLogo} alt="" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
        )}

        {/* Left Side - Home Team Color */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/2 z-10 flex items-center"
          style={{ 
            backgroundColor: homeBgColor || '#1a1a1a',
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
            opacity: isAwayPlayerTeam && !isHomePlayerTeam ? 0.7 : 1
          }}
        >
        {/* Team name with proper margins to avoid logo overlap */}
          <span 
            className="text-[10px] xs:text-xs sm:text-sm md:text-lg lg:text-xl font-bebas text-white tracking-wide uppercase text-center truncate pl-[20vw] pr-2 w-full"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.6)'
            }}
          >
            {homeTeam}
          </span>
        </div>

        {/* Right Side - Away Team Color */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 z-10 flex items-center"
          style={{ 
            backgroundColor: awayBgColor || '#8B0000',
            clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
            opacity: isHomePlayerTeam && !isAwayPlayerTeam ? 0.7 : 1
          }}
        >
        {/* Team name with proper margins to avoid logo overlap */}
          <span 
            className="text-[10px] xs:text-xs sm:text-sm md:text-lg lg:text-xl font-bebas text-white tracking-wide uppercase text-center truncate pl-2 pr-[20vw] w-full"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.6)'
            }}
          >
            {awayTeam}
          </span>
        </div>

        {/* VS Badge - Center - highest z-index, smoky background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          {isPostMatch && homeScore !== null && awayScore !== null ? (
            <div 
              className="rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg border-2 border-white"
              style={{ backgroundColor: BRAND.gold }}
            >
              <span className="text-black text-lg md:text-xl font-bebas font-bold">
                {homeScore} - {awayScore}
              </span>
            </div>
          ) : (
            <div 
              className="relative rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 border-white shadow-lg overflow-hidden"
              style={{
                backgroundImage: `url(${smokyBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/30" />
              <span className="relative text-white text-base md:text-lg font-bebas font-bold">VS</span>
            </div>
          )}
        </div>
      </div>

      {/* Match Date Line - ONLY date, compact, DARKER brand green, italic and larger with shade */}
      {matchDate && (
        <div 
          className="text-center py-2"
          style={{ backgroundColor: '#0a2e12' }}
        >
          <span 
            className="text-white font-bebas tracking-wider text-base md:text-lg italic"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.6)'
            }}
          >
            {new Date(matchDate).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Quick Navigation Dropdown - Full width, smoky grass background, consistent text
const QuickNavDropdown = ({ sections }: { sections: { id: string; label: string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Separate key info sections from points
  const keyInfoSections = sections.filter(s => 
    s.id.includes('overview') || 
    s.id.includes('strengths') || 
    s.id.includes('weaknesses') || 
    s.id.includes('matchups') ||
    s.id.includes('scheme') ||
    s.id.includes('improvements')
  );
  const pointSections = sections.filter(s => s.id.includes('point'));

  // Scroll dropdown into view when opened
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      setTimeout(() => {
        dropdownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [isOpen]);

  const handleNavigate = (sectionId: string) => {
    setIsOpen(false);
    
    // Permanently disable auto-open once navigation is used (persists until refresh)
    navigationUsed = true;
    
    // Use requestAnimationFrame for smoother navigation
    requestAnimationFrame(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        // First scroll to position the element
        const targetY = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: targetY,
          behavior: 'instant' as ScrollBehavior
        });
        
        // Then click the button to open the section after scrolling
        requestAnimationFrame(() => {
          const sectionButton = el.querySelector('button');
          if (sectionButton) {
            sectionButton.click();
          }
          
          // Final scroll adjustment after section opens
          setTimeout(() => {
            const newTargetY = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({
              top: newTargetY,
              behavior: 'instant' as ScrollBehavior
            });
          }, 150);
        });
      }
    });
  };

  return (
    <div className="relative z-40">
      {/* Radiating dark shader ring behind the button */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.2) 60%, transparent 100%)'
        }}
      />
      
      <motion.div 
        ref={dropdownRef}
        className="relative py-5 mt-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative flex justify-center px-4">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-base md:text-lg px-6 py-2 font-bebas tracking-wider hover:bg-black/50 transition-colors backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  borderColor: BRAND.gold,
                  borderWidth: '2px'
                }}
              >
                Jump to Section
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-[96vw] max-w-none max-h-[70vh] overflow-y-auto z-50 p-4 md:p-6"
              style={{ 
                backgroundImage: `url('/Smoky-Background.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderColor: BRAND.gold,
                borderWidth: '2px'
              }}
              side="bottom"
              align="center"
              sideOffset={4}
              avoidCollisions={true}
            >
              {/* Dark smoky overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 pointer-events-none rounded-md" />
              
              {/* Key Info Sections - centered, horizontal wrap, MUCH LARGER titles */}
              {keyInfoSections.length > 0 && (
                <div className="relative mb-4 text-center">
                  <div className="py-2 text-xl md:text-2xl uppercase tracking-widest font-bebas border-b mb-4" style={{ color: BRAND.gold, borderColor: `${BRAND.gold}50` }}>
                    Key Info
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {keyInfoSections.map((section) => (
                      <DropdownMenuItem
                        key={section.id}
                        onClick={() => handleNavigate(section.id)}
                        className="cursor-pointer hover:bg-white/20 font-bebas tracking-wide text-sm md:text-base py-1.5 px-3 rounded-md border"
                        style={{ 
                          color: 'white',
                          backgroundColor: 'rgba(9, 56, 14, 0.8)',
                          borderColor: `${BRAND.gold}60`
                        }}
                      >
                        {section.label}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Divider */}
              {keyInfoSections.length > 0 && pointSections.length > 0 && (
                <div 
                  className="relative my-3 h-[1px]"
                  style={{ backgroundColor: BRAND.gold, opacity: 0.4 }}
                />
              )}
              
              {/* Points Sections - centered, wrap to multiple lines, MUCH LARGER titles */}
              {pointSections.length > 0 && (
                <div className="relative text-center">
                  <div className="py-2 text-xl md:text-2xl uppercase tracking-widest font-bebas border-b mb-4" style={{ color: BRAND.gold, borderColor: `${BRAND.gold}50` }}>
                    Analysis Points
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {pointSections.map((section) => (
                      <DropdownMenuItem
                        key={section.id}
                        onClick={() => handleNavigate(section.id)}
                        className="cursor-pointer hover:bg-white/20 font-bebas tracking-wide text-sm md:text-base py-1.5 px-3 rounded-md border"
                        style={{ 
                          color: 'white',
                          backgroundColor: 'rgba(9, 56, 14, 0.8)',
                          borderColor: `${BRAND.gold}60`
                        }}
                      >
                        {section.label}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    </div>
  );
};

const AnalysisViewer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Extract the UUID from the slug (supports both old UUID-only and new team-vs-team-uuid formats)
  const analysisId = slug ? extractAnalysisIdFromSlug(slug) : null;

  const handleSaveAsPdf = useCallback(async () => {
    if (!pageRef.current || !analysis) return;
    
    setIsSaving(true);
    toast.info('Preparing PDF... Please wait');
    
    // Scroll to top before capture
    window.scrollTo(0, 0);
    
    // Add printing attribute to disable animations
    document.body.setAttribute('data-printing', 'true');
    
    // Wait for React to re-render with all sections open
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const element = pageRef.current;
      
      // Force all expandable sections open before measuring
      const expandableSections = element.querySelectorAll('[data-expandable]');
      expandableSections.forEach((section: any) => {
        section.style.display = 'block';
        section.style.maxHeight = 'none';
        section.style.overflow = 'visible';
        section.style.height = 'auto';
      });
      
      // Wait for layout recalculation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the actual content dimensions
      const rect = element.getBoundingClientRect();
      const contentWidth = element.offsetWidth;
      const contentHeight = element.scrollHeight;
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#0a1f0d',
        scale: 3, // Higher scale for better header quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: contentWidth,
        height: contentHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0, // Start from absolute top
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc, clonedElement) => {
          // Hide fixed elements that shouldn't be in PDF
          const fixedElements = clonedDoc.querySelectorAll('.fixed, [class*="fixed"]');
          fixedElements.forEach((el: any) => {
            el.style.display = 'none';
          });
          
          // Remove padding from the main container for clean capture
          clonedElement.style.padding = '0';
          clonedElement.style.margin = '0';
          
          // Add style to disable all animations in the clone
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * { 
              animation: none !important; 
              transition: none !important; 
              opacity: 1 !important;
              transform: none !important;
            }
            .fixed, [class*="fixed"] {
              display: none !important;
            }
            [data-expandable] {
              display: block !important;
              max-height: none !important;
              overflow: visible !important;
              height: auto !important;
            }
          `;
          clonedDoc.head.appendChild(style);
          
          // Force visibility on all expandable content
          const allElements = clonedDoc.querySelectorAll('[data-expandable], [data-expandable] *');
          allElements.forEach((el: any) => {
            el.style.display = el.style.display === 'none' ? 'block' : el.style.display;
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.maxHeight = 'none';
            el.style.overflow = 'visible';
          });
        }
      });
      
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas is empty');
      }
      
      // Single page PDF - fit all content on one page with proper aspect ratio
      const pdfWidth = 210; // A4 width in mm
      const aspectRatio = canvas.height / canvas.width;
      const pdfHeight = pdfWidth * aspectRatio;
      
      // Create single-page PDF with custom height to fit all content
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      // Generate the PDF as a blob
      const pdfBlob = pdf.output('blob');
      const fileName = `${analysis.home_team || 'Home'}-vs-${analysis.away_team || 'Away'}-analysis.pdf`.replace(/\s+/g, '-').toLowerCase();
      
      // Upload to Supabase storage
      const filePath = `analysis-pdfs/${analysis.id}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('analyses')
        .upload(filePath, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        // Still save locally if upload fails
        pdf.save(fileName);
        toast.warning('PDF saved locally. Cloud upload failed.');
      } else {
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('analyses')
          .getPublicUrl(filePath);
        
        // Update the analysis record with the PDF URL
        const { error: updateError } = await supabase
          .from('analyses')
          .update({ pdf_url: urlData.publicUrl })
          .eq('id', analysis.id);
        
        if (updateError) {
          console.error('Update error:', updateError);
        }
        
        // Also save locally
        pdf.save(fileName);
        toast.success('PDF saved and uploaded!');
      }
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast.error('Failed to save PDF. Please try again.');
    } finally {
      document.body.removeAttribute('data-printing');
      setIsSaving(false);
    }
  }, [analysis]);

  useEffect(() => {
    if (analysisId) {
      fetchAnalysis();
    }
  }, [analysisId]);

  const fetchAnalysis = async () => {
    try {
      // Fetch analysis data
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", analysisId)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      // Player name: First check if it's stored directly on the analysis, then fallback to player_analysis join
      let playerName: string | null = data.player_name || null;
      
      // If no direct player_name, try to fetch via player_analysis linkage
      if (!playerName) {
        // Try: check if this analysis is linked via analysis_writer_id
        const { data: linkedData1 } = await supabase
          .from("player_analysis")
          .select("player_id, players(name)")
          .eq("analysis_writer_id", analysisId)
          .maybeSingle();
        
        if (linkedData1?.players) {
          playerName = (linkedData1.players as any).name;
        }
        
        // Second try: check if this analysis was created for a player (via fixture linkage)
        if (!playerName && data.fixture_id) {
          const { data: fixturePlayer } = await supabase
            .from("player_analysis")
            .select("players(name)")
            .eq("fixture_id", data.fixture_id)
            .maybeSingle();
          
          if (fixturePlayer?.players) {
            playerName = (fixturePlayer.players as any).name;
          }
        }
      }
      
      console.log("Player name resolved:", playerName);
      
      const parsedAnalysis: Analysis = {
        ...data,
        player_name: playerName,
        match_date: data.match_date || null,
        home_team_logo: data.home_team_logo || null,
        away_team_logo: data.away_team_logo || null,
        match_image_url: data.match_image_url || null,
        home_team_bg_color: data.home_team_bg_color || '#1a1a1a',
        away_team_bg_color: data.away_team_bg_color || '#8B0000',
        selected_scheme: data.selected_scheme || null,
        starting_xi: Array.isArray(data.starting_xi) ? data.starting_xi : [],
        kit_primary_color: data.kit_primary_color || '#FFD700',
        kit_secondary_color: data.kit_secondary_color || '#000000',
        kit_collar_color: data.kit_collar_color || '#FFFFFF',
        kit_number_color: data.kit_number_color || '#FFFFFF',
        kit_stripe_style: data.kit_stripe_style || 'none',
        player_team: data.player_team || null,
        matchups: Array.isArray(data.matchups) ? data.matchups : [],
        points: Array.isArray(data.points) ? data.points : []
      };
      
      setAnalysis(parsedAnalysis);
    } catch (error: any) {
      console.error("Error fetching analysis:", error);
      toast.error("Failed to load analysis. Please check database permissions.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-bebas tracking-wider">Loading analysis...</p>
        </motion.div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-muted-foreground text-xl mb-4">Analysis not found</p>
          <p className="text-muted-foreground text-sm mb-4">The analysis may not exist or you may not have permission to view it.</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isPreMatch = analysis.analysis_type === "pre-match";
  const isPostMatch = analysis.analysis_type === "post-match";
  const isConcept = analysis.analysis_type === "concept";

  // Build quick nav sections based on available content
  const navSections = [];
  if (analysis.key_details) navSections.push({ id: SECTION_IDS.overview, label: "Overview" });
  if (analysis.opposition_strengths) navSections.push({ id: SECTION_IDS.strengths, label: "Opposition Strengths" });
  if (analysis.opposition_weaknesses) navSections.push({ id: SECTION_IDS.weaknesses, label: "Opposition Weaknesses" });
  if (analysis.matchups?.length > 0) navSections.push({ id: SECTION_IDS.matchups, label: "Potential Matchups" });
  if (analysis.scheme_title || analysis.selected_scheme) navSections.push({ id: SECTION_IDS.scheme, label: "Scheme" });
  if (analysis.strengths_improvements) navSections.push({ id: SECTION_IDS.improvements, label: "Improvements" });
  // Add points to nav
  if (analysis.points && analysis.points.length > 0) {
    analysis.points.forEach((point: any, index: number) => {
      navSections.push({ id: `section-point-${index}`, label: point.title });
    });
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/analysis-page-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Gold inset vertical lines - 6px from edges, 2px thickness - connect with header border */}
      <div 
        className="fixed top-0 bottom-0 left-[6px] w-[2px] z-10 pointer-events-none"
        style={{ backgroundColor: BRAND.gold }}
      />
      <div 
        className="fixed top-0 bottom-0 right-[6px] w-[2px] z-10 pointer-events-none"
        style={{ backgroundColor: BRAND.gold }}
      />


      {/* Video Button - Fixed */}
      {analysis.video_url && (
        <motion.div 
          className="fixed bottom-4 right-8 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => window.open(analysis.video_url!, '_blank')}
            className="font-bebas uppercase tracking-wider shadow-lg"
            style={{ backgroundColor: BRAND.gold, color: 'black' }}
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Video
          </Button>
        </motion.div>
      )}

      {/* Main content wrapper - padded to stay inside the inset lines */}
      <main ref={pageRef} data-pdf-content className="w-full mx-auto px-[8px]">
        {/* Pre-Match Content */}
        {isPreMatch && (
          <div className="w-full">
            <AnalysisHeader
              homeTeam={analysis.home_team}
              awayTeam={analysis.away_team}
              homeLogo={analysis.home_team_logo}
              awayLogo={analysis.away_team_logo}
              homeBgColor={analysis.home_team_bg_color}
              awayBgColor={analysis.away_team_bg_color}
              matchDate={analysis.match_date}
              onSave={handleSaveAsPdf}
              isSaving={isSaving}
              playerTeam={analysis.player_team}
            />

            {/* Player/Match Image with Premium Gold Arch Frame - arch directly on bottom of image */}
            {(analysis.player_image_url || analysis.match_image_url) && (
              <ScrollReveal className="w-full">
                <div 
                  className="relative w-full overflow-hidden"
                  style={{
                    backgroundImage: `url('/analysis-page-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Green fade gradient overlay - doubled height, layered ON TOP of match image */}
                  <div 
                    className="absolute inset-x-0 top-0 h-32 md:h-48 z-20 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, #0a2e12 0%, transparent 100%)'
                    }}
                  />
                  
                  {/* Subtle shader overlay for premium look */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
                      mixBlendMode: 'multiply'
                    }}
                  />
                  
                  {/* Image container with gold arch band that merges image into grass background */}
                  <div className="relative w-full z-0">
                    <div className="relative w-full" style={{ height: '400px', maxHeight: '400px' }}>
                      <img
                        src={analysis.player_image_url || analysis.match_image_url}
                        alt={analysis.player_name || "Match"}
                        className="w-full h-full object-cover object-top"
                      />
                      
                      {/* Gold arch with transparent outer glow and solid center - positioned at bottom of image */}
                      <div className="absolute bottom-0 left-0 right-0 z-30">
                        {/* Outer transparent glow arch - fades naturally into image */}
                        <svg 
                          className="w-full"
                          viewBox="0 0 400 120" 
                          preserveAspectRatio="none"
                          style={{ height: '120px' }}
                        >
                          <defs>
                            <linearGradient id="goldFadeUp" x1="0%" y1="100%" x2="0%" y2="0%">
                              <stop offset="0%" stopColor="#fdc61b" />
                              <stop offset="60%" stopColor="rgba(253,198,27,0.4)" />
                              <stop offset="100%" stopColor="rgba(253,198,27,0)" />
                            </linearGradient>
                          </defs>
                          {/* Transparent outer arch for natural fade */}
                          <path d="M0,20 Q200,70 400,20 L400,120 L0,120 Z" fill="url(#goldFadeUp)" />
                          {/* Solid gold arch band - main visible arch */}
                          <path d="M0,50 Q200,90 400,50 L400,120 L0,120 Z" fill="#fdc61b" />
                        </svg>
                        
                        {/* Player name positioned centered on the arch */}
                        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ paddingTop: '30px' }}>
                          <div 
                            className="relative overflow-hidden rounded-full px-8 md:px-12 py-2 md:py-3"
                            style={{
                              backgroundImage: `url('/grass-bg-smoky.png')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              border: `2px solid ${BRAND.gold}`,
                              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                            }}
                          >
                            {/* Dark overlay for smoky effect */}
                            <div className="absolute inset-0 bg-black/40 rounded-full" />
                            <h2 
                              className="relative text-lg md:text-2xl lg:text-3xl font-bebas uppercase tracking-widest text-center drop-shadow-md text-white"
                            >
                              <HoverText text={analysis.player_name?.toUpperCase() || "PLAYER NAME"} />
                            </h2>
                          </div>
                        </div>
                      </div>
                      
                      {/* Downward arch below the image - extends into grass */}
                      <div className="absolute -bottom-[60px] left-0 right-0 z-20">
                        <svg 
                          className="w-full"
                          viewBox="0 0 400 60" 
                          preserveAspectRatio="none"
                          style={{ height: '60px' }}
                        >
                          <defs>
                            <linearGradient id="goldFadeDown" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#fdc61b" />
                              <stop offset="40%" stopColor="rgba(253,198,27,0.4)" />
                              <stop offset="100%" stopColor="rgba(253,198,27,0)" />
                            </linearGradient>
                          </defs>
                          {/* Downward curving arch that fades into grass */}
                          <path d="M0,0 L400,0 Q200,60 0,0 Z" fill="url(#goldFadeDown)" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Quick Nav Dropdown - MOVED below player name, hidden when saving */}
            {navSections.length > 0 && !isSaving && <QuickNavDropdown sections={navSections} />}

            {/* Overview Section */}
            {analysis.key_details && (
              <ExpandableSection title="Overview" id={SECTION_IDS.overview} forceOpen={isSaving}>
                <TextReveal>
                  <p className="leading-relaxed whitespace-pre-wrap text-base md:text-lg" style={{ color: BRAND.bodyText }}>
                    {analysis.key_details}
                  </p>
                </TextReveal>
              </ExpandableSection>
            )}

            {/* Opposition Strengths */}
            {analysis.opposition_strengths && (
              <ExpandableSection title="Opposition Strengths" id={SECTION_IDS.strengths} icon="plus" forceOpen={isSaving}>
                <div className="space-y-3">
                  {analysis.opposition_strengths.split('\n').filter(line => line.trim()).map((line, idx) => {
                    const cleanLine = line.trim().replace(/^[-•]\s*/, '');
                    return (
                      <TextReveal key={idx} delay={idx * 0.1}>
                        <div className="flex items-start gap-3">
                          <div 
                            className="rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: BRAND.gold }}
                          >
                            <Plus className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <p className="text-sm md:text-base leading-relaxed pt-0.5 italic" style={{ color: BRAND.bodyText }}>{cleanLine}</p>
                        </div>
                      </TextReveal>
                    );
                  })}
                </div>
              </ExpandableSection>
            )}

            {/* Opposition Weaknesses */}
            {analysis.opposition_weaknesses && (
              <ExpandableSection title="Opposition Weaknesses" id={SECTION_IDS.weaknesses} icon="minus" forceOpen={isSaving}>
                <div className="space-y-3">
                  {analysis.opposition_weaknesses.split('\n').filter(line => line.trim()).map((line, idx) => {
                    const cleanLine = line.trim().replace(/^[-•]\s*/, '');
                    return (
                      <TextReveal key={idx} delay={idx * 0.1}>
                        <div className="flex items-start gap-3">
                          <div 
                            className="rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: BRAND.gold }}
                          >
                            <Minus className="w-4 h-4 md:w-5 md:h-5 text-black" />
                          </div>
                          <p className="text-sm md:text-base leading-relaxed pt-0.5 italic" style={{ color: BRAND.bodyText }}>{cleanLine}</p>
                        </div>
                      </TextReveal>
                    );
                  })}
                </div>
              </ExpandableSection>
            )}

            {/* Key Matchups - Uses ExpandableSection for consistent auto-close behavior */}
            {analysis.matchups && analysis.matchups.length > 0 && (
              <ExpandableSection 
                title="Potential Matchup(s)" 
                id={SECTION_IDS.matchups}
                transparentContent
                forceOpen={isSaving}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {analysis.matchups.map((matchup: any, index: number) => (
                    <TextReveal key={index} delay={index * 0.15}>
                      <div 
                        className="relative rounded-xl overflow-hidden"
                        style={{
                          backgroundImage: `url('/Smoky-Background.png')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: `2px solid ${BRAND.gold}`,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                        }}
                      >
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 pointer-events-none" />
                        
                        {/* Horizontal layout with full-height image on left */}
                        <div className="relative flex">
                          {/* Player image - spans full height from bottom to top border */}
                          <div className="w-28 md:w-32 flex-shrink-0 self-stretch">
                            {matchup.image_url ? (
                              <img
                                src={matchup.image_url}
                                alt={matchup.name}
                                className="w-full h-full object-cover object-top"
                                style={{ minHeight: '100%' }}
                              />
                            ) : (
                              <div className="w-full h-full bg-black/40 flex items-center justify-center text-white/50 text-xs min-h-[120px]">
                                No image
                              </div>
                            )}
                          </div>
                          
                          {/* Content to the right of image */}
                          <div className="flex-1 p-4 md:p-5 flex flex-col justify-center">
                            {/* Name */}
                            <h3 className="font-bebas text-lg md:text-xl uppercase tracking-wide text-white drop-shadow-lg leading-tight">
                              {matchup.name?.toUpperCase()}
                            </h3>
                            
                            {/* Number */}
                            {matchup.shirt_number && (
                              <p className="text-2xl md:text-3xl font-bold mt-1" style={{ color: BRAND.gold }}>
                                #{matchup.shirt_number}
                              </p>
                            )}
                            
                            {/* Notes */}
                            {matchup.notes && (
                              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${BRAND.gold}40` }}>
                                <p className="text-sm md:text-base text-white/90 leading-relaxed">
                                  {matchup.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TextReveal>
                  ))}
                </div>
              </ExpandableSection>
            )}

            {/* Scheme Section */}
            {(analysis.scheme_title || analysis.selected_scheme) && (
              <ExpandableSection title={analysis.scheme_title || "Tactical Scheme"} id={SECTION_IDS.scheme} forceOpen={isSaving}>
                <div className="space-y-4 md:space-y-6">
                  {analysis.scheme_paragraph_1 && (
                    <TextReveal>
                      <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                        {analysis.scheme_paragraph_1}
                      </p>
                    </TextReveal>
                  )}
                  
                  {analysis.selected_scheme && (
                    <TextReveal delay={0.2}>
                      <div 
                        className="relative rounded-lg min-h-[400px] md:min-h-[600px] border-4 shadow-xl overflow-hidden" 
                        style={{ 
                          borderColor: BRAND.gold,
                          background: 'linear-gradient(180deg, #1a5c2a 0%, #0d4a1c 30%, #0a3d16 70%, #082f10 100%)'
                        }}
                      >
                        {/* Grass texture overlay */}
                        <div 
                          className="absolute inset-0 opacity-30 pointer-events-none"
                          style={{
                            backgroundImage: `url('/analysis-grass-bg.png')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            mixBlendMode: 'overlay'
                          }}
                        />
                        
                        {/* Formation name - top left, angled, premium styling - responsive */}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-20">
                          <div 
                            className="relative px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-lg shadow-xl"
                            style={{
                              background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.95) 100%)',
                              border: `2px solid ${BRAND.gold}`,
                              transform: 'skewX(-5deg)'
                            }}
                          >
                            <span 
                              className="font-bebas text-lg sm:text-2xl md:text-4xl tracking-[0.15em] uppercase drop-shadow-lg"
                              style={{ 
                                color: BRAND.gold,
                                transform: 'skewX(5deg)',
                                display: 'inline-block',
                                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                              }}
                            >
                              {analysis.selected_scheme}
                            </span>
                          </div>
                        </div>
                        
                        {/* Field markings */}
                        <div className="absolute inset-4 md:inset-8 border-2 border-white/40 rounded-lg"></div>
                        <div className="absolute inset-x-4 md:inset-x-8 top-1/2 h-0.5 bg-white/40"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 border-2 border-white/40 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white/50 rounded-full"></div>
                        {/* Top penalty area */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-4 md:top-8 w-32 md:w-48 h-16 md:h-24 border-2 border-white/40 border-t-0"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-4 md:top-8 w-16 md:w-24 h-8 md:h-12 border-2 border-white/40 border-t-0"></div>
                        {/* Top goal */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-4 md:top-8 w-10 md:w-14 h-2 bg-white/30 rounded-b"></div>
                        {/* Bottom penalty area */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-8 w-32 md:w-48 h-16 md:h-24 border-2 border-white/40 border-b-0"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-8 w-16 md:w-24 h-8 md:h-12 border-2 border-white/40 border-b-0"></div>
                        {/* Bottom goal */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-8 w-10 md:w-14 h-2 bg-white/30 rounded-t"></div>
                        {/* Corner arcs */}
                        <div className="absolute top-4 left-4 md:top-8 md:left-8 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-white/40 rounded-br-full"></div>
                        <div className="absolute top-4 right-4 md:top-8 md:right-8 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-white/40 rounded-bl-full"></div>
                        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-white/40 rounded-tr-full"></div>
                        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-white/40 rounded-tl-full"></div>
                        
                        {analysis.starting_xi && analysis.starting_xi.length > 0 && (
                          <div className="absolute inset-0 p-4 md:p-8">
                            {analysis.starting_xi.map((player: any, index: number) => (
                              <div
                                key={index}
                                className="absolute flex flex-col items-center gap-0"
                                style={{
                                  left: `${player.x}%`,
                                  top: `${player.y}%`,
                                  transform: 'translate(-50%, -50%)'
                                }}
                              >
                              {/* Kit sizes increased by 25% */}
                                <div className="scale-95 md:scale-125 lg:scale-150 drop-shadow-xl">
                                  <PlayerKit 
                                    primaryColor={analysis.kit_primary_color || '#FFD700'}
                                    secondaryColor={analysis.kit_secondary_color || '#000000'}
                                    stripeStyle="thick"
                                    number={player.number || '0'}
                                  />
                                </div>
                                {/* Cooler player name UI with more pop - adjusted margin for larger kits */}
                                <div 
                                  className="relative px-2 md:px-4 py-1 md:py-1.5 rounded-md text-[9px] md:text-xs font-bold whitespace-nowrap mt-0 md:mt-1 shadow-xl overflow-hidden"
                                  style={{
                                    background: `linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.9) 50%, rgba(0,0,0,0.95) 100%)`,
                                    border: `2px solid ${BRAND.gold}`,
                                    boxShadow: `0 4px 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`
                                  }}
                                >
                                  {/* Gold accent line at top */}
                                  <div 
                                    className="absolute top-0 left-0 right-0 h-0.5"
                                    style={{ background: `linear-gradient(90deg, transparent, ${BRAND.gold}, transparent)` }}
                                  />
                                  <span 
                                    className="relative uppercase tracking-wider"
                                    style={{ 
                                      color: BRAND.gold,
                                      textShadow: '0 0 10px rgba(253,198,27,0.5)'
                                    }}
                                  >
                                    {player.surname || player.position}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TextReveal>
                  )}
                  
                  {analysis.scheme_paragraph_2 && (
                    <TextReveal delay={0.3}>
                      <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                        {analysis.scheme_paragraph_2}
                      </p>
                    </TextReveal>
                  )}
                </div>
              </ExpandableSection>
            )}

            {/* Additional Points */}
            {analysis.points && analysis.points.length > 0 && (
              <div className="w-full">
                {analysis.points.map((point: any, index: number) => (
                  <ExpandableSection 
                    key={index} 
                    title={point.title}
                    id={`section-point-${index}`}
                    forceOpen={isSaving}
                  >
                    <div className="space-y-4 md:space-y-6">
                      {point.paragraph_1 && (
                        <TextReveal>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                            {point.paragraph_1}
                          </p>
                        </TextReveal>
                      )}
                      {point.images && point.images.length > 0 && (
                        <TextReveal delay={0.15}>
                          <div className="flex flex-col items-center gap-4">
                            {point.images.map((img: string, imgIndex: number) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt={`${point.title} - Image ${imgIndex + 1}`}
                                className="w-full rounded-lg shadow-md border-2"
                                style={{ borderColor: BRAND.gold }}
                              />
                            ))}
                          </div>
                        </TextReveal>
                      )}
                      {point.video_url && (
                        <TextReveal delay={0.2}>
                          <AnalysisVideo
                            src={point.video_url}
                            className="w-full rounded-lg shadow-md border-2"
                            style={{ borderColor: BRAND.gold }}
                          />
                        </TextReveal>
                      )}
                      {point.paragraph_2 && (
                        <TextReveal delay={0.25}>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                            {point.paragraph_2}
                          </p>
                        </TextReveal>
                      )}
                    </div>
                  </ExpandableSection>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Post-Match Content */}
        {isPostMatch && (
          <div className="w-full">
            <AnalysisHeader
              homeTeam={analysis.home_team}
              awayTeam={analysis.away_team}
              homeLogo={analysis.home_team_logo}
              awayLogo={analysis.away_team_logo}
              homeBgColor={analysis.home_team_bg_color}
              awayBgColor={analysis.away_team_bg_color}
              homeScore={analysis.home_score}
              awayScore={analysis.away_score}
              matchDate={analysis.match_date}
              isPostMatch
              onSave={handleSaveAsPdf}
              isSaving={isSaving}
              playerTeam={analysis.player_team}
            />

            {/* Player Image with Premium Gold Arch Frame */}
            {analysis.player_image_url && (
              <ScrollReveal className="w-full">
                <div className="relative w-full overflow-hidden">
                  {/* Green fade gradient overlay - layered on top of match image */}
                  <div 
                    className="absolute inset-x-0 top-0 h-32 md:h-48 z-10 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, #0a2e12 0%, transparent 100%)'
                    }}
                  />
                  
                  {/* Player image container - square aspect ratio */}
                  <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                    <img
                      src={analysis.player_image_url}
                      alt={analysis.player_name || "Player"}
                      className="w-full h-full object-cover object-top"
                    />
                    
                    {/* Thick Gold Arch Frame at bottom - creates the premium curved border effect */}
                    <svg 
                      className="absolute bottom-0 left-0 right-0 w-full"
                      style={{ height: '60%' }}
                      viewBox="0 0 400 240" 
                      preserveAspectRatio="none"
                    >
                      {/* Background fill that connects to the grass section */}
                      <path
                        d="M0,240 L0,180 Q200,0 400,180 L400,240 Z"
                        fill={BRAND.gold}
                      />
                      {/* Inner curve for thickness effect */}
                      <path
                        d="M0,240 L0,204 Q200,36 400,204 L400,240 Z"
                        fill="#0a1f0d"
                      />
                    </svg>
                  </div>
                  
                  {/* Grass background area with player name */}
                  <div 
                    className="relative py-6 md:py-10"
                    style={{
                      backgroundImage: `url('/analysis-grass-bg.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center top',
                      marginTop: '-2px'
                    }}
                  >
                    {/* Dark overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60 pointer-events-none" />
                    
                    {/* Player name in GOLD CAPITALS with HoverText effect */}
                    <div className="relative text-center px-4">
                      <h2 
                        className="text-3xl md:text-5xl lg:text-6xl font-bebas uppercase tracking-[0.2em] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                        style={{ color: BRAND.gold }}
                      >
                        <HoverText text={analysis.player_name?.toUpperCase() || "PLAYER NAME"} />
                      </h2>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Quick Nav Dropdown - hidden when saving, positioned below player name */}
            {navSections.length > 0 && !isSaving && <QuickNavDropdown sections={navSections} />}

            {/* Overview */}
            {analysis.key_details && (
              <ExpandableSection title="Overview" id={SECTION_IDS.overview} forceOpen={isSaving}>
                <TextReveal>
                  <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                    {analysis.key_details}
                  </p>
                </TextReveal>
              </ExpandableSection>
            )}

            {/* Strengths & Improvements */}
            {analysis.strengths_improvements && (
              <ExpandableSection title="Strengths & Areas for Improvement" id={SECTION_IDS.improvements} forceOpen={isSaving}>
                <TextReveal>
                  <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                    {analysis.strengths_improvements}
                  </p>
                </TextReveal>
              </ExpandableSection>
            )}

            {/* Post-Match Points */}
            {analysis.points && analysis.points.length > 0 && (
              <div className="w-full">
                {analysis.points.map((point: any, index: number) => (
                  <ExpandableSection 
                    key={index} 
                    title={point.title}
                    id={`section-point-${index}`}
                    forceOpen={isSaving}
                  >
                    <div className="space-y-4 md:space-y-6">
                      {point.paragraph_1 && (
                        <TextReveal>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                            {point.paragraph_1}
                          </p>
                        </TextReveal>
                      )}
                      {point.images && point.images.length > 0 && (
                        <TextReveal delay={0.15}>
                          <div className="flex flex-col items-center gap-4">
                            {point.images.map((img: string, imgIndex: number) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt={`${point.title} - Image ${imgIndex + 1}`}
                                className="w-full rounded-lg shadow-md border-2"
                                style={{ borderColor: BRAND.gold }}
                              />
                            ))}
                          </div>
                        </TextReveal>
                      )}
                      {point.video_url && (
                        <TextReveal delay={0.2}>
                          <AnalysisVideo
                            src={point.video_url}
                            className="w-full rounded-lg shadow-md border-2"
                            style={{ borderColor: BRAND.gold }}
                          />
                        </TextReveal>
                      )}
                      {point.paragraph_2 && (
                        <TextReveal delay={0.25}>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                            {point.paragraph_2}
                          </p>
                        </TextReveal>
                      )}
                    </div>
                  </ExpandableSection>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Concept Content */}
        {isConcept && (
          <div className="w-full">
            {/* Header */}
            <motion.div 
              className="py-6"
              style={{
                backgroundImage: `url('/analysis-grass-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: `4px solid ${BRAND.gold}`,
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center">
                <img 
                  src={fffLogo} 
                  alt="Fuel For Football" 
                  className="w-20 h-20 md:w-28 md:h-28 object-contain mb-2"
                />
                <h1 className="text-white text-lg md:text-2xl font-bebas tracking-widest uppercase mb-1">
                  FUEL FOR FOOTBALL
                </h1>
                <p 
                  className="text-base md:text-xl font-bebas tracking-wider uppercase mb-4"
                  style={{ color: BRAND.gold }}
                >
                  CHANGE THE GAME
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="bg-black/50 backdrop-blur-sm border-white/30 hover:bg-black/70 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </motion.div>

            <section 
              className="relative w-full py-6"
              style={{
                backgroundImage: `url('/analysis-grass-bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <TacticalSymbols />
              <div className="relative px-4 md:px-6">
                <ContentCard>
                  <div className="text-center">
                    <span 
                      className="text-xs md:text-sm font-bebas uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3"
                      style={{ backgroundColor: BRAND.gold, color: 'black' }}
                    >
                      Concept
                    </span>
                    <h1 className="text-2xl md:text-4xl font-bebas uppercase tracking-wider" style={{ color: BRAND.bodyText }}>
                      {analysis.title || "Concept Analysis"}
                    </h1>
                  </div>
                </ContentCard>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/35" />
            </section>

            {analysis.concept && (
              <ExpandableSection title="Concept" defaultOpen forceOpen={isSaving}>
                <TextReveal>
                  <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                    {analysis.concept}
                  </p>
                </TextReveal>
              </ExpandableSection>
            )}

            {analysis.explanation && (
              <ExpandableSection title="Explanation" forceOpen={isSaving}>
                <TextReveal>
                  <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                    {analysis.explanation}
                  </p>
                </TextReveal>
              </ExpandableSection>
            )}

            {analysis.points && analysis.points.length > 0 && (
              <div className="w-full">
                {analysis.points.map((point: any, index: number) => (
                  <ExpandableSection 
                    key={index} 
                    title={point.title}
                    id={`section-point-${index}`}
                    forceOpen={isSaving}
                  >
                    <div className="space-y-4 md:space-y-6">
                      {point.paragraph_1 && (
                        <TextReveal>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                            {point.paragraph_1}
                          </p>
                        </TextReveal>
                      )}
                      {point.images && point.images.length > 0 && (
                        <TextReveal delay={0.15}>
                          <div className="flex flex-col gap-4">
                            {point.images.map((img: string, imgIndex: number) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt={`${point.title} - Image ${imgIndex + 1}`}
                                className="w-full rounded-lg border-2"
                                style={{ borderColor: BRAND.gold }}
                              />
                            ))}
                          </div>
                        </TextReveal>
                      )}
                      {point.video_url && (
                        <TextReveal delay={0.2}>
                          <AnalysisVideo
                            src={point.video_url}
                            className="w-full rounded-lg shadow-md border-2"
                            style={{ borderColor: BRAND.gold }}
                          />
                        </TextReveal>
                      )}
                      {point.paragraph_2 && (
                        <TextReveal delay={0.25}>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-lg" style={{ color: BRAND.bodyText }}>
                            {point.paragraph_2}
                          </p>
                        </TextReveal>
                      )}
                    </div>
                  </ExpandableSection>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Back to Top Button - INSTANT scroll */}
        <motion.div 
          className="flex justify-center py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className="font-bebas uppercase tracking-wider text-lg px-8 py-4"
            style={{ 
              backgroundColor: BRAND.gold, 
              color: 'black',
              border: `2px solid ${BRAND.gold}`
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2 rotate-90" />
            Back to Top
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default AnalysisViewer;
