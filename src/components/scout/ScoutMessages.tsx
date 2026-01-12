import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCircle, Clock, Percent, Star } from "lucide-react";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";

interface Feedback {
  id: string;
  report_id: string;
  player_feedback: string | null;
  next_steps: string | null;
  future_reference_notes: string | null;
  is_exclusive: boolean;
  commission_percentage: number;
  staff_notes: string | null;
  created_by: string | null;
  read_by_scout: boolean;
  created_at: string;
  scouting_reports?: {
    player_name: string;
    position: string;
    current_club: string | null;
  };
}

interface ScoutMessagesProps {
  scoutId: string;
}

export const ScoutMessages = ({ scoutId }: ScoutMessagesProps) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from("scout_report_feedback")
          .select(`
            *,
            scouting_reports (
              player_name,
              position,
              current_club
            )
          `)
          .eq("scout_id", scoutId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setFeedback(data || []);

        // Mark unread messages as read
        const unreadIds = (data || [])
          .filter(f => !f.read_by_scout)
          .map(f => f.id);

        if (unreadIds.length > 0) {
          await supabase
            .from("scout_report_feedback")
            .update({ read_by_scout: true })
            .in("id", unreadIds);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    if (scoutId) {
      fetchFeedback();
    }
  }, [scoutId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Feedback Yet</h3>
            <p className="text-muted-foreground">
              Staff feedback on your reports will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <Card key={item.id} className={!item.read_by_scout ? "border-primary" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {item.scouting_reports?.player_name || "Unknown Player"}
                  {!item.read_by_scout && (
                    <Badge variant="default" className="text-xs">New</Badge>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span>{item.scouting_reports?.position}</span>
                  {item.scouting_reports?.current_club && (
                    <>
                      <span>•</span>
                      <span>{item.scouting_reports.current_club}</span>
                    </>
                  )}
                </CardDescription>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Player Assessment */}
            {item.player_feedback && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Player Assessment
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {item.player_feedback}
                </p>
              </div>
            )}

            {/* Next Steps */}
            {item.next_steps && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Next Steps
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {item.next_steps}
                </p>
              </div>
            )}

            {/* Future Reference */}
            {item.future_reference_notes && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  For Future Reference
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {item.future_reference_notes}
                </p>
              </div>
            )}

            {/* Commission Info */}
            {(item.is_exclusive || item.commission_percentage > 0) && (
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                {item.is_exclusive && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Exclusive Scout
                  </Badge>
                )}
                {item.commission_percentage > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Percent className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">
                      {item.commission_percentage}% Commission
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Staff Notes (if any) */}
            {item.staff_notes && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground italic">
                  Note from staff: {item.staff_notes}
                </p>
              </div>
            )}

            {item.created_by && (
              <div className="text-xs text-muted-foreground">
                — {item.created_by}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
