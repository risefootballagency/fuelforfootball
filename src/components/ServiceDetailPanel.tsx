import { useState, useEffect, useMemo } from "react";
import { X, ShoppingCart, Check, ChevronLeft, ChevronRight, ArrowLeft, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import fffLogo from "@/assets/fff_logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { PortalExampleDialog } from "@/components/services/PortalExampleDialog";
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

const DESCRIPTION_CHAR_LIMIT_MOBILE = 150;
const DESCRIPTION_CHAR_LIMIT_DESKTOP = 280;

export const ServiceDetailPanel = <T extends { id: string; name: string; category: string; price: number; image_url: string | null; description: string | null; badge: string | null; options?: unknown }>({ 
  service, 
  onClose, 
  allServices = [], 
  onNavigate 
}: ServiceDetailPanelProps<T>) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedOption, setSelectedOption] = useState<ServiceOption | null>(null);
  const [added, setAdded] = useState(false);
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const [direction, setDirection] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showExamplePreview, setShowExamplePreview] = useState(false);

  // Map service categories to relevant portal sections
  const getExampleSectionForService = (category: string): string => {
    const lower = category.toLowerCase();
    if (lower.includes('analysis') || lower.includes('data') || lower.includes('tactical')) return 'analysis';
    if (lower.includes('physical') || lower.includes('technical') || lower.includes('nutrition') || lower.includes('coaching')) return 'physical';
    return 'hub';
  };

  const options = service.options as ServiceOption[] | null;
  const hasOptions = options && Array.isArray(options) && options.length > 0;
  const activePrice = selectedOption?.price || service.price;

  // Find current index and adjacent services
  const currentIndex = allServices.findIndex(s => s.id === service.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allServices.length - 1 && currentIndex >= 0;

  // Group services by category
  const categorizedServices = useMemo(() => {
    const grouped: Record<string, T[]> = {};
    allServices.forEach(s => {
      if (!grouped[s.category]) {
        grouped[s.category] = [];
      }
      grouped[s.category].push(s);
    });
    return grouped;
  }, [allServices]);

  const categories = Object.keys(categorizedServices);

  // Set initial selected category to current service's category
  useEffect(() => {
    if (service.category && !selectedCategory) {
      setSelectedCategory(service.category);
    }
  }, [service.category]);

  // Reset selected option when service changes
  useEffect(() => {
    setSelectedOption(null);
    setAdded(false);
    setIsDescriptionExpanded(false);
    // Update selected category when navigating to different product
    if (service.category) {
      setSelectedCategory(service.category);
    }
  }, [service.id]);

  // Lock body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleAddToCart = () => {
    addItem({
      serviceId: service.id,
      name: service.name,
      price: activePrice,
      selectedOption: selectedOption?.name || null,
      imageUrl: service.image_url || null,
    });
    
    setAdded(true);
    setShowCheckoutPopup(true);
    
    setTimeout(() => setAdded(false), 2000);
  };

  const handleCheckout = () => {
    setShowCheckoutPopup(false);
    onClose();
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    setShowCheckoutPopup(false);
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

  const getDescriptionPreview = (desc: string, isMobile: boolean = false) => {
    const stripped = stripHtml(desc);
    const limit = isMobile ? DESCRIPTION_CHAR_LIMIT_MOBILE : DESCRIPTION_CHAR_LIMIT_DESKTOP;
    if (stripped.length <= limit) return { text: stripped, hasMore: false };
    return { text: stripped.slice(0, limit) + '...', hasMore: true };
  };

  const displayedServices = selectedCategory 
    ? categorizedServices[selectedCategory] || []
    : allServices;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-background flex flex-col"
    >
      {/* Background pattern - behind all content */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 pointer-events-none -z-10" />
      
      {/* Header - Fixed */}
      <div className="flex-shrink-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bebas uppercase tracking-wider text-sm">Back to Services</span>
          </button>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation arrows - hidden on mobile, smaller and closer to sides */}
      {allServices.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className={cn(
              "hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card border-2 border-border items-center justify-center transition-all",
              hasPrev ? "hover:border-accent hover:bg-accent/10 cursor-pointer" : "opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={cn(
              "hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card border-2 border-border items-center justify-center transition-all",
              hasNext ? "hover:border-accent hover:bg-accent/10 cursor-pointer" : "opacity-30 cursor-not-allowed"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Main content - no scroll on desktop */}
      <div className="flex-1 overflow-y-auto lg:overflow-visible overscroll-contain">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4 lg:py-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={service.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full mx-auto"
            >
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
                {/* Mobile/Tablet: Details First */}
                <div className="flex flex-col lg:hidden order-1">
                  {/* Badge */}
                  {service.badge && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bebas uppercase tracking-wider bg-accent/10 text-accent w-fit mb-2">
                      {service.badge}
                    </span>
                  )}

                  {/* Title */}
                  <h1 className="font-bebas text-3xl md:text-4xl uppercase tracking-wider text-foreground leading-none">
                    {service.name}
                  </h1>

                  {/* Decorative line */}
                  <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mt-3 mb-3 rounded-full" />

                  {/* Price with "From" before and View Example button */}
                  <div className="mb-3 flex items-center gap-3 flex-wrap">
                    <div>
                      {hasOptions && !selectedOption && (
                        <span className="text-muted-foreground text-sm mr-2">From</span>
                      )}
                      <span className="font-bebas text-3xl md:text-4xl text-accent">
                        £{(activePrice ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExamplePreview(true)}
                      className="font-bebas uppercase tracking-wider text-xs border-accent/50 hover:bg-accent/10 hover:border-accent"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View Example
                    </Button>
                  </div>
                </div>

                {/* Image - Second on mobile, first on desktop */}
                <div className="order-2 lg:order-1">
                  <div className="relative aspect-square max-h-[320px] lg:max-h-[420px] bg-gradient-to-br from-card to-card/50 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl mx-auto w-full">
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bebas uppercase tracking-wider bg-primary text-primary-foreground shadow-lg">
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
                        <img src={fffLogo} alt="FFF" className="w-24 h-24 object-contain opacity-20" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop: Details - shown only on large screens */}
                <div className="hidden lg:flex flex-col order-2">
                  {/* Badge */}
                  {service.badge && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bebas uppercase tracking-wider bg-accent/10 text-accent w-fit mb-2">
                      {service.badge}
                    </span>
                  )}

                  {/* Title */}
                  <h1 className="font-bebas text-3xl lg:text-4xl uppercase tracking-wider text-foreground leading-none">
                    {service.name}
                  </h1>

                  {/* Decorative line */}
                  <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary mt-3 mb-3 rounded-full" />

                  {/* Price with "From" before and View Example button */}
                  <div className="mb-3 flex items-center gap-4">
                    <div>
                      {hasOptions && !selectedOption && (
                        <span className="text-muted-foreground text-sm mr-1">From</span>
                      )}
                      <span className="font-bebas text-3xl lg:text-4xl text-accent">
                        £{(activePrice ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExamplePreview(true)}
                      className="font-bebas uppercase tracking-wider text-xs border-accent/50 hover:bg-accent/10 hover:border-accent"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View Example
                    </Button>
                  </div>

                  {/* Description - fills available space */}
                  {service.description && (
                    <div className="flex-1 mb-4">
                      {(() => {
                        const { text, hasMore } = getDescriptionPreview(service.description, false);
                        return (
                          <>
                            <p className="text-foreground/90 leading-relaxed text-sm">
                              {isDescriptionExpanded ? stripHtml(service.description) : text}
                            </p>
                            {hasMore && (
                              <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="mt-1 text-accent hover:text-accent/80 text-xs font-medium flex items-center gap-1 transition-colors"
                              >
                                {isDescriptionExpanded ? (
                                  <>Show Less <ChevronUp className="w-3 h-3" /></>
                                ) : (
                                  <>Read More <ChevronDown className="w-3 h-3" /></>
                                )}
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Options dropdown and Add to Cart - side by side */}
                  <div className="flex gap-3 items-end">
                    {hasOptions && (
                      <div className="flex-1">
                        <label className="font-bebas uppercase tracking-wider text-xs text-muted-foreground mb-1.5 block">
                          Select Option
                        </label>
                        <select
                          value={selectedOption?.name || ''}
                          onChange={(e) => {
                            const opt = options.find(o => o.name === e.target.value);
                            setSelectedOption(opt || null);
                          }}
                          className="w-full px-3 py-2.5 rounded-lg border-2 border-border bg-card text-foreground font-medium text-sm focus:border-accent focus:outline-none transition-colors"
                        >
                          <option value="">Choose an option...</option>
                          {options.map((option, index) => (
                            <option key={index} value={option.name}>
                              {option.name} - £{(option.price ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: [1, 1.08, 1] }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                    <Button
                      onClick={handleAddToCart}
                      size="lg"
                      disabled={hasOptions && !selectedOption}
                      className={cn(
                        "font-bebas uppercase tracking-wider text-base py-2.5 px-6 rounded-lg transition-all shadow-lg",
                        hasOptions ? "flex-1" : "w-full",
                        added 
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                          : "bg-accent hover:bg-accent/90 text-accent-foreground hover:shadow-accent/30"
                      )}
                    >
                      {added ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Added
                        </>
                      ) : (
                        <>
                          <motion.span
                            className="inline-flex"
                            whileHover={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 0.3 }}
                          >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                          </motion.span>
                          Add to Basket
                        </>
                      )}
                    </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Mobile/Tablet: Description, Options, Button */}
                <div className="flex flex-col lg:hidden order-3">
                  {/* Description - truncated with Read More */}
                  {service.description && (
                    <div className="mb-6">
                      {(() => {
                        const { text, hasMore } = getDescriptionPreview(service.description, true);
                        return (
                          <>
                            <p className="text-foreground leading-relaxed text-base">
                              {isDescriptionExpanded ? stripHtml(service.description) : text}
                            </p>
                            {hasMore && (
                              <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="mt-2 text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1 transition-colors"
                              >
                                {isDescriptionExpanded ? (
                                  <>Show Less <ChevronUp className="w-4 h-4" /></>
                                ) : (
                                  <>Read More <ChevronDown className="w-4 h-4" /></>
                                )}
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Options */}
                  {hasOptions && (
                    <div className="mb-6">
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
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: [1, 1.06, 1] }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                    <Button
                      onClick={handleAddToCart}
                      size="lg"
                      disabled={hasOptions && !selectedOption}
                      className={cn(
                        "w-full font-bebas uppercase tracking-wider text-xl py-6 rounded-xl transition-all shadow-lg",
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
                          <motion.span
                            className="inline-flex"
                            whileHover={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 0.3 }}
                          >
                            <ShoppingCart className="w-6 h-6 mr-2" />
                          </motion.span>
                          Add to Basket
                        </>
                      )}
                    </Button>
                    </motion.div>

                    {hasOptions && !selectedOption && (
                      <p className="text-sm text-muted-foreground text-center">
                        Please select an option above to continue
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Product Slider - Fixed */}
      {allServices.length > 1 && (
        <div className="flex-shrink-0 border-t border-border/50 bg-background/95 backdrop-blur-md">
          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="border-b border-border/30">
              <div className="container mx-auto px-4">
                <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "flex-shrink-0 px-3 py-1 rounded-full text-xs font-bebas uppercase tracking-wider transition-all",
                      selectedCategory === null
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "flex-shrink-0 px-3 py-1 rounded-full text-xs font-bebas uppercase tracking-wider transition-all",
                        selectedCategory === category
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {category.replace(/\s*services?\s*/gi, '').trim() || category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Product Thumbnails */}
          <div className="container mx-auto px-4 py-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {displayedServices.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onNavigate?.(s)}
                  className={cn(
                    "flex-shrink-0 group relative",
                    s.id === service.id && "ring-2 ring-accent ring-offset-1 ring-offset-background rounded-lg"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border transition-all",
                    s.id === service.id 
                      ? "border-accent" 
                      : "border-border/50 hover:border-primary/50 group-hover:scale-105"
                  )}>
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-card flex items-center justify-center">
                        <img src={fffLogo} alt="" className="w-5 h-5 opacity-30" />
                      </div>
                    )}
                  </div>
                  {/* Name tooltip on hover - positioned ABOVE the thumbnail */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="bg-foreground text-background text-[10px] px-2 py-1 rounded whitespace-nowrap font-medium max-w-[150px] truncate shadow-lg">
                      {s.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Keyboard hint */}
          <div className="text-center pb-2">
            <p className="text-[10px] text-muted-foreground">
              ← → arrow keys to browse • ESC to close
            </p>
          </div>
        </div>
      )}

      {/* Checkout Popup */}
      <AnimatePresence>
        {showCheckoutPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end justify-center"
            onClick={handleContinueShopping}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card border-t-2 border-accent rounded-t-3xl p-6 pb-8 shadow-2xl"
            >
              {/* Success indicator */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <h3 className="font-bebas text-2xl text-center uppercase tracking-wider text-foreground mb-2">
                Added to Basket
              </h3>
              <p className="text-center text-muted-foreground text-sm mb-6">
                {service.name}{selectedOption ? ` - ${selectedOption.name}` : ''}
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full font-bebas uppercase tracking-wider text-lg py-6 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  View Cart & Checkout
                </Button>
                
                <Button
                  onClick={handleContinueShopping}
                  variant="outline"
                  size="lg"
                  className="w-full font-bebas uppercase tracking-wider text-lg py-6 rounded-xl border-2 border-border hover:bg-muted"
                >
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Example Dialog - Full Cristiano Ronaldo portal */}
      <PortalExampleDialog
        open={showExamplePreview}
        onOpenChange={setShowExamplePreview}
        initialSection={getExampleSectionForService(service.category)}
        serviceContext={{
          serviceName: service.name,
          serviceId: service.id,
        }}
      />
    </motion.div>
  );
};
