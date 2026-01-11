import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Slide {
  image: string;
  title: string;
  subtitle?: string;
}

interface HeroSliderProps {
  slides: Slide[];
  autoplayDelay?: number;
}

export const HeroSlider = ({ slides, autoplayDelay = 5000 }: HeroSliderProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, skipSnaps: false },
    [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
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

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[40vh] md:h-[65vh] overflow-hidden">
      {/* Carousel Container */}
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              
              {/* Multiple Gradient Overlays for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-background" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center px-6 md:px-12 z-10">
                {/* Decorative line */}
                <div className="w-16 md:w-24 h-0.5 bg-primary mb-4 md:mb-6" />
                
                <h2 className="text-4xl md:text-7xl lg:text-8xl font-bebas uppercase tracking-wider text-white mb-3 md:mb-6 max-w-5xl drop-shadow-2xl">
                  {slide.title}
                </h2>
                
                {slide.subtitle && (
                  <p className="text-sm md:text-xl lg:text-2xl text-white/90 max-w-3xl px-4 leading-relaxed font-light drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                )}
                
                {/* Decorative line */}
                <div className="w-16 md:w-24 h-0.5 bg-primary/50 mt-4 md:mt-6" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Modern pill style */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-primary transition-colors" />
          </button>
        </>
      )}

      {/* Progress Bar Style Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${
                index === selectedIndex
                  ? "bg-primary w-10 md:w-14"
                  : "bg-white/30 hover:bg-white/50 w-6 md:w-8"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
