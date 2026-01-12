import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GalleryImage {
  id: string;
  file_url: string;
  title: string;
}

export const useLandingFolderImages = (limit: number = 20) => {
  return useQuery({
    queryKey: ["landing-folder-images", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_gallery")
        .select("id, file_url, title")
        .eq("folder", "landing")
        .not("file_url", "is", null)
        .limit(limit);

      if (error) throw error;
      return data as GalleryImage[];
    },
  });
};
