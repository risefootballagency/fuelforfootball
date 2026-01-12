import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Target, Users, Network, Megaphone, TrendingUp, Eye, Lightbulb, CheckCircle2 } from "lucide-react";

interface VisionItem {
  id: string;
  category: string;
  vision: string;
  action_plan: string | null;
  progress: number;
  target_date: string | null;
  status: string;
  assigned_to: string[] | null;
  notes: string | null;
  display_order: number;
}

const CATEGORIES = [
  { id: 'scouting', label: 'Scouting', icon: Eye, color: 'bg-blue-500' },
  { id: 'recruitment', label: 'Recruitment', icon: Users, color: 'bg-green-500' },
  { id: 'networking', label: 'Networking', icon: Network, color: 'bg-purple-500' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, color: 'bg-orange-500' },
  { id: 'performance', label: 'Performance', icon: TrendingUp, color: 'bg-red-500' },
];

export const VisionBoardSection = () => {
  const [items, setItems] = useState<VisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VisionItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [form, setForm] = useState({
    category: 'scouting',
    vision: '',
    action_plan: '',
    progress: 0,
    target_date: '',
    notes: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('vision_board_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error('Error fetching vision board items:', error);
      toast.error('Failed to load vision board');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.vision.trim()) {
      toast.error('Please enter a vision statement');
      return;
    }

    try {
      const itemData = {
        category: form.category,
        vision: form.vision,
        action_plan: form.action_plan || null,
        progress: form.progress,
        target_date: form.target_date || null,
        notes: form.notes || null,
        display_order: editingItem ? editingItem.display_order : items.length,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('vision_board_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Vision updated!');
      } else {
        const { error } = await supabase
          .from('vision_board_items')
          .insert(itemData);

        if (error) throw error;
        toast.success('Vision added!');
      }

      resetForm();
      setDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      console.error('Error saving vision:', error);
      toast.error(error.message || 'Failed to save vision');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vision?')) return;

    try {
      const { error } = await supabase
        .from('vision_board_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Vision deleted!');
      fetchItems();
    } catch (error: any) {
      console.error('Error deleting vision:', error);
      toast.error('Failed to delete vision');
    }
  };

  const handleProgressUpdate = async (id: string, newProgress: number) => {
    try {
      const status = newProgress >= 100 ? 'completed' : 'active';
      const { error } = await supabase
        .from('vision_board_items')
        .update({ progress: newProgress, status })
        .eq('id', id);

      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, progress: newProgress, status } : item
      ));
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const resetForm = () => {
    setForm({
      category: 'scouting',
      vision: '',
      action_plan: '',
      progress: 0,
      target_date: '',
      notes: '',
    });
    setEditingItem(null);
  };

  const startEdit = (item: VisionItem) => {
    setEditingItem(item);
    setForm({
      category: item.category,
      vision: item.vision,
      action_plan: item.action_plan || '',
      progress: item.progress,
      target_date: item.target_date || '',
      notes: item.notes || '',
    });
    setDialogOpen(true);
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category?.icon || Target;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category?.color || 'bg-gray-500';
  };

  const getProgressByCategory = (categoryId: string) => {
    const categoryItems = items.filter(i => i.category === categoryId);
    if (categoryItems.length === 0) return 0;
    return Math.round(categoryItems.reduce((sum, i) => sum + i.progress, 0) / categoryItems.length);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading vision board...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Strategic Vision Board
          </h2>
          <p className="text-muted-foreground">Track your goals, plans, and progress across key areas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vision
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Vision' : 'Add New Vision'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <cat.icon className="h-4 w-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vision Statement *</Label>
                <Input
                  value={form.vision}
                  onChange={(e) => setForm({ ...form, vision: e.target.value })}
                  placeholder="e.g., Sign 5 new players from Spain this quarter"
                />
              </div>
              <div className="space-y-2">
                <Label>Action Plan</Label>
                <Textarea
                  value={form.action_plan}
                  onChange={(e) => setForm({ ...form, action_plan: e.target.value })}
                  placeholder="Step-by-step plan to achieve this vision..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Progress: {form.progress}%</Label>
                <Slider
                  value={[form.progress]}
                  onValueChange={(v) => setForm({ ...form, progress: v[0] })}
                  max={100}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Input
                  type="date"
                  value={form.target_date}
                  onChange={(e) => setForm({ ...form, target_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingItem ? 'Update' : 'Add'} Vision
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Progress Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const progress = getProgressByCategory(cat.id);
          const count = items.filter(i => i.category === cat.id).length;
          return (
            <Card 
              key={cat.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedCategory === cat.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded ${cat.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{cat.label}</span>
                </div>
                <Progress value={progress} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progress}%</span>
                  <span>{count} items</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {CATEGORIES.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id}>{cat.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Vision Cards */}
      <div className="grid gap-4">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No visions found. Add your first strategic vision to get started!</p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map(item => {
            const Icon = getCategoryIcon(item.category);
            const isCompleted = item.status === 'completed';
            return (
              <Card key={item.id} className={isCompleted ? 'opacity-75' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded ${getCategoryColor(item.category)}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <Badge variant={isCompleted ? 'default' : 'secondary'}>
                          {isCompleted ? <CheckCircle2 className="h-3 w-3 mr-1" /> : null}
                          {item.status}
                        </Badge>
                        {item.target_date && (
                          <span className="text-xs text-muted-foreground">
                            Target: {new Date(item.target_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{item.vision}</h3>
                      {item.action_plan && (
                        <p className="text-sm text-muted-foreground mb-2">{item.action_plan}</p>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={item.progress} className="h-2" />
                        </div>
                        <span className="text-sm font-medium">{item.progress}%</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
