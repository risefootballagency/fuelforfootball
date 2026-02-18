import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users, Plus, Trash2, Edit, Calendar, Clock, CheckCircle2,
  CircleDot, Video, FileText, Save,
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  attendees: string[];
  agenda: string[];
  notes: string;
  action_items: { text: string; done: boolean }[];
  meet_link: string;
}

export const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [attendees, setAttendees] = useState("");
  const [agenda, setAgenda] = useState("");
  const [notes, setNotes] = useState("");
  const [meetLink, setMeetLink] = useState("");

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    const { data } = await supabase
      .from("coaching_analysis")
      .select("*")
      .eq("analysis_type", "meeting")
      .order("created_at", { ascending: false });

    if (data) {
      setMeetings(data.map((d: any) => {
        const meta = d.attachments as any || {};
        return {
          id: d.id,
          title: d.title,
          description: d.description || "",
          date: meta.date || "",
          time: meta.time || "",
          duration: meta.duration || 60,
          status: meta.status || "scheduled",
          attendees: meta.attendees || [],
          agenda: meta.agenda || [],
          notes: d.content || "",
          action_items: meta.action_items || [],
          meet_link: meta.meet_link || "",
        };
      }));
    }
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setDate(""); setTime(""); 
    setDuration(60); setAttendees(""); setAgenda(""); setNotes(""); setMeetLink("");
  };

  const openEdit = (m: Meeting) => {
    setEditingMeeting(m);
    setTitle(m.title);
    setDescription(m.description);
    setDate(m.date);
    setTime(m.time);
    setDuration(m.duration);
    setAttendees(m.attendees.join(", "));
    setAgenda(m.agenda.join("\n"));
    setNotes(m.notes);
    setMeetLink(m.meet_link);
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!title) { toast.error("Title required"); return; }

    const meta = {
      date,
      time,
      duration,
      status: editingMeeting?.status || "scheduled",
      attendees: attendees.split(",").map(a => a.trim()).filter(Boolean),
      agenda: agenda.split("\n").map(a => a.trim()).filter(Boolean),
      action_items: editingMeeting?.action_items || [],
      meet_link: meetLink,
    };

    if (editingMeeting) {
      const { error } = await supabase
        .from("coaching_analysis")
        .update({
          title,
          description,
          content: notes,
          attachments: meta as any,
        })
        .eq("id", editingMeeting.id);
      if (error) { toast.error("Update failed"); return; }
      toast.success("Meeting updated");
    } else {
      const { error } = await supabase
        .from("coaching_analysis")
        .insert({
          title,
          description,
          analysis_type: "meeting",
          content: notes,
          attachments: meta as any,
        });
      if (error) { toast.error("Create failed"); return; }
      toast.success("Meeting created");
    }

    setShowAdd(false);
    setEditingMeeting(null);
    resetForm();
    loadMeetings();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("coaching_analysis").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Meeting deleted"); loadMeetings(); }
  };

  const updateStatus = async (m: Meeting, status: string) => {
    const meta = {
      date: m.date, time: m.time, duration: m.duration, status,
      attendees: m.attendees, agenda: m.agenda, action_items: m.action_items, meet_link: m.meet_link,
    };
    await supabase.from("coaching_analysis").update({ attachments: meta as any }).eq("id", m.id);
    loadMeetings();
  };

  const toggleActionItem = async (m: Meeting, idx: number) => {
    const items = [...m.action_items];
    items[idx] = { ...items[idx], done: !items[idx].done };
    const meta = {
      date: m.date, time: m.time, duration: m.duration, status: m.status,
      attendees: m.attendees, agenda: m.agenda, action_items: items, meet_link: m.meet_link,
    };
    await supabase.from("coaching_analysis").update({ attachments: meta as any }).eq("id", m.id);
    loadMeetings();
  };

  const filtered = filter === "all" ? meetings : meetings.filter(m => m.status === filter);

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle2 className="w-3 h-3 text-green-500" />;
    if (s === "in_progress") return <CircleDot className="w-3 h-3 text-yellow-500" />;
    if (s === "cancelled") return <CircleDot className="w-3 h-3 text-destructive" />;
    return <Clock className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Meetings</h2>
            <p className="text-sm text-muted-foreground">{meetings.length} meeting{meetings.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => { resetForm(); setEditingMeeting(null); setShowAdd(true); }} size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Meeting
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No meetings</p>
            <p className="text-sm">Create a meeting to schedule and track agendas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(m => (
            <Card key={m.id} className="hover:bg-muted/20 transition-colors">
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {statusIcon(m.status)}
                      <h3 className="font-medium text-sm">{m.title}</h3>
                    </div>
                    {m.description && <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>}
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {m.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{m.date}</span>}
                      {m.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{m.time}</span>}
                      {m.duration && <span>{m.duration}min</span>}
                      {m.attendees.length > 0 && <span>{m.attendees.length} attendee{m.attendees.length !== 1 ? "s" : ""}</span>}
                    </div>
                    {m.agenda.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {m.agenda.slice(0, 3).map((a, i) => (
                          <Badge key={i} variant="outline" className="text-[9px]">{a}</Badge>
                        ))}
                        {m.agenda.length > 3 && <Badge variant="outline" className="text-[9px]">+{m.agenda.length - 3}</Badge>}
                      </div>
                    )}
                    {m.action_items.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {m.action_items.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 cursor-pointer" onClick={() => toggleActionItem(m, i)}>
                            <CheckCircle2 className={`w-3 h-3 ${item.done ? "text-green-500" : "text-muted-foreground"}`} />
                            <span className={`text-[10px] ${item.done ? "line-through text-muted-foreground" : ""}`}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {m.meet_link && (
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => window.open(m.meet_link, "_blank")}>
                        <Video className="w-3.5 h-3.5 text-primary" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(m)}>
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Select value={m.status} onValueChange={(v) => updateStatus(m, v)}>
                      <SelectTrigger className="h-7 w-7 p-0 border-0 [&>svg]:hidden">
                        <CircleDot className="w-3.5 h-3.5" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAdd} onOpenChange={(o) => { setShowAdd(o); if (!o) { setEditingMeeting(null); resetForm(); } }}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMeeting ? "Edit Meeting" : "New Meeting"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title *</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Team review" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Weekly review..." />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Date</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
              </div>
              <div>
                <Label>Duration (min)</Label>
                <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} />
              </div>
            </div>
            <div>
              <Label>Attendees (comma-separated)</Label>
              <Input value={attendees} onChange={e => setAttendees(e.target.value)} placeholder="John, Sarah, Mike" />
            </div>
            <div>
              <Label>Agenda (one per line)</Label>
              <Textarea value={agenda} onChange={e => setAgenda(e.target.value)} placeholder="Review last match&#10;Discuss tactics&#10;Assign actions" rows={3} />
            </div>
            <div>
              <Label>Meeting Link</Label>
              <Input value={meetLink} onChange={e => setMeetLink(e.target.value)} placeholder="https://meet.google.com/..." />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Meeting notes..." rows={3} />
            </div>
            <Button onClick={handleSave} className="w-full">
              <Save className="w-4 h-4 mr-1" /> {editingMeeting ? "Update" : "Create"} Meeting
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
