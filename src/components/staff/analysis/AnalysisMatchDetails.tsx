import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface MatchDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, field: string, pointIndex?: number, isMultiple?: boolean, matchupIndex?: number) => Promise<void>;
  uploadingImage: boolean;
  analysisType: "pre-match" | "post-match";
  addMatchup?: () => void;
  removeMatchup?: (index: number) => void;
  updateMatchup?: (index: number, field: string, value: string) => void;
}

export const AnalysisMatchDetails = ({
  formData,
  setFormData,
  handleImageUpload,
  uploadingImage,
  analysisType,
  addMatchup,
  removeMatchup,
  updateMatchup,
}: MatchDetailsProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
        <h3 className="font-semibold text-lg">MATCH DETAILS</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4">
        {analysisType === "pre-match" ? (
          <>
            <div>
              <Label>Match Date</Label>
              <Input
                type="date"
                value={formData.match_date || ""}
                onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Home Team</Label>
                <Input
                  value={formData.home_team || ""}
                  onChange={(e) => setFormData({ ...formData, home_team: e.target.value })}
                />
                <Label className="mt-2">Home Team Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "home_team_logo")}
                  disabled={uploadingImage}
                />
                {formData.home_team_logo && (
                  <img src={formData.home_team_logo} alt="Home team logo" className="mt-2 w-16 h-16 object-contain" />
                )}
              </div>
              <div>
                <Label>Away Team</Label>
                <Input
                  value={formData.away_team || ""}
                  onChange={(e) => setFormData({ ...formData, away_team: e.target.value })}
                />
                <Label className="mt-2">Away Team Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "away_team_logo")}
                  disabled={uploadingImage}
                />
                {formData.away_team_logo && (
                  <img src={formData.away_team_logo} alt="Away team logo" className="mt-2 w-16 h-16 object-contain" />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Home Team Background Color</Label>
                <p className="text-xs text-muted-foreground mb-2">Background color for home team sections</p>
                <Input
                  type="color"
                  value={formData.home_team_bg_color || '#1a1a1a'}
                  onChange={(e) => setFormData({ ...formData, home_team_bg_color: e.target.value })}
                />
              </div>
              <div>
                <Label>Away Team Background Color</Label>
                <p className="text-xs text-muted-foreground mb-2">Background color for opposition sections</p>
                <Input
                  type="color"
                  value={formData.away_team_bg_color || '#8B0000'}
                  onChange={(e) => setFormData({ ...formData, away_team_bg_color: e.target.value })}
                />
              </div>
            </div>

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
                {formData.matchups?.map((matchup: any, index: number) => (
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
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "matchup_image", undefined, false, index)}
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
        ) : (
          <>
            <div>
              <Label>Player Image (Optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "player_image_url")}
                disabled={uploadingImage}
              />
              {formData.player_image_url && (
                <img src={formData.player_image_url} alt="Player" className="mt-2 max-w-xs" />
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Home Team</Label>
                <Input
                  value={formData.home_team || ""}
                  onChange={(e) => setFormData({ ...formData, home_team: e.target.value })}
                />
              </div>
              <div>
                <Label>Home Score</Label>
                <Input
                  type="number"
                  value={formData.home_score || ""}
                  onChange={(e) => setFormData({ ...formData, home_score: parseInt(e.target.value) || undefined })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Away Team</Label>
                <Input
                  value={formData.away_team || ""}
                  onChange={(e) => setFormData({ ...formData, away_team: e.target.value })}
                />
              </div>
              <div>
                <Label>Away Score</Label>
                <Input
                  type="number"
                  value={formData.away_score || ""}
                  onChange={(e) => setFormData({ ...formData, away_score: parseInt(e.target.value) || undefined })}
                />
              </div>
            </div>
            <div>
              <Label>Key Details</Label>
              <Textarea
                value={formData.key_details || ""}
                onChange={(e) => setFormData({ ...formData, key_details: e.target.value })}
              />
            </div>
            <div>
              <Label>Strengths & Areas For Improvement</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Format: Green: text | Yellow: text | Red: text
              </p>
              <Textarea
                value={formData.strengths_improvements || ""}
                onChange={(e) => setFormData({ ...formData, strengths_improvements: e.target.value })}
                placeholder="Green: Great positioning | Yellow: Work on first touch | Red: Needs better decision making"
              />
            </div>
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
