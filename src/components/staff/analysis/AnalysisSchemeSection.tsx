import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown } from "lucide-react";
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

interface SchemeSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  handleSchemeChange: (scheme: string) => void;
  updateStartingXIPlayer: (index: number, field: 'surname' | 'number', value: string) => void;
  generateWithAI: (field: string, pointIndex?: number) => Promise<void>;
  aiGenerating: boolean;
  formationTemplates: Record<string, Array<{x: number, y: number, position: string}>>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, field: string) => Promise<void>;
  handleVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploadingImage: boolean;
  defaultOpen?: boolean;
}

export const AnalysisSchemeSection = ({
  formData,
  setFormData,
  handleSchemeChange,
  updateStartingXIPlayer,
  generateWithAI,
  aiGenerating,
  formationTemplates,
  handleImageUpload,
  handleVideoUpload,
  uploadingImage,
  defaultOpen = false,
}: SchemeSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
        <h3 className="font-semibold text-lg">SCHEMES</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4">
        <div>
          <Label>Select Scheme</Label>
          <Select 
            value={formData.selected_scheme || ""} 
            onValueChange={handleSchemeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a scheme" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(formationTemplates).map((formation) => (
                <SelectItem key={formation} value={formation}>
                  {formation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.selected_scheme && formData.starting_xi && formData.starting_xi.length > 0 && (
          <div>
            {/* Kit Customisation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <Label>Primary Color</Label>
                <Input
                  type="color"
                  value={formData.kit_primary_color || '#FFD700'}
                  onChange={(e) => setFormData({ ...formData, kit_primary_color: e.target.value })}
                />
              </div>
              <div>
                <Label>Secondary Color</Label>
                <Input
                  type="color"
                  value={formData.kit_secondary_color || '#000000'}
                  onChange={(e) => setFormData({ ...formData, kit_secondary_color: e.target.value })}
                />
              </div>
              <div>
                <Label>Collar/Trim Color</Label>
                <Input
                  type="color"
                  value={formData.kit_collar_color || '#FFFFFF'}
                  onChange={(e) => setFormData({ ...formData, kit_collar_color: e.target.value })}
                />
              </div>
              <div>
                <Label>Number Color</Label>
                <Input
                  type="color"
                  value={formData.kit_number_color || '#FFFFFF'}
                  onChange={(e) => setFormData({ ...formData, kit_number_color: e.target.value })}
                />
              </div>
            </div>
            
            {/* Stripe Style Selector */}
            <div className="mb-4">
              <Label>Stripe Style</Label>
              <Select 
                value={formData.kit_stripe_style || "none"} 
                onValueChange={(value) => setFormData({ ...formData, kit_stripe_style: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose stripe style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Solid (No Stripes)</SelectItem>
                  <SelectItem value="thin">Thin Stripes</SelectItem>
                  <SelectItem value="thick">Wide Stripes</SelectItem>
                  <SelectItem value="halves">Halves</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Label className="mb-2 block">Starting XI Preview</Label>
            <div className="relative bg-green-700 rounded-lg p-4 sm:p-8 min-h-[300px] sm:min-h-[400px]">
              <div className="text-white text-center mb-2 text-lg font-bold">
                {formData.selected_scheme}
              </div>
              {formData.starting_xi.map((player: any, index: number) => {
                const primaryColor = formData.kit_primary_color || '#FFD700';
                const secondaryColor = formData.kit_secondary_color || '#000000';
                const collarColor = formData.kit_collar_color || '#FFFFFF';
                const numberColor = formData.kit_number_color || '#FFFFFF';
                const stripeStyle = formData.kit_stripe_style || 'none';
                
                // Generate stripe pattern based on style
                const renderStripes = () => {
                  switch (stripeStyle) {
                    case 'thin':
                      return (
                        <>
                          <rect x="35" y="25" width="6" height="50" fill={secondaryColor} opacity="0.9"/>
                          <rect x="47" y="25" width="6" height="50" fill={secondaryColor} opacity="0.9"/>
                          <rect x="59" y="25" width="6" height="50" fill={secondaryColor} opacity="0.9"/>
                        </>
                      );
                    case 'thick':
                      return (
                        <>
                          <rect x="30" y="25" width="16" height="50" fill={secondaryColor} opacity="0.9"/>
                          <rect x="54" y="25" width="16" height="50" fill={secondaryColor} opacity="0.9"/>
                        </>
                      );
                    case 'halves':
                      return (
                        <rect x="50" y="25" width="25" height="50" fill={secondaryColor} opacity="0.9"/>
                      );
                    default:
                      return null;
                  }
                };
                
                return (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      left: `${player.x}%`,
                      top: `${player.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <svg width="48" height="48" viewBox="0 0 100 100" className="drop-shadow-lg mb-1">
                      {/* Kit body */}
                      <path d="M30 25 L25 35 L25 65 L30 75 L70 75 L75 65 L75 35 L70 25 Z" fill={primaryColor} stroke={collarColor} strokeWidth="3"/>
                      {/* Stripes based on style */}
                      {renderStripes()}
                      {/* Collar */}
                      <circle cx="50" cy="25" r="8" fill={primaryColor} stroke={collarColor} strokeWidth="2"/>
                      {/* Number */}
                      <text x="50" y="55" textAnchor="middle" fontSize="24" fontWeight="bold" fill={numberColor} stroke="black" strokeWidth="1">
                        {player.number || '0'}
                      </text>
                    </svg>
                    <div className="bg-black/80 text-white px-1 py-0.5 rounded text-[8px] font-bold text-center whitespace-nowrap">
                      {player.surname || player.position}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              <Label>Enter Player Details</Label>
              {formData.starting_xi.map((player: any, index: number) => (
                <div key={index} className="flex flex-col sm:grid sm:grid-cols-3 gap-2 items-start sm:items-center bg-muted p-2 rounded">
                  <span className="text-xs font-medium">{player.position}</span>
                  <Input
                    placeholder="Surname"
                    value={player.surname}
                    onChange={(e) => updateStartingXIPlayer(index, 'surname', e.target.value)}
                    className="h-8 text-xs w-full"
                  />
                  <Input
                    placeholder="No."
                    value={player.number}
                    onChange={(e) => updateStartingXIPlayer(index, 'number', e.target.value)}
                    className="h-8 text-xs w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label>Scheme Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "scheme_image_url")}
            disabled={uploadingImage}
          />
          {formData.scheme_image_url && (
            <img src={formData.scheme_image_url} alt="Scheme" className="mt-2 max-w-xs rounded" />
          )}
        </div>

        <div>
          <Label>Or Upload Video</Label>
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            disabled={uploadingImage}
          />
          <Input
            value={formData.scheme_video_url || ""}
            onChange={(e) => setFormData({ ...formData, scheme_video_url: e.target.value })}
            placeholder="Or paste video URL..."
            className="mt-2"
          />
        </div>

        <div>
          <Label>Title</Label>
          <Input
            value={formData.scheme_title || ""}
            onChange={(e) => setFormData({ ...formData, scheme_title: e.target.value })}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>Paragraph 1</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => generateWithAI('scheme_paragraph_1')}
              disabled={aiGenerating}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {aiGenerating ? 'Generating...' : 'Use AI'}
            </Button>
          </div>
          <Textarea
            value={formData.scheme_paragraph_1 || ""}
            onChange={(e) => setFormData({ ...formData, scheme_paragraph_1: e.target.value })}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label>Paragraph 2</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => generateWithAI('scheme_paragraph_2')}
              disabled={aiGenerating}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {aiGenerating ? 'Generating...' : 'Use AI'}
            </Button>
          </div>
          <Textarea
            value={formData.scheme_paragraph_2 || ""}
            onChange={(e) => setFormData({ ...formData, scheme_paragraph_2: e.target.value })}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};