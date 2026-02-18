import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import {
  MessageSquare, Send, Users, Clock, Search,
  CheckCircle2, Plus, Trash2, Save, RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

interface SMSTemplate {
  id: string;
  name: string;
  message: string;
}

interface SentMessage {
  id: string;
  recipients: string[];
  message: string;
  sent_at: string;
  status: string;
}

interface StaffSMSNotificationsProps {
  userEmail?: string;
}

export const StaffSMSNotifications = ({ userEmail }: StaffSMSNotificationsProps) => {
  const isAuthorised = userEmail === 'jolonlevene98@gmail.com';
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);
  const [tab, setTab] = useState<"compose" | "history" | "templates">("compose");
  const [templateName, setTemplateName] = useState("");
  const [templateMessage, setTemplateMessage] = useState("");

  useEffect(() => {
    if (isAuthorised) {
      loadPlayers();
      loadTemplates();
      loadHistory();
    }
  }, [isAuthorised]);

  const loadPlayers = async () => {
    const { data } = await supabase
      .from("players" as any)
      .select("id, name, phone, email")
      .order("name");
    if (data) setPlayers(data);
  };

  const loadTemplates = async () => {
    const { data } = await supabase
      .from("coaching_analysis" as any)
      .select("*")
      .eq("analysis_type", "sms_template")
      .order("created_at", { ascending: false });
    if (data) {
      setTemplates(data.map((d: any) => ({
        id: d.id,
        name: d.title,
        message: d.content || "",
      })));
    }
  };

  const loadHistory = async () => {
    const { data } = await supabase
      .from("coaching_analysis" as any)
      .select("*")
      .eq("analysis_type", "sms_sent")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) {
      setSentMessages(data.map((d: any) => {
        const meta = d.attachments as any || {};
        return {
          id: d.id,
          recipients: meta.recipients || [],
          message: d.content || "",
          sent_at: d.created_at,
          status: meta.status || "sent",
        };
      }));
    }
  };

  if (!isAuthorised) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">SMS Notifications</p>
        <p className="text-sm">You do not have permission to access SMS notifications</p>
      </div>
    );
  }

  const togglePlayer = (playerId: string) => {
    setSelectedPlayers(prev =>
      prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
    );
  };

  const selectAll = () => {
    const filtered = filteredPlayers;
    if (selectedPlayers.length === filtered.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(filtered.map(p => p.id));
    }
  };

  const filteredPlayers = players.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.phone?.includes(q);
  });

  const handleSend = async () => {
    if (selectedPlayers.length === 0) { toast.error("Select recipients"); return; }
    if (!message.trim()) { toast.error("Enter a message"); return; }

    const recipientNames = selectedPlayers.map(id => {
      const p = players.find(pl => pl.id === id);
      return p?.name || id;
    });

    // Log the sent message
    await supabase.from("coaching_analysis" as any).insert({
      title: `SMS to ${recipientNames.length} recipient(s)`,
      analysis_type: "sms_sent",
      content: message,
      attachments: { recipients: recipientNames, status: "queued" } as any,
    });

    toast.success(`Message queued for ${selectedPlayers.length} recipient(s)`);
    setMessage("");
    setSelectedPlayers([]);
    loadHistory();
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !templateMessage) { toast.error("Name and message required"); return; }
    await supabase.from("coaching_analysis" as any).insert({
      title: templateName,
      analysis_type: "sms_template",
      content: templateMessage,
    });
    toast.success("Template saved");
    setTemplateName("");
    setTemplateMessage("");
    loadTemplates();
  };

  const handleDeleteTemplate = async (id: string) => {
    await supabase.from("coaching_analysis" as any).delete().eq("id", id);
    toast.success("Template deleted");
    loadTemplates();
  };

  const useTemplate = (template: SMSTemplate) => {
    setMessage(template.message);
    setTab("compose");
    toast.info(`Template "${template.name}" loaded`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">SMS Notifications</h2>
            <p className="text-sm text-muted-foreground">Send messages to players and contacts</p>
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1">
        {(["compose", "templates", "history"] as const).map(t => (
          <Button key={t} variant={tab === t ? "default" : "outline"} size="sm" onClick={() => setTab(t)} className="capitalize">
            {t === "compose" && <Send className="w-3.5 h-3.5 mr-1" />}
            {t === "templates" && <Save className="w-3.5 h-3.5 mr-1" />}
            {t === "history" && <Clock className="w-3.5 h-3.5 mr-1" />}
            {t}
          </Button>
        ))}
      </div>

      {tab === "compose" && (
        <div className="space-y-4">
          {/* Recipients */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Recipients ({selectedPlayers.length})</Label>
              <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs h-7">
                {selectedPlayers.length === filteredPlayers.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players..." className="pl-9" />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
              {filteredPlayers.map(p => (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    selectedPlayers.includes(p.id) ? "bg-primary/10" : "hover:bg-muted/30"
                  }`}
                  onClick={() => togglePlayer(p.id)}
                >
                  <Checkbox checked={selectedPlayers.includes(p.id)} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.phone || p.email || "No contact"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Message</Label>
              <span className="text-[10px] text-muted-foreground">{message.length}/160 chars</span>
            </div>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              maxLength={480}
            />
          </div>

          <Button onClick={handleSend} className="w-full" disabled={selectedPlayers.length === 0 || !message.trim()}>
            <Send className="w-4 h-4 mr-1" /> Send to {selectedPlayers.length} Recipient{selectedPlayers.length !== 1 ? "s" : ""}
          </Button>
        </div>
      )}

      {tab === "templates" && (
        <div className="space-y-4">
          {/* Create template */}
          <Card>
            <CardContent className="pt-4 space-y-3">
              <h3 className="text-sm font-semibold">New Template</h3>
              <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name" />
              <Textarea value={templateMessage} onChange={e => setTemplateMessage(e.target.value)} placeholder="Message content..." rows={3} />
              <Button onClick={handleSaveTemplate} size="sm" className="w-full">
                <Save className="w-4 h-4 mr-1" /> Save Template
              </Button>
            </CardContent>
          </Card>

          {/* Template list */}
          {templates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No templates yet</p>
          ) : (
            <div className="grid gap-2">
              {templates.map(t => (
                <Card key={t.id} className="hover:bg-muted/20 transition-colors">
                  <CardContent className="py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium">{t.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t.message}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => useTemplate(t)}>
                          <Send className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDeleteTemplate(t.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-2">
          {sentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No messages sent yet</p>
          ) : (
            sentMessages.map(msg => (
              <Card key={msg.id} className="hover:bg-muted/20 transition-colors">
                <CardContent className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        <span className="text-sm font-medium">{msg.recipients.length} recipient{msg.recipients.length !== 1 ? "s" : ""}</span>
                        <Badge variant="outline" className="text-[9px]">{msg.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{msg.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {format(new Date(msg.sent_at), "dd MMM yyyy HH:mm")}
                        {" • "}
                        {msg.recipients.slice(0, 3).join(", ")}
                        {msg.recipients.length > 3 ? ` +${msg.recipients.length - 3} more` : ""}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
