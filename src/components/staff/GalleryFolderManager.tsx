import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, FolderPlus, Image, Check, X, Trash2 } from "lucide-react";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  folder: string | null;
}

interface GalleryFolder {
  id: string;
  name: string;
  description: string | null;
}

interface GalleryFolderManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFolderUpdated: () => void;
}

export const GalleryFolderManager = ({ open, onOpenChange, onFolderUpdated }: GalleryFolderManagerProps) => {
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchFolders();
      fetchItems();
    }
  }, [open]);

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from("gallery_folders")
      .select("*")
      .order("name");
    
    if (!error && data) {
      setFolders(data);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("marketing_gallery")
      .select("id, title, file_url, file_type, folder")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("gallery_folders")
      .insert({
        name: newFolderName.toLowerCase().replace(/\s+/g, "-"),
        description: newFolderDescription || null,
      });

    if (error) {
      if (error.code === "23505") {
        toast.error("A folder with this name already exists");
      } else {
        toast.error("Failed to create folder");
      }
    } else {
      toast.success("Folder created");
      setNewFolderName("");
      setNewFolderDescription("");
      setShowCreateFolder(false);
      fetchFolders();
    }
    setSaving(false);
  };

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    if (!confirm(`Are you sure you want to delete the "${folderName}" folder? Images will be unassigned but not deleted.`)) {
      return;
    }

    // First, unassign all items from this folder
    await supabase
      .from("marketing_gallery")
      .update({ folder: null })
      .eq("folder", folderName);

    const { error } = await supabase
      .from("gallery_folders")
      .delete()
      .eq("id", folderId);

    if (error) {
      toast.error("Failed to delete folder");
    } else {
      toast.success("Folder deleted");
      fetchFolders();
      fetchItems();
      onFolderUpdated();
    }
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleAssignToFolder = async () => {
    if (!selectedFolder || selectedItems.size === 0) {
      toast.error("Please select a folder and at least one image");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("marketing_gallery")
      .update({ folder: selectedFolder })
      .in("id", Array.from(selectedItems));

    if (error) {
      toast.error("Failed to assign images to folder");
    } else {
      toast.success(`${selectedItems.size} images assigned to ${selectedFolder}`);
      setSelectedItems(new Set());
      fetchItems();
      onFolderUpdated();
    }
    setSaving(false);
  };

  const handleRemoveFromFolder = async (itemId: string) => {
    const { error } = await supabase
      .from("marketing_gallery")
      .update({ folder: null })
      .eq("id", itemId);

    if (error) {
      toast.error("Failed to remove from folder");
    } else {
      toast.success("Image removed from folder");
      fetchItems();
      onFolderUpdated();
    }
  };

  const unassignedItems = items.filter((item) => !item.folder && item.file_type === "image");
  const folderItems = selectedFolder 
    ? items.filter((item) => item.folder === selectedFolder) 
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Manage Image Folders
          </DialogTitle>
          <DialogDescription>
            Create folders and assign images for organized use across the site.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Left: Folders & Create */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Folders</h3>
              <Button size="sm" variant="outline" onClick={() => setShowCreateFolder(!showCreateFolder)}>
                <FolderPlus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>

            {showCreateFolder && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <Label>Folder Name</Label>
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="e.g. landing, hero-images"
                    />
                  </div>
                  <div>
                    <Label>Description (optional)</Label>
                    <Input
                      value={newFolderDescription}
                      onChange={(e) => setNewFolderDescription(e.target.value)}
                      placeholder="What this folder is for"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreateFolder} disabled={saving}>
                      Create
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowCreateFolder(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFolder === folder.name
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedFolder(selectedFolder === folder.name ? null : folder.name)}
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-medium">{folder.name}</div>
                        {folder.description && (
                          <div className="text-xs text-muted-foreground">{folder.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {items.filter((i) => i.folder === folder.name).length} images
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id, folder.name);
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {folders.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No folders yet</p>
                )}
              </div>
            </ScrollArea>

            {/* Folder contents */}
            {selectedFolder && (
              <div>
                <h4 className="font-medium mb-2">Images in "{selectedFolder}"</h4>
                <ScrollArea className="h-[150px]">
                  <div className="grid grid-cols-4 gap-2">
                    {folderItems.map((item) => (
                      <div key={item.id} className="relative group">
                        <img
                          src={item.file_url}
                          alt={item.title}
                          className="w-full aspect-square object-cover rounded"
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveFromFolder(item.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    {folderItems.length === 0 && (
                      <p className="col-span-4 text-center text-muted-foreground py-4">
                        No images in this folder
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Right: Unassigned images to add */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Unassigned Images</h3>
              {selectedItems.size > 0 && selectedFolder && (
                <Button size="sm" onClick={handleAssignToFolder} disabled={saving}>
                  <Check className="w-4 h-4 mr-1" />
                  Add {selectedItems.size} to "{selectedFolder}"
                </Button>
              )}
            </div>

            {!selectedFolder && (
              <p className="text-sm text-muted-foreground">
                Select a folder on the left to assign images
              </p>
            )}

            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : unassignedItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>All images are assigned to folders</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {unassignedItems.map((item) => (
                    <div
                      key={item.id}
                      className={`relative cursor-pointer rounded overflow-hidden border-2 transition-all ${
                        selectedItems.has(item.id)
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-transparent hover:border-muted-foreground/30"
                      }`}
                      onClick={() => selectedFolder && toggleItemSelection(item.id)}
                    >
                      <img
                        src={item.file_url}
                        alt={item.title}
                        className="w-full aspect-square object-cover"
                      />
                      {selectedItems.has(item.id) && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                        <p className="text-[10px] text-white truncate">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
