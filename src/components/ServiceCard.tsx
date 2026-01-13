import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import fffLogo from "@/assets/fff_logo.png";

interface ServiceCardProps {
  id: string;
  name: string;
  category?: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  badge?: string | null;
  ribbon?: string | null;
  options?: unknown;
  onClick: () => void;
}

export const ServiceCard = ({
  name,
  price,
  imageUrl,
  description,
  badge,
  ribbon,
  options,
  onClick,
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = () => {
    const optionsArray = options as { name: string; price: number }[] | null;
    const hasOptions = optionsArray && Array.isArray(optionsArray) && optionsArray.length > 0;
    const prefix = hasOptions ? "From " : "";
    return `${prefix}£${price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer block relative"
      initial={false}
      animate={{
        scale: isHovered ? 1.08 : 1,
        zIndex: isHovered ? 20 : 1,
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.23, 1, 0.32, 1],
        scale: { type: "spring", stiffness: 300, damping: 20 }
      }}
      style={{ transformOrigin: "center center" }}
    >
      {/* Card */}
      <div className={cn(
        "relative bg-card border border-primary/30 md:border-2 rounded-lg overflow-hidden transition-all duration-300",
        isHovered && "border-primary shadow-xl shadow-primary/30"
      )}>
        {/* Top Badge with Logo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <div className="relative">
            {/* Logo circle */}
            <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-background border border-primary md:border-2 flex items-center justify-center -mb-1 md:-mb-2 mx-auto relative z-20">
              <img src={fffLogo} alt="FFF" className="w-4 h-4 md:w-6 md:h-6 object-contain" />
            </div>
            {/* Banner */}
            <div className="bg-primary px-1.5 md:px-3 py-0.5 md:py-1 rounded-b-lg">
              <span className="text-[7px] md:text-[10px] font-bebas uppercase tracking-wider text-primary-foreground whitespace-nowrap">
                {badge || name.toUpperCase().slice(0, 20)}
              </span>
            </div>
          </div>
        </div>

        {/* Ribbon */}
        {ribbon && (
          <div className="absolute top-8 md:top-14 right-0.5 md:right-2 z-10 bg-destructive text-destructive-foreground text-[8px] md:text-xs font-bebas uppercase px-1 md:px-2 py-0.5 md:py-1 rounded">
            {ribbon}
          </div>
        )}

        {/* Service Image */}
        <div className="aspect-[3/4] pt-8 md:pt-12 p-1.5 md:p-4">
          <div className="w-full h-full rounded-lg overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500",
                  isHovered && "scale-110"
                )}
              />
            ) : (
              <div className="text-center p-2 md:p-4">
                <img src={fffLogo} alt="FFF" className="w-10 h-10 md:w-16 md:h-16 object-contain mx-auto opacity-30" />
              </div>
            )}
            
      {/* Hover overlay with details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/60 flex flex-col justify-end p-3 md:p-4"
            >
              <p className="text-primary font-bebas text-lg md:text-2xl mb-1">
                {formatPrice()}
              </p>
              {description && (
                <p className="text-[10px] md:text-xs text-foreground/80 line-clamp-3 leading-relaxed">
                  {description.replace(/<[^>]*>/g, '')}
                </p>
              )}
              <div className="mt-2 md:mt-3 pt-2 border-t border-primary/20">
                <span className="text-[9px] md:text-xs text-primary font-bebas uppercase tracking-widest hover:text-primary/80 transition-colors">
                  VIEW DETAILS
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Change The Game text */}
        <div className="text-center py-1.5 md:py-2">
          <span className="text-[9px] md:text-xs font-bebas uppercase tracking-widest text-muted-foreground italic">
            Change The Game
          </span>
        </div>
      </div>

      {/* Service Info (outside card) */}
      <div className="mt-1.5 md:mt-4 text-center px-1">
        <h3 className={cn(
          "font-bebas text-xs md:text-lg uppercase tracking-wider transition-colors line-clamp-2 leading-tight",
          isHovered ? "text-primary" : "text-foreground"
        )}>
          {name}
        </h3>
        <div className="w-4 md:w-8 h-px bg-primary/50 mx-auto my-1 md:my-2" />
      </div>
    </motion.div>
  );
};
