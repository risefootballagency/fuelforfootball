import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const ProPerformance = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
            {t("services.pro_performance.title", "Pro Performance Programme")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t("services.pro_performance.description", "Our flagship holistic programme designed for professional players seeking to maximize their potential. Comprehensive support across all aspects of performance.")}
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Technical Excellence</h3>
              <p className="text-muted-foreground">Refine your technical abilities with position-specific training and analysis.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Tactical Intelligence</h3>
              <p className="text-muted-foreground">Develop game understanding and decision-making at the highest level.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Physical Optimization</h3>
              <p className="text-muted-foreground">Peak physical conditioning tailored to the demands of professional football.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProPerformance;
