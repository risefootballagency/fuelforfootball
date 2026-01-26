import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PreloaderOptions {
  folder: string;
  limit: number;
  threshold?: number; // Percentage of images to load before showing (0-1)
}

export const useImagePreloader = ({ folder, limit, threshold = 0.8 }: PreloaderOptions) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Fetch URLs from database
  const { data: imageUrls = [], isLoading: isFetching } = useQuery({
    queryKey: ["preload-images", folder, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketing_gallery")
        .select("file_url")
        .eq("folder", folder)
        .not("file_url", "is", null)
        .limit(limit);

      if (error) throw error;
      return data.map((item) => item.file_url) as string[];
    },
    staleTime: Infinity, // Cache forever
    gcTime: Infinity,
  });

  // Preload images in parallel
  useEffect(() => {
    if (imageUrls.length === 0) return;

    let mounted = true;
    let loaded = 0;

    const preloadImage = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (mounted) {
            loaded++;
            setLoadedCount(loaded);
            // Check if we've hit the threshold
            if (loaded >= imageUrls.length * threshold) {
              setIsReady(true);
            }
          }
          resolve();
        };
        img.onerror = () => {
          // Still count failed loads to avoid hanging
          if (mounted) {
            loaded++;
            setLoadedCount(loaded);
            if (loaded >= imageUrls.length * threshold) {
              setIsReady(true);
            }
          }
          resolve();
        };
        img.src = url;
      });
    };

    // Preload all images in parallel
    Promise.all(imageUrls.map(preloadImage));

    return () => {
      mounted = false;
    };
  }, [imageUrls, threshold]);

  return {
    imageUrls,
    isReady,
    loadedCount,
    totalCount: imageUrls.length,
    progress: imageUrls.length > 0 ? loadedCount / imageUrls.length : 0,
    isFetching,
  };
};
