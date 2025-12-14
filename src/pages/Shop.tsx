import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronDown, ChevronUp, Download } from "lucide-react";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  priceLabel: string;
  image: string;
}

// Placeholder product data - replace with Supabase data later
const placeholderProducts: Product[] = [
  {
    id: "1",
    name: "Principles of Play -",
    subtitle: "Chess Not Checkers",
    category: "Analysis",
    price: 9.99,
    priceLabel: "£9.99",
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Schemes - Respond",
    subtitle: "Quickly In Games",
    category: "Analysis",
    price: 19.99,
    priceLabel: "£19.99",
    image: "/placeholder.svg",
  },
];

const categories = ["All", "Analysis"];

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under £10", value: "under-10" },
  { label: "£10 - £20", value: "10-20" },
  { label: "Over £20", value: "over-20" },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...placeholderProducts];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by price
    if (selectedPrice !== "all") {
      filtered = filtered.filter((p) => {
        switch (selectedPrice) {
          case "under-10":
            return p.price < 10;
          case "10-20":
            return p.price >= 10 && p.price <= 20;
          case "over-20":
            return p.price > 20;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [selectedCategory, selectedPrice]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-28 pb-8 bg-gradient-to-b from-primary/20 to-background border-b-4 border-primary">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider text-center text-foreground italic">
            Shop
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Sidebar - Filters */}
            <aside className="hidden lg:block lg:w-56 flex-shrink-0">
              <div className="sticky top-24">
              <h2 className="text-2xl font-bebas uppercase tracking-wider text-foreground mb-8">
                Filter by
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <button
                  onClick={() => setCategoryExpanded(!categoryExpanded)}
                  className="flex items-center justify-between w-full pb-3 border-b border-muted-foreground/30"
                >
                  <span className="font-bebas text-lg uppercase tracking-wider text-foreground">
                    Category
                  </span>
                  {categoryExpanded ? (
                    <span className="text-muted-foreground">−</span>
                  ) : (
                    <span className="text-muted-foreground">+</span>
                  )}
                </button>
                {categoryExpanded && (
                  <div className="mt-4 space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left text-sm transition-colors ${
                          selectedCategory === cat
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-b border-muted-foreground/30 mb-6" />

              {/* Price Filter */}
              <div>
                <button
                  onClick={() => setPriceExpanded(!priceExpanded)}
                  className="flex items-center justify-between w-full pb-3 border-b border-muted-foreground/30"
                >
                  <span className="font-bebas text-lg uppercase tracking-wider text-foreground">
                    Price
                  </span>
                  {priceExpanded ? (
                    <span className="text-muted-foreground">−</span>
                  ) : (
                    <span className="text-muted-foreground">+</span>
                  )}
                </button>
                {priceExpanded && (
                  <div className="mt-4 space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setSelectedPrice(range.value)}
                        className={`block w-full text-left text-sm transition-colors ${
                          selectedPrice === range.value
                            ? "text-foreground font-semibold"
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
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    {/* Product Card */}
                    <div className="relative bg-[hsl(120,40%,12%)] border-2 border-primary rounded-lg overflow-hidden p-4">
                      {/* Download Icon Badge */}
                      <div className="absolute top-6 right-6 z-10">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Download className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>

                      {/* Circular Image Container */}
                      <div className="flex justify-center mb-4">
                        <div className="w-40 h-40 rounded-full border-4 border-primary bg-[hsl(120,35%,15%)] flex items-center justify-center overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Label Banner */}
                      <div className="space-y-1">
                        <div className="bg-[hsl(120,30%,20%)] text-center py-1">
                          <span className="text-xs font-bebas uppercase tracking-wider text-primary">
                            {product.category === "Analysis" ? "PRINCIPLES OF PLAY" : product.category.toUpperCase()}
                          </span>
                        </div>
                        <div className="bg-primary text-center py-2">
                          <span className="text-sm font-bebas uppercase tracking-wider text-primary-foreground">
                            {product.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Info (outside card) */}
                    <div className="mt-4">
                      <h3 className="font-normal text-base text-foreground leading-tight">
                        {product.name}
                        <br />
                        {product.subtitle}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">{product.priceLabel}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* No results */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-xl font-bebas uppercase tracking-wider text-muted-foreground">
                    No products found
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

export default Shop;
