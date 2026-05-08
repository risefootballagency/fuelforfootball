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
        .limit(12) as { data: PressRelease[] | null; error: any };

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pressReleases.map((release, index) => (
            <ScrollReveal key={release.id} delay={index * 0.05}>
              <Card
                className="group h-full p-4 bg-card border border-border hover:border-primary/60 transition-all duration-300 hover:shadow-md hover:shadow-primary/10 cursor-pointer flex flex-col"
                onClick={() => setSelectedRelease(release)}
              >
                <div className="flex items-start gap-3 mb-3 pb-3 border-b border-primary/15">
                  <div className="p-2 bg-primary/10 rounded-md shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bebas text-base uppercase tracking-wider group-hover:text-primary transition-colors">
                      {release.title}
                    </h3>
                    {release.published_date && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(release.published_date), "dd MMM yyyy")}
                      </div>
                    )}
                  </div>
                </div>

                {release.summary && (
                  <p className="text-xs text-muted-foreground mb-3 flex-1">
                    {release.summary}
                  </p>
                )}

                <div className="flex items-center gap-2 text-primary text-xs font-medium group-hover:gap-3 transition-all mt-auto">
                  {t("press.read_more", "Read More")}
                  <ArrowRight className="h-3 w-3" />
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
