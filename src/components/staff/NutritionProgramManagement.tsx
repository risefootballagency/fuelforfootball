import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple } from "lucide-react";

interface NutritionProgramManagementProps {
  playerId: string;
  playerName: string;
}

export const NutritionProgramManagement = ({ playerId, playerName }: NutritionProgramManagementProps) => {
  return (
    <Card>
      <CardHeader className="px-3 md:px-6 py-3 md:py-4">
        <CardTitle className="font-bebas tracking-wider text-lg flex items-center gap-2">
          <Apple className="w-5 h-5 text-accent" />
          Nutrition Programs — {playerName}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <div className="text-center py-8 text-muted-foreground text-sm">
          Nutrition program management will be available once nutrition infrastructure is configured.
        </div>
      </CardContent>
    </Card>
  );
};
