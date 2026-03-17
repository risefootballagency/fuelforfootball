import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { supabase as localSupabase } from "@/integrations/supabase/client";
import { invokeEdgeFunction } from "@/lib/edgeFunctionHelper";
import { Brain, Shuffle, ChevronLeft, ChevronRight, RotateCcw, Target, Lightbulb, BookOpen, Eye, Zap, Map, Clock, Star, CheckCircle2, TrendingUp, BarChart3, Filter, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { t } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";

interface CognisanceSectionProps {
  playerId: string;
  playerPosition?: string;
  playerName?: string;
}

type GameType = "schemes" | "concepts" | "pre-match" | "positional-guides" | "ai-quiz" | null;
type DifficultyFilter = "all" | "new" | "learning" | "due" | "mature";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  category?: string;
  cardKey: string;
}

interface CardProgress {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  last_reviewed: string | null;
}

interface SchemeData {
  id: string;
  position: string;
  team_scheme: string;
  opposition_scheme: string;
  defensive_transition: string | null;
  defence: string | null;
  offensive_transition: string | null;
  offence: string | null;
}

interface ConceptData {
  id: string;
  title: string;
  points: any[];
  explanation?: string;
}

interface PreMatchData {
  id: string;
  title: string;
  opposition_strengths: string | null;
  opposition_weaknesses: string | null;
  key_details: string | null;
  points: any[] | null;
}

interface PositionalGuideData {
  id: string;
  position: string;
  title: string;
  content: string | null;
  category: string | null;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface SessionResult {
  cardKey: string;
  front: string;
  quality: number;
  previousInterval: number;
  newInterval: number;
}

// SM-2 Algorithm
const sm2 = (quality: number, prev: CardProgress): CardProgress => {
  let { ease_factor, interval_days, repetitions } = prev;

  if (quality >= 3) {
    if (repetitions === 0) interval_days = 1;
    else if (repetitions === 1) interval_days = 6;
    else interval_days = Math.round(interval_days * ease_factor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval_days = 1;
  }

  ease_factor = Math.max(1.3, ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval_days);

  return {
    ease_factor,
    interval_days,
    repetitions,
    next_review: nextReview.toISOString(),
    last_reviewed: new Date().toISOString(),
  };
};

const defaultProgress: CardProgress = {
  ease_factor: 2.5,
  interval_days: 0,
  repetitions: 0,
  next_review: new Date().toISOString(),
  last_reviewed: null,
};

export function CognisanceSection({ playerId, playerPosition, playerName }: CognisanceSectionProps) {
  const lang = usePortalLanguage();
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSessionResults, setShowSessionResults] = useState(false);

  // Scheme game state
  const [schemes, setSchemes] = useState<SchemeData[]>([]);
  const [selectedTeamSchemeFilter, setSelectedTeamSchemeFilter] = useState<string>("all");
  const [selectedOppositionSchemeFilter, setSelectedOppositionSchemeFilter] = useState<string>("all");
  const [availableTeamSchemes, setAvailableTeamSchemes] = useState<string[]>([]);
  const [availableOppositionSchemes, setAvailableOppositionSchemes] = useState<string[]>([]);

  // Concept game state
  const [concepts, setConcepts] = useState<ConceptData[]>([]);
  const [selectedConceptFilter, setSelectedConceptFilter] = useState<string>("all");

  // Pre-match game state
  const [preMatchAnalyses, setPreMatchAnalyses] = useState<PreMatchData[]>([]);
  const [selectedPreMatchFilter, setSelectedPreMatchFilter] = useState<string>("all");

  // Positional guide state
  const [positionalGuides, setPositionalGuides] = useState<PositionalGuideData[]>([]);

  // Flashcard game state
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  // SM-2 progress tracking
  const [cardProgressMap, setCardProgressMap] = useState<Record<string, CardProgress>>({});
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, newCards: 0, dueCards: 0 });
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);

  // Difficulty filter
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");

  // Streak tracking
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [tempStreak, setTempStreak] = useState(0);

  // AI Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizLoading, setQuizLoading] = useState(false);

  // Load SM-2 progress from DB
  const loadProgress = useCallback(async () => {
    const { data } = await localSupabase
      .from("flashcard_progress")
      .select("*")
      .eq("player_id", playerId);

    if (data) {
      const map: Record<string, CardProgress> = {};
      data.forEach((row: any) => {
        map[row.card_key] = {
          ease_factor: Number(row.ease_factor),
          interval_days: row.interval_days,
          repetitions: row.repetitions,
          next_review: row.next_review,
          last_reviewed: row.last_reviewed,
        };
      });
      setCardProgressMap(map);

      // Calculate streak from review history
      const reviewDates = data
        .filter((r: any) => r.last_reviewed)
        .map((r: any) => new Date(r.last_reviewed).toDateString());
      const uniqueDates = [...new Set(reviewDates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      let streak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        streak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
          const diff = new Date(uniqueDates[i - 1]).getTime() - new Date(uniqueDates[i]).getTime();
          if (diff <= 86400000 * 1.5) streak++;
          else break;
        }
      }
      setCurrentStreak(streak);
      setBestStreak(Math.max(streak, parseInt(localStorage.getItem(`cognisance-best-streak-${playerId}`) || '0')));
    }
  }, [playerId]);

  // Save SM-2 progress to DB
  const saveProgress = useCallback(async (cardKey: string, progress: CardProgress) => {
    await localSupabase
      .from("flashcard_progress")
      .upsert({
        player_id: playerId,
        card_key: cardKey,
        ease_factor: progress.ease_factor,
        interval_days: progress.interval_days,
        repetitions: progress.repetitions,
        next_review: progress.next_review,
        last_reviewed: progress.last_reviewed,
      }, { onConflict: 'player_id,card_key' });

    setCardProgressMap(prev => ({ ...prev, [cardKey]: progress }));
  }, [playerId]);

  // Position normalization
  const normalizedPosition = useMemo(() => {
    if (!playerPosition) return null;
    const positionMap: Record<string, string> = {
      'GK': 'Goalkeeper', 'Goalkeeper': 'Goalkeeper',
      'FB': 'Full-Back', 'Full-Back': 'Full-Back', 'Fullback': 'Full-Back',
      'LB': 'Full-Back', 'RB': 'Full-Back',
      'CB': 'Centre-Back', 'Centre-Back': 'Centre-Back', 'Center-Back': 'Centre-Back',
      'CDM': 'Central Defensive-Midfielder', 'Central Defensive-Midfielder': 'Central Defensive-Midfielder',
      'CM': 'Central Midfielder', 'Central Midfielder': 'Central Midfielder',
      'AM': 'Attacking Midfielder', 'Attacking Midfielder': 'Attacking Midfielder', 'CAM': 'Attacking Midfielder',
      'W': 'Winger', 'Winger': 'Winger', 'LW': 'Winger', 'RW': 'Winger',
      'CF': 'Centre-Forward', 'Centre-Forward': 'Centre-Forward', 'ST': 'Centre-Forward', 'Striker': 'Centre-Forward',
    };
    return positionMap[playerPosition] || playerPosition;
  }, [playerPosition]);

  // Fetch schemes
  const fetchSchemes = useCallback(async () => {
    if (!normalizedPosition) return;
    const { data } = await sharedSupabase
      .from("tactical_schemes")
      .select("*")
      .eq("position", normalizedPosition);

    if (data && data.length > 0) {
      setSchemes(data as SchemeData[]);
      setAvailableTeamSchemes([...new Set(data.map((s: any) => s.team_scheme as string))]);
      setAvailableOppositionSchemes([...new Set(data.map((s: any) => s.opposition_scheme as string))]);
    } else {
      const { data: allData } = await sharedSupabase.from("tactical_schemes").select("*");
      if (allData && allData.length > 0) {
        setSchemes(allData as SchemeData[]);
        setAvailableTeamSchemes([...new Set(allData.map((s: any) => s.team_scheme as string))]);
        setAvailableOppositionSchemes([...new Set(allData.map((s: any) => s.opposition_scheme as string))]);
      }
    }
  }, [normalizedPosition]);

  // Fetch concepts
  const fetchConcepts = useCallback(async () => {
    const allConcepts: ConceptData[] = [];
    const seenIds = new Set<string>();

    const { data: analysisData } = await sharedSupabase
      .from("player_analysis")
      .select("analysis_writer_id")
      .eq("player_id", playerId);

    if (analysisData) {
      const linkedIds = analysisData.filter((a: any) => a.analysis_writer_id).map((a: any) => a.analysis_writer_id);
      if (linkedIds.length > 0) {
        const { data: conceptsData } = await sharedSupabase
          .from("analyses")
          .select("*")
          .in("id", linkedIds)
          .eq("analysis_type", "concept");
        if (conceptsData) {
          conceptsData.forEach((c: any) => {
            if (!seenIds.has(c.id)) {
              seenIds.add(c.id);
              allConcepts.push({ id: c.id, title: c.title || "Untitled Concept", points: Array.isArray(c.points) ? c.points : [], explanation: c.explanation || undefined });
            }
          });
        }
      }
    }

    if (playerName) {
      const { data: nameConceptsData } = await sharedSupabase
        .from("analyses")
        .select("*")
        .eq("analysis_type", "concept")
        .eq("player_name", playerName);
      if (nameConceptsData) {
        nameConceptsData.forEach((c: any) => {
          if (!seenIds.has(c.id)) {
            seenIds.add(c.id);
            allConcepts.push({ id: c.id, title: c.title || "Untitled Concept", points: Array.isArray(c.points) ? c.points : [], explanation: c.explanation || undefined });
          }
        });
      }
    }

    const { data: coachingConcepts } = await localSupabase
      .from("coaching_analysis")
      .select("*")
      .eq("analysis_type", "concept");
    if (coachingConcepts) {
      coachingConcepts.forEach((c: any) => {
        if (!seenIds.has(c.id)) {
          seenIds.add(c.id);
          allConcepts.push({ id: c.id, title: c.title || "Untitled", points: [], explanation: c.content || undefined });
        }
      });
    }

    setConcepts(allConcepts);
  }, [playerId, playerName]);

  // Fetch pre-match analyses
  const fetchPreMatchAnalyses = useCallback(async () => {
    const { data: analysisData } = await sharedSupabase
      .from("player_analysis")
      .select("analysis_writer_id")
      .eq("player_id", playerId);
    if (!analysisData || analysisData.length === 0) return;
    const linkedIds = analysisData.filter((a: any) => a.analysis_writer_id).map((a: any) => a.analysis_writer_id);
    if (linkedIds.length === 0) return;
    const { data: preMatchData } = await sharedSupabase
      .from("analyses")
      .select("*")
      .in("id", linkedIds)
      .eq("analysis_type", "pre-match");
    if (preMatchData) {
      setPreMatchAnalyses(preMatchData.map((p: any) => ({
        id: p.id, title: p.title || "Untitled Pre-Match",
        opposition_strengths: p.opposition_strengths, opposition_weaknesses: p.opposition_weaknesses,
        key_details: p.key_details, points: Array.isArray(p.points) ? p.points : null
      })));
    }
  }, [playerId]);

  // Fetch positional guides
  const fetchPositionalGuides = useCallback(async () => {
    if (!normalizedPosition) return;
    const { data } = await sharedSupabase
      .from("positional_guides")
      .select("*")
      .eq("position", normalizedPosition);
    if (data) setPositionalGuides(data as PositionalGuideData[]);
  }, [normalizedPosition]);

  useEffect(() => {
    fetchSchemes();
    fetchConcepts();
    fetchPreMatchAnalyses();
    fetchPositionalGuides();
    loadProgress();
  }, [fetchSchemes, fetchConcepts, fetchPreMatchAnalyses, fetchPositionalGuides, loadProgress]);

  // Overall progress stats
  const overallStats = useMemo(() => {
    const entries = Object.entries(cardProgressMap);
    const total = entries.length;
    const mature = entries.filter(([, p]) => p.interval_days > 7).length;
    const learning = entries.filter(([, p]) => p.repetitions > 0 && p.interval_days <= 7).length;
    const now = new Date();
    const due = entries.filter(([, p]) => new Date(p.next_review) <= now).length;
    const avgEase = total > 0 ? entries.reduce((sum, [, p]) => sum + p.ease_factor, 0) / total : 2.5;
    return { total, mature, learning, due, avgEase };
  }, [cardProgressMap]);

  // Generate flashcards
  const generateFlashcards = useCallback(() => {
    const cards: FlashcardData[] = [];

    if (selectedGame === "schemes") {
      let filtered = schemes;
      if (selectedTeamSchemeFilter !== "all") filtered = filtered.filter(s => s.team_scheme === selectedTeamSchemeFilter);
      if (selectedOppositionSchemeFilter !== "all") filtered = filtered.filter(s => s.opposition_scheme === selectedOppositionSchemeFilter);
      filtered.forEach(scheme => {
        const phases = [
          { name: "Defensive Transition", content: scheme.defensive_transition },
          { name: "Defence", content: scheme.defence },
          { name: "Offensive Transition", content: scheme.offensive_transition },
          { name: "In Possession", content: scheme.offence }
        ];
        phases.forEach(phase => {
          if (phase.content) {
            cards.push({
              id: `${scheme.id}-${phase.name}`, cardKey: `scheme-${scheme.id}-${phase.name}`,
              front: `${scheme.team_scheme} vs ${scheme.opposition_scheme}\n\nWhat are your responsibilities in ${phase.name}?`,
              back: phase.content, category: phase.name
            });
          }
        });
      });
    }

    if (selectedGame === "concepts") {
      let filtered = concepts;
      if (selectedConceptFilter !== "all") filtered = filtered.filter(c => c.id === selectedConceptFilter);
      filtered.forEach(concept => {
        if (concept.points && concept.points.length > 0) {
          concept.points.forEach((point: any, idx: number) => {
            if (point.title && point.description) {
              cards.push({
                id: `${concept.id}-${idx}`, cardKey: `concept-${concept.id}-${idx}`,
                front: `${concept.title}\n\n${point.title}`, back: point.description, category: concept.title
              });
            }
          });
        }
        if (concept.explanation) {
          cards.push({
            id: `${concept.id}-explanation`, cardKey: `concept-${concept.id}-exp`,
            front: `Explain the concept: ${concept.title}`, back: concept.explanation, category: concept.title
          });
        }
      });
    }

    if (selectedGame === "pre-match") {
      let filtered = preMatchAnalyses;
      if (selectedPreMatchFilter !== "all") filtered = filtered.filter(p => p.id === selectedPreMatchFilter);
      filtered.forEach(analysis => {
        if (analysis.opposition_strengths) {
          cards.push({ id: `${analysis.id}-str`, cardKey: `prematch-${analysis.id}-str`, front: `${analysis.title}\n\nWhat are the opposition's STRENGTHS?`, back: analysis.opposition_strengths, category: "Strengths" });
        }
        if (analysis.opposition_weaknesses) {
          cards.push({ id: `${analysis.id}-weak`, cardKey: `prematch-${analysis.id}-weak`, front: `${analysis.title}\n\nWhat are the opposition's WEAKNESSES?`, back: analysis.opposition_weaknesses, category: "Weaknesses" });
        }
        if (analysis.key_details) {
          cards.push({ id: `${analysis.id}-det`, cardKey: `prematch-${analysis.id}-det`, front: `${analysis.title}\n\nWhat are the KEY DETAILS?`, back: analysis.key_details, category: "Key Details" });
        }
        if (analysis.points && Array.isArray(analysis.points)) {
          analysis.points.forEach((point: any, idx: number) => {
            if (point.title && point.description) {
              cards.push({ id: `${analysis.id}-p${idx}`, cardKey: `prematch-${analysis.id}-p${idx}`, front: `${analysis.title}\n\n${point.title}`, back: point.description, category: analysis.title });
            }
          });
        }
      });
    }

    if (selectedGame === "positional-guides") {
      positionalGuides.forEach(guide => {
        if (guide.content) {
          cards.push({
            id: guide.id, cardKey: `posguide-${guide.id}`,
            front: `${guide.title}${guide.category ? `\n(${guide.category})` : ''}`,
            back: guide.content, category: guide.category || "General"
          });
        }
      });
    }

    // Apply difficulty filter
    const now = new Date();
    let filteredCards = cards;
    if (difficultyFilter !== "all") {
      filteredCards = cards.filter(card => {
        const prog = cardProgressMap[card.cardKey];
        switch (difficultyFilter) {
          case "new": return !prog;
          case "learning": return prog && prog.repetitions > 0 && prog.interval_days <= 7;
          case "due": return prog && new Date(prog.next_review) <= now;
          case "mature": return prog && prog.interval_days > 7;
          default: return true;
        }
      });
    }

    // Sort by SM-2 priority: due cards first, then new cards
    const sorted = filteredCards.sort((a, b) => {
      const progA = cardProgressMap[a.cardKey];
      const progB = cardProgressMap[b.cardKey];
      const dueA = progA ? new Date(progA.next_review) <= now : true;
      const dueB = progB ? new Date(progB.next_review) <= now : true;
      if (dueA && !dueB) return -1;
      if (!dueA && dueB) return 1;
      return Math.random() - 0.5;
    });

    // Calculate session stats
    let dueCount = 0, newCount = 0;
    sorted.forEach(card => {
      const prog = cardProgressMap[card.cardKey];
      if (!prog) newCount++;
      else if (new Date(prog.next_review) <= now) dueCount++;
    });
    setSessionStats({ reviewed: 0, newCards: newCount, dueCards: dueCount });

    setFlashcards(sorted);
    setCurrentIndex(0);
    setIsFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
    setSessionResults([]);
    setTempStreak(0);
  }, [selectedGame, schemes, concepts, preMatchAnalyses, positionalGuides, selectedTeamSchemeFilter, selectedOppositionSchemeFilter, selectedConceptFilter, selectedPreMatchFilter, cardProgressMap, difficultyFilter]);

  const startGame = () => {
    if (selectedGame === "ai-quiz") {
      generateAIQuiz();
      return;
    }
    generateFlashcards();
    setIsPlaying(true);
    setShowSessionResults(false);
  };

  // SM-2 quality rating buttons
  const handleSM2Response = async (quality: number) => {
    const currentCard = flashcards[currentIndex];
    if (!currentCard) return;

    const prev = cardProgressMap[currentCard.cardKey] || defaultProgress;
    const updated = sm2(quality, prev);
    await saveProgress(currentCard.cardKey, updated);

    // Track session result
    setSessionResults(r => [...r, {
      cardKey: currentCard.cardKey,
      front: currentCard.front.split('\n')[0],
      quality,
      previousInterval: prev.interval_days,
      newInterval: updated.interval_days,
    }]);

    const isCorrect = quality >= 3;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (!isCorrect ? 1 : 0)
    }));
    setSessionStats(prev => ({ ...prev, reviewed: prev.reviewed + 1 }));

    // Streak tracking
    if (isCorrect) {
      setTempStreak(s => s + 1);
    } else {
      setTempStreak(0);
    }

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setFlashcards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
    setQuizQuestions([]);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore({ correct: 0, total: 0 });
    setShowSessionResults(false);
    setSessionResults([]);
    setTempStreak(0);
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // AI Quiz generation
  const generateAIQuiz = async () => {
    setQuizLoading(true);
    try {
      const material: string[] = [];
      schemes.slice(0, 5).forEach(s => {
        if (s.defence) material.push(`Defence in ${s.team_scheme} vs ${s.opposition_scheme}: ${s.defence}`);
        if (s.offence) material.push(`Possession in ${s.team_scheme} vs ${s.opposition_scheme}: ${s.offence}`);
      });
      concepts.slice(0, 5).forEach(c => {
        if (c.explanation) material.push(`Concept "${c.title}": ${c.explanation}`);
        c.points?.slice(0, 3).forEach((p: any) => {
          if (p.title && p.description) material.push(`${c.title} - ${p.title}: ${p.description}`);
        });
      });
      positionalGuides.slice(0, 5).forEach(g => {
        if (g.content) material.push(`${g.title}: ${g.content}`);
      });

      if (material.length < 2) {
        toast.error("Not enough content to generate a quiz. Add more schemes, concepts, or guides first.");
        setQuizLoading(false);
        return;
      }

      const prompt = `You are a football coach creating a quiz for a player. Based on this tactical material, generate exactly 5 multiple-choice questions. Each question should test understanding of the tactical concepts.\n\nMaterial:\n${material.join('\n\n')}\n\nReturn ONLY a JSON array of objects with keys: "question" (string), "options" (array of 4 strings), "correctIndex" (0-3), "explanation" (string). No other text.`;

      const response = await invokeEdgeFunction('ai-chat', {
        body: { prompt, model: 'google/gemini-2.5-flash' }
      }, localSupabase);

      if (response.data?.content) {
        const text = response.data.content;
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]) as QuizQuestion[];
          setQuizQuestions(questions);
          setQuizIndex(0);
          setSelectedAnswer(null);
          setQuizScore({ correct: 0, total: 0 });
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error('AI Quiz error:', err);
      toast.error("Failed to generate quiz. Try again.");
    }
    setQuizLoading(false);
  };

  // Get progress indicator for a card
  const getCardProgressIndicator = (cardKey: string) => {
    const prog = cardProgressMap[cardKey];
    if (!prog) return { label: 'New', color: 'text-blue-400', icon: Star };
    if (prog.repetitions === 0) return { label: 'Learning', color: 'text-orange-400', icon: Clock };
    if (prog.interval_days <= 1) return { label: 'Learning', color: 'text-orange-400', icon: Clock };
    if (prog.interval_days <= 7) return { label: 'Young', color: 'text-yellow-400', icon: TrendingUp };
    return { label: 'Mature', color: 'text-green-400', icon: CheckCircle2 };
  };

  const getQualityLabel = (q: number) => {
    switch (q) {
      case 1: return { label: 'Again', color: 'text-red-500' };
      case 3: return { label: 'Hard', color: 'text-orange-500' };
      case 4: return { label: 'Good', color: 'text-green-500' };
      case 5: return { label: 'Easy', color: 'text-blue-500' };
      default: return { label: '?', color: 'text-muted-foreground' };
    }
  };

  // ============ RENDER ============

  // Session results view
  if (showSessionResults && sessionResults.length > 0) {
    const accuracy = flashcards.length > 0 ? Math.round((score.correct / flashcards.length) * 100) : 0;
    const maxSessionStreak = tempStreak;

    // Update best streak
    if (maxSessionStreak > bestStreak) {
      localStorage.setItem(`cognisance-best-streak-${playerId}`, maxSessionStreak.toString());
    }

    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={resetGame} className="text-gold hover:text-gold/80">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Games
        </Button>

        <Card className="border-gold/30">
          <CardContent className="p-6 text-center">
            <h3 className="font-bebas text-2xl text-gold mb-2">Session Complete!</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-green-500 font-bebas text-3xl">{score.correct}</span>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div>
                <span className="text-red-500 font-bebas text-3xl">{score.incorrect}</span>
                <p className="text-xs text-muted-foreground">Incorrect</p>
              </div>
              <div>
                <span className="text-gold font-bebas text-3xl">{accuracy}%</span>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div>
                <span className="text-orange-400 font-bebas text-3xl flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5" />{maxSessionStreak}
                </span>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Per-card breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gold" /> Card-by-Card Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {sessionResults.map((result, idx) => {
              const q = getQualityLabel(result.quality);
              return (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
                  <span className="truncate flex-1 mr-2">{result.front}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn("text-xs font-medium", q.color)}>{q.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {result.previousInterval}d → {result.newInterval}d
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex gap-2 justify-center">
          <Button onClick={resetGame} variant="outline"><RotateCcw className="w-4 h-4 mr-2" /> New Session</Button>
          <Button onClick={() => { resetGame(); setSelectedGame(null); }} variant="ghost">Back to Menu</Button>
        </div>
      </div>
    );
  }

  // AI Quiz playing view
  if (isPlaying && selectedGame === "ai-quiz" && quizQuestions.length > 0) {
    const currentQ = quizQuestions[quizIndex];
    const isAnswered = selectedAnswer !== null;
    const isQuizComplete = quizIndex === quizQuestions.length - 1 && isAnswered;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={resetGame} className="text-gold hover:text-gold/80">
            <ChevronLeft className="w-4 h-4 mr-2" /> Exit
          </Button>
          <span className="text-sm text-muted-foreground">Question {quizIndex + 1} of {quizQuestions.length}</span>
          <span className="text-sm"><span className="text-green-500">{quizScore.correct}</span> / <span className="text-muted-foreground">{quizScore.total}</span></span>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => {
                    setSelectedAnswer(idx);
                    setQuizScore(prev => ({
                      correct: prev.correct + (idx === currentQ.correctIndex ? 1 : 0),
                      total: prev.total + 1
                    }));
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all text-sm",
                    !isAnswered && "hover:border-gold/50 hover:bg-gold/5 cursor-pointer",
                    isAnswered && idx === currentQ.correctIndex && "border-green-500 bg-green-500/10",
                    isAnswered && idx === selectedAnswer && idx !== currentQ.correctIndex && "border-red-500 bg-red-500/10",
                    isAnswered && idx !== currentQ.correctIndex && idx !== selectedAnswer && "opacity-50"
                  )}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>
            {isAnswered && (
              <div className="mt-4 p-3 rounded-lg bg-muted text-sm">
                <p className="font-medium mb-1">{selectedAnswer === currentQ.correctIndex ? '✓ Correct!' : '✗ Incorrect'}</p>
                <p className="text-muted-foreground">{currentQ.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          {isAnswered && !isQuizComplete && (
            <Button onClick={() => { setQuizIndex(prev => prev + 1); setSelectedAnswer(null); }} className="bg-gold text-gold-foreground">
              Next Question <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {isQuizComplete && (
            <Card className="w-full border-gold/30">
              <CardContent className="p-6 text-center">
                <h3 className="font-bebas text-2xl text-gold mb-2">Quiz Complete!</h3>
                <p className="text-3xl font-bebas text-gold">{Math.round((quizScore.correct / quizQuestions.length) * 100)}%</p>
                <p className="text-sm text-muted-foreground mt-1">{quizScore.correct} / {quizQuestions.length} correct</p>
                <div className="flex gap-2 justify-center mt-4">
                  <Button onClick={resetGame} variant="outline"><RotateCcw className="w-4 h-4 mr-2" /> New Quiz</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Game selection view
  if (!selectedGame) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bebas text-gold mb-1">Cognisance</h2>
          <p className="text-muted-foreground text-sm">Strengthen your football IQ with spaced repetition</p>
        </div>

        {/* Progress overview */}
        {overallStats.total > 0 && (
          <Card className="border-gold/20">
            <CardContent className="p-3">
              <div className="grid grid-cols-5 gap-2 text-center">
                <div>
                  <span className="font-bebas text-lg text-gold">{overallStats.total}</span>
                  <p className="text-[10px] text-muted-foreground">Cards</p>
                </div>
                <div>
                  <span className="font-bebas text-lg text-green-400">{overallStats.mature}</span>
                  <p className="text-[10px] text-muted-foreground">Mature</p>
                </div>
                <div>
                  <span className="font-bebas text-lg text-orange-400">{overallStats.learning}</span>
                  <p className="text-[10px] text-muted-foreground">Learning</p>
                </div>
                <div>
                  <span className="font-bebas text-lg text-blue-400">{overallStats.due}</span>
                  <p className="text-[10px] text-muted-foreground">Due</p>
                </div>
                <div>
                  <span className="font-bebas text-lg text-orange-400 flex items-center justify-center gap-0.5">
                    <Flame className="w-3 h-3" />{currentStreak}
                  </span>
                  <p className="text-[10px] text-muted-foreground">Streak</p>
                </div>
              </div>
              {overallStats.total > 0 && (
                <Progress value={(overallStats.mature / overallStats.total) * 100} className="h-1.5 mt-2" />
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { type: "schemes" as GameType, icon: Target, label: "Tactical Schemes", desc: "Positional responsibilities across formations", count: schemes.length },
            { type: "concepts" as GameType, icon: Lightbulb, label: "Concepts", desc: "Key tactical and technical concepts", count: concepts.length },
            { type: "pre-match" as GameType, icon: Eye, label: "Pre-Match", desc: "Opposition strengths, weaknesses & details", count: preMatchAnalyses.length },
            { type: "positional-guides" as GameType, icon: Map, label: "Positional Guides", desc: "Position-specific guidance and principles", count: positionalGuides.length },
            { type: "ai-quiz" as GameType, icon: Zap, label: "AI Quiz", desc: "AI-generated questions from your data", count: null },
          ].map(game => (
            <Card
              key={game.type}
              className="cursor-pointer hover:border-gold/50 transition-all hover:shadow-lg hover:shadow-gold/10"
              onClick={() => setSelectedGame(game.type)}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <game.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-bebas text-lg text-gold mb-1">{game.label}</h3>
                <p className="text-xs text-muted-foreground">{game.desc}</p>
                {game.count !== null && (
                  <p className="text-xs text-gold/70 mt-1">{game.count} available</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Game setup view
  if (!isPlaying) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedGame(null)} className="text-gold hover:text-gold/80">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Games
        </Button>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-bebas text-gold flex items-center gap-2">
              <Brain className="w-5 h-5" />
              {selectedGame === "schemes" && t(lang, "tactical_schemes")}
              {selectedGame === "concepts" && t(lang, "concepts_label")}
              {selectedGame === "pre-match" && t(lang, "pre_match_analysis")}
              {selectedGame === "positional-guides" && t(lang, "positional_guides")}
              {selectedGame === "ai-quiz" && t(lang, "ai_quiz")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedGame === "schemes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">{t(lang, "team_formation")}</Label>
                  <Select value={selectedTeamSchemeFilter} onValueChange={setSelectedTeamSchemeFilter}>
                    <SelectTrigger><SelectValue placeholder={t(lang, "all")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t(lang, "all")}</SelectItem>
                      {availableTeamSchemes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t(lang, "opposition_formation")}</Label>
                  <Select value={selectedOppositionSchemeFilter} onValueChange={setSelectedOppositionSchemeFilter}>
                    <SelectTrigger><SelectValue placeholder={t(lang, "all")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t(lang, "all")}</SelectItem>
                      {availableOppositionSchemes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedGame === "concepts" && (
              <div className="space-y-1">
                <Label className="text-xs">{t(lang, "select_concept")}</Label>
                <Select value={selectedConceptFilter} onValueChange={setSelectedConceptFilter}>
                  <SelectTrigger><SelectValue placeholder={t(lang, "all_concepts")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t(lang, "all_concepts")}</SelectItem>
                    {concepts.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedGame === "pre-match" && (
              <div className="space-y-1">
                <Label className="text-xs">{t(lang, "select_analysis")}</Label>
                <Select value={selectedPreMatchFilter} onValueChange={setSelectedPreMatchFilter}>
                  <SelectTrigger><SelectValue placeholder={t(lang, "all")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t(lang, "all")}</SelectItem>
                    {preMatchAnalyses.map(a => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedGame === "ai-quiz" && (
              <p className="text-sm text-muted-foreground">
                An AI will generate multiple-choice questions based on your tactical schemes, concepts, and positional guides. Make sure you have enough content loaded.
              </p>
            )}

            {/* Difficulty filter - not for AI quiz */}
            {selectedGame !== "ai-quiz" && (
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1"><Filter className="w-3 h-3" /> Card Difficulty</Label>
                <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as DifficultyFilter)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cards</SelectItem>
                    <SelectItem value="new">New Only</SelectItem>
                    <SelectItem value="due">Due for Review</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="mature">Mature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={startGame}
              disabled={quizLoading}
              className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
            >
              {quizLoading ? (
                <><Clock className="w-4 h-4 mr-2 animate-spin" /> Generating Quiz...</>
              ) : selectedGame === "ai-quiz" ? (
                <><Zap className="w-4 h-4 mr-2" /> Generate Quiz</>
              ) : (
                <><Brain className="w-4 h-4 mr-2" /> Start Flashcards</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Flashcard playing view
  const currentCard = flashcards[currentIndex];
  const isComplete = currentIndex === flashcards.length - 1 && isFlipped;

  if (flashcards.length === 0) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={resetGame} className="text-gold hover:text-gold/80">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No flashcards available with the current filters.</p>
            <Button onClick={resetGame} variant="outline" className="mt-4">Try Different Filters</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressIndicator = currentCard ? getCardProgressIndicator(currentCard.cardKey) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={resetGame} className="text-gold hover:text-gold/80">
          <ChevronLeft className="w-4 h-4 mr-2" /> Exit
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {flashcards.length}
          </span>
          {progressIndicator && (
            <span className={cn("text-xs flex items-center gap-1", progressIndicator.color)}>
              <progressIndicator.icon className="w-3 h-3" />
              {progressIndicator.label}
            </span>
          )}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-500">✓{score.correct}</span>
            <span className="text-red-500">✗{score.incorrect}</span>
            {tempStreak > 2 && (
              <span className="text-orange-400 flex items-center gap-0.5"><Flame className="w-3 h-3" />{tempStreak}</span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={shuffleCards}><Shuffle className="w-4 h-4" /></Button>
      </div>

      {/* Progress bar */}
      <Progress value={((currentIndex + 1) / flashcards.length) * 100} className="h-1" />

      {/* Session stats bar */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-blue-400" /> New: {sessionStats.newCards}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-orange-400" /> Due: {sessionStats.dueCards}</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> Reviewed: {sessionStats.reviewed}</span>
      </div>

      {/* Flashcard */}
      <div className="min-h-[350px] perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <Card className={cn("min-h-[350px] transition-all duration-500 transform-style-3d relative", isFlipped && "rotate-y-180")}>
          <CardContent className={cn("absolute inset-0 p-6 flex flex-col items-center justify-center backface-hidden", isFlipped && "invisible")}>
            {currentCard?.category && <span className="text-xs text-gold/70 uppercase tracking-wider mb-3">{currentCard.category}</span>}
            <p className="text-lg text-center whitespace-pre-line font-medium">{currentCard?.front}</p>
            <p className="text-xs text-muted-foreground mt-6">Tap to reveal</p>
          </CardContent>
          <CardContent className={cn("absolute inset-0 p-6 flex flex-col items-center justify-center backface-hidden rotate-y-180 overflow-y-auto", !isFlipped && "invisible")}>
            <p className="text-sm text-center whitespace-pre-line leading-relaxed">{currentCard?.back}</p>
          </CardContent>
        </Card>
      </div>

      {/* SM-2 Response buttons */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0} size="sm">
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {isFlipped && !isComplete && (
          <>
            <Button size="sm" variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10 text-xs" onClick={() => handleSM2Response(1)}>
              Again
            </Button>
            <Button size="sm" variant="outline" className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 text-xs" onClick={() => handleSM2Response(3)}>
              Hard
            </Button>
            <Button size="sm" variant="outline" className="border-green-500/50 text-green-500 hover:bg-green-500/10 text-xs" onClick={() => handleSM2Response(4)}>
              Good
            </Button>
            <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10 text-xs" onClick={() => handleSM2Response(5)}>
              Easy
            </Button>
          </>
        )}

        {isComplete && (
          <Button onClick={() => setShowSessionResults(true)} className="bg-gold text-gold-foreground hover:bg-gold/90" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" /> View Results
          </Button>
        )}

        <Button variant="outline" onClick={() => { if (isFlipped) handleSM2Response(3); }} disabled={currentIndex === flashcards.length - 1 || !isFlipped} size="sm">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
