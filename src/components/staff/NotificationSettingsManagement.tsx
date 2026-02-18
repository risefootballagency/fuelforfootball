import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import {
  Bell, Mail, MessageSquare, Smartphone, Volume2, Save,
  Users, FileText, Upload, TrendingUp, Eye, RefreshCw,
} from "lucide-react";

interface NotificationChannel {
  id: string;
  label: string;
  icon: any;
  enabled: boolean;
}

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  icon: any;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export const NotificationSettingsManagement = () => {
  const [categories, setCategories] = useState<NotificationCategory[]>([
    { id: "new_analysis", label: "New Analysis Reports", description: "When a performance report is created", icon: FileText, email: true, push: true, inApp: true },
    { id: "player_update", label: "Player Updates", description: "Status changes and profile updates", icon: Users, email: true, push: false, inApp: true },
    { id: "form_submission", label: "Form Submissions", description: "New enquiries from the website", icon: Mail, email: true, push: true, inApp: true },
    { id: "site_visitor", label: "Site Visitors", description: "Notable visitor activity", icon: Eye, email: false, push: false, inApp: true },
    { id: "clip_upload", label: "Clip Uploads", description: "New video clips added by players", icon: Upload, email: false, push: true, inApp: true },
    { id: "invoice_overdue", label: "Invoice Overdue", description: "When invoices pass their due date", icon: TrendingUp, email: true, push: false, inApp: true },
    { id: "transfer_update", label: "Transfer Updates", description: "Club outreach status changes", icon: Users, email: true, push: true, inApp: true },
  ]);

  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");
  const [digestFrequency, setDigestFrequency] = useState("instant");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("coaching_analysis")
      .select("*")
      .eq("analysis_type", "notification_settings")
      .limit(1)
      .maybeSingle();

    if (data) {
      const meta = data.attachments as any || {};
      if (meta.categories) setCategories(meta.categories);
      if (meta.quietHoursEnabled !== undefined) setQuietHoursEnabled(meta.quietHoursEnabled);
      if (meta.quietStart) setQuietStart(meta.quietStart);
      if (meta.quietEnd) setQuietEnd(meta.quietEnd);
      if (meta.digestFrequency) setDigestFrequency(meta.digestFrequency);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const meta = { categories, quietHoursEnabled, quietStart, quietEnd, digestFrequency };

    const { data: existing } = await supabase
      .from("coaching_analysis")
      .select("id")
      .eq("analysis_type", "notification_settings")
      .limit(1)
      .maybeSingle();

    if (existing) {
      await supabase.from("coaching_analysis").update({ attachments: meta as any }).eq("id", existing.id);
    } else {
      await supabase.from("coaching_analysis").insert({
        title: "Notification Settings",
        analysis_type: "notification_settings",
        attachments: meta as any,
      });
    }
    toast.success("Settings saved");
    setSaving(false);
  };

  const toggleChannel = (catId: string, channel: "email" | "push" | "inApp") => {
    setCategories(prev => prev.map(c =>
      c.id === catId ? { ...c, [channel]: !c[channel] } : c
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Notification Settings</h2>
            <p className="text-sm text-muted-foreground">Configure how and when you receive notifications</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm">
          <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Delivery Preferences */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <h3 className="text-sm font-semibold">Delivery Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Email Digest Frequency</Label>
              <Select value={digestFrequency} onValueChange={setDigestFrequency}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Quiet Hours</Label>
                <Switch checked={quietHoursEnabled} onCheckedChange={setQuietHoursEnabled} />
              </div>
              {quietHoursEnabled && (
                <div className="flex items-center gap-2">
                  <Input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)} className="h-9 text-xs" />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)} className="h-9 text-xs" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category-specific settings */}
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr,60px,60px,60px] gap-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Category</span>
          <span className="text-center">Email</span>
          <span className="text-center">Push</span>
          <span className="text-center">In-App</span>
        </div>
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="grid grid-cols-[1fr,60px,60px,60px] gap-2 items-center p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{cat.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{cat.description}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Switch checked={cat.email} onCheckedChange={() => toggleChannel(cat.id, "email")} />
              </div>
              <div className="flex justify-center">
                <Switch checked={cat.push} onCheckedChange={() => toggleChannel(cat.id, "push")} />
              </div>
              <div className="flex justify-center">
                <Switch checked={cat.inApp} onCheckedChange={() => toggleChannel(cat.id, "inApp")} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
