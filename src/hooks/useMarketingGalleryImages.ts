import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryImage {
  id: string;
  title: string;
  file_url: string;
  category: string;
  description: string | null;
}

export const useMarketingGalleryImages = (limit: number = 20) => {
  return useQuery({
    queryKey: ["marketing-gallery-images", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_gallery")
        .select("id, title, file_url, category, description")
        .eq("file_type", "image")
        .not("file_url", "is", null)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as GalleryImage[];
    },
  });
};
