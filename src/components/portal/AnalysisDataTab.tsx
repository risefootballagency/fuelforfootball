// Stub: AnalysisDataTab — requires ComparisonPlayerData module
// Full implementation will be ported once those dependencies are created

interface Props {
  analyses: any[];
  playerData: any;
  embedded?: boolean;
}

export const AnalysisDataTab = ({ analyses, playerData, embedded }: Props) => {
  return (
    <div className="text-center py-8 text-muted-foreground text-sm">
      Analysis data view will be available once comparison data is configured.
    </div>
  );
};
