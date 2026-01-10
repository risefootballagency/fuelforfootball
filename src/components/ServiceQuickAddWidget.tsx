import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface ServiceQuickAddWidgetProps {
  service: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string;
    image_url?: string | null;
  };
}

export const ServiceQuickAddWidget = ({ service }: ServiceQuickAddWidgetProps) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      serviceId: service.id,
      name: service.name,
      price: service.price,
      selectedOption: null,
      imageUrl: service.image_url || null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stripHtml = (html: string) => {
    return html?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' || '';
  };

  return (
    <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-border rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className="text-[10px] md:text-xs text-primary font-bebas uppercase tracking-wider">
              {service.category}
            </span>
            <h4 className="font-bebas text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors mt-0.5 leading-tight">
              {service.name}
            </h4>
          </div>
          <div className="text-right">
            <span className="font-bebas text-xl md:text-2xl text-primary">
              £{service.price}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {stripHtml(service.description || '')}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <Button
            onClick={handleAddToCart}
            size="sm"
            className={`flex-1 font-bebas uppercase tracking-wider text-sm transition-all ${
              added ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                Add to Cart
              </>
            )}
          </Button>
          <Link to={`/service/${service.id}`}>
            <Button variant="outline" size="sm" className="font-bebas uppercase tracking-wider text-sm">
              <span className="hidden sm:inline mr-1">View</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
