import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Users, Target, ClipboardCheck, TrendingUp, Calendar, FileText, MessageSquare, ArrowRight } from "lucide-react";

const Consultation = () => {
  const { t } = useLanguage();

  const consultationServices = [
    {
      icon: Users,
      title: "Player Review",
      description: "Comprehensive evaluation of current abilities, potential, and areas for development with actionable insights.",
      price: "From £95"
    },
    {
      icon: Target,
      title: "Career Strategy Session",
      description: "One-on-one strategic planning to map out your football career goals and the steps to achieve them.",
      price: "From £150"
    },
    {
      icon: ClipboardCheck,
      title: "Performance Analysis",
      description: "In-depth match and training analysis to identify strengths and areas requiring improvement.",
      price: "From £120"
    },
    {
      icon: TrendingUp,
      title: "Development Plan",
      description: "Customized long-term development roadmap with measurable milestones and progression targets.",
      price: "From £200"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Initial Contact",
      description: "Reach out to discuss your needs and goals. We'll understand your situation and requirements."
    },
    {
      step: "02",
      title: "Assessment",
      description: "We conduct a thorough evaluation of your current position, abilities, and aspirations."
    },
    {
      step: "03",
      title: "Strategy Development",
      description: "Based on our assessment, we develop a tailored strategy and action plan."
    },
    {
      step: "04",
      title: "Implementation Support",
      description: "Ongoing guidance and support as you work through your personalized development plan."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto lg:mx-0">
              <h1 className="font-bebas text-5xl md:text-6xl lg:text-7xl text-primary mb-6">
                {t("services.consultation.title", "CONSULTATION")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 leading-relaxed">
                Expert consultation services tailored to your specific needs. Whether you're a player, parent, or club, we provide professional advice to help you make informed decisions and achieve your football goals.
              </p>
              <Button asChild size="lg" className="btn-shine font-bebas uppercase tracking-wider">
                <LocalizedLink to="/contact">Book a Consultation</LocalizedLink>
              </Button>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-bebas text-3xl md:text-4xl lg:text-5xl text-primary mb-4">WHAT WE OFFER</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Our consultation services cover every aspect of football performance and career development.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {consultationServices.map((service, index) => (
                <div 
                  key={index}
                  className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bebas text-xl md:text-2xl text-primary mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{service.description}</p>
                  <p className="text-base font-semibold text-primary">{service.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-bebas text-3xl md:text-4xl lg:text-5xl text-primary mb-4">HOW IT WORKS</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Our consultation process is designed to be straightforward and effective.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="p-6 rounded-lg bg-card border border-border h-full">
                    <div className="text-4xl md:text-5xl font-bebas text-primary/20 mb-2">{step.step}</div>
                    <h3 className="font-bebas text-lg md:text-xl uppercase tracking-wider mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-primary/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-bebas text-3xl md:text-4xl lg:text-5xl text-primary mb-4">WHO IT'S FOR</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 md:p-8 bg-card border border-border rounded-lg">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bebas text-xl md:text-2xl text-primary mb-3">Players</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Get expert guidance on your development, career decisions, and pathway to professional football.
                </p>
              </div>

              <div className="text-center p-6 md:p-8 bg-card border border-border rounded-lg">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bebas text-xl md:text-2xl text-primary mb-3">Parents</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Understand the football industry and make informed decisions about your child's development and opportunities.
                </p>
              </div>

              <div className="text-center p-6 md:p-8 bg-card border border-border rounded-lg sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bebas text-xl md:text-2xl text-primary mb-3">Clubs</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Receive strategic advice on player recruitment, development programs, and performance optimization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-bebas text-3xl md:text-4xl lg:text-5xl text-primary mb-6">READY TO GET STARTED?</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Book a consultation today and take the first step towards achieving your football goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-shine font-bebas uppercase tracking-wider">
                <LocalizedLink to="/contact">Book Now</LocalizedLink>
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

export default Consultation;
