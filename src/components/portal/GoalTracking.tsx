// Stub: GoalTracking — requires player_goals table and ComparisonPlayerData module
// Full implementation will be ported once those dependencies are created

import { Target } from "lucide-react";

interface GoalTrackingProps {
  playerData: any;
  fixtureAnalyses: any[];
  formWindow: number;
}

export const GoalTracking = ({ playerData, fixtureAnalyses, formWindow }: GoalTrackingProps) => {
  return (
    <div className="text-center py-8 text-muted-foreground text-sm">
      <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
      Goal tracking will be available once target metrics are configured.
    </div>
  );
};
