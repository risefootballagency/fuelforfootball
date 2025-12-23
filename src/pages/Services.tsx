import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoBoxWithPlayerBg, PLAYER_BG_IMAGES } from "@/components/InfoBoxWithPlayerBg";
import { LocalizedLink } from "@/components/LocalizedLink";
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
  options: any;
  visible: boolean;
}

const categories = [
  "All",
  "All in One Services",
  "Analysis Services",
  "Technical Services",
  "Physical Services",
  "Nutrition Services",
  "Psychological Services",
  "Coaching Services",
  "Data Services",
  "Special Packages",
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
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(false);

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

    // Filter by category
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

  const formatPrice = (price: number, options: unknown) => {
    const optionsArray = options as { name: string; price: number }[] | null;
    const hasOptions = optionsArray && Array.isArray(optionsArray) && optionsArray.length > 0;
    const prefix = hasOptions ? "From " : "";
    return `${prefix}£${price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getServiceSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <InfoBoxWithPlayerBg
        playerImage={PLAYER_BG_IMAGES[0]}
        className="pt-20 md:pt-28 pb-6 md:pb-8 bg-gradient-to-b from-primary/20 to-background"
        imagePosition="right"
        imageOpacity={0.12}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-7xl font-bebas uppercase tracking-wider text-center text-foreground">
            Services
          </h1>
        </div>
      </InfoBoxWithPlayerBg>

      {/* Main Content */}
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            {/* Left Sidebar - Filters */}
            <aside className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
              <h2 className="text-lg md:text-xl font-bebas uppercase tracking-wider text-foreground mb-4 md:mb-6">
                Filter by
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <button
                  onClick={() => setCategoryExpanded(!categoryExpanded)}
                  className="flex items-center justify-between w-full pb-2 border-b border-primary/30"
                >
                  <span className="font-bebas text-lg uppercase tracking-wider text-foreground">
                    Category
                  </span>
                  {categoryExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {categoryExpanded && (
                  <div className="mt-3 space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left text-sm transition-colors ${
                          selectedCategory === cat
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div>
                <button
                  onClick={() => setPriceExpanded(!priceExpanded)}
                  className="flex items-center justify-between w-full pb-2 border-b border-primary/30"
                >
                  <span className="font-bebas text-lg uppercase tracking-wider text-foreground">
                    Price
                  </span>
                  {priceExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {priceExpanded && (
                  <div className="mt-3 space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setSelectedPrice(range.value)}
                        className={`block w-full text-left text-sm transition-colors ${
                          selectedPrice === range.value
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Sort Header */}
              <div className="flex justify-between items-center mb-4 md:mb-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="aspect-[3/4] rounded-lg" />
                      <Skeleton className="h-6 mt-4 w-3/4 mx-auto" />
                      <Skeleton className="h-4 mt-2 w-1/2 mx-auto" />
                    </div>
                  ))}
                </div>
              )}

              {/* Services Grid */}
              {!loading && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                  {filteredServices.map((service) => (
                    <LocalizedLink
                      key={service.id}
                      to={`/service/${getServiceSlug(service.name)}`}
                      className="group cursor-pointer block"
                    >
                      {/* Card */}
                      <div className="relative bg-card border-2 border-primary/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                        {/* Top Badge with Logo */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                          <div className="relative">
                            {/* Logo circle */}
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center -mb-1.5 md:-mb-2 mx-auto relative z-20">
                              <img src={fffLogo} alt="FFF" className="w-5 h-5 md:w-6 md:h-6 object-contain" />
                            </div>
                            {/* Banner */}
                            <div className="bg-primary px-2 md:px-3 py-0.5 md:py-1 rounded-b-lg">
                              <span className="text-[8px] md:text-[10px] font-bebas uppercase tracking-wider text-primary-foreground whitespace-nowrap">
                                {service.badge || service.name.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Ribbon */}
                        {service.ribbon && (
                          <div className="absolute top-10 md:top-14 right-1 md:right-2 z-10 bg-destructive text-destructive-foreground text-[10px] md:text-xs font-bebas uppercase px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                            {service.ribbon}
                          </div>
                        )}

                        {/* Service Image */}
                        <div className="aspect-[3/4] pt-10 md:pt-12 p-2 md:p-4">
                          <div className="w-full h-full rounded-lg overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                            {service.image_url ? (
                              <img
                                src={service.image_url}
                                alt={service.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <img src={fffLogo} alt="FFF" className="w-16 h-16 object-contain mx-auto opacity-30" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Change The Game text */}
                        <div className="text-center py-2">
                          <span className="text-xs font-bebas uppercase tracking-widest text-muted-foreground italic">
                            Change The Game
                          </span>
                        </div>
                      </div>

                      {/* Service Info (outside card) */}
                      <div className="mt-2 md:mt-4 text-center">
                        <h3 className="font-bebas text-sm md:text-lg uppercase tracking-wider text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {service.name}
                        </h3>
                        <div className="w-6 md:w-8 h-px bg-primary/50 mx-auto my-1 md:my-2" />
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {formatPrice(service.price, service.options)}
                        </p>
                      </div>
                    </LocalizedLink>
                  ))}
                </div>
              )}

              {/* No results */}
              {!loading && filteredServices.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-xl font-bebas uppercase tracking-wider text-muted-foreground">
                    No services found
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
