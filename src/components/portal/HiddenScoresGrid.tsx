import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getR90Grade, getPERGrade, getSRGrade } from "@/lib/gradeCalculations";

interface HiddenScoresGridProps {
  placeholderRawScore: number | null | undefined;
  placeholderMinutes: number | null | undefined;
  placeholderPer: number | null | undefined;
  placeholderSr: number | null | undefined;
  t: (lang: string, key: string) => string;
  reportLanguage: string;
}

const SCORE_EXPLANATIONS = {
  r90: "R90 measures a player's actual impact on the match result through every action made on and off the ball, normalised to 90 minutes.",
  per: "Player Efficiency Rating standardises performance across different match contexts and playing times.",
  sr: "Statistical Rating based purely on the success rate within actions performed during the match.",
};

export const HiddenScoresGrid = ({
  placeholderRawScore,
  placeholderMinutes,
  placeholderPer,
  placeholderSr,
  t,
  reportLanguage,
}: HiddenScoresGridProps) => {
  const hasR90 = placeholderRawScore != null && (placeholderMinutes ?? 0) > 0;
  const r90Num = hasR90 ? (placeholderRawScore! / placeholderMinutes!) * 90 : null;
  const r90Grade = getR90Grade(r90Num);
  const perGrade = getPERGrade(placeholderPer);
  const srGrade = getSRGrade(placeholderSr);

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
