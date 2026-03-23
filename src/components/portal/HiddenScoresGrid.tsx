import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFormGradeConfigs } from "@/hooks/useFormGradeConfigs";

interface HiddenScoresGridProps {
  placeholderRawScore: number | null | undefined;
  placeholderMinutes: number | null | undefined;
  placeholderPer: number | null | undefined;
  placeholderSr: number | null | undefined;
  t: (lang: string, key: string) => string;
  reportLanguage: string;
}

const SCORE_EXPLANATIONS: Record<string, Record<string, string>> = {
  r90: {
    en: "R90 measures a player's actual impact on the match result through every action made on and off the ball, normalised to 90 minutes.",
    fr: "R90 mesure l'impact réel du joueur sur le résultat du match à travers chaque action réalisée avec et sans le ballon, normalisé à 90 minutes.",
    es: "R90 mide el impacto real del jugador en el resultado del partido a través de cada acción realizada con y sin balón, normalizado a 90 minutos.",
    pt: "R90 mede o impacto real do jogador no resultado do jogo através de cada ação realizada com e sem bola, normalizado a 90 minutos.",
    de: "R90 misst die tatsächliche Auswirkung eines Spielers auf das Spielergebnis durch jede Aktion mit und ohne Ball, normalisiert auf 90 Minuten.",
    it: "R90 misura l'impatto reale del giocatore sul risultato della partita attraverso ogni azione con e senza palla, normalizzato a 90 minuti.",
    pl: "R90 mierzy rzeczywisty wpływ zawodnika na wynik meczu poprzez każdą akcję z piłką i bez piłki, znormalizowany do 90 minut.",
    cs: "R90 měří skutečný dopad hráče na výsledek zápasu prostřednictvím každé akce s míčem i bez míče, normalizováno na 90 minut.",
    ru: "R90 измеряет реальное влияние игрока на результат матча через каждое действие с мячом и без мяча, нормализованное к 90 минутам.",
    tr: "R90, bir oyuncunun topla ve topsuz yaptığı her aksiyonla maç sonucuna gerçek etkisini ölçer, 90 dakikaya normalleştirilmiştir.",
  },
  per: {
    en: "Player Efficiency Rating standardises performance across different match contexts and playing times.",
    fr: "Le coefficient d'efficacité du joueur standardise la performance dans différents contextes de match et durées de jeu.",
    es: "La calificación de eficiencia del jugador estandariza el rendimiento en diferentes contextos de partido y tiempos de juego.",
    pt: "A classificação de eficiência do jogador padroniza o desempenho em diferentes contextos de jogo e tempos de jogo.",
    de: "Die Spieler-Effizienz-Bewertung standardisiert die Leistung über verschiedene Spielkontexte und Spielzeiten hinweg.",
    it: "Il coefficiente di efficienza del giocatore standardizza le prestazioni in diversi contesti di partita e tempi di gioco.",
    pl: "Wskaźnik efektywności zawodnika standaryzuje wyniki w różnych kontekstach meczowych i czasach gry.",
    cs: "Hodnocení efektivity hráče standardizuje výkon v různých kontextech zápasů a hracích časech.",
    ru: "Рейтинг эффективности игрока стандартизирует производительность в различных контекстах матча и игровых временах.",
    tr: "Oyuncu Verimlilik Puanı, farklı maç bağlamlarında ve oynama sürelerinde performansı standartlaştırır.",
  },
  sr: {
    en: "Statistical Rating based purely on the success rate within actions performed during the match.",
    fr: "Note statistique basée uniquement sur le taux de réussite des actions réalisées pendant le match.",
    es: "Calificación estadística basada únicamente en la tasa de éxito de las acciones realizadas durante el partido.",
    pt: "Classificação estatística baseada puramente na taxa de sucesso das ações realizadas durante o jogo.",
    de: "Statistische Bewertung, die ausschließlich auf der Erfolgsquote der im Spiel durchgeführten Aktionen basiert.",
    it: "Valutazione statistica basata esclusivamente sul tasso di successo delle azioni eseguite durante la partita.",
    pl: "Ocena statystyczna oparta wyłącznie na współczynniku powodzenia akcji wykonanych podczas meczu.",
    cs: "Statistické hodnocení založené čistě na úspěšnosti akcí provedených během zápasu.",
    ru: "Статистический рейтинг, основанный исключительно на проценте успешных действий, выполненных во время матча.",
    tr: "Maç sırasında gerçekleştirilen aksiyonlardaki başarı oranına dayanan istatistiksel puan.",
  },
};

export const HiddenScoresGrid = ({
  placeholderRawScore,
  placeholderMinutes,
  placeholderPer,
  placeholderSr,
  t,
  reportLanguage,
}: HiddenScoresGridProps) => {
  const { getGradeForScore } = useFormGradeConfigs();
  const hasR90 = placeholderRawScore != null && (placeholderMinutes ?? 0) > 0;
  const r90Num = hasR90 ? (placeholderRawScore! / placeholderMinutes!) * 90 : null;
  const r90Grade = getGradeForScore('r90', r90Num);
  const perGrade = getGradeForScore('per', placeholderPer);
  const srGrade = getGradeForScore('sr', placeholderSr);

  const scores = [
    ...(hasR90
      ? [{ label: "R90", value: r90Num!.toFixed(2), grade: r90Grade, explanation: SCORE_EXPLANATIONS.r90 }]
      : []),
    ...(placeholderPer != null ? [{ label: "PER", value: placeholderPer.toFixed(2), grade: perGrade, explanation: SCORE_EXPLANATIONS.per }] : []),
    ...(placeholderSr != null ? [{ label: "SR", value: placeholderSr.toFixed(2), grade: srGrade, explanation: SCORE_EXPLANATIONS.sr }] : []),
  ];

  if (scores.length === 0) {
    return <p className="text-sm text-muted-foreground">{t(reportLanguage, "placeholder_stats_not_set")}</p>;
  }

  return (
    <TooltipProvider>
      <div className={`grid gap-3 max-w-md mx-auto`} style={{ gridTemplateColumns: `repeat(${scores.length}, minmax(0, 1fr))` }}>
        {scores.map((score) => (
          <div
            key={score.label}
            className="text-center rounded-lg p-3 md:p-4 border"
            style={{
              borderColor: score.grade.color,
              backgroundColor: `${score.grade.color}15`,
            }}
          >
            <p className="text-[10px] md:text-xs text-muted-foreground mb-1 uppercase tracking-wide">
              {score.label}
            </p>
            <p
              className="text-xl md:text-3xl font-bold"
              style={{ color: score.grade.color }}
            >
              {score.value}
            </p>
            <p className="text-[9px] md:text-xs font-semibold mt-0.5" style={{ color: score.grade.color }}>
              {score.grade.grade}
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="mt-1 inline-flex text-muted-foreground hover:text-foreground">
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[250px] text-xs">
                {score.explanation}
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};
