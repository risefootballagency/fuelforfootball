import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { TrendingUp, Handshake, Scale, Shield, Star, Heart, ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/HeroSlider";
import bannerHero from "@/assets/banner-hero.jpg";

const Agents = () => {
  const heroSlides = [
    {
      image: bannerHero,
      title: 'PLAYER DEVELOPMENT',
      subtitle: 'Elevate your players\' performance and market value',
    },
    {
      image: bannerHero,
      title: 'MAXIMISE ABILITY',
      subtitle: 'Unlock your players\' full potential',
    },
    {
      image: bannerHero,
      title: 'ENDORSE EXCELLENCE',
      subtitle: 'Create lucrative transfer opportunities',
    },
  ];

  const excellenceCards = [
    {
      icon: TrendingUp,
      title: "Increase Market Value",
      description: "Enhanced performance attracts greater interest from top clubs, maximising your players' worth."
    },
    {
      icon: Handshake,
      title: "Trust Between Parties",
      description: "Build lasting relationships through transparent collaboration and shared success."
    },
    {
      icon: Scale,
      title: "Better Negotiations",
      description: "Stronger performance metrics give you leverage in securing the best contracts."
    },
    {
      icon: Shield,
      title: "Career Sustainability",
      description: "Holistic development ensures longevity and resilience throughout their career."
    },
    {
      icon: Star,
      title: "Enhanced Reputation",
      description: "Represent players who consistently perform, elevating your standing in the industry."
    },
    {
      icon: Heart,
      title: "Personal Fulfilment",
      description: "See your players reach their true potential and achieve their dreams."
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <SEO 
        title="For Agents - Player Development | Fuel For Football"
        description="Elevate your players' performance through tailored development programmes and expert coaching. Increase market value and create lucrative transfer opportunities."
        image="/og-preview-agents.png"
        url="/agents"
      />
      <Header />
      
      <main className="pt-24 md:pt-16">
        {/* Hero Slider */}
        <HeroSlider slides={heroSlides} />

        {/* PLAYER DEVELOPMENT Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider text-primary mb-6">
                PLAYER DEVELOPMENT
              </h2>
              <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                <p>
                  We elevate your players' performance through tailored development programmes and expert coaching, ensuring they consistently fulfil their potential. Using analysis, training, and data-driven insights, we provide comprehensive enhancement services that optimise their on-pitch performance, making them stand out in every game.
                </p>
                <p>
                  This heightened performance attracts greater interest from top clubs, increasing your players' market value and creating lucrative transfer opportunities. With our support, your players become more valuable assets, giving you the edge in negotiating and securing the best contracts for them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAXIMISE PLAYERS' ABILITY Section */}
        <section className="py-16 md:py-24 px-4 bg-muted/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider mb-6">
                MAXIMISE PLAYERS' <span className="text-primary">ABILITY</span>
              </h2>
            </div>
            <div className="text-base md:text-lg text-muted-foreground leading-relaxed italic text-center max-w-4xl mx-auto">
              <p>
                Want to secure the most lucrative contracts for your players? The surest path is amplifying their performance on the pitch. As strategic partners, we at Fuel for Football provide the comprehensive training and development necessary to elevate your players' abilities to standout levels. Our tailored services work holistically, honing technical and physical qualities, sharpening mental acuity, and enhancing tactical aptitude. The result? A player who not only performs, but dominates - increasing their market value and attracting the most rewarding contracts. With Fuel for Football, you do not just represent a player, you represent a game-changer. Together, we unlock your players' full potential, and secure their future in the football world.
              </p>
            </div>
          </div>
        </section>

        {/* ENDORSE EXCELLENCE Section */}
        <section className="py-16 md:py-24 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider mb-6">
                ENDORSE <span className="text-primary">EXCELLENCE</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {excellenceCards.map((card, index) => (
                <Card 
                  key={index}
                  className="group p-8 border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-card to-primary/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <card.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bebas text-2xl uppercase tracking-wider mb-3">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* TRANSFERS Section */}
        <section className="py-16 md:py-24 px-4 bg-muted/20">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider mb-6">
                <span className="text-primary">TRANSFERS</span>
              </h2>
              <h3 className="text-3xl md:text-4xl font-bebas uppercase tracking-wider text-foreground/80 mb-8">
                Transfer Efficiency Report
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                Our PER service is a valuable tool for football agents, not only for securing deals and finding the right team but also for effective marketing. By providing comprehensive reports and statistics, agents can showcase their clients' on-pitch impact and promote them to potential clubs. This service enables agents to make informed decisions and market their players more effectively, ultimately leading to greater success for both the player and the agent.
              </p>
              <Button asChild size="lg" className="btn-shine font-bebas uppercase tracking-wider gap-2">
                <Link to="/contact">
                  REQUEST A REPORT
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-bebas uppercase tracking-wider mb-6">
              READY TO <span className="text-primary">CHANGE THE GAME</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Partner with us and unlock your players' full potential
            </p>
            <Button asChild size="lg" className="btn-shine font-bebas uppercase tracking-wider text-lg px-10 py-6">
              <Link to="/contact">GET IN TOUCH</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Agents;