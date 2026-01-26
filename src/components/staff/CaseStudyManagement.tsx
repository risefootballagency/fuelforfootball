import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Edit2, X, GripVertical, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface CaseStudy {
  id: string;
  player_name: string;
  player_image_url: string | null;
  duration: string | null;
  summary: string | null;
  full_story: string | null;
  services_used: string[] | null;
  achievements: string[] | null;
  testimonial: string | null;
  is_visible: boolean;
  display_order: number;
}

const emptyCaseStudy: Omit<CaseStudy, 'id'> = {
  player_name: '',
  player_image_url: '',
  duration: '',
  summary: '',
  full_story: '',
  services_used: [],
  achievements: [],
  testimonial: '',
  is_visible: true,
  display_order: 0,
};

export const CaseStudyManagement = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<CaseStudy, 'id'>>(emptyCaseStudy);
  const [isAdding, setIsAdding] = useState(false);
  const [newServiceInput, setNewServiceInput] = useState('');
  const [newAchievementInput, setNewAchievementInput] = useState('');

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      toast.error('Failed to load case studies');
      console.error(error);
    } else {
      setCaseStudies(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editForm.player_name.trim()) {
      toast.error('Player name is required');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('case_studies')
        .update(editForm)
        .eq('id', editingId);
      
      if (error) {
        toast.error('Failed to update case study');
        console.error(error);
      } else {
        toast.success('Case study updated');
        setEditingId(null);
        fetchCaseStudies();
      }
    } else if (isAdding) {
      const { error } = await supabase
        .from('case_studies')
        .insert({ ...editForm, display_order: caseStudies.length });
      
      if (error) {
        toast.error('Failed to create case study');
        console.error(error);
      } else {
        toast.success('Case study created');
        setIsAdding(false);
        fetchCaseStudies();
      }
    }
    setEditForm(emptyCaseStudy);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    
    const { error } = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete case study');
      console.error(error);
    } else {
      toast.success('Case study deleted');
      fetchCaseStudies();
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    const { error } = await supabase
      .from('case_studies')
      .update({ is_visible: !currentVisibility })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update visibility');
    } else {
      fetchCaseStudies();
    }
  };

  const addService = () => {
    if (newServiceInput.trim()) {
      setEditForm({
        ...editForm,
        services_used: [...(editForm.services_used || []), newServiceInput.trim()]
      });
      setNewServiceInput('');
    }
  };

  const removeService = (index: number) => {
    setEditForm({
      ...editForm,
      services_used: (editForm.services_used || []).filter((_, i) => i !== index)
    });
  };

  const addAchievement = () => {
    if (newAchievementInput.trim()) {
      setEditForm({
        ...editForm,
        achievements: [...(editForm.achievements || []), newAchievementInput.trim()]
      });
      setNewAchievementInput('');
    }
  };

  const removeAchievement = (index: number) => {
    setEditForm({
      ...editForm,
      achievements: (editForm.achievements || []).filter((_, i) => i !== index)
    });
  };

  const startEditing = (study: CaseStudy) => {
    setEditingId(study.id);
    setEditForm({
      player_name: study.player_name,
      player_image_url: study.player_image_url,
      duration: study.duration,
      summary: study.summary,
      full_story: study.full_story,
      services_used: study.services_used,
      achievements: study.achievements,
      testimonial: study.testimonial,
      is_visible: study.is_visible,
      display_order: study.display_order,
    });
    setIsAdding(false);
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm(emptyCaseStudy);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm(emptyCaseStudy);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-primary font-bebas text-xl">Loading case studies...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bebas text-2xl text-foreground tracking-wider">Case Studies Management</h2>
        <Button onClick={startAdding} disabled={isAdding} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Case Study
        </Button>
      </div>

      {/* Editor Form */}
      {(isAdding || editingId) && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bebas text-xl text-primary">
              {isAdding ? 'New Case Study' : 'Edit Case Study'}
            </h3>
            <Button variant="ghost" size="sm" onClick={cancelEdit}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Player Name (Internal Only)</Label>
              <Input
                value={editForm.player_name}
                onChange={(e) => setEditForm({ ...editForm, player_name: e.target.value })}
                placeholder="Player name for internal reference"
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={editForm.duration || ''}
                onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                placeholder="e.g., 8 months"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Player Image URL</Label>
            <Input
              value={editForm.player_image_url || ''}
              onChange={(e) => setEditForm({ ...editForm, player_image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Summary (Short Description)</Label>
            <Textarea
              value={editForm.summary || ''}
              onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
              placeholder="Brief summary of the player's journey"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Full Story</Label>
            <Textarea
              value={editForm.full_story || ''}
              onChange={(e) => setEditForm({ ...editForm, full_story: e.target.value })}
              placeholder="Detailed story of how we worked with this player..."
              rows={4}
            />
          </div>

          {/* Services Used */}
          <div className="space-y-2">
            <Label>Services Used</Label>
            <div className="flex gap-2">
              <Input
                value={newServiceInput}
                onChange={(e) => setNewServiceInput(e.target.value)}
                placeholder="Add a service"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
              />
              <Button type="button" onClick={addService} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(editForm.services_used || []).map((service, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                  {service}
                  <button onClick={() => removeService(idx)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <Label>Achievements</Label>
            <div className="flex gap-2">
              <Input
                value={newAchievementInput}
                onChange={(e) => setNewAchievementInput(e.target.value)}
                placeholder="Add an achievement"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
              />
              <Button type="button" onClick={addAchievement} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(editForm.achievements || []).map((achievement, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                  {achievement}
                  <button onClick={() => removeAchievement(idx)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Testimonial Quote</Label>
            <Textarea
              value={editForm.testimonial || ''}
              onChange={(e) => setEditForm({ ...editForm, testimonial: e.target.value })}
              placeholder="Player's testimonial about working with us..."
              rows={2}
            />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Switch
                checked={editForm.is_visible}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_visible: checked })}
              />
              <Label>Visible on website</Label>
            </div>
            <div className="flex-1" />
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Case Study
            </Button>
          </div>
        </div>
      )}

      {/* Case Studies List */}
      <div className="space-y-3">
        {caseStudies.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No case studies yet. Add your first one!</p>
          </div>
        ) : (
          caseStudies.map((study) => (
            <div 
              key={study.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                editingId === study.id ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
              
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                <img 
                  src={study.player_image_url || 'https://via.placeholder.com/48'} 
                  alt="Player"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bebas text-lg text-foreground truncate">{study.player_name}</h4>
                <p className="text-sm text-muted-foreground truncate">{study.duration} • {study.summary}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVisibility(study.id, study.is_visible)}
                  className={study.is_visible ? 'text-green-500' : 'text-muted-foreground'}
                >
                  {study.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing(study)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(study.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CaseStudyManagement;
