import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";

const Conditioning = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-8">
          <div className="container mx-auto text-center">
            <p className="font-bebas text-2xl text-muted-foreground tracking-widest mb-4">
              CONDITIONING
            </p>
            <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl text-foreground mb-8">
              THE CAPACITY TO<br />
              COVER EVERY BLADE.
            </h1>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-8 bg-card/30">
          <div className="container mx-auto">
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_9abe95cacd094c49b255413bb49ae654~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Anaerobic.png"
                  alt="Anaerobic"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">ANAEROBIC</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_0817c68868ac432c9cdb4be011a328cc~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Aerobic.png"
                  alt="Aerobic"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">AEROBIC</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_674e777eccd9459f8cacf5a826cba219~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Muscular%20Endurance.png"
                  alt="Muscular Endurance"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">MUSCULAR</span>
              </div>
            </div>
          </div>
        </section>

        {/* In Detail Section */}
        <section className="py-16 relative bg-card/30">
          <div className="container mx-auto relative z-10">
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
                  Conditioning is an essential aspect of football, often making the difference between victory and defeat in the final minutes of the game. A well-conditioned player can keep their pace, power, and precision long after others have faded. Our conditioning services are designed to ensure that you remain at peak performance, from the first whistle to the last. Not only this, but in improving your capacity, we extend your ability to sustain performance during training and matches, increasing the workload you can put yourself through. This leads to growth on the pitch which is hard to believe.
                </p>
                <p className="leading-relaxed">
                  There are so many factors to be considered when training to improve endurance: ATP, pH, muscles, substrates, blood-glucose, circulation, and respiration; only some of the determinants of how well-conditioned a player will appear. A player trying to learn and understand each of these at the level of a scientist is difficult, and the far quicker and easier method to improve here is enlisting a conditioning expert.
                </p>
                <p className="leading-relaxed">
                  Our players are typically the fittest in their clubs, consistently available, and rarely injured due to our tailored conditioning training. These sessions are designed to fit your specific needs, pushing your capacity to new limits, in turn reducing injury incidence and maximising your on-pitch impact.
                </p>
                <p className="leading-relaxed">
                  For new players, we start with an assessment to identify key physical development goals, ensuring each session is designed to achieve the greatest performance improvements.
                </p>
                <p className="leading-relaxed italic">
                  Please note that this service is only available to players in England.
                </p>
                <p className="leading-relaxed">
                  As football is an intermittent sport with multiple different playing positions that each have different needs, following the right type of training program is vital. Beyond that, ensuring that training matches the different type of energy system used predominantly in your position on the pitch is an absolute must.
                </p>
                <p className="leading-relaxed">
                  To do this, we go through a specific needs-analysis and then the relevant fitness testing to determine what your training priorities should be. You then receive the initial training program to help become the fittest player you can be. Full support from our team throughout the programming is also ensured to maximise the results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sharpen Your Blade Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              SHARPEN YOUR BLADE
            </h2>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Obtain your fully tailored training plan based on analysis and testing results. Absorb from the continuous support ensuring maximum results throughout your programming journey.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground leading-relaxed">
                  We identify and prioritise training the energy systems predominantly used in your position to optimise performance.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground leading-relaxed">
                  We conduct a specific-needs analysis and fitness testing to determine training priorities.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground leading-relaxed">
                  We support you in understanding the key factors influencing endurance in football, such as ATP, pH, Blood-glucose, Respiration and much more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Programming Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              PROGRAMMING
            </h2>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground">Bespoke conditioning drills with position-specific and individualised work ratios.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground">Periodisation to ensure progression and avoid overtraining.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground">Monitoring of performance metrics to track progress and adjust the programme.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground">Choose from in-person training or extended programming.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground">Monthly review and redesign of programming around club schedule and personal load.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground">24/7 support with training, including new cues, targets and feedback.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Options Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto relative z-10">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              OPTIONS
            </h2>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_017fa5479b0149dc8131970689d6d548~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_017fa5479b0149dc8131970689d6d548~mv2.png"
                  alt="Conditioning Training"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Conditioning Training</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_ff883ecdb84447798addc2bef1be7c2b~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_ff883ecdb84447798addc2bef1be7c2b~mv2.png"
                  alt="Conditioning Programming"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Conditioning Programming</h3>
                  <p className="font-bebas text-lg text-primary mb-4">From £200.00</p>
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
          <div className="container mx-auto">
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

export default Conditioning;
