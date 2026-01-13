import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { ArrowLeft, ChevronDown, Play } from "lucide-react";
import { toast } from "sonner";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";

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

// Auto-expanding section that opens when scrolled into view
const AutoExpandSection = ({ 
  title, 
  children, 
  defaultOpen = false,
  headerBgClass = "bg-primary",
  headerTextClass = "text-black"
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  headerBgClass?: string;
  headerTextClass?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -60% 0px" });
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(isInView);
  }, [isInView]);

  return (
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
        className={`w-full text-center ${headerBgClass} py-4 flex items-center justify-center gap-3 transition-all hover:opacity-90`}
      >
        <h2 className={`text-2xl md:text-3xl font-bebas uppercase tracking-widest ${headerTextClass}`}>
          {title}
        </h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className={`w-5 h-5 ${headerTextClass}`} />
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
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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

      if (error) throw error;
      
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
      toast.error("Failed to load analysis");
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
        <div className="text-center">
          <p className="text-muted-foreground text-xl mb-4">Analysis not found</p>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Back Button */}
      <motion.div 
        className="fixed top-4 left-4 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="bg-background/80 backdrop-blur-sm border-primary/30 hover:bg-primary hover:text-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </motion.div>

      {/* Video Button */}
      {analysis.video_url && (
        <motion.div 
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={() => window.open(analysis.video_url!, '_blank')}
            className="btn-shine font-bebas uppercase tracking-wider"
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
            {/* Teams Header */}
            <motion.div 
              className="w-full overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-stretch">
                {/* Home Team */}
                <div 
                  className="flex-1 flex items-center justify-center gap-3 py-6 px-4"
                  style={{ backgroundColor: analysis.home_team_bg_color || '#1a1a1a' }}
                >
                  {analysis.home_team_logo && (
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden">
                      <img
                        src={analysis.home_team_logo}
                        alt={analysis.home_team || "Home team"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <span className="text-2xl md:text-4xl font-bebas text-white tracking-wide uppercase">
                    {analysis.home_team}
                  </span>
                </div>

                {/* VS Divider */}
                <div className="px-4 md:px-8 bg-primary flex items-center">
                  <span className="text-black text-xl md:text-2xl font-bebas">VS</span>
                </div>

                {/* Away Team */}
                <div 
                  className="flex-1 flex items-center justify-center gap-3 py-6 px-4"
                  style={{ backgroundColor: analysis.away_team_bg_color || '#8B0000' }}
                >
                  <span className="text-2xl md:text-4xl font-bebas text-white tracking-wide uppercase">
                    {analysis.away_team}
                  </span>
                  {analysis.away_team_logo && (
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden">
                      <img
                        src={analysis.away_team_logo}
                        alt={analysis.away_team || "Away team"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Match Date */}
              {analysis.match_date && (
                <div className="bg-muted text-center py-3">
                  <span className="text-foreground/80 font-bebas tracking-wider text-lg">
                    {new Date(analysis.match_date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Match Image */}
            {analysis.match_image_url && (
              <ScrollReveal className="w-full">
                <div className="w-full">
                  <img 
                    src={analysis.match_image_url} 
                    alt="Match" 
                    className="w-full max-h-[60vh] object-cover"
                  />
                </div>
              </ScrollReveal>
            )}

            {/* Overview Section */}
            {analysis.key_details && (
              <AutoExpandSection title="Overview">
                <div className="bg-card p-6 md:p-8">
                  <TextReveal>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg max-w-5xl mx-auto">
                      {analysis.key_details}
                    </p>
                  </TextReveal>
                </div>
              </AutoExpandSection>
            )}

            {/* Opposition Strengths */}
            {analysis.opposition_strengths && (
              <AutoExpandSection title="Opposition Strengths" headerBgClass="bg-destructive/20" headerTextClass="text-foreground">
                <div className="bg-card/50 p-6 md:p-8">
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {analysis.opposition_strengths.split('\n').filter(line => line.trim()).map((line, idx) => {
                      const cleanLine = line.trim().replace(/^[-•]\s*/, '');
                      return (
                        <TextReveal key={idx} delay={idx * 0.1}>
                          <div className="flex items-center gap-4 bg-primary/10 backdrop-blur-sm p-4 rounded-lg">
                            <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                              <span className="text-black font-bold text-lg">✓</span>
                            </div>
                            <p className="text-foreground text-lg leading-relaxed">{cleanLine}</p>
                          </div>
                        </TextReveal>
                      );
                    })}
                  </div>
                </div>
              </AutoExpandSection>
            )}

            {/* Opposition Weaknesses */}
            {analysis.opposition_weaknesses && (
              <AutoExpandSection title="Opposition Weaknesses" headerBgClass="bg-accent/20" headerTextClass="text-foreground">
                <div className="bg-card/50 p-6 md:p-8">
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {analysis.opposition_weaknesses.split('\n').filter(line => line.trim()).map((line, idx) => {
                      const cleanLine = line.trim().replace(/^[-•]\s*/, '');
                      return (
                        <TextReveal key={idx} delay={idx * 0.1}>
                          <div className="flex items-center gap-4 bg-accent/10 backdrop-blur-sm p-4 rounded-lg">
                            <div className="bg-accent rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                              <span className="text-black font-bold text-lg">!</span>
                            </div>
                            <p className="text-foreground text-lg leading-relaxed">{cleanLine}</p>
                          </div>
                        </TextReveal>
                      );
                    })}
                  </div>
                </div>
              </AutoExpandSection>
            )}

            {/* Key Matchups */}
            {analysis.matchups && analysis.matchups.length > 0 && (
              <AutoExpandSection title="Potential Matchup(s)">
                <div className="bg-card/50 p-6 md:p-8">
                  <div className="flex justify-center items-center gap-8 flex-wrap max-w-5xl mx-auto">
                    {analysis.matchups.map((matchup: any, index: number) => (
                      <TextReveal key={index} delay={index * 0.15}>
                        <div className="text-center" style={{ 
                          width: analysis.matchups.length === 1 ? '280px' : analysis.matchups.length === 2 ? '220px' : '180px'
                        }}>
                          <div className="mb-3 rounded-lg overflow-hidden border-2 border-primary/30 bg-muted aspect-square flex items-center justify-center shadow-lg">
                            {matchup.image_url ? (
                              <img
                                src={matchup.image_url}
                                alt={matchup.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-muted-foreground text-sm">No image</div>
                            )}
                          </div>
                          <p className="font-bold text-foreground text-lg">{matchup.name}</p>
                          {matchup.shirt_number && (
                            <p className="text-sm text-primary font-semibold">
                              #{matchup.shirt_number}
                            </p>
                          )}
                        </div>
                      </TextReveal>
                    ))}
                  </div>
                </div>
              </AutoExpandSection>
            )}

            {/* Scheme Section */}
            {(analysis.scheme_title || analysis.selected_scheme) && (
              <AutoExpandSection title={analysis.scheme_title || "Tactical Scheme"}>
                <div className="bg-card p-6 md:p-8">
                  <div className="max-w-5xl mx-auto space-y-6">
                    {analysis.scheme_paragraph_1 && (
                      <TextReveal>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                          {analysis.scheme_paragraph_1}
                        </p>
                      </TextReveal>
                    )}
                    
                    {analysis.selected_scheme && (
                      <TextReveal delay={0.2}>
                        <div className="relative bg-gradient-to-b from-green-700 to-green-800 rounded-lg p-8 min-h-[600px] border-4 border-white/20 shadow-xl">
                          <div className="text-white text-center mb-4 text-2xl font-bebas tracking-wider">
                            {analysis.selected_scheme}
                          </div>
                          {/* Field markings */}
                          <div className="absolute inset-8 border-2 border-white/30 rounded-lg"></div>
                          <div className="absolute inset-x-8 top-1/2 h-0.5 bg-white/30"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/30 rounded-full"></div>
                          <div className="absolute left-1/2 -translate-x-1/2 top-8 w-48 h-24 border-2 border-white/30 border-t-0"></div>
                          <div className="absolute left-1/2 -translate-x-1/2 top-8 w-24 h-12 border-2 border-white/30 border-t-0"></div>
                          <div className="absolute left-1/2 -translate-x-1/2 top-24 w-2 h-2 bg-white/50 rounded-full"></div>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-48 h-24 border-2 border-white/30 border-b-0"></div>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-24 h-12 border-2 border-white/30 border-b-0"></div>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-24 w-2 h-2 bg-white/50 rounded-full"></div>
                          
                          {analysis.starting_xi && analysis.starting_xi.length > 0 && (
                            <div className="absolute inset-0 p-8">
                              {analysis.starting_xi.map((player: any, index: number) => (
                                <div
                                  key={index}
                                  className="absolute flex flex-col items-center gap-1"
                                  style={{
                                    left: `${player.x}%`,
                                    top: `${player.y}%`,
                                    transform: 'translate(-50%, -50%)'
                                  }}
                                >
                                  <PlayerKit 
                                    primaryColor={analysis.kit_primary_color || '#FFD700'}
                                    secondaryColor={analysis.kit_secondary_color || '#000000'}
                                    number={player.number || '0'}
                                  />
                                  <div className="bg-black/80 text-white px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
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
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                          {analysis.scheme_paragraph_2}
                        </p>
                      </TextReveal>
                    )}
                  </div>
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
                    headerBgClass={index % 2 === 0 ? "bg-muted" : "bg-muted/70"}
                    headerTextClass="text-foreground"
                  >
                    <div className="bg-card p-6 md:p-8">
                      <div className="max-w-5xl mx-auto space-y-6">
                        {point.paragraph_1 && (
                          <TextReveal>
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                              {point.paragraph_1}
                            </p>
                          </TextReveal>
                        )}
                        {point.images && point.images.length > 0 && (
                          <TextReveal delay={0.15}>
                            <div className="bg-primary/10 -mx-6 md:-mx-8 px-6 md:px-8 py-6 flex flex-col items-center gap-4">
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
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                              {point.paragraph_2}
                            </p>
                          </TextReveal>
                        )}
                      </div>
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
            {/* Teams Header with Score */}
            <motion.div 
              className="w-full overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-stretch">
                {/* Home Team */}
                <div 
                  className="flex-1 flex items-center justify-center gap-3 py-6 px-4"
                  style={{ backgroundColor: analysis.home_team_bg_color || '#1a1a1a' }}
                >
                  {analysis.home_team_logo && (
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden">
                      <img
                        src={analysis.home_team_logo}
                        alt={analysis.home_team || "Home team"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <span className="text-2xl md:text-4xl font-bebas text-white tracking-wide uppercase">
                    {analysis.home_team}
                  </span>
                </div>

                {/* Score */}
                <div className="px-4 md:px-8 bg-primary flex items-center">
                  {analysis.home_score !== null && analysis.away_score !== null && (
                    <span className="text-black text-2xl md:text-3xl font-bebas">
                      {analysis.home_score} - {analysis.away_score}
                    </span>
                  )}
                </div>

                {/* Away Team */}
                <div 
                  className="flex-1 flex items-center justify-center gap-3 py-6 px-4"
                  style={{ backgroundColor: analysis.away_team_bg_color || '#8B0000' }}
                >
                  <span className="text-2xl md:text-4xl font-bebas text-white tracking-wide uppercase">
                    {analysis.away_team}
                  </span>
                  {analysis.away_team_logo && (
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden">
                      <img
                        src={analysis.away_team_logo}
                        alt={analysis.away_team || "Away team"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Match Date */}
              {analysis.match_date && (
                <div className="bg-muted text-center py-3">
                  <span className="text-foreground/80 font-bebas tracking-wider text-lg">
                    {new Date(analysis.match_date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Player Image */}
            {analysis.player_image_url && (
              <ScrollReveal className="w-full">
                <div className="w-full">
                  <img
                    src={analysis.player_image_url}
                    alt="Player"
                    className="w-full max-h-[50vh] object-cover"
                  />
                </div>
              </ScrollReveal>
            )}

            {/* Overview */}
            {analysis.key_details && (
              <AutoExpandSection title="Overview">
                <div className="bg-card p-6 md:p-8">
                  <TextReveal>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg max-w-5xl mx-auto">
                      {analysis.key_details}
                    </p>
                  </TextReveal>
                </div>
              </AutoExpandSection>
            )}

            {/* Strengths & Improvements */}
            {analysis.strengths_improvements && (
              <AutoExpandSection title="Strengths & Areas for Improvement">
                <div className="bg-card p-6 md:p-8">
                  <TextReveal>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg max-w-5xl mx-auto">
                      {analysis.strengths_improvements}
                    </p>
                  </TextReveal>
                </div>
              </AutoExpandSection>
            )}

            {/* Post-Match Points */}
            {analysis.points && analysis.points.length > 0 && (
              <div className="w-full">
                {analysis.points.map((point: any, index: number) => (
                  <AutoExpandSection 
                    key={index} 
                    title={point.title}
                    headerBgClass={index % 2 === 0 ? "bg-muted" : "bg-muted/70"}
                    headerTextClass="text-foreground"
                  >
                    <div className="bg-card p-6 md:p-8">
                      <div className="max-w-5xl mx-auto space-y-6">
                        {point.paragraph_1 && (
                          <TextReveal>
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                              {point.paragraph_1}
                            </p>
                          </TextReveal>
                        )}
                        {point.images && point.images.length > 0 && (
                          <TextReveal delay={0.15}>
                            <div className="bg-primary/10 -mx-6 md:-mx-8 px-6 md:px-8 py-6 flex flex-col items-center gap-4">
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
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                              {point.paragraph_2}
                            </p>
                          </TextReveal>
                        )}
                      </div>
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
              className="bg-primary py-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-bebas uppercase tracking-widest text-black/60 border border-black/20 px-4 py-1 rounded-full inline-block mb-4">
                Concept
              </span>
              <h1 className="text-4xl md:text-5xl font-bebas uppercase tracking-wider text-black">
                {analysis.title || "Concept Analysis"}
              </h1>
            </motion.div>

            {analysis.concept && (
              <AutoExpandSection title="Concept" defaultOpen>
                <div className="bg-card p-6 md:p-8">
                  <TextReveal>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg max-w-5xl mx-auto">
                      {analysis.concept}
                    </p>
                  </TextReveal>
                </div>
              </AutoExpandSection>
            )}

            {analysis.explanation && (
              <AutoExpandSection title="Explanation">
                <div className="bg-card p-6 md:p-8">
                  <TextReveal>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg max-w-5xl mx-auto">
                      {analysis.explanation}
                    </p>
                  </TextReveal>
                </div>
              </AutoExpandSection>
            )}

            {analysis.points && analysis.points.length > 0 && (
              <div className="w-full">
                {analysis.points.map((point: any, index: number) => (
                  <AutoExpandSection 
                    key={index} 
                    title={point.title}
                    headerBgClass={index % 2 === 0 ? "bg-muted" : "bg-muted/70"}
                    headerTextClass="text-foreground"
                  >
                    <div className="bg-card p-6 md:p-8">
                      <div className="max-w-5xl mx-auto space-y-6">
                        {point.paragraph_1 && (
                          <TextReveal>
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
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
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
                              {point.paragraph_2}
                            </p>
                          </TextReveal>
                        )}
                      </div>
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
