import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Dumbbell, Activity, Apple, Target } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";

const ProPerformance = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: Dumbbell, label: t("services_pro_performance.pillar_strength", "Strength") },
    { icon: Activity, label: t("services_pro_performance.pillar_conditioning", "Conditioning") },
    { icon: Apple, label: t("services_pro_performance.pillar_nutrition", "Nutrition") },
    { icon: Target, label: t("services_pro_performance.pillar_technique", "Technique") },
  ];

  const tabs = [
    { id: "overview", label: t("services_pro_performance.tab_overview", "Overview") },
    { id: "sps", label: t("services_pro_performance.tab_sps", "Strength, Power & Speed") },
    { id: "conditioning", label: t("services_pro_performance.tab_conditioning", "Conditioning") },
    { id: "nutrition", label: t("services_pro_performance.tab_nutrition", "Nutrition") },
    { id: "technique", label: t("services_pro_performance.tab_technique", "Technique") },
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
              {t("services_pro_performance.subtitle", "PRO PERFORMANCE PROGRAMME")}
            </p>
            <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl text-foreground mb-6">
              {t("services_pro_performance.title", "RUN THE SHOW")}
            </h1>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="py-12 border-y border-border/50 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {pillars.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                  </div>
                  <span className="font-bebas text-lg md:text-xl tracking-wider text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Including Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-12 text-center">
              {t("services_pro_performance.including", "INCLUDING")}
            </h2>
            
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className="px-4 py-2 font-bebas text-sm md:text-base tracking-wider border border-border rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview Content */}
            <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                {t("services_pro_performance.overview_1", "Our Pro Performance Programme offers a comprehensive range of individualised services, including nutrition, strength, power and speed, technical, conditioning, mobility, injury prevention and recovery programming.")}
              </p>
              <p className="text-lg leading-relaxed">
                {t("services_pro_performance.overview_2", "With our expert team of coaches and specialists, you will have everything you need to be at your best throughout the season.")}
              </p>
              <p className="text-lg leading-relaxed">
                {t("services_pro_performance.overview_3", "Our individualised training sessions and programs are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact.")}
              </p>
            </div>
          </div>
        </section>

        {/* Programming Details Section */}
        <section className="py-16 md:py-24 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-8">
                {t("services_pro_performance.programming_title", "IN-DEPTH PROGRAMMING")}
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  {t("services_pro_performance.programming_1", "In-depth programming with a high attention to detail. With a new player, we test first and organise the key goals for physical development. Programming is individualised with these in mind to make the greatest impact to performance.")}
                </p>
                <p className="text-lg leading-relaxed">
                  {t("services_pro_performance.programming_2", "Our SPS coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations. New phases are programmed to always know exactly what to focus on in the next sessions.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-8">
                {t("services_pro_performance.what_included", "WHAT'S INCLUDED")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("services_pro_performance.included_desc", "The PPP includes programming of nutrition, strength power and speed, conditioning and technical training. The player works with our experts to ensure that they have every aspect of their physical preparation, recovery and development covered.")}
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("services_pro_performance.benefit_1", "Every aspect of training programmed with close 1:1 support from our team")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("services_pro_performance.benefit_2", "Perfect for eliminating all doubts about training")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("services_pro_performance.benefit_3", "The most assured way to improve")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{t("services_pro_performance.benefit_4", "Training like the top players in the world do e.g. Cristiano Ronaldo and his performance team")}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="font-bebas text-3xl md:text-4xl text-primary mb-4">
                  {t("services_pro_performance.programme_title", "Pro Performance Programme")}
                </h3>
                <p className="text-3xl font-bold text-foreground mb-6">
                  {t("services_pro_performance.price", "From £750.00")}
                </p>
                <p className="text-muted-foreground mb-8">
                  {t("services_pro_performance.price_desc", "Monthly comprehensive performance programming")}
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
              {t("services_pro_performance.cta_title", "READY TO ELEVATE YOUR GAME?")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("services_pro_performance.cta_desc", "Book a consultation to discuss how the Pro Performance Programme can help you reach your potential.")}
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

export default ProPerformance;
