import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import {
  Pencil, Circle, ArrowRight, Type, Undo2, Redo2, Trash2, Download,
  Play, Pause, SkipBack, SkipForward, Palette, Plus, Eye, Save,
  Square, Triangle, Minus, Upload, X,
} from "lucide-react";

type Tool = "pen" | "arrow" | "circle" | "rectangle" | "text" | "line";

interface DrawAction {
  tool: Tool;
  color: string;
  lineWidth: number;
  points: { x: number; y: number }[];
  text?: string;
}

interface AnnotationFrame {
  id: string;
  time: number;
  actions: DrawAction[];
  label: string;
}

interface AnnotationProject {
  id: string;
  name: string;
  video_url: string;
  frames: AnnotationFrame[];
  created_at: string;
}

const COLORS = ["#00FF87", "#FF4444", "#FFD700", "#3B82F6", "#FFFFFF", "#FF6B35", "#8B5CF6", "#EC4899"];

export const AnnotationProjects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [projects, setProjects] = useState<AnnotationProject[]>([]);
  const [activeProject, setActiveProject] = useState<AnnotationProject | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Editor state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#00FF87");
  const [lineWidth, setLineWidth] = useState(3);
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [undoneActions, setUndoneActions] = useState<DrawAction[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAction, setCurrentAction] = useState<DrawAction | null>(null);
  const [activeFrame, setActiveFrame] = useState<AnnotationFrame | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase
      .from("coaching_analysis" as any)
      .select("*")
      .eq("analysis_type", "annotation_project")
      .order("created_at", { ascending: false });
    
    if (data) {
      setProjects(data.map((d: any) => ({
        id: d.id,
        name: d.title,
        video_url: d.content || "",
        frames: Array.isArray(d.attachments) ? d.attachments : [],
        created_at: d.created_at,
      })));
    }
  };

  const handleCreateProject = async () => {
    if (!newName || !videoFile) {
      toast.error("Name and video required");
      return;
    }
    setUploading(true);
    try {
      const ext = videoFile.name.split(".").pop();
      const path = `annotations/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("analysis-videos").upload(path, videoFile);
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("analysis-videos").getPublicUrl(path);
      
      const { error } = await supabase.from("coaching_analysis" as any).insert({
        title: newName,
        analysis_type: "annotation_project",
        content: urlData.publicUrl,
        attachments: [],
      });
      if (error) throw error;
      toast.success("Project created");
      setShowCreate(false);
      setNewName("");
      setVideoFile(null);
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    }
    setUploading(false);
  };

  const deleteProject = async (id: string) => {
    await supabase.from("coaching_analysis" as any).delete().eq("id", id);
    if (activeProject?.id === id) setActiveProject(null);
    toast.success("Deleted");
    loadProjects();
  };

  const openProject = (p: AnnotationProject) => {
    setActiveProject(p);
    setActions([]);
    setUndoneActions([]);
    setActiveFrame(null);
  };

  // ── Canvas drawing logic ──
  const getCanvasPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 854;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const allActions = [...actions, ...(currentAction ? [currentAction] : [])];
    allActions.forEach(action => {
      ctx.strokeStyle = action.color;
      ctx.fillStyle = action.color;
      ctx.lineWidth = action.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (action.tool === "pen" && action.points.length > 1) {
        ctx.beginPath();
        action.points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
        ctx.stroke();
      } else if ((action.tool === "arrow" || action.tool === "line") && action.points.length >= 2) {
        const s = action.points[0], e = action.points[action.points.length - 1];
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(e.x, e.y); ctx.stroke();
        if (action.tool === "arrow") {
          const angle = Math.atan2(e.y - s.y, e.x - s.x);
          const hl = 15;
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(e.x - hl * Math.cos(angle - 0.4), e.y - hl * Math.sin(angle - 0.4));
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(e.x - hl * Math.cos(angle + 0.4), e.y - hl * Math.sin(angle + 0.4));
          ctx.stroke();
        }
      } else if (action.tool === "circle" && action.points.length >= 2) {
        const s = action.points[0], e = action.points[action.points.length - 1];
        const rx = Math.abs(e.x - s.x) / 2, ry = Math.abs(e.y - s.y) / 2;
        ctx.beginPath();
        ctx.ellipse((s.x + e.x) / 2, (s.y + e.y) / 2, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (action.tool === "rectangle" && action.points.length >= 2) {
        const s = action.points[0], e = action.points[action.points.length - 1];
        ctx.strokeRect(s.x, s.y, e.x - s.x, e.y - s.y);
      } else if (action.tool === "text" && action.text && action.points.length >= 1) {
        ctx.font = `bold ${action.lineWidth * 5}px sans-serif`;
        ctx.fillText(action.text, action.points[0].x, action.points[0].y);
      }
    });
  }, [actions, currentAction]);

  useEffect(() => {
    if (activeProject) {
      const interval = setInterval(redrawCanvas, 50);
      return () => clearInterval(interval);
    }
  }, [activeProject, redrawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = getCanvasPoint(e);
    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        setActions(prev => [...prev, { tool, color, lineWidth, points: [pt], text }]);
        setUndoneActions([]);
      }
      return;
    }
    setIsDrawing(true);
    setCurrentAction({ tool, color, lineWidth, points: [pt] });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAction) return;
    const pt = getCanvasPoint(e);
    if (tool === "pen") {
      setCurrentAction({ ...currentAction, points: [...currentAction.points, pt] });
    } else {
      setCurrentAction({ ...currentAction, points: [currentAction.points[0], pt] });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentAction && currentAction.points.length >= 2) {
      setActions(prev => [...prev, currentAction]);
      setUndoneActions([]);
    }
    setIsDrawing(false);
    setCurrentAction(null);
  };

  const undo = () => {
    if (actions.length === 0) return;
    setUndoneActions(prev => [...prev, actions[actions.length - 1]]);
    setActions(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (undoneActions.length === 0) return;
    setActions(prev => [...prev, undoneActions[undoneActions.length - 1]]);
    setUndoneActions(prev => prev.slice(0, -1));
  };

  const saveFrame = async () => {
    if (!activeProject) return;
    const frame: AnnotationFrame = {
      id: crypto.randomUUID(),
      time: currentTime,
      actions: [...actions],
      label: `Frame @ ${Math.floor(currentTime)}s`,
    };
    const updatedFrames = [...activeProject.frames, frame];
    const { error } = await supabase
      .from("coaching_analysis" as any)
      .update({ attachments: updatedFrames as any })
      .eq("id", activeProject.id);
    if (error) { toast.error("Save failed"); return; }
    setActiveProject({ ...activeProject, frames: updatedFrames });
    toast.success("Frame saved");
  };

  const loadFrame = (frame: AnnotationFrame) => {
    if (videoRef.current) {
      videoRef.current.currentTime = frame.time;
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setActions(frame.actions);
    setUndoneActions([]);
    setActiveFrame(frame);
  };

  const exportFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `annotation-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Exported");
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause(); else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const tools: { id: Tool; icon: any; label: string }[] = [
    { id: "pen", icon: Pencil, label: "Pen" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "text", icon: Type, label: "Text" },
  ];

  // ── Projects List ──
  if (!activeProject) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pencil className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Annotations</h2>
              <p className="text-sm text-muted-foreground">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Button onClick={() => setShowCreate(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Pencil className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No annotation projects</p>
              <p className="text-sm">Upload a video and draw annotations on freeze-frames</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {projects.map(p => (
              <Card key={p.id} className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => openProject(p)}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Pencil className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.frames.length} frame{p.frames.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader><DialogTitle>New Annotation Project</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Project Name *</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. vs Arsenal analysis" />
              </div>
              <div>
                <Label>Video File *</Label>
                <Input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={handleCreateProject} disabled={uploading} className="w-full">
                {uploading ? "Uploading..." : "Create Project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ── Annotation Editor ──
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setActiveProject(null)}>← Back</Button>
        <h2 className="text-lg font-semibold truncate">{activeProject.name}</h2>
      </div>

      {/* Hidden video for source */}
      <video
        ref={videoRef}
        src={activeProject.video_url}
        className="hidden"
        onTimeUpdate={() => { if (videoRef.current) setCurrentTime(videoRef.current.currentTime); }}
        onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
      />

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full rounded-lg border border-border cursor-crosshair"
          style={{ aspectRatio: "16/9" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Transport */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => { if (videoRef.current) videoRef.current.currentTime -= 5; }}>
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={togglePlayPause}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={() => { if (videoRef.current) videoRef.current.currentTime += 5; }}>
          <SkipForward className="w-4 h-4" />
        </Button>
        <span className="text-xs text-muted-foreground font-mono">
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </span>

        <div className="ml-auto flex items-center gap-1">
          {tools.map(t => {
            const Icon = t.icon;
            return (
              <Button key={t.id} variant={tool === t.id ? "default" : "outline"} size="sm" onClick={() => setTool(t.id)} title={t.label}>
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Color & line width + actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1">
          {COLORS.map(c => (
            <button
              key={c}
              className={`w-5 h-5 rounded-full border-2 ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="w-24">
          <Slider value={[lineWidth]} onValueChange={v => setLineWidth(v[0])} min={1} max={8} step={1} />
        </div>
        <div className="h-5 w-px bg-border" />
        <Button variant="outline" size="sm" onClick={undo}><Undo2 className="w-4 h-4" /></Button>
        <Button variant="outline" size="sm" onClick={redo}><Redo2 className="w-4 h-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => { setActions([]); setUndoneActions([]); }}><Trash2 className="w-4 h-4" /></Button>
        <Button variant="outline" size="sm" onClick={saveFrame}><Save className="w-4 h-4 mr-1" /> Save Frame</Button>
        <Button variant="outline" size="sm" onClick={exportFrame}><Download className="w-4 h-4 mr-1" /> Export</Button>
      </div>

      {/* Saved Frames */}
      {activeProject.frames.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-muted-foreground">Saved Frames ({activeProject.frames.length})</h4>
          <div className="flex gap-2 flex-wrap">
            {activeProject.frames.map(f => (
              <Badge
                key={f.id}
                variant={activeFrame?.id === f.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => loadFrame(f)}
              >
                {f.label} ({f.actions.length} drawings)
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
