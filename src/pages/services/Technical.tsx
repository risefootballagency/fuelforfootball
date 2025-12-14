import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Technical = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
            {t("services.technical.title", "Technical Training")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t("services.technical.description", "Refine your technical abilities with focused training on ball mastery, passing, shooting, and position-specific skills. Develop the technical foundation needed to excel at any level.")}
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Ball Mastery</h3>
              <p className="text-muted-foreground">Develop exceptional control and comfort on the ball in all situations.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Position-Specific Skills</h3>
              <p className="text-muted-foreground">Tailored technical training based on your playing position and style.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Technical;
