import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroSlider } from "@/components/HeroSlider";
import { ScrollReveal } from "@/components/ScrollReveal";
import bannerHero from "@/assets/banner-hero.jpg";
import coachesSection from "@/assets/coaches-section.png";
import coachesNetwork from "@/assets/coaches-network.jpg";

const Coaches = () => {
  const { t } = useLanguage();
  
  const heroSlides = [
    {
      image: bannerHero,
      title: 'THE WAR ROOM',
      subtitle: 'Strategic support to enhance your decision-making',
    },
    {
      image: coachesNetwork,
      title: 'TACTICAL EXCELLENCE',
      subtitle: 'Pre-match analysis and strategic preparation',
    },
    {
      image: coachesSection,
      title: 'FUEL UP ON SUCCESS',
      subtitle: 'Arm yourself with the edge to thrive',
    },
  ];

  const developmentSteps = [
    {
      number: "01",
      title: "UNDERSTAND",
      description: "To optimise a coach's performance, we start by understanding their coaching philosophy. This involves a deep dive into their beliefs, values, and approach to coaching. By gaining this insight, we can tailor our services to help coaches achieve their goals and improve their overall performance."
    },
    {
      number: "02",
      title: "DEVELOP",
      description: "In this particular part of the process, we work with coaches to identify the areas where they can make the biggest impact to achieve their desired results. By discussing strategies and techniques tailored to their specific needs, we can shape your career and team's future."
    },
    {
      number: "03",
      title: "APPLY",
      description: "In the final part of the process, we will work together to advance with the agreed strategy based on your specific needs as a coach. Our goal is to ensure that you have all the tools and resources necessary to achieve your coaching objectives. Let's work together to take your coaching practice to the next level!"
    }
  ];

  return (
    <div className="min-h-screen bg-background" key="coaches-page">
      <SEO 
        title="For Coaches - The War Room | Fuel For Football"
        description="Strategic support for coaching excellence. We serve as your tactical co-pilots, helping you make better decisions, develop winning strategies, and lead your team to success."
        image="/og-preview-coaches.png"
        url="/coaches"
      />
      <Header />
      
      <main className="pt-24 md:pt-16">
        {/* Hero Slider */}
        <HeroSlider slides={heroSlides} />

        {/* THE WAR ROOM Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider text-primary mb-6">
                THE WAR ROOM
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                We serve as your strategic support away from the club, providing a fresh, external perspective to enhance your decision-making. With our detailed analysis, expert coaching insights, and tactical advice, you can explore new strategies and optimise team performance. Partnering with us gives you access to a wealth of knowledge and innovative solutions, helping you stay ahead of the competition. We aim to empower you with the tools and insights needed to run your team more effectively and achieve your coaching goals.
              </p>
            </div>
          </div>
        </section>

        {/* FUEL UP ON SUCCESS Section */}
        <section className="py-16 md:py-24 px-4 bg-muted/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider mb-6">
                FUEL UP ON <span className="text-primary">SUCCESS</span>
              </h2>
            </div>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p>
                Fuel For Football are the tactical co-pilots, sat in the war room strategising on how to get the results for you and your team. In the rapid-paced, high-stakes world of football where teams are ever disassociating themselves from their coaches, building models which limit their coaches' ability to work at their best, we claw ground back.
              </p>
              <p>
                Understanding the pressure of delivering wins week in and week out, we arm you with precise tactical insights, advanced training methodologies, and resilient psychological support. But we go beyond the here and now: Our services are designed to help you strategically plan for the future including beyond your existing club, ensuring your recruitment efforts yield maximum impact on your team's abilities and cohesion. Every training session, every match, every season, Fuel For Football stands by you with the edge to not just survive but thrive in the relentless pursuit of excellence. Embrace the challenge, claim your victories, and together, let's redefine the landscape of football coaching.
              </p>
            </div>
          </div>
        </section>

        {/* COACH DEVELOPMENT PROCESS Section */}
        <section className="py-16 md:py-24 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl font-bebas uppercase tracking-wider mb-6">
                COACH DEVELOPMENT <span className="text-primary">PROCESS</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {developmentSteps.map((step) => (
                <div 
                  key={step.number}
                  className="p-8 rounded-2xl border-2 border-border bg-card/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="text-6xl font-bebas text-primary/20 mb-4">{step.number}</div>
                  <h3 className="text-3xl font-bebas uppercase tracking-wider text-primary mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                In the world of football, every coach strives for excellence. Fuel for Football is your strategic partner in achieving this goal. We offer services designed to enhance every aspect of your coaching, from developing individual player skills and creating cohesive team dynamics to implementing advanced tactical strategies. With our support, you can refine your approach, gain fresh insights, and lead your team to consistent success.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-bebas uppercase tracking-wider mb-6">
              READY TO <span className="text-primary">CHANGE THE GAME</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book a consultation and discover how we can elevate your coaching career
            </p>
            <Button asChild size="lg" className="btn-shine font-bebas uppercase tracking-wider text-lg px-10 py-6">
              <Link to="/contact">BOOK A CONSULTATION</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Coaches;