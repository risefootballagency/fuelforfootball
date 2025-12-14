import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { GrassBackground } from "@/components/GrassBackground";

const StrengthPowerSpeed = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Grass Top */}
        <div className="pt-20">
          <GrassBackground variant="top" />
        </div>
        {/* Hero Section */}
        <section className="relative pt-24 pb-8">
          <div className="container mx-auto px-4 text-center">
            <p className="font-bebas text-2xl text-muted-foreground tracking-widest mb-4">
              STRENGTH, POWER & SPEED
            </p>
            <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl text-foreground mb-8">
              RUN LIKE A SPORTS CAR<br />
              NOT A HATCHBACK
            </h1>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-8 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_eb6331e862704a6baeacf4dc65adde63~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Strength.png"
                  alt="Strength"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">STRENGTH</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_cf1cef6b92e74e1fb999c2e3739d2d6c~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Power.png"
                  alt="Power"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">POWER</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_a6cdb923e09d4ac4aec19e0302bdc01f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Speed.png"
                  alt="Speed"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">SPEED</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_0f1a80188cda42339edc21be4fb126d6~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Agility.png"
                  alt="Agility"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">AGILITY</span>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <GrassBackground variant="divider" />

        {/* In Detail Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 z-0" style={{
            backgroundImage: `url('https://static.wixstatic.com/media/c4f4b1_ecb5f8902dc448c4ae5f0739b810bd7b~mv2.png/v1/fill/w_1904,h_400,al_c,q_90,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_ecb5f8902dc448c4ae5f0739b810bd7b~mv2.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          <div className="container mx-auto px-4 relative z-10">
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
                  Strength, power and speed are ever increasingly key components in the modern game, yet are often overlooked, or poorly trained, throughout the football world. Alike buying a car, we do not consider solely the size of the fuel tank, but more so the miles per gallon, speed, acceleration and physical output of the engine. It is the same with football, however, power and speed, often do not get the correct attention. Training is available anywhere in England, and also in Wales and Scotland upon special request.
                </p>
                <p className="leading-relaxed">
                  Our individualised training sessions and programs are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact.
                </p>
                <p className="leading-relaxed">
                  In-depth programming with a high attention to detail. With a new player, we test first and organise the key goals for physical development. Programming is individualised with these in mind to make the greatest impact to performance. Our SPS coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations. New phases are programmed to always know exactly what to focus on in the next sessions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <GrassBackground variant="divider" />

        {/* Training Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 z-0" style={{
            backgroundImage: `url('https://static.wixstatic.com/media/c4f4b1_8bec300b742b42df84829849d26331f1~mv2.jpg/v1/fill/w_1904,h_800,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_8bec300b742b42df84829849d26331f1~mv2.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }} />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              TRAINING
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png"
                  alt="Strength, Power & Speed Training"
                  className="w-full max-w-md mx-auto aspect-square object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="font-bebas text-2xl text-foreground mb-2">Strength, Power & Speed Training</h3>
                  <p className="font-bebas text-xl text-primary mb-4">From £120.00</p>
                  <LocalizedLink to="/contact">
                    <Button className="font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <GrassBackground variant="divider" />

        {/* Programming Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              PROGRAMMING
            </h2>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_a6c9eb3e990c426385f9e145c4eec75c~mv2.png/v1/fill/w_600,h_339,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/e_g_.png"
                  alt="Programming Example"
                  className="rounded-lg w-full"
                />
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p>In-person training sessions for UK players and remote support for those abroad via FaceTime.</p>
                <p>Tailored components based on position and physical capabilities, maximising the player's threshold.</p>
                <p>Our program is available in 6 or 12-month programming, adjusted to your club and individual schedule, season, and other factors affecting your training.</p>
                
                <div className="py-4">
                  <h3 className="font-bebas text-xl text-primary mb-4">
                    REDUCE THE RISK OF INJURY • TURN EVERY 50:50 IN YOUR FAVOUR • DEVELOP FASTER
                  </h3>
                </div>
                
                <LocalizedLink to="/contact">
                  <Button variant="outline" className="font-bebas tracking-wider">
                    SEE EXAMPLE
                  </Button>
                </LocalizedLink>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <GrassBackground variant="divider" />

        {/* Options Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 z-0" style={{
            backgroundImage: `url('https://static.wixstatic.com/media/c4f4b1_8bec300b742b42df84829849d26331f1~mv2.jpg/v1/fill/w_1904,h_800,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_8bec300b742b42df84829849d26331f1~mv2.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }} />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              OPTIONS
            </h2>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png"
                  alt="Strength, Power & Speed Programming"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Strength, Power & Speed Programming</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png"
                  alt="Strength, Power & Speed Training"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Strength, Power & Speed Training</h3>
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

        {/* Divider */}
        <GrassBackground variant="divider" />

        {/* The Full Package Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-8 tracking-widest">
              THE FULL PACKAGE
            </h2>
            
            <p className="text-muted-foreground text-center max-w-4xl mx-auto mb-12 leading-relaxed">
              The ultimate level of service to help you take your game to the next level. Our larger programs offer a comprehensive range of individualised services. Work on multiple aspects of your performance and improve effectively both in and out of season. These programs offer all of our services and all of our experts. Anything needed at any time for improving performance on the pitch and ensuring long-term development as a player.
            </p>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-8">
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
              
              <div className="bg-card border border-primary rounded-lg p-8">
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
