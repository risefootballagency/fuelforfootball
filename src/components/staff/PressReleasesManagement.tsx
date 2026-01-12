import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Newspaper, Calendar, ExternalLink } from "lucide-react";

interface PressRelease {
  id: string;
  title: string;
  content: string | null;
  summary: string | null;
  image_url: string | null;
  published: boolean;
  publish_date: string | null;
  created_at: string;
}

export const PressReleasesManagement = ({ isAdmin }: { isAdmin: boolean }) => {
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<PressRelease | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    summary: '',
    image_url: '',
    published: false,
    publish_date: '',
  });

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const { data, error } = await supabase
        .from('press_releases')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;
      setReleases(data || []);
    } catch (error: any) {
      console.error('Error fetching press releases:', error);
      toast.error('Failed to load press releases');
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
      const releaseData = {
        title: form.title,
        content: form.content || null,
        summary: form.summary || null,
        image_url: form.image_url || null,
        published: form.published,
        publish_date: form.publish_date || null,
      };

      if (editingRelease) {
        const { error } = await supabase
          .from('press_releases')
          .update(releaseData)
          .eq('id', editingRelease.id);

        if (error) throw error;
        toast.success('Press release updated!');
      } else {
        const { error } = await supabase
          .from('press_releases')
          .insert(releaseData);

        if (error) throw error;
        toast.success('Press release created!');
      }

      resetForm();
      setDialogOpen(false);
      fetchReleases();
    } catch (error: any) {
      console.error('Error saving press release:', error);
      toast.error(error.message || 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this press release?')) return;

    try {
      const { error } = await supabase
        .from('press_releases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Press release deleted!');
      fetchReleases();
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      summary: '',
      image_url: '',
      published: false,
      publish_date: '',
    });
    setEditingRelease(null);
  };

  const startEdit = (release: PressRelease) => {
    setEditingRelease(release);
    setForm({
      title: release.title,
      content: release.content || '',
      summary: release.summary || '',
      image_url: release.image_url || '',
      published: release.published,
      publish_date: release.publish_date ? release.publish_date.split('T')[0] : '',
    });
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading press releases...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Newspaper className="h-6 w-6" />
            Press Releases
          </h2>
          <p className="text-muted-foreground">Manage official press releases and announcements</p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Press Release
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRelease ? 'Edit Press Release' : 'New Press Release'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Press release headline..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <Textarea
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    placeholder="Brief summary for previews..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Full press release content..."
                    rows={8}
                  />
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
                    <Label>Publish Date</Label>
                    <Input
                      type="date"
                      value={form.publish_date}
                      onChange={(e) => setForm({ ...form, publish_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.published}
                    onCheckedChange={(checked) => setForm({ ...form, published: checked })}
                  />
                  <Label>Published</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {editingRelease ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {releases.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No press releases found. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          releases.map(release => (
            <Card key={release.id} className={!release.published ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {release.image_url && (
                    <img src={release.image_url} alt="" className="w-24 h-16 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold">{release.title}</h3>
                      <Badge variant={release.published ? 'default' : 'secondary'}>
                        {release.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    {release.summary && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {release.summary}
                      </p>
                    )}
                    {expandedId === release.id && release.content && (
                      <div className="mt-3 p-3 bg-muted/50 rounded text-sm whitespace-pre-wrap">
                        {release.content}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {release.publish_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(release.publish_date).toLocaleDateString()}
                        </span>
                      )}
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0"
                        onClick={() => setExpandedId(expandedId === release.id ? null : release.id)}
                      >
                        {expandedId === release.id ? 'Show less' : 'Read more'}
                      </Button>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(release)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(release.id)}>
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
