import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Dumbbell, Activity, Apple, Target, Brain, Video, 
  Shield, MessageSquare, Users, FileText, BookOpen 
} from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";

const ElitePerformance = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'physical' | 'psychology' | 'nutrition'>('overview');

  const pillarsRow1 = [
    { label: "Opposition Analysis" },
    { label: "Post-Match Analysis" },
    { label: "Mental Skill Training" },
    { label: "Mental Will Training" },
  ];

  const pillarsRow2 = [
    { label: "Efficiency Reports" },
    { label: "Consultation" },
    { label: "Mentorship" },
    { label: "Technique" },
  ];

  const pillarsRow3 = [
    { label: "Strength, Power & Speed" },
    { label: "Conditioning" },
    { label: "Nutrition" },
    { label: "Injury Prevention" },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "analysis", label: "Analysis" },
    { id: "physical", label: "Physical" },
    { id: "psychology", label: "Psychology" },
    { id: "nutrition", label: "Nutrition" },
  ];

  const tabContent: Record<string, { paragraphs: string[] }> = {
    overview: {
      paragraphs: [
        "Our Elite Performance Programme is trusted by players across Europe's top 5 leagues to elevate every aspect of their game. The use of a dedicated performance team, as recognised by the very best like Cristiano Ronaldo, is pivotal to truly reach your potential.",
        "From boosting sprint speed by up to 20% season-on-season to improving conditioning for late-game dominance, we develop individualised programming specifically designed for your unique needs, capacity and schedule.",
        "Our expert coaches will help you fine-tune your skillset to reach new heights while remaining sharp throughout the season."
      ]
    },
    analysis: {
      paragraphs: [
        "Pre-match opposition analysis is delivered to our players at the start of the match week, giving time to absorb the information and use it in preparation. Unlike the analysis delivered at club-level, we focus in much greater detail on what is important to you for a strong individual performance.",
        "With a breakdown of the opposition scheme, we allow you to know which options are likely to be free at which times, improving decision-making. Alongside broader patterns of play and how to respond to them both defensively and offensively, we also focus on your individual matchups to exploit their weaknesses and prevent them successfully applying their strengths.",
        "In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses. Although highly critical, even with our Premier League level players, the detail in our analysis will make vast improvements to your game when applied."
      ]
    },
    physical: {
      paragraphs: [
        "You will go through a specific needs-analysis and then the relevant fitness testing to determine what your training priorities should be. At Fuel For Football, we will go through all of this for you and provide a fully personalised training plan to help you become the fittest player you can be.",
        "In-depth programming with a high attention to detail. With a new player, we test first and organise the key goals for physical development. Programming is individualised with these in mind to make the greatest impact to performance.",
        "Our SPS coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations. New phases are programmed to always know exactly what to focus on in the next sessions."
      ]
    },
    psychology: {
      paragraphs: [
        "In psychological performance sessions we aim to give you a mental edge by boosting consistency, composure, commitment, confidence, and concentration levels. These components are elements that often let players down, even on the biggest of stages!",
        "We progressively work on each component and through one-to-one sessions, to raise your performance levels via the development of mental toughness. In addition, we tailor to each player's individual needs, working on the aspects of psychology most needed at a given time.",
        "Psychological development aims to enhance mental skills that directly impact on-pitch success. These sessions focus on improving concentration, decision-making, emotional regulation, and resilience under pressure."
      ]
    },
    nutrition: {
      paragraphs: [
        "We offer a comprehensive nutritional review designed specifically for football players. Our service involves an in-depth discussion of the player's current diet with the aim to provide a detailed analysis outlining the necessary changes to optimise your nutrition and enhance performance.",
        "We will thoroughly discuss each of your unique needs and goals, ensuring your programming impacts your performance both on and off the pitch. Our services are rooted in maintaining close contact with players, providing continuous support to foster their development.",
        "This will give great insight to the needed dietary adjustments to take your game to another level."
      ]
    }
  };

  const includedServices = [
    "Nutrition Programming",
    "Strength, Power & Speed Programming",
    "Conditioning Programming",
    "Technical Programming",
    "Recovery, Injury Prevention & Mobility Programming",
    "Pre-Match Opposition Analysis for every game",
    "Post-Match Performance Analysis for every game",
    "Unlimited Mental Skill and Will Sessions",
    "Unlimited Consultations",
    "Player Efficiency Reports",
    "Mentorship",
    "All Our Plans & E-Books"
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
              {t("services.elite_performance.title", "THE FULL PACKAGE")}
            </h1>
          </div>
        </section>

        {/* Pillars Section - Row 1 */}
        <section className="py-8 border-y border-border/50 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {pillarsRow1.map(({ label }) => (
                <div key={label} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <span className="font-bebas text-xs md:text-sm tracking-wider text-foreground text-center uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pillars Section - Row 2 */}
        <section className="py-8 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {pillarsRow2.map(({ label }) => (
                <div key={label} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <span className="font-bebas text-xs md:text-sm tracking-wider text-foreground text-center uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pillars Section - Row 3 */}
        <section className="py-8 border-b border-border/50 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {pillarsRow3.map(({ label }) => (
                <div key={label} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <span className="font-bebas text-xs md:text-sm tracking-wider text-foreground text-center uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Including Section with Tabs */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-12 text-center">
              {t("services.elite_performance.including", "INCLUDING")}
            </h2>
            
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 font-bebas text-sm md:text-base tracking-wider border rounded transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-border hover:bg-primary/10 hover:border-primary/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground">
              {tabContent[activeTab].paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included List */}
        <section className="py-16 md:py-24 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-8">
                {t("services.elite_performance.comprehensive", "COMPREHENSIVE SERVICE")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("services.elite_performance.comprehensive_desc", "Our comprehensive service encompasses all aspects essential for peak performance:")}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {includedServices.map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-primary font-bold text-lg">•</span>
                    <span className="text-muted-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mentorship Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-8">
                {t("services.elite_performance.mentorship_title", "MENTORSHIP")}
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  {t("services.elite_performance.mentorship_1", "Mentoring consists of a long-term relationship focused on supporting the growth and development of yourself either as player, coach or trainer. The mentor, being the most suitable member of our team for your role, becomes a source of wisdom, teaching, and support as they work 1:1 with you to accelerate your career progress.")}
                </p>
                <p className="text-lg leading-relaxed">
                  {t("services.elite_performance.mentorship_2", "This is a completely individualised process, whereby a real connection is built. Your mentor will adapt their approach to reflect that. Some prefer to bring questions and work through Q&A, others will bring up topics and request workshops to gain insight.")}
                </p>
                <p className="text-lg leading-relaxed">
                  {t("services.elite_performance.mentorship_3", "More options include talking casually about the day-to-day and having back and forth dialogue about important situations. Ultimately, however you prefer to work, this can be accommodated.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-card border border-primary/30 rounded-lg p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-bebas tracking-wider">
                  MOST COMPREHENSIVE
                </div>
                <h3 className="font-bebas text-3xl md:text-4xl text-primary mb-4">
                  {t("services.elite_performance.programme_title", "Elite Performance Programme")}
                </h3>
                <p className="text-3xl font-bold text-foreground mb-6">
                  {t("services.elite_performance.price", "From £1,500.00")}
                </p>
                <p className="text-muted-foreground mb-8">
                  {t("services.elite_performance.price_desc", "Monthly comprehensive elite performance package including all services")}
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
              {t("services.elite_performance.cta_title", "READY FOR THE FULL PACKAGE?")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("services.elite_performance.cta_desc", "Book a consultation to discuss how the Elite Performance Programme can transform every aspect of your game.")}
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
