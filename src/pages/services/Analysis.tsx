import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { GrassBackground } from "@/components/GrassBackground";

const Analysis = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Grass Top */}
        <div className="pt-20">
          <GrassBackground variant="top" />
        </div>

        {/* Hero Section */}
        <section className="relative py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="font-bebas text-2xl text-muted-foreground tracking-widest mb-4">
              ANALYSIS
            </p>
            <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl text-foreground mb-8">
              SEE THE GAME BEFORE IT HAPPENS
            </h1>
          </div>
        </section>

        {/* Divider */}
        <GrassBackground variant="divider" />

        {/* Pillars */}
        <section className="py-8 relative overflow-hidden">
          <div className="absolute inset-0 z-0" style={{
            backgroundImage: `url('https://static.wixstatic.com/media/c4f4b1_8bec300b742b42df84829849d26331f1~mv2.jpg/v1/fill/w_1904,h_400,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_8bec300b742b42df84829849d26331f1~mv2.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
          }} />
          <div className="container mx-auto px-4 relative z-10">
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

        {/* Pre-Match Opposition Analysis */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              PRE-MATCH OPPOSITION ANALYSIS
            </h2>
            
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    READ AHEAD OF PLAY MORE EASILY
                  </h3>
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    KNOW YOUR MATCHUP'S WEAKNESSES
                  </h3>
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    FEEL PREPARED GOING INTO ANY GAME
                  </h3>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  Pre-match opposition analysis is delivered to our players at the start of the match week, giving time to absorb the information and use it in preparation. Unlike the analysis delivered at club-level, we focus in much greater detail on what is important to you for a strong individual performance. With a breakdown of the opposition scheme, we allow you to know which options are likely to be free at which times, improving decision-making. Alongside broader patterns of play and how to respond to them both defensively and offensively, we also focus on your individual matchups to exploit their weaknesses and prevent them successfully applying their strengths.
                </p>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Example Pre-Match Analysis: Slovakia vs England (30/06/24)</p>
                  <p className="font-bebas text-xl text-primary mb-4">From £85.00</p>
                  <LocalizedLink to="/contact">
                    <Button className="font-bebas tracking-wider">REQUEST A QUOTE</Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg/v1/fill/w_940,h_334,q_90,enc_avif,quality_auto/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg"
                  alt="Pre-match analysis example"
                  className="rounded-lg w-full"
                />
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_76a25c0356644727afcfbae3da9165df~mv2.png/v1/fill/w_612,h_334,q_90,enc_avif,quality_auto/c4f4b1_76a25c0356644727afcfbae3da9165df~mv2.png"
                  alt="Pre-match analysis example 2"
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Post-Match Analysis */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              POST-MATCH ANALYSIS
            </h2>
            
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg/v1/fill/w_940,h_334,q_90,enc_avif,quality_auto/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg"
                  alt="Post-match analysis example"
                  className="rounded-lg w-full"
                />
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_aabad9361c374361957951326c7b6634~mv2.png/v1/fill/w_591,h_334,q_90,enc_avif,quality_auto/c4f4b1_aabad9361c374361957951326c7b6634~mv2.png"
                  alt="Post-match analysis example 2"
                  className="rounded-lg w-full"
                />
              </div>
              
              <div className="space-y-6 order-1 lg:order-2">
                <div className="space-y-4">
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    SEE THE GAME THROUGH EXPERIENCED EYES
                  </h3>
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    THE FASTEST WAY TO IMPROVING IN MATCHES
                  </h3>
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    IT IS NOT WHAT YOU LOOK AT, IT IS WHAT YOU SEE
                  </h3>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses. Although highly critical, even with our Premier League level players, the detail in our analysis will make vast improvements to your game when applied. Rather than only pointing out mistakes, we ensure that you understand exactly how to improve through our expert technical breakdowns. Post-matches are sent prior to the following game, giving time to digest and apply the new ideas early.
                </p>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Example Post-Match Analysis: Máté Sajbán vs Debrecen (13/08/23)</p>
                  <p className="font-bebas text-xl text-primary mb-4">From £85.00</p>
                  <LocalizedLink to="/contact">
                    <Button className="font-bebas tracking-wider">REQUEST A QUOTE</Button>
                  </LocalizedLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Positional Guide */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              POSITIONAL GUIDE
            </h2>
            
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    BREAK DOWN ANY CONCEPT AT A HIGHER LEVEL
                  </h3>
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    EASILY ACCESS SOLUTIONS TO THE PROBLEMS YOU FACE
                  </h3>
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    SEE THE GAME DIFFERENTLY
                  </h3>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  Positional guide pieces utilise the best players in the world to explain advanced tactical ideas, allowing you to see the game through a more intellectual lens. No matter the concept, we break down everything important to learn and apply in a simple format so that you can apply your learnings out on the pitch. The beauty of a positional guide is that we write every analysis piece from scratch, directly from your specification. For example, if you are a midfielder struggling to create space to receive, we would first discuss this idea with you to establish your knowledge level, then write the analysis to focus on advanced ideas you are yet to discover. Furthermore, with our expertise, we can discuss even the minutia of the game in extensive detail.
                </p>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Example Positional Guide: Winger Positioning & Movement</p>
                  <p className="font-bebas text-xl text-primary mb-4">From £85.00</p>
                  <LocalizedLink to="/contact">
                    <Button className="font-bebas tracking-wider">REQUEST A QUOTE</Button>
                  </LocalizedLink>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg/v1/fill/w_848,h_334,q_90,enc_avif,quality_auto/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg"
                  alt="Positional guide example"
                  className="rounded-lg w-full"
                />
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_a95a7a590b15494a88dcb0dfe1d6e4b5~mv2.png/v1/fill/w_585,h_334,q_90,enc_avif,quality_auto/c4f4b1_a95a7a590b15494a88dcb0dfe1d6e4b5~mv2.png"
                  alt="Positional guide example 2"
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Player Efficiency Report */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              PLAYER EFFICIENCY REPORT
            </h2>
            
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center gap-4 order-2 lg:order-1">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_170,h_486,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png"
                  alt="Player efficiency report page 1"
                  className="rounded-lg max-h-[400px] object-contain"
                />
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_6133d8c4af914df7b79d69bb05196698~mv2.png/v1/fill/w_170,h_486,q_90,enc_avif,quality_auto/c4f4b1_6133d8c4af914df7b79d69bb05196698~mv2.png"
                  alt="Player efficiency report page 2"
                  className="rounded-lg max-h-[400px] object-contain"
                />
              </div>
              
              <div className="space-y-6 order-1 lg:order-2">
                <div className="space-y-4">
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    EARN NEW CONTRACTS AND CLUB INTEREST
                  </h3>
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    EVALUATE PERFORMANCE MORE OBJECTIVELY
                  </h3>
                  <h3 className="font-bebas text-2xl md:text-3xl text-foreground">
                    MEASURE PROGRESS
                  </h3>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  The Player Efficiency Report has its primary objective to provide a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. In addition to presenting the data, the report also includes a detailed plan for improving performance, highlighting areas of strength and suggesting pathways for progress.
                </p>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Example Player Efficiency Report: Michael Mulligan (23/24)</p>
                  <p className="font-bebas text-xl text-primary mb-4">From £95.00</p>
                  <LocalizedLink to="/contact">
                    <Button className="font-bebas tracking-wider">REQUEST A QUOTE</Button>
                  </LocalizedLink>
                </div>
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                <div className="bg-card border border-primary rounded-lg p-4 text-center">
                  <span className="font-bebas text-lg text-primary">Overview</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">Pre-Match</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">Post-Match</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">Positional Guide</span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="font-bebas text-lg text-foreground">Player Efficiency Report</span>
                </div>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  The difference between a good player and a great player often lies in the depth of their game understanding. With our bespoke analysis services, we help you unlock new layers of your performance and rise above your competition.
                </p>
                <p className="leading-relaxed">
                  The best athletes in the world invest significant time in performance analysis. It is not solely about enhancing tactical development - it is about uncovering insights into technical, physical, and psychological performance. These insights can transform your decision-making, your positional awareness, and your ability to adapt in real-time to the ever-changing dynamics of a game.
                </p>
                <p className="leading-relaxed">
                  Our expert analysts employ expert coaching techniques and tools, dissecting your gameplay to provide an in-depth understanding of your strengths and areas to improve. Unlike team analysis, we are able to go deep into detail on your individual role within the team. Likewise, we analyse opponents with a strong understanding of how your abilities intersect with those of the opposition and potential matchups, allowing you to play to your strengths and avoid the potential for mistakes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Analysis;