import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, X, Save, Loader2, GripVertical } from "lucide-react";

interface OutreachProspect {
  id: string;
  prospect_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  source: string | null;
  status: string;
  last_contact_date: string | null;
  next_follow_up: string | null;
  notes: string | null;
  created_at: string;
}

const COLUMNS = [
  { id: "cold", label: "Cold", emoji: "❄️", color: "hsl(var(--muted))" },
  { id: "lukewarm", label: "Lukewarm", emoji: "🤔", color: "hsl(47, 100%, 51%, 0.1)" },
  { id: "interested", label: "Interested", emoji: "👀", color: "hsl(47, 100%, 51%, 0.15)" },
  { id: "warm", label: "Warm", emoji: "🌡️", color: "hsl(47, 100%, 51%, 0.2)" },
  { id: "hot", label: "Hot", emoji: "🔥", color: "hsl(0, 84%, 60%, 0.15)" },
  { id: "converted", label: "Converted", emoji: "✅", color: "hsl(127, 78%, 13%, 0.3)" },
  { id: "lost", label: "Lost", emoji: "❌", color: "hsl(0, 84%, 60%, 0.1)" },
];

export function OutreachKanban() {
  const [prospects, setProspects] = useState<OutreachProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addToColumn, setAddToColumn] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    prospect_name: "",
    notes: "",
    contact_email: "",
  });

  useEffect(() => {
    fetchProspects();
  }, []);

  async function fetchProspects() {
    const { data, error } = await supabase
      .from("outreach_prospects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch prospects");
    } else {
      setProspects(data || []);
    }
    setLoading(false);
  }

  const handleSubmit = async () => {
    if (!formData.prospect_name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    const { error } = await supabase
      .from("outreach_prospects")
      .insert({
        prospect_name: formData.prospect_name,
        status: addToColumn || "interested",
        notes: formData.notes || null,
        contact_email: formData.contact_email || null,
        contact_phone: null,
        source: null,
        last_contact_date: null,
        next_follow_up: null,
      });

    if (error) {
      toast.error("Failed to add prospect");
    } else {
      toast.success("Prospect added");
      fetchProspects();
      resetForm();
    }
  };

  const handleStatusChange = async (prospectId: string, newStatus: string) => {
    const { error } = await supabase
      .from("outreach_prospects")
      .update({ status: newStatus })
      .eq("id", prospectId);

    if (!error) {
      setProspects(prev => prev.map(p => p.id === prospectId ? { ...p, status: newStatus } : p));
      toast.success("Moved to " + COLUMNS.find(c => c.id === newStatus)?.label);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prospect?")) return;
    const { error } = await supabase
      .from("outreach_prospects")
      .delete()
      .eq("id", id);

    if (!error) {
      toast.success("Prospect deleted");
      setProspects(prev => prev.filter(p => p.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ prospect_name: "", notes: "", contact_email: "" });
    setShowAddForm(false);
    setAddToColumn(null);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedId) {
      handleStatusChange(draggedId, columnId);
    }
    setDraggedId(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverColumn(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">{prospects.length} prospects</span>
        <span className="text-accent font-medium">
          {prospects.filter(p => ["hot", "warm", "interested"].includes(p.status)).length} active leads
        </span>
        <span className="text-emerald-500 font-medium">
          {prospects.filter(p => p.status === "converted").length} converted
        </span>
      </div>

      {/* Kanban Board */}
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-4 min-w-max">
          {COLUMNS.map(column => {
            const columnProspects = prospects.filter(p => p.status === column.id);
            const isOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                className={`w-[220px] flex-shrink-0 rounded-lg border transition-all duration-200 ${
                  isOver ? "border-accent shadow-[0_0_15px_hsl(47,100%,51%,0.2)]" : "border-border"
                }`}
                style={{ backgroundColor: column.color }}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
                onDragLeave={() => setDragOverColumn(null)}
              >
                {/* Column Header */}
                <div className="p-2 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{column.emoji}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider">{column.label}</span>
                    <Badge variant="secondary" className="h-5 text-[10px] px-1.5">{columnProspects.length}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => { setAddToColumn(column.id); setShowAddForm(true); }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Cards */}
                <div className="p-1.5 space-y-1.5 min-h-[80px]">
                  {columnProspects.map(prospect => (
                    <div
                      key={prospect.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, prospect.id)}
                      onDragEnd={handleDragEnd}
                      className={`group bg-card rounded-md border border-border/50 p-2 cursor-grab active:cursor-grabbing hover:border-accent/50 transition-all ${
                        draggedId === prospect.id ? "opacity-40" : ""
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{prospect.prospect_name}</p>
                          {prospect.contact_email && (
                            <p className="text-[10px] text-muted-foreground truncate">{prospect.contact_email}</p>
                          )}
                          {prospect.notes && (
                            <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{prospect.notes}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={() => handleDelete(prospect.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Add Prospect Inline Form */}
      {showAddForm && (
        <Card className="border-accent/30">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-accent">
                Adding to {COLUMNS.find(c => c.id === addToColumn)?.emoji} {COLUMNS.find(c => c.id === addToColumn)?.label}
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetForm}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Input
              value={formData.prospect_name}
              onChange={(e) => setFormData({ ...formData, prospect_name: e.target.value })}
              placeholder="Prospect name *"
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Input
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="Email (optional)"
              className="h-8 text-sm"
            />
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes (optional)"
              rows={2}
              className="text-sm"
            />
            <Button onClick={handleSubmit} size="sm" className="w-full">
              <Save className="h-3 w-3 mr-1" /> Add
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
