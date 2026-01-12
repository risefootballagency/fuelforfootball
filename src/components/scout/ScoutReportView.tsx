import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Calendar, MapPin, User, Star, Video, FileText } from "lucide-react";

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

interface ScoutReportViewProps {
  report: ScoutingReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "recommended":
    case "recruiting":
      return "bg-green-500/10 text-green-500 border-green-500/20";
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

const RatingBar = ({ label, value, max = 10 }: { label: string; value: number | null; max?: number }) => {
  const percentage = value ? (value / max) * 100 : 0;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value || 0}/{max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const ScoutReportView = ({ report, open, onOpenChange }: ScoutReportViewProps) => {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bebas tracking-wider">
                {report.player_name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <span>{report.position}</span>
                {report.age && <span>• {report.age} years</span>}
                {report.nationality && <span>• {report.nationality}</span>}
              </div>
            </div>
            <Badge className={getStatusColor(report.status)}>
              {report.status || "pending"}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Player Info Card */}
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Club</p>
                      <p className="font-medium text-sm">{report.current_club || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">League</p>
                      <p className="font-medium text-sm">{report.league || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Scout Date</p>
                      <p className="font-medium text-sm">
                        {report.scout_date 
                          ? new Date(report.scout_date).toLocaleDateString() 
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Potential</p>
                      <p className="font-medium text-sm">{report.potential_rating || 0}/10</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Rating */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Overall Rating</h3>
                    <p className="text-sm text-muted-foreground">Combined assessment score</p>
                  </div>
                  <div className="text-4xl font-bebas text-primary">
                    {report.overall_rating || 0}<span className="text-lg text-muted-foreground">/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary & Recommendation */}
            {report.summary && (
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.summary}</p>
                </CardContent>
              </Card>
            )}

            {report.recommendation && (
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Recommendation</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.recommendation}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-4 mt-4">
            {/* Skill Ratings */}
            <Card>
              <CardContent className="pt-4 space-y-4">
                <h3 className="font-semibold">Skill Ratings</h3>
                <RatingBar label="Physical" value={report.physical_rating} />
                <RatingBar label="Technical" value={report.technical_rating} />
                <RatingBar label="Tactical" value={report.tactical_rating} />
                <RatingBar label="Mental" value={report.mental_rating} />
              </CardContent>
            </Card>

            {/* Strengths */}
            {report.strengths && (
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2 text-green-500">Strengths</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.strengths}</p>
                </CardContent>
              </Card>
            )}

            {/* Weaknesses */}
            {report.weaknesses && (
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2 text-red-500">Areas for Improvement</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.weaknesses}</p>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            {report.additional_info && (
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Additional Information</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.additional_info}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            {/* Video Links */}
            <Card>
              <CardContent className="pt-4 space-y-3">
                <h3 className="font-semibold">Video & Documents</h3>
                
                {report.video_url && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(report.video_url!, "_blank")}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Highlight Video
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                )}

                {report.full_match_url && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(report.full_match_url!, "_blank")}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Full Match Video
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                )}

                {report.rise_report_url && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(report.rise_report_url!, "_blank")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    R90 Performance Report
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                )}

                {!report.video_url && !report.full_match_url && !report.rise_report_url && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No documents attached to this report
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Contribution Type */}
            {report.contribution_type && (
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Contribution Type</h3>
                  <Badge variant="secondary">{report.contribution_type}</Badge>
                </CardContent>
              </Card>
            )}

            {/* Submission Date */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Report Submitted</span>
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
