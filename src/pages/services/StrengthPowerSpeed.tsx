import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const StrengthPowerSpeed = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
            {t("services.strength_power_speed.title", "Strength, Power & Speed")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t("services.strength_power_speed.description", "Develop the physical attributes that separate elite players from the rest. Our strength, power, and speed programme is designed specifically for footballers.")}
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Strength Training</h3>
              <p className="text-muted-foreground">Build functional strength that translates directly to on-pitch performance.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Explosive Power</h3>
              <p className="text-muted-foreground">Develop the explosive power needed for sprints, jumps, and powerful strikes.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bebas text-2xl text-primary mb-3">Speed Development</h3>
              <p className="text-muted-foreground">Improve acceleration, top speed, and agility with specialized training.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StrengthPowerSpeed;
