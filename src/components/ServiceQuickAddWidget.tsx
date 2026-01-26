import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url?: string | null;
}

interface ServiceQuickAddWidgetProps {
  service?: Service;
  services?: Service[];
  autoSlideshow?: boolean;
  slideshowInterval?: number;
}

export const ServiceQuickAddWidget = ({ 
  service, 
  services,
  autoSlideshow = true,
  slideshowInterval = 6000 
}: ServiceQuickAddWidgetProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle both single service and multiple services
  const serviceList = services || (service ? [service] : []);
  const currentService = serviceList[currentIndex];
  
  // Auto slideshow - stops when user interacts
  useEffect(() => {
    if (!autoSlideshow || serviceList.length <= 1 || hasInteracted) return;
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % serviceList.length);
    }, slideshowInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoSlideshow, serviceList.length, slideshowInterval, hasInteracted]);

  const goToPrev = () => {
    setHasInteracted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex((prev) => (prev - 1 + serviceList.length) % serviceList.length);
  };

  const goToNext = () => {
    setHasInteracted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex((prev) => (prev + 1) % serviceList.length);
  };

  const handleDotClick = (index: number) => {
    setHasInteracted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex(index);
  };

  const stripHtml = (html: string) => {
    // Return full description, stripped of HTML
    return html?.replace(/<[^>]*>/g, '') || '';
  };

  if (!currentService) return null;

  return (
    <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-border rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group relative">
      {/* Navigation arrows for multiple services */}
      {serviceList.length > 1 && (
        <>
          <button 
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
      
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className="text-[10px] md:text-xs text-primary font-bebas uppercase tracking-wider">
              {currentService.category}
            </span>
            <h4 className="font-bebas text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors mt-0.5 leading-tight">
              {currentService.name}
            </h4>
          </div>
          <div className="text-right">
            <span className="font-bebas text-xl md:text-2xl text-primary">
              £{currentService.price}
            </span>
          </div>
        </div>

        {/* Full Description */}
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          {stripHtml(currentService.description || '')}
        </p>

        {/* Dots indicator for multiple services */}
        {serviceList.length > 1 && (
          <div className="flex justify-center gap-2">
            {serviceList.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        )}

        {/* Learn More Button - links to service on services page */}
        <Link to={`/services?service=${currentService.id}`} className="block">
          <Button
            size="sm"
            className="w-full font-bebas uppercase tracking-wider text-sm gap-2"
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};