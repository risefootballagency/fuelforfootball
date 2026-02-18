import { Card, CardContent } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

export const ActivityLog = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ScrollText className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Activity Log</h2>
          <p className="text-sm text-muted-foreground">Audit trail of all staff actions</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <ScrollText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Activity Log</p>
          <p className="text-sm">Track all staff actions including logins, data changes, and system events</p>
        </CardContent>
      </Card>
    </div>
  );
};
