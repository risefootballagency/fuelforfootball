import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";

export const VideoAnalysis = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Video className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Video Analysis</h2>
          <p className="text-sm text-muted-foreground">Analyse match footage with clipping, tagging, and tactical breakdowns</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Video Analysis Tool</p>
          <p className="text-sm">Upload match videos, create clips, tag actions, and generate tactical breakdowns</p>
        </CardContent>
      </Card>
    </div>
  );
};
