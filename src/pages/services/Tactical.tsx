import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Tactical = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
            {t("services.tactical.title", "Tactical Training")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t("services.tactical.description", "Elevate your game intelligence with our tactical training programme. Learn to read the game, make better decisions, and understand the strategic aspects of modern football.")}
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Positional Understanding</h3>
              <p className="text-muted-foreground">Master your role within different formations and tactical systems.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Game Analysis</h3>
              <p className="text-muted-foreground">Video analysis sessions to develop your understanding of match situations.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tactical;
