import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

export const StrengthPowerSpeedSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Dumbbell className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Strength, Power & Speed</h2>
          <p className="text-sm text-muted-foreground">SPS programming and periodisation</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">SPS Programs</p>
          <p className="text-sm">Manage strength, power, and speed training programmes with exercise libraries and periodisation plans</p>
        </CardContent>
      </Card>
    </div>
  );
};
