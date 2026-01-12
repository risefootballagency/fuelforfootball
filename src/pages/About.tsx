import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { WhatsAppPulse } from "@/components/WhatsAppPulse";
import { EliteMessaging, PropagandaBanner } from "@/components/EliteMessaging";
import { useMarketingGalleryImages } from "@/hooks/useMarketingGalleryImages";
import { useLandingFolderImages } from "@/hooks/useLandingFolderImages";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "philosophy", label: "Philosophy" },
  { id: "pioneers", label: "Pioneers" },
  { id: "talent", label: "Talent" },
  { id: "future", label: "Future" },
] as const;

type SectionId = typeof SECTIONS[number]["id"];

const About = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<SectionId>("philosophy");
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    philosophy: null,
    pioneers: null,
    talent: null,
    future: null,
  });
  
  const { data: galleryImages = [] } = useMarketingGalleryImages(20);
  const { data: landingImages = [] } = useLandingFolderImages(20);

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of SECTIONS) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: SectionId) => {
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="About Fuel For Football | Leading Performance Consultancy"
        description="Fuel For Football is football's leading performance consultancy. Revolutionising scouting, performance analysis, and player development to change the game."
        image="/og-preview-about.png"
        url="/about"
      />
      <Header />
      
      <main className="pt-20 md:pt-24 touch-pan-y overflow-x-hidden">
        {/* Hero Section - Full bleed with dramatic imagery */}
        <section className="relative h-[70vh] md:h-[85vh] flex items-end overflow-hidden">
          {galleryImages[0] && (
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img 
                src={galleryImages[0].file_url}
                alt="Fuel For Football"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="relative container mx-auto px-4 pb-12 md:pb-20 z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-8xl font-bebas uppercase tracking-wider text-white mb-4"
            >
              Change The Game.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-2xl text-white/80 max-w-2xl"
            >
              Football's leading performance consultancy. Revolutionising how players are developed, scouted, and prepared for the elite level.
            </motion.p>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.div>
        </section>

        {/* Sticky Navigation Tabs */}
        <nav className="sticky top-20 md:top-24 z-40 bg-background/95 backdrop-blur-md border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex gap-6 md:gap-10 py-4 overflow-x-auto scrollbar-hide">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "text-sm md:text-base font-medium whitespace-nowrap transition-all duration-300 pb-1 border-b-2",
                    activeSection === section.id
                      ? "text-foreground border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Philosophy Section */}
        <section 
          ref={(el) => (sectionRefs.current.philosophy = el)}
          id="philosophy"
          className="py-16 md:py-24"
        >
          {/* Statement */}
          <div className="container mx-auto px-4 mb-16 md:mb-24">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider mb-8 leading-tight">
                A player's potential is not defined by where they start. It is defined by the system around them.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                We built the first consultancy that integrates performance science, tactical analysis, and career development into one unified discipline.
              </p>
            </div>
          </div>

          {/* Philosophy Image Grid */}
          <div className="grid md:grid-cols-2 gap-px bg-border/30">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {galleryImages[1] && (
                <img 
                  src={galleryImages[1].file_url}
                  alt="Performance consultancy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bebas uppercase tracking-wider text-white mb-2">
                  Performance First
                </h3>
                <p className="text-sm md:text-base text-white/70 max-w-md">
                  We are committed to exclusive quality from the first assessment to match day. Every detail matters in developing elite footballers.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {galleryImages[2] && (
                <img 
                  src={galleryImages[2].file_url}
                  alt="Attention to detail"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bebas uppercase tracking-wider text-white mb-2">
                  Attention to Detail
                </h3>
                <p className="text-sm md:text-base text-white/70 max-w-md">
                  The experience and passion of our team always results in something extraordinary: players full of confidence who fully meet their potential.
                </p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="container mx-auto px-4 py-16 md:py-24">
            <blockquote className="max-w-3xl mx-auto text-center">
              <p className="text-2xl md:text-4xl font-bebas uppercase tracking-wider italic mb-6">
                "In the beginning, I looked around but could not find the support I was dreaming of. So we decided to build it ourselves."
              </p>
              <cite className="text-sm text-muted-foreground not-italic">
                Jolon Levene, Founder
              </cite>
            </blockquote>
          </div>
        </section>

        {/* Pioneers Section */}
        <section 
          ref={(el) => (sectionRefs.current.pioneers = el)}
          id="pioneers"
          className="py-16 md:py-24 bg-muted/30"
        >
          <div className="container mx-auto px-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider mb-4">
              The First to Do This.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We pioneered the integrated approach to player development. No one else was combining elite performance coaching with advanced scouting and tactical analysis.
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* How it started */}
              <div className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                  {galleryImages[3] && (
                    <img 
                      src={galleryImages[3].file_url}
                      alt="Origins"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-bebas uppercase tracking-wider mb-2">
                  How it started.
                </h3>
                <p className="text-sm text-muted-foreground">
                  We started as players. We became coaches. We developed performance teams around Premier League talents. We saw firsthand what separates good players from great ones.
                </p>
              </div>

              {/* From 2015 */}
              <div className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                  {galleryImages[4] && (
                    <img 
                      src={galleryImages[4].file_url}
                      alt="Since 2015"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-bebas uppercase tracking-wider mb-2">
                  From 2015.
                </h3>
                <p className="text-sm text-muted-foreground">
                  We pioneered the integrated approach, combining elite performance coaching with advanced scouting and tactical education. We were the first to do this.
                </p>
              </div>

              {/* Today */}
              <div className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                  {galleryImages[5] && (
                    <img 
                      src={galleryImages[5].file_url}
                      alt="Present day"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-bebas uppercase tracking-wider mb-2">
                  Today.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Now the model has been proven. Our players compete at the highest levels across Europe. The industry is catching up, but we are still ahead.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="container mx-auto px-4 mt-16 md:mt-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bebas text-primary">74</div>
                <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">Professionals Developed</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bebas text-primary">18</div>
                <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">Big 5 League Players</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bebas text-primary">10</div>
                <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">National Team Players</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bebas text-primary">£100M+</div>
                <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">Transfer Value Generated</p>
              </div>
            </div>
          </div>
        </section>

        {/* Talent Section */}
        <section 
          ref={(el) => (sectionRefs.current.talent = el)}
          id="talent"
          className="py-16 md:py-24"
        >
          <div className="container mx-auto px-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider mb-4">
              The Level of Talent We Develop.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              From academy prospects to international stars. Our track record speaks for itself in developing world-class footballers.
            </p>
          </div>

          {/* Talent Grid - Asymmetric */}
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {/* Large feature */}
              <div className="md:col-span-2 md:row-span-2 relative aspect-[16/10] md:aspect-auto overflow-hidden rounded-lg group">
                {galleryImages[6] && (
                  <img 
                    src={galleryImages[6].file_url}
                    alt="Elite development"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10">
                  <h3 className="text-2xl md:text-4xl font-bebas uppercase tracking-wider text-white mb-2">
                    Elite Development
                  </h3>
                  <p className="text-sm md:text-base text-white/70 max-w-lg">
                    We have worked with some of the most talented players in the game. Our performance systems prepare players for the highest level.
                  </p>
                </div>
              </div>

              {/* Smaller cards */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg group">
                {galleryImages[7] && (
                  <img 
                    src={galleryImages[7].file_url}
                    alt="Global network"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-6">
                  <h4 className="text-lg md:text-xl font-bebas uppercase tracking-wider text-white">
                    Global Network
                  </h4>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-lg group">
                {galleryImages[8] && (
                  <img 
                    src={galleryImages[8].file_url}
                    alt="Player development"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-6">
                  <h4 className="text-lg md:text-xl font-bebas uppercase tracking-wider text-white">
                    Player Development
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Players Who Took Action - Using Landing Folder Images */}
          <div className="mt-16 md:mt-24">
            <div className="container mx-auto px-4 mb-6">
              <h3 className="text-2xl md:text-3xl font-bebas uppercase tracking-wider">
                Players Who Took Action.
              </h3>
            </div>
            <div className="overflow-hidden">
              <div className="flex gap-1 animate-marquee">
                {[...landingImages, ...landingImages].map((img, i) => (
                  <div 
                    key={`${img?.id}-${i}`}
                    className="relative w-32 md:w-48 flex-shrink-0 aspect-[3/4] overflow-hidden"
                  >
                    {img && (
                      <img 
                        src={img.file_url}
                        alt="Elite player"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section 
          ref={(el) => (sectionRefs.current.future = el)}
          id="future"
          className="py-16 md:py-24 bg-muted/30"
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider mb-6">
                  Where We Are Going.
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Our players are inspired by greatness. And we are always developing new methods. We believe in permanent progress. That is why we are working with the future Ballon d'Or winner.
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                  Every day you hesitate is another day your competition gets ahead. The players who made it did not wait for the perfect moment.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <WhatsAppPulse position="inline" message="Start your journey" showDelay={0} />
                  <Button asChild variant="outline" className="font-bebas uppercase tracking-wider">
                    <Link to="/contact" className="flex items-center gap-2">
                      Contact Us <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                {galleryImages[0] && (
                  <img 
                    src={galleryImages[0].file_url}
                    alt="The future"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-xs uppercase tracking-widest text-white/70">The Future</span>
                  <h3 className="text-2xl md:text-3xl font-bebas uppercase tracking-wider text-white">
                    Working with tomorrow's legends, today.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Propaganda Banner */}
        <PropagandaBanner />

        {/* Final FOMO Section */}
        <EliteMessaging variant="fomo" className="bg-background" />
      </main>

      {/* Floating WhatsApp CTA */}
      <WhatsAppPulse showDelay={6000} />

      <Footer />
    </div>
  );
};

export default About;
