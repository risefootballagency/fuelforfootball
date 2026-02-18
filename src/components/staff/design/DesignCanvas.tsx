import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Undo2, Redo2, ZoomIn, ZoomOut, Grid3X3, Magnet, Plus,
  Copy, Trash2, ChevronLeft, Layers, Palette, LayoutTemplate,
  ImageIcon, SlidersHorizontal, Settings2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDesignCanvas } from './useDesignCanvas';
import { CanvasElement } from './CanvasElement';
import { LayersPanel } from './LayersPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { BrandKitPanel } from './BrandKitPanel';
import { TemplatesPanel } from './TemplatesPanel';
import { SavedAssetsPanel } from './SavedAssetsPanel';
import { FiltersPanel } from './FiltersPanel';
import { FloatingToolbar } from './FloatingToolbar';
import { ExportDialog } from './ExportDialog';
import { CANVAS_PRESETS, type DesignProject, type DesignTemplate } from './types';

interface DesignStudioProps {
  initialProject?: DesignProject;
  onBack?: () => void;
}

export function DesignCanvas({ initialProject, onBack }: DesignStudioProps) {
  const canvas = useDesignCanvas(initialProject);
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [leftPanel, setLeftPanel] = useState<'layers' | 'templates' | 'assets' | 'brand' | null>('layers');
  const [rightPanel, setRightPanel] = useState<'properties' | 'filters' | null>('properties');
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const selectedElement = canvas.selectedIds.length === 1
    ? (canvas.currentPage?.elements || []).find(el => el.id === canvas.selectedIds[0])
    : null;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.contentEditable === 'true') return;
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;

      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); canvas.undo(); }
      if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); canvas.redo(); }
      if (mod && e.key === 'c') { e.preventDefault(); canvas.copySelected(); }
      if (mod && e.key === 'v') { e.preventDefault(); canvas.paste(); }
      if (mod && e.key === 'a') { e.preventDefault(); canvas.selectAll(); }
      if (mod && e.key === 'd') { e.preventDefault(); canvas.duplicateSelected(); }
      if (e.key === 'Delete' || e.key === 'Backspace') { if (canvas.selectedIds.length) { e.preventDefault(); canvas.deleteSelected(); } }
      if (e.key === 'Escape') canvas.deselectAll();
      if (e.key === 'v') canvas.setActiveTool('select');
      if (e.key === 't') canvas.setActiveTool('text');
      if (e.key === 'h') canvas.setActiveTool('hand');
      if (e.key === 'l') canvas.setActiveTool('line');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canvas]);

  // Canvas click handler
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === containerRef.current) {
      canvas.deselectAll();
    }
    if (canvas.activeTool === 'text') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / canvas.zoom;
        const y = (e.clientY - rect.top) / canvas.zoom;
        canvas.addText();
        // Position near click
        const els = canvas.currentPage?.elements || [];
        const last = els[els.length - 1];
        if (last) canvas.updateElement(last.id, { x: x - 150, y: y - 30 });
      }
    }
    if (canvas.activeTool === 'line') {
      canvas.addLine();
      canvas.setActiveTool('select');
    }
  }, [canvas]);

  // Pan handling
  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    if (canvas.activeTool === 'hand' || e.button === 1) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, ox: canvas.panOffset.x, oy: canvas.panOffset.y };
      e.preventDefault();
    }
  }, [canvas.activeTool, canvas.panOffset]);

  useEffect(() => {
    if (!isPanning) return;
    const move = (e: MouseEvent) => {
      canvas.setPanOffset({
        x: panStart.current.ox + (e.clientX - panStart.current.x),
        y: panStart.current.oy + (e.clientY - panStart.current.y),
      });
    };
    const up = () => setIsPanning(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [isPanning, canvas]);

  // Zoom with scroll
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      canvas.setZoom(z => Math.min(3, Math.max(0.1, z + delta)));
    }
  }, [canvas]);

  // Element drag with snap
  const handleElementDrag = useCallback((id: string, x: number, y: number) => {
    const el = (canvas.currentPage?.elements || []).find(e => e.id === id);
    if (!el) return;
    const others = (canvas.currentPage?.elements || []).filter(e => e.id !== id);
    const snapped = canvas.calculateSnap({ ...el, x, y }, others);
    canvas.updateElement(id, { x: snapped.x, y: snapped.y });
    canvas.setSnapLines(snapped.lines);
  }, [canvas]);

  const handleDragEnd = useCallback(() => {
    canvas.setSnapLines([]);
  }, [canvas]);

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) canvas.addImage(ev.target.result as string, file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [canvas]);

  const handleApplyTemplate = useCallback((template: DesignTemplate) => {
    canvas.setProject(prev => ({
      ...prev,
      width: template.width,
      height: template.height,
      background: template.background,
      pages: [{
        id: Math.random().toString(36).slice(2),
        name: template.name,
        elements: template.elements.map((el, i) => ({
          id: Math.random().toString(36).slice(2),
          type: el.type || 'text',
          x: el.x || 0,
          y: el.y || 0,
          width: el.width || 200,
          height: el.height || 50,
          rotation: 0,
          opacity: el.opacity ?? 1,
          locked: false,
          visible: true,
          name: `${el.type || 'element'} ${i + 1}`,
          ...el,
        })) as any,
        background: template.background,
      }],
      updatedAt: new Date().toISOString(),
    }));
    canvas.deselectAll();
    toast.success(`Applied template: ${template.name}`);
  }, [canvas]);

  const elements = canvas.currentPage?.elements || [];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-muted/20 rounded-lg border overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-2 py-1 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-1.5">
          {onBack && (
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={onBack}>
              <ChevronLeft className="h-3 w-3" /> Back
            </Button>
          )}
          <Input
            value={canvas.project.name}
            onChange={e => canvas.setProject(p => ({ ...p, name: e.target.value }))}
            className="h-7 w-40 text-xs border-none bg-transparent font-medium"
          />
          <span className="text-[10px] text-muted-foreground">{canvas.project.width}×{canvas.project.height}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={canvas.undo} disabled={canvas.historyIndex <= 0}>
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={canvas.redo} disabled={canvas.historyIndex >= canvas.historyLength - 1}>
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => canvas.setZoom(z => Math.min(3, z + 0.1))}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[10px] text-muted-foreground w-10 text-center">{Math.round(canvas.zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => canvas.setZoom(z => Math.max(0.1, z - 0.1))}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant={canvas.showGrid ? 'default' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => canvas.setShowGrid(v => !v)}>
            <Grid3X3 className="h-3.5 w-3.5" />
          </Button>
          <Button variant={canvas.snapEnabled ? 'default' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => canvas.setSnapEnabled(v => !v)}>
            <Magnet className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <ExportDialog canvasRef={canvasRef} projectName={canvas.project.name} width={canvas.project.width} height={canvas.project.height} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar tabs */}
        <div className="flex border-r bg-background">
          <div className="flex flex-col gap-0.5 p-1 border-r">
            {[
              { key: 'layers' as const, icon: Layers, label: 'Layers' },
              { key: 'templates' as const, icon: LayoutTemplate, label: 'Templates' },
              { key: 'assets' as const, icon: ImageIcon, label: 'Assets' },
              { key: 'brand' as const, icon: Palette, label: 'Brand' },
            ].map(item => (
              <Button
                key={item.key}
                variant={leftPanel === item.key ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setLeftPanel(prev => prev === item.key ? null : item.key)}
                title={item.label}
              >
                <item.icon className="h-3.5 w-3.5" />
              </Button>
            ))}
          </div>

          {/* Left panel content */}
          {leftPanel && (
            <div className="w-56 overflow-y-auto">
              {leftPanel === 'layers' && (
                <LayersPanel
                  elements={elements}
                  selectedIds={canvas.selectedIds}
                  onSelect={(id, multi) => {
                    if (multi) canvas.setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                    else canvas.setSelectedIds([id]);
                  }}
                  onUpdate={canvas.updateElement}
                  onReorder={canvas.reorderElements}
                  onDelete={() => canvas.deleteSelected()}
                  onDuplicate={() => canvas.duplicateSelected()}
                  onMoveLayer={canvas.moveLayer}
                  onAlign={canvas.alignElement}
                />
              )}
              {leftPanel === 'templates' && (
                <TemplatesPanel onApplyTemplate={handleApplyTemplate} />
              )}
              {leftPanel === 'assets' && (
                <SavedAssetsPanel onAddImage={(url, name) => canvas.addImage(url, name)} />
              )}
              {leftPanel === 'brand' && (
                <BrandKitPanel
                  onApplyColour={(c) => {
                    if (selectedElement) {
                      if (selectedElement.type === 'text') canvas.updateElement(selectedElement.id, { color: c });
                      else if (selectedElement.type === 'shape') canvas.updateElement(selectedElement.id, { fill: c });
                    }
                  }}
                  onApplyFont={(f) => {
                    if (selectedElement?.type === 'text') canvas.updateElement(selectedElement.id, { fontFamily: f });
                  }}
                  onAddLogo={(url) => canvas.addImage(url, 'Brand Logo')}
                />
              )}
            </div>
          )}
        </div>

        {/* Canvas area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden relative"
          style={{ cursor: canvas.activeTool === 'hand' || isPanning ? 'grab' : 'default' }}
          onMouseDown={handleContainerMouseDown}
          onWheel={handleWheel}
        >
          <FloatingToolbar
            activeTool={canvas.activeTool}
            onToolChange={canvas.setActiveTool}
            onAddShape={canvas.addShape}
            onAddImage={handleImageUpload}
          />

          <div
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${canvas.panOffset.x}px, ${canvas.panOffset.y}px)`,
            }}
          >
            {/* Canvas */}
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{
                width: canvas.project.width,
                height: canvas.project.height,
                transform: `scale(${canvas.zoom})`,
                transformOrigin: 'center center',
                backgroundColor: canvas.currentPage?.background || canvas.project.background,
                backgroundImage: canvas.currentPage?.backgroundImage ? `url(${canvas.currentPage.backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                position: 'relative',
              }}
            >
              {/* Grid overlay */}
              {canvas.showGrid && (
                <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" style={{ zIndex: 0 }}>
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              )}

              {/* Elements */}
              {elements.map(el => (
                <CanvasElement
                  key={el.id}
                  element={el}
                  isSelected={canvas.selectedIds.includes(el.id)}
                  zoom={canvas.zoom}
                  onSelect={(id, multi) => {
                    if (multi) canvas.setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                    else canvas.setSelectedIds([id]);
                  }}
                  onUpdate={canvas.updateElement}
                  onDragStart={() => {}}
                  onDragEnd={handleDragEnd}
                  onDrag={handleElementDrag}
                />
              ))}

              {/* Snap lines */}
              {canvas.snapLines.map((line, i) => (
                <div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    backgroundColor: '#a855f7',
                    ...(line.type === 'vertical'
                      ? { left: line.position, top: 0, width: 1, height: '100%' }
                      : { top: line.position, left: 0, height: 1, width: '100%' }),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Page navigation */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background/95 backdrop-blur border rounded-lg px-2 py-1 shadow-lg z-20">
            {canvas.pages.map((page, i) => (
              <Button
                key={page.id}
                variant={i === canvas.currentPageIndex ? 'default' : 'ghost'}
                size="sm"
                className="h-6 text-[10px] px-2"
                onClick={() => canvas.switchPage(i)}
              >
                {page.name}
              </Button>
            ))}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={canvas.addPage}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex border-l bg-background">
          {rightPanel && (
            <div className="w-60 overflow-y-auto">
              {rightPanel === 'properties' && selectedElement && (
                <PropertiesPanel
                  element={selectedElement}
                  onUpdate={(id, updates) => canvas.updateElement(id, updates)}
                />
              )}
              {rightPanel === 'properties' && !selectedElement && (
                <div className="p-3 space-y-3 text-xs">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Canvas Settings</p>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {CANVAS_PRESETS.map(p => (
                        <Button
                          key={p.name}
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] justify-start"
                          onClick={() => canvas.setProject(prev => ({ ...prev, width: p.width, height: p.height }))}
                        >
                          {p.name}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        value={canvas.project.width}
                        onChange={e => canvas.setProject(p => ({ ...p, width: parseInt(e.target.value) || 1080 }))}
                        className="h-7 text-xs"
                        placeholder="Width"
                      />
                      <span className="text-muted-foreground">×</span>
                      <Input
                        type="number"
                        value={canvas.project.height}
                        onChange={e => canvas.setProject(p => ({ ...p, height: parseInt(e.target.value) || 1080 }))}
                        className="h-7 text-xs"
                        placeholder="Height"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground">Background</p>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={canvas.currentPage?.background || '#ffffff'}
                          onChange={e => {
                            const newPages = canvas.pages.map((p, i) =>
                              i === canvas.currentPageIndex ? { ...p, background: e.target.value } : p
                            );
                            canvas.setProject(prev => ({ ...prev, pages: newPages, background: e.target.value }));
                          }}
                          className="w-8 h-7 rounded cursor-pointer border"
                        />
                        <span className="text-[10px] text-muted-foreground">{canvas.currentPage?.background}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {rightPanel === 'filters' && selectedElement?.type === 'image' && (
                <FiltersPanel
                  currentFilter={selectedElement.filter}
                  onApplyFilter={f => canvas.updateElement(selectedElement.id, { filter: f })}
                />
              )}
            </div>
          )}
          <div className="flex flex-col gap-0.5 p-1 border-l">
            {[
              { key: 'properties' as const, icon: Settings2, label: 'Properties' },
              { key: 'filters' as const, icon: SlidersHorizontal, label: 'Filters' },
            ].map(item => (
              <Button
                key={item.key}
                variant={rightPanel === item.key ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setRightPanel(prev => prev === item.key ? null : item.key)}
                title={item.label}
              >
                <item.icon className="h-3.5 w-3.5" />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
}
