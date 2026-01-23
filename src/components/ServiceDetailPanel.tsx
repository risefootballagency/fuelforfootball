import { useState, useEffect } from "react";
import { X, ShoppingCart, Check, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import fffLogo from "@/assets/fff_logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceOption {
  name: string;
  price: number;
}

interface ServiceDetailPanelProps<T extends { id: string; name: string; category: string; price: number; image_url: string | null; description: string | null; badge: string | null; options?: unknown }> {
  service: T;
  onClose: () => void;
  allServices?: T[];
  onNavigate?: (service: T) => void;
}

export const ServiceDetailPanel = <T extends { id: string; name: string; category: string; price: number; image_url: string | null; description: string | null; badge: string | null; options?: unknown }>({ 
  service, 
  onClose, 
  allServices = [], 
  onNavigate 
}: ServiceDetailPanelProps<T>) => {
  const { addItem } = useCart();
  const [selectedOption, setSelectedOption] = useState<ServiceOption | null>(null);
  const [added, setAdded] = useState(false);
  const [direction, setDirection] = useState(0);

  const options = service.options as ServiceOption[] | null;
  const hasOptions = options && Array.isArray(options) && options.length > 0;
  const activePrice = selectedOption?.price || service.price;

  // Find current index and adjacent services
  const currentIndex = allServices.findIndex(s => s.id === service.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allServices.length - 1 && currentIndex >= 0;

  // Reset selected option when service changes
  useEffect(() => {
    setSelectedOption(null);
    setAdded(false);
  }, [service.id]);

  const handleAddToCart = () => {
    addItem({
      serviceId: service.id,
      name: service.name,
      price: activePrice,
      selectedOption: selectedOption?.name || null,
      imageUrl: service.image_url || null,
    });
    
    setAdded(true);
    toast.success('Added to basket', {
      description: `${service.name}${selectedOption ? ` - ${selectedOption.name}` : ''}`,
    });
    
    setTimeout(() => setAdded(false), 2000);
  };

  const handlePrev = () => {
    if (hasPrev && onNavigate) {
      setDirection(-1);
      onNavigate(allServices[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onNavigate) {
      setDirection(1);
      onNavigate(allServices[currentIndex + 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allServices]);

  const stripHtml = (html: string) => {
    return html?.replace(/<[^>]*>/g, '') || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-background overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bebas uppercase tracking-wider text-sm">Back to Services</span>
          </button>
          
          {/* Product counter */}
          {allServices.length > 0 && (
            <span className="text-sm text-muted-foreground font-bebas tracking-wider">
              {currentIndex + 1} / {allServices.length}
            </span>
          )}
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      {allServices.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center transition-all",
              hasPrev ? "hover:border-accent hover:bg-accent/10 cursor-pointer" : "opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center transition-all",
              hasNext ? "hover:border-accent hover:bg-accent/10 cursor-pointer" : "opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main content */}
      <div className="h-full pt-16 pb-8 overflow-y-auto">
        <div className="container mx-auto px-4 md:px-16 py-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={service.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                {/* Left: Image */}
                <div className="lg:sticky lg:top-24">
                  <div className="relative aspect-square bg-gradient-to-br from-card to-card/50 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl">
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bebas uppercase tracking-wider bg-primary text-primary-foreground shadow-lg">
                        {service.category}
                      </span>
                    </div>
                    
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <img src={fffLogo} alt="FFF" className="w-40 h-40 object-contain opacity-20" />
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  </div>
                  
                  {/* Thumbnail strip for navigation */}
                  {allServices.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {allServices.slice(Math.max(0, currentIndex - 2), Math.min(allServices.length, currentIndex + 3)).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => onNavigate?.(s)}
                          className={cn(
                            "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                            s.id === service.id 
                              ? "border-accent ring-2 ring-accent/30" 
                              : "border-border/50 hover:border-primary/50 opacity-60 hover:opacity-100"
                          )}
                        >
                          {s.image_url ? (
                            <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-card flex items-center justify-center">
                              <img src={fffLogo} alt="" className="w-6 h-6 opacity-30" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Details */}
                <div className="flex flex-col">
                  {/* Badge */}
                  {service.badge && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bebas uppercase tracking-wider bg-accent/10 text-accent w-fit mb-3">
                      {service.badge}
                    </span>
                  )}

                  {/* Title */}
                  <h1 className="font-bebas text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider text-foreground leading-none">
                    {service.name}
                  </h1>

                  {/* Decorative line */}
                  <div className="w-20 h-1 bg-gradient-to-r from-accent to-primary mt-4 mb-6 rounded-full" />

                  {/* Price */}
                  <div className="mb-6">
                    <span className="font-bebas text-5xl md:text-6xl text-accent">
                      £{(activePrice ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {hasOptions && !selectedOption && (
                      <span className="text-muted-foreground text-sm ml-2">from</span>
                    )}
                  </div>

                  {/* Description */}
                  {service.description && (
                    <div className="mb-8">
                      <p className="text-foreground/80 leading-relaxed text-base md:text-lg">
                        {stripHtml(service.description)}
                      </p>
                    </div>
                  )}

                  {/* Options */}
                  {hasOptions && (
                    <div className="mb-8">
                      <h3 className="font-bebas uppercase tracking-wider text-lg text-foreground mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full" />
                        Select Your Option
                      </h3>
                      <div className="grid gap-3">
                        {options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedOption(option)}
                            className={cn(
                              "w-full p-4 rounded-xl border-2 transition-all text-left group",
                              selectedOption?.name === option.name
                                ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                                : "border-border hover:border-primary/50 hover:bg-card"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                  selectedOption?.name === option.name
                                    ? "border-accent bg-accent"
                                    : "border-muted-foreground/50"
                                )}>
                                  {selectedOption?.name === option.name && (
                                    <Check className="w-3 h-3 text-accent-foreground" />
                                  )}
                                </div>
                                <span className="font-medium text-foreground">{option.name || 'Option'}</span>
                              </div>
                              <span className="font-bebas text-xl text-accent">
                                £{(option.price ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <div className="space-y-4">
                    <Button
                      onClick={handleAddToCart}
                      size="lg"
                      disabled={hasOptions && !selectedOption}
                      className={cn(
                        "w-full font-bebas uppercase tracking-wider text-xl py-7 rounded-xl transition-all shadow-lg",
                        added 
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                          : "bg-accent hover:bg-accent/90 text-accent-foreground hover:shadow-accent/30"
                      )}
                    >
                      {added ? (
                        <>
                          <Check className="w-6 h-6 mr-2" />
                          Added to Basket
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-6 h-6 mr-2" />
                          Add to Basket
                        </>
                      )}
                    </Button>

                    {hasOptions && !selectedOption && (
                      <p className="text-sm text-muted-foreground text-center">
                        Please select an option above to continue
                      </p>
                    )}
                  </div>

                  {/* Quick navigation hint */}
                  {allServices.length > 1 && (
                    <div className="mt-8 pt-6 border-t border-border/50">
                      <p className="text-xs text-muted-foreground text-center">
                        Use ← → arrow keys or click arrows to browse products
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
