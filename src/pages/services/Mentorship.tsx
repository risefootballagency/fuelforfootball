import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Users, Heart, Target, Lightbulb, Shield, TrendingUp, CheckCircle2 } from "lucide-react";

const Mentorship = () => {
  const { t } = useLanguage();

  const mentorshipPillars = [
    {
      icon: Heart,
      title: "Personal Support",
      description: "Regular one-on-one sessions providing guidance, motivation, and emotional support throughout your journey."
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Work with your mentor to set realistic, achievable goals and create actionable plans to reach them."
    },
    {
      icon: Lightbulb,
      title: "Career Wisdom",
      description: "Benefit from the experience of those who have navigated the football industry successfully."
    },
    {
      icon: Shield,
      title: "Mental Resilience",
      description: "Develop the psychological tools needed to handle pressure, setbacks, and the demands of professional football."
    }
  ];

  const mentorshipBenefits = [
    "Access to experienced professionals who have played at the highest levels",
    "Regular check-ins and progress reviews",
    "Personalized guidance tailored to your specific situation",
    "Network connections and introductions",
    "Career advice and decision-making support",
    "Life skills development for off-pitch success",
    "Confidential and supportive environment",
    "Long-term relationship building"
  ];

  const programmes = [
    {
      title: "Youth Mentorship",
      description: "For aspiring young players aged 12-18 looking to navigate the academy system and develop their potential.",
      features: ["Monthly mentor sessions", "Parent involvement", "Academic balance guidance", "Character development"],
      price: "From £150/month"
    },
    {
      title: "Pro Mentorship",
      description: "For professional players seeking guidance on career decisions, contract negotiations, and personal growth.",
      features: ["Weekly mentor sessions", "Career strategy", "Media training", "Financial guidance"],
      price: "From £300/month"
    },
    {
      title: "Transition Mentorship",
      description: "For players transitioning out of football into new careers, providing guidance on post-playing opportunities.",
      features: ["Career exploration", "Skills translation", "Network building", "Identity transition support"],
      price: "From £200/month"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="font-bebas text-5xl md:text-7xl text-primary mb-6">
                {t("services.mentorship.title", "MENTORSHIP")}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8 leading-relaxed">
                Our mentorship programme provides personalized guidance from experienced professionals who have walked the path before you. Get one-on-one support to navigate your football career and develop both on and off the pitch.
              </p>
              <Button asChild size="lg" className="btn-shine font-bebas uppercase tracking-wider">
                <LocalizedLink to="/contact">Find Your Mentor</LocalizedLink>
              </Button>
            </div>
          </div>
        </section>

        {/* Four Pillars */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-4">THE FOUR PILLARS</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our mentorship approach is built on four key pillars that ensure comprehensive development.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentorshipPillars.map((pillar, index) => (
                <div 
                  key={index}
                  className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <pillar.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bebas text-2xl text-primary mb-2">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Mentorship Matters */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-6">WHY MENTORSHIP MATTERS</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  The football industry can be challenging to navigate alone. Having an experienced mentor by your side provides invaluable guidance, helping you avoid common pitfalls and make better decisions for your career.
                </p>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Our mentors have been where you are now. They understand the pressures, the sacrifices, and the rewards of pursuing a football career. They're here to share their wisdom and help you write your own success story.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-8">
                <h3 className="font-bebas text-2xl text-primary mb-6">KEY BENEFITS</h3>
                <ul className="space-y-3">
                  {mentorshipBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Programmes */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-4">OUR PROGRAMMES</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the mentorship programme that best fits your current stage and goals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {programmes.map((programme, index) => (
                <div 
                  key={index}
                  className="bg-card border-2 border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300"
                >
                  <h3 className="font-bebas text-2xl text-primary mb-3">{programme.title}</h3>
                  <p className="text-muted-foreground mb-6">{programme.description}</p>
                  <ul className="space-y-2 mb-6">
                    {programme.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xl font-semibold text-primary">{programme.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mentors */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-6">OUR MENTORS</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Our mentors are carefully selected professionals with extensive experience in football at the highest levels. They include former professional players, coaches, sporting directors, and industry experts who are passionate about giving back to the next generation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-card border border-border rounded-full">
                <span className="text-sm font-medium">Former Professional Players</span>
              </div>
              <div className="px-6 py-3 bg-card border border-border rounded-full">
                <span className="text-sm font-medium">UEFA Licensed Coaches</span>
              </div>
              <div className="px-6 py-3 bg-card border border-border rounded-full">
                <span className="text-sm font-medium">Sporting Directors</span>
              </div>
              <div className="px-6 py-3 bg-card border border-border rounded-full">
                <span className="text-sm font-medium">Sports Psychologists</span>
              </div>
              <div className="px-6 py-3 bg-card border border-border rounded-full">
                <span className="text-sm font-medium">Industry Experts</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-bebas text-4xl md:text-5xl text-primary mb-6">START YOUR MENTORSHIP JOURNEY</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with an experienced mentor who can guide you towards achieving your football aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-shine font-bebas uppercase tracking-wider">
                <LocalizedLink to="/contact">Get Started</LocalizedLink>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-bebas uppercase tracking-wider">
                <LocalizedLink to="/services">View All Services</LocalizedLink>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Mentorship;
