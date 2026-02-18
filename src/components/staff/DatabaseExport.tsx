import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import { HardDrive, Download, Loader2 } from "lucide-react";

const EXPORT_TABLES = [
  { id: "players", label: "Players", shared: true },
  { id: "player_analysis", label: "Performance Reports", shared: true },
  { id: "analyses", label: "Analyses", shared: true },
  { id: "fixtures", label: "Fixtures", shared: true },
  { id: "invoices", label: "Invoices", shared: false },
  { id: "payments", label: "Payments", shared: false },
  { id: "coaching_analysis", label: "Coaching Database", shared: false },
  { id: "case_studies", label: "Case Studies", shared: false },
  { id: "blog_posts", label: "Blog Posts", shared: false },
  { id: "club_network_contacts", label: "Club Network", shared: false },
  { id: "marketing_gallery", label: "Marketing Gallery", shared: false },
];

export const DatabaseExport = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState<"csv" | "json">("csv");

  const toggleTable = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selected.length === EXPORT_TABLES.length) setSelected([]);
    else setSelected(EXPORT_TABLES.map(t => t.id));
  };

  const exportData = async () => {
    if (selected.length === 0) { toast.error("Select tables to export"); return; }
    setExporting(true);

    try {
      for (const tableId of selected) {
        const config = EXPORT_TABLES.find(t => t.id === tableId);
        if (!config) continue;

        const client = config.shared ? sharedSupabase : supabase;
        const { data, error } = await client.from(tableId as any).select("*").limit(1000);
        
        if (error) {
          toast.error(`Failed to export ${config.label}: ${error.message}`);
          continue;
        }

        if (!data || data.length === 0) {
          toast.info(`No data in ${config.label}`);
          continue;
        }

        let content: string;
        let mimeType: string;
        let ext: string;

        if (format === "csv") {
          const headers = Object.keys(data[0]);
          const rows = data.map(row => headers.map(h => {
            const val = (row as any)[h];
            if (val === null || val === undefined) return "";
            const str = typeof val === "object" ? JSON.stringify(val) : String(val);
            return str.includes(",") || str.includes('"') || str.includes("\n")
              ? `"${str.replace(/"/g, '""')}"` : str;
          }).join(","));
          content = [headers.join(","), ...rows].join("\n");
          mimeType = "text/csv";
          ext = "csv";
        } else {
          content = JSON.stringify(data, null, 2);
          mimeType = "application/json";
          ext = "json";
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${tableId}_export_${new Date().toISOString().slice(0, 10)}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast.success(`Exported ${selected.length} table(s)`);
    } catch (err: any) {
      toast.error(err.message || "Export failed");
    }
    setExporting(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardDrive className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Data Export</h2>
            <p className="text-sm text-muted-foreground">Export database tables as CSV or JSON</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={format === "csv" ? "default" : "outline"} size="sm" onClick={() => setFormat("csv")}>CSV</Button>
          <Button variant={format === "json" ? "default" : "outline"} size="sm" onClick={() => setFormat("json")}>JSON</Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox checked={selected.length === EXPORT_TABLES.length} onCheckedChange={selectAll} />
        <span className="text-sm">Select All</span>
        <span className="text-xs text-muted-foreground ml-2">{selected.length} selected</span>
      </div>

      <div className="grid gap-2">
        {EXPORT_TABLES.map(table => (
          <div
            key={table.id}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selected.includes(table.id) ? "border-primary bg-primary/5" : "border-border hover:bg-muted/20"
            }`}
            onClick={() => toggleTable(table.id)}
          >
            <Checkbox checked={selected.includes(table.id)} />
            <span className="text-sm font-medium">{table.label}</span>
            <Badge variant="outline" className="text-[9px] ml-auto">
              {table.shared ? "shared" : "local"}
            </Badge>
          </div>
        ))}
      </div>

      <Button onClick={exportData} disabled={exporting || selected.length === 0} className="w-full">
        {exporting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Download className="w-4 h-4 mr-1" />}
        Export {selected.length} Table{selected.length !== 1 ? "s" : ""} as {format.toUpperCase()}
      </Button>
    </div>
  );
};
