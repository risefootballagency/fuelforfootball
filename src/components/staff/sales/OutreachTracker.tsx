import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, UserPlus, ChevronDown, ChevronUp, X, Save, Loader2 } from "lucide-react";

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

const INTEREST_LEVELS = [
  { value: "hot", label: "🔥 Hot", color: "destructive" },
  { value: "warm", label: "🌡️ Warm", color: "default" },
  { value: "interested", label: "👀 Interested", color: "secondary" },
  { value: "lukewarm", label: "🤔 Lukewarm", color: "outline" },
  { value: "cold", label: "❄️ Cold", color: "outline" },
  { value: "converted", label: "✅ Converted", color: "default" },
  { value: "lost", label: "❌ Lost", color: "destructive" },
];

export function OutreachTracker() {
  const [prospects, setProspects] = useState<OutreachProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedProspect, setExpandedProspect] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    prospect_name: "",
    status: "interested",
    notes: "",
  });

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
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
  };

  const handleSubmit = async () => {
    if (!formData.prospect_name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    const payload = {
      prospect_name: formData.prospect_name,
      status: formData.status,
      notes: formData.notes || null,
      contact_email: null,
      contact_phone: null,
      source: null,
      last_contact_date: null,
      next_follow_up: null,
    };

    const { error } = await supabase
      .from("outreach_prospects")
      .insert(payload);

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
      toast.success("Status updated");
    }
  };

  const handleNotesChange = async (prospectId: string, notes: string) => {
    const { error } = await supabase
      .from("outreach_prospects")
      .update({ notes })
      .eq("id", prospectId);

    if (!error) {
      setProspects(prev => prev.map(p => p.id === prospectId ? { ...p, notes } : p));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prospect?")) return;
    
    const { error } = await supabase
      .from("outreach_prospects")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete prospect");
    } else {
      toast.success("Prospect deleted");
      fetchProspects();
    }
  };

  const resetForm = () => {
    setFormData({
      prospect_name: "",
      status: "interested",
      notes: "",
    });
    setShowAddForm(false);
  };

  const getStatusBadge = (status: string) => {
    const option = INTEREST_LEVELS.find(o => o.value === status);
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      default: "default",
      secondary: "secondary",
      destructive: "destructive",
      outline: "outline",
    };
    return <Badge variant={variants[option?.color || "outline"]}>{option?.label || status}</Badge>;
  };

  // Group prospects by interest level
  const groupedProspects = INTEREST_LEVELS.reduce((acc, level) => {
    acc[level.value] = prospects.filter(p => p.status === level.value);
    return acc;
  }, {} as Record<string, OutreachProspect[]>);

  const hotWarmCount = prospects.filter(p => ["hot", "warm", "interested"].includes(p.status)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <div>
                <p className="text-lg font-bold">{hotWarmCount}</p>
                <p className="text-xs text-muted-foreground">Hot/Warm Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-lg font-bold">{prospects.length}</p>
                <p className="text-xs text-muted-foreground">Total Prospects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Form - Inline */}
      {!showAddForm ? (
        <Button onClick={() => setShowAddForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Prospect
        </Button>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Add Prospect</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.prospect_name}
                onChange={(e) => setFormData({ ...formData, prospect_name: e.target.value })}
                placeholder="Enter prospect name"
              />
            </div>

            <div>
              <Label>Interest Level</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INTEREST_LEVELS.filter(l => l.value !== "converted" && l.value !== "lost").map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any notes..."
                rows={2}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              <Save className="h-4 w-4 mr-2" /> Add Prospect
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Prospects List - Grouped by Interest */}
      <div className="space-y-3">
        {prospects.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No prospects yet</p>
            </CardContent>
          </Card>
        ) : (
          prospects.map((prospect) => (
            <Collapsible 
              key={prospect.id}
              open={expandedProspect === prospect.id}
              onOpenChange={(open) => setExpandedProspect(open ? prospect.id : null)}
            >
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <CollapsibleTrigger className="flex-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{prospect.prospect_name}</p>
                        {getStatusBadge(prospect.status)}
                        {expandedProspect === prospect.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(prospect.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <CollapsibleContent className="mt-3 pt-3 border-t space-y-3">
                    {/* Quick Status Change */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Interest Level</Label>
                      <Select value={prospect.status} onValueChange={(v) => handleStatusChange(prospect.id, v)}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {INTEREST_LEVELS.map(level => (
                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Notes */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Notes</Label>
                      <Textarea
                        value={prospect.notes || ""}
                        onChange={(e) => handleNotesChange(prospect.id, e.target.value)}
                        placeholder="Add notes..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
}
