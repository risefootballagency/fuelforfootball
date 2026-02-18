import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquare, Plus, Trash2, Edit, Clock, User, Save, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface Request {
  id: string;
  title: string;
  description: string;
  requester: string;
  status: string;
  priority: string;
  type: string;
  created_at: string;
}

export const RequestsManagement = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Request | null>(null);
  const [filter, setFilter] = useState("all");

  // Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requester, setRequester] = useState("");
  const [priority, setPriority] = useState("medium");
  const [type, setType] = useState("general");

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    const { data } = await supabase
      .from("coaching_analysis")
      .select("*")
      .eq("analysis_type", "request")
      .order("created_at", { ascending: false });
    if (data) {
      setRequests(data.map((d: any) => {
        const meta = d.attachments as any || {};
        return {
          id: d.id, title: d.title, description: d.content || "",
          requester: meta.requester || "", status: meta.status || "pending",
          priority: meta.priority || "medium", type: meta.type || "general",
          created_at: d.created_at,
        };
      }));
    }
  };

  const resetForm = () => { setTitle(""); setDescription(""); setRequester(""); setPriority("medium"); setType("general"); };

  const handleSave = async () => {
    if (!title) { toast.error("Title required"); return; }
    const meta = { requester, status: editing?.status || "pending", priority, type };
    if (editing) {
      await supabase.from("coaching_analysis").update({ title, content: description, attachments: meta as any }).eq("id", editing.id);
      toast.success("Updated");
    } else {
      await supabase.from("coaching_analysis").insert({ title, content: description, analysis_type: "request", attachments: meta as any });
      toast.success("Request created");
    }
    setShowAdd(false); setEditing(null); resetForm(); loadRequests();
  };

  const updateStatus = async (r: Request, status: string) => {
    const meta = { requester: r.requester, status, priority: r.priority, type: r.type };
    await supabase.from("coaching_analysis").update({ attachments: meta as any }).eq("id", r.id);
    loadRequests();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("coaching_analysis").delete().eq("id", id);
    toast.success("Deleted"); loadRequests();
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  const priorityColor = (p: string) => {
    if (p === "high") return "text-destructive";
    if (p === "medium") return "text-yellow-500";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Requests</h2>
            <p className="text-sm text-muted-foreground">{requests.length} request{requests.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => { resetForm(); setEditing(null); setShowAdd(true); }}>
            <Plus className="w-4 h-4 mr-1" /> New
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No requests</CardContent></Card>
      ) : (
        <div className="grid gap-2">
          {filtered.map(r => (
            <Card key={r.id} className="hover:bg-muted/20 transition-colors">
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{r.title}</h3>
                      <Badge variant="outline" className="text-[9px]">{r.type}</Badge>
                      <Badge variant="secondary" className={`text-[9px] ${priorityColor(r.priority)}`}>{r.priority}</Badge>
                    </div>
                    {r.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.description}</p>}
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      {r.requester && <span className="flex items-center gap-0.5"><User className="w-2.5 h-2.5" />{r.requester}</span>}
                      <span>{format(new Date(r.created_at), "dd MMM yy")}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Select value={r.status} onValueChange={v => updateStatus(r, v)}>
                      <SelectTrigger className="h-7 w-24 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => {
                      setEditing(r); setTitle(r.title); setDescription(r.description);
                      setRequester(r.requester); setPriority(r.priority); setType(r.type); setShowAdd(true);
                    }}><Edit className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={o => { setShowAdd(o); if (!o) { setEditing(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} Request</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title *</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Requester</Label><Input value={requester} onChange={e => setRequester(e.target.value)} /></div>
              <div><Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Type</Label>
                <Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="general">General</SelectItem><SelectItem value="transfer">Transfer</SelectItem><SelectItem value="player">Player</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSave} className="w-full"><Save className="w-4 h-4 mr-1" />{editing ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
