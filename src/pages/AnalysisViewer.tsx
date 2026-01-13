import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { ArrowLeft, ChevronDown, Play, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import fffLogo from "@/assets/fff-app-logo.png";

// Brand colors
const GOLD = "#fdc61b";
const DARK_GREEN = "#12571e";
const CONTENT_BG = "#c7d4ca";

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
}

// Tactical symbols SVG for background
const TacticalSymbols = () => (
  <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="tacticalPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        {/* X symbols */}
        <g stroke={GOLD} strokeWidth="2" fill="none">
          <line x1="10" y1="10" x2="25" y2="25" />
          <line x1="25" y1="10" x2="10" y2="25" />
        </g>
        <g stroke={GOLD} strokeWidth="2" fill="none">
          <line x1="85" y1="70" x2="100" y2="85" />
          <line x1="100" y1="70" x2="85" y2="85" />
        </g>
        {/* O symbols */}
        <circle cx="60" cy="20" r="10" stroke={GOLD} strokeWidth="2" fill="none" />
        <circle cx="30" cy="90" r="8" stroke={GOLD} strokeWidth="2" fill="none" />
        {/* Arrows */}
        <g stroke={GOLD} strokeWidth="2" fill="none">
          <line x1="70" y1="50" x2="100" y2="50" />
          <polyline points="92,44 100,50 92,56" />
        </g>
        <g stroke={GOLD} strokeWidth="2" fill="none">
          <path d="M 10,60 Q 25,45 40,60" />
          <polyline points="35,54 40,60 34,64" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#tacticalPattern)" />
  </svg>
);

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

// Section title bar with grass texture
const SectionTitleBar = ({ title }: { title: string }) => (
  <div className="relative overflow-hidden rounded-lg">
    {/* Dark green accent bar on top */}
    <div className="h-2" style={{ backgroundColor: DARK_GREEN }} />
    {/* Grass texture title bar */}
    <div 
      className="py-3 md:py-4 bg-cover bg-center"
      style={{ backgroundImage: `url('/analysis-grass-bg.png')` }}
    >
      <h2 
        className="text-xl md:text-2xl font-bebas uppercase tracking-widest text-center"
        style={{ color: GOLD }}
      >
        {title}
      </h2>
    </div>
  </div>
);

// Content card with proper styling
const ContentCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div 
    className={`rounded-lg p-4 md:p-6 ${className}`}
    style={{ backgroundColor: CONTENT_BG }}
  >
    <div className="text-black">
      {children}
    </div>
  </div>
);

// Auto-expanding section component
const AutoExpandSection = ({ 
  title, 
  children, 
  id,
  defaultOpen = false,
  isStrength = false,
  isWeakness = false,
}: { 
  title: string; 
  children: React.ReactNode; 
  id?: string;
  defaultOpen?: boolean;
  isStrength?: boolean;
  isWeakness?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-30% 0px -50% 0px" });
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (isInView && !isOpen) {
      setIsOpen(true);
    }
  }, [isInView]);

  return (
    <section id={id} className="relative">
      {/* White separator line */}
      <div className="h-px bg-white/60" />
      
      {/* Grass background section */}
      <div 
        ref={ref}
        className="relative py-4 md:py-6 px-6 md:px-8 bg-cover bg-center"
        style={{ backgroundImage: `url('/analysis-grass-bg.png')` }}
      >
        {/* Tactical symbols background */}
        <TacticalSymbols />
        
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Title bar - clickable */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full mb-4"
          >
            <div className="relative overflow-hidden rounded-lg">
              {/* Dark green accent on top */}
              <div className="h-2" style={{ backgroundColor: DARK_GREEN }} />
              {/* Grass texture bar */}
              <div 
                className="py-3 md:py-4 bg-cover bg-center flex items-center justify-center gap-3"
                style={{ backgroundImage: `url('/analysis-grass-bg.png')` }}
              >
                {isStrength && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD }}>
                    <Plus className="w-4 h-4 text-black" />
                  </div>
                )}
                {isWeakness && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD }}>
                    <Minus className="w-4 h-4 text-black" />
                  </div>
                )}
                <h2 
                  className="text-xl md:text-2xl font-bebas uppercase tracking-widest"
                  style={{ color: GOLD }}
                >
                  {title}
                </h2>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5" style={{ color: GOLD }} />
                </motion.div>
              </div>
            </div>
          </button>

          {/* Content */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ContentCard>
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
const TextReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Header component with FFF logo, back button, and VS design
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
  matchImageUrl
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
  matchImageUrl?: string | null;
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="w-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ borderColor: GOLD, borderWidth: '3px', borderStyle: 'solid' }}
    >
      {/* Top section with logo and back button - grass background */}
      <div 
        className="relative py-4 md:py-6 bg-cover bg-center"
        style={{ backgroundImage: `url('/analysis-grass-bg.png')` }}
      >
        {/* Tactical symbols */}
        <TacticalSymbols />
        
        <div className="relative z-10 flex flex-col items-center gap-3">
          {/* FFF Logo */}
          <img 
            src={fffLogo} 
            alt="Fuel For Football" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
          
          {/* Brand text */}
          <div className="text-center">
            <h1 className="text-white font-bebas text-lg md:text-xl tracking-wider uppercase">
              Fuel For Football
            </h1>
            <p className="text-sm md:text-base italic" style={{ color: GOLD }}>
              Change The Game
            </p>
          </div>
          
          {/* Back button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="bg-black/50 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Team logos positioned to pop out above color bars */}
      <div className="relative">
        {/* Logos container - positioned above the color bars */}
        <div className="absolute left-0 right-0 -top-8 md:-top-12 z-20 flex justify-between px-4 md:px-8">
          {/* Home Team Logo */}
          {homeLogo && (
            <div className="w-16 h-20 md:w-24 md:h-28">
              <img 
                src={homeLogo} 
                alt={homeTeam || "Home"} 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          )}
          {/* Away Team Logo */}
          {awayLogo && (
            <div className="w-16 h-20 md:w-24 md:h-28">
              <img 
                src={awayLogo} 
                alt={awayTeam || "Away"} 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          )}
        </div>

        {/* VS Color Bars */}
        <div className="relative h-16 md:h-20 overflow-hidden">
          {/* Left Side - Home Team Color */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-center"
            style={{ backgroundColor: homeBgColor || '#1a1a1a' }}
          >
            <span className="text-lg md:text-2xl font-bebas text-white tracking-wider uppercase text-center px-2">
              {homeTeam}
            </span>
          </div>

          {/* Right Side - Away Team Color */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center"
            style={{ backgroundColor: awayBgColor || '#8B0000' }}
          >
            <span className="text-lg md:text-2xl font-bebas text-white tracking-wider uppercase text-center px-2">
              {awayTeam}
            </span>
          </div>

          {/* Center divider / Score */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {isPostMatch && homeScore !== null && awayScore !== null ? (
              <div 
                className="rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg border-2 border-white"
                style={{ backgroundColor: DARK_GREEN }}
              >
                <span className="text-white text-lg md:text-xl font-bebas font-bold">
                  {homeScore} - {awayScore}
                </span>
              </div>
            ) : (
              <div className="w-1 h-full bg-white" />
            )}
          </div>
        </div>

        {/* Match Date */}
        {matchDate && (
          <div 
            className="text-center py-2"
            style={{ backgroundColor: DARK_GREEN }}
          >
            <span className="text-white font-bebas tracking-wider text-sm md:text-base">
              ({new Date(matchDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })})
            </span>
          </div>
        )}
      </div>

      {/* Match Image - still part of header */}
      {matchImageUrl && (
        <div className="w-full">
          <img 
            src={matchImageUrl} 
            alt="Match" 
            className="w-full max-h-[40vh] md:max-h-[50vh] object-cover"
          />
        </div>
      )}
    </motion.div>
  );
};

// Quick Navigation Dropdown
const QuickNavDropdown = ({ sections, onSelect }: { 
  sections: { id: string; label: string }[];
  onSelect: (id: string) => void;
}) => (
  <div 
    className="sticky top-0 z-40 py-3 px-4"
    style={{ backgroundColor: DARK_GREEN }}
  >
    <Select onValueChange={onSelect}>
      <SelectTrigger 
        className="w-full max-w-xs mx-auto text-sm font-bebas uppercase tracking-wider"
        style={{ 
          backgroundColor: 'rgba(0,0,0,0.3)', 
          borderColor: GOLD,
          color: GOLD 
        }}
      >
        <SelectValue placeholder="Jump to Section..." />
      </SelectTrigger>
      <SelectContent 
        style={{ 
          backgroundColor: DARK_GREEN,
          borderColor: GOLD 
        }}
      >
        {sections.map((section) => (
          <SelectItem 
            key={section.id} 
            value={section.id}
            className="font-bebas uppercase tracking-wider cursor-pointer"
            style={{ color: GOLD }}
          >
            {section.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const AnalysisViewer = () => {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    if (analysisId) {
      fetchAnalysis();
    }
  }, [analysisId]);

  const fetchAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", analysisId)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      const parsedAnalysis: Analysis = {
        ...data,
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Build sections for dropdown
  const navSections: { id: string; label: string }[] = [];
  if (analysis.key_details) navSections.push({ id: "section-overview", label: "Overview" });
  if (analysis.opposition_strengths) navSections.push({ id: "section-strengths", label: "Opposition Strengths" });
  if (analysis.opposition_weaknesses) navSections.push({ id: "section-weaknesses", label: "Opposition Weaknesses" });
  if (analysis.matchups?.length > 0) navSections.push({ id: "section-matchups", label: "Potential Matchups" });
  if (analysis.scheme_title || analysis.selected_scheme) navSections.push({ id: "section-scheme", label: analysis.scheme_title || "Tactical Scheme" });
  if (analysis.strengths_improvements) navSections.push({ id: "section-improvements", label: "Strengths & Improvements" });
  if (analysis.points && analysis.points.length > 0) {
    analysis.points.forEach((point: any, idx: number) => {
      navSections.push({ id: `section-point-${idx}`, label: point.title });
    });
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Gold vertical lines - 4px from edges */}
      <div 
        className="fixed left-1 top-0 bottom-0 w-0.5 z-30 pointer-events-none"
        style={{ backgroundColor: GOLD }}
      />
      <div 
        className="fixed right-1 top-0 bottom-0 w-0.5 z-30 pointer-events-none"
        style={{ backgroundColor: GOLD }}
      />

      {/* Video Button - Fixed */}
      {analysis.video_url && (
        <motion.div 
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => window.open(analysis.video_url!, '_blank')}
            className="font-bebas uppercase tracking-wider shadow-lg"
            style={{ backgroundColor: GOLD, color: 'black' }}
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Video
          </Button>
        </motion.div>
      )}

      {/* Main content - inset from gold lines */}
      <main className="w-full mx-auto" style={{ padding: '0 8px' }}>
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
              matchImageUrl={analysis.match_image_url}
            />

            {/* Quick Nav Dropdown */}
            {navSections.length > 0 && (
              <QuickNavDropdown sections={navSections} onSelect={scrollToSection} />
            )}

            {/* Overview Section */}
            {analysis.key_details && (
              <AutoExpandSection title="Overview" id="section-overview" defaultOpen>
                <TextReveal>
                  <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {analysis.key_details}
                  </p>
                </TextReveal>
              </AutoExpandSection>
            )}

            {/* Opposition Strengths */}
            {analysis.opposition_strengths && (
              <AutoExpandSection title="Opposition Strengths" id="section-strengths" isStrength>
                <div className="space-y-3">
                  {analysis.opposition_strengths.split('\n').filter(line => line.trim()).map((line, idx) => {
                    const cleanLine = line.trim().replace(/^[-•]\s*/, '');
                    return (
                      <TextReveal key={idx} delay={idx * 0.1}>
                        <div className="flex items-start gap-3">
                          <div 
                            className="rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: GOLD }}
                          >
                            <span className="text-black font-bold text-sm">•</span>
                          </div>
                          <p className="text-sm md:text-base leading-relaxed italic">{cleanLine}</p>
                        </div>
                      </TextReveal>
                    );
                  })}
                </div>
              </AutoExpandSection>
            )}

            {/* Opposition Weaknesses */}
            {analysis.opposition_weaknesses && (
              <AutoExpandSection title="Opposition Weaknesses" id="section-weaknesses" isWeakness>
                <div className="space-y-3">
                  {analysis.opposition_weaknesses.split('\n').filter(line => line.trim()).map((line, idx) => {
                    const cleanLine = line.trim().replace(/^[-•]\s*/, '');
                    return (
                      <TextReveal key={idx} delay={idx * 0.1}>
                        <div className="flex items-start gap-3">
                          <div 
                            className="rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: GOLD }}
                          >
                            <span className="text-black font-bold text-sm">•</span>
                          </div>
                          <p className="text-sm md:text-base leading-relaxed italic">{cleanLine}</p>
                        </div>
                      </TextReveal>
                    );
                  })}
                </div>
              </AutoExpandSection>
            )}

            {/* Key Matchups - transparent background */}
            {analysis.matchups && analysis.matchups.length > 0 && (
              <AutoExpandSection title="Potential Matchup(s)" id="section-matchups">
                <div className="flex justify-center items-center gap-4 md:gap-8 flex-wrap bg-transparent">
                  {analysis.matchups.map((matchup: any, index: number) => (
                    <TextReveal key={index} delay={index * 0.15}>
                      <div className="text-center w-28 md:w-36">
                        <div className="mb-2 rounded-lg overflow-hidden border-2 aspect-square flex items-center justify-center shadow-lg bg-white/50" style={{ borderColor: GOLD }}>
                          {matchup.image_url ? (
                            <img
                              src={matchup.image_url}
                              alt={matchup.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-500 text-xs">No image</div>
                          )}
                        </div>
                        <p className="font-bold text-sm md:text-base">{matchup.name}</p>
                        {matchup.shirt_number && (
                          <p className="text-xs font-semibold" style={{ color: DARK_GREEN }}>
                            #{matchup.shirt_number}
                          </p>
                        )}
                      </div>
                    </TextReveal>
                  ))}
                </div>
              </AutoExpandSection>
            )}

            {/* Scheme Section */}
            {(analysis.scheme_title || analysis.selected_scheme) && (
              <AutoExpandSection title={analysis.scheme_title || "Tactical Scheme"} id="section-scheme">
                <div className="space-y-4 md:space-y-6">
                  {analysis.scheme_paragraph_1 && (
                    <TextReveal>
                      <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                        {analysis.scheme_paragraph_1}
                      </p>
                    </TextReveal>
                  )}
                  
                  {analysis.selected_scheme && (
                    <TextReveal delay={0.2}>
                      <div className="relative bg-gradient-to-b from-green-700 to-green-800 rounded-lg p-4 md:p-8 min-h-[350px] md:min-h-[500px] border-4 border-white/20 shadow-xl">
                        <div className="text-white text-center mb-4 text-xl md:text-2xl font-bebas tracking-wider">
                          {analysis.selected_scheme}
                        </div>
                        {/* Field markings */}
                        <div className="absolute inset-4 md:inset-8 border-2 border-white/30 rounded-lg"></div>
                        <div className="absolute inset-x-4 md:inset-x-8 top-1/2 h-0.5 bg-white/30"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 border-2 border-white/30 rounded-full"></div>
                        
                        {analysis.starting_xi && analysis.starting_xi.length > 0 && (
                          <div className="absolute inset-0 p-4 md:p-8">
                            {analysis.starting_xi.map((player: any, index: number) => (
                              <div
                                key={index}
                                className="absolute flex flex-col items-center gap-0.5"
                                style={{
                                  left: `${player.x}%`,
                                  top: `${player.y}%`,
                                  transform: 'translate(-50%, -50%)'
                                }}
                              >
                                <div className="scale-50 md:scale-75">
                                  <PlayerKit 
                                    primaryColor={analysis.kit_primary_color || '#FFD700'}
                                    secondaryColor={analysis.kit_secondary_color || '#000000'}
                                    number={player.number || '0'}
                                  />
                                </div>
                                <div className="bg-black/80 text-white px-1.5 py-0.5 rounded text-[9px] md:text-xs font-bold whitespace-nowrap">
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
                      <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                        {analysis.scheme_paragraph_2}
                      </p>
                    </TextReveal>
                  )}
                </div>
              </AutoExpandSection>
            )}

            {/* Additional Points */}
            {analysis.points && analysis.points.length > 0 && (
              <div className="w-full">
                {analysis.points.map((point: any, index: number) => (
                  <AutoExpandSection 
                    key={index} 
                    title={point.title}
                    id={`section-point-${index}`}
                  >
                    <div className="space-y-4">
                      {point.paragraph_1 && (
                        <TextReveal>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
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
                                className="w-full max-w-3xl rounded-lg shadow-md"
                                style={{ border: `2px solid ${GOLD}` }}
                              />
                            ))}
                          </div>
                        </TextReveal>
                      )}
                      {point.paragraph_2 && (
                        <TextReveal delay={0.25}>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                            {point.paragraph_2}
                          </p>
                        </TextReveal>
                      )}
                    </div>
                  </AutoExpandSection>
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
              matchImageUrl={analysis.player_image_url}
            />

            {/* Quick Nav Dropdown */}
            {navSections.length > 0 && (
              <QuickNavDropdown sections={navSections} onSelect={scrollToSection} />
            )}

            {/* Overview */}
            {analysis.key_details && (
              <AutoExpandSection title="Overview" id="section-overview" defaultOpen>
                <TextReveal>
                  <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {analysis.key_details}
                  </p>
                </TextReveal>
              </AutoExpandSection>
            )}

            {/* Strengths & Improvements */}
            {analysis.strengths_improvements && (
              <AutoExpandSection title="Strengths & Areas for Improvement" id="section-improvements">
                <TextReveal>
                  <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {analysis.strengths_improvements}
                  </p>
                </TextReveal>
              </AutoExpandSection>
            )}

            {/* Post-Match Points */}
            {analysis.points && analysis.points.length > 0 && (
              <div className="w-full">
                {analysis.points.map((point: any, index: number) => (
                  <AutoExpandSection 
                    key={index} 
                    title={point.title}
                    id={`section-point-${index}`}
                  >
                    <div className="space-y-4">
                      {point.paragraph_1 && (
                        <TextReveal>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
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
                                className="w-full max-w-3xl rounded-lg shadow-md"
                                style={{ border: `2px solid ${GOLD}` }}
                              />
                            ))}
                          </div>
                        </TextReveal>
                      )}
                      {point.paragraph_2 && (
                        <TextReveal delay={0.25}>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                            {point.paragraph_2}
                          </p>
                        </TextReveal>
                      )}
                    </div>
                  </AutoExpandSection>
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
              className="relative py-6 bg-cover bg-center"
              style={{ 
                backgroundImage: `url('/analysis-grass-bg.png')`,
                borderColor: GOLD, 
                borderWidth: '3px', 
                borderStyle: 'solid' 
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <TacticalSymbols />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <img 
                  src={fffLogo} 
                  alt="Fuel For Football" 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
                <div className="text-center">
                  <h1 className="text-white font-bebas text-lg md:text-xl tracking-wider uppercase">
                    Fuel For Football
                  </h1>
                  <p className="text-sm md:text-base italic" style={{ color: GOLD }}>
                    Change The Game
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="bg-black/50 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-black"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </motion.div>

            {/* Title Section */}
            <div className="py-4">
              <SectionTitleBar title={analysis.title || "Concept Analysis"} />
            </div>

            {analysis.concept && (
              <AutoExpandSection title="Concept" defaultOpen>
                <TextReveal>
                  <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {analysis.concept}
                  </p>
                </TextReveal>
              </AutoExpandSection>
            )}

            {analysis.explanation && (
              <AutoExpandSection title="Explanation">
                <TextReveal>
                  <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {analysis.explanation}
                  </p>
                </TextReveal>
              </AutoExpandSection>
            )}

            {analysis.points && analysis.points.length > 0 && (
              <div className="w-full">
                {analysis.points.map((point: any, index: number) => (
                  <AutoExpandSection 
                    key={index} 
                    title={point.title}
                  >
                    <div className="space-y-4">
                      {point.paragraph_1 && (
                        <TextReveal>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                            {point.paragraph_1}
                          </p>
                        </TextReveal>
                      )}
                      {point.images && point.images.length > 0 && (
                        <TextReveal delay={0.15}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {point.images.map((img: string, imgIndex: number) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt={`${point.title} - Image ${imgIndex + 1}`}
                                className="w-full rounded-lg"
                                style={{ border: `2px solid ${GOLD}` }}
                              />
                            ))}
                          </div>
                        </TextReveal>
                      )}
                      {point.paragraph_2 && (
                        <TextReveal delay={0.25}>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                            {point.paragraph_2}
                          </p>
                        </TextReveal>
                      )}
                    </div>
                  </AutoExpandSection>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AnalysisViewer;
