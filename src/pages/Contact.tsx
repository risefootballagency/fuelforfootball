import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InfoBoxWithPlayerBg, PLAYER_BG_IMAGES } from "@/components/InfoBoxWithPlayerBg";
import { ScrollReveal } from "@/components/ScrollReveal";

interface ContactSection {
  titleKey: string;
  titleFallback: string;
  descKey: string;
  descFallback: string;
  whatsapp: string;
  email: string;
}

const Contact = () => {
  const { t } = useLanguage();

  const contactSections: ContactSection[] = [
    {
      titleKey: "contact.players",
      titleFallback: "Players",
      descKey: "contact.players_desc",
      descFallback: "Take your career to the next level with professional representation",
      whatsapp: "+447508342901",
      email: "info@fuelforfootball.com"
    },
    {
      titleKey: "contact.clubs",
      titleFallback: "Clubs",
      descKey: "contact.clubs_desc",
      descFallback: "Discover top talent for your squad through our extensive network",
      whatsapp: "+447508342901",
      email: "info@fuelforfootball.com"
    },
    {
      titleKey: "contact.media",
      titleFallback: "Media",
      descKey: "contact.media_desc",
      descFallback: "Press inquiries and media relations",
      whatsapp: "+447446365438",
      email: "info@fuelforfootball.com"
    },
    {
      titleKey: "contact.sponsors",
      titleFallback: "Sponsors",
      descKey: "contact.sponsors_desc",
      descFallback: "Partnership and sponsorship opportunities",
      whatsapp: "+447446365438",
      email: "info@fuelforfootball.com"
    },
    {
      titleKey: "contact.agents",
      titleFallback: "Agents",
      descKey: "contact.agents_desc",
      descFallback: "Professional collaboration and networking",
      whatsapp: "+447508342901",
      email: "info@fuelforfootball.com"
    },
    {
      titleKey: "contact.parents",
      titleFallback: "Player Parents",
      descKey: "contact.parents_desc",
      descFallback: "Supporting your young player's journey",
      whatsapp: "+447508342901",
      email: "info@fuelforfootball.com"
    },
    {
      titleKey: "contact.other",
      titleFallback: "Other",
      descKey: "contact.other_desc",
      descFallback: "General inquiries and other matters",
      whatsapp: "+447446365438",
      email: "info@fuelforfootball.com"
    }
  ];

  return (
    <>
      <SEO 
        title="Contact Us - Get in Touch | Fuel For Football"
        description="Get in touch with Fuel For Football. Contact our team for player representation, club partnerships, media inquiries, and more."
        image="/og-preview-contact.png"
        url="/contact"
      />
      <Header />
      <div className="min-h-screen bg-background pt-24 md:pt-24 touch-pan-y overflow-x-hidden">
        {/* Page Header */}
        <ScrollReveal>
          <InfoBoxWithPlayerBg
            playerImage={PLAYER_BG_IMAGES[0]}
            className="bg-background border-b border-primary/20"
            imagePosition="right"
            imageOpacity={0.1}
          >
            <div className="container mx-auto py-8 md:py-12">
              <h1 className="text-4xl md:text-7xl font-bebas uppercase text-foreground mb-3 md:mb-4 tracking-wider">
                {t('contact.title', 'Contact Us')}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                {t('contact.subtitle', 'Get in touch with the right team member for your needs')}
              </p>
            </div>
          </InfoBoxWithPlayerBg>
        </ScrollReveal>

        {/* Contact Sections */}
        <main className="container mx-auto py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {contactSections.map((section, index) => (
              <ScrollReveal key={section.titleKey} delay={index * 0.1}>
                <InfoBoxWithPlayerBg
                  playerImage={PLAYER_BG_IMAGES[index % PLAYER_BG_IMAGES.length]}
                  className="bg-secondary/30 backdrop-blur-sm p-4 md:p-8 rounded-lg border border-primary/20 hover:border-primary transition-all space-y-4 md:space-y-6 h-full"
                  imagePosition={index % 2 === 0 ? 'right' : 'left'}
                  imageOpacity={0.12}
                >
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bebas uppercase tracking-wider text-primary mb-2 md:mb-3">
                      {t(section.titleKey, section.titleFallback)}
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {t(section.descKey, section.descFallback)}
                    </p>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Button 
                      asChild
                      className="btn-shine w-full text-base md:text-lg font-bebas uppercase tracking-wider"
                      size="lg"
                    >
                      <a 
                        href={`https://wa.me/${section.whatsapp.replace(/\+/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        {t('contact.whatsapp', 'WhatsApp')}
                      </a>
                    </Button>

                    <Button 
                      asChild
                      variant="outline"
                      className="w-full text-base md:text-lg font-bebas uppercase tracking-wider"
                      size="lg"
                    >
                      <a 
                        href={`mailto:${section.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        {t('contact.email', 'Email')}
                      </a>
                    </Button>
                  </div>
                </InfoBoxWithPlayerBg>
              </ScrollReveal>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
