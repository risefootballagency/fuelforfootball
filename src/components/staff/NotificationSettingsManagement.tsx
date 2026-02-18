import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export const NotificationSettingsManagement = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">Configure notification preferences and channels</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Notification Settings</p>
          <p className="text-sm">Manage email, push, and in-app notification preferences for all staff members</p>
        </CardContent>
      </Card>
    </div>
  );
};
