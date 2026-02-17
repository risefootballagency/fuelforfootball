// Stub: AnalysisComparisons — requires ComparisonPlayerData module and comparison_players table
// Full implementation will be ported once those dependencies are created

interface Props {
  analyses: any[];
  playerData: any;
  embedded?: boolean;
}

export const AnalysisComparisons = ({ analyses, playerData, embedded }: Props) => {
  return (
    <div className="text-center py-8 text-muted-foreground text-sm">
      Analysis comparisons will be available once comparison data is configured.
    </div>
  );
};
