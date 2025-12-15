import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Consultation = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
            {t("services.consultation.title", "Consultation")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t("services.consultation.description", "Expert consultation services tailored to your specific needs. Whether you're a player, parent, or club, we provide professional advice to help you make informed decisions.")}
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Player Assessment</h3>
              <p className="text-muted-foreground">Comprehensive evaluation of current abilities, potential, and areas for development.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Strategic Planning</h3>
              <p className="text-muted-foreground">Develop a clear roadmap for achieving your football goals with actionable steps.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Consultation;
