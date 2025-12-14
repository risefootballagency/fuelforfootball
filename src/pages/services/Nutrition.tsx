import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Nutrition = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
            {t("services.nutrition.title", "Nutrition")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t("services.nutrition.description", "Fuel your performance with expert nutrition guidance. Our sports nutrition programme helps you optimize your diet for training, match days, and recovery.")}
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Performance Nutrition</h3>
              <p className="text-muted-foreground">Tailored nutrition plans to fuel training and optimize match-day performance.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Recovery & Adaptation</h3>
              <p className="text-muted-foreground">Nutritional strategies to accelerate recovery and support physical development.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Nutrition;
