import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Mental = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
            {t("services.mental.title", "Mental Performance")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t("services.mental.description", "The mental game is often the difference between good and great. Our sports psychology programme helps you develop the mindset needed to perform under pressure and reach your potential.")}
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Mental Resilience</h3>
              <p className="text-muted-foreground">Build the mental toughness to overcome setbacks and perform consistently.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Performance Psychology</h3>
              <p className="text-muted-foreground">Learn techniques for focus, confidence, and peak performance when it matters most.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Mental;
