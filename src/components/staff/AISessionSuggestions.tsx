import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AISessionSuggestionsProps {
  playerName: string;
  position?: string;
  notes?: string;
  recentActions?: any[];
}

const SESSION_CATEGORIES = [
  "Technical",
  "Tactical",
  "Physical - SPS",
  "Physical - Conditioning",
  "Recovery",
  "Pre-Match Preparation",
  "Position-Specific",
  "Combination Play",
];

export function AISessionSuggestions({ playerName, position, notes, recentActions }: AISessionSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [category, setCategory] = useState("General");
  const [copied, setCopied] = useState(false);

  const generateSuggestion = async () => {
    setLoading(true);
    setSuggestion(null);
    try {
      const { data, error } = await invokeEdgeFunction('ai-session-suggest', {
        body: {
          playerName,
          position,
          notes,
          category,
          recentActions: recentActions?.slice(0, 10),
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setSuggestion(data.suggestion);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate suggestion');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!suggestion) return;
    await navigator.clipboard.writeText(suggestion);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="px-3 md:px-6 py-3 md:py-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Session Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 md:px-6 space-y-3">
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General</SelectItem>
              {SESSION_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generateSuggestion} disabled={loading} size="sm">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {suggestion && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
            <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
              {suggestion}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
