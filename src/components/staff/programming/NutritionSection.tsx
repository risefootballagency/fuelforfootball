import { Card, CardContent } from "@/components/ui/card";
import { Apple } from "lucide-react";

export const NutritionSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Apple className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Nutrition</h2>
          <p className="text-sm text-muted-foreground">Nutrition programming and meal planning</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Apple className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Nutrition Programs</p>
          <p className="text-sm">Create and manage nutrition plans, macros, meal schedules, and dietary requirements</p>
        </CardContent>
      </Card>
    </div>
  );
};
