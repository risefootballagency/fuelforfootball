import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Mentorship = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
            {t("services.mentorship.title", "Mentorship")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t("services.mentorship.description", "Our mentorship programme provides personalized guidance from experienced professionals who have walked the path before you. Get one-on-one support to navigate your football career.")}
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Career Guidance</h3>
              <p className="text-muted-foreground">Navigate the complexities of professional football with expert advice on contracts, transfers, and career decisions.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Personal Development</h3>
              <p className="text-muted-foreground">Build the mental resilience and life skills needed to thrive both on and off the pitch.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Mentorship;
