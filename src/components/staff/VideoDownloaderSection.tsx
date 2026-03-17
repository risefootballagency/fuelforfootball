import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2, ExternalLink, Search, Film } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const VideoDownloaderSection = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<string[]>([]);

  const handleInspect = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setLinks([]);
    try {
      const { data, error } = await invokeEdgeFunction("extract-video-links", {
        body: { url: url.trim() },
      });
      if (error) throw error;
      const found = data?.links || [];
      setLinks(found);
      if (found.length === 0) toast.info("No .mp4 links found on this page");
      else toast.success(`Found ${found.length} video link(s)`);
    } catch (err: any) {
      toast.error(err.message || "Failed to inspect page");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bebas mb-1">VIDEO DOWNLOADER</h2>
        <p className="text-muted-foreground text-sm">Paste a URL to extract .mp4 video links from the page</p>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="https://example.com/match-videos"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleInspect()}
          className="flex-1"
        />
        <Button onClick={handleInspect} disabled={loading || !url.trim()} className="gap-1.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Inspect
        </Button>
      </div>
      {links.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{links.length} video(s) found:</p>
          {links.map((link, i) => {
            const filename = link.split("/").pop()?.split("?")[0] || `video-${i + 1}.mp4`;
            return (
              <Card key={i} className="border-border/50">
                <CardContent className="p-3 flex items-center gap-3">
                  <Film className="h-5 w-5 text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{filename}</p>
                    <p className="text-xs text-muted-foreground truncate">{link}</p>
                  </div>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                      <ExternalLink className="h-3.5 w-3.5" /> Open
                    </Button>
                  </a>
                </CardContent>
              </Card>
            );
          })}
          <p className="text-xs text-muted-foreground">Click "Open" then use the three-dot menu (⋮) to download the video file.</p>
        </div>
      )}
    </div>
  );
};
