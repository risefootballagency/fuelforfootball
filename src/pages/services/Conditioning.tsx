import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Conditioning = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
            {t("services.conditioning.title", "Conditioning")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t("services.conditioning.description", "Elite conditioning programmes designed to keep you performing at your best for 90 minutes and beyond. Build the engine that powers your game.")}
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Aerobic Capacity</h3>
              <p className="text-muted-foreground">Develop the endurance foundation to maintain intensity throughout matches.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">High-Intensity Training</h3>
              <p className="text-muted-foreground">Football-specific conditioning that mirrors the demands of the modern game.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Conditioning;
