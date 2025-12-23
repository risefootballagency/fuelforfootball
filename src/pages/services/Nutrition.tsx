import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";

const Nutrition = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-8">
          <div className="container mx-auto text-center">
            <p className="font-bebas text-2xl text-muted-foreground tracking-widest mb-4">
              NUTRITION
            </p>
            <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl text-foreground mb-4">
              TO GET THE MOST OUT OF YOURSELF
            </h1>
            <h2 className="font-bebas text-3xl md:text-5xl lg:text-6xl text-primary mb-8">
              FUELLING PROPERLY IS A MUST
            </h2>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-card/30">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_35ba4b19866d441e9c3da513d8efacc5~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design%20-%202024-07-13T172110_edited.png"
                  alt="Run Further"
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="font-bebas text-xl text-primary mb-2">RUN FURTHER</h3>
                <p className="text-sm text-muted-foreground">
                  Proper nutrition has shown to directly impact your performance on the pitch. Studies have shown that fuelling optimally can lead to a 24% improvement in time to fatigue, meaning that not only can you run for longer, but also stay sharp on the ball.
                </p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_7dc31f57fd654cc3a293f7ab6506c3ea~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Run%20Faster.png"
                  alt="Run Faster"
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="font-bebas text-xl text-primary mb-2">RUN FASTER</h3>
                <p className="text-sm text-muted-foreground">
                  Evidence also shows increased ability to repeatedly sprint at high speeds over 90 minutes when fuelling adequately.
                </p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_ff6b2e4a13724662b03a6fd53f6d15a6~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Refuel.png"
                  alt="Recover Faster"
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="font-bebas text-xl text-primary mb-2">RECOVER FASTER</h3>
                <p className="text-sm text-muted-foreground">
                  Without optimal nutrition, you are leaving training adaptation behind. Being able to speed up recovery through nutrition can lead to greater potential adaptations in the gym and training as it reduces the likelihood of overtraining or under recovering.
                </p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_0a8b3336bde3432d83faaecba7673780~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Prevent%20Injuries.png"
                  alt="Prevent Injuries"
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="font-bebas text-xl text-primary mb-2">PREVENT INJURIES</h3>
                <p className="text-sm text-muted-foreground">
                  High levels of training without a good recovery strategy can lead to overtraining and overuse injuries. Nutrition plays a vital role in your recovery but can also play roles in injury prevention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* In Detail Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              IN DETAIL
            </h2>
            
            <div className="max-w-5xl mx-auto">
              {/* Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-card border border-primary rounded-lg p-4 text-center">
                  <span className="font-bebas text-lg text-primary">Overview</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">Review</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">Programming</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">Recipes</span>
                </div>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  To unlock your full potential on the pitch, nutrition is key. Our bespoke nutrition services give you the edge over the competition, ensuring you get the most out of every training session and match. Whether you are looking to optimise your match day preparation, change your body composition, or improve your health, our plans will help you achieve your goals.
                </p>
                <p className="leading-relaxed">
                  Just as you would not run a car with the wrong fuel, your body needs the right nutrients for optimal physical performance. Planning nutritional intake throughout the year can be challenging, with many factors to consider for both performance and development. Our expertise removes the guesswork by implementing tried and trusted strategies, creating personalised programs tailored to your needs. By following our plans, you ensure optimal nutrition throughout the season for peak match day performance and long-term development. This includes full daily 1:1 support from our team nutritionist, guiding you on an educational journey through football nutrition science and understanding your body.
                </p>
                <p className="leading-relaxed">
                  Given nutrition's importance for physical, psychological, and technical performance, as well as its role in recovery and injury prevention, it is imperative you maintain an adequate diet that contains the right amount of each key nutrient. Our Nutrition Review offers a comprehensive snapshot of your current dietary habits, providing specific recommendations and improvements that can be made.
                </p>
                <p className="leading-relaxed">
                  Considering many physiological factors, we can create personalised nutrition programming which is specific to your needs. By following the programme, you can ensure optimal nutrition throughout the season or off-season and build for long-term development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Options Section */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              OPTIONS
            </h2>
            
            {/* Features Grid */}
            <div className="max-w-4xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
              {[
                "Comprehensive Nutritional Analysis",
                "Daily Support",
                "1:1 Coaching",
                "In-Depth Programming",
                "Monitoring",
                "Tailored Recipes"
              ].map((feature, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-3 text-center">
                  <span className="text-xs text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_a08f374420154bd881dd65c67a18eae3~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_a08f374420154bd881dd65c67a18eae3~mv2.png"
                  alt="Nutrition Review"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Nutrition Review</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_2cf2ae92e59c4ae9a8dcffc79ea5fca9~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2cf2ae92e59c4ae9a8dcffc79ea5fca9~mv2.png"
                  alt="Nutrition Programming"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Nutrition Programming</h3>
                  <LocalizedLink to="/contact">
                    <Button variant="outline" className="w-full font-bebas tracking-wider">
                      See Options
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_8c340cc141d4403896766ed99062189d~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_8c340cc141d4403896766ed99062189d~mv2.png"
                  alt="Nutrition Programming & Recipes"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bebas text-xl text-foreground mb-2">Nutrition Programming & Recipes</h3>
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

export default Nutrition;
