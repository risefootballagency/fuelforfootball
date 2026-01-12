import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Lightbulb, GraduationCap, Video, Image } from "lucide-react";

interface MarketingTip {
  id: string;
  title: string;
  content: string | null;
  category: string | null;
  image_url: string | null;
  video_url: string | null;
  is_lesson: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
}

const CATEGORIES = ['Social Media', 'Content Creation', 'Branding', 'Analytics', 'Engagement', 'Strategy', 'Other'];

export const MarketingTipsManagement = ({ isAdmin }: { isAdmin: boolean }) => {
  const [tips, setTips] = useState<MarketingTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<MarketingTip | null>(null);
  const [activeTab, setActiveTab] = useState<'tips' | 'lessons'>('tips');

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    image_url: '',
    video_url: '',
    is_lesson: false,
    published: true,
  });

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_tips')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTips(data || []);
    } catch (error: any) {
      console.error('Error fetching marketing tips:', error);
      toast.error('Failed to load marketing tips');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      const tipData = {
        title: form.title,
        content: form.content || null,
        category: form.category || null,
        image_url: form.image_url || null,
        video_url: form.video_url || null,
        is_lesson: form.is_lesson,
        published: form.published,
        display_order: editingTip ? editingTip.display_order : tips.length,
      };

      if (editingTip) {
        const { error } = await supabase
          .from('marketing_tips')
          .update(tipData)
          .eq('id', editingTip.id);

        if (error) throw error;
        toast.success('Updated!');
      } else {
        const { error } = await supabase
          .from('marketing_tips')
          .insert(tipData);

        if (error) throw error;
        toast.success('Added!');
      }

      resetForm();
      setDialogOpen(false);
      fetchTips();
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error(error.message || 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;

    try {
      const { error } = await supabase
        .from('marketing_tips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Deleted!');
      fetchTips();
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      category: '',
      image_url: '',
      video_url: '',
      is_lesson: activeTab === 'lessons',
      published: true,
    });
    setEditingTip(null);
  };

  const startEdit = (tip: MarketingTip) => {
    setEditingTip(tip);
    setForm({
      title: tip.title,
      content: tip.content || '',
      category: tip.category || '',
      image_url: tip.image_url || '',
      video_url: tip.video_url || '',
      is_lesson: tip.is_lesson,
      published: tip.published,
    });
    setDialogOpen(true);
  };

  const filteredTips = tips.filter(t => 
    activeTab === 'lessons' ? t.is_lesson : !t.is_lesson
  );

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            Marketing Tips & Lessons
          </h2>
          <p className="text-muted-foreground">Share marketing knowledge with the team</p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setForm({ ...form, is_lesson: activeTab === 'lessons' })}>
                <Plus className="h-4 w-4 mr-2" />
                Add {activeTab === 'lessons' ? 'Lesson' : 'Tip'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingTip ? 'Edit' : 'Add'} {form.is_lesson ? 'Lesson' : 'Tip'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Write your tip or lesson content..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g., Social Media, Branding"
                    list="categories"
                  />
                  <datalist id="categories">
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Video URL</Label>
                    <Input
                      value={form.video_url}
                      onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.is_lesson}
                      onCheckedChange={(checked) => setForm({ ...form, is_lesson: checked })}
                    />
                    <Label>Is a Lesson</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.published}
                      onCheckedChange={(checked) => setForm({ ...form, published: checked })}
                    />
                    <Label>Published</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {editingTip ? 'Update' : 'Add'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'tips' | 'lessons')}>
        <TabsList>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Tips ({tips.filter(t => !t.is_lesson).length})
          </TabsTrigger>
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Lessons ({tips.filter(t => t.is_lesson).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {filteredTips.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {activeTab === 'lessons' ? (
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              ) : (
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              )}
              <p>No {activeTab} found. Add one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          filteredTips.map(tip => (
            <Card key={tip.id} className={!tip.published ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {tip.image_url && (
                    <img src={tip.image_url} alt="" className="w-20 h-20 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold">{tip.title}</h3>
                      {!tip.published && (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                      {tip.category && (
                        <Badge variant="outline">{tip.category}</Badge>
                      )}
                      {tip.video_url && (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    {tip.content && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {tip.content}
                      </p>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(tip)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(tip.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
