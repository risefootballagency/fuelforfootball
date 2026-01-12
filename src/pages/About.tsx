import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { InfoBoxWithPlayerBg, PLAYER_BG_IMAGES } from "@/components/InfoBoxWithPlayerBg";
import bannerHero from "@/assets/banner-hero.jpg";

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="About Fuel For Football - Performance Consultancy | Player Development"
        description="Fuel For Football is football's leading performance consultancy. We help players, coaches, and clubs reach their full potential through elite training and development."
        image="/og-preview-about.png"
        url="/about"
      />
      <Header />
      
      <main className="pt-20 md:pt-24 touch-pan-y overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bannerHero})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
          
          <div className="relative container mx-auto px-4 text-center z-10">
            <h1 className="text-4xl md:text-7xl font-bebas uppercase tracking-wider text-white mb-4 md:mb-6">
              {t('about.title')}
            </h1>
            <p className="text-base md:text-2xl text-white/90 max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </section>

        {/* Our Story */}
        <InfoBoxWithPlayerBg
          playerImage={PLAYER_BG_IMAGES[0]}
          className="py-10 md:py-24 bg-muted/30"
          imagePosition="right"
          imageOpacity={0.1}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider mb-4 md:mb-8">
                OUR <span className="text-primary">STORY</span>
              </h2>
              <div className="space-y-4 md:space-y-6 text-sm md:text-lg text-muted-foreground">
                <p>
                  We started as players. We understand the journey—the sacrifices, the setbacks, and what it takes to make it.
                </p>
                <p>
                  We became coaches. We learned how to develop talent, how to identify potential, and how to build players who could compete at the highest level.
                </p>
                <p>
                  We developed performance teams around Premier League talents. We saw firsthand what separates good players from great ones—and it's not always what you'd expect.
                </p>
                <p className="text-foreground font-medium">
                  We built this into the agency we run today. Every lesson, every insight, every connection—now focused on helping the next generation realise their potential.
                </p>
              </div>
            </div>
          </div>
        </InfoBoxWithPlayerBg>

        {/* Who We Are */}
        <InfoBoxWithPlayerBg
          playerImage={PLAYER_BG_IMAGES[1]}
          className="py-10 md:py-24"
          imagePosition="left"
          imageOpacity={0.08}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider mb-4 md:mb-8">
                {t('about.who_we_are')}
              </h2>
              <div className="space-y-4 md:space-y-6 text-sm md:text-lg text-muted-foreground">
                <p>
                  Fuel For Football is the leading performance consultancy for developing talents and guiding them to the top. We are committed to nurturing talent and maximizing the potential of every athlete we work with.
                </p>
                <p>
                  Founded on firsthand experience as players and coaches, Fuel For Football has established itself as a trusted partner for players at all stages of their careers.
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-8 md:mt-12">
                <InfoBoxWithPlayerBg playerImage={PLAYER_BG_IMAGES[6]} className="text-center p-3 md:p-4 border border-border/50 bg-card/30 rounded-lg" imageOpacity={0.12}>
                  <div className="text-2xl md:text-4xl font-bebas text-primary">74</div>
                  <p className="text-[10px] md:text-xs font-bebas uppercase tracking-widest text-foreground/70">Professionals</p>
                </InfoBoxWithPlayerBg>
                <InfoBoxWithPlayerBg playerImage={PLAYER_BG_IMAGES[7]} className="text-center p-3 md:p-4 border border-border/50 bg-card/30 rounded-lg" imageOpacity={0.12}>
                  <div className="text-2xl md:text-4xl font-bebas text-primary">18</div>
                  <p className="text-[10px] md:text-xs font-bebas uppercase tracking-widest text-foreground/70">Big 5 League</p>
                </InfoBoxWithPlayerBg>
                <InfoBoxWithPlayerBg playerImage={PLAYER_BG_IMAGES[8]} className="text-center p-3 md:p-4 border border-border/50 bg-card/30 rounded-lg" imageOpacity={0.12}>
                  <div className="text-2xl md:text-4xl font-bebas text-primary">10</div>
                  <p className="text-[10px] md:text-xs font-bebas uppercase tracking-widest text-foreground/70">National Teams</p>
                </InfoBoxWithPlayerBg>
                <InfoBoxWithPlayerBg playerImage={PLAYER_BG_IMAGES[9]} className="text-center p-3 md:p-4 border border-border/50 bg-card/30 rounded-lg" imageOpacity={0.12}>
                  <div className="text-2xl md:text-4xl font-bebas text-primary">£100M+</div>
                  <p className="text-[10px] md:text-xs font-bebas uppercase tracking-widest text-foreground/70">Transfer Fees</p>
                </InfoBoxWithPlayerBg>
              </div>
            </div>
          </div>
        </InfoBoxWithPlayerBg>

        {/* Our Mission */}
        <InfoBoxWithPlayerBg
          playerImage={PLAYER_BG_IMAGES[2]}
          className="py-10 md:py-16 bg-muted/30"
          imagePosition="right"
          imageOpacity={0.1}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider mb-4 md:mb-8">
                {t('about.our_mission')}
              </h2>
              <div className="space-y-4 md:space-y-6 text-sm md:text-lg text-muted-foreground">
                <p>
                  Our mission is simple: to help footballers reach their full potential both on and off the field. We believe every player deserves expert guidance, unwavering support, and opportunities to showcase their abilities on the biggest stages.
                </p>
                <p className="text-xs md:text-base text-muted-foreground/90 pt-2 md:pt-4">
                  Our work supports player development within the governance structures that maintain football's integrity.
                </p>
              </div>
            </div>
          </div>
        </InfoBoxWithPlayerBg>

        {/* What We Do */}
        <InfoBoxWithPlayerBg
          playerImage={PLAYER_BG_IMAGES[3]}
          className="py-10 md:py-16"
          imagePosition="left"
          imageOpacity={0.08}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider mb-6 md:mb-12">
                {t('about.what_we_do')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <InfoBoxWithPlayerBg playerImage={PLAYER_BG_IMAGES[4]} className="space-y-2 md:space-y-4 p-4 rounded-lg border border-border/30 bg-card/30" imageOpacity={0.1}>
                  <h3 className="text-xl md:text-2xl font-bebas uppercase tracking-wider text-primary">
                    {t('about.representation')}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {t('about.representation_desc')}
                  </p>
                </InfoBoxWithPlayerBg>
                <InfoBoxWithPlayerBg playerImage={PLAYER_BG_IMAGES[5]} className="space-y-2 md:space-y-4 p-4 rounded-lg border border-border/30 bg-card/30" imageOpacity={0.1}>
                  <h3 className="text-xl md:text-2xl font-bebas uppercase tracking-wider text-primary">
                    {t('about.career_dev')}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {t('about.career_dev_desc')}
                  </p>
                </InfoBoxWithPlayerBg>
                <InfoBoxWithPlayerBg playerImage={PLAYER_BG_IMAGES[10]} className="space-y-2 md:space-y-4 p-4 rounded-lg border border-border/30 bg-card/30" imageOpacity={0.1}>
                  <h3 className="text-xl md:text-2xl font-bebas uppercase tracking-wider text-primary">
                    {t('about.global_network')}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {t('about.global_network_desc')}
                  </p>
                </InfoBoxWithPlayerBg>
                <InfoBoxWithPlayerBg playerImage={PLAYER_BG_IMAGES[11]} className="space-y-2 md:space-y-4 p-4 rounded-lg border border-border/30 bg-card/30" imageOpacity={0.1}>
                  <h3 className="text-xl md:text-2xl font-bebas uppercase tracking-wider text-primary">
                    {t('about.personal_support')}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {t('about.personal_support_desc')}
                  </p>
                </InfoBoxWithPlayerBg>
              </div>
            </div>
          </div>
        </InfoBoxWithPlayerBg>

        {/* CTA Section */}
        <InfoBoxWithPlayerBg
          playerImage={PLAYER_BG_IMAGES[0]}
          className="py-10 md:py-16 bg-muted/30"
          imagePosition="center"
          imageOpacity={0.08}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider mb-4 md:mb-6">
              {t('about.cta_title')}
            </h2>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
              {t('about.cta_subtitle')}
            </p>
            <Button asChild size="lg" className="btn-shine font-bebas uppercase tracking-wider">
              <Link to="/contact">{t('about.cta_button')}</Link>
            </Button>
          </div>
        </InfoBoxWithPlayerBg>
      </main>

      <Footer />
    </div>
  );
};

export default About;
