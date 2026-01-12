import { useState, useMemo, useEffect } from "react";
import { ShopHeader } from "@/components/ShopHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { LocalizedLink } from "@/components/LocalizedLink";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight,
  Check, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft,
  X,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import fffLogo from "@/assets/fff_logo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ServiceOption {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
}

interface SelectedService {
  service: ServiceOption;
  quantity: number;
}

// Service categories - clean labels without icons
const CATEGORIES = [
  { id: "Analysis Services", label: "Analysis" },
  { id: "Technical Services", label: "Technical" },
  { id: "Physical Services", label: "Physical" },
  { id: "Nutrition Services", label: "Nutrition" },
  { id: "Psychological Services", label: "Mental" },
  { id: "Coaching Services", label: "Coaching" },
  { id: "Data Services", label: "Data & Stats" },
];

// Calculate discount percentage based on number of unique services
const getDiscountPercent = (itemCount: number): number => {
  if (itemCount < 3) return 0;
  if (itemCount === 3) return 20;
  if (itemCount === 4) return 30;
  if (itemCount === 5) return 40;
  // 41% for 6, 42% for 7, etc.
  return 40 + (itemCount - 5);
};

const Customisation = () => {
  const { addItem } = useCart();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<Map<string, SelectedService>>(new Map());
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('service_catalog')
          .select('id, name, category, price, description, image_url')
          .eq('visible', true)
          .not('category', 'eq', 'All in One Services')
          .not('name', 'ilike', '%European Match Analysis%')
          .order('category', { ascending: true })
          .order('price', { ascending: true });

        if (error) throw error;
        setServices(data || []);
        
        if (data && data.length > 0 && data[0].image_url) {
          setActiveImage(data[0].image_url);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, ServiceOption[]> = {};
    services.forEach(service => {
      if (!grouped[service.category]) {
        grouped[service.category] = [];
      }
      grouped[service.category].push(service);
    });
    return grouped;
  }, [services]);

  // Filter services based on search
  const filteredServicesByCategory = useMemo(() => {
    if (!searchQuery) return servicesByCategory;
    
    const filtered: Record<string, ServiceOption[]> = {};
    Object.entries(servicesByCategory).forEach(([category, categoryServices]) => {
      const matchingServices = categoryServices.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchingServices.length > 0) {
        filtered[category] = matchingServices;
      }
    });
    return filtered;
  }, [servicesByCategory, searchQuery]);

  // Calculate totals with discount
  const { subtotal, discountPercent, discountAmount, totalPrice, totalItems } = useMemo(() => {
    let subtotal = 0;
    let items = 0;

    selectedServices.forEach(({ service, quantity }) => {
      subtotal += service.price * quantity;
      items += quantity;
    });

    const uniqueServiceCount = selectedServices.size;
    const discountPercent = getDiscountPercent(uniqueServiceCount);
    const discountAmount = subtotal * (discountPercent / 100);
    const totalPrice = subtotal - discountAmount;

    return { subtotal, discountPercent, discountAmount, totalPrice, totalItems: items };
  }, [selectedServices]);

  const toggleService = (service: ServiceOption) => {
    const newSelected = new Map(selectedServices);
    
    if (newSelected.has(service.id)) {
      newSelected.delete(service.id);
    } else {
      newSelected.set(service.id, { service, quantity: 1 });
      if (service.image_url) {
        setActiveImage(service.image_url);
      }
    }
    
    setSelectedServices(newSelected);
  };

  const updateQuantity = (serviceId: string, delta: number) => {
    const newSelected = new Map(selectedServices);
    const current = newSelected.get(serviceId);
    
    if (current) {
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        newSelected.delete(serviceId);
      } else {
        newSelected.set(serviceId, { ...current, quantity: newQty });
      }
    }
    
    setSelectedServices(newSelected);
  };

  const addPackageToCart = () => {
    // Create a single package item with all selected services
    const packageItems = Array.from(selectedServices.values())
      .map(({ service, quantity }) => `${service.name} x${quantity}`)
      .join(', ');

    addItem({
      serviceId: `custom-package-${Date.now()}`,
      name: `Custom Package (${selectedServices.size} services)`,
      price: totalPrice,
      selectedOption: packageItems,
      imageUrl: activeImage,
    });
    
    toast.success('Package added to basket', {
      description: `£${totalPrice.toFixed(2)}/mo`,
    });
  };

  // Get selected category services
  const selectedCategoryServices = selectedCategory 
    ? filteredServicesByCategory[selectedCategory] || []
    : [];

  // Get featured images from selected services
  const selectedImages = useMemo(() => {
    const images: string[] = [];
    selectedServices.forEach(({ service }) => {
      if (service.image_url) {
        images.push(service.image_url);
      }
    });
    return images.slice(0, 8);
  }, [selectedServices]);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Build Your Package | Fuel For Football"
        description="Customise your own training package. Select from our range of performance services to create your perfect development programme."
        url="/customisation"
      />
      <ShopHeader type="customisation" />

      <main className="pt-16 md:pt-20 min-h-screen flex">
        {/* Left Sidebar - Porsche Style */}
        <aside className="w-80 lg:w-96 border-r border-border bg-background flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] sticky top-16 md:top-20">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h1 className="font-bebas text-2xl uppercase tracking-wider">Build Your Package</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select services to create your programme
            </p>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Categories */}
          <nav className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-2">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : (
              <ul className="p-2">
                {CATEGORIES.map((category, index) => {
                  const categoryServices = filteredServicesByCategory[category.id] || [];
                  const selectedInCategory = categoryServices.filter(s => selectedServices.has(s.id)).length;
                  
                  if (categoryServices.length === 0 && !searchQuery) return null;

                  return (
                    <motion.li
                      key={category.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <button
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        )}
                        className={cn(
                          "w-full flex items-center justify-between py-3 px-4 text-left transition-all duration-200 rounded-lg",
                          selectedCategory === category.id
                            ? "bg-primary/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <span className="font-medium text-sm">{category.label}</span>
                        <div className="flex items-center gap-2">
                          {selectedInCategory > 0 && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                              {selectedInCategory}
                            </span>
                          )}
                          <ChevronRight 
                            className={cn(
                              "w-4 h-4 transition-transform duration-200",
                              selectedCategory === category.id && "rotate-90"
                            )} 
                          />
                        </div>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </nav>

          {/* Footer - Pricing Summary */}
          <div className="p-4 border-t border-border bg-muted/20">
            {/* Pricing */}
            <div className="space-y-1 mb-4">
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground text-sm">Monthly Total</span>
                <span className="font-bebas text-2xl text-primary">£{totalPrice.toFixed(2)}<span className="text-sm text-muted-foreground font-sans">/mo</span></span>
              </div>
              {selectedServices.size > 0 && (
                <p className="text-xs text-muted-foreground text-right">
                  {totalItems} {totalItems === 1 ? 'service' : 'services'} selected
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={addPackageToCart}
              disabled={totalItems === 0}
              className="w-full font-bebas uppercase tracking-wider"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add Package to Basket
            </Button>

            {/* Back Link */}
            <LocalizedLink
              to="/services"
              className="flex items-center gap-2 mt-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors justify-center"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Services</span>
            </LocalizedLink>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Services Panel */}
          <div className="lg:w-1/2 border-r border-border overflow-y-auto h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
            <AnimatePresence mode="wait">
              {selectedCategory ? (
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bebas text-2xl uppercase tracking-wider">
                      {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                    </h2>
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <TooltipProvider delayDuration={300}>
                      {selectedCategoryServices.map((service) => {
                        const isSelected = selectedServices.has(service.id);
                        const selectedData = selectedServices.get(service.id);
                        
                        return (
                          <Tooltip key={service.id}>
                            <TooltipTrigger asChild>
                              <motion.div
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                  "relative p-4 rounded-xl border-2 transition-all cursor-pointer group overflow-hidden",
                                  isSelected 
                                    ? "border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/10" 
                                    : "border-border/50 hover:border-primary/30 hover:bg-muted/20"
                                )}
                                onClick={() => !isSelected && toggleService(service)}
                                onMouseEnter={() => service.image_url && setActiveImage(service.image_url)}
                              >
                                {/* Selection glow effect */}
                                {isSelected && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"
                                  />
                                )}
                                
                                <div className="relative flex items-center justify-between">
                                  <div className="flex-1 pr-4">
                                    <h3 className={cn(
                                      "font-medium text-sm transition-colors",
                                      isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )}>
                                      {service.name}
                                    </h3>
                                    <p className="text-primary font-bebas text-lg mt-1">
                                      £{service.price.toFixed(2)}<span className="text-xs text-muted-foreground font-sans">/mo</span>
                                    </p>
                                  </div>

                                  {isSelected ? (
                                    <motion.div 
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="flex items-center gap-2"
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateQuantity(service.id, -1);
                                        }}
                                        className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-all hover:scale-105 active:scale-95"
                                      >
                                        <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="w-8 text-center font-bebas text-xl">
                                        {selectedData?.quantity || 1}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateQuantity(service.id, 1);
                                        }}
                                        className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/30"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    </motion.div>
                                  ) : (
                                    <motion.div 
                                      whileHover={{ scale: 1.1 }}
                                      className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary/50 transition-all"
                                    >
                                      <Plus className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                            </TooltipTrigger>
                            {service.description && (
                              <TooltipContent side="right" className="max-w-xs bg-background/95 backdrop-blur-sm border-border">
                                <p className="text-sm">{service.description}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        );
                      })}
                    </TooltipProvider>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex items-center justify-center h-full p-8"
                >
                  <div className="text-center max-w-sm">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                      <ChevronRight className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-bebas text-xl uppercase tracking-wider mb-2 text-muted-foreground">
                      Select a Category
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Choose from the categories on the left to view available services
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview Panel */}
          <div className="hidden lg:flex lg:w-1/2 flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] bg-muted/10">
            {/* Main Preview */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {activeImage ? (
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt="Service preview"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40"
                  >
                    <div className="text-center">
                      <img src={fffLogo} alt="FFF" className="w-20 h-20 mx-auto opacity-20" />
                      <p className="text-muted-foreground mt-4 font-bebas uppercase tracking-wider text-sm">
                        Hover over services to preview
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Overlay with package info */}
              {totalItems > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Your Package</p>
                      <p className="font-bebas text-2xl uppercase tracking-wider">
                        {selectedServices.size} {selectedServices.size === 1 ? 'Service' : 'Services'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bebas text-3xl text-primary">
                        £{totalPrice.toFixed(2)}<span className="text-base text-muted-foreground">/mo</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Thumbnails */}
            {selectedImages.length > 0 && (
              <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={cn(
                        "flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
                        activeImage === img ? "border-primary" : "border-transparent hover:border-border"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Summary Drawer - Mobile */}
      <AnimatePresence>
        {showSummary && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowSummary(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bebas text-2xl uppercase tracking-wider">Summary</h2>
                  <button onClick={() => setShowSummary(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {totalItems === 0 ? (
                  <p className="text-muted-foreground">No services selected yet.</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {Array.from(selectedServices.values()).map(({ service, quantity }) => (
                        <div key={service.id} className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{service.name}</h4>
                            <p className="text-xs text-muted-foreground">{service.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">£{(service.price * quantity).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">x{quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between font-bebas text-xl uppercase">
                        <span>Monthly Total</span>
                        <span className="text-primary">£{totalPrice.toFixed(2)}/mo</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        addPackageToCart();
                        setShowSummary(false);
                      }}
                      className="w-full mt-6 font-bebas uppercase tracking-wider"
                      size="lg"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add Package to Basket
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customisation;
