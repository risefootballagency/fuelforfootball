import { useState, useEffect, useMemo } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Search, Calendar, Eye, Download, Filter, SortAsc, SortDesc, ChevronDown, ChevronUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { t } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";

interface UnifiedReport {
  id: string;
  type: "performance" | "pre-match" | "post-match" | "concept" | "action-report";
  title: string;
  date: string;
  opponent?: string;
  score?: string;
  pdfUrl?: string | null;
  videoUrl?: string | null;
  analysisWriterId?: string | null;
  actionCount?: number;
}

interface AllReportsSectionProps {
  playerId: string;
  playerName?: string;
}

export function AllReportsSection({ playerId, playerName }: AllReportsSectionProps) {
  const navigate = useNavigate();
  const lang = usePortalLanguage();
  const [reports, setReports] = useState<UnifiedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllReports();
  }, [playerId]);

  const fetchAllReports = async () => {
    setLoading(true);
    const allReports: UnifiedReport[] = [];

    try {
      const { data: analyses } = await sharedSupabase
        .from("player_analysis")
        .select("id, analysis_date, opponent, r90_score, pdf_url, video_url, analysis_writer_id, minutes_played")
        .eq("player_id", playerId)
        .order("analysis_date", { ascending: false });

      if (analyses) {
        const analysisIds = analyses.map(a => a.id);
        
        let actionCounts: Record<string, number> = {};
        if (analysisIds.length > 0) {
          const { data: actions } = await sharedSupabase
            .from("performance_report_actions")
            .select("analysis_id")
            .in("analysis_id", analysisIds);
          if (actions) {
            actions.forEach((a: any) => {
              actionCounts[a.analysis_id] = (actionCounts[a.analysis_id] || 0) + 1;
            });
          }
        }

        analyses.forEach((a: any) => {
          allReports.push({
            id: a.id,
            type: "performance",
            title: `${t(lang, "performance_report")} ${t(lang, "versus_short")} ${a.opponent || "Unknown"}`,
            date: a.analysis_date,
            opponent: a.opponent,
            score: a.r90_score ? `R90: ${a.r90_score}` : undefined,
            pdfUrl: a.pdf_url,
            videoUrl: a.video_url,
            analysisWriterId: a.analysis_writer_id,
            actionCount: actionCounts[a.id] || 0,
          });
        });

        const writerIds = analyses
          .filter((a: any) => a.analysis_writer_id)
          .map((a: any) => a.analysis_writer_id);

        if (writerIds.length > 0) {
          const { data: linkedAnalyses } = await sharedSupabase
            .from("analyses")
            .select("id, title, analysis_type, match_date, created_at, home_team, away_team, home_score, away_score")
            .in("id", writerIds);

          if (linkedAnalyses) {
            const seenIds = new Set<string>();
            linkedAnalyses.forEach((la: any) => {
              if (seenIds.has(la.id)) return;
              seenIds.add(la.id);

              let type: UnifiedReport["type"] = "post-match";
              if (la.analysis_type === "pre-match") type = "pre-match";
              else if (la.analysis_type === "concept") type = "concept";

              const score = la.home_score != null && la.away_score != null
                ? `${la.home_score}-${la.away_score}`
                : undefined;

              allReports.push({
                id: `writer-${la.id}`,
                type,
                title: la.title || `${type === "pre-match" ? t(lang, "pre_match_label") : type === "concept" ? t(lang, "concept_label") : t(lang, "post_match_label")} ${t(lang, "analysis")}`,
                date: la.match_date || la.created_at,
                opponent: la.away_team || la.home_team,
                score,
                analysisWriterId: la.id,
              });
            });
          }
        }
      }

      if (playerName) {
        const { data: namedAnalyses } = await sharedSupabase
          .from("analyses")
          .select("id, title, analysis_type, match_date, created_at, home_team, away_team")
          .eq("player_name", playerName);

        if (namedAnalyses) {
          const existingIds = new Set(allReports.map(r => r.analysisWriterId || r.id));
          namedAnalyses.forEach((na: any) => {
            if (existingIds.has(na.id) || existingIds.has(`writer-${na.id}`)) return;
            let type: UnifiedReport["type"] = "post-match";
            if (na.analysis_type === "pre-match") type = "pre-match";
            else if (na.analysis_type === "concept") type = "concept";

            allReports.push({
              id: `named-${na.id}`,
              type,
              title: na.title || `${t(lang, "analysis")}`,
              date: na.match_date || na.created_at,
              opponent: na.away_team,
              analysisWriterId: na.id,
            });
          });
        }
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }

    setReports(allReports);
    setLoading(false);
  };

  const filteredReports = useMemo(() => {
    let result = reports;
    if (typeFilter !== "all") result = result.filter(r => r.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        (r.opponent && r.opponent.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [reports, typeFilter, search, sortOrder]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: reports.length };
    reports.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
    return counts;
  }, [reports]);

  const getTypeBadge = (type: UnifiedReport["type"]) => {
    const styles: Record<string, string> = {
      "performance": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "pre-match": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "post-match": "bg-green-500/20 text-green-400 border-green-500/30",
      "concept": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "action-report": "bg-red-500/20 text-red-400 border-red-500/30",
    };
    const labels: Record<string, string> = {
      "performance": t(lang, "performance"),
      "pre-match": t(lang, "pre_match_label"),
      "post-match": t(lang, "post_match_label"),
      "concept": t(lang, "concept_label"),
      "action-report": t(lang, "action_report_label"),
    };
    return <Badge variant="outline" className={`text-[10px] ${styles[type]}`}>{labels[type]}</Badge>;
  };

  const handleViewReport = (report: UnifiedReport) => {
    if (report.analysisWriterId) {
      navigate(`/analysis/${report.analysisWriterId}`);
    } else if (report.pdfUrl) {
      window.open(report.pdfUrl, '_blank');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">{t(lang, "loading_all_reports")}</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gold" />
          <h3 className="font-bebas text-lg text-gold">{t(lang, "all_reports")}</h3>
          <span className="text-xs text-muted-foreground">({reports.length})</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortOrder(s => s === "desc" ? "asc" : "desc")}
          className="text-xs"
        >
          {sortOrder === "desc" ? <SortDesc className="w-3 h-3 mr-1" /> : <SortAsc className="w-3 h-3 mr-1" />}
          {sortOrder === "desc" ? t(lang, "newest") : t(lang, "oldest")}
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder={t(lang, "search_reports")} value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-sm" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t(lang, "all")} ({typeCounts.all || 0})</SelectItem>
            <SelectItem value="performance">{t(lang, "performance")} ({typeCounts.performance || 0})</SelectItem>
            <SelectItem value="pre-match">{t(lang, "pre_match_label")} ({typeCounts["pre-match"] || 0})</SelectItem>
            <SelectItem value="post-match">{t(lang, "post_match_label")} ({typeCounts["post-match"] || 0})</SelectItem>
            <SelectItem value="concept">{t(lang, "concept_label")} ({typeCounts.concept || 0})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {search || typeFilter !== "all" ? t(lang, "no_reports_match_filters") : t(lang, "no_reports_available")}
        </div>
      ) : (
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-1">
            {filteredReports.map(report => (
              <Card
                key={report.id}
                className="cursor-pointer hover:border-gold/30 transition-colors"
                onClick={() => handleViewReport(report)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex flex-col items-center min-w-[50px]">
                      <span className="text-[10px] text-muted-foreground">{formatDate(report.date)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {getTypeBadge(report.type)}
                        <span className="text-sm font-medium truncate">{report.title}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        {report.score && <span className="text-xs text-gold">{report.score}</span>}
                        {report.actionCount != null && report.actionCount > 0 && (
                          <span className="text-[10px] text-muted-foreground">{report.actionCount} {t(lang, "actions")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {report.pdfUrl && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); window.open(report.pdfUrl!, '_blank'); }}>
                        <Download className="w-3 h-3" />
                      </Button>
                    )}
                    <Eye className="w-3 h-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
