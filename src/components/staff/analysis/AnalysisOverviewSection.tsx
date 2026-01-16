import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, X, Crop } from "lucide-react";
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
import { ImageCropDialog } from "../ImageCropDialog";

interface Matchup {
  name: string;
  shirt_number: string;
  image_url: string;
}

interface OverviewSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  handleVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, field: string, pointIndex?: number, isMultiple?: boolean, matchupIndex?: number) => Promise<void>;
  uploadingImage: boolean;
  players: any[];
  selectedPlayerId: string;
  setSelectedPlayerId: (id: string) => void;
  performanceReports: any[];
  selectedPerformanceReportId: string;
  setSelectedPerformanceReportId: (id: string) => void;
  analysisType: "pre-match" | "post-match" | "concept";
  addMatchup?: () => void;
  removeMatchup?: (index: number) => void;
  updateMatchup?: (index: number, field: string, value: string) => void;
  defaultOpen?: boolean;
}

export const AnalysisOverviewSection = ({
  formData,
  setFormData,
  handleVideoUpload,
  handleImageUpload,
  uploadingImage,
  players,
  selectedPlayerId,
  setSelectedPlayerId,
  performanceReports,
  selectedPerformanceReportId,
  setSelectedPerformanceReportId,
  analysisType,
  addMatchup,
  removeMatchup,
  updateMatchup,
  defaultOpen = false,
}: OverviewSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [cropMatchupIndex, setCropMatchupIndex] = useState<number | null>(null);

  const handleMatchupImageSelect = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropMatchupIndex(index);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (cropMatchupIndex === null) return;
    const file = new File([croppedBlob], `matchup-${cropMatchupIndex}.png`, { type: 'image/png' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const syntheticEvent = { target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>;
    await handleImageUpload(syntheticEvent, "matchup_image", undefined, false, cropMatchupIndex);
  };

  return (
    <>
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
        <h3 className="font-semibold text-lg">OVERVIEW</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4">
        {/* Pre-match specific fields moved from Match Details */}
        {analysisType === "pre-match" && (
          <>
            <div>
              <Label>Key Details</Label>
              <Textarea
                value={formData.key_details || ""}
                onChange={(e) => setFormData({ ...formData, key_details: e.target.value })}
                placeholder="Key tactical information about the match..."
              />
            </div>

            <div>
              <Label>Opposition Strengths</Label>
              <Textarea
                value={formData.opposition_strengths || ""}
                onChange={(e) => setFormData({ ...formData, opposition_strengths: e.target.value })}
                placeholder="• Strong aerial presence&#10;• Fast counter attacks&#10;• Set piece threat"
              />
            </div>

            <div>
              <Label>Opposition Weaknesses</Label>
              <Textarea
                value={formData.opposition_weaknesses || ""}
                onChange={(e) => setFormData({ ...formData, opposition_weaknesses: e.target.value })}
                placeholder="• Weak on the left flank&#10;• Slow to transition&#10;• Vulnerable to through balls"
              />
            </div>

            {addMatchup && removeMatchup && updateMatchup && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Matchups</Label>
                  <Button size="sm" onClick={addMatchup}>
                    <Plus className="w-4 h-4 mr-1" /> Add Matchup
                  </Button>
                </div>
                {formData.matchups?.map((matchup: Matchup, index: number) => (
                  <Card key={index} className="p-4 mb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <Input
                          placeholder="Player Name"
                          value={matchup.name}
                          onChange={(e) => updateMatchup(index, "name", e.target.value)}
                        />
                        <Input
                          placeholder="Shirt Number"
                          value={matchup.shirt_number}
                          onChange={(e) => updateMatchup(index, "shirt_number", e.target.value)}
                        />
                        <div>
                          <Label className="text-xs flex items-center gap-1 mb-1">
                            Photo <Crop className="w-3 h-3" />
                          </Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMatchupImageSelect(e, index)}
                            disabled={uploadingImage}
                          />
                          {matchup.image_url && (
                            <img src={matchup.image_url} alt="Matchup" className="mt-2 w-20 h-20 object-cover rounded" />
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeMatchup(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Post-match specific fields - Key Details moved here */}
        {analysisType === "post-match" && (
          <div>
            <Label>Key Details</Label>
            <Textarea
              value={formData.key_details || ""}
              onChange={(e) => setFormData({ ...formData, key_details: e.target.value })}
            />
          </div>
        )}

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
            <div>
              <Label>Explanation</Label>
              <Textarea
                value={formData.explanation || ""}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Detailed explanation of the concept..."
                rows={4}
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
    
    <ImageCropDialog
      open={cropDialogOpen}
      onOpenChange={setCropDialogOpen}
      imageSrc={cropImageSrc}
      onCropComplete={handleCropComplete}
      aspectRatio={1}
      title="Crop Matchup Image"
    />
    </>
  );
};