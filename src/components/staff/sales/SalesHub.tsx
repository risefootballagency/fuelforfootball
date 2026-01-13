import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, FileText, MessageSquare, Presentation, BookOpen, GripVertical } from "lucide-react";

interface SalesHubContent {
  id: string;
  title: string;
  content_type: string;
  content: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const CONTENT_TYPES = [
  { value: "process", label: "Process", icon: FileText },
  { value: "script", label: "Script", icon: MessageSquare },
  { value: "pitch", label: "Pitch", icon: Presentation },
  { value: "resource", label: "Resource", icon: BookOpen },
];

export function SalesHub() {
  const [content, setContent] = useState<SalesHubContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<SalesHubContent | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    content_type: "process",
    content: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from("sales_hub_content")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Failed to fetch content");
    } else {
      setContent(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      content: formData.content || null,
    };

    if (editingContent) {
      const { error } = await supabase
        .from("sales_hub_content")
        .update(payload)
        .eq("id", editingContent.id);

      if (error) {
        toast.error("Failed to update content");
      } else {
        toast.success("Content updated");
        fetchContent();
      }
    } else {
      const maxOrder = content.length > 0 ? Math.max(...content.map(c => c.display_order)) : 0;
      const { error } = await supabase
        .from("sales_hub_content")
        .insert({ ...payload, display_order: maxOrder + 1 });

      if (error) {
        toast.error("Failed to add content");
      } else {
        toast.success("Content added");
        fetchContent();
      }
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this content?")) return;

    const { error } = await supabase
      .from("sales_hub_content")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete content");
    } else {
      toast.success("Content deleted");
      fetchContent();
    }
  };

  const toggleActive = async (item: SalesHubContent) => {
    const { error } = await supabase
      .from("sales_hub_content")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);

    if (!error) {
      fetchContent();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content_type: "process",
      content: "",
      display_order: 0,
      is_active: true,
    });
    setEditingContent(null);
  };

  const openEditDialog = (item: SalesHubContent) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      content_type: item.content_type,
      content: item.content || "",
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const getContentByType = (type: string) => {
    return content.filter(c => c.content_type === type && c.is_active);
  };

  const getIcon = (type: string) => {
    const typeConfig = CONTENT_TYPES.find(t => t.value === type);
    return typeConfig?.icon || FileText;
  };

  const filteredContent = activeTab === "all" 
    ? content 
    : content.filter(c => c.content_type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sales Hub</h2>
          <p className="text-muted-foreground">Processes, scripts, pitches, and resources</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Content</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingContent ? "Edit Content" : "Add Content"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={formData.content_type} onValueChange={(v) => setFormData({ ...formData, content_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Content</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  placeholder="Enter your content here... You can use markdown formatting."
                />
              </div>
              <Button type="submit" className="w-full">{editingContent ? "Update" : "Add"} Content</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
          {CONTENT_TYPES.map(type => (
            <TabsTrigger key={type.value} value={type.value} className="flex items-center gap-1 text-xs sm:text-sm">
              <type.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{type.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredContent.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No content yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setDialogOpen(true)}
                >
                  Add your first item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((item) => {
                const Icon = getIcon(item.content_type);
                return (
                  <Card key={item.id} className={!item.is_active ? "opacity-50" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-primary/10`}>
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <p className="text-sm text-muted-foreground capitalize">{item.content_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleActive(item)}
                          >
                            {item.is_active ? "Hide" : "Show"}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {item.content && (
                      <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <pre className="whitespace-pre-wrap font-sans text-sm bg-muted/50 p-4 rounded-lg">
                            {item.content}
                          </pre>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
