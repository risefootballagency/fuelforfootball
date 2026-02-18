import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";

export const TacticsBoard = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <LayoutGrid className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Tactics Board</h2>
          <p className="text-sm text-muted-foreground">Interactive tactical board for formations and set pieces</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Tactics Board</p>
          <p className="text-sm">Drag-and-drop tactical planning with formations, movements, and set-piece design</p>
        </CardContent>
      </Card>
    </div>
  );
};
