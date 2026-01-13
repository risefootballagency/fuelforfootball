import { useState } from "react";
import { X, ShoppingCart, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import fffLogo from "@/assets/fff_logo.png";
import { motion } from "framer-motion";

interface ServiceOption {
  name: string;
  price: number;
}

interface ServiceDetailPanelProps {
  service: {
    id: string;
    name: string;
    category: string;
    price: number;
    image_url: string | null;
    description: string | null;
    badge: string | null;
    options?: unknown;
  };
  onClose: () => void;
}

export const ServiceDetailPanel = ({ service, onClose }: ServiceDetailPanelProps) => {
  const { addItem } = useCart();
  const [selectedOption, setSelectedOption] = useState<ServiceOption | null>(null);
  const [added, setAdded] = useState(false);

  const options = service.options as ServiceOption[] | null;
  const hasOptions = options && Array.isArray(options) && options.length > 0;
  const activePrice = selectedOption?.price || service.price;

  const handleAddToCart = () => {
    addItem({
      serviceId: service.id,
      name: service.name,
      price: activePrice,
      selectedOption: selectedOption?.name || undefined,
      imageUrl: service.image_url || undefined,
    });
    
    setAdded(true);
    toast.success('Added to basket', {
      description: `${service.name}${selectedOption ? ` - ${selectedOption.name}` : ''}`,
    });
    
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-[150] bg-background/95 backdrop-blur-md overflow-y-auto"
    >
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-bebas uppercase tracking-wider">Back</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/20 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={fffLogo} alt="FFF" className="w-32 h-32 object-contain opacity-30" />
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {/* Category Badge */}
              {service.badge && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bebas uppercase tracking-wider bg-primary/10 text-primary w-fit mb-4">
                  {service.badge}
                </span>
              )}

              <h1 className="font-bebas text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider text-foreground mb-4">
                {service.name}
              </h1>

              <div className="w-12 h-0.5 bg-primary mb-6" />

              {service.description && (
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {service.description}
                </p>
              )}

              {/* Options */}
              {hasOptions && (
                <div className="mb-8">
                  <h3 className="font-bebas uppercase tracking-wider text-sm text-muted-foreground mb-3">
                    Select Option
                  </h3>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedOption(option)}
                        className={`w-full p-4 rounded-lg border transition-all text-left ${
                          selectedOption?.name === option.name
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option.name || 'Option'}</span>
                          <span className="font-bebas text-lg text-primary">
                            £{(option.price ?? 0).toFixed(2)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="mb-8">
                <span className="text-muted-foreground text-sm">
                  {hasOptions ? 'Selected price' : 'Price'}
                </span>
                <div className="font-bebas text-4xl text-primary">
                  £{(activePrice ?? 0).toFixed(2)}
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="font-bebas uppercase tracking-wider text-lg py-6"
                disabled={hasOptions && !selectedOption}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Basket
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Basket
                  </>
                )}
              </Button>

              {hasOptions && !selectedOption && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Please select an option
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
