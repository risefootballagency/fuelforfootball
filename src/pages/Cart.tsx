import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import fffLogo from "@/assets/fff_logo.png";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return `£${price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);
    toast({
      title: "Processing...",
      description: "Preparing your checkout session...",
    });

    try {
      // For now, checkout the first item (multi-item checkout requires more complex Stripe setup)
      // TODO: Implement multi-item checkout with Stripe
      const firstItem = items[0];
      
      const { data, error } = await supabase.functions.invoke('create-service-checkout', {
        body: {
          serviceId: firstItem.serviceId,
          selectedOption: firstItem.selectedOption,
          paymentMode: 'payment',
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/50 mb-6" />
            <h1 className="text-4xl font-bebas text-primary mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Add some services to get started.</p>
            <Button asChild size="lg" className="font-bebas uppercase tracking-wider">
              <LocalizedLink to="/services">
                <ArrowLeft className="mr-2 h-4 w-4" /> Browse Services
              </LocalizedLink>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bebas uppercase tracking-wider text-center mb-8">
            Your <span className="text-primary">Cart</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-card border border-primary/30 rounded-lg p-4 flex gap-4"
                >
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <img src={fffLogo} alt="" className="w-12 h-12 opacity-30" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bebas text-lg uppercase tracking-wider text-foreground truncate">
                      {item.name}
                    </h3>
                    {item.selectedOption && (
                      <p className="text-sm text-muted-foreground">{item.selectedOption}</p>
                    )}
                    <p className="text-primary font-bebas text-xl mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-bebas text-lg w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-primary/30 rounded-lg p-6 sticky top-24">
                <h2 className="font-bebas text-2xl uppercase tracking-wider mb-4">Order Summary</h2>
                
                <div className="space-y-3 border-b border-border pb-4 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate max-w-[60%]">
                        {item.name} x{item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bebas text-xl mb-6">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full btn-shine font-bebas uppercase tracking-wider"
                >
                  {isProcessing ? "Processing..." : "Proceed to Checkout"}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
