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
    <section className="relative w-full h-[35vh] md:h-[60vh] overflow-hidden">
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
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center px-4 md:px-6 z-10">
                <h2 className="text-3xl md:text-6xl lg:text-7xl font-bebas uppercase tracking-wider text-white mb-2 md:mb-4 max-w-4xl">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-sm md:text-xl lg:text-2xl text-white/90 max-w-2xl px-4">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 md:p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 transition-all group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 md:p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 transition-all group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white group-hover:text-primary transition-colors" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-primary w-6 md:w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
