import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Save, Edit2, X, Eye, EyeOff, Radio, Video, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Stream {
  id: string;
  title: string;
  description: string | null;
  stream_url: string | null;
  thumbnail_url: string | null;
  platform: string | null;
  stream_type: string | null;
  scheduled_at: string | null;
  is_live: boolean | null;
  is_visible: boolean | null;
  display_order: number | null;
  tags: string[] | null;
}

const emptyStream = {
  title: "",
  description: null as string | null,
  stream_url: null as string | null,
  thumbnail_url: null as string | null,
  platform: "youtube",
  stream_type: "recorded",
  scheduled_at: null as string | null,
  is_live: false,
  is_visible: true,
  display_order: 0,
  tags: [] as string[],
};

export const StreamsManagement = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyStream);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => { fetchStreams(); }, []);

  const fetchStreams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("streams")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      toast.error("Failed to load streams");
    } else {
      setStreams(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase.from("streams").update(form).eq("id", editingId);
        if (error) throw error;
        toast.success("Stream updated");
      } else {
        const { error } = await supabase.from("streams").insert({ ...form, display_order: streams.length });
        if (error) throw error;
        toast.success("Stream added");
      }
      setEditingId(null);
      setIsAdding(false);
      setForm(emptyStream);
      fetchStreams();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this stream?")) return;
    const { error } = await supabase.from("streams").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Stream deleted"); fetchStreams(); }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from("streams").update({ is_visible: !current }).eq("id", id);
    fetchStreams();
  };

  const toggleLive = async (id: string, current: boolean) => {
    await supabase.from("streams").update({ is_live: !current }).eq("id", id);
    fetchStreams();
  };

  const startEdit = (s: Stream) => {
    setEditingId(s.id);
    setIsAdding(false);
    setForm({
      title: s.title,
      description: s.description,
      stream_url: s.stream_url,
      thumbnail_url: s.thumbnail_url,
      platform: s.platform || "youtube",
      stream_type: s.stream_type || "recorded",
      scheduled_at: s.scheduled_at,
      is_live: s.is_live ?? false,
      is_visible: s.is_visible ?? true,
      display_order: s.display_order ?? 0,
      tags: s.tags || [],
    });
  };

  const cancel = () => { setEditingId(null); setIsAdding(false); setForm(emptyStream); };

  const addTag = () => {
    if (tagInput.trim()) {
      setForm({ ...form, tags: [...(form.tags || []), tagInput.trim()] });
      setTagInput("");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><div className="animate-pulse text-primary font-bebas text-xl">Loading streams...</div></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bebas text-2xl text-foreground tracking-wider flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          Streams
        </h2>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); setForm(emptyStream); }} disabled={isAdding} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> Add Stream
        </Button>
      </div>

      {/* Editor */}
      {(isAdding || editingId) && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-lg text-primary">{isAdding ? "New Stream" : "Edit Stream"}</h3>
              <Button variant="ghost" size="sm" onClick={cancel}><X className="w-4 h-4" /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Stream title" />
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={form.platform || "youtube"} onValueChange={(v) => setForm({ ...form, platform: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="twitch">Twitch</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                    <SelectItem value="instagram">Instagram Live</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Stream URL</Label>
              <Input value={form.stream_url || ""} onChange={(e) => setForm({ ...form, stream_url: e.target.value })} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's this stream about?" rows={2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.stream_type || "recorded"} onValueChange={(v) => setForm({ ...form, stream_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recorded">Recorded</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Scheduled Date/Time</Label>
                <Input type="datetime-local" value={form.scheduled_at?.slice(0, 16) || ""} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
                <Button type="button" onClick={addTag} size="sm"><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.tags || []).map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                    {tag}
                    <button onClick={() => setForm({ ...form, tags: form.tags!.filter((_, idx) => idx !== i) })}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_visible ?? true} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} />
                <Label className="text-sm">Visible</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_live ?? false} onCheckedChange={(v) => setForm({ ...form, is_live: v })} />
                <Label className="text-sm">Live Now</Label>
              </div>
              <div className="flex-1" />
              <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-2">
        {streams.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No streams yet.</div>
        ) : streams.map((s) => (
          <div key={s.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${editingId === s.id ? "bg-primary/10 border-primary" : "bg-card border-border hover:border-primary/50"}`}>
            {s.is_live && <Radio className="w-4 h-4 text-red-500 animate-pulse flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bebas text-base text-foreground truncate">{s.title}</h4>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s.platform}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{s.description || "No description"}</p>
            </div>
            <div className="flex items-center gap-1">
              {s.stream_url && (
                <Button variant="ghost" size="sm" onClick={() => window.open(s.stream_url!, "_blank")}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => toggleLive(s.id, s.is_live ?? false)} className={s.is_live ? "text-red-500" : "text-muted-foreground"}>
                <Radio className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toggleVisibility(s.id, s.is_visible ?? true)} className={s.is_visible ? "text-green-500" : "text-muted-foreground"}>
                {s.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => startEdit(s)}><Edit2 className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamsManagement;
