import { useState } from "react";
import { useScoutAuth } from "@/hooks/useScoutAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Target, TrendingUp, Users, FileText, MessageCircle, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { ScoutReportView } from "@/components/scout/ScoutReportView";
import { ScoutMessages } from "@/components/scout/ScoutMessages";
import PageLoading from "@/components/PageLoading";

interface ScoutingReport {
  id: string;
  player_name: string;
  position: string;
  age: number | null;
  nationality: string | null;
  current_club: string | null;
  league: string | null;
  scout_date: string | null;
  video_url: string | null;
  full_match_url?: string | null;
  rise_report_url?: string | null;
  additional_documents?: any;
  overall_rating: number | null;
  potential_rating: number | null;
  status: string | null;
  summary: string | null;
  recommendation: string | null;
  strengths: string | null;
  weaknesses: string | null;
  physical_rating: number | null;
  technical_rating: number | null;
  tactical_rating: number | null;
  mental_rating: number | null;
  additional_info?: string | null;
  contribution_type?: string | null;
  created_at: string;
}

const ScoutPortal = () => {
  const { scout, loading, signOut } = useScoutAuth();
  const [selectedReport, setSelectedReport] = useState<ScoutingReport | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: reports = [] } = useQuery({
    queryKey: ["scout-reports", scout?.id],
    queryFn: async () => {
      if (!scout?.id) return [];
      const { data, error } = await supabase
        .from("scouting_reports")
        .select("*")
        .eq("scout_id", scout.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ScoutingReport[];
    },
    enabled: !!scout?.id,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["scout-unread-feedback", scout?.id],
    queryFn: async () => {
      if (!scout?.id) return 0;
      const { count, error } = await supabase
        .from("scout_report_feedback")
        .select("*", { count: "exact", head: true })
        .eq("scout_id", scout.id)
        .eq("read_by_scout", false);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!scout?.id,
  });

  const handleViewReport = (report: ScoutingReport) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  if (loading) {
    return <PageLoading />;
  }

  const statusCounts = {
    recommended: reports.filter(r => r.status === "recommended").length,
    recruiting: reports.filter(r => r.status === "recruiting").length,
    monitoring: reports.filter(r => r.status === "monitoring" || r.status === "scouting_further").length,
    pending: reports.filter(r => r.status === "pending").length,
    rejected: reports.filter(r => r.status === "rejected").length,
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "recommended":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "recruiting":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "monitoring":
      case "scouting_further":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bebas tracking-wider">Scout Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome, {scout?.name}</p>
            </div>
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scout?.total_submissions || reports.length}</div>
              <p className="text-xs text-muted-foreground">All time reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recruiting</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.recruiting + statusCounts.recommended}</div>
              <p className="text-xs text-muted-foreground">Active recruitment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Signings</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scout?.successful_signings || 0}</div>
              <p className="text-xs text-muted-foreground">Players signed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scout?.commission_rate || 0}%</div>
              <p className="text-xs text-muted-foreground">Per signing</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Reports and Feedback */}
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Reports
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2 relative">
              <MessageCircle className="h-4 w-4" />
              Feedback
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Your latest scouting reports</CardDescription>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No reports submitted yet. Contact staff to submit your first report.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        onClick={() => handleViewReport(report)}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold group-hover:text-primary transition-colors">
                            {report.player_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {report.position} • {report.current_club} • {report.nationality}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Submitted: {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">Overall: {report.overall_rating}/10</div>
                            <Badge className={getStatusBadge(report.status)}>
                              {report.status || "pending"}
                            </Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            {scout?.id && <ScoutMessages scoutId={scout.id} />}
          </TabsContent>
        </Tabs>
      </main>

      {/* Report View Dialog */}
      <ScoutReportView
        report={selectedReport}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
};

export default ScoutPortal;
