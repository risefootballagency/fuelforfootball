import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import { Plus, Play, Pause, RotateCcw, CheckCircle2, Clock, Trash2, Timer, Focus } from "lucide-react";

interface FocusedTask {
  id: string;
  title: string;
  description: string | null;
  estimated_minutes: number;
  actual_minutes: number;
  status: string;
  priority: string;
  category: string | null;
  completed_at: string | null;
}

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-slate-500' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
];

export const FocusedTasksSection = () => {
  const [tasks, setTasks] = useState<FocusedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<FocusedTask | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    estimated_minutes: '25',
    priority: 'medium',
    category: '',
  });

  useEffect(() => {
    fetchTasks();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('focused_tasks')
        .select('*')
        .in('status', ['pending', 'in_progress'])
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      const { error } = await supabase
        .from('focused_tasks')
        .insert({
          title: form.title,
          description: form.description || null,
          estimated_minutes: parseInt(form.estimated_minutes) || 25,
          priority: form.priority,
          category: form.category || null,
        });

      if (error) throw error;
      toast.success('Task added!');
      setForm({ title: '', description: '', estimated_minutes: '25', priority: 'medium', category: '' });
      setDialogOpen(false);
      fetchTasks();
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast.error(error.message || 'Failed to save task');
    }
  };

  const startFocus = (task: FocusedTask) => {
    setActiveTask(task);
    setElapsedSeconds(task.actual_minutes * 60);
    setTimerRunning(true);
    
    // Update status to in_progress
    supabase
      .from('focused_tasks')
      .update({ status: 'in_progress' })
      .eq('id', task.id)
      .then(() => fetchTasks());

    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  };

  const pauseFocus = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);

    if (activeTask) {
      const actualMinutes = Math.floor(elapsedSeconds / 60);
      await supabase
        .from('focused_tasks')
        .update({ actual_minutes: actualMinutes })
        .eq('id', activeTask.id);
    }
  };

  const resumeFocus = () => {
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  };

  const completeTask = async () => {
    if (!activeTask) return;

    if (timerRef.current) clearInterval(timerRef.current);
    
    const actualMinutes = Math.floor(elapsedSeconds / 60);
    
    try {
      const { error } = await supabase
        .from('focused_tasks')
        .update({ 
          status: 'completed',
          actual_minutes: actualMinutes,
          completed_at: new Date().toISOString()
        })
        .eq('id', activeTask.id);

      if (error) throw error;
      
      toast.success(`Task completed in ${actualMinutes} minutes!`);
      setActiveTask(null);
      setElapsedSeconds(0);
      setTimerRunning(false);
      fetchTasks();
    } catch (error: any) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };

  const cancelFocus = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (activeTask) {
      const actualMinutes = Math.floor(elapsedSeconds / 60);
      await supabase
        .from('focused_tasks')
        .update({ 
          status: 'pending',
          actual_minutes: actualMinutes
        })
        .eq('id', activeTask.id);
    }

    setActiveTask(null);
    setElapsedSeconds(0);
    setTimerRunning(false);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('focused_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Task deleted!');
      fetchTasks();
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITIES.find(p => p.value === priority)?.color || 'bg-slate-500';
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Focus className="h-6 w-6 text-primary" />
            Focused Tasks
          </h2>
          <p className="text-muted-foreground">Pomodoro-style focus sessions for deep work</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Focused Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Task Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Review player contracts"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estimated Minutes</Label>
                  <Input
                    type="number"
                    value={form.estimated_minutes}
                    onChange={(e) => setForm({ ...form, estimated_minutes: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g., Admin, Coaching, Marketing"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Add Task</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Focus Session */}
      {activeTask && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary animate-pulse" />
              Focus Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{activeTask.title}</h3>
              <div className="text-5xl font-mono font-bold mb-4">
                {formatTime(elapsedSeconds)}
              </div>
              <Progress 
                value={Math.min((elapsedSeconds / 60 / activeTask.estimated_minutes) * 100, 100)} 
                className="h-3 mb-4"
              />
              <div className="text-sm text-muted-foreground mb-4">
                Estimated: {activeTask.estimated_minutes} min
              </div>
            </div>
            <div className="flex justify-center gap-3">
              {timerRunning ? (
                <Button variant="outline" onClick={pauseFocus}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeFocus}>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}
              <Button variant="default" onClick={completeTask}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Complete
              </Button>
              <Button variant="ghost" onClick={cancelFocus}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      <div className="grid gap-3">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending tasks. Add a task to start a focus session!</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map(task => (
            <Card key={task.id} className={task.status === 'in_progress' ? 'border-primary' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                      {task.category && (
                        <Badge variant="outline">{task.category}</Badge>
                      )}
                      {task.status === 'in_progress' && (
                        <Badge variant="secondary">In Progress</Badge>
                      )}
                    </div>
                    <h4 className="font-medium">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Est: {task.estimated_minutes}min
                      </span>
                      {task.actual_minutes > 0 && (
                        <span>Worked: {task.actual_minutes}min</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!activeTask && (
                      <Button size="sm" onClick={() => startFocus(task)}>
                        <Play className="h-4 w-4 mr-1" />
                        Focus
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
