import { useState, useMemo, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Download } from "lucide-react";
import { ShopHeader } from "@/components/ShopHeader";
import { ShopServicesSidebar } from "@/components/ShopServicesSidebar";
import { ServiceDetailPanel } from "@/components/ServiceDetailPanel";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShopProduct {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image_url: string | null;
  badge: string | null;
  ribbon: string | null;
  visible: boolean;
  display_order: number;
  file_url: string | null;
  product_type: string;
}

const Shop = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Sidebar categories format
  const sidebarCategories = [
    { label: t("shop.cat_all", "All Products"), value: "All" },
    { label: t("shop.cat_ebooks", "E-Books"), value: "E-Books" },
    { label: t("shop.cat_templates", "Templates"), value: "Templates" },
    { label: t("shop.cat_plans", "Training Plans"), value: "Training Plans" },
    { label: t("shop.cat_guides", "Guides"), value: "Guides" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_products')
        .select('*')
        .eq('visible', true)
        .order('display_order');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching shop products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    return filtered;
  }, [selectedCategory, products]);

  // Convert products to service format for ServiceDetailPanel
  const productsAsServices = useMemo(() => filteredProducts.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    image_url: p.image_url,
    description: p.description || null,
    badge: p.badge || null,
    options: null,
  })), [filteredProducts]);

  const productAsService = selectedProduct ? {
    id: selectedProduct.id,
    name: selectedProduct.name,
    category: selectedProduct.category,
    price: selectedProduct.price,
    image_url: selectedProduct.image_url,
    description: selectedProduct.description || null,
    badge: selectedProduct.badge || null,
    options: null,
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader type="shop" />

      {/* Hero Section */}
      <section className="pt-24 md:pt-28 pb-8 bg-gradient-to-b from-primary/20 to-background border-b-4 border-primary">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider text-center text-foreground italic">
            {t("shop.title", "Shop")}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <div className="hidden lg:block">
              <ShopServicesSidebar
                type="shop"
                categories={sidebarCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-64 w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="group cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        {/* Product Card */}
                        <div className="relative bg-[hsl(120,40%,12%)] border-2 border-primary rounded-lg overflow-hidden p-4 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all">
                          {/* Download Icon Badge */}
                          <div className="absolute top-6 right-6 z-10">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <Download className="w-4 h-4 text-primary-foreground" />
                            </div>
                          </div>

                          {/* Ribbon Badge */}
                          {product.ribbon && (
                            <div className="absolute top-4 left-4 z-10">
                              <span className="bg-accent text-background text-xs font-bebas uppercase px-2 py-1 rounded">
                                {product.ribbon}
                              </span>
                            </div>
                          )}

                          {/* Circular Image Container */}
                          <div className="flex justify-center mb-4">
                            <div className="w-40 h-40 rounded-full border-4 border-primary bg-[hsl(120,35%,15%)] flex items-center justify-center overflow-hidden">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Download className="w-12 h-12 text-primary/50" />
                              )}
                            </div>
                          </div>

                          {/* Product Label Banner */}
                          <div className="space-y-1">
                            <div className="bg-[hsl(120,30%,20%)] text-center py-1">
                              <span className="text-xs font-bebas uppercase tracking-wider text-primary">
                                {product.category.toUpperCase()}
                              </span>
                            </div>
                            <div className="bg-primary text-center py-2">
                              <span className="text-sm font-bebas uppercase tracking-wider text-primary-foreground">
                                {product.badge || product.name}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Product Info (outside card) */}
                        <div className="mt-4">
                          <h3 className="font-normal text-base text-foreground leading-tight group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2">£{(product.price ?? 0).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* No results */}
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-xl font-bebas uppercase tracking-wider text-muted-foreground">
                        {t("shop.no_products", "No products found")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {t("shop.no_products_desc", "Try adjusting your filters or check back later")}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Panel */}
      <AnimatePresence>
        {productAsService && (
          <ServiceDetailPanel
            service={productAsService}
            onClose={() => setSelectedProduct(null)}
            allServices={productsAsServices}
            onNavigate={(service) => {
              const product = filteredProducts.find(p => p.id === service.id);
              if (product) setSelectedProduct(product);
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Shop;