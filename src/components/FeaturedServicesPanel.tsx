import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import fffLogo from "@/assets/fff_logo.png";

interface FeaturedService {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  badge?: string | null;
}

interface FeaturedServicesPanelProps {
  services: FeaturedService[];
  onServiceClick: (service: FeaturedService) => void;
}

export const FeaturedServicesPanel = ({
  services,
  onServiceClick,
}: FeaturedServicesPanelProps) => {
  if (services.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col h-full p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-bebas text-xl uppercase tracking-wider text-foreground">
          Featured Services
        </h2>
      </div>

      <div className="space-y-4">
        {services.slice(0, 3).map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onServiceClick(service)}
            className="group cursor-pointer"
          >
            <div className="relative bg-gradient-to-r from-card to-card/50 border border-border hover:border-primary rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="flex">
                {/* Image */}
                <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                      <img src={fffLogo} alt="FFF" className="w-12 h-12 opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-center">
                  {service.badge && (
                    <span className="inline-block text-[10px] font-bebas uppercase bg-primary/20 text-primary px-2 py-0.5 rounded mb-2 w-fit">
                      {service.badge}
                    </span>
                  )}
                  <h3 className="font-bebas text-lg uppercase tracking-wider text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <p className="text-primary font-bebas text-lg mt-2">
                    £{service.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Hover indicator */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <p className="text-xs text-muted-foreground text-center">
          Select a category to browse all services
        </p>
      </div>
    </div>
  );
};
