import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";

const Technical = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-8">
          <div className="container mx-auto text-center">
            <p className="font-bebas text-2xl text-muted-foreground tracking-widest mb-4">
              TECHNICAL
            </p>
            <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl text-foreground mb-8">
              CONTROL THE BALL.<br />
              CONTROL THE GAME.
            </h1>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-8 bg-card/30">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_fa44f917083b4628bdadc5a271e841f8~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Receiving%20(1).png"
                  alt="Receiving"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">RECEIVING</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_0f23f93ab7f54ed4a8bd8fa19a26271f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Passing.png"
                  alt="Passing"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">PASSING</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_2669a5c5489d46eb8d08d0c4a00a2c23~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dribbling.png"
                  alt="Dribbling"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">DRIBBLING</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_6424db6835ec4e968f7d1b5c317cc4fa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Finishing.png"
                  alt="Finishing"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">FINISHING</span>
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
                  Technical aspects are the cornerstone of a player's game. Ball mastery can mean the difference between a missed opportunity and a spectacular goal, a fumbled pass and a game-changing assist. Our tailored technical training services are dedicated to honing your control over the ball and creating the ability to play precise passes, dribble, cut at speed, and finish with high accuracy.
                </p>
                <p className="leading-relaxed">
                  Players are quick to acknowledge the need for expert coaching when it comes to the physical aspects of the game - both primary (strength, power, speed, conditioning) and secondary (nutrition). When it comes to technical aspects of play, however, there is a tendency to assume it can be done to the highest level by oneself. Some might stumble upon great training, but there are well-understood, reliable evidence-based approaches and methods of training which most players will miss out on. These are what our experts use within technical sessions and programs.
                </p>
                <p className="leading-relaxed">
                  Our individualised training sessions are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact.
                </p>
                <p className="leading-relaxed">
                  Unlike 1 to 1 sessions they may have seen online, our analysts break your game down in detail before training to key in on the details that actually matter for improving. We mainly work through workshops: for understanding new ideas, keying in on areas for development, walking through correct technique and decision-making in high detail. From there, we then work through training: getting plenty of varied repetitions adapting to the specific skills in question.
                </p>
                <p className="leading-relaxed">
                  In-depth programming with a high attention to detail. Programming is individualised to improve the key technical aspects for improving performance on the pitch. Our technical coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations - using your feedback and filmed sets. New phases are programmed to always know exactly what to focus on in the next sessions.
                </p>
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
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_913034088e8646d79d725095677b0b1a~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_913034088e8646d79d725095677b0b1a~mv2.png"
                  alt="Recovery, Injury Prevention & Mobility Programming"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Recovery, Injury Prevention & Mobility Programming</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/e2ec89_74879ef601434395a9d63a2a8888c97a~mv2.jpg/v1/fill/w_386,h_386,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/e2ec89_74879ef601434395a9d63a2a8888c97a~mv2.jpg"
                  alt="Technical Programming"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Technical Programming</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_3572b859d7e04a29a183836a276c0028~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_3572b859d7e04a29a183836a276c0028~mv2.png"
                  alt="Technical Training"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Technical Training</h3>
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

        {/* More Than Cones Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-8 tracking-widest">
              MORE THAN CONES
            </h2>
            
            <p className="text-muted-foreground text-center max-w-4xl mx-auto mb-12 leading-relaxed">
              Our technical sessions take a scientific approach to developing technical skills and include ideas such as:
            </p>
            
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Training paradigms (behaviourism, cognitivism, constructivism)",
                "CARDS",
                "Embodied cognition",
                "Game realism",
                "Ventral and Dorsal processing",
                "Non-cognitive processing",
                "Stability bias",
                "Problem-creating",
                "Learning-rich environments",
                "Constraints-based approaches",
                "Dynamic practice",
                "Perception-action coupling",
                "Perceptual-motor landscape",
                "Degeneracy",
                "Structure variability"
              ].map((concept, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-4 text-center">
                  <span className="text-sm text-muted-foreground">{concept}</span>
                </div>
              ))}
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

export default Technical;
