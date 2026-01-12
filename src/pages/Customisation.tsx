import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { LocalizedLink } from "@/components/LocalizedLink";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Check, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft,
  Info,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import fffLogo from "@/assets/fff_logo.png";

interface ServiceOption {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
  frequency?: string;
}

interface SelectedService {
  service: ServiceOption;
  quantity: number;
}

// Service categories for the configurator
const CATEGORIES = [
  { id: "Analysis Services", label: "Analysis", icon: "📊" },
  { id: "Technical Services", label: "Technical", icon: "⚽" },
  { id: "Physical Services", label: "Physical", icon: "💪" },
  { id: "Nutrition Services", label: "Nutrition", icon: "🥗" },
  { id: "Psychological Services", label: "Mental", icon: "🧠" },
  { id: "Coaching Services", label: "Coaching", icon: "📋" },
  { id: "Data Services", label: "Data & Stats", icon: "📈" },
];

const Customisation = () => {
  const { addItem } = useCart();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<Map<string, SelectedService>>(new Map());
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('service_catalog')
          .select('id, name, category, price, description, image_url')
          .eq('visible', true)
          .not('category', 'eq', 'All in One Services')
          .order('category', { ascending: true })
          .order('price', { ascending: true });

        if (error) throw error;
        
        // Map the data to include frequency field
        const mappedData: ServiceOption[] = (data || []).map(item => ({
          ...item,
          frequency: undefined
        }));
        
        setServices(mappedData);
        
        // Set initial image
        if (mappedData.length > 0 && mappedData[0].image_url) {
          setActiveImage(mappedData[0].image_url);
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

  // Calculate totals
  const { totalPrice, monthlyPrice, totalItems } = useMemo(() => {
    let total = 0;
    let monthly = 0;
    let items = 0;

    selectedServices.forEach(({ service, quantity }) => {
      const price = service.price * quantity;
      total += price;
      items += quantity;
      
      // Estimate monthly based on frequency
      if (service.frequency?.includes('month')) {
        monthly += price;
      } else {
        monthly += price / 12; // Spread one-time payments over 12 months
      }
    });

    return { totalPrice: total, monthlyPrice: monthly, totalItems: items };
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

  const addAllToCart = () => {
    selectedServices.forEach(({ service, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        addItem({
          serviceId: service.id,
          name: service.name,
          price: service.price,
          selectedOption: null,
          imageUrl: service.image_url,
        });
      }
    });
    
    toast.success(`Added ${totalItems} items to basket`, {
      description: `Total: £${totalPrice.toFixed(2)}`,
    });
  };

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
      <Header />

      {/* Top Bar - Porsche style */}
      <div className="fixed top-14 md:top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12 md:h-14">
            <LocalizedLink 
              to="/services" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Back to Services</span>
            </LocalizedLink>

            <div className="flex items-center gap-4 md:gap-8">
              {/* Monthly estimate */}
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Est. Monthly</span>
                <span className="font-bebas text-lg md:text-xl">
                  £{monthlyPrice.toFixed(2)}<span className="text-xs text-muted-foreground">/mo</span>
                </span>
              </div>

              {/* Total */}
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Total</span>
                <span className="font-bebas text-lg md:text-xl text-primary">
                  £{totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Summary button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSummary(true)}
                className="hidden md:flex"
              >
                Summary
              </Button>

              {/* Add to cart */}
              <Button
                onClick={addAllToCart}
                disabled={totalItems === 0}
                className="font-bebas uppercase tracking-wider"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add All ({totalItems})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="pt-28 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Preview Area */}
            <div className="lg:w-2/3 lg:sticky lg:top-32 lg:h-[calc(100vh-160px)]">
              {/* Main Preview */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-primary/5 to-muted rounded-xl overflow-hidden border border-border">
                <AnimatePresence mode="wait">
                  {activeImage ? (
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt="Service preview"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <div className="text-center">
                        <img src={fffLogo} alt="FFF" className="w-24 h-24 mx-auto opacity-20" />
                        <p className="text-muted-foreground mt-4 font-bebas uppercase tracking-wider">
                          Select services to preview
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-background transition-colors border border-border">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>

              {/* Thumbnails */}
              {selectedImages.length > 0 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {selectedImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={cn(
                        "flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                        activeImage === img ? "border-primary" : "border-transparent hover:border-border"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Services Count */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bebas text-lg uppercase tracking-wider">Your Package</h3>
                  <span className="text-sm text-muted-foreground">{totalItems} services selected</span>
                </div>
                
                {totalItems === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Start building your custom package by selecting services from the categories on the right.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Array.from(selectedServices.values()).map(({ service, quantity }) => (
                      <div key={service.id} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1">{service.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">×{quantity}</span>
                          <span className="font-medium">£{(service.price * quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right - Categories and Options */}
            <div className="lg:w-1/3">
              <div className="mb-6">
                <h1 className="font-bebas text-3xl md:text-4xl uppercase tracking-wider">
                  Build Your Package
                </h1>
                <p className="text-muted-foreground mt-2">
                  Select the services you need to create your personalised development programme.
                </p>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search equipment options"
                  className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Categories Accordion */}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {CATEGORIES.map((category) => {
                    const categoryServices = servicesByCategory[category.id] || [];
                    const selectedInCategory = categoryServices.filter(s => selectedServices.has(s.id)).length;
                    
                    if (categoryServices.length === 0) return null;

                    return (
                      <AccordionItem
                        key={category.id}
                        value={category.id}
                        className="border border-border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-xl">{category.icon}</span>
                            <span className="font-medium">{category.label}</span>
                            {selectedInCategory > 0 && (
                              <span className="ml-auto mr-4 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                {selectedInCategory} selected
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-2 pt-2">
                            {categoryServices.map((service) => {
                              const isSelected = selectedServices.has(service.id);
                              const selectedData = selectedServices.get(service.id);
                              
                              return (
                                <div
                                  key={service.id}
                                  className={cn(
                                    "p-3 rounded-lg border transition-all cursor-pointer",
                                    isSelected 
                                      ? "border-primary bg-primary/5" 
                                      : "border-border hover:border-primary/50"
                                  )}
                                  onClick={() => !isSelected && toggleService(service)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{service.name}</span>
                                        {service.frequency && (
                                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {service.frequency}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-sm text-primary font-medium">
                                        £{service.price.toFixed(2)}
                                      </span>
                                    </div>

                                    {isSelected ? (
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            updateQuantity(service.id, -1);
                                          }}
                                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-6 text-center text-sm font-medium">
                                          {selectedData?.quantity || 1}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            updateQuantity(service.id, 1);
                                          }}
                                          className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                                        <Plus className="w-3 h-3 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}

              {/* Info Note */}
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      Need help choosing?
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contact us for a free consultation to discuss your development goals.
                    </p>
                    <LocalizedLink 
                      to="/contact"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Get in touch →
                    </LocalizedLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Summary Drawer */}
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
                    <div className="space-y-4 mb-6">
                      {Array.from(selectedServices.values()).map(({ service, quantity }) => (
                        <div key={service.id} className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{service.name}</h4>
                            <p className="text-xs text-muted-foreground">{service.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">£{(service.price * quantity).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">×{quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>£{totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Monthly</span>
                        <span>£{monthlyPrice.toFixed(2)}/mo</span>
                      </div>
                      <div className="flex justify-between font-bebas text-xl uppercase pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-primary">£{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        addAllToCart();
                        setShowSummary(false);
                      }}
                      className="w-full mt-6 font-bebas uppercase tracking-wider"
                      size="lg"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add All to Basket
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Customisation;
