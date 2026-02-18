import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { ScrollText, Search, RefreshCw, User, FileText, Edit, Trash2, Plus, Eye } from "lucide-react";
import { format } from "date-fns";

interface LogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  user_email: string;
  details: string;
  timestamp: string;
}

const ACTION_ICONS: Record<string, any> = {
  create: Plus,
  update: Edit,
  delete: Trash2,
  view: Eye,
};

const ACTION_COLORS: Record<string, string> = {
  create: "text-green-500",
  update: "text-blue-500",
  delete: "text-destructive",
  view: "text-muted-foreground",
};

export const ActivityLog = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Try to load from coaching_analysis where we store activity logs
      const { data } = await supabase
        .from("coaching_analysis")
        .select("*")
        .eq("analysis_type", "activity_log")
        .order("created_at", { ascending: false })
        .limit(100);

      if (data) {
        setLogs(data.map((d: any) => {
          const meta = d.attachments as any || {};
          return {
            id: d.id,
            action: meta.action || "view",
            entity_type: meta.entity_type || d.category || "unknown",
            entity_id: meta.entity_id || "",
            entity_name: d.title || "",
            user_email: meta.user_email || d.description || "",
            details: d.content || "",
            timestamp: d.created_at,
          };
        }));
      }

      // Also load recent analyses as implicit log entries
      const { data: analyses } = await sharedSupabase
        .from("player_analysis" as any)
        .select("id, player_name, created_at, analysis_type")
        .order("created_at", { ascending: false })
        .limit(50);

      if (analyses) {
        const analysisLogs: LogEntry[] = analyses.map((a: any) => ({
          id: `analysis-${a.id}`,
          action: "create",
          entity_type: "analysis",
          entity_id: a.id,
          entity_name: `${a.player_name || "Unknown"} - ${a.analysis_type || "report"}`,
          user_email: "",
          details: "",
          timestamp: a.created_at,
        }));
        setLogs(prev => [...prev, ...analysisLogs].sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }
    } catch (err) {
      console.error("Error loading logs:", err);
    }
    setLoading(false);
  };

  const filtered = logs.filter(l => {
    if (actionFilter !== "all" && l.action !== actionFilter) return false;
    if (entityFilter !== "all" && l.entity_type !== entityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.entity_name.toLowerCase().includes(q) ||
        l.user_email.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const entityTypes = [...new Set(logs.map(l => l.entity_type))].sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ScrollText className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Activity Log</h2>
            <p className="text-sm text-muted-foreground">{logs.length} entries</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadLogs}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." className="pl-9" />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-28 h-10">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="view">View</SelectItem>
          </SelectContent>
        </Select>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-32 h-10">
            <SelectValue placeholder="Entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {entityTypes.map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Log Entries */}
      {loading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <ScrollText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No activity logs found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-1">
          {filtered.map(log => {
            const Icon = ACTION_ICONS[log.action] || FileText;
            const colorClass = ACTION_COLORS[log.action] || "text-muted-foreground";
            return (
              <div key={log.id} className="flex items-start gap-3 py-2 px-3 rounded hover:bg-muted/20 transition-colors">
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${colorClass}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{log.entity_name}</span>
                    <Badge variant="outline" className="text-[9px]">{log.entity_type}</Badge>
                    <Badge variant="secondary" className={`text-[9px] ${colorClass}`}>{log.action}</Badge>
                  </div>
                  {log.user_email && (
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <User className="w-2.5 h-2.5" /> {log.user_email}
                    </p>
                  )}
                  {log.details && <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>}
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                  {format(new Date(log.timestamp), "dd MMM HH:mm")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
