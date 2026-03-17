import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { invokeEdgeFunction } from "@/lib/edgeFunctionHelper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image, ExternalLink, Link2, Folder, HardDrive, Table, Download, ImageIcon, Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  title: string;
  file_url: string;
  thumbnail_url: string | null;
  category: string;
  file_type: string;
  tags: string[] | null;
  created_at: string;
}

const RESOURCE_LINKS = [
  { title: "Canva Design", icon: Image, url: "https://www.canva.com/design/DAG0N9vOwtg/6ZmTuSDkJzR9_b0nl7czJA/edit", color: "text-purple-500" },
  { title: "Canva Folder", icon: Folder, url: "https://www.canva.com/folder/FAFRi-Qvnf4", color: "text-pink-500" },
  { title: "Topic Schedule", icon: Table, url: "https://docs.google.com/spreadsheets/d/1UtMiSeVkxDCP0b6DJmuB72dKHTUHAfyInUB_Ts2iRcc/edit", color: "text-orange-500" },
  { title: "Google Drive", icon: HardDrive, url: "https://drive.google.com/drive/folders/1fCfrG6bY8YuEjm7bVMaxIGEoXOyCBLMj", color: "text-indigo-500" },
];

export const ImageCreator = () => {
  const queryClient = useQueryClient();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [taggingId, setTaggingId] = useState<string | null>(null);

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ["marketing-gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_gallery")
        .select("*")
        .eq("file_type", "image")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as unknown as GalleryItem[];
    },
  });

  // Collect all unique tags
  const allTags = Array.from(new Set(galleryItems.flatMap(i => i.tags || []))).sort();

  const filteredItems = activeTag
    ? galleryItems.filter(i => i.tags?.includes(activeTag))
    : galleryItems;

  const autoTag = async (item: GalleryItem) => {
    setTaggingId(item.id);
    try {
      const { data, error } = await invokeEdgeFunction("ai-image-tagger", {
        body: { imageUrl: item.file_url },
      });
      if (error) throw error;
      const tags = data?.tags || [];
      if (tags.length === 0) {
        toast.info("No tags generated");
        return;
      }
      // Merge with existing tags
      const existingTags = item.tags || [];
      const merged = Array.from(new Set([...existingTags, ...tags]));
      const { error: updateError } = await supabase
        .from("marketing_gallery")
        .update({ tags: merged } as any)
        .eq("id", item.id);
      if (updateError) throw updateError;
      queryClient.invalidateQueries({ queryKey: ["marketing-gallery-images"] });
      toast.success(`Tagged: ${tags.join(", ")}`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to tag");
    } finally {
      setTaggingId(null);
    }
  };

  const downloadImage = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded");
    } catch {
      toast.error("Failed to download image");
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Resource Links */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {RESOURCE_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${link.color}`} />
                    {link.title}
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-accent" />
            Image Gallery
          </CardTitle>
          <CardDescription className="text-xs">Quick download images for content</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tag Filter Chips */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge
                variant={activeTag === null ? "default" : "outline"}
                className="cursor-pointer text-[10px]"
                onClick={() => setActiveTag(null)}
              >
                All
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  className="cursor-pointer text-[10px]"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {filteredItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-4 text-xs">No images available</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {filteredItems.slice(0, 16).map((item) => (
                <div key={item.id} className="relative group">
                  <div className="aspect-square rounded overflow-hidden border">
                    <img src={item.thumbnail_url || item.file_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-6 w-6"
                      onClick={() => autoTag(item)}
                      disabled={taggingId === item.id}
                    >
                      {taggingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Tag className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-6 w-6"
                      onClick={() => downloadImage(item.file_url, item.title)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                  {/* Show tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="absolute top-0.5 left-0.5 flex flex-wrap gap-0.5 max-w-full">
                      {item.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[8px] bg-black/70 text-white px-1 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
