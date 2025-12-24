import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Dumbbell, Activity, Apple, Target, Brain, Video } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";

const ElitePerformance = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: Dumbbell, label: "Strength" },
    { icon: Activity, label: "Conditioning" },
    { icon: Apple, label: "Nutrition" },
    { icon: Target, label: "Technique" },
    { icon: Brain, label: "Mentorship" },
    { icon: Video, label: "Analysis" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <p className="text-primary font-bebas tracking-[0.3em] text-sm md:text-base mb-4">
              {t("services.elite_performance.subtitle", "ELITE PERFORMANCE PROGRAMME")}
            </p>
            <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl text-foreground mb-6">
              {t("services.elite_performance.title", "DOMINATE THE GAME")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
              {t("services.elite_performance.hero_desc", "The ultimate holistic development programme for players aspiring to reach elite level. Intensive, comprehensive support designed to accelerate your journey to the top.")}
            </p>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="py-12 border-y border-border/50 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {pillars.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 md:w-9 md:h-9 text-primary" />
                  </div>
                  <span className="font-bebas text-base md:text-lg tracking-wider text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-8">
                {t("services.elite_performance.overview_title", "THE COMPLETE PACKAGE")}
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  {t("services.elite_performance.overview_1", "The Elite Performance Programme is our most comprehensive offering, designed for players who want to leave no stone unturned in their pursuit of excellence.")}
                </p>
                <p className="text-lg leading-relaxed">
                  {t("services.elite_performance.overview_2", "Building on everything included in the Pro Performance Programme, the Elite tier adds personalised mentorship sessions and in-depth video analysis to give you the complete competitive edge.")}
                </p>
                <p className="text-lg leading-relaxed">
                  {t("services.elite_performance.overview_3", "Work with our team across all domains of performance - physical, technical, tactical, and psychological - to transform every aspect of your game.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="py-16 md:py-24 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-12 text-center">
              {t("services.elite_performance.included_title", "WHAT'S INCLUDED")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6">
                <Dumbbell className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bebas text-2xl text-foreground mb-3">Strength, Power & Speed</h3>
                <p className="text-muted-foreground">Individualised programming for physical development, tested and tailored to your needs.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Activity className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bebas text-2xl text-foreground mb-3">Conditioning</h3>
                <p className="text-muted-foreground">Build the endurance and recovery capacity needed to perform at your peak throughout the season.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Apple className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bebas text-2xl text-foreground mb-3">Nutrition</h3>
                <p className="text-muted-foreground">Personalised nutrition planning to fuel your training and optimise recovery.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Target className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bebas text-2xl text-foreground mb-3">Technical Training</h3>
                <p className="text-muted-foreground">Position-specific technical development to refine your skills and expand your repertoire.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Brain className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bebas text-2xl text-foreground mb-3">Mentorship</h3>
                <p className="text-muted-foreground">Regular 1:1 mentorship sessions covering psychological performance and career development.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <Video className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bebas text-2xl text-foreground mb-3">Video Analysis</h3>
                <p className="text-muted-foreground">In-depth match analysis with personalised feedback to improve your tactical understanding.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-8">
                {t("services.elite_performance.benefits_title", "THE ELITE ADVANTAGE")}
              </h2>
              <ul className="space-y-4 text-muted-foreground text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("services.elite_performance.benefit_1", "Everything from the Pro Performance Programme included")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("services.elite_performance.benefit_2", "Regular mentorship sessions with experienced coaches")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("services.elite_performance.benefit_3", "Comprehensive video analysis of your matches")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("services.elite_performance.benefit_4", "Priority access to our coaching team")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("services.elite_performance.benefit_5", "Quarterly performance reviews and goal setting")}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-card border border-primary/30 rounded-lg p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-bebas tracking-wider">
                  MOST POPULAR
                </div>
                <h3 className="font-bebas text-3xl md:text-4xl text-primary mb-4">
                  {t("services.elite_performance.programme_title", "Elite Performance Programme")}
                </h3>
                <p className="text-3xl font-bold text-foreground mb-6">
                  {t("services.elite_performance.price", "From £1,250.00")}
                </p>
                <p className="text-muted-foreground mb-8">
                  {t("services.elite_performance.price_desc", "Monthly comprehensive elite performance package")}
                </p>
                <LocalizedLink to="/contact">
                  <Button size="lg" className="w-full font-bebas tracking-wider text-lg">
                    {t("common.get_started", "GET STARTED")}
                  </Button>
                </LocalizedLink>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-bebas text-4xl md:text-5xl text-foreground mb-6">
              {t("services.elite_performance.cta_title", "READY TO JOIN THE ELITE?")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("services.elite_performance.cta_desc", "Book a consultation to discuss how the Elite Performance Programme can transform your career.")}
            </p>
            <LocalizedLink to="/contact">
              <Button size="lg" className="font-bebas tracking-wider text-lg px-8">
                {t("common.book_consultation", "BOOK A CONSULTATION")}
              </Button>
            </LocalizedLink>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ElitePerformance;
