import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Archive, Copy, ExternalLink, Calendar, Download, ChevronDown, Send, Check, Instagram } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  image_url: string | null;
  created_at: string;
  published: boolean | null;
}

export const PostContent = () => {
  const queryClient = useQueryClient();
  const [readyToPostOpen, setReadyToPostOpen] = useState(true);
  const [postedOpen, setPostedOpen] = useState(false);
  const [confirmingPostId, setConfirmingPostId] = useState<string | null>(null);

  const getCleanContent = (content: string) => {
    return content
      .replace(/\*\*Intro\*\*\n?/g, '')
      .replace(/\*\*Main\*\*\n?/g, '')
      .replace(/\*\*Secondary\*\*\n?/g, '')
      .replace(/\*\*Conclusion\*\*\n?/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const copyArticleText = (post: BlogPost) => {
    const cleanContent = getCleanContent(post.content);
    navigator.clipboard.writeText(cleanContent);
    toast.success("Article text copied");
  };

  const { data: publishedPosts = [], isLoading } = useQuery({
    queryKey: ["published-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const { data: unpublishedPosts = [] } = useQuery({
    queryKey: ["unpublished-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", false)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as BlogPost[];
    },
  });

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
      {/* Content Schedule */}
      <Card className="border-pink-500/20">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                Content Schedule
              </CardTitle>
              <CardDescription>Plan and schedule your content posts</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                <p className="text-lg font-bold text-orange-500">{unpublishedPosts.length}</p>
                <p className="text-[10px] text-muted-foreground">Ready</p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-lg font-bold text-green-500">{publishedPosts.length}</p>
                <p className="text-[10px] text-muted-foreground">Posted</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Ready to Post */}
      <Collapsible open={readyToPostOpen} onOpenChange={setReadyToPostOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Send className="w-5 h-5 text-orange-500" />
                  Ready to Post ({unpublishedPosts.length})
                </CardTitle>
                <ChevronDown className={`w-5 h-5 transition-transform ${readyToPostOpen ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              {unpublishedPosts.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 text-sm">No posts ready.</p>
              ) : (
                <div className="space-y-3">
                  {unpublishedPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          {post.image_url && (
                            <div className="relative group flex-shrink-0">
                              <div className="w-20 h-20 rounded-lg overflow-hidden border">
                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                              </div>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => downloadImage(post.image_url!, post.title)}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm">{post.title}</h4>
                            {post.category && <span className="text-xs text-muted-foreground">{post.category}</span>}
                          </div>
                          <Button size="sm" variant="outline" onClick={() => copyArticleText(post)} className="h-8">
                            <Copy className="w-3 h-3 mr-1" /> Copy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Posted Archive */}
      <Collapsible open={postedOpen} onOpenChange={setPostedOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Archive className="w-5 h-5 text-green-500" />
                  Published ({publishedPosts.length})
                </CardTitle>
                <ChevronDown className={`w-5 h-5 transition-transform ${postedOpen ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              {publishedPosts.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 text-sm">No published posts yet.</p>
              ) : (
                <div className="space-y-2">
                  {publishedPosts.map((post) => (
                    <div key={post.id} className="flex items-center gap-3 p-2 rounded border">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{post.title}</h4>
                        <p className="text-xs text-muted-foreground">{format(new Date(post.created_at), "MMM d, yyyy")}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => copyArticleText(post)} className="h-7">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
