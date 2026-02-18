import { Card, CardContent } from "@/components/ui/card";
import { Presentation } from "lucide-react";

export const SalesDeck = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Presentation className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Sales Deck</h2>
          <p className="text-sm text-muted-foreground">Presentation materials for prospective clients</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Presentation className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Sales Deck</p>
          <p className="text-sm">Create and manage sales presentations, pitch decks, and client-facing materials</p>
        </CardContent>
      </Card>
    </div>
  );
};
