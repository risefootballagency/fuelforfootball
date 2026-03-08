import { useState, useEffect } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { t } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";

interface InjuryLogProps {
  playerId: string;
  readOnly?: boolean;
}

interface InjuryEntry {
  id: string;
  player_id: string;
  date: string;
  body_area: string;
  description: string | null;
  severity: string;
  status: string;
  created_at: string;
}

const BODY_AREAS = [
  "Head", "Neck", "Shoulder", "Upper Back", "Lower Back", "Chest",
  "Upper Arm", "Elbow", "Forearm", "Wrist", "Hand",
  "Hip", "Groin", "Quadriceps", "Hamstring", "Knee",
  "Calf", "Shin", "Ankle", "Foot", "Achilles"
];

const SEVERITY_COLOURS: Record<string, string> = {
  minor: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  moderate: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  severe: "bg-red-500/10 text-red-600 border-red-500/30",
};

export const InjuryLog = ({ playerId, readOnly = false }: InjuryLogProps) => {
  const lang = usePortalLanguage();
  const [entries, setEntries] = useState<InjuryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newDate, setNewDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [newBodyArea, setNewBodyArea] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSeverity, setNewSeverity] = useState("minor");

  useEffect(() => {
    if (!playerId) return;
    fetchEntries();
  }, [playerId]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await sharedSupabase
        .from("player_injury_log" as any)
        .select("*")
        .eq("player_id", playerId)
        .order("date", { ascending: false });

      if (!error && data) setEntries(data as any);
    } catch {
      // Table may not exist yet
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newBodyArea) return;
    setSaving(true);

    try {
      const { data, error } = await sharedSupabase
        .from("player_injury_log" as any)
        .insert({
          player_id: playerId,
          date: newDate,
          body_area: newBodyArea,
          description: newDescription || null,
          severity: newSeverity,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        toast.error("Failed to add entry");
      } else if (data) {
        setEntries(prev => [data as any, ...prev]);
        setShowForm(false);
        setNewBodyArea("");
        setNewDescription("");
        setNewSeverity("minor");
        toast.success(t(lang, "injury_logged"));
      }
    } catch {
      toast.error("Injury log table not available yet");
    }
    setSaving(false);
  };

  const handleRecover = async (id: string) => {
    const { error } = await sharedSupabase
      .from("player_injury_log" as any)
      .update({ status: "recovered" })
      .eq("id", id);

    if (!error) {
      setEntries(prev => prev.map(e => e.id === id ? { ...e, status: "recovered" } : e));
      toast.success(t(lang, "marked_as_recovered"));
    }
  };

  const activeEntries = entries.filter(e => e.status === "active");
  const recoveredEntries = entries.filter(e => e.status === "recovered");

  if (loading) {
    return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">{t(lang, "injury_log")}</h4>
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" />
            {t(lang, "log_injury")}
          </Button>
        </div>
      )}

      {readOnly && <h4 className="font-semibold text-sm">{t(lang, "injury_log")}</h4>}

      {showForm && !readOnly && (
        <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
            <Select value={newBodyArea} onValueChange={setNewBodyArea}>
              <SelectTrigger><SelectValue placeholder={t(lang, "body_area")} /></SelectTrigger>
              <SelectContent>
                {BODY_AREAS.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={newSeverity} onValueChange={setNewSeverity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">{t(lang, "minor")}</SelectItem>
                <SelectItem value="moderate">{t(lang, "moderate")}</SelectItem>
                <SelectItem value="severe">{t(lang, "severe")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder={t(lang, "describe_injury")}
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            className="resize-none"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>{t(lang, "cancel")}</Button>
            <Button size="sm" onClick={handleAdd} disabled={!newBodyArea || saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {t(lang, "save")}
            </Button>
          </div>
        </div>
      )}

      {activeEntries.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t(lang, "active")}</p>
          {activeEntries.map(entry => (
            <div key={entry.id} className="flex items-start justify-between p-3 rounded-lg border bg-card">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-sm">{entry.body_area}</span>
                  <Badge variant="outline" className={`text-xs ${SEVERITY_COLOURS[entry.severity] || ''}`}>
                    {t(lang, entry.severity)}
                  </Badge>
                </div>
                {entry.description && (
                  <p className="text-sm text-muted-foreground ml-6">{entry.description}</p>
                )}
                <p className="text-xs text-muted-foreground ml-6">{format(new Date(entry.date), "dd MMM yyyy")}</p>
              </div>
              {!readOnly && (
                <Button variant="ghost" size="sm" onClick={() => handleRecover(entry.id)} className="text-green-600 hover:text-green-700">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> {t(lang, "recovered")}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {recoveredEntries.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t(lang, "recovered")}</p>
          {recoveredEntries.slice(0, 5).map(entry => (
            <div key={entry.id} className="flex items-start p-3 rounded-lg border bg-card/50 opacity-60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm line-through">{entry.body_area}</span>
                  <Badge variant="outline" className="text-xs">{t(lang, entry.severity)}</Badge>
                </div>
                <p className="text-xs text-muted-foreground ml-6">{format(new Date(entry.date), "dd MMM yyyy")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-sm">
          {t(lang, "no_injuries_logged")}
        </div>
      )}
    </div>
  );
};
