import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { PortalExampleDialog } from "./PortalExampleDialog";
import { ArrowRight, Eye, Info } from "lucide-react";

interface ServiceOfferingCardProps {
  title: string;
  subtitle?: string;
  description: string;
  features?: string[];
  price?: string;
  productId?: string;
  video?: string;
  image?: string;
  example?: string;
  reverse?: boolean;
  onWhatsIncluded?: () => void;
}

export const ServiceOfferingCard = ({
  title,
  subtitle,
  description,
  features = [],
  price,
  productId,
  video,
  image,
  example,
  reverse = false,
  onWhatsIncluded,
}: ServiceOfferingCardProps) => {
  const [portalExampleOpen, setPortalExampleOpen] = useState(false);

  // Default placeholder if no media
  const placeholderImage = "https://static.wixstatic.com/media/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png";

  return (
    <>
      <div className="group bg-gradient-to-br from-black/80 to-black/60 border border-white/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-accent/40">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
          {/* Media Section - Video or Image */}
          <div className="relative lg:w-1/2 h-64 lg:h-auto min-h-[280px]">
            {video ? (
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={video} type="video/mp4" />
              </video>
            ) : (
              <img 
                src={image || placeholderImage}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* View Example Button on Image - Translucent */}
            <Button 
              onClick={() => setPortalExampleOpen(true)}
              className="absolute top-4 right-4 font-bebas tracking-wider bg-black/50 hover:bg-black/70 border border-accent/50 text-accent hover:text-white px-4 py-2 text-sm z-10 backdrop-blur-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              VIEW EXAMPLE
            </Button>
            
            {example && (
              <p className="absolute bottom-4 left-4 text-sm text-white/70">{example}</p>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-accent" />
              </div>
              <h3 className="font-bebas text-2xl lg:text-3xl text-white tracking-wide">
                {title}
              </h3>
            </div>
            
            {subtitle && (
              <p className="text-accent font-bebas text-sm tracking-widest mb-4">
                {subtitle}
              </p>
            )}

            <p className="text-white/80 text-sm leading-relaxed mb-5">
              {description}
            </p>

            {features.length > 0 && (
              <ul className="space-y-2 mb-6">
                {features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2 text-white/90 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col gap-3 mt-auto">
              {price && (
                <p className="font-bebas text-xl text-accent tracking-wide">{price}</p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {productId ? (
                  <LocalizedLink to={`/services?service=${productId}`}>
                    <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-6 py-2.5 text-base group/btn">
                      LEARN MORE
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </LocalizedLink>
                ) : (
                  <LocalizedLink to="/contact">
                    <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-6 py-2.5 text-base group/btn">
                      LEARN MORE
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </LocalizedLink>
                )}
                {onWhatsIncluded && (
                  <Button 
                    variant="ghost"
                    onClick={onWhatsIncluded}
                    className="font-bebas tracking-wider text-white/60 hover:text-white hover:bg-white/10 px-3 text-sm"
                  >
                    <Info className="w-4 h-4 mr-1" />
                    WHAT'S INCLUDED
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PortalExampleDialog
        open={portalExampleOpen}
        onOpenChange={setPortalExampleOpen}
      />
    </>
  );
};

export default ServiceOfferingCard;
