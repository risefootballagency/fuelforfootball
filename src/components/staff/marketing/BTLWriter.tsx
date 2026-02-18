import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, FileText, Trash2, Plus, Send, Save, Copy, ChevronDown, Pencil } from "lucide-react";
import { toast } from "sonner";

interface MarketingIdea {
  id: string;
  title: string;
  description: string | null;
  status: string;
  category: string | null;
  canva_link: string | null;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  created_at: string;
}

const BTL_CATEGORIES = [
  "Training & Performance",
  "Psychology",
  "Nutrition",
  "Recovery",
  "Tactical Analysis",
  "Career Development",
  "Technical Skills",
  "Mindset",
];

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

export const BTLWriter = () => {
  const queryClient = useQueryClient();
  const [selectedIdea, setSelectedIdea] = useState<MarketingIdea | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<BlogPost | null>(null);
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [draftForm, setDraftForm] = useState({
    title: "",
    excerpt: "",
    intro: "",
    mainPara: "",
    secondaryPara: "",
    conclusion: "",
    category: "",
    finalArticle: "",
    graphicSuggestions: "",
  });
  const [draftSectionOpen, setDraftSectionOpen] = useState(true);
  const [finalArticleSectionOpen, setFinalArticleSectionOpen] = useState(false);

  const combineContent = (intro: string, main: string, secondary: string, conclusion: string) => {
    return `**Intro**\n${intro}\n\n**Main**\n${main}\n\n**Secondary**\n${secondary}\n\n**Conclusion**\n${conclusion}`;
  };

  const parseContent = (content: string) => {
    const sections = { intro: "", mainPara: "", secondaryPara: "", conclusion: "" };
    const introMatch = content.match(/\*\*Intro\*\*\n([\s\S]*?)(?=\n\n\*\*Main\*\*|$)/);
    const mainMatch = content.match(/\*\*Main\*\*\n([\s\S]*?)(?=\n\n\*\*Secondary\*\*|$)/);
    const secondaryMatch = content.match(/\*\*Secondary\*\*\n([\s\S]*?)(?=\n\n\*\*Conclusion\*\*|$)/);
    const conclusionMatch = content.match(/\*\*Conclusion\*\*\n([\s\S]*?)$/);
    
    if (introMatch) sections.intro = introMatch[1].trim();
    if (mainMatch) sections.mainPara = mainMatch[1].trim();
    if (secondaryMatch) sections.secondaryPara = secondaryMatch[1].trim();
    if (conclusionMatch) sections.conclusion = conclusionMatch[1].trim();
    
    if (!introMatch && !mainMatch && !secondaryMatch && !conclusionMatch && content.trim()) {
      sections.intro = content;
    }
    
    return sections;
  };

  const { data: acceptedIdeas = [], isLoading: ideasLoading } = useQuery({
    queryKey: ["btl-writer-ideas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_ideas")
        .select("*")
        .eq("status", "accepted")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MarketingIdea[];
    },
  });

  const { data: drafts = [], isLoading: draftsLoading } = useQuery({
    queryKey: ["btl-drafts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("marketing_ideas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["btl-writer-ideas"] });
      toast.success("Idea removed");
    },
  });

  const createDraftMutation = useMutation({
    mutationFn: async (data: typeof draftForm) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const combinedContent = combineContent(data.intro, data.mainPara, data.secondaryPara, data.conclusion);
      const { error } = await supabase.from("blog_posts").insert({
        title: data.title,
        excerpt: data.excerpt || null,
        content: combinedContent,
        category: data.category || null,
        author_id: userData.user.id,
        published: false,
      });
      if (error) throw error;

      if (selectedIdea) {
        await supabase.from("marketing_ideas").delete().eq("id", selectedIdea.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["btl-writer-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["btl-drafts"] });
      toast.success("Draft created");
      setDraftDialogOpen(false);
      setSelectedIdea(null);
      setDraftForm({ title: "", excerpt: "", intro: "", mainPara: "", secondaryPara: "", conclusion: "", category: "", finalArticle: "", graphicSuggestions: "" });
    },
  });

  const openDraftDialog = (idea: MarketingIdea) => {
    setSelectedIdea(idea);
    setDraftForm({
      title: idea.title,
      excerpt: "",
      intro: "",
      mainPara: "",
      secondaryPara: "",
      conclusion: "",
      category: "",
      finalArticle: "",
      graphicSuggestions: "",
    });
    setDraftDialogOpen(true);
  };

  const generateAndCopyPrompt = () => {
    const contentSections = [];
    if (draftForm.intro.trim()) contentSections.push(`**Intro:** ${draftForm.intro.trim()}`);
    if (draftForm.mainPara.trim()) contentSections.push(`**Main Paragraph:** ${draftForm.mainPara.trim()}`);
    if (draftForm.secondaryPara.trim()) contentSections.push(`**Secondary Paragraph:** ${draftForm.secondaryPara.trim()}`);
    if (draftForm.conclusion.trim()) contentSections.push(`**Conclusion:** ${draftForm.conclusion.trim()}`);

    const prompt = `Write a blog article titled "${draftForm.title}" for a football performance and development audience.\n\nUse the following section notes as guidance:\n\n${contentSections.join("\n\n")}\n\n---\n\n${WRITING_STYLE_GUIDE}`;

    navigator.clipboard.writeText(prompt).then(() => {
      toast.success("Prompt copied to clipboard");
    });
  };

  if (ideasLoading || draftsLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Drafts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Drafts
          </CardTitle>
          <CardDescription>Work in progress posts. Edit and submit when ready.</CardDescription>
        </CardHeader>
        <CardContent>
          {drafts.length === 0 ? (
            <p className="text-muted-foreground text-center py-6 text-sm">No drafts yet. Create one from an accepted idea below.</p>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <Card key={draft.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{draft.title}</h4>
                        {draft.category && <span className="text-xs text-muted-foreground">{draft.category}</span>}
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{draft.content.substring(0, 100)}...</p>
                      </div>
                      <Button size="sm" variant="default" onClick={() => {
                        setSelectedDraft(draft);
                        const parsed = parseContent(draft.content);
                        setDraftForm({
                          title: draft.title,
                          excerpt: draft.excerpt || "",
                          intro: parsed.intro,
                          mainPara: parsed.mainPara,
                          secondaryPara: parsed.secondaryPara,
                          conclusion: parsed.conclusion,
                          category: draft.category || "",
                          finalArticle: "",
                          graphicSuggestions: "",
                        });
                        setEditDialogOpen(true);
                      }} className="h-8">
                        <Edit className="w-3 h-3 mr-1" /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accepted Ideas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-accent" />
            Accepted Ideas ({acceptedIdeas.length})
          </CardTitle>
          <CardDescription>Approved ideas ready to be drafted into articles.</CardDescription>
        </CardHeader>
        <CardContent>
          {acceptedIdeas.length === 0 ? (
            <p className="text-muted-foreground text-center py-6 text-sm">No accepted ideas. Review and accept ideas in the Ideas tab.</p>
          ) : (
            <div className="space-y-3">
              {acceptedIdeas.map((idea) => (
                <Card key={idea.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{idea.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(idea.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="default" onClick={() => openDraftDialog(idea)} className="h-8">
                          <Pencil className="w-3 h-3 mr-1" /> Draft
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(idea.id)} className="h-8 text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Draft Dialog */}
      <Dialog open={draftDialogOpen} onOpenChange={setDraftDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Draft</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={draftForm.title} onChange={e => setDraftForm({...draftForm, title: e.target.value})} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={draftForm.category} onValueChange={v => setDraftForm({...draftForm, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {BTL_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea value={draftForm.excerpt} onChange={e => setDraftForm({...draftForm, excerpt: e.target.value})} className="min-h-[60px]" placeholder="Brief summary..." />
            </div>
            {["intro", "mainPara", "secondaryPara", "conclusion"].map(section => (
              <div key={section}>
                <Label>{section === "mainPara" ? "Main Paragraph" : section === "secondaryPara" ? "Secondary Paragraph" : section.charAt(0).toUpperCase() + section.slice(1)}</Label>
                <Textarea 
                  value={(draftForm as any)[section]} 
                  onChange={e => setDraftForm({...draftForm, [section]: e.target.value})} 
                  className="min-h-[100px]" 
                  placeholder={`Enter ${section} content...`} 
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={() => createDraftMutation.mutate(draftForm)} disabled={createDraftMutation.isPending}>
                <Save className="w-4 h-4 mr-2" /> Create Draft
              </Button>
              <Button variant="outline" onClick={generateAndCopyPrompt}>
                <Copy className="w-4 h-4 mr-2" /> Copy AI Prompt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Draft Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Draft</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={draftForm.title} onChange={e => setDraftForm({...draftForm, title: e.target.value})} />
            </div>
            <Collapsible open={draftSectionOpen} onOpenChange={setDraftSectionOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                <ChevronDown className={`w-4 h-4 transition-transform ${draftSectionOpen ? 'rotate-180' : ''}`} />
                Draft Sections
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {["intro", "mainPara", "secondaryPara", "conclusion"].map(section => (
                  <div key={section}>
                    <Label>{section === "mainPara" ? "Main Paragraph" : section === "secondaryPara" ? "Secondary Paragraph" : section.charAt(0).toUpperCase() + section.slice(1)}</Label>
                    <Textarea 
                      value={(draftForm as any)[section]} 
                      onChange={e => setDraftForm({...draftForm, [section]: e.target.value})} 
                      className="min-h-[100px]" 
                    />
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible open={finalArticleSectionOpen} onOpenChange={setFinalArticleSectionOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                <ChevronDown className={`w-4 h-4 transition-transform ${finalArticleSectionOpen ? 'rotate-180' : ''}`} />
                Final Article
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <Textarea 
                  value={draftForm.finalArticle} 
                  onChange={e => setDraftForm({...draftForm, finalArticle: e.target.value})} 
                  className="min-h-[200px]" 
                  placeholder="Paste final article text here..."
                />
              </CollapsibleContent>
            </Collapsible>
            <div className="flex gap-2">
              <Button onClick={generateAndCopyPrompt} variant="outline">
                <Copy className="w-4 h-4 mr-2" /> Copy AI Prompt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
