import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";

const Tactical = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-8">
          <div className="container mx-auto text-center">
            <p className="font-bebas text-2xl text-muted-foreground tracking-widest mb-4">
              TACTICAL
            </p>
            <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl text-foreground mb-8">
              SEE THE GAME<br />
              BEFORE IT HAPPENS
            </h1>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-8 bg-card/30">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_3cb0b27e76454bdea2d63ff66acfddfa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Positioning.png"
                  alt="Positioning"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">POSITIONING</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_34064a3af1fb4cda857abb786edea7ae~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Movement.png"
                  alt="Movement"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">MOVEMENT</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_4f2f0e863b8949f19d464230d2ce0910~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Decision-Making.png"
                  alt="Decision-Making"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">DECISION-MAKING</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_41d76a61f7a8411a8c48c65b0b350c64~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Vision%20(1).png"
                  alt="Vision"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">VISION</span>
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
                  <span className="font-bebas text-lg text-foreground">Formation</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">Positional</span>
                </div>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  Understanding the tactical dimensions of football separates good players from great ones. While physical attributes and technical skills are essential, the ability to read the game, anticipate movements, and make split-second decisions elevates your performance to another level.
                </p>
                <p className="leading-relaxed">
                  Our tactical training focuses on developing your football intelligence - the ability to see patterns, understand positional responsibilities, and exploit spaces before they even appear. Whether you're looking to master your role within a specific formation or understand how to adapt to different tactical systems, our expert analysts provide the insights you need.
                </p>
                <p className="leading-relaxed">
                  Through detailed video analysis and personalised coaching sessions, we break down the complexities of modern football tactics into actionable knowledge. You'll learn to anticipate opposition movements, understand when to hold position versus when to break lines, and develop the spatial awareness that defines elite players.
                </p>
                <p className="leading-relaxed">
                  Our positional guides go beyond generic advice - they're tailored to your specific position and playing style, incorporating examples from the best players in the world to illustrate advanced concepts in an accessible way.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Areas Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              KEY AREAS
            </h2>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="font-bebas text-2xl text-primary mb-4">POSITIONAL UNDERSTANDING</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Master your role within different formations and tactical systems. Understand when to hold your position, when to push forward, and when to cover for teammates.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- Defensive responsibilities</li>
                  <li>- Attacking movements</li>
                  <li>- Transition play</li>
                  <li>- Set piece positioning</li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="font-bebas text-2xl text-primary mb-4">GAME READING</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Develop the ability to anticipate play before it happens. Learn to recognise patterns, identify opportunities, and make better decisions under pressure.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- Pattern recognition</li>
                  <li>- Space identification</li>
                  <li>- Opposition analysis</li>
                  <li>- In-game adaptations</li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="font-bebas text-2xl text-primary mb-4">FORMATION TACTICS</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Understand the strengths and weaknesses of different formations and how to maximise your impact within each system.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- 4-3-3 principles</li>
                  <li>- 4-4-2 dynamics</li>
                  <li>- 3-5-2 variations</li>
                  <li>- Hybrid formations</li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="font-bebas text-2xl text-primary mb-4">MATCH PREPARATION</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Prepare for opponents with detailed pre-match analysis that highlights their weaknesses and gives you the tactical edge.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- Opposition weaknesses</li>
                  <li>- Key matchup analysis</li>
                  <li>- Tactical triggers</li>
                  <li>- Game plan development</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              TACTICAL SERVICES
            </h2>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <div className="p-8">
                  <h3 className="font-bebas text-2xl text-foreground mb-4">Pre-Match Opposition Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Detailed breakdown of upcoming opponents, focusing on their patterns of play, weaknesses to exploit, and your specific matchups.
                  </p>
                  <p className="font-bebas text-xl text-primary mb-4">From £85.00</p>
                  <LocalizedLink to="/services/analysis">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      Learn More
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <div className="p-8">
                  <h3 className="font-bebas text-2xl text-foreground mb-4">Positional Guide</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Bespoke analysis pieces using examples from elite players to explain advanced tactical concepts specific to your position.
                  </p>
                  <p className="font-bebas text-xl text-primary mb-4">From £85.00</p>
                  <LocalizedLink to="/services/analysis">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      Learn More
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Full Package Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-8 tracking-widest">
              THE FULL PACKAGE
            </h2>
            
            <p className="text-muted-foreground text-center max-w-4xl mx-auto mb-12 leading-relaxed">
              The ultimate level of service to help you take your game to the next level. Our larger programs offer a comprehensive range of individualised services. Work on multiple aspects of your performance and improve effectively both in and out of season. These programs offer all of our services and all of our experts.
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

export default Tactical;
