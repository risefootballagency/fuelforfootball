import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Plus, Grid, List, Folder, FolderPlus, MoreVertical,
  Edit, Trash2, Copy, ChevronLeft, Palette, FileText, Image
} from "lucide-react";
import { DesignCanvas } from "./DesignCanvas";

interface DesignProject {
  id: string;
  name: string;
  folderId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  preset: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  data?: any; // saved canvas state
}

interface ProjectFolder {
  id: string;
  name: string;
  color: string;
}

const CANVAS_PRESETS = [
  { name: "Instagram Post", width: 1080, height: 1080, icon: "📸" },
  { name: "Instagram Story", width: 1080, height: 1920, icon: "📱" },
  { name: "Facebook Post", width: 1200, height: 630, icon: "👤" },
  { name: "Twitter Post", width: 1600, height: 900, icon: "🐦" },
  { name: "A4 Portrait", width: 2480, height: 3508, icon: "📄" },
  { name: "A4 Landscape", width: 3508, height: 2480, icon: "📃" },
  { name: "Presentation 16:9", width: 1920, height: 1080, icon: "🖥️" },
  { name: "Custom", width: 1080, height: 1080, icon: "✏️" },
];

const FOLDER_COLORS = [
  "#fdc61b", "#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#f97316", "#06b6d4", "#ec4899"
];

const STORAGE_KEY = "design-studio-projects";
const FOLDERS_KEY = "design-studio-folders";

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const DesignProjects = () => {
  const [projects, setProjects] = useState<DesignProject[]>(() => loadFromStorage(STORAGE_KEY, []));
  const [folders, setFolders] = useState<ProjectFolder[]>(() => loadFromStorage(FOLDERS_KEY, []));
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeProject, setActiveProject] = useState<DesignProject | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renamingProject, setRenamingProject] = useState<DesignProject | null>(null);
  const [newName, setNewName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);
  const [selectedPreset, setSelectedPreset] = useState(CANVAS_PRESETS[0]);
  const [customWidth, setCustomWidth] = useState("1080");
  const [customHeight, setCustomHeight] = useState("1080");

  // Persist
  useEffect(() => { saveToStorage(STORAGE_KEY, projects); }, [projects]);
  useEffect(() => { saveToStorage(FOLDERS_KEY, folders); }, [folders]);

  const createProject = () => {
    const width = selectedPreset.name === "Custom" ? parseInt(customWidth) || 1080 : selectedPreset.width;
    const height = selectedPreset.name === "Custom" ? parseInt(customHeight) || 1080 : selectedPreset.height;
    const project: DesignProject = {
      id: crypto.randomUUID(),
      name: newName || `Untitled ${selectedPreset.name}`,
      folderId: activeFolderId,
      canvasWidth: width,
      canvasHeight: height,
      preset: selectedPreset.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [project, ...prev]);
    setShowNewDialog(false);
    setNewName("");
    setActiveProject(project);
    toast.success("Project created");
  };

  const duplicateProject = (project: DesignProject) => {
    const dup: DesignProject = {
      ...project,
      id: crypto.randomUUID(),
      name: `${project.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [dup, ...prev]);
    toast.success("Project duplicated");
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success("Project deleted");
  };

  const renameProject = () => {
    if (!renamingProject || !newName.trim()) return;
    setProjects(prev => prev.map(p => p.id === renamingProject.id ? { ...p, name: newName.trim(), updatedAt: new Date().toISOString() } : p));
    setShowRenameDialog(false);
    setRenamingProject(null);
    setNewName("");
    toast.success("Renamed");
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const folder: ProjectFolder = { id: crypto.randomUUID(), name: newFolderName.trim(), color: newFolderColor };
    setFolders(prev => [...prev, folder]);
    setShowFolderDialog(false);
    setNewFolderName("");
    toast.success("Folder created");
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    setProjects(prev => prev.map(p => p.folderId === id ? { ...p, folderId: null } : p));
    if (activeFolderId === id) setActiveFolderId(null);
    toast.success("Folder deleted");
  };

  // If editing a project, show the canvas
  if (activeProject) {
    return (
      <div className="space-y-0">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" onClick={() => setActiveProject(null)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Projects
          </Button>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm font-medium truncate">{activeProject.name}</span>
        </div>
        <DesignCanvas />
      </div>
    );
  }

  const displayProjects = projects.filter(p => {
    if (activeFolderId) return p.folderId === activeFolderId;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-gold" />
          <h2 className="font-bebas text-xl text-gold">Design Projects</h2>
          <span className="text-xs text-muted-foreground">({projects.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowFolderDialog(true)}>
            <FolderPlus className="w-4 h-4 mr-1" /> Folder
          </Button>
          <Button size="sm" onClick={() => { setNewName(""); setSelectedPreset(CANVAS_PRESETS[0]); setShowNewDialog(true); }}>
            <Plus className="w-4 h-4 mr-1" /> New Project
          </Button>
        </div>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFolderId === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFolderId(null)}
            className={activeFolderId === null ? "bg-gold text-gold-foreground" : ""}
          >
            All Projects
          </Button>
          {folders.map(folder => (
            <div key={folder.id} className="flex items-center gap-1">
              <Button
                variant={activeFolderId === folder.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFolderId(folder.id)}
                className={activeFolderId === folder.id ? "bg-gold text-gold-foreground" : ""}
              >
                <Folder className="w-3 h-3 mr-1" style={{ color: folder.color }} />
                {folder.name}
                <span className="ml-1 text-xs opacity-70">({projects.filter(p => p.folderId === folder.id).length})</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteFolder(folder.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {displayProjects.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">No projects yet</p>
          <Button variant="outline" className="mt-3" onClick={() => setShowNewDialog(true)}>Create your first project</Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {displayProjects.map(project => (
            <div
              key={project.id}
              className="group relative border rounded-lg overflow-hidden cursor-pointer hover:border-gold/50 transition-all hover:shadow-lg"
              onClick={() => setActiveProject(project)}
            >
              <div className="aspect-square bg-muted/30 flex items-center justify-center">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-8 h-8 text-muted-foreground/20" />
                )}
              </div>
              <div className="p-2">
                <p className="text-sm font-medium truncate">{project.name}</p>
                <p className="text-xs text-muted-foreground">{project.preset} · {new Date(project.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 bg-background/80"><MoreVertical className="w-3 h-3" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setRenamingProject(project); setNewName(project.name); setShowRenameDialog(true); }}>
                      <Edit className="w-3 h-3 mr-2" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicateProject(project)}>
                      <Copy className="w-3 h-3 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => deleteProject(project.id)}>
                      <Trash2 className="w-3 h-3 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {displayProjects.map(project => (
            <div
              key={project.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:border-gold/50 cursor-pointer transition-all"
              onClick={() => setActiveProject(project)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-muted/30 flex items-center justify-center">
                  <Image className="w-4 h-4 text-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.preset} · {new Date(project.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="w-3 h-3" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setRenamingProject(project); setNewName(project.name); setShowRenameDialog(true); }}>
                      <Edit className="w-3 h-3 mr-2" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicateProject(project)}>
                      <Copy className="w-3 h-3 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => deleteProject(project.id)}>
                      <Trash2 className="w-3 h-3 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Design Project</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Project Name</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Untitled" />
            </div>
            <div>
              <Label>Canvas Size</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {CANVAS_PRESETS.map(preset => (
                  <Button
                    key={preset.name}
                    variant={selectedPreset.name === preset.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPreset(preset)}
                    className={selectedPreset.name === preset.name ? "bg-gold text-gold-foreground" : ""}
                  >
                    <span className="mr-1">{preset.icon}</span> {preset.name}
                  </Button>
                ))}
              </div>
            </div>
            {selectedPreset.name === "Custom" && (
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Width</Label><Input type="number" value={customWidth} onChange={e => setCustomWidth(e.target.value)} /></div>
                <div><Label>Height</Label><Input type="number" value={customHeight} onChange={e => setCustomHeight(e.target.value)} /></div>
              </div>
            )}
            <Button onClick={createProject} className="w-full bg-gold text-gold-foreground hover:bg-gold/90">
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Folder Dialog */}
      <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Folder</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Folder Name</Label><Input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} /></div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-1">
                {FOLDER_COLORS.map(color => (
                  <button
                    key={color}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${newFolderColor === color ? 'border-foreground scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewFolderColor(color)}
                  />
                ))}
              </div>
            </div>
            <Button onClick={createFolder} className="w-full">Create Folder</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename Project</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input value={newName} onChange={e => setNewName(e.target.value)} />
            <Button onClick={renameProject} className="w-full">Rename</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
