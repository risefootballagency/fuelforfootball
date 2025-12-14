import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";

const StrengthPowerSpeed = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-8">
          <div className="container mx-auto px-4 text-center">
            <p className="font-bebas text-2xl text-muted-foreground tracking-widest mb-4">
              STRENGTH, POWER & SPEED
            </p>
            <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl text-foreground mb-8">
              BECOME A<br />
              PHYSICAL FORCE
            </h1>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-8 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_d987884d5fc74a6db332baecdf26cec5~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Strength%2C%20Power%20%26%20Speed.png"
                  alt="Strength"
                  className="w-24 h-24"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">STRENGTH</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_8a4c8c4d0b8e4a0f9c3d5e6f7a8b9c0d~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Power.png"
                  alt="Power"
                  className="w-24 h-24"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">POWER</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_7dc31f57fd654cc3a293f7ab6506c3ea~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Run%20Faster.png"
                  alt="Speed"
                  className="w-24 h-24"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">SPEED</span>
              </div>
            </div>
          </div>
        </section>

        {/* In Detail Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              IN DETAIL
            </h2>
            
            <div className="max-w-5xl mx-auto">
              {/* Tabs */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                <div className="bg-card border border-primary rounded-lg p-4 text-center">
                  <span className="font-bebas text-lg text-primary">Overview</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">In-Person</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">Online</span>
                </div>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  Our strength, power, and speed programming is designed specifically for footballers who want to become physical forces on the pitch. We develop the explosive attributes that separate elite players from the rest - the ability to sprint past defenders, hold off opponents, and maintain intensity throughout 90 minutes.
                </p>
                <p className="leading-relaxed">
                  Football is a game of moments - a burst of acceleration to beat a defender, a powerful jump to win a header, the strength to hold off a challenge. Our evidence-based training methods target these specific demands, ensuring every session translates directly to improved on-pitch performance.
                </p>
                <p className="leading-relaxed">
                  For new players, we start with an assessment to identify key physical development goals, ensuring each session is designed to achieve the greatest performance improvements. Our individualised training sessions are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact.
                </p>
                <p className="leading-relaxed">
                  In-depth programming with a high attention to detail. Programming is individualised to improve the key physical aspects for improving performance on the pitch. Our strength & conditioning coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations - using your feedback and filmed sets. New phases are programmed to always know exactly what to focus on in the next sessions.
                </p>
                <p className="text-sm italic">
                  Please note that in-person service is only available to players in England.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-bebas text-2xl text-primary mb-4">STRENGTH</h3>
                <p className="text-muted-foreground">
                  Build functional strength that translates directly to on-pitch performance. Win more duels, hold off defenders, and dominate in physical battles.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-bebas text-2xl text-primary mb-4">POWER</h3>
                <p className="text-muted-foreground">
                  Develop the explosive power needed for sprints, jumps, and powerful strikes. Turn strength into match-winning moments.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-bebas text-2xl text-primary mb-4">SPEED</h3>
                <p className="text-muted-foreground">
                  Improve acceleration, top speed, and agility with specialized training. Beat defenders and create space with elite-level pace.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Options Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              OPTIONS
            </h2>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_d987884d5fc74a6db332baecdf26cec5~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_d987884d5fc74a6db332baecdf26cec5~mv2.png"
                  alt="S&C Training"
                  className="w-full aspect-square object-cover bg-background"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Strength & Conditioning Training</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_7dc31f57fd654cc3a293f7ab6506c3ea~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_7dc31f57fd654cc3a293f7ab6506c3ea~mv2.png"
                  alt="S&C Programming"
                  className="w-full aspect-square object-cover bg-background"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Strength & Conditioning Programming</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Full Package Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-8 tracking-widest">
              THE FULL PACKAGE
            </h2>
            
            <p className="text-muted-foreground text-center max-w-4xl mx-auto mb-12 leading-relaxed">
              The ultimate level of service to help you take your game to the next level. Our larger programs offer a comprehensive range of individualised services. Work on multiple aspects of your performance and improve effectively both in and out of season. These programs offer all of our services and all of our experts. Anything needed at any time for improving performance on the pitch and ensuring long-term development as a player.
            </p>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-background border border-border rounded-lg p-8">
                <h3 className="font-bebas text-2xl text-primary mb-6">PRO PERFORMANCE PROGRAMME</h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li>- Nutrition Programming</li>
                  <li>- Strength, Power & Speed Programming</li>
                  <li>- Conditioning Programming</li>
                  <li>- Technical Programming</li>
                </ul>
                <LocalizedLink to="/services/pro-performance">
                  <Button variant="outline" className="font-bebas tracking-wider">
                    Find out more
                  </Button>
                </LocalizedLink>
              </div>
              
              <div className="bg-background border border-primary rounded-lg p-8">
                <h3 className="font-bebas text-2xl text-primary mb-6">ELITE PERFORMANCE PROGRAMME</h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li>- Nutrition Programming</li>
                  <li>- Strength, Power & Speed Programming</li>
                  <li>- Conditioning Programming</li>
                  <li>- Technical Programming</li>
                  <li>- Pre-Match Opposition Analysis</li>
                  <li>- Post-Match Performance Analysis</li>
                  <li>- Mental Skill Sessions</li>
                  <li>- Mental Will Sessions</li>
                  <li>- Player Efficiency Reports</li>
                  <li>- Mentorship</li>
                  <li>- Recovery, Mobility & Injury Prevention</li>
                </ul>
                <LocalizedLink to="/services/elite-performance">
                  <Button className="font-bebas tracking-wider">
                    Find out more
                  </Button>
                </LocalizedLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StrengthPowerSpeed;
