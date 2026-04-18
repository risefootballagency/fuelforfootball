import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, CheckCircle2, Loader2, Package, Pencil, Trash2 } from "lucide-react";

interface FFFPackage {
  id: string;
  player_id: string;
  package_size: number;
  started_at: string;
  notes: string | null;
  title: string | null;
  service_id: string | null;
}

interface FFFCompletion {
  id: string;
  package_id: string;
  analysis_id: string | null;
  performance_report_id: string | null;
  fixture_id: string | null;
  completed_at: string;
}

interface ServiceOption {
  id: string;
  name: string;
  category: string | null;
  price: number | null;
}

interface Props {
  playerId: string | null | undefined;
  /** Pass either an analysis_id, performance_report_id or fixture_id when marking */
  currentAnalysisId?: string | null;
  currentPerformanceReportId?: string | null;
  currentFixtureId?: string | null;
}

/**
 * Fuel For Football package tracker — shows up for ANY player on this site.
 * Lets staff start, edit and mark progress against packages, optionally linked
 * to a service from the catalogue.
 */
export const FFFPackageHeader = ({
  playerId,
  currentAnalysisId,
  currentPerformanceReportId,
  currentFixtureId,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<FFFPackage[]>([]);
  const [completions, setCompletions] = useState<FFFCompletion[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [adding, setAdding] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<{
    title: string;
    package_size: number;
    service_id: string | null;
    notes: string;
  }>({ title: "", package_size: 5, service_id: null, notes: "" });

  const load = async () => {
    if (!playerId) return;
    setLoading(true);
    const [{ data: pkgs }, { data: comps }, { data: svcs }] = await Promise.all([
      supabase
        .from("fff_packages")
        .select("*")
        .eq("player_id", playerId)
        .order("started_at", { ascending: false }),
      supabase.from("fff_package_completions").select("*"),
      supabase
        .from("service_catalog")
        .select("id, name, category, price")
        .eq("visible", true)
        .order("category")
        .order("name"),
    ]);
    setPackages((pkgs || []) as FFFPackage[]);
    setCompletions((comps || []) as FFFCompletion[]);
    setServices((svcs || []) as ServiceOption[]);
    setLoading(false);
  };

  useEffect(() => {
    if (playerId) load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

  if (!playerId) return null;
  if (loading) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading Fuel For Football package...
      </div>
    );
  }

  const currentPackage = packages[0] || null;
  const packageCompletions = currentPackage
    ? completions.filter((c) => c.package_id === currentPackage.id)
    : [];
  const completedCount = packageCompletions.length;
  const total = currentPackage?.package_size || 5;
  const progressPct = currentPackage ? Math.min(100, (completedCount / total) * 100) : 0;

  const linkedService = currentPackage?.service_id
    ? services.find((s) => s.id === currentPackage.service_id) || null
    : null;
  const packageLabel = currentPackage?.title || linkedService?.name || "Active package";

  const alreadyMarked = packageCompletions.some((c) => {
    if (currentAnalysisId && c.analysis_id === currentAnalysisId) return true;
    if (currentPerformanceReportId && c.performance_report_id === currentPerformanceReportId) return true;
    if (currentFixtureId && c.fixture_id === currentFixtureId) return true;
    return false;
  });

  const openEdit = (pkg: FFFPackage | null) => {
    if (pkg) {
      setDraft({
        title: pkg.title || "",
        package_size: pkg.package_size || 5,
        service_id: pkg.service_id || null,
        notes: pkg.notes || "",
      });
    } else {
      setDraft({ title: "", package_size: 5, service_id: null, notes: "" });
    }
    setEditOpen(true);
  };

  const handleStartPackage = async () => {
    setAdding(true);
    const { data, error } = await supabase
      .from("fff_packages")
      .insert({ player_id: playerId, package_size: 5 })
      .select()
      .single();
    if (error) toast.error(error.message || "Failed to start new package");
    else {
      toast.success("New Fuel For Football package started");
      setPackages((prev) => [data as FFFPackage, ...prev]);
    }
    setAdding(false);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      // If service selected and no title set, use service name as title
      const linked = services.find((s) => s.id === draft.service_id);
      const finalTitle = draft.title.trim() || linked?.name || null;

      if (currentPackage) {
        const { data, error } = await supabase
          .from("fff_packages")
          .update({
            title: finalTitle,
            package_size: Math.max(1, draft.package_size),
            service_id: draft.service_id,
            notes: draft.notes.trim() || null,
          } as any)
          .eq("id", currentPackage.id)
          .select()
          .single();
        if (error) throw error;
        setPackages((prev) => [data as FFFPackage, ...prev.slice(1)]);
        toast.success("Package updated");
      } else {
        const { data, error } = await supabase
          .from("fff_packages")
          .insert({
            player_id: playerId,
            package_size: Math.max(1, draft.package_size),
            title: finalTitle,
            service_id: draft.service_id,
            notes: draft.notes.trim() || null,
          } as any)
          .select()
          .single();
        if (error) throw error;
        setPackages((prev) => [data as FFFPackage, ...prev]);
        toast.success("Package created");
      }
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save package");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async () => {
    if (!currentPackage) return;
    if (!confirm("Delete this package and all its progress?")) return;
    const { error } = await supabase.from("fff_packages").delete().eq("id", currentPackage.id);
    if (error) {
      toast.error(error.message || "Failed to delete package");
      return;
    }
    setPackages((prev) => prev.slice(1));
    toast.success("Package deleted");
    setEditOpen(false);
  };

  const handleMarkGame = async () => {
    if (!currentPackage) {
      toast.error("Start a package first");
      return;
    }
    if (alreadyMarked) {
      toast.info("This game already counts towards the package");
      return;
    }
    const { data: userRes } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("fff_package_completions")
      .insert({
        package_id: currentPackage.id,
        analysis_id: currentAnalysisId || null,
        performance_report_id: currentPerformanceReportId || null,
        fixture_id: currentFixtureId || null,
        completed_by: userRes.user?.id || null,
      })
      .select()
      .single();
    if (error) toast.error(error.message || "Failed to mark game");
    else {
      toast.success("Game added to package");
      setCompletions((prev) => [...prev, data as FFFCompletion]);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center border border-primary/40 shrink-0">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted-foreground truncate">
                Fuel For Football {linkedService?.category ? `· ${linkedService.category}` : ""}
              </p>
              <p className="text-sm font-bold truncate">
                {currentPackage ? (
                  <>
                    {packageLabel}
                    <span className="ml-2 font-normal text-muted-foreground">
                      {completedCount} / {total} completed
                    </span>
                  </>
                ) : (
                  "No active package"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {currentPackage && (currentAnalysisId || currentPerformanceReportId || currentFixtureId) && (
              <Button
                size="sm"
                variant={alreadyMarked ? "outline" : "default"}
                onClick={handleMarkGame}
                disabled={alreadyMarked || completedCount >= total}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {alreadyMarked ? "Counted" : "Mark this game"}
              </Button>
            )}
            {currentPackage && (
              <Button size="sm" variant="outline" onClick={() => openEdit(currentPackage)} className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={packages.length === 0 ? () => openEdit(null) : handleStartPackage}
              disabled={adding}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {packages.length === 0 ? "Start package" : "New package"}
            </Button>
          </div>
        </div>
        {currentPackage && (
          <>
            <Progress value={progressPct} className="h-2" />
            {packageCompletions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {packageCompletions.map((c, i) => (
                  <Badge key={c.id} variant="outline" className="text-[10px] gap-1 bg-primary/5">
                    Game {i + 1}
                    {c.analysis_id ? " · Analysis" : c.performance_report_id ? " · Report" : c.fixture_id ? " · Fixture" : ""}
                  </Badge>
                ))}
              </div>
            )}
            {packages.length > 1 && (
              <p className="text-[10px] text-muted-foreground">{packages.length} total packages on record</p>
            )}
          </>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentPackage ? "Edit package" : "Create package"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Linked service (optional)</Label>
              <Select
                value={draft.service_id || "none"}
                onValueChange={(v) => {
                  const id = v === "none" ? null : v;
                  const s = services.find((x) => x.id === id);
                  setDraft((d) => ({
                    ...d,
                    service_id: id,
                    title: d.title || s?.name || "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Manual package (no service)" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="none">Manual package (no service)</SelectItem>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                      {s.category ? ` · ${s.category}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="e.g. Pre-season analysis pack"
              />
            </div>
            <div>
              <Label className="text-xs">Package size (number of games)</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={draft.package_size}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, package_size: parseInt(e.target.value) || 1 }))
                }
              />
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea
                value={draft.notes}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                placeholder="Internal notes about this package"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="flex sm:justify-between gap-2">
            {currentPackage ? (
              <Button variant="destructive" size="sm" onClick={handleDeletePackage} className="gap-1.5">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
