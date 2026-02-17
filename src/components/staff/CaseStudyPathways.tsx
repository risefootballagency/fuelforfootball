import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, MessageSquare, Send, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CaseStudy {
  id: string;
  player_name: string;
  duration: string | null;
  summary: string | null;
  services_used: string[] | null;
  achievements: string[] | null;
  testimonial: string | null;
}

type PathwayStep = {
  id: string;
  label: string;
  description: string;
  template: (cs: CaseStudy) => string;
};

const buildPathways = (): PathwayStep[] => [
  {
    id: "intro",
    label: "Initial Outreach",
    description: "First contact — spark interest with a success story",
    template: (cs) => {
      const services = cs.services_used?.join(", ") ?? "our full programme";
      const achievement = cs.achievements?.[0] ?? "significant development milestones";
      return `Hi,\n\nI wanted to share a quick success story that might resonate. One of our players worked with us for ${cs.duration ?? "several months"}, using ${services}.\n\nThe result? ${achievement}.\n\n${cs.summary ?? ""}\n\nWould love to chat about how we could tailor something similar for you. Let me know if you're free for a quick call this week.\n\nBest regards`;
    },
  },
  {
    id: "follow-up",
    label: "Follow-Up",
    description: "Re-engage with more detail and social proof",
    template: (cs) => {
      const allAchievements = cs.achievements?.map((a) => `• ${a}`).join("\n") ?? "• Consistent improvement across key metrics";
      return `Hi,\n\nJust following up on my previous message. I thought you might find it interesting to see the full picture of what we achieved:\n\n${allAchievements}\n\nThis was over a period of ${cs.duration ?? "several months"} — results that speak for themselves.\n\n${cs.testimonial ? `In their own words: "${cs.testimonial}"` : ""}\n\nHappy to walk you through exactly how we'd approach your situation. What does your schedule look like?\n\nBest`;
    },
  },
  {
    id: "closing",
    label: "Closing / Decision",
    description: "Final push with testimonial and clear next step",
    template: (cs) => {
      return `Hi,\n\nI know you're weighing your options, so I'll keep it brief.\n\n${cs.testimonial ? `"${cs.testimonial}"` : `Our track record speaks for itself — ${cs.summary ?? "consistent, measurable player development"}.`}\n\nWe've helped players achieve real, tangible results and we'd love the chance to do the same for you.\n\nIf you're ready to take the next step, I can get you set up this week. Just say the word.\n\nLooking forward to hearing from you.`;
    },
  },
];

export const CaseStudyPathways = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [selectedStudyId, setSelectedStudyId] = useState<string>("");
  const [activeStep, setActiveStep] = useState<string>("intro");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const pathways = buildPathways();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("case_studies")
        .select("id, player_name, duration, summary, services_used, achievements, testimonial")
        .eq("is_visible", true)
        .order("display_order");
      if (data) setCaseStudies(data);
    };
    fetch();
  }, []);

  const selectedStudy = caseStudies.find((cs) => cs.id === selectedStudyId);

  useEffect(() => {
    if (!selectedStudy) {
      setGeneratedMessage("");
      return;
    }
    const step = pathways.find((p) => p.id === activeStep);
    if (step) {
      setGeneratedMessage(step.template(selectedStudy));
    }
  }, [selectedStudyId, activeStep]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedMessage);
    setCopiedStep(activeStep);
    toast.success("Message copied to clipboard");
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="font-bebas text-xl text-foreground tracking-wider">Message Pathways</h3>
      </div>

      {/* Case Study Selector */}
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Select a case study to build messages from</Label>
        <Select value={selectedStudyId} onValueChange={setSelectedStudyId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a case study..." />
          </SelectTrigger>
          <SelectContent>
            {caseStudies.map((cs) => (
              <SelectItem key={cs.id} value={cs.id}>
                {cs.player_name} {cs.duration ? `(${cs.duration})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pathway Steps */}
      {selectedStudy && (
        <>
          <div className="flex items-center gap-1">
            {pathways.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold border-current">
                    {idx + 1}
                  </span>
                  {step.label}
                </button>
                {idx < pathways.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            {pathways.find((p) => p.id === activeStep)?.description}
          </p>

          {/* Generated Message */}
          <Card className="border-primary/20">
            <CardContent className="p-4 space-y-3">
              <Textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                rows={10}
                className="text-sm font-mono bg-muted/30 border-none resize-none"
              />
              <div className="flex items-center gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="gap-2">
                  {copiedStep === activeStep ? (
                    <><CheckCircle2 className="w-4 h-4 text-green-500" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Message</>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    const encoded = encodeURIComponent(generatedMessage);
                    window.open(`https://wa.me/?text=${encoded}`, "_blank");
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Send className="w-4 h-4" /> WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedStudy && caseStudies.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center text-muted-foreground text-sm">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No visible case studies yet. Create one in the Case Studies tab to generate message pathways.
          </CardContent>
        </Card>
      )}
    </div>
  );
};
