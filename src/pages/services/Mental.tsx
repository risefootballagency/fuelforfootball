import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";

const Mental = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-8">
          <div className="container mx-auto px-4 text-center">
            <p className="font-bebas text-2xl text-muted-foreground tracking-widest mb-4">
              PSYCHOLOGICAL PERFORMANCE
            </p>
            <h2 className="font-bebas text-3xl md:text-4xl text-primary mb-4">
              SKILL + WILL = SUCCESS
            </h2>
            <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl text-foreground mb-8">
              FOOTBALL IS NOT SOLELY ABOUT SKILL<br />
              THE FINE MARGINS ARE DECIDED BY WILL
            </h1>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-8 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_b59f5998d4e44151801f114235ddc357~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Consistency%20(1).png"
                  alt="Consistency"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">CONSISTENCY</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_6fd3b0e42de84e569be9f98ae5c93220~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Focus.png"
                  alt="Focus"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">FOCUS</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_7449783a3dd94797974af0a97b3145f7~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Resilience.png"
                  alt="Resilience"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">RESILIENCE</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_ce1710f714314eebba935e461609756b~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Confidence.png"
                  alt="Confidence"
                  className="w-20 h-20"
                />
                <span className="font-bebas text-lg tracking-wider text-foreground">CONFIDENCE</span>
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
                  <span className="font-bebas text-lg text-foreground">Mental Skills</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">Mental Will</span>
                </div>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  It is the combination of skill and will which decides every victor. It does not matter how great a player you are if you suffer mental defeat to an opponent. Mastering your mind and possessing mental strength plays a pivotal role in Football. Our bespoke psychological support services aim to fortify your mind, empowering you to take on increasingly great challenges, manage pressure, and perform consistently at your highest level.
                </p>
                <p className="leading-relaxed">
                  Whether you are battling performance anxiety, seeking to boost your mental resilience, or striving to enhance your concentration during high-stakes moments, our tailored and individualised 1:1 training will help you secure the mental edge over your competition. With Fuel for Football, you win the game with your mind, to in turn win on the pitch.
                </p>
                <p className="leading-relaxed">
                  Mental skills are the foundation upon which all other abilities depend. Consistency on the pitch requires strong mental skills, a fact recognised by Sir Alex Ferguson as key to prolonged elite performance. Our Mental Skill Training focuses on developing consistency, confidence, resilience, and focus, all while maintaining complete confidentiality, most importantly including from your club's personnel.
                </p>
                <p className="leading-relaxed">
                  We start by testing your mental skill level and comparing it to other elite athletes we have trained. Based on this assessment, we create bespoke individualised sessions tailored to your needs. These one-to-one sessions can be conducted in person or over the phone, ensuring you receive the personalised support necessary to strengthen your mental game.
                </p>
                <p className="leading-relaxed">
                  The difference between players of similar ability often lies in their mental will. With greater will than an opponent, it is possible to outperform them even with less skill. Mental will is developed like any muscle in the gym, through training. Mental will speaks to drive and determination. If you want something more than an opponent, it is often enough to overcome any skill deficit. This service is perfect for booking in before games to prepare the mind for action and to have the greatest performance possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Options Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              OPTIONS
            </h2>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_ec7282c95805482aaf5d9909b260c8ee~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_ec7282c95805482aaf5d9909b260c8ee~mv2.png"
                  alt="Fuelled Elite Coaching"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Fuelled Elite Coaching</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_f85124e6d69542e4b4329bacafb454a3~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_f85124e6d69542e4b4329bacafb454a3~mv2.png"
                  alt="Psychological Development"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Psychological Development</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_121be4d22e6244d48dd94cacbf7bcf8c~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_121be4d22e6244d48dd94cacbf7bcf8c~mv2.png"
                  alt="Psychological Performance"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Psychological Performance</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
            </div>
            
            {/* Performance & Development Details */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-background border border-border rounded-lg p-8">
                <h3 className="font-bebas text-2xl text-primary mb-2">Performance</h3>
                <p className="text-sm text-muted-foreground mb-4">(Mental Will Training)</p>
                <p className="text-muted-foreground leading-relaxed">
                  Our psychological performance sessions provide tailored support by providing players with Mental Will training and Mindset Conditioning. Through performance reviews, players receive the support they need from game to game to develop their mental strength and increase consistency within their performance on and off the pitch.
                </p>
              </div>
              
              <div className="bg-background border border-border rounded-lg p-8">
                <h3 className="font-bebas text-2xl text-primary mb-2">Development</h3>
                <p className="text-sm text-muted-foreground mb-4">(Mental Skill Training)</p>
                <p className="text-muted-foreground leading-relaxed">
                  Psychological development is crucial for success. Mental skills sessions will help you improve your long-term psychological performance. By focusing on mental skills such as visualisation, goal-setting, and self-talk, you will develop the mental toughness and resilience needed to succeed at the highest level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Podcast Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              PODCAST
            </h2>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-center">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_35ba4b19866d441e9c3da513d8efacc5~mv2.png/v1/fill/w_258,h_257,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design%20-%202024-07-13T172110_edited.png"
                  alt="Fuel For Football Podcast"
                  className="w-48 h-48 rounded-lg mb-6"
                />
                <h3 className="font-bebas text-2xl text-foreground mb-2">Fuel For Football</h3>
                <p className="font-bebas text-xl text-primary">Podcast</p>
              </div>
              
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Your host, sport psychologist Sanchez Bailey, provides psychological lessons for professional footballers from the heights of the Premier League right down to the grassroots level!
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://open.spotify.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-[#1DB954] text-white font-bebas tracking-wider rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Spotify
                  </a>
                  <a 
                    href="https://podcasts.apple.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-gradient-to-r from-[#9933FF] to-[#FC5C7D] text-white font-bebas tracking-wider rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Apple Podcast
                  </a>
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
                <LocalizedLink to="/contact">
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
                <LocalizedLink to="/contact">
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

export default Mental;