import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Image, Video, X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  thumbnail_url: string | null;
  category: string;
}

const categories = ["All", "Brand", "Players", "Events", "Press"];

export const MediaGallery = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("marketing_gallery")
        .select("id, title, description, file_url, file_type, thumbnail_url, category")
        .order("created_at", { ascending: false })
        .limit(24);

      if (!error && data) {
        setItems(data);
        setFilteredItems(data);
      }
      setLoading(false);
    };

    fetchGallery();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      ));
    }
  }, [selectedCategory, items]);

  const openLightbox = (item: GalleryItem) => {
    const index = filteredItems.findIndex(i => i.id === item.id);
    setLightboxIndex(index);
    setLightboxItem(item);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" 
      ? (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
      : (lightboxIndex + 1) % filteredItems.length;
    setLightboxIndex(newIndex);
    setLightboxItem(filteredItems[newIndex]);
  };

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted/30 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <span className="text-sm font-bebas uppercase tracking-widest text-primary border border-primary/30 px-6 py-2 rounded-full">
                {t("gallery.badge", "Media Library")}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider mb-4">
              {t("gallery.title", "Visual Assets")}
            </h2>
          </div>
        </ScrollReveal>

        {/* Category Filters */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="font-bebas uppercase tracking-wider"
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.05}>
              <div
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-border hover:border-primary/50 transition-all duration-300"
                onClick={() => openLightbox(item)}
              >
                {item.file_type === "image" ? (
                  <img
                    src={item.thumbnail_url || item.file_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="font-bebas text-lg uppercase tracking-wider text-white line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-xs text-white/70 uppercase">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Type indicator */}
                <div className="absolute top-3 right-3 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.file_type === "image" ? (
                    <Image className="h-4 w-4 text-white" />
                  ) : (
                    <Video className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxItem(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setLightboxItem(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div 
            className="max-w-5xl max-h-[85vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem.file_type === "image" ? (
              <img
                src={lightboxItem.file_url}
                alt={lightboxItem.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={lightboxItem.file_url}
                controls
                className="max-w-full max-h-[75vh] rounded-lg"
              />
            )}
            <div className="mt-4 text-center">
              <h3 className="font-bebas text-2xl uppercase tracking-wider text-white">
                {lightboxItem.title}
              </h3>
              {lightboxItem.description && (
                <p className="text-white/70 mt-2">{lightboxItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaGallery;
