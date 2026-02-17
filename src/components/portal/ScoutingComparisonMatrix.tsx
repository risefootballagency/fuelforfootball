// Stub: ScoutingComparisonMatrix — requires ComparisonPlayerData module
// Full implementation will be ported once those dependencies are created

interface Props {
  playerName: string;
  portalMetrics: Record<string, number | null>;
  hasPortalData: boolean;
  comparisonPlayers: any[];
  selectedPlayerIds: string[];
  formWindow: number;
}

export const ScoutingComparisonMatrix = (props: Props) => {
  return (
    <div className="text-center py-8 text-muted-foreground text-sm">
      Scouting comparison matrix will be available once comparison data is configured.
    </div>
  );
};
