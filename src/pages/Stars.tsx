import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Activity, Brain, TrendingUp, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Stars = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Target,
      title: "Technical Training",
      description: "Control the ball. Control the game. Technical aspects are the cornerstone of a player's ability to perform in matches. Ball mastery can mean the difference between a missed opportunity and a spectacular goal. Our tailored technical training services hone your ball manipulation, enabling precise passes, dribbling at speed, escaping pressure and accurate execution.",
      link: "/services"
    },
    {
      icon: Activity,
      title: "Physical Conditioning",
      description: "Elite performance demands elite preparation. Our evidence-based physical conditioning programs are designed to optimize your speed, strength, endurance, and agility. We build footballers who can outlast and outperform their opponents across 90 minutes and beyond.",
      link: "/services"
    },
    {
      icon: Brain,
      title: "Tactical Analysis",
      description: "Understanding the game at a deeper level separates good players from great ones. Our tactical analysis breaks down your performances, identifies areas for improvement, and provides actionable insights to elevate your decision-making and positional awareness on the pitch.",
      link: "/services"
    },
    {
      icon: Shield,
      title: "Recovery & Injury Prevention",
      description: "Longevity in football requires smart recovery protocols and proactive injury prevention. Our mobility programming and recovery strategies keep you on the pitch, performing at your peak while minimizing the risk of setbacks.",
      link: "/services"
    },
    {
      icon: TrendingUp,
      title: "Career Management",
      description: "Your career is more than just matches. We provide comprehensive support including contract negotiations, club placements, and strategic career planning to ensure you reach your full potential both on and off the pitch.",
      link: "/services"
    },
    {
      icon: Users,
      title: "Personalized Programming",
      description: "Every player is unique. Our bespoke training programs are tailored to your specific position, playing style, and development goals. We create individualized roadmaps that accelerate your growth and maximize your strengths.",
      link: "/services"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Players - Football Development Services | Fuel For Football"
        description="Elevate your game with our comprehensive player development services. Technical training, tactical analysis, physical conditioning, and career management for footballers."
        url="/players"
      />
      <Header />
      
      <main className="pt-24 md:pt-28">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto relative">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-bebas uppercase tracking-wider text-foreground mb-6">
                {t('players.title', 'Players')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
                {t('players.intro', 'Fuel your potential. Elevate your game.')}
              </p>
              <p className="text-base md:text-lg text-muted-foreground/80 leading-relaxed">
                {t('players.description', 'We provide comprehensive development services designed to help footballers at every level reach their full potential. From technical mastery to tactical intelligence, physical conditioning to career management - we deliver the fuel you need to succeed.')}
              </p>
            </div>

            {/* CTA */}
            <div className="flex justify-center mb-20">
              <Link to="/services">
                <Button size="lg" className="gap-2 text-lg px-8 py-6 font-bebas uppercase tracking-wider">
                  {t('players.explore_services', 'Explore Our Services')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Link 
                  key={index} 
                  to={service.link}
                  className="group relative bg-card border border-border/50 rounded-lg p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bebas uppercase tracking-wider text-foreground mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    <span className="text-sm uppercase tracking-wide">{t('players.learn_more', 'Learn More')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-16 md:py-24 px-4 bg-card/50 border-t border-border/50">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider text-foreground mb-6">
              {t('players.ready_title', 'Ready to Elevate Your Game?')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('players.ready_description', 'Get in touch to discuss how we can help you reach your full potential as a footballer.')}
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 font-bebas uppercase tracking-wider">
                {t('players.contact_us', 'Contact Us')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Stars;
