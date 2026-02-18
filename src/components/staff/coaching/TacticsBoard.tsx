import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  LayoutGrid, Undo2, Redo2, Trash2, Download, Pencil, Circle,
  ArrowRight, Move, RotateCcw, Save, Type,
} from "lucide-react";

type Tool = "move" | "pen" | "arrow" | "circle" | "text";

interface PlayerMarker {
  id: string;
  x: number;
  y: number;
  number: string;
  team: "home" | "away";
}

interface DrawAction {
  tool: Tool;
  color: string;
  lineWidth: number;
  points: { x: number; y: number }[];
  text?: string;
}

const FORMATIONS: Record<string, { positions: { x: number; y: number }[] }> = {
  "4-3-3": {
    positions: [
      { x: 50, y: 90 }, // GK
      { x: 15, y: 70 }, { x: 35, y: 75 }, { x: 65, y: 75 }, { x: 85, y: 70 }, // DEF
      { x: 30, y: 50 }, { x: 50, y: 55 }, { x: 70, y: 50 }, // MID
      { x: 20, y: 25 }, { x: 50, y: 20 }, { x: 80, y: 25 }, // FWD
    ],
  },
  "4-4-2": {
    positions: [
      { x: 50, y: 90 },
      { x: 15, y: 70 }, { x: 35, y: 75 }, { x: 65, y: 75 }, { x: 85, y: 70 },
      { x: 15, y: 45 }, { x: 38, y: 50 }, { x: 62, y: 50 }, { x: 85, y: 45 },
      { x: 35, y: 22 }, { x: 65, y: 22 },
    ],
  },
  "3-5-2": {
    positions: [
      { x: 50, y: 90 },
      { x: 25, y: 72 }, { x: 50, y: 75 }, { x: 75, y: 72 },
      { x: 10, y: 48 }, { x: 30, y: 50 }, { x: 50, y: 45 }, { x: 70, y: 50 }, { x: 90, y: 48 },
      { x: 35, y: 22 }, { x: 65, y: 22 },
    ],
  },
  "4-2-3-1": {
    positions: [
      { x: 50, y: 90 },
      { x: 15, y: 70 }, { x: 35, y: 75 }, { x: 65, y: 75 }, { x: 85, y: 70 },
      { x: 38, y: 55 }, { x: 62, y: 55 },
      { x: 20, y: 35 }, { x: 50, y: 32 }, { x: 80, y: 35 },
      { x: 50, y: 15 },
    ],
  },
  "3-4-3": {
    positions: [
      { x: 50, y: 90 },
      { x: 25, y: 72 }, { x: 50, y: 75 }, { x: 75, y: 72 },
      { x: 15, y: 48 }, { x: 38, y: 50 }, { x: 62, y: 50 }, { x: 85, y: 48 },
      { x: 20, y: 22 }, { x: 50, y: 18 }, { x: 80, y: 22 },
    ],
  },
};

const COLORS = ["#00FF87", "#FF4444", "#FFD700", "#3B82F6", "#FFFFFF", "#FF6B35"];

export const TacticsBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("move");
  const [color, setColor] = useState("#00FF87");
  const [lineWidth, setLineWidth] = useState(3);
  const [formation, setFormation] = useState("4-3-3");
  const [players, setPlayers] = useState<PlayerMarker[]>([]);
  const [drawings, setDrawings] = useState<DrawAction[]>([]);
  const [undone, setUndone] = useState<DrawAction[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDraw, setCurrentDraw] = useState<DrawAction | null>(null);
  const [draggingPlayer, setDraggingPlayer] = useState<string | null>(null);

  useEffect(() => {
    applyFormation(formation);
  }, []);

  useEffect(() => {
    redraw();
  }, [players, drawings, currentDraw, draggingPlayer]);

  const applyFormation = (f: string) => {
    const form = FORMATIONS[f];
    if (!form) return;
    const markers = form.positions.map((pos, i) => ({
      id: `p${i}`,
      x: pos.x,
      y: pos.y,
      number: i === 0 ? "GK" : String(i),
      team: "home" as const,
    }));
    setPlayers(markers);
    setFormation(f);
  };

  const getCanvasPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Draw pitch
    ctx.fillStyle = "#1a472a";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    // Border
    ctx.strokeRect(w * 0.05, h * 0.05, w * 0.9, h * 0.9);
    // Centre line
    ctx.beginPath();
    ctx.moveTo(w * 0.05, h * 0.5);
    ctx.lineTo(w * 0.95, h * 0.5);
    ctx.stroke();
    // Centre circle
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, w * 0.1, 0, Math.PI * 2);
    ctx.stroke();
    // Penalty areas
    ctx.strokeRect(w * 0.25, h * 0.05, w * 0.5, h * 0.15);
    ctx.strokeRect(w * 0.25, h * 0.8, w * 0.5, h * 0.15);
    // Goal areas
    ctx.strokeRect(w * 0.35, h * 0.05, w * 0.3, h * 0.06);
    ctx.strokeRect(w * 0.35, h * 0.89, w * 0.3, h * 0.06);

    // Draw drawings
    [...drawings, ...(currentDraw ? [currentDraw] : [])].forEach(action => {
      if (action.points.length < 2 && action.tool !== "text") return;
      ctx.strokeStyle = action.color;
      ctx.lineWidth = action.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (action.tool === "pen") {
        ctx.beginPath();
        action.points.forEach((p, i) => {
          const px = (p.x / 100) * w;
          const py = (p.y / 100) * h;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
      } else if (action.tool === "arrow" && action.points.length >= 2) {
        const start = action.points[0];
        const end = action.points[action.points.length - 1];
        const sx = (start.x / 100) * w, sy = (start.y / 100) * h;
        const ex = (end.x / 100) * w, ey = (end.y / 100) * h;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        // Arrowhead
        const angle = Math.atan2(ey - sy, ex - sx);
        const headLen = 12;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - headLen * Math.cos(angle - 0.4), ey - headLen * Math.sin(angle - 0.4));
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - headLen * Math.cos(angle + 0.4), ey - headLen * Math.sin(angle + 0.4));
        ctx.stroke();
      } else if (action.tool === "circle" && action.points.length >= 2) {
        const start = action.points[0];
        const end = action.points[action.points.length - 1];
        const cx = ((start.x + end.x) / 200) * w;
        const cy = ((start.y + end.y) / 200) * h;
        const rx = Math.abs(end.x - start.x) / 200 * w;
        const ry = Math.abs(end.y - start.y) / 200 * h;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (action.tool === "text" && action.text && action.points.length >= 1) {
        ctx.fillStyle = action.color;
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(action.text, (action.points[0].x / 100) * w, (action.points[0].y / 100) * h);
      }
    });

    // Draw player markers
    players.forEach(p => {
      const px = (p.x / 100) * w;
      const py = (p.y / 100) * h;
      const r = 14;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = p.team === "home" ? "#3B82F6" : "#EF4444";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "white";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.number, px, py);
    });
  }, [players, drawings, currentDraw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = getCanvasPoint(e);
    
    if (tool === "move") {
      const hit = players.find(p => Math.hypot(p.x - pt.x, p.y - pt.y) < 5);
      if (hit) setDraggingPlayer(hit.id);
      return;
    }

    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        setDrawings(prev => [...prev, { tool: "text", color, lineWidth, points: [pt], text }]);
        setUndone([]);
      }
      return;
    }

    setIsDrawing(true);
    setCurrentDraw({ tool, color, lineWidth, points: [pt] });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pt = getCanvasPoint(e);

    if (draggingPlayer) {
      setPlayers(prev => prev.map(p => p.id === draggingPlayer ? { ...p, x: pt.x, y: pt.y } : p));
      return;
    }

    if (isDrawing && currentDraw) {
      if (tool === "pen") {
        setCurrentDraw({ ...currentDraw, points: [...currentDraw.points, pt] });
      } else {
        setCurrentDraw({ ...currentDraw, points: [currentDraw.points[0], pt] });
      }
    }
  };

  const handleMouseUp = () => {
    if (draggingPlayer) { setDraggingPlayer(null); return; }
    if (isDrawing && currentDraw && currentDraw.points.length >= 2) {
      setDrawings(prev => [...prev, currentDraw]);
      setUndone([]);
    }
    setIsDrawing(false);
    setCurrentDraw(null);
  };

  const undo = () => {
    if (drawings.length === 0) return;
    const last = drawings[drawings.length - 1];
    setDrawings(prev => prev.slice(0, -1));
    setUndone(prev => [...prev, last]);
  };

  const redo = () => {
    if (undone.length === 0) return;
    const last = undone[undone.length - 1];
    setUndone(prev => prev.slice(0, -1));
    setDrawings(prev => [...prev, last]);
  };

  const clearAll = () => {
    setDrawings([]);
    setUndone([]);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `tactics-${formation}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Image exported");
  };

  const tools: { id: Tool; icon: any; label: string }[] = [
    { id: "move", icon: Move, label: "Move" },
    { id: "pen", icon: Pencil, label: "Draw" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutGrid className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Tactics Board</h2>
        </div>
        <Select value={formation} onValueChange={applyFormation}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(FORMATIONS).map(f => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {tools.map(t => {
          const Icon = t.icon;
          return (
            <Button
              key={t.id}
              variant={tool === t.id ? "default" : "outline"}
              size="sm"
              onClick={() => setTool(t.id)}
              title={t.label}
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
        <div className="h-6 w-px bg-border mx-1" />
        <div className="flex gap-1">
          {COLORS.map(c => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="h-6 w-px bg-border mx-1" />
        <Button variant="outline" size="sm" onClick={undo} title="Undo">
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={redo} title="Redo">
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={clearAll} title="Clear drawings">
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => applyFormation(formation)} title="Reset positions">
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={exportImage} title="Export image">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full rounded-lg cursor-crosshair border border-border"
          style={{ aspectRatio: "4/3" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Drag players to reposition. Select a drawing tool and draw on the pitch. Use formations dropdown to reset.
      </p>
    </div>
  );
};
