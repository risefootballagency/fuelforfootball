import { useState, useEffect } from "react";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, FileText, Trash2, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface StaffDoc {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export const DocsWidget = () => {
  const [docs, setDocs] = useState<StaffDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<StaffDoc | null>(null);
  const [viewingDoc, setViewingDoc] = useState<StaffDoc | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const { data, error } = await supabase
        .from("staff_documents")
        .select("*")
        .eq("doc_type", "doc")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setDocs(data || []);
    } catch (error) {
      console.error("Error fetching docs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      if (editingDoc) {
        const { error } = await supabase
          .from("staff_documents")
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq("id", editingDoc.id);
        if (error) throw error;
        toast.success("Document updated");
      } else {
        const { error } = await supabase
          .from("staff_documents")
          .insert({ title, content, doc_type: "doc" });
        if (error) throw error;
        toast.success("Document created");
      }
      resetForm();
      fetchDocs();
    } catch (error) {
      toast.error("Failed to save document");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      const { error } = await supabase.from("staff_documents").delete().eq("id", id);
      if (error) throw error;
      toast.success("Document deleted");
      fetchDocs();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingDoc(null);
    setIsDialogOpen(false);
  };

  const openEdit = (doc: StaffDoc) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setContent(doc.content);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="p-4 text-muted-foreground text-sm">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{docs.length} documents</span>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="w-3 h-3" /> New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{editingDoc ? "Edit Document" : "New Document"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Document title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Write your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => setViewingDoc(doc)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(doc.updated_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); openEdit(doc); }}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {docs.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              No documents yet. Create your first one!
            </p>
          )}
        </div>
      </ScrollArea>

      {/* View Dialog */}
      <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {viewingDoc?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="whitespace-pre-wrap text-sm font-mono p-4 bg-muted/50 rounded-lg">
              {viewingDoc?.content || <span className="text-muted-foreground">No content</span>}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => viewingDoc && openEdit(viewingDoc)}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
