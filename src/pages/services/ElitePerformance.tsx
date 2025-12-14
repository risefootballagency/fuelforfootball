import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const ElitePerformance = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
            {t("services.elite_performance.title", "Elite Performance Programme")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t("services.elite_performance.description", "The ultimate holistic development programme for players aspiring to reach elite level. Intensive, comprehensive support designed to accelerate your journey to the top.")}
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">360° Development</h3>
              <p className="text-muted-foreground">Complete development across technical, tactical, physical, and mental domains.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Elite Coaching</h3>
              <p className="text-muted-foreground">Work with coaches who have experience at the highest levels of the game.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Performance Analytics</h3>
              <p className="text-muted-foreground">Data-driven insights to track progress and optimize your development.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ElitePerformance;
