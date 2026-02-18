import { Card, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";

export const CoachingDataSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Database className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Data</h2>
          <p className="text-sm text-muted-foreground">Performance data and statistics overview</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Performance Data</p>
          <p className="text-sm">View player analysis records, statistics, and performance trends across all matches</p>
        </CardContent>
      </Card>
    </div>
  );
};
