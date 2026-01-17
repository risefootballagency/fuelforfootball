import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowRight, Check } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface Product {
  image: string;
  title: string;
  link: string;
  price?: number;
  currency?: string;
}

interface ServiceCarouselProps {
  products: Product[];
}

export const ServiceCarousel = ({ products }: ServiceCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const { addItem } = useCart();
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    align: "center",
    containScroll: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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

  const handleAddToCart = (product: Product, index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      serviceId: product.link,
      name: product.title,
      price: product.price || 0,
      selectedOption: null,
      imageUrl: product.image,
    });
    
    setAddedItems(prev => new Set(prev).add(index));
    
    setTimeout(() => {
      setAddedItems(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 2000);
  };

  if (products.length === 0) return null;

  return (
    <div className="relative group">
      {/* Carousel Container */}
      <div ref={emblaRef} className="overflow-hidden rounded-lg">
        <div className="flex">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 px-0"
            >
              <div className="bg-card border border-border/50 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300">
                <div className="aspect-square overflow-hidden bg-muted relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  {/* Title and buttons overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                    <h4 className="text-base md:text-lg font-bebas uppercase tracking-wider text-white line-clamp-2">
                      {product.title}
                    </h4>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-accent/90 backdrop-blur-sm border-accent text-black hover:bg-accent hover:text-black text-xs font-semibold"
                      >
                        <Link to={product.link}>
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Learn More
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => handleAddToCart(product, index, e)}
                        className={`flex-1 text-xs transition-all relative overflow-hidden text-white font-semibold border-0 ${
                          addedItems.has(index) 
                            ? "bg-green-600 hover:bg-green-700" 
                            : ""
                        }`}
                      >
                        {/* Green smoky background */}
                        {!addedItems.has(index) && (
                          <div 
                            className="absolute inset-0 z-0"
                            style={{
                              backgroundImage: `url('/grass-smoky-3.png')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                        )}
                        {/* Dark overlay for text contrast */}
                        {!addedItems.has(index) && (
                          <div className="absolute inset-0 bg-black/30 z-0" />
                        )}
                        <span className="relative z-10 flex items-center justify-center">
                          {addedItems.has(index) ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Add to Basket
                            </>
                          )}
                        </span>
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
