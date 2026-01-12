import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ExternalLink } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  type: string | null;
}

export const PartnersSection = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("id, name, logo_url, website_url, description, type")
        .eq("status", "active")
        .order("name");

      if (!error && data) {
        setPartners(data);
      }
      setLoading(false);
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted/30 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="text-sm font-bebas uppercase tracking-widest text-primary border border-primary/30 px-6 py-2 rounded-full">
                {t("partners.badge", "Our Partners")}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider mb-4">
              {t("partners.title", "Trusted By The Best")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("partners.description", "We work with leading organizations in football to deliver excellence")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <ScrollReveal key={partner.id} delay={index * 0.1}>
              <a
                href={partner.website_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square bg-card border border-border rounded-xl p-6 flex items-center justify-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              >
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <span className="font-bebas text-xl uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                    {partner.name}
                  </span>
                )}
                
                {partner.website_url && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </div>
                )}
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
