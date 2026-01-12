import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Briefcase, MapPin, Clock, ExternalLink } from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  location: string | null;
  type: string | null;
  department: string | null;
  salary_range: string | null;
  is_active: boolean;
  application_url: string | null;
  created_at: string;
}

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

export const JobsManagement = ({ isAdmin }: { isAdmin: boolean }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    type: 'full-time',
    department: '',
    salary_range: '',
    is_active: true,
    application_url: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a job title');
      return;
    }

    try {
      const jobData = {
        title: form.title,
        description: form.description || null,
        requirements: form.requirements || null,
        location: form.location || null,
        type: form.type,
        department: form.department || null,
        salary_range: form.salary_range || null,
        is_active: form.is_active,
        application_url: form.application_url || null,
      };

      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', editingJob.id);

        if (error) throw error;
        toast.success('Job updated!');
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert(jobData);

        if (error) throw error;
        toast.success('Job created!');
      }

      resetForm();
      setDialogOpen(false);
      fetchJobs();
    } catch (error: any) {
      console.error('Error saving job:', error);
      toast.error(error.message || 'Failed to save job');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Job deleted!');
      fetchJobs();
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setJobs(prev => prev.map(j => j.id === id ? { ...j, is_active: !currentStatus } : j));
      toast.success(`Job ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error: any) {
      console.error('Error toggling job status:', error);
      toast.error('Failed to update job');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      requirements: '',
      location: '',
      type: 'full-time',
      department: '',
      salary_range: '',
      is_active: true,
      application_url: '',
    });
    setEditingJob(null);
  };

  const startEdit = (job: Job) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      description: job.description || '',
      requirements: job.requirements || '',
      location: job.location || '',
      type: job.type || 'full-time',
      department: job.department || '',
      salary_range: job.salary_range || '',
      is_active: job.is_active,
      application_url: job.application_url || '',
    });
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            Jobs Management
          </h2>
          <p className="text-muted-foreground">Manage job listings for the /jobs page</p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Job Title *</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g., Football Analyst"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      placeholder="e.g., Analysis"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Job description..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <Textarea
                    value={form.requirements}
                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                    placeholder="Job requirements..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g., Remote, London"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPES.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Salary Range</Label>
                    <Input
                      value={form.salary_range}
                      onChange={(e) => setForm({ ...form, salary_range: e.target.value })}
                      placeholder="e.g., £30,000 - £40,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Application URL</Label>
                    <Input
                      value={form.application_url}
                      onChange={(e) => setForm({ ...form, application_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                  />
                  <Label>Active (visible on website)</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {editingJob ? 'Update' : 'Create'} Job
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No jobs found. Add a job listing to get started!</p>
            </CardContent>
          </Card>
        ) : (
          jobs.map(job => (
            <Card key={job.id} className={!job.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold">{job.title}</h3>
                      <Badge variant={job.is_active ? 'default' : 'secondary'}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {job.type && (
                        <Badge variant="outline">{job.type}</Badge>
                      )}
                    </div>
                    {job.department && (
                      <p className="text-sm text-muted-foreground mb-1">
                        Department: {job.department}
                      </p>
                    )}
                    {job.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {job.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                      )}
                      {job.salary_range && (
                        <span>{job.salary_range}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      {job.application_url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => startEdit(job)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}>
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
