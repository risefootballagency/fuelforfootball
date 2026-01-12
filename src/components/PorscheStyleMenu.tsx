import { useState } from "react";
import { X, ChevronRight, ShoppingCart, Search, ArrowLeft, Sparkles } from "lucide-react";
import { DrawerClose } from "@/components/ui/drawer";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  items?: {
    id: string;
    name: string;
    price?: number;
    path: string;
    imageUrl?: string;
    badge?: string;
  }[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "holistic",
    name: "All-in-One Performance",
    description: "Complete integrated performance packages",
    items: [
      { id: "pro", name: "Pro Performance", price: 499, path: "/services/pro-performance", badge: "Popular" },
      { id: "elite", name: "Elite Performance", price: 999, path: "/services/elite-performance", badge: "Best Value" },
    ]
  },
  {
    id: "analysis",
    name: "Analysis",
    description: "Tactical and performance analysis",
    items: [
      { id: "analysis", name: "Video Analysis", path: "/services/analysis" },
      { id: "action-reports", name: "Action Reports", path: "/services/action-reports" },
    ]
  },
  {
    id: "technical",
    name: "Technical",
    description: "Skill development and technique",
    items: [
      { id: "technical", name: "Technical Training", path: "/services/technical" },
    ]
  },
  {
    id: "tactical",
    name: "Tactical",
    description: "Game understanding and positioning",
    items: [
      { id: "tactical", name: "Tactical Training", path: "/services/tactical" },
    ]
  },
  {
    id: "physical",
    name: "Physical",
    description: "Strength, speed, and conditioning",
    items: [
      { id: "sps", name: "Strength, Power & Speed", path: "/services/strength-power-speed" },
      { id: "conditioning", name: "Conditioning", path: "/services/conditioning" },
    ]
  },
  {
    id: "mental",
    name: "Mental",
    description: "Psychology and mindset",
    items: [
      { id: "mental", name: "Mental Performance", path: "/services/mental" },
    ]
  },
  {
    id: "nutrition",
    name: "Nutrition",
    description: "Diet and performance nutrition",
    items: [
      { id: "nutrition", name: "Nutrition Plans", path: "/services/nutrition" },
    ]
  },
  {
    id: "general",
    name: "General",
    description: "Mentorship and consultation",
    items: [
      { id: "mentorship", name: "Mentorship", path: "/services/mentorship" },
      { id: "consultation", name: "Consultation", path: "/services/consultation" },
    ]
  },
];

const SHOP_CATEGORIES: ServiceCategory[] = [
  {
    id: "analysis-products",
    name: "Analysis",
    description: "Educational analysis products",
    items: [
      { id: "pop", name: "Principles of Play", price: 9.99, path: "/shop?category=analysis" },
      { id: "schemes", name: "Schemes", price: 19.99, path: "/shop?category=analysis" },
    ]
  },
  {
    id: "training-products",
    name: "Training",
    description: "Training guides and programs",
    items: [
      { id: "guides", name: "Training Guides", path: "/shop?category=training" },
    ]
  },
];

interface PorscheStyleMenuProps {
  type: 'shop' | 'services';
  onClose?: () => void;
}

export const PorscheStyleMenu = ({ type, onClose }: PorscheStyleMenuProps) => {
  const { t } = useLanguage();
  const { totalItems, totalPrice } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = type === 'services' ? SERVICE_CATEGORIES : SHOP_CATEGORIES;
  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  const filteredCategories = searchQuery
    ? categories.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.items?.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categories;

  return (
    <div className="fixed inset-0 z-[200] flex">
      {/* Left Panel - Categories */}
      <div className="w-full md:w-[400px] bg-background border-r border-border flex flex-col h-full">
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
          <div className="w-6" /> {/* Spacer for alignment */}
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
          <ul className="space-y-1">
            {filteredCategories.map((category, index) => (
              <motion.li
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className={cn(
                    "w-full flex items-center justify-between py-3 px-4 text-left transition-all duration-200 rounded-lg group",
                    selectedCategory === category.id
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="font-medium">{category.name}</span>
                  <ChevronRight 
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      selectedCategory === category.id && "rotate-90"
                    )} 
                  />
                </button>
              </motion.li>
            ))}
          </ul>
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
                  Customise your own training package
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

      {/* Right Panel - Category Items with Images */}
      <div className="hidden md:flex flex-1 bg-muted/20 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedCategoryData ? (
            <motion.div
              key={selectedCategoryData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full p-8"
            >
              <h3 className="font-bebas text-3xl uppercase tracking-wider mb-2">
                {selectedCategoryData.name}
              </h3>
              {selectedCategoryData.description && (
                <p className="text-muted-foreground mb-8">
                  {selectedCategoryData.description}
                </p>
              )}

              {/* Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedCategoryData.items?.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DrawerClose asChild>
                      <LocalizedLink
                        to={item.path}
                        className="group block bg-background border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                      >
                        {/* Image Area */}
                        <div className="aspect-[16/10] bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center relative overflow-hidden">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="text-6xl font-bebas text-primary/20 uppercase">
                              {item.name.charAt(0)}
                            </div>
                          )}
                          
                          {/* Badge */}
                          {item.badge && (
                            <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bebas uppercase px-2 py-1 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h4 className="font-bebas text-lg uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          {item.price && (
                            <p className="text-sm text-muted-foreground mt-1">
                              From £{item.price.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                      </LocalizedLink>
                    </DrawerClose>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex items-center justify-center p-8"
            >
              <div className="text-center max-w-md">
                <h3 className="font-bebas text-3xl uppercase tracking-wider mb-4 text-muted-foreground">
                  Select a Category
                </h3>
                <p className="text-muted-foreground">
                  Choose from our range of {type === 'services' ? 'performance services' : 'products'} to explore options
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Darkened overlay for right side (click to close) */}
      <DrawerClose asChild>
        <div className="hidden md:block absolute top-0 right-0 bottom-0 left-[400px] z-[-1]" />
      </DrawerClose>
    </div>
  );
};
