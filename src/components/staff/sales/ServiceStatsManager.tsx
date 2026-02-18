import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Trash2, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const PAGE_KEYS = [
  { value: "analysis", label: "Analysis" },
  { value: "conditioning", label: "Conditioning" },
  { value: "nutrition", label: "Nutrition" },
  { value: "mental", label: "Psychological Performance" },
  { value: "technical", label: "Technical" },
  { value: "sps", label: "Strength, Power & Speed" },
  { value: "mentorship", label: "Mentorship" },
  { value: "consultation", label: "Consultation" },
  { value: "pro-performance", label: "Pro Performance" },
  { value: "elite-performance", label: "Elite Performance" },
];

interface StatRow {
  label: string;
  value: number;
  suffix: string;
}

export const ServiceStatsManager = () => {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState(PAGE_KEYS[0].value);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { data: existingData } = useQuery({
    queryKey: ["service-stats-admin", selectedPage],
    queryFn: async () => {
      const { data } = await supabase
        .from("service_page_stats" as any)
        .select("*")
        .eq("page_key", selectedPage)
        .single();
      return data as any;
    },
  });

  // Sync stats from DB when page changes
  if (existingData && !loaded) {
    setStats(existingData.stats || []);
    setLoaded(true);
  }

  const handlePageChange = (v: string) => {
    setSelectedPage(v);
    setLoaded(false);
    setStats([]);
  };

  const addStat = () => {
    if (stats.length >= 4) return;
    setStats([...stats, { label: "", value: 0, suffix: "" }]);
  };

  const removeStat = (i: number) => {
    setStats(stats.filter((_, idx) => idx !== i));
  };

  const updateStat = (i: number, field: keyof StatRow, val: string | number) => {
    setStats(stats.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (existingData) {
        const { error } = await supabase
          .from("service_page_stats" as any)
          .update({ stats: JSON.parse(JSON.stringify(stats)) } as any)
          .eq("page_key", selectedPage);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("service_page_stats" as any)
          .insert({ page_key: selectedPage, stats: JSON.parse(JSON.stringify(stats)) } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-stats-admin", selectedPage] });
      toast.success("Stats saved");
    },
    onError: () => toast.error("Failed to save"),
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent" />
          Service Page Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Service Page</Label>
          <Select value={selectedPage} onValueChange={handlePageChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_KEYS.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {stats.map((stat, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="text-xs">Label</Label>
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  placeholder="e.g. Player Improvements"
                  className="h-8 text-sm"
                />
              </div>
              <div className="w-20">
                <Label className="text-xs">Value</Label>
                <Input
                  type="number"
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", parseInt(e.target.value) || 0)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="w-16">
                <Label className="text-xs">Suffix</Label>
                <Input
                  value={stat.suffix}
                  onChange={(e) => updateStat(i, "suffix", e.target.value)}
                  placeholder="%"
                  className="h-8 text-sm"
                />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeStat(i)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addStat} disabled={stats.length >= 4}>
            <Plus className="w-3 h-3 mr-1" /> Add Stat
          </Button>
          <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="w-3 h-3 mr-1" /> Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
