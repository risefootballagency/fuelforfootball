import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface CartNotificationProps {
  show: boolean;
  onDismiss: () => void;
  itemName?: string;
  itemPrice?: number;
}

export const CartNotification = ({ show, onDismiss, itemName, itemPrice }: CartNotificationProps) => {
  const { totalItems, totalPrice } = useCart();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show) {
      setProgress(100);
      const startTime = Date.now();
      const duration = 10000; // 10 seconds

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          onDismiss();
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-96 z-[150] bg-background border-2 border-primary rounded-xl shadow-2xl shadow-primary/20 overflow-hidden"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
              transition={{ duration: 0.05, ease: "linear" }}
            />
          </div>

          <div className="p-4 pt-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bebas text-lg uppercase tracking-wider text-foreground">
                    Added to Basket
                  </p>
                  {itemName && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {itemName}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Cart Summary */}
            <div className="bg-muted/30 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in basket
                </span>
                <span className="font-bebas text-xl text-primary">
                  £{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onDismiss}
                className="flex-1 font-bebas uppercase tracking-wider"
              >
                Continue Shopping
              </Button>
              <Button
                asChild
                size="sm"
                className="flex-1 font-bebas uppercase tracking-wider btn-shine"
              >
                <LocalizedLink to="/cart">
                  Checkout <ArrowRight className="w-4 h-4 ml-1" />
                </LocalizedLink>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
