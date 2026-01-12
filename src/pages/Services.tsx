import { useState, useMemo, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoBoxWithPlayerBg, PLAYER_BG_IMAGES } from "@/components/InfoBoxWithPlayerBg";
import { ShopHeader } from "@/components/ShopHeader";
import { ShopServicesSidebar } from "@/components/ShopServicesSidebar";
import { ServiceDetailPanel } from "@/components/ServiceDetailPanel";
import { ServiceCard } from "@/components/ServiceCard";
import { AnimatePresence } from "framer-motion";
import fffLogo from "@/assets/fff_logo.png";

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  badge: string | null;
  ribbon: string | null;
  description: string | null;
  options: unknown;
  visible: boolean;
}

// Sidebar categories - using exact database category values
const sidebarCategories = [
  { label: "All Services", value: "All" },
  { label: "All in One", value: "All in One Services" },
  { label: "Analysis", value: "Analysis Services" },
  { label: "Technical", value: "Technical Services" },
  { label: "Tactical", value: "Tactical" },
  { label: "Physical", value: "Physical Services" },
  { label: "Nutrition", value: "Nutrition Services" },
  { label: "Psychological", value: "Psychological Services" },
  { label: "Coaching", value: "Coaching Services" },
  { label: "Data & Stats", value: "Data Services" },
  { label: "Special Packages", value: "Special Packages" },
];

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under £100", value: "under-100" },
  { label: "£100 - £500", value: "100-500" },
  { label: "£500 - £1000", value: "500-1000" },
  { label: "Over £1000", value: "over-1000" },
];

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('service_catalog')
          .select('*')
          .eq('visible', true)
          .order('display_order');

        if (error) {
          console.error('Error fetching services:', error);
          return;
        }

        setServices(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // Filter by category - exact match with database category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // Filter by price
    if (selectedPrice !== "all") {
      filtered = filtered.filter((s) => {
        switch (selectedPrice) {
          case "under-100":
            return s.price < 100;
          case "100-500":
            return s.price >= 100 && s.price <= 500;
          case "500-1000":
            return s.price >= 500 && s.price <= 1000;
          case "over-1000":
            return s.price > 1000;
          default:
            return true;
        }
      });
    }

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [services, selectedCategory, selectedPrice, sortBy]);


  return (
    <div className="min-h-screen bg-background">
      {/* Use ShopHeader instead of regular Header */}
      <ShopHeader type="services" />

      {/* Hero Section */}
      <InfoBoxWithPlayerBg
        playerImage={PLAYER_BG_IMAGES[0]}
        className="pt-20 md:pt-28 pb-4 md:pb-8 bg-gradient-to-b from-primary/20 to-background"
        imagePosition="right"
        imageOpacity={0.12}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-7xl font-bebas uppercase tracking-wider text-center text-foreground">
            Services
          </h1>
        </div>
      </InfoBoxWithPlayerBg>

      {/* Main Content */}
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-3 md:px-4">
          {/* Mobile Filter Bar */}
          <div className="lg:hidden mb-4 space-y-3">
            {/* Sort & Filter Row */}
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="flex-1 bg-primary/10 border-primary/30 text-foreground text-xs h-9">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {sidebarCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-xs">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="flex-1 bg-primary/10 border-primary/30 text-foreground text-xs h-9">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value} className="text-xs">
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-24 bg-primary/10 border-primary/30 text-foreground text-xs h-9">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default" className="text-xs">Default</SelectItem>
                  <SelectItem value="price-low" className="text-xs">Price ↑</SelectItem>
                  <SelectItem value="price-high" className="text-xs">Price ↓</SelectItem>
                  <SelectItem value="name" className="text-xs">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Results count */}
            <p className="text-muted-foreground text-xs">
              {loading ? 'Loading...' : `${filteredServices.length} services`}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            {/* Left Sidebar (Desktop only) */}
            <div className="hidden lg:block">
              <ShopServicesSidebar
                type="services"
                categories={sidebarCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Sort Header - Desktop only */}
              <div className="hidden lg:flex justify-between items-center mb-4 md:mb-6">
                <p className="text-muted-foreground text-xs md:text-sm">
                  {loading ? 'Loading...' : `${filteredServices.length} services`}
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36 md:w-48 bg-primary/10 border-primary/30 text-foreground text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Sort by</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="aspect-[3/4] rounded-lg" />
                      <Skeleton className="h-5 mt-3 w-3/4 mx-auto" />
                      <Skeleton className="h-4 mt-2 w-1/2 mx-auto" />
                    </div>
                  ))}
                </div>
              )}

              {/* Services Grid */}
              {!loading && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      name={service.name}
                      category={service.category}
                      price={service.price}
                      imageUrl={service.image_url}
                      description={service.description}
                      badge={service.badge}
                      ribbon={service.ribbon}
                      options={service.options}
                      onClick={() => setSelectedService(service)}
                    />
                  ))}
                </div>
              )}

              {/* No results */}
              {!loading && filteredServices.length === 0 && (
                <div className="text-center py-12 md:py-16">
                  <p className="text-lg md:text-xl font-bebas uppercase tracking-wider text-muted-foreground">
                    No services found
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-2">
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Service Detail Panel */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailPanel
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Services;
