import { useState, useEffect } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Building2, Search } from "lucide-react";

interface ClubRating {
  id: string;
  club_name: string;
  first_team_rating: string;
  academy_rating: string;
  created_at: string;
}

export const ClubRatings = () => {
  const [ratings, setRatings] = useState<ClubRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<ClubRating | null>(null);
  const [formData, setFormData] = useState({ club_name: "", first_team_rating: "", academy_rating: "" });

  const fetchRatings = async () => {
    setLoading(true);
    const { data, error } = await sharedSupabase
      .from("club_ratings" as any)
      .select("*")
      .order("club_name");
    if (!error && data) setRatings(data as any[]);
    setLoading(false);
  };

  useEffect(() => { fetchRatings(); }, []);

  const handleSave = async () => {
    if (!formData.club_name) { toast.error("Club name required"); return; }
    if (editing) {
      const { error } = await sharedSupabase
        .from("club_ratings" as any)
        .update({ club_name: formData.club_name, first_team_rating: formData.first_team_rating, academy_rating: formData.academy_rating })
        .eq("id", editing.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Rating updated");
    } else {
      const { error } = await sharedSupabase
        .from("club_ratings" as any)
        .insert({ club_name: formData.club_name, first_team_rating: formData.first_team_rating, academy_rating: formData.academy_rating });
      if (error) { toast.error("Failed to create"); return; }
      toast.success("Rating added");
    }
    setShowDialog(false);
    setEditing(null);
    setFormData({ club_name: "", first_team_rating: "", academy_rating: "" });
    fetchRatings();
  };

  const handleDelete = async (id: string) => {
    const { error } = await sharedSupabase.from("club_ratings" as any).delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Deleted");
    fetchRatings();
  };

  const filtered = ratings.filter(r => r.club_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gold" />
          <h3 className="font-bebas text-lg text-gold">Club Ratings</h3>
          <span className="text-xs text-muted-foreground">({ratings.length})</span>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setFormData({ club_name: "", first_team_rating: "", academy_rating: "" }); setShowDialog(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Add Rating
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search clubs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Club</TableHead>
              <TableHead>First Team</TableHead>
              <TableHead>Academy</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No ratings found</TableCell></TableRow>
            ) : filtered.map(rating => (
              <TableRow key={rating.id}>
                <TableCell className="font-medium">{rating.club_name}</TableCell>
                <TableCell>{rating.first_team_rating || "—"}</TableCell>
                <TableCell>{rating.academy_rating || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                      setEditing(rating);
                      setFormData({ club_name: rating.club_name, first_team_rating: rating.first_team_rating, academy_rating: rating.academy_rating });
                      setShowDialog(true);
                    }}><Edit className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(rating.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Club Rating</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Club Name</Label><Input value={formData.club_name} onChange={e => setFormData(p => ({ ...p, club_name: e.target.value }))} /></div>
            <div><Label>First Team Rating</Label><Input value={formData.first_team_rating} onChange={e => setFormData(p => ({ ...p, first_team_rating: e.target.value }))} /></div>
            <div><Label>Academy Rating</Label><Input value={formData.academy_rating} onChange={e => setFormData(p => ({ ...p, academy_rating: e.target.value }))} /></div>
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
