import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Presentation, Plus, Trash2, Edit, Download, Upload, Eye,
  FileText, Image, Save, ExternalLink, Copy, ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

interface DeckSlide {
  id: string;
  title: string;
  content: string;
  image_url: string;
  order: number;
}

interface SalesDeckItem {
  id: string;
  title: string;
  description: string;
  slides: DeckSlide[];
  file_url: string;
  thumbnail_url: string;
  category: string;
  created_at: string;
  is_active: boolean;
}

export const SalesDeck = () => {
  const [decks, setDecks] = useState<SalesDeckItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<SalesDeckItem | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<SalesDeckItem | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadDecks(); }, []);

  const loadDecks = async () => {
    const { data } = await supabase
      .from("coaching_analysis")
      .select("*")
      .eq("analysis_type", "sales_deck")
      .order("created_at", { ascending: false });
    if (data) {
      setDecks(data.map((d: any) => {
        const meta = d.attachments as any || {};
        return {
          id: d.id,
          title: d.title,
          description: d.description || "",
          slides: meta.slides || [],
          file_url: d.content || "",
          thumbnail_url: meta.thumbnail_url || "",
          category: d.category || "general",
          created_at: d.created_at,
          is_active: meta.is_active !== false,
        };
      }));
    }
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setCategory("general"); setFile(null);
  };

  const handleSave = async () => {
    if (!title) { toast.error("Title required"); return; }
    setUploading(true);

    let fileUrl = editing?.file_url || "";

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `sales-decks/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("marketing-gallery").upload(path, file);
      if (uploadErr) { toast.error("Upload failed"); setUploading(false); return; }
      const { data: urlData } = supabase.storage.from("marketing-gallery").getPublicUrl(path);
      fileUrl = urlData.publicUrl;
    }

    const meta = {
      slides: editing?.slides || [],
      thumbnail_url: editing?.thumbnail_url || "",
      is_active: true,
    };

    if (editing) {
      await supabase.from("coaching_analysis").update({
        title, description, content: fileUrl, category,
        attachments: meta as any,
      }).eq("id", editing.id);
      toast.success("Deck updated");
    } else {
      await supabase.from("coaching_analysis").insert({
        title, description, analysis_type: "sales_deck",
        content: fileUrl, category, attachments: meta as any,
      });
      toast.success("Deck created");
    }

    setShowAdd(false); setEditing(null); resetForm(); loadDecks();
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("coaching_analysis").delete().eq("id", id);
    toast.success("Deleted"); loadDecks();
  };

  const copyLink = (url: string) => {
    if (!url) { toast.error("No file URL"); return; }
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  // Detail view
  if (selectedDeck) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDeck(null)}>← Back</Button>
          <h2 className="text-lg font-semibold truncate">{selectedDeck.title}</h2>
          <Badge variant="outline" className="text-[9px]">{selectedDeck.category}</Badge>
        </div>

        {selectedDeck.description && (
          <p className="text-sm text-muted-foreground">{selectedDeck.description}</p>
        )}

        {selectedDeck.file_url && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Deck File</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => window.open(selectedDeck.file_url, "_blank")}>
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => copyLink(selectedDeck.file_url)}>
                    <Copy className="w-4 h-4 mr-1" /> Copy Link
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedDeck.file_url} download>
                      <Download className="w-4 h-4 mr-1" /> Download
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* If it's a PDF or image, show preview */}
        {selectedDeck.file_url && (
          selectedDeck.file_url.endsWith(".pdf") ? (
            <iframe src={selectedDeck.file_url} className="w-full h-[60vh] rounded-lg border" />
          ) : selectedDeck.file_url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
            <img src={selectedDeck.file_url} alt={selectedDeck.title} className="w-full rounded-lg border" />
          ) : null
        )}

        <p className="text-[10px] text-muted-foreground">
          Created {format(new Date(selectedDeck.created_at), "dd MMM yyyy")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Presentation className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Sales Deck</h2>
            <p className="text-sm text-muted-foreground">{decks.length} deck{decks.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setEditing(null); setShowAdd(true); }}>
          <Plus className="w-4 h-4 mr-1" /> New Deck
        </Button>
      </div>

      {decks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Presentation className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No sales decks</p>
            <p className="text-sm">Upload presentations and pitch materials</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {decks.map(deck => (
            <Card key={deck.id} className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setSelectedDeck(deck)}>
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Presentation className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{deck.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {deck.category} • {format(new Date(deck.created_at), "dd MMM yy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {deck.file_url && (
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={e => { e.stopPropagation(); copyLink(deck.file_url); }}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={e => {
                    e.stopPropagation();
                    setEditing(deck); setTitle(deck.title); setDescription(deck.description);
                    setCategory(deck.category); setShowAdd(true);
                  }}>
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={e => { e.stopPropagation(); handleDelete(deck.id); }}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAdd} onOpenChange={o => { setShowAdd(o); if (!o) { setEditing(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Sales Deck</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title *</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Pitch deck Q1 2026" /></div>
            <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Brief description..." /></div>
            <div><Label>Category</Label>
              <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. pitch, onboarding, services" />
            </div>
            <div>
              <Label>File (PDF, PPT, Image)</Label>
              <Input type="file" accept=".pdf,.pptx,.ppt,.png,.jpg,.jpeg,.webp" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
            <Button onClick={handleSave} disabled={uploading} className="w-full">
              {uploading ? "Uploading..." : <><Save className="w-4 h-4 mr-1" /> {editing ? "Update" : "Create"}</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
