import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Pencil, Circle, ArrowRight, Type, Undo2, Redo2, Trash2, Download, Play, Pause,
  SkipBack, SkipForward, Palette,
} from "lucide-react";
import { toast } from "sonner";

type Tool = "pen" | "arrow" | "circle" | "text";
type DrawAction = {
  tool: Tool;
  color: string;
  lineWidth: number;
  points: { x: number; y: number }[];
  text?: string;
};

const COLORS = ["#00FF87", "#FF4444", "#FFD700", "#3B82F6", "#FFFFFF", "#FF6B35"];

export const KlipDraw = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
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
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    actions.forEach((action) => {
      ctx.strokeStyle = action.color;
      ctx.fillStyle = action.color;
      ctx.lineWidth = action.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (action.tool === "pen" && action.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(action.points[0].x, action.points[0].y);
        action.points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      } else if (action.tool === "arrow" && action.points.length >= 2) {
        const start = action.points[0];
        const end = action.points[action.points.length - 1];
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        // Arrowhead
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLen = 15;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      } else if (action.tool === "circle" && action.points.length >= 2) {
        const start = action.points[0];
        const end = action.points[action.points.length - 1];
        const rx = Math.abs(end.x - start.x) / 2;
        const ry = Math.abs(end.y - start.y) / 2;
        const cx = (start.x + end.x) / 2;
        const cy = (start.y + end.y) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (action.tool === "text" && action.text && action.points.length > 0) {
        ctx.font = `bold ${action.lineWidth * 6}px 'Bebas Neue', sans-serif`;
        ctx.fillText(action.text, action.points[0].x, action.points[0].y);
      }
    });
  }, [actions]);

  useEffect(() => { redrawCanvas(); }, [redrawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "text") {
      const point = getCanvasPoint(e);
      const text = prompt("Enter annotation text:");
      if (text) {
        const newAction: DrawAction = { tool, color, lineWidth, points: [point], text };
        setActions((prev) => [...prev, newAction]);
        setUndoneActions([]);
      }
      return;
    }
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    setCurrentAction({ tool, color, lineWidth, points: [point] });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAction) return;
    const point = getCanvasPoint(e);
    if (tool === "pen") {
      setCurrentAction({ ...currentAction, points: [...currentAction.points, point] });
    } else {
      setCurrentAction({ ...currentAction, points: [currentAction.points[0], point] });
    }
    // Live preview
    redrawCanvas();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && currentAction) {
      ctx.strokeStyle = currentAction.color;
      ctx.lineWidth = currentAction.lineWidth;
      ctx.lineCap = "round";
      const pts = tool === "pen" ? [...currentAction.points, point] : [currentAction.points[0], point];
      if (tool === "pen") {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      } else if (tool === "arrow") {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      } else if (tool === "circle") {
        const rx = Math.abs(point.x - pts[0].x) / 2;
        const ry = Math.abs(point.y - pts[0].y) / 2;
        ctx.beginPath();
        ctx.ellipse((pts[0].x + point.x) / 2, (pts[0].y + point.y) / 2, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentAction) {
      setActions((prev) => [...prev, currentAction]);
      setUndoneActions([]);
    }
    setIsDrawing(false);
    setCurrentAction(null);
  };

  const undo = () => {
    if (actions.length === 0) return;
    const last = actions[actions.length - 1];
    setActions((prev) => prev.slice(0, -1));
    setUndoneActions((prev) => [...prev, last]);
  };

  const redo = () => {
    if (undoneActions.length === 0) return;
    const last = undoneActions[undoneActions.length - 1];
    setUndoneActions((prev) => prev.slice(0, -1));
    setActions((prev) => [...prev, last]);
  };

  const clearAll = () => { setActions([]); setUndoneActions([]); };

  const exportFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext("2d")!;

    if (video && videoLoaded) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = `klipdraw-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
    toast.success("Frame exported");
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause(); else video.play();
    setIsPlaying(!isPlaying);
  };

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
  };

  const tools: { id: Tool; icon: typeof Pencil; label: string }[] = [
    { id: "pen", icon: Pencil, label: "Pen" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Pencil className="w-5 h-5 text-primary" />
        <h2 className="font-bebas text-2xl text-foreground tracking-wider">KlipDraw</h2>
        <span className="text-xs text-muted-foreground">Video Annotation Tool</span>
      </div>

      {/* Video URL Input */}
      <div className="flex gap-2">
        <Input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste video URL or file path..."
          className="flex-1"
        />
        <Button
          size="sm"
          onClick={() => {
            if (videoUrl) setVideoLoaded(true);
          }}
        >
          Load
        </Button>
      </div>

      {/* Canvas Area */}
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative bg-black">
          {videoLoaded && (
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onEnded={() => setIsPlaying(false)}
              crossOrigin="anonymous"
            />
          )}
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="relative w-full cursor-crosshair"
            style={{ aspectRatio: "16/9" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </CardContent>
      </Card>

      {/* Video Controls */}
      {videoLoaded && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => seek(-5)}><SkipBack className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={togglePlay}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => seek(5)}><SkipForward className="w-4 h-4" /></Button>
          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={([v]) => { if (videoRef.current) videoRef.current.currentTime = v; }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">
            {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}
          </span>
        </div>
      )}

      {/* Drawing Tools */}
      <div className="flex flex-wrap items-center gap-2">
        {tools.map((t) => (
          <Button
            key={t.id}
            variant={tool === t.id ? "default" : "outline"}
            size="sm"
            onClick={() => setTool(t.id)}
            className="gap-1.5"
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </Button>
        ))}

        <div className="w-px h-6 bg-border mx-1" />

        {/* Colours */}
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
            style={{ backgroundColor: c }}
          />
        ))}

        <div className="w-px h-6 bg-border mx-1" />

        {/* Line Width */}
        <div className="flex items-center gap-2 w-32">
          <Label className="text-xs text-muted-foreground">Size</Label>
          <Slider value={[lineWidth]} min={1} max={10} step={1} onValueChange={([v]) => setLineWidth(v)} />
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <Button variant="ghost" size="sm" onClick={undo} disabled={actions.length === 0}><Undo2 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={redo} disabled={undoneActions.length === 0}><Redo2 className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
        <Button variant="outline" size="sm" onClick={exportFrame} className="gap-1.5 ml-auto"><Download className="w-4 h-4" /> Export</Button>
      </div>
    </div>
  );
};

export default KlipDraw;
