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
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import fffLogo from "@/assets/fff_logo.png";

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

// Kit SVG Component
const PlayerKit = ({ primaryColor, secondaryColor, number }: { primaryColor: string; secondaryColor: string; number: string }) => (
  <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
    <path d="M30 25 L25 35 L25 65 L30 75 L70 75 L75 65 L75 35 L70 25 Z" fill={primaryColor} stroke={secondaryColor} strokeWidth="2"/>
    <rect x="42" y="25" width="16" height="50" fill={secondaryColor} opacity="0.8"/>
    <circle cx="50" cy="25" r="8" fill={primaryColor} stroke={secondaryColor} strokeWidth="2"/>
    <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill="white" stroke="black" strokeWidth="1">
      {number}
    </text>
  </svg>
);

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
  isSaving = false
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
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="w-full relative z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top gold border that connects with side lines - at 4px from edge, same 2px thickness */}
      <div 
        className="absolute top-0 left-[4px] right-[4px] h-[2px] z-20"
        style={{ backgroundColor: BRAND.gold }}
      />
      
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
        
        {/* Back button - top left */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="absolute left-3 top-2 bg-black/50 backdrop-blur-sm border-white/30 hover:bg-black/70 text-white py-1 px-2 text-xs z-20"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Back
        </Button>
        
        {/* Save button - top right */}
        {onSave && (
          <Button
            onClick={onSave}
            disabled={isSaving}
            size="sm"
            className="absolute right-3 top-2 font-bebas uppercase tracking-wider shadow-lg text-xs z-20"
            style={{ backgroundColor: BRAND.gold, color: 'black' }}
          >
            <Download className="w-3 h-3 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
        
        <div className="relative flex flex-col items-center justify-center">
          <img 
            src={fffLogo} 
            alt="Fuel For Football" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          <h1 className="text-white text-xs md:text-sm font-bebas tracking-widest uppercase">
            FUEL FOR FOOTBALL
          </h1>
          <p 
            className="text-[10px] md:text-xs font-bebas tracking-wider uppercase"
            style={{ color: BRAND.gold }}
          >
            CHANGE THE GAME
          </p>
        </div>
      </div>

      {/* Team colors bar with logos BEHIND the color containers - using OLD grass (analysis-grass-bg) behind VS */}
      <div 
        className="relative h-10 md:h-14 overflow-visible"
        style={{
          backgroundImage: `url('/analysis-grass-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-[5]" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-[5]" />
        
        {/* Club logos - centered at 25% and 75% (center of each half), moved up by 12px */}
        {homeLogo && (
          <div className="absolute left-[25%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-24 h-24 md:w-36 md:h-36 z-0 -mt-3">
            <img src={homeLogo} alt="" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
        )}
        {awayLogo && (
          <div className="absolute left-[75%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-24 h-24 md:w-36 md:h-36 z-0 -mt-3">
            <img src={awayLogo} alt="" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
        )}

        {/* Left Side - Home Team Color */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/2 z-10 flex items-center justify-center"
          style={{ 
            backgroundColor: homeBgColor || '#1a1a1a',
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)'
          }}
        >
          <span className="text-xl md:text-2xl font-bebas text-white tracking-wide uppercase text-center">
            {homeTeam}
          </span>
        </div>

        {/* Right Side - Away Team Color */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2 z-10 flex items-center justify-center"
          style={{ 
            backgroundColor: awayBgColor || '#8B0000',
            clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)'
          }}
        >
          <span className="text-xl md:text-2xl font-bebas text-white tracking-wide uppercase text-center">
            {awayTeam}
          </span>
        </div>

        {/* VS Badge - Center - highest z-index */}
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
            <div className="bg-black rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 border-white shadow-lg">
              <span className="text-white text-base md:text-lg font-bebas font-bold">VS</span>
            </div>
          )}
        </div>
      </div>

      {/* Match Date Line - ONLY date, compact, DARKER brand green */}
      {matchDate && (
        <div 
          className="text-center py-2"
          style={{ backgroundColor: '#0a2e12' }}
        >
          <span className="text-white font-bebas tracking-wider text-sm md:text-base">
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
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }, 50);
  };

  return (
    <motion.div 
      ref={dropdownRef}
      className="sticky top-0 z-40 py-2"
      style={{ 
        backgroundImage: `url('/analysis-grass-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Dark overlay for smoky effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 pointer-events-none" />
      
      <div className="relative flex justify-center px-4">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-base md:text-lg px-6 py-2 font-bebas tracking-wider hover:bg-white/10 transition-colors"
              style={{ 
                backgroundColor: 'rgba(9, 56, 14, 0.9)',
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
              backgroundImage: `url('/analysis-grass-bg.png')`,
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
            
            {/* Key Info Sections - centered, horizontal wrap */}
            {keyInfoSections.length > 0 && (
              <div className="relative mb-4 text-center">
                <div className="py-1 text-sm md:text-base uppercase tracking-widest font-bebas border-b mb-3" style={{ color: BRAND.gold, borderColor: `${BRAND.gold}50` }}>
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
            
            {/* Points Sections - centered, wrap to multiple lines */}
            {pointSections.length > 0 && (
              <div className="relative text-center">
                <div className="py-1 text-sm md:text-base uppercase tracking-widest font-bebas border-b mb-3" style={{ color: BRAND.gold, borderColor: `${BRAND.gold}50` }}>
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
      
      const scrollHeight = element.scrollHeight;
      const scrollWidth = element.scrollWidth || element.offsetWidth;
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#0a1f0d',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: scrollWidth,
        height: scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: scrollWidth,
        windowHeight: scrollHeight,
        onclone: (clonedDoc) => {
          // Add style to disable all animations in the clone
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * { 
              animation: none !important; 
              transition: none !important; 
              opacity: 1 !important;
              transform: none !important;
            }
            [data-expandable] {
              display: block !important;
              max-height: none !important;
              overflow: visible !important;
              height: auto !important;
            }
          `;
          clonedDoc.head.appendChild(style);
          
          // Force visibility on all elements
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
      
      // A4 dimensions in mm
      const a4Width = 210;
      const a4Height = 297;
      
      // Calculate how the content fits
      const imgWidth = a4Width;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create multi-page PDF if content is taller than one page
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      if (imgHeight <= a4Height) {
        // Single page
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multi-page: split the image
        let remainingHeight = imgHeight;
        let position = 0;
        let pageNum = 0;
        
        while (remainingHeight > 0) {
          if (pageNum > 0) {
            pdf.addPage();
          }
          
          // Calculate source position in the original canvas
          const sourceY = (position / imgHeight) * canvas.height;
          const sourceHeight = Math.min((a4Height / imgHeight) * canvas.height, canvas.height - sourceY);
          
          // Create a temporary canvas for this page slice
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;
          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            const pageImgHeight = (sourceHeight * imgWidth) / canvas.width;
            pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageImgHeight);
          }
          
          position += a4Height;
          remainingHeight -= a4Height;
          pageNum++;
        }
      }
      
      const fileName = `${analysis.home_team || 'Home'}-vs-${analysis.away_team || 'Away'}-analysis.pdf`;
      pdf.save(fileName.replace(/\s+/g, '-').toLowerCase());
      
      toast.success('Analysis saved as PDF!');
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
      {/* Gold inset vertical lines - 4px from edges, 2px thickness - connect with header border */}
      <div 
        className="fixed top-0 bottom-0 left-[4px] w-[2px] z-10 pointer-events-none"
        style={{ backgroundColor: BRAND.gold }}
      />
      <div 
        className="fixed top-0 bottom-0 right-[4px] w-[2px] z-10 pointer-events-none"
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
            />

            {/* Quick Nav Dropdown - hidden when saving */}
            {navSections.length > 0 && !isSaving && <QuickNavDropdown sections={navSections} />}

            {/* Player Image with Premium Gold Arch Frame */}
            {analysis.player_image_url && (
              <ScrollReveal className="w-full">
                <div className="relative w-full overflow-hidden">
                  {/* Player image container - square aspect ratio */}
                  <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                    <img
                      src={analysis.player_image_url}
                      alt={analysis.player_name || "Player"}
                      className="w-full h-full object-cover object-top"
                    />
                    
                    {/* Thick Gold Arch Frame at bottom */}
                    <svg 
                      className="absolute bottom-0 left-0 right-0 w-full"
                      style={{ height: '20%' }}
                      viewBox="0 0 400 80" 
                      preserveAspectRatio="none"
                    >
                      <path d="M0,80 L0,60 Q200,0 400,60 L400,80 Z" fill="#fdc61b" />
                      <path d="M0,80 L0,68 Q200,12 400,68 L400,80 Z" fill="#0a1f0d" />
                    </svg>
                  </div>
                  
                  {/* Grass background with player name */}
                  <div 
                    className="relative py-6 md:py-10"
                    style={{
                      backgroundImage: `url('/analysis-grass-bg.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center top',
                      marginTop: '-2px'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60 pointer-events-none" />
                    <div className="relative text-center px-4">
                      <h2 
                        className="text-3xl md:text-5xl lg:text-6xl font-bebas uppercase tracking-[0.2em] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                        style={{ color: '#fdc61b' }}
                      >
                        <HoverText text={analysis.player_name?.toUpperCase() || "PLAYER NAME"} />
                      </h2>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Match Image - full width of content area */}
            {analysis.match_image_url && (
              <ScrollReveal className="w-full">
                <div className="w-full">
                  <img 
                    src={analysis.match_image_url} 
                    alt="Match" 
                    className="w-full object-contain"
                  />
                </div>
              </ScrollReveal>
            )}

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
                <div className="flex justify-center items-center gap-3 md:gap-6 flex-wrap">
                  {analysis.matchups.map((matchup: any, index: number) => (
                    <TextReveal key={index} delay={index * 0.15}>
                      <div className="text-center w-24 md:w-36">
                        {/* Image container - NO border, NO background - fully transparent */}
                        <div className="mb-3 md:mb-4 rounded-lg overflow-hidden aspect-square flex items-center justify-center shadow-xl">
                          {matchup.image_url ? (
                            <img
                              src={matchup.image_url}
                              alt={matchup.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-white/50 text-xs md:text-sm w-full h-full flex items-center justify-center">No image</div>
                          )}
                        </div>
                        <p className="font-bold text-base md:text-xl text-white drop-shadow-lg">{matchup.name}</p>
                        {matchup.shirt_number && (
                          <p className="text-sm md:text-base font-semibold" style={{ color: BRAND.gold }}>
                            #{matchup.shirt_number}
                          </p>
                        )}
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
                      <div className="relative bg-gradient-to-b from-green-700 to-green-800 rounded-lg p-4 md:p-8 min-h-[400px] md:min-h-[600px] border-4 shadow-xl" style={{ borderColor: BRAND.gold }}>
                        <div className="text-white text-center mb-4 text-xl md:text-2xl font-bebas tracking-wider">
                          {analysis.selected_scheme}
                        </div>
                        {/* Field markings */}
                        <div className="absolute inset-4 md:inset-8 border-2 border-white/30 rounded-lg"></div>
                        <div className="absolute inset-x-4 md:inset-x-8 top-1/2 h-0.5 bg-white/30"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 border-2 border-white/30 rounded-full"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-4 md:top-8 w-32 md:w-48 h-16 md:h-24 border-2 border-white/30 border-t-0"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-4 md:top-8 w-16 md:w-24 h-8 md:h-12 border-2 border-white/30 border-t-0"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-8 w-32 md:w-48 h-16 md:h-24 border-2 border-white/30 border-b-0"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-8 w-16 md:w-24 h-8 md:h-12 border-2 border-white/30 border-b-0"></div>
                        
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
                                <div className="scale-50 md:scale-100">
                                  <PlayerKit 
                                    primaryColor={analysis.kit_primary_color || '#FFD700'}
                                    secondaryColor={analysis.kit_secondary_color || '#000000'}
                                    number={player.number || '0'}
                                  />
                                </div>
                                <div className="bg-black/80 text-white px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs font-bold whitespace-nowrap -mt-1 md:-mt-2">
                                  {player.surname || player.position}
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
            />

            {/* Quick Nav Dropdown - hidden when saving */}
            {navSections.length > 0 && !isSaving && <QuickNavDropdown sections={navSections} />}

            {/* Player Image with Premium Gold Arch Frame */}
            {analysis.player_image_url && (
              <ScrollReveal className="w-full">
                <div className="relative w-full overflow-hidden">
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
                      style={{ height: '20%' }}
                      viewBox="0 0 400 80" 
                      preserveAspectRatio="none"
                    >
                      {/* Background fill that connects to the grass section */}
                      <path
                        d="M0,80 L0,60 Q200,0 400,60 L400,80 Z"
                        fill={BRAND.gold}
                      />
                      {/* Inner curve for thickness effect */}
                      <path
                        d="M0,80 L0,68 Q200,12 400,68 L400,80 Z"
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
