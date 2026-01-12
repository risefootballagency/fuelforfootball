import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, Trash2, Edit2, Save, FolderPlus, Folder, Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Search, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface StaffDoc {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

interface DocFolder {
  id: string;
  name: string;
}

export const DocsSection = () => {
  const [docs, setDocs] = useState<StaffDoc[]>([]);
  const [folders, setFolders] = useState<DocFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<StaffDoc | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [newFolderName, setNewFolderName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDocs();
    fetchFolders();
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

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from("staff_documents")
        .select("folder_id")
        .eq("doc_type", "doc")
        .not("folder_id", "is", null);

      if (error) throw error;
      const uniqueFolders = Array.from(new Set((data || []).map(d => d.folder_id).filter(Boolean)));
      setFolders(uniqueFolders.map(id => ({ id: id as string, name: id as string })));
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const docData = {
        title,
        content,
        folder_id: selectedFolder,
        doc_type: "doc",
        updated_at: new Date().toISOString()
      };

      if (editingDoc) {
        const { error } = await supabase
          .from("staff_documents")
          .update(docData)
          .eq("id", editingDoc.id);
        if (error) throw error;
        toast.success("Document updated");
      } else {
        const { error } = await supabase
          .from("staff_documents")
          .insert(docData);
        if (error) throw error;
        toast.success("Document created");
      }
      resetForm();
      fetchDocs();
      fetchFolders();
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

  const createFolder = () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }
    setFolders([...folders, { id: newFolderName, name: newFolderName }]);
    setSelectedFolder(newFolderName);
    setNewFolderName("");
    setIsFolderDialogOpen(false);
    toast.success("Folder created");
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedFolder(null);
    setEditingDoc(null);
    setIsEditing(false);
  };

  const openEdit = (doc: StaffDoc) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setContent(doc.content);
    setSelectedFolder(doc.folder_id);
    setIsEditing(true);
  };

  const openNew = () => {
    resetForm();
    setIsEditing(true);
  };

  const applyFormat = (formatType: string) => {
    const textarea = document.getElementById("doc-content-full") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let prefix = "";
    let suffix = "";

    switch (formatType) {
      case "bold": prefix = "**"; suffix = "**"; break;
      case "italic": prefix = "*"; suffix = "*"; break;
      case "underline": prefix = "__"; suffix = "__"; break;
      case "h1": prefix = "# "; break;
      case "h2": prefix = "## "; break;
      case "bullet": prefix = "• "; break;
      case "number": prefix = "1. "; break;
      default: return;
    }

    const formattedText = prefix + selectedText + suffix;
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const filteredDocs = docs
    .filter(d => filterFolder === "all" ? true : filterFolder === "unfiled" ? !d.folder_id : d.folder_id === filterFolder)
    .filter(d => searchQuery ? d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.content?.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading documents...</div>;
  }

  // Full-screen editor view
  if (isEditing) {
    return (
      <div className="space-y-4">
        {/* Editor Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={resetForm}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <span className="text-lg font-medium">
            {editingDoc ? "Edit Document" : "New Document"}
          </span>
        </div>

        {/* Title and folder row */}
        <div className="flex gap-2">
          <Input
            placeholder="Document title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-lg font-medium"
          />
          <Select value={selectedFolder || "none"} onValueChange={(v) => setSelectedFolder(v === "none" ? null : v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="No folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No folder</SelectItem>
              {folders.map(f => (
                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline">
                <FolderPlus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>New Folder</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2">
                <Input
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <Button onClick={createFolder}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Formatting toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-lg">
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => applyFormat("bold")}>
            <Bold className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => applyFormat("italic")}>
            <Italic className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => applyFormat("underline")}>
            <Underline className="w-4 h-4" />
          </Button>
          <div className="w-px bg-border mx-1" />
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => applyFormat("h1")}>
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => applyFormat("h2")}>
            <Heading2 className="w-4 h-4" />
          </Button>
          <div className="w-px bg-border mx-1" />
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => applyFormat("bullet")}>
            <List className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => applyFormat("number")}>
            <ListOrdered className="w-4 h-4" />
          </Button>
        </div>

        {/* Full-screen content area */}
        <textarea
          id="doc-content-full"
          placeholder="Write your content here... (Supports Markdown formatting)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[calc(100vh-400px)] p-4 rounded-lg border bg-background font-sans text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={resetForm}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Save Document
          </Button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterFolder} onValueChange={setFilterFolder}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All folders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({docs.length})</SelectItem>
              <SelectItem value="unfiled">Unfiled</SelectItem>
              {folders.map(f => (
                <SelectItem key={f.id} value={f.id}>
                  <span className="flex items-center gap-1">
                    <Folder className="w-3 h-3" /> {f.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button className="gap-2" onClick={openNew}>
          <Plus className="w-4 h-4" /> New Document
        </Button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => openEdit(doc)}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base line-clamp-1">{doc.title}</CardTitle>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openEdit(doc); }}>
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {doc.content || "No content"}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{format(new Date(doc.updated_at), "MMM d, yyyy")}</span>
                {doc.folder_id && (
                  <span className="flex items-center gap-1">
                    <Folder className="w-3 h-3" /> {doc.folder_id}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No documents found</p>
          <p className="text-sm">Create your first document to get started!</p>
        </div>
      )}
    </div>
  );
};
