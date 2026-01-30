import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Dumbbell, Brain, LineChart, Users, Briefcase, HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSmokyBackground } from "@/components/AnimatedSmokyBackground";
import { ScrollReveal } from "@/components/ScrollReveal";

interface ContactSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  whatsapp: string;
  email: string;
}

const Contact = () => {
  const { t } = useLanguage();

  const contactSections: ContactSection[] = [
    {
      title: "Performance Services",
      description: "Enquire about our individual training programmes, analysis services, and performance packages",
      icon: <Dumbbell className="w-6 h-6" />,
      whatsapp: "+447508342901",
      email: "info@fuelforfootball.com"
    },
    {
      title: "Mental Performance",
      description: "Learn about our psychological coaching, mentorship, and mental skills development",
      icon: <Brain className="w-6 h-6" />,
      whatsapp: "+447508342901",
      email: "info@fuelforfootball.com"
    },
    {
      title: "Analysis & Data",
      description: "Pre-match, post-match analysis, efficiency reports, and tactical breakdowns",
      icon: <LineChart className="w-6 h-6" />,
      whatsapp: "+447508342901",
      email: "info@fuelforfootball.com"
    },
    {
      title: "Clubs & Academies",
      description: "Partnership opportunities for clubs seeking performance consultancy services",
      icon: <Users className="w-6 h-6" />,
      whatsapp: "+447508342901",
      email: "info@fuelforfootball.com"
    },
    {
      title: "Business & Media",
      description: "Sponsorship opportunities, collaborations, and press enquiries",
      icon: <Briefcase className="w-6 h-6" />,
      whatsapp: "+447446365438",
      email: "info@fuelforfootball.com"
    },
    {
      title: "General Enquiries",
      description: "Any other questions about Fuel For Football and how we can help you",
      icon: <HelpCircle className="w-6 h-6" />,
      whatsapp: "+447446365438",
      email: "info@fuelforfootball.com"
    }
  ];

  return (
    <>
      <SEO 
        title="Contact Us - Get in Touch | Fuel For Football"
        description="Get in touch with Fuel For Football. Enquire about our performance programmes, analysis services, mental coaching, and partnership opportunities."
        image="/og-preview-contact.png"
        url="/contact"
      />
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated smoky background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <AnimatedSmokyBackground />
        </div>

        <div className="relative z-10">
          <Header />
          
          <main className="pt-20 md:pt-24">
            {/* Page Header */}
            <ScrollReveal>
              <section className="relative py-12 md:py-20 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bebas uppercase text-white mb-4 tracking-wider">
                    {t('contact.title', 'Get In Touch')}
                  </h1>
                  <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
                    {t('contact.subtitle', 'Ready to take your game to the next level? Choose the department that best fits your enquiry and we\'ll get back to you within 24 hours.')}
                  </p>
                </div>
              </section>
            </ScrollReveal>

            {/* Contact Cards Grid */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
                {contactSections.map((section, index) => (
                  <ScrollReveal key={section.title} delay={index * 0.1}>
                    <div className="group bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 h-full transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 flex flex-col">
                      {/* Icon & Title */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all duration-300">
                          {section.icon}
                        </div>
                        <h2 className="text-xl md:text-2xl font-bebas uppercase tracking-wider text-white">
                          {section.title}
                        </h2>
                      </div>

                      {/* Description */}
                      <p className="text-sm md:text-base text-white/70 mb-6 flex-grow">
                        {section.description}
                      </p>

                      {/* Contact Buttons */}
                      <div className="space-y-3">
                        <Button 
                          asChild
                          className="w-full font-bebas uppercase tracking-wider bg-accent hover:bg-accent/90 text-black"
                          size="lg"
                        >
                          <a 
                            href={`https://wa.me/${section.whatsapp.replace(/\+/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="mr-2 h-5 w-5" />
                            WhatsApp
                          </a>
                        </Button>

                        <Button 
                          asChild
                          variant="outline"
                          className="w-full font-bebas uppercase tracking-wider border-white/30 text-white hover:border-accent hover:text-accent"
                          size="lg"
                        >
                          <a 
                            href={`mailto:${section.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Mail className="mr-2 h-5 w-5" />
                            Email
                          </a>
                        </Button>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Additional Info */}
              <div className="max-w-2xl mx-auto mt-12 text-center">
                <p className="text-white/60 text-sm">
                  Based in the United Kingdom, working with players worldwide.
                </p>
              </div>
            </section>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Contact;