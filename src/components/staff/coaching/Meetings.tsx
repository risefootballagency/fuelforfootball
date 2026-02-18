import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export const Meetings = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Meetings</h2>
          <p className="text-sm text-muted-foreground">Schedule and manage team meetings</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Meetings</p>
          <p className="text-sm">Create, schedule, and track meeting agendas and action items</p>
        </CardContent>
      </Card>
    </div>
  );
};
