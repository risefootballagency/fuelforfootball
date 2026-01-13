import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { ArrowLeft, ChevronDown, Play, FileText, Target, Users, Lightbulb, Award, TrendingUp, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import vsBadge from "@/assets/vs-badge.png";

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

// Grass section wrapper
const GrassSection = ({ 
  children, 
  id,
  className = "" 
}: { 
  children: React.ReactNode; 
  id?: string;
  className?: string;
}) => (
  <section 
    id={id}
    className={`relative w-full ${className}`}
    style={{
      backgroundImage: `url('/grass-section-bg.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    <div className="px-4 md:px-6 py-6 md:py-8">
      {children}
    </div>
  </section>
);

// Content card with rounded corners on grass background
const ContentCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-muted/95 backdrop-blur-sm rounded-lg p-4 md:p-6 ${className}`}>
    {children}
  </div>
);

// Auto-expanding section that opens when scrolled into view
const AutoExpandSection = ({ 
  title, 
  children, 
  id,
  defaultOpen = false,
  icon: Icon
}: { 
  title: string; 
  children: React.ReactNode; 
  id?: string;
  defaultOpen?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -60% 0px" });
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(isInView);
  }, [isInView]);

  return (
    <GrassSection id={id}>
      <motion.div 
        ref={ref} 
        className="w-full overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-primary/90 backdrop-blur-sm rounded-t-lg py-3 md:py-4 flex items-center justify-center gap-3 transition-all hover:bg-primary"
        >
          {Icon && <Icon className="w-5 h-5 text-black" />}
          <h2 className="text-xl md:text-2xl font-bebas uppercase tracking-widest text-black">
            {title}
          </h2>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-black" />
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
              <ContentCard className="rounded-t-none">
                {children}
              </ContentCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </GrassSection>
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

// VS Header Component with split colors and logos behind team names
const VSHeader = ({ 
  homeTeam, 
  awayTeam, 
  homeLogo, 
  awayLogo, 
  homeBgColor, 
  awayBgColor,
  homeScore,
  awayScore,
  matchDate,
  isPostMatch = false
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
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Back Button - centered at top */}
      <div className="flex justify-center py-4 bg-background">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary hover:text-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* VS Design Component */}
      <div className="relative h-24 md:h-32 overflow-hidden">
        {/* Left Side - Home Team Color */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/2"
          style={{ 
            backgroundColor: homeBgColor || '#1a1a1a',
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)'
          }}
        >
          {/* Home Team Logo - Behind Text */}
          {homeLogo && (
            <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 opacity-30">
              <img src={homeLogo} alt="" className="w-full h-full object-contain" />
            </div>
          )}
          {/* Home Team Name */}
          <div className="absolute inset-0 flex items-center justify-center pr-8 md:pr-16">
            <span className="text-xl md:text-3xl lg:text-4xl font-bebas text-white tracking-wide uppercase text-center px-4">
              {homeTeam}
            </span>
          </div>
        </div>

        {/* Right Side - Away Team Color */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/2"
          style={{ 
            backgroundColor: awayBgColor || '#8B0000',
            clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)'
          }}
        >
          {/* Away Team Logo - Behind Text */}
          {awayLogo && (
            <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 opacity-30">
              <img src={awayLogo} alt="" className="w-full h-full object-contain" />
            </div>
          )}
          {/* Away Team Name */}
          <div className="absolute inset-0 flex items-center justify-center pl-8 md:pl-16">
            <span className="text-xl md:text-3xl lg:text-4xl font-bebas text-white tracking-wide uppercase text-center px-4">
              {awayTeam}
            </span>
          </div>
        </div>

        {/* VS Badge - Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {isPostMatch && homeScore !== null && awayScore !== null ? (
            <div className="bg-primary rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg">
              <span className="text-black text-xl md:text-2xl font-bebas font-bold">
                {homeScore} - {awayScore}
              </span>
            </div>
          ) : (
            <div className="bg-black rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white text-lg md:text-xl font-bebas font-bold">VS</span>
            </div>
          )}
        </div>
      </div>

      {/* Match Date */}
      {matchDate && (
        <div className="bg-muted text-center py-2 md:py-3">
          <span className="text-foreground/80 font-bebas tracking-wider text-sm md:text-lg">
            {new Date(matchDate).toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Quick Navigation Bar
const QuickNav = ({ sections }: { sections: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] }) => (
  <motion.div 
    className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    <div className="flex overflow-x-auto gap-1 md:gap-2 p-2 md:p-3 justify-center">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant="ghost"
          size="sm"
          onClick={() => {
            const el = document.getElementById(section.id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="flex-shrink-0 text-xs md:text-sm hover:bg-primary/20"
        >
          <section.icon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          <span className="hidden sm:inline">{section.label}</span>
        </Button>
      ))}
    </div>
  </motion.div>
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
      // Fetch without auth restrictions - the shared database analyses table should have public SELECT policy
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
  if (analysis.key_details) navSections.push({ id: SECTION_IDS.overview, label: "Overview", icon: FileText });
  if (analysis.opposition_strengths) navSections.push({ id: SECTION_IDS.strengths, label: "Strengths", icon: Shield });
  if (analysis.opposition_weaknesses) navSections.push({ id: SECTION_IDS.weaknesses, label: "Weaknesses", icon: Target });
  if (analysis.matchups?.length > 0) navSections.push({ id: SECTION_IDS.matchups, label: "Matchups", icon: Users });
  if (analysis.scheme_title || analysis.selected_scheme) navSections.push({ id: SECTION_IDS.scheme, label: "Scheme", icon: TrendingUp });
  if (analysis.strengths_improvements) navSections.push({ id: SECTION_IDS.improvements, label: "Improvements", icon: Award });

  return (
    <div className="min-h-screen bg-background">
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
            className="btn-shine font-bebas uppercase tracking-wider shadow-lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Video
          </Button>
        </motion.div>
      )}

      <main className="w-full">
        {/* Pre-Match Content */}
        {isPreMatch && (
          <div className="w-full">
            <VSHeader
              homeTeam={analysis.home_team}
              awayTeam={analysis.away_team}
              homeLogo={analysis.home_team_logo}
              awayLogo={analysis.away_team_logo}
              homeBgColor={analysis.home_team_bg_color}
              awayBgColor={analysis.away_team_bg_color}
              matchDate={analysis.match_date}
            />

            {/* Quick Nav */}
            {navSections.length > 0 && <QuickNav sections={navSections} />}

            {/* Match Image */}
            {analysis.match_image_url && (
              <ScrollReveal className="w-full">
                <div className="w-full">
                  <img 
                    src={analysis.match_image_url} 
                    alt="Match" 
                    className="w-full max-h-[50vh] md:max-h-[60vh] object-cover"
                  />
                </div>
              </ScrollReveal>
            )}

            {/* Overview Section */}
            {analysis.key_details && (
              <AutoExpandSection title="Overview" id={SECTION_IDS.overview} icon={FileText}>
                <TextReveal>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                    {analysis.key_details}
                  </p>
                </TextReveal>
              </AutoExpandSection>
            )}

            {/* Opposition Strengths */}
            {analysis.opposition_strengths && (
              <AutoExpandSection title="Opposition Strengths" id={SECTION_IDS.strengths} icon={Shield}>
                <div className="space-y-3">
                  {analysis.opposition_strengths.split('\n').filter(line => line.trim()).map((line, idx) => {
                    const cleanLine = line.trim().replace(/^[-•]\s*/, '');
                    return (
                      <TextReveal key={idx} delay={idx * 0.1}>
                        <div className="flex items-start gap-3 bg-primary/10 p-3 md:p-4 rounded-lg">
                          <div className="bg-primary rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
                            <span className="text-black font-bold text-sm md:text-lg">✓</span>
                          </div>
                          <p className="text-foreground text-sm md:text-base leading-relaxed pt-1">{cleanLine}</p>
                        </div>
                      </TextReveal>
                    );
                  })}
                </div>
              </AutoExpandSection>
            )}

            {/* Opposition Weaknesses */}
            {analysis.opposition_weaknesses && (
              <AutoExpandSection title="Opposition Weaknesses" id={SECTION_IDS.weaknesses} icon={Target}>
                <div className="space-y-3">
                  {analysis.opposition_weaknesses.split('\n').filter(line => line.trim()).map((line, idx) => {
                    const cleanLine = line.trim().replace(/^[-•]\s*/, '');
                    return (
                      <TextReveal key={idx} delay={idx * 0.1}>
                        <div className="flex items-start gap-3 bg-accent/10 p-3 md:p-4 rounded-lg">
                          <div className="bg-accent rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0">
                            <span className="text-black font-bold text-sm md:text-lg">!</span>
                          </div>
                          <p className="text-foreground text-sm md:text-base leading-relaxed pt-1">{cleanLine}</p>
                        </div>
                      </TextReveal>
                    );
                  })}
                </div>
              </AutoExpandSection>
            )}

            {/* Key Matchups */}
            {analysis.matchups && analysis.matchups.length > 0 && (
              <AutoExpandSection title="Potential Matchup(s)" id={SECTION_IDS.matchups} icon={Users}>
                <div className="flex justify-center items-center gap-4 md:gap-8 flex-wrap">
                  {analysis.matchups.map((matchup: any, index: number) => (
                    <TextReveal key={index} delay={index * 0.15}>
                      <div className="text-center w-32 md:w-44">
                        <div className="mb-2 md:mb-3 rounded-lg overflow-hidden border-2 border-primary/30 bg-muted aspect-square flex items-center justify-center shadow-lg">
                          {matchup.image_url ? (
                            <img
                              src={matchup.image_url}
                              alt={matchup.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-muted-foreground text-xs md:text-sm">No image</div>
                          )}
                        </div>
                        <p className="font-bold text-foreground text-sm md:text-lg">{matchup.name}</p>
                        {matchup.shirt_number && (
                          <p className="text-xs md:text-sm text-primary font-semibold">
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
              <AutoExpandSection title={analysis.scheme_title || "Tactical Scheme"} id={SECTION_IDS.scheme} icon={TrendingUp}>
                <div className="space-y-4 md:space-y-6">
                  {analysis.scheme_paragraph_1 && (
                    <TextReveal>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
                        {analysis.scheme_paragraph_1}
                      </p>
                    </TextReveal>
                  )}
                  
                  {analysis.selected_scheme && (
                    <TextReveal delay={0.2}>
                      <div className="relative bg-gradient-to-b from-green-700 to-green-800 rounded-lg p-4 md:p-8 min-h-[400px] md:min-h-[600px] border-4 border-white/20 shadow-xl">
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
                                className="absolute flex flex-col items-center gap-0.5 md:gap-1"
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
                                <div className="bg-black/80 text-white px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs font-bold whitespace-nowrap">
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
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
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
                    icon={Lightbulb}
                  >
                    <div className="space-y-4 md:space-y-6">
                      {point.paragraph_1 && (
                        <TextReveal>
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
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
                                className="w-full max-w-4xl rounded-lg shadow-md"
                              />
                            ))}
                          </div>
                        </TextReveal>
                      )}
                      {point.paragraph_2 && (
                        <TextReveal delay={0.25}>
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
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
            <VSHeader
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
            />

            {/* Quick Nav */}
            {navSections.length > 0 && <QuickNav sections={navSections} />}

            {/* Player Image */}
            {analysis.player_image_url && (
              <ScrollReveal className="w-full">
                <div className="w-full">
                  <img
                    src={analysis.player_image_url}
                    alt="Player"
                    className="w-full max-h-[40vh] md:max-h-[50vh] object-cover"
                  />
                </div>
              </ScrollReveal>
            )}

            {/* Overview */}
            {analysis.key_details && (
              <AutoExpandSection title="Overview" id={SECTION_IDS.overview} icon={FileText}>
                <TextReveal>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
                    {analysis.key_details}
                  </p>
                </TextReveal>
              </AutoExpandSection>
            )}

            {/* Strengths & Improvements */}
            {analysis.strengths_improvements && (
              <AutoExpandSection title="Strengths & Areas for Improvement" id={SECTION_IDS.improvements} icon={Award}>
                <TextReveal>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
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
                    icon={Lightbulb}
                  >
                    <div className="space-y-4 md:space-y-6">
                      {point.paragraph_1 && (
                        <TextReveal>
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
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
                                className="w-full max-w-4xl rounded-lg shadow-md"
                              />
                            ))}
                          </div>
                        </TextReveal>
                      )}
                      {point.paragraph_2 && (
                        <TextReveal delay={0.25}>
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
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
              className="py-4 bg-background"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary hover:text-black"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </motion.div>

            <GrassSection>
              <ContentCard>
                <div className="text-center">
                  <span className="text-xs md:text-sm font-bebas uppercase tracking-widest text-primary border border-primary/30 px-3 py-1 rounded-full inline-block mb-3">
                    Concept
                  </span>
                  <h1 className="text-2xl md:text-4xl font-bebas uppercase tracking-wider text-foreground">
                    {analysis.title || "Concept Analysis"}
                  </h1>
                </div>
              </ContentCard>
            </GrassSection>

            {analysis.concept && (
              <AutoExpandSection title="Concept" defaultOpen icon={Lightbulb}>
                <TextReveal>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
                    {analysis.concept}
                  </p>
                </TextReveal>
              </AutoExpandSection>
            )}

            {analysis.explanation && (
              <AutoExpandSection title="Explanation" icon={FileText}>
                <TextReveal>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
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
                    icon={Lightbulb}
                  >
                    <div className="space-y-4 md:space-y-6">
                      {point.paragraph_1 && (
                        <TextReveal>
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
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
                              />
                            ))}
                          </div>
                        </TextReveal>
                      )}
                      {point.paragraph_2 && (
                        <TextReveal delay={0.25}>
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
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

        {/* Footer spacing */}
        <div className="h-20 bg-background" />
      </main>
    </div>
  );
};

export default AnalysisViewer;
