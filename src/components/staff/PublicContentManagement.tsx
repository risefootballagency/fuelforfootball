import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Globe, RefreshCw, Eye, EyeOff, Search } from "lucide-react";

interface PublicPage {
  id: string;
  title: string;
  type: string;
  is_visible: boolean;
}

export const PublicContentManagement = () => {
  const [items, setItems] = useState<PublicPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { loadContent(); }, []);

  const loadContent = async () => {
    setLoading(true);
    const results: PublicPage[] = [];

    // Case studies
    const { data: cs } = await supabase.from("case_studies").select("id, player_name, is_visible");
    cs?.forEach(c => results.push({ id: c.id, title: c.player_name, type: "Case Study", is_visible: c.is_visible ?? true }));

    // Blog posts
    const { data: bp } = await supabase.from("blog_posts").select("id, title, published");
    bp?.forEach(b => results.push({ id: b.id, title: b.title, type: "Blog Post", is_visible: b.published ?? false }));

    // Jobs
    const { data: jb } = await supabase.from("jobs").select("id, title, is_active");
    jb?.forEach(j => results.push({ id: j.id, title: j.title, type: "Job", is_visible: j.is_active ?? false }));

    setItems(results);
    setLoading(false);
  };

  const toggleVisibility = async (item: PublicPage) => {
    const newVal = !item.is_visible;
    let error = null;

    if (item.type === "Case Study") {
      ({ error } = await supabase.from("case_studies").update({ is_visible: newVal }).eq("id", item.id));
    } else if (item.type === "Blog Post") {
      ({ error } = await supabase.from("blog_posts").update({ published: newVal }).eq("id", item.id));
    } else if (item.type === "Job") {
      ({ error } = await supabase.from("jobs").update({ is_active: newVal }).eq("id", item.id));
    }

    if (error) toast.error("Update failed");
    else { toast.success(`${item.title} ${newVal ? "visible" : "hidden"}`); loadContent(); }
  };

  const filtered = items.filter(i => {
    if (!search) return true;
    return i.title.toLowerCase().includes(search.toLowerCase()) || i.type.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Public Content</h2>
            <p className="text-sm text-muted-foreground">{items.filter(i => i.is_visible).length} visible / {items.length} total</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadContent}><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search content..." className="pl-9" />
      </div>

      {loading ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No content found</CardContent></Card>
      ) : (
        <div className="grid gap-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                {item.is_visible ? <Eye className="w-4 h-4 text-green-500 shrink-0" /> : <EyeOff className="w-4 h-4 text-muted-foreground shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <Badge variant="outline" className="text-[9px]">{item.type}</Badge>
                </div>
              </div>
              <Switch checked={item.is_visible} onCheckedChange={() => toggleVisibility(item)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
