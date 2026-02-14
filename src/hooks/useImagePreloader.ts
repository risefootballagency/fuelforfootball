import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PreloaderOptions {
  folder: string;
  limit: number;
  threshold?: number;
  batchSize?: number;
}

export const useImagePreloader = ({ folder, limit, threshold = 0.5, batchSize = 12 }: PreloaderOptions) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

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
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (imageUrls.length === 0) return;

    let mounted = true;
    let loaded = 0;
    const total = imageUrls.length;
    const thresholdCount = Math.ceil(total * threshold);

    const preloadImage = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const done = () => {
          if (mounted) {
            loaded++;
            setLoadedCount(loaded);
            if (!isReady && loaded >= thresholdCount) {
              setIsReady(true);
            }
          }
          resolve();
        };
        img.onload = done;
        img.onerror = done;
        img.src = url;
      });
    };

    // Batch-load in groups to avoid flooding the network
    const loadInBatches = async () => {
      for (let i = 0; i < total; i += batchSize) {
        if (!mounted) break;
        const batch = imageUrls.slice(i, i + batchSize);
        await Promise.all(batch.map(preloadImage));
      }
    };

    loadInBatches();

    return () => { mounted = false; };
  }, [imageUrls, threshold, batchSize]);

  return {
    imageUrls,
    isReady,
    loadedCount,
    totalCount: imageUrls.length,
    progress: imageUrls.length > 0 ? loadedCount / imageUrls.length : 0,
    isFetching,
  };
};
