import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { invokeEdgeFunction } from "@/lib/edgeFunctionHelper";

const WRITING_STYLE_GUIDE = `Use this voice:

Reflective and exploratory – to provoke thought and deeper understanding.

Expert-driven and specialised – to communicate with authority to an informed audience.

Personalised and direct – to create a human, relational connection with the reader.

Use this tone:

Calm and measured – to convey clarity without exaggeration or emotional sway.

Constructive and purposeful – to drive improvement, action, or awareness.

Sincere and grounded – to maintain honesty without pretension.

Additionally: Respond formally with U.K. English. Tell it like it is; don't sugar-coat responses. Do not add pre-ambles to your responses, simply respond by completing the task requested. Do not use em dashes in any context. Use commas or full stops to separate or extend ideas.

Never use a comma before the word 'and' in any context. Never use mirrored constructions like "It is not this, it is that." Replace them with direct, assertive statements.`;

interface AIWriterProps {
  title: string;
  sectionNotes: {
    intro: string;
    mainPara: string;
    secondaryPara: string;
    conclusion: string;
  };
  onGenerated: (text: string) => void;
}

export function AIWriter({ title, sectionNotes, onGenerated }: AIWriterProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [extraInstructions, setExtraInstructions] = useState("");

  const generateArticle = async () => {
    setLoading(true);
    try {
      const contentSections = [];
      if (sectionNotes.intro.trim()) contentSections.push(`**Intro:** ${sectionNotes.intro.trim()}`);
      if (sectionNotes.mainPara.trim()) contentSections.push(`**Main Paragraph:** ${sectionNotes.mainPara.trim()}`);
      if (sectionNotes.secondaryPara.trim()) contentSections.push(`**Secondary Paragraph:** ${sectionNotes.secondaryPara.trim()}`);
      if (sectionNotes.conclusion.trim()) contentSections.push(`**Conclusion:** ${sectionNotes.conclusion.trim()}`);

      const prompt = `Write a blog article titled "${title}" for a football performance and development audience.

Use the following section notes as guidance:

${contentSections.join("\n\n")}

${extraInstructions ? `\nAdditional instructions: ${extraInstructions}` : ""}

---

${WRITING_STYLE_GUIDE}

Write the full article now. Do not include the title in your response. Structure with clear paragraphs. Aim for 400-600 words.`;

      const { data, error } = await invokeEdgeFunction("ai-writer", {
        body: { prompt },
      });

      if (error) throw error;

      const generatedText = data?.text || data?.content || "";
      setResult(generatedText);
      onGenerated(generatedText);
      toast.success("Article generated");
    } catch (err: any) {
      toast.error("Generation failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const hasSections = Object.values(sectionNotes).some(v => v.trim());

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">Extra Instructions (optional)</Label>
        <Textarea
          value={extraInstructions}
          onChange={(e) => setExtraInstructions(e.target.value)}
          placeholder="e.g. Focus more on mental resilience, mention specific examples..."
          rows={2}
          className="text-sm mt-1"
        />
      </div>

      <Button
        onClick={generateArticle}
        disabled={loading || !title.trim() || !hasSections}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
        ) : (
          <><Sparkles className="h-4 w-4 mr-2" /> Generate with AI</>
        )}
      </Button>

      {result && (
        <Card className="border-accent/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-accent">Generated Article</span>
              <Button variant="ghost" size="sm" onClick={copyResult} className="h-7">
                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto text-foreground/90 leading-relaxed">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
