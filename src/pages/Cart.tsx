import { ShopHeader } from "@/components/ShopHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ExternalLink } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import fffLogo from "@/assets/fff_logo.png";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState<string | null>(null);

  // Fetch PayPal details
  useEffect(() => {
    const fetchPaypalDetails = async () => {
      const { data } = await supabase
        .from('bank_details')
        .select('paypal_email')
        .eq('payment_type', 'paypal')
        .eq('is_default', true)
        .limit(1);
      
      if (data && data.length > 0) {
        setPaypalEmail(data[0].paypal_email);
      } else {
        // Try to get any PayPal record if no default
        const { data: anyPaypal } = await supabase
          .from('bank_details')
          .select('paypal_email')
          .eq('payment_type', 'paypal')
          .not('paypal_email', 'is', null)
          .limit(1);
        if (anyPaypal && anyPaypal.length > 0) {
          setPaypalEmail(anyPaypal[0].paypal_email);
        }
      }
    };
    fetchPaypalDetails();
  }, []);

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
        <ShopHeader type="services" />
        <main className="pt-20 md:pt-24 pb-12 md:pb-16">
          <div className="container mx-auto px-4 text-center py-12 md:py-16">
            <ShoppingBag className="h-16 w-16 md:h-24 md:w-24 mx-auto text-muted-foreground/50 mb-4 md:mb-6" />
            <h1 className="text-3xl md:text-4xl font-bebas text-primary mb-3 md:mb-4">Your Cart is Empty</h1>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">Add some services to get started.</p>
            <Button asChild size="lg" className="font-bebas uppercase tracking-wider h-11">
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
      <ShopHeader type="services" />
      
      <main className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-3 md:px-4">
          <h1 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider text-center mb-6 md:mb-8">
            Your <span className="text-primary">Cart</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-card border border-primary/30 rounded-lg p-3 md:p-4 flex gap-3 md:gap-4"
                >
                  {/* Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <img src={fffLogo} alt="" className="w-10 h-10 md:w-12 md:h-12 opacity-30" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bebas text-sm md:text-lg uppercase tracking-wider text-foreground line-clamp-2">
                      {item.name}
                    </h3>
                    {item.selectedOption && (
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{item.selectedOption}</p>
                    )}
                    <p className="text-primary font-bebas text-lg md:text-xl mt-1">
                      {formatPrice(item.price)}
                    </p>
                    
                    {/* Mobile: Quantity controls inline */}
                    <div className="flex items-center justify-between mt-2 md:hidden">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-bebas text-base w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Desktop: Quantity Controls */}
                  <div className="hidden md:flex flex-col items-end justify-between">
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
                className="text-muted-foreground hover:text-destructive text-sm"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-primary/30 rounded-lg p-4 md:p-6 sticky top-24">
                <h2 className="font-bebas text-xl md:text-2xl uppercase tracking-wider mb-3 md:mb-4">Order Summary</h2>
                
                <div className="space-y-2 md:space-y-3 border-b border-border pb-3 md:pb-4 mb-3 md:mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground truncate max-w-[55%] md:max-w-[60%]">
                        {item.name} x{item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bebas text-lg md:text-xl mb-4 md:mb-6">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    size="lg"
                    className="w-full btn-shine font-bebas uppercase tracking-wider h-11 md:h-12"
                  >
                    {isProcessing ? "Processing..." : "Pay with Card"}
                  </Button>

                  {/* PayPal Option */}
                  {paypalEmail && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white border-[#0070ba] font-bebas uppercase tracking-wider h-11 md:h-12"
                      onClick={() => {
                        window.open(`https://paypal.me/${paypalEmail}/${totalPrice}GBP`, '_blank');
                      }}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Pay with PayPal
                    </Button>
                  )}
                </div>

                <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-3 md:mt-4">
                  Secure checkout powered by Stripe & PayPal
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
