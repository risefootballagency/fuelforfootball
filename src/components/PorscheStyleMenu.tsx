import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronRight, ShoppingCart, Search, ArrowLeft, Sparkles } from "lucide-react";
import { DrawerClose } from "@/components/ui/drawer";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
}

interface PorscheStyleMenuProps {
  type: 'shop' | 'services';
}

export const PorscheStyleMenu = ({ type }: PorscheStyleMenuProps) => {
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('service_catalog')
          .select('id, name, price, category, image_url')
          .eq('visible', true)
          .order('category')
          .order('display_order');

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get unique categories from services
  const categories = [...new Set(services.map(s => s.category))].filter(Boolean);

  // Filter services based on search and selected category
  const filteredServices = services.filter(s => {
    const matchesSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get category label
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'All in One Services': 'All in One',
      'Analysis Services': 'Analysis',
      'Technical Services': 'Technical',
      'Physical Services': 'Physical',
      'Nutrition Services': 'Nutrition',
      'Psychological Services': 'Mental',
      'Coaching Services': 'Coaching',
      'Data Services': 'Data & Stats',
      'Special Packages': 'Special',
      'Tactical': 'Tactical',
    };
    return labels[category] || category;
  };

  // Navigate to services page with category filter
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  // Navigate to service and close drawer
  const handleServiceClick = (category: string) => {
    // Navigate to services page - the page will handle showing details
    navigate(`/services?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="fixed inset-0 z-[200] flex bg-background/95 backdrop-blur-md">
      {/* Left Panel - Categories */}
      <div className="w-full md:w-[380px] bg-background border-r border-border flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <DrawerClose asChild>
            <button className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-6 h-6" />
            </button>
          </DrawerClose>
          <h2 className="font-bebas text-2xl uppercase tracking-wider">
            {type === 'services' ? 'Services' : 'Shop'}
          </h2>
          <div className="w-6" />
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Categories List */}
        <nav className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {categories.map((category, index) => {
                const itemCount = services.filter(s => s.category === category).length;
                
                return (
                  <motion.li
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className={cn(
                        "w-full flex items-center justify-between py-3 px-4 text-left transition-all duration-200 rounded-lg group",
                        selectedCategory === category
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <span className="font-medium">{getCategoryLabel(category)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{itemCount}</span>
                        <ChevronRight 
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            selectedCategory === category && "rotate-90"
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

        {/* Footer Links */}
        <div className="p-4 border-t border-border space-y-3">
          {/* Customisation Link */}
          <DrawerClose asChild>
            <LocalizedLink
              to="/customisation"
              className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 rounded-lg transition-all group"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <span className="font-bebas uppercase tracking-wider text-foreground block">
                  Build Your Package
                </span>
                <span className="text-xs text-muted-foreground">
                  Create your custom programme
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </LocalizedLink>
          </DrawerClose>

          {/* Cart */}
          <DrawerClose asChild>
            <LocalizedLink
              to="/cart"
              className="flex items-center justify-between py-3 px-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="font-bebas uppercase tracking-wider text-foreground">
                  Basket
                </span>
              </div>
              {totalItems > 0 && (
                <span className="text-sm font-medium text-foreground">
                  £{totalPrice.toFixed(2)}
                </span>
              )}
            </LocalizedLink>
          </DrawerClose>

          {/* Back to Players */}
          <DrawerClose asChild>
            <LocalizedLink
              to="/players"
              className="flex items-center gap-2 py-2 px-4 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-bebas uppercase tracking-wider">Back to Players</span>
            </LocalizedLink>
          </DrawerClose>
        </div>
      </div>

      {/* Right Panel - Services Preview */}
      <div className="hidden md:flex flex-1 bg-muted/10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedCategory ? (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full p-8"
            >
              <h3 className="font-bebas text-3xl uppercase tracking-wider mb-2">
                {getCategoryLabel(selectedCategory)}
              </h3>
              <p className="text-muted-foreground mb-8">
                {filteredServices.length} services available
              </p>

              {/* Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DrawerClose asChild>
                      <button
                        onClick={() => navigate('/services')}
                        className="w-full group block bg-background border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-left"
                      >
                        {/* Image Area */}
                        <div className="aspect-[16/9] bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center relative overflow-hidden">
                          {service.image_url ? (
                            <img 
                              src={service.image_url} 
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="text-4xl font-bebas text-primary/20 uppercase">
                              {service.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h4 className="font-bebas text-base uppercase tracking-wider text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {service.name}
                          </h4>
                          <p className="text-sm text-primary mt-1">
                            £{service.price.toFixed(2)}
                          </p>
                        </div>
                      </button>
                    </DrawerClose>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 p-8"
            >
              <h3 className="font-bebas text-3xl uppercase tracking-wider mb-2 text-foreground">
                Featured
              </h3>
              <p className="text-muted-foreground mb-8">
                Our most popular {type === 'services' ? 'services' : 'products'}
              </p>

              {/* Featured Services - Stacked */}
              <div className="space-y-4">
                {services.slice(0, 3).map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DrawerClose asChild>
                      <button
                        onClick={() => navigate('/services')}
                        className="w-full group flex bg-background border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-left"
                      >
                        {/* Image */}
                        <div className="w-32 h-24 bg-gradient-to-br from-primary/5 to-primary/20 flex-shrink-0 relative overflow-hidden">
                          {service.image_url ? (
                            <img 
                              src={service.image_url} 
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bebas text-primary/20 uppercase">
                              {service.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 flex flex-col justify-center">
                          <h4 className="font-bebas text-lg uppercase tracking-wider text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {service.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {getCategoryLabel(service.category)}
                          </p>
                        </div>
                      </button>
                    </DrawerClose>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay to close drawer */}
      <DrawerClose asChild>
        <button className="hidden md:block absolute inset-0 z-[-1]" aria-label="Close menu" />
      </DrawerClose>
    </div>
  );
};
