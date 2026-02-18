import { Card, CardContent } from "@/components/ui/card";
import { HardDrive } from "lucide-react";

export const DatabaseExport = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <HardDrive className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Data Export</h2>
          <p className="text-sm text-muted-foreground">Export database records and reports</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Data Export</p>
          <p className="text-sm">Export players, analyses, invoices, and other data as CSV or JSON</p>
        </CardContent>
      </Card>
    </div>
  );
};
