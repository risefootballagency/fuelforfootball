import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay, isSameMonth, isToday } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  category: string | null;
  published: boolean | null;
  created_at: string;
}

export function ContentCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: posts = [] } = useQuery({
    queryKey: ["calendar-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, category, published, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month to align with Monday start
  const startDayOfWeek = getDay(monthStart);
  const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const getCategoryColor = (category: string | null, published: boolean | null) => {
    if (published) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    switch (category) {
      case "Training & Performance": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Psychology": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Nutrition": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Tactical Analysis": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-accent/20 text-accent border-accent/30";
    }
  };

  const publishedCount = posts.filter(p => p.published).length;
  const draftCount = posts.filter(p => !p.published).length;

  return (
    <div className="space-y-3">
      {/* Month Nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <h3 className="text-base font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
          <div className="flex items-center gap-3 justify-center mt-0.5">
            <span className="text-[10px] text-emerald-400">{publishedCount} published</span>
            <span className="text-[10px] text-accent">{draftCount} drafts</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-2">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-px mb-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
              <div key={day} className="text-center text-[10px] text-muted-foreground font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-px">
            {/* Padding cells */}
            {Array.from({ length: paddingDays }).map((_, i) => (
              <div key={`pad-${i}`} className="min-h-[60px] rounded bg-muted/20" />
            ))}

            {days.map(day => {
              const dayPosts = posts.filter(p => isSameDay(new Date(p.created_at), day));
              const today = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[60px] rounded p-1 transition-colors ${
                    today ? "bg-accent/10 border border-accent/30" : "bg-muted/10 hover:bg-muted/20"
                  }`}
                >
                  <span className={`text-[10px] font-medium ${today ? "text-accent" : "text-muted-foreground"}`}>
                    {format(day, "d")}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {dayPosts.slice(0, 2).map(post => (
                      <div
                        key={post.id}
                        className={`text-[9px] px-1 py-0.5 rounded border truncate ${getCategoryColor(post.category, post.published)}`}
                        title={post.title}
                      >
                        {post.title}
                      </div>
                    ))}
                    {dayPosts.length > 2 && (
                      <span className="text-[9px] text-muted-foreground">+{dayPosts.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Published", className: "bg-emerald-500/20 text-emerald-400" },
          { label: "Training", className: "bg-blue-500/20 text-blue-400" },
          { label: "Psychology", className: "bg-purple-500/20 text-purple-400" },
          { label: "Nutrition", className: "bg-orange-500/20 text-orange-400" },
          { label: "Tactical", className: "bg-red-500/20 text-red-400" },
          { label: "Other", className: "bg-accent/20 text-accent" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-sm ${item.className}`} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
