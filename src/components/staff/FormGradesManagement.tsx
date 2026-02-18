import { useState, useEffect } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash2, GraduationCap, Search } from "lucide-react";

interface FormGradeConfig {
  id: string;
  position: string;
  grade: string;
  criteria: string;
  description: string | null;
  created_at: string;
}

const POSITIONS = [
  'Goalkeeper', 'Centre-Back', 'Full-Back', 'Central Defensive-Midfielder',
  'Central Midfielder', 'Attacking Midfielder', 'Winger', 'Centre-Forward'
];

const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

export const FormGradesManagement = () => {
  const [configs, setConfigs] = useState<FormGradeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<FormGradeConfig | null>(null);
  const [formData, setFormData] = useState({ position: "", grade: "", criteria: "", description: "" });

  const fetchConfigs = async () => {
    setLoading(true);
    const { data, error } = await sharedSupabase
      .from("form_grade_configs" as any)
      .select("*")
      .order("position")
      .order("grade");
    if (!error && data) setConfigs(data as any[]);
    setLoading(false);
  };

  useEffect(() => { fetchConfigs(); }, []);

  const handleSave = async () => {
    if (!formData.position || !formData.grade || !formData.criteria) {
      toast.error("Position, grade, and criteria are required");
      return;
    }
    if (editing) {
      const { error } = await sharedSupabase
        .from("form_grade_configs" as any)
        .update({ position: formData.position, grade: formData.grade, criteria: formData.criteria, description: formData.description || null })
        .eq("id", editing.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Updated");
    } else {
      const { error } = await sharedSupabase
        .from("form_grade_configs" as any)
        .insert({ position: formData.position, grade: formData.grade, criteria: formData.criteria, description: formData.description || null });
      if (error) { toast.error("Failed to create"); return; }
      toast.success("Added");
    }
    setShowDialog(false);
    setEditing(null);
    setFormData({ position: "", grade: "", criteria: "", description: "" });
    fetchConfigs();
  };

  const handleDelete = async (id: string) => {
    const { error } = await sharedSupabase.from("form_grade_configs" as any).delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Deleted");
    fetchConfigs();
  };

  const filtered = configs.filter(c => {
    const matchesSearch = c.criteria.toLowerCase().includes(search.toLowerCase()) || c.position.toLowerCase().includes(search.toLowerCase());
    const matchesPosition = positionFilter === "all" || c.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  // Group by position
  const grouped = filtered.reduce((acc, c) => {
    if (!acc[c.position]) acc[c.position] = [];
    acc[c.position].push(c);
    return acc;
  }, {} as Record<string, FormGradeConfig[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-gold" />
          <h3 className="font-bebas text-lg text-gold">Form Grade Criteria</h3>
          <span className="text-xs text-muted-foreground">({configs.length})</span>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setFormData({ position: "", grade: "", criteria: "", description: "" }); setShowDialog(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add Criteria
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All positions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {POSITIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-center py-8 text-muted-foreground">Loading...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No grade criteria found. Add some to define form grading standards.</p>
      ) : (
        Object.entries(grouped).map(([position, items]) => (
          <Card key={position}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{position}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-start justify-between p-2 rounded bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-gold/20 text-gold">{item.grade}</span>
                      <span className="text-sm font-medium">{item.criteria}</span>
                    </div>
                    {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                      setEditing(item);
                      setFormData({ position: item.position, grade: item.grade, criteria: item.criteria, description: item.description || "" });
                      setShowDialog(true);
                    }}><Edit className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Grade Criteria</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Position</Label>
              <Select value={formData.position} onValueChange={v => setFormData(p => ({ ...p, position: v }))}>
                <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                <SelectContent>{POSITIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Grade</Label>
              <Select value={formData.grade} onValueChange={v => setFormData(p => ({ ...p, grade: v }))}>
                <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                <SelectContent>{GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Criteria</Label><Input value={formData.criteria} onChange={e => setFormData(p => ({ ...p, criteria: e.target.value }))} /></div>
            <div><Label>Description (optional)</Label><Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} /></div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
