import { useState, useEffect } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, ChevronDown, ChevronUp, Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface NutritionProgramDisplayProps {
  playerId: string;
}

interface NutritionProgram {
  id: string;
  player_id: string;
  program_name: string;
  description: string | null;
  meal_plan: any;
  guidelines: string | null;
  is_active: boolean;
  created_at: string;
}

export const NutritionProgramDisplay = ({ playerId }: NutritionProgramDisplayProps) => {
  const [programs, setPrograms] = useState<NutritionProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        // Try nutrition_programs table first
        const { data, error } = await sharedSupabase
          .from("coaching_programmes" as any)
          .select("*")
          .or(`title.ilike.%nutrition%,category.ilike.%nutrition%`)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            player_id: playerId,
            program_name: p.title,
            description: p.description,
            meal_plan: p.content ? JSON.parse(typeof p.content === "string" ? p.content : JSON.stringify(p.content)) : null,
            guidelines: null,
            is_active: true,
            created_at: p.created_at,
          }));
          setPrograms(mapped);
        }
      } catch {
        // Table may not exist or content not parseable
      }
      setLoading(false);
    };
    fetchPrograms();
  }, [playerId]);

  if (loading) {
    return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <Apple className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No nutrition programs available yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {programs.map((program) => (
        <Card key={program.id}>
          <CardContent className="p-3">
            <button
              onClick={() => setExpandedId(expandedId === program.id ? null : program.id)}
              className="w-full flex items-center justify-between text-left"
            >
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Apple className="h-4 w-4 text-accent" />
                  {program.program_name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {format(new Date(program.created_at), "dd MMM yyyy")}
                </p>
              </div>
              {expandedId === program.id ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {expandedId === program.id && (
              <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                {program.description && (
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                )}
                {program.meal_plan && typeof program.meal_plan === "object" && (
                  <div className="text-sm text-foreground whitespace-pre-wrap">
                    {typeof program.meal_plan === "string"
                      ? program.meal_plan
                      : JSON.stringify(program.meal_plan, null, 2)}
                  </div>
                )}
                {!program.description && !program.meal_plan && (
                  <p className="text-sm text-muted-foreground italic">No additional details available.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
