import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LateralFilter } from "@/components/LateralFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import fffLogo from "@/assets/fff_logo.png";

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  priceLabel: string;
  image: string;
  badge?: string;
}

// Placeholder service data - replace with Supabase data later
const placeholderServices: Service[] = [
  {
    id: "1",
    name: "Player Review",
    category: "Analysis Services",
    price: 95,
    priceLabel: "From £95.00",
    image: "/placeholder.svg",
    badge: "PLAYER REVIEW",
  },
  {
    id: "2",
    name: "Off-Season Programming (3 Months)",
    category: "Physical Services",
    price: 299,
    priceLabel: "From £299.00",
    image: "/placeholder.svg",
    badge: "OFF-SEASON PROGRAMMING",
  },
  {
    id: "3",
    name: "Youth Development Programme",
    category: "All in One Services",
    price: 50,
    priceLabel: "£50.00",
    image: "/placeholder.svg",
    badge: "YOUTH DEVELOPMENT PROGRAMME",
  },
  {
    id: "4",
    name: "European Match Analysis Package",
    category: "Analysis Services",
    price: 399,
    priceLabel: "From £399.00",
    image: "/placeholder.svg",
    badge: "EUROPEAN CAMPAIGN ANALYSIS PACKAGE",
  },
  {
    id: "5",
    name: "Technical Training Plan",
    category: "Technical Services",
    price: 149,
    priceLabel: "From £149.00",
    image: "/placeholder.svg",
    badge: "TECHNICAL TRAINING PLAN",
  },
  {
    id: "6",
    name: "Nutrition Consultation",
    category: "Nutrition Services",
    price: 75,
    priceLabel: "From £75.00",
    image: "/placeholder.svg",
    badge: "NUTRITION CONSULTATION",
  },
  {
    id: "7",
    name: "Mental Performance Session",
    category: "Psychological Services",
    price: 85,
    priceLabel: "From £85.00",
    image: "/placeholder.svg",
    badge: "MENTAL PERFORMANCE SESSION",
  },
  {
    id: "8",
    name: "1-to-1 Coaching Session",
    category: "Coaching Services",
    price: 120,
    priceLabel: "From £120.00",
    image: "/placeholder.svg",
    badge: "1-TO-1 COACHING",
  },
  {
    id: "9",
    name: "Performance Data Report",
    category: "Data Services",
    price: 199,
    priceLabel: "From £199.00",
    image: "/placeholder.svg",
    badge: "PERFORMANCE DATA REPORT",
  },
];

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
];

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under £100", value: "under-100" },
  { label: "£100 - £200", value: "100-200" },
  { label: "£200 - £300", value: "200-300" },
  { label: "Over £300", value: "over-300" },
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(false);

  const filteredServices = useMemo(() => {
    let filtered = [...placeholderServices];

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
          case "100-200":
            return s.price >= 100 && s.price <= 200;
          case "200-300":
            return s.price >= 200 && s.price <= 300;
          case "over-300":
            return s.price > 300;
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
  }, [selectedCategory, selectedPrice, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-28 pb-8 bg-gradient-to-b from-primary/20 to-background">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider text-center text-foreground">
            Services
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <h2 className="text-xl font-bebas uppercase tracking-wider text-foreground mb-6">
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
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Sort Header */}
              <div className="flex justify-end mb-6">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-primary/10 border-primary/30 text-foreground">
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

              {/* Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="group cursor-pointer"
                  >
                    {/* Card */}
                    <div className="relative bg-card border-2 border-primary/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                      {/* Top Badge with Logo */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                        <div className="relative">
                          {/* Logo circle */}
                          <div className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center -mb-2 mx-auto relative z-20">
                            <img src={fffLogo} alt="FFF" className="w-6 h-6 object-contain" />
                          </div>
                          {/* Banner */}
                          <div className="bg-primary px-3 py-1 rounded-b-lg">
                            <span className="text-[10px] font-bebas uppercase tracking-wider text-primary-foreground whitespace-nowrap">
                              {service.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Service Image */}
                      <div className="aspect-[3/4] pt-12 p-4">
                        <div className="w-full h-full rounded-lg overflow-hidden border border-primary/20">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
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
                    <div className="mt-4 text-center">
                      <h3 className="font-bebas text-lg uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <div className="w-8 h-px bg-primary/50 mx-auto my-2" />
                      <p className="text-sm text-muted-foreground">{service.priceLabel}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* No results */}
              {filteredServices.length === 0 && (
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
