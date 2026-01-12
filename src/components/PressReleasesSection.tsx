import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface PressRelease {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  published_date: string | null;
}

export const PressReleasesSection = () => {
  const { t } = useLanguage();
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRelease, setSelectedRelease] = useState<PressRelease | null>(null);

  useEffect(() => {
    const fetchPressReleases = async () => {
      const { data, error } = await supabase
        .from("press_releases")
        .select("id, title, summary, content, published_date")
        .eq("published", true)
        .order("published_date", { ascending: false })
        .limit(6) as { data: PressRelease[] | null; error: any };

      if (!error && data) {
        setPressReleases(data);
      }
      setLoading(false);
    };

    fetchPressReleases();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted/30 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (pressReleases.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="text-sm font-bebas uppercase tracking-widest text-primary border border-primary/30 px-6 py-2 rounded-full">
                {t("press.badge", "Press Room")}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider mb-4">
              {t("press.title", "Latest Press Releases")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("press.description", "Official announcements and news from Fuel For Football")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pressReleases.map((release, index) => (
            <ScrollReveal key={release.id} delay={index * 0.1}>
              <Card 
                className="group p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                onClick={() => setSelectedRelease(release)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bebas text-xl uppercase tracking-wider group-hover:text-primary transition-colors line-clamp-2">
                      {release.title}
                    </h3>
                    {release.published_date && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(release.published_date), "dd MMM yyyy")}
                      </div>
                    )}
                  </div>
                </div>
                
                {release.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {release.summary}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  {t("press.read_more", "Read More")}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Modal for full content */}
        {selectedRelease && (
          <div 
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedRelease(null)}
          >
            <div 
              className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-bebas text-3xl uppercase tracking-wider mb-2">
                    {selectedRelease.title}
                  </h2>
                  {selectedRelease.published_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(selectedRelease.published_date), "dd MMMM yyyy")}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRelease(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="prose prose-sm max-w-none text-foreground">
                {selectedRelease.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedRelease.content }} />
                ) : (
                  <p className="text-muted-foreground">{selectedRelease.summary}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PressReleasesSection;
