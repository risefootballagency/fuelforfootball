import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface KeyDetailsSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  handleVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploadingImage: boolean;
  players: any[];
  selectedPlayerId: string;
  setSelectedPlayerId: (id: string) => void;
  performanceReports: any[];
  selectedPerformanceReportId: string;
  setSelectedPerformanceReportId: (id: string) => void;
  analysisType: "pre-match" | "post-match" | "concept";
  defaultOpen?: boolean;
}

export const AnalysisKeyDetailsSection = ({
  formData,
  setFormData,
  handleVideoUpload,
  uploadingImage,
  players,
  selectedPlayerId,
  setSelectedPlayerId,
  performanceReports,
  selectedPerformanceReportId,
  setSelectedPerformanceReportId,
  analysisType,
  defaultOpen = false,
}: KeyDetailsSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
        <h3 className="font-semibold text-lg">KEY DETAILS</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Analysis title..."
          />
        </div>

        {analysisType === "concept" && (
          <>
            <div>
              <Label>Concept</Label>
              <Input
                value={formData.concept || ""}
                onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                placeholder="What is this concept about?"
              />
            </div>
          </>
        )}

        <div>
          <Label>Video URL (Optional)</Label>
          <Input
            value={formData.video_url || ""}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            placeholder="Video URL or upload below..."
          />
        </div>
        <div>
          <Label>Or Upload Video</Label>
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            disabled={uploadingImage}
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-3">Link to Player Performance Report</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Player</Label>
              <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Performance Report</Label>
              <Select 
                value={selectedPerformanceReportId} 
                onValueChange={setSelectedPerformanceReportId}
                disabled={!selectedPlayerId || selectedPlayerId === "none"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {performanceReports.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.opponent} - {new Date(report.analysis_date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};