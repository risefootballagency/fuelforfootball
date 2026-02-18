import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";

export const AnnotationProjects = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Pencil className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Annotations</h2>
          <p className="text-sm text-muted-foreground">Draw-on-video annotation system with freeze-frames, vision cones, and export pipelines</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Pencil className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Annotation Projects</p>
          <p className="text-sm">Create and manage video annotation projects with SVG overlays, arrows, circles, player markers, and more</p>
        </CardContent>
      </Card>
    </div>
  );
};
