import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

export const PublicContentManagement = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Globe className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Public Content</h2>
          <p className="text-sm text-muted-foreground">Manage public-facing website content</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Public Content</p>
          <p className="text-sm">Control what content is visible on the public website including pages, media, and announcements</p>
        </CardContent>
      </Card>
    </div>
  );
};
