import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useCart } from "@/contexts/CartContext";
import fffLogo from "@/assets/fff_logo.png";

interface ServiceOption {
  name: string;
  surcharge: number;
}

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  badge: string | null;
  ribbon: string | null;
  description: string | null;
  options: unknown;
  visible: boolean;
  additional_images?: string[];
}

interface RelatedService {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  options: unknown;
}

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  const [service, setService] = useState<Service | null>(null);
  const [relatedServices, setRelatedServices] = useState<RelatedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      
      try {
        // Create a URL-friendly slug from the service name
        const { data: services, error } = await supabase
          .from('service_catalog')
          .select('*')
          .eq('visible', true);

        if (error) {
          console.error('Error fetching service:', error);
          return;
        }

        // Find service by matching slug
        const foundService = services?.find(s => {
          const serviceSlug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          return serviceSlug === slug;
        });

        if (foundService) {
          setService(foundService);
          
          // Fetch related services from same category
          const related = services?.filter(s => 
            s.category === foundService.category && s.id !== foundService.id
          ).slice(0, 6) || [];
          setRelatedServices(related);
          
          // Set default option if options exist
          const options = foundService.options as unknown as ServiceOption[] | null;
          if (options && Array.isArray(options) && options.length > 0) {
            setSelectedOption(options[0].name);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  const formatPrice = (price: number | null | undefined, options?: unknown) => {
    const safePrice = price ?? 0;
    const optionsArray = options as ServiceOption[] | null;
    const hasOptions = optionsArray && Array.isArray(optionsArray) && optionsArray.length > 0;
    const prefix = hasOptions ? "From " : "";
    return `${prefix}£${safePrice.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCurrentPrice = () => {
    if (!service) return 0;
    const options = service.options as unknown as ServiceOption[] | null;
    if (options && Array.isArray(options) && selectedOption) {
      const option = options.find(o => o.name === selectedOption);
      return service.price + (option?.surcharge || 0);
    }
    return service.price;
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCart = () => {
    if (!service) return;
    
    addItem({
      serviceId: service.id,
      name: service.name,
      price: getCurrentPrice(),
      selectedOption: selectedOption || null,
      imageUrl: service.image_url,
    });
    
    toast({
      title: "Added to Cart",
      description: `${service.name}${selectedOption ? ` - ${selectedOption}` : ''} has been added to your cart.`,
    });
  };

  const handleBuyNow = async () => {
    if (!service) return;
    
    setIsProcessing(true);
    toast({
      title: "Processing...",
      description: "Preparing your checkout session...",
    });

    try {
      const { data, error } = await supabase.functions.invoke('create-service-checkout', {
        body: {
          serviceId: service.id,
          selectedOption: selectedOption || null,
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

  const getServiceSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  // Get all images (main + additional)
  const getAllImages = () => {
    if (!service) return [];
    const images: string[] = [];
    if (service.image_url) images.push(service.image_url);
    if (service.additional_images) {
      images.push(...service.additional_images);
    }
    return images;
  };

  const images = getAllImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-12 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 flex-1" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <h1 className="text-4xl font-bebas text-primary mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
            <Button asChild>
              <LocalizedLink to="/services">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
              </LocalizedLink>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const options = service.options as ServiceOption[] | null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-3 md:px-4">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-4 md:mb-6 -ml-2 h-9 px-3 text-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>

          {/* Product Section - Stack on mobile, grid on desktop */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start">
            {/* Image Gallery */}
            <div className="md:sticky md:top-24 space-y-3 md:space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-card border border-primary/30 md:border-2 rounded-xl overflow-hidden">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImageIndex]}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-1.5 md:left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                        >
                          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
                    <img src={fffLogo} alt="FFF" className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-30" />
                  </div>
                )}
                
                {/* Ribbon */}
                {service.ribbon && (
                  <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-destructive text-destructive-foreground text-xs md:text-sm font-bebas uppercase px-2 md:px-3 py-0.5 md:py-1 rounded">
                    {service.ribbon}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index 
                          ? 'border-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <p className="text-xs md:text-sm text-primary font-medium uppercase tracking-wider mb-1.5 md:mb-2">
                  {service.category}
                </p>
                <h1 className="text-2xl md:text-5xl font-bebas uppercase tracking-wider text-foreground mb-2 md:mb-4">
                  {service.name}
                </h1>
                <p className="text-xl md:text-3xl font-bebas text-primary">
                  {formatPrice(getCurrentPrice(), options && selectedOption ? null : options)}
                </p>
              </div>

              {/* Options Selector */}
              {options && options.length > 0 && (
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-medium text-foreground">
                    Options <span className="text-destructive">*</span>
                  </label>
                  <Select value={selectedOption} onValueChange={setSelectedOption}>
                    <SelectTrigger className="w-full bg-card border-primary/30 h-10 md:h-11 text-sm">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.name} value={option.name} className="text-sm">
                          {option.name} - £{(service.price + (option.surcharge ?? 0)).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  className="flex-1 font-bebas uppercase tracking-wider h-11 md:h-12 text-sm md:text-base"
                >
                  <ShoppingCart className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  size="lg"
                  disabled={isProcessing}
                  className="flex-1 btn-shine font-bebas uppercase tracking-wider h-11 md:h-12 text-sm md:text-base"
                >
                  {isProcessing ? "Processing..." : "Buy Now"}
                </Button>
              </div>

              {/* Description preview on mobile */}
              {service.description && (
                <div className="md:hidden">
                  <div 
                    className="prose prose-sm max-w-none text-muted-foreground leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0 line-clamp-4 text-sm"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Full-width Description Section */}
          {service.description && (
            <section className="mt-8 md:mt-16">
              <div className="bg-card/50 border border-primary/20 rounded-xl p-4 md:p-8">
                <h2 className="text-xl md:text-3xl font-bebas uppercase tracking-wider text-foreground mb-4 md:mb-6">
                  About This Service
                </h2>
                <div 
                  className="prose prose-sm max-w-none text-muted-foreground leading-relaxed [&>p]:mb-3 md:[&>p]:mb-4 [&>p:last-child]:mb-0 md:columns-2 md:gap-8"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              </div>
            </section>
          )}

          {/* Related Products */}
          {relatedServices.length > 0 && (
            <section className="mt-10 md:mt-24">
              <h2 className="text-2xl md:text-4xl font-bebas uppercase tracking-wider text-center mb-6 md:mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {relatedServices.map((related) => (
                  <LocalizedLink
                    key={related.id}
                    to={`/service/${getServiceSlug(related.name)}`}
                    className="group"
                  >
                    <div className="relative bg-card border border-primary/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-lg">
                      <div className="aspect-square p-1.5 md:p-2">
                        {related.image_url ? (
                          <img
                            src={related.image_url}
                            alt={related.name}
                            className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 rounded">
                            <img src={fffLogo} alt="" className="w-10 h-10 md:w-12 md:h-12 opacity-30" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-1.5 md:mt-2 text-center">
                      <h3 className="text-[10px] md:text-xs font-bebas uppercase tracking-wider text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {related.name}
                      </h3>
                      <p className="text-[9px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">
                        {formatPrice(related.price, related.options)}
                      </p>
                    </div>
                  </LocalizedLink>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
