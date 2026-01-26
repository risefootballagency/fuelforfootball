import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Edit2, X, GripVertical, Eye, EyeOff, Upload, Image } from "lucide-react";
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
  achievement_images: string[] | null;
  testimonial: string | null;
  is_visible: boolean;
  display_order: number;
}

const emptyCaseStudy: Omit<CaseStudy, 'id'> = {
  player_name: '',
  player_image_url: null,
  duration: null,
  summary: null,
  full_story: null,
  services_used: [],
  achievements: [],
  achievement_images: [],
  testimonial: null,
  is_visible: true,
  display_order: 0,
};

export const CaseStudyManagement = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<CaseStudy, 'id'>>(emptyCaseStudy);
  const [isAdding, setIsAdding] = useState(false);
  const [newServiceInput, setNewServiceInput] = useState('');
  const [newAchievementInput, setNewAchievementInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setUploadingImage(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `case-study-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('case-studies')
        .upload(fileName, file, { upsert: true });
      
      if (error) {
        toast.error('Failed to upload image');
        console.error(error);
        return;
      }
      
      const { data: publicUrl } = supabase.storage
        .from('case-studies')
        .getPublicUrl(fileName);
      
      setEditForm({ ...editForm, player_image_url: publicUrl.publicUrl });
      toast.success('Image uploaded');
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    // Only player_name is loosely required - but even that can be empty for anonymity
    setSaving(true);
    
    // Clean up empty strings to null for optional fields
    const cleanedForm = {
      ...editForm,
      player_name: editForm.player_name || 'Anonymous Player',
      duration: editForm.duration || null,
      summary: editForm.summary || null,
      full_story: editForm.full_story || null,
      testimonial: editForm.testimonial || null,
      services_used: editForm.services_used && editForm.services_used.length > 0 ? editForm.services_used : null,
      achievements: editForm.achievements && editForm.achievements.length > 0 ? editForm.achievements : null,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('case_studies')
          .update(cleanedForm)
          .eq('id', editingId);
        
        if (error) {
          toast.error('Failed to update case study: ' + error.message);
          console.error(error);
        } else {
          toast.success('Case study updated');
          setEditingId(null);
          setEditForm(emptyCaseStudy);
          fetchCaseStudies();
        }
      } else if (isAdding) {
        const { error } = await supabase
          .from('case_studies')
          .insert({ ...cleanedForm, display_order: caseStudies.length });
        
        if (error) {
          toast.error('Failed to create case study: ' + error.message);
          console.error(error);
        } else {
          toast.success('Case study created');
          setIsAdding(false);
          setEditForm(emptyCaseStudy);
          fetchCaseStudies();
        }
      }
    } finally {
      setSaving(false);
    }
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
        achievements: [...(editForm.achievements || []), newAchievementInput.trim()],
        achievement_images: [...(editForm.achievement_images || []), '']
      });
      setNewAchievementInput('');
    }
  };

  const removeAchievement = (index: number) => {
    setEditForm({
      ...editForm,
      achievements: (editForm.achievements || []).filter((_, i) => i !== index),
      achievement_images: (editForm.achievement_images || []).filter((_, i) => i !== index)
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
      services_used: study.services_used || [],
      achievements: study.achievements || [],
      achievement_images: study.achievement_images || [],
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

          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label>Player Image</Label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 flex-shrink-0 bg-muted flex items-center justify-center">
                {editForm.player_image_url ? (
                  <img 
                    src={editForm.player_image_url} 
                    alt="Player"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              
              {/* Upload Controls */}
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </Button>
                {editForm.player_image_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditForm({ ...editForm, player_image_url: null })}
                    className="text-destructive"
                  >
                    Remove Image
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload a player photo. Images will be displayed in a circular frame.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Player Name (Internal Only)</Label>
              <Input
                value={editForm.player_name}
                onChange={(e) => setEditForm({ ...editForm, player_name: e.target.value })}
                placeholder="Player name for internal reference"
              />
              <p className="text-xs text-muted-foreground">Optional - defaults to "Anonymous Player"</p>
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
            <Label>Achievements (with optional images)</Label>
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
            <div className="space-y-3 mt-2">
              {(editForm.achievements || []).map((achievement, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground flex-1">{achievement}</span>
                      <button onClick={() => removeAchievement(idx)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Achievement Image Upload */}
                    <div className="flex items-center gap-2">
                      {editForm.achievement_images?.[idx] ? (
                        <div className="flex items-center gap-2">
                          <img 
                            src={editForm.achievement_images[idx]} 
                            alt={`Achievement ${idx + 1}`}
                            className="w-16 h-10 object-cover rounded border"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const newImages = [...(editForm.achievement_images || [])];
                              newImages[idx] = '';
                              setEditForm({ ...editForm, achievement_images: newImages });
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              const fileExt = file.name.split('.').pop();
                              const fileName = `achievement-${Date.now()}-${idx}.${fileExt}`;
                              
                              const { error } = await supabase.storage
                                .from('case-studies')
                                .upload(fileName, file, { upsert: true });
                              
                              if (error) {
                                toast.error('Failed to upload image');
                                return;
                              }
                              
                              const { data: publicUrl } = supabase.storage
                                .from('case-studies')
                                .getPublicUrl(fileName);
                              
                              const newImages = [...(editForm.achievement_images || [])];
                              // Ensure array is long enough
                              while (newImages.length <= idx) newImages.push('');
                              newImages[idx] = publicUrl.publicUrl;
                              setEditForm({ ...editForm, achievement_images: newImages });
                              toast.success('Achievement image uploaded');
                            }}
                          />
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors">
                            <Image className="w-3 h-3" />
                            Add Image
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
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
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Case Study'}
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
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0 bg-muted flex items-center justify-center">
                {study.player_image_url ? (
                  <img 
                    src={study.player_image_url} 
                    alt="Player"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bebas text-lg text-foreground truncate">{study.player_name}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {study.duration && `${study.duration} • `}{study.summary || 'No summary'}
                </p>
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