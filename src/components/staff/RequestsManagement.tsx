import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export const RequestsManagement = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Requests</h2>
          <p className="text-sm text-muted-foreground">Player and transfer requests management</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Requests</p>
          <p className="text-sm">Manage incoming player requests, transfer enquiries, and club communications</p>
        </CardContent>
      </Card>
    </div>
  );
};
