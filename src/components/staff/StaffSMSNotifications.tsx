import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface StaffSMSNotificationsProps {
  userEmail?: string;
}

export const StaffSMSNotifications = ({ userEmail }: StaffSMSNotificationsProps) => {
  const isAuthorised = userEmail === 'jolonlevene98@gmail.com';

  if (!isAuthorised) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">SMS Notifications</p>
        <p className="text-sm">You do not have permission to access SMS notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">SMS Notifications</h2>
          <p className="text-sm text-muted-foreground">Send SMS notifications to players and staff</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">SMS Notifications</p>
          <p className="text-sm">Send bulk or individual SMS messages to players and contacts</p>
        </CardContent>
      </Card>
    </div>
  );
};
