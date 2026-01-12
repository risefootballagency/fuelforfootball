import { useState } from "react";
import { ChevronRight, ChevronDown, ShoppingCart, ArrowLeft, Sparkles, Zap, Star } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface Category {
  label: string;
  value: string;
  subCategories?: { label: string; value: string }[];
}

interface PromotedService {
  name: string;
  path: string;
  badge?: string;
}

interface ShopServicesSidebarProps {
  type: 'shop' | 'services';
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  promotedServices?: PromotedService[];
}

export const ShopServicesSidebar = ({
  type,
  categories,
  selectedCategory,
  onCategoryChange,
  promotedServices = [],
}: ShopServicesSidebarProps) => {
  const { totalItems, totalPrice } = useCart();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const defaultPromotedServices: PromotedService[] = type === 'services' ? [
    { name: "Pro Performance", path: "/services/pro-performance", badge: "Popular" },
    { name: "Elite Performance", path: "/services/elite-performance", badge: "Best Value" },
    { name: "Action Reports", path: "/services/action-reports" },
  ] : [];

  const servicesToShow = promotedServices.length > 0 ? promotedServices : defaultPromotedServices;

  return (
    <aside className="w-64 flex-shrink-0 sticky top-24 h-fit">
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        {/* Build Your Package - TOP */}
        <div className="p-4 border-b border-border">
          <LocalizedLink
            to="/customisation"
            className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 rounded-lg transition-all group"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <span className="font-bebas uppercase tracking-wider text-foreground block text-sm">
                Build Your Package
              </span>
              <span className="text-[10px] text-muted-foreground">
                Custom programme
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </LocalizedLink>
        </div>

        {/* Cart Section - TOP */}
        <div className="p-4 border-b border-border">
          <LocalizedLink
            to="/cart"
            className="flex items-center justify-between py-3 px-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-all group"
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
              <span className="font-bebas text-sm uppercase tracking-wider text-foreground">
                Basket
              </span>
            </div>
            {totalItems > 0 && (
              <span className="text-sm font-medium text-foreground">
                £{totalPrice.toFixed(2)}
              </span>
            )}
          </LocalizedLink>
        </div>

        {/* Categories Section */}
        <div className="p-4">
          <h3 className="font-bebas text-lg uppercase tracking-wider text-foreground mb-4">
            {type === 'shop' ? 'Products' : 'Categories'}
          </h3>
          
          <nav className="space-y-1">
            {categories.map((category) => {
              const hasSubCategories = category.subCategories && category.subCategories.length > 0;
              const isExpanded = expandedCategories.has(category.value);
              const isActive = selectedCategory === category.value;

              return (
                <div key={category.value}>
                  <button
                    onClick={() => {
                      if (hasSubCategories) {
                        toggleCategory(category.value);
                      } else {
                        onCategoryChange(category.value);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium transition-all duration-200 rounded-md",
                      isActive && !hasSubCategories
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{category.label}</span>
                    {hasSubCategories && (
                      isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )
                    )}
                  </button>
                  
                  {hasSubCategories && isExpanded && (
                    <div className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                      {category.subCategories!.map((sub) => (
                        <button
                          key={sub.value}
                          onClick={() => onCategoryChange(sub.value)}
                          className={cn(
                            "w-full text-left py-2 px-2 text-sm transition-colors rounded-md",
                            selectedCategory === sub.value
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Promoted Services Section */}
        {servicesToShow.length > 0 && (
          <>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-bebas text-sm uppercase tracking-wider text-foreground">
                  Featured Services
                </h3>
              </div>
              
              <div className="space-y-2">
                {servicesToShow.map((service) => (
                  <LocalizedLink
                    key={service.path}
                    to={service.path}
                    className="flex items-center justify-between py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-md transition-all group"
                  >
                    <span className="group-hover:text-primary transition-colors">
                      {service.name}
                    </span>
                    {service.badge && (
                      <span className="text-[10px] font-bebas uppercase bg-primary/20 text-primary px-2 py-0.5 rounded">
                        {service.badge}
                      </span>
                    )}
                  </LocalizedLink>
                ))}
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-border" />
          </>
        )}

        {/* Back to Players Button */}
        <div className="p-4 border-t border-border">
          <LocalizedLink
            to="/players"
            className="flex items-center gap-2 py-2 px-3 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-bebas uppercase tracking-wider">Back to Players</span>
          </LocalizedLink>
        </div>
      </div>
    </aside>
  );
};
