import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

interface Product {
  id?: string;
  image: string;
  title: string;
  link: string;
  price?: number;
  currency?: string;
  description?: string;
}

interface ServiceCarouselProps {
  products: Product[];
  autoSlideshow?: boolean;
  slideshowInterval?: number;
}

export const ServiceCarousel = ({ 
  products, 
  autoSlideshow = true,
  slideshowInterval = 6000 
}: ServiceCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    align: "center",
  });

  const scrollPrev = useCallback(() => {
    setHasInteracted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    setHasInteracted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto slideshow - 6 seconds, stops on user interaction
  useEffect(() => {
    if (!autoSlideshow || products.length <= 1 || hasInteracted || !emblaApi) return;
    
    intervalRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, slideshowInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoSlideshow, products.length, slideshowInterval, hasInteracted, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleDotClick = (index: number) => {
    setHasInteracted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    emblaApi?.scrollTo(index);
  };

  if (products.length === 0) return null;

  return (
    <div className="relative group h-full flex flex-col">
      {/* Carousel Container */}
      <div ref={emblaRef} className="overflow-hidden rounded-lg flex-grow">
        <div className="flex h-full">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 px-0 h-full"
            >
              {/* Desktop: Side by side layout */}
              <div className="bg-card border border-border/50 rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-300 h-full">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Square Image - Half width on desktop */}
                  <div className="w-full md:w-1/2 aspect-square overflow-hidden bg-muted relative flex-shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content - Half width on desktop */}
                  <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-between bg-card">
                    <div className="flex-1">
                      <h4 className="text-lg md:text-xl font-bebas uppercase tracking-wider text-foreground mb-3">
                        {product.title}
                      </h4>
                      {product.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {product.description}
                        </p>
                      )}
                      {product.price && (
                        <p className="text-accent font-semibold mt-3">
                          {product.currency || "£"}{product.price}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Button
                        asChild
                        size="sm"
                        className="w-full justify-center text-xs font-semibold py-2 relative overflow-hidden text-white border-2 border-accent"
                      >
                        <Link to={product.id ? `/services?service=${product.id}` : product.link} className="flex items-center justify-center">
                          <div 
                            className="absolute inset-0 z-0"
                            style={{
                              backgroundImage: `url('/grass-bg-smoky.png')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                          <span className="relative z-10 flex items-center justify-center">
                            Learn More
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {products.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background border border-border/50"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background border border-border/50"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {products.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-accent w-4"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
