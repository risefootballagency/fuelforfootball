import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, Users, Target, TrendingUp, ChevronRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";

const Analysis = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: Target, label: "POSITIONING" },
    { icon: Users, label: "MOVEMENT" },
    { icon: Eye, label: "DECISION-MAKING" },
    { icon: TrendingUp, label: "VISION" },
  ];

  const services = [
    {
      id: "pre-match",
      title: "Pre-Match Opposition Analysis",
      tagline: "SEE THE GAME BEFORE IT HAPPENS",
      benefits: [
        { highlight: "FEEL PREPARED", text: "going into any game" },
        { highlight: "READ AHEAD OF PLAY", text: "more easily" },
        { highlight: "KNOW YOUR MATCHUP'S", text: "weaknesses" },
      ],
      description: "Pre-match opposition analysis is delivered to our players at the start of the match week, giving time to absorb the information and use it in preparation. Unlike the analysis delivered at club-level, we focus in much greater detail on what is important to you for a strong individual performance. With a breakdown of the opposition scheme, we allow you to know which options are likely to be free at which times, improving decision-making. Alongside broader patterns of play and how to respond to them both defensively and offensively, we also focus on your individual matchups to exploit their weaknesses and prevent them successfully applying their strengths.",
      price: "From £85.00",
    },
    {
      id: "post-match",
      title: "Post-Match Analysis",
      tagline: "THE FASTEST WAY TO IMPROVING IN MATCHES",
      benefits: [
        { highlight: "SEE THE GAME", text: "through experienced eyes" },
        { highlight: "THE FASTEST WAY", text: "to improving in matches" },
        { highlight: "IT IS NOT WHAT YOU LOOK AT", text: "it is what you see" },
      ],
      description: "In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses. Although highly critical, even with our Premier League level players, the detail in our analysis will make vast improvements to your game when applied. Rather than only pointing out mistakes, we ensure that you understand exactly how to improve through our expert technical breakdowns. Post-matches are sent prior to the following game, giving time to digest and apply the new ideas early.",
      price: "From £85.00",
    },
    {
      id: "positional-guide",
      title: "Positional Guide",
      tagline: "SEE THE GAME DIFFERENTLY",
      benefits: [
        { highlight: "BREAK DOWN", text: "any concept at a higher level" },
        { highlight: "EASILY ACCESS", text: "solutions to the problems you face" },
        { highlight: "SEE THE GAME", text: "differently" },
      ],
      description: "Positional guide pieces utilise the best players in the world to explain advanced tactical ideas, allowing you to see the game through a more intellectual lens. No matter the concept, we break down everything important to learn and apply in a simple format so that you can apply your learnings out on the pitch. The beauty of a positional guide is that we write every analysis piece from scratch, directly from your specification.",
      price: "From £85.00",
    },
    {
      id: "player-efficiency",
      title: "Player Efficiency Report",
      tagline: "MEASURE YOUR PROGRESS",
      benefits: [
        { highlight: "EARN NEW CONTRACTS", text: "and club interest" },
        { highlight: "EVALUATE PERFORMANCE", text: "more objectively" },
        { highlight: "MEASURE", text: "progress" },
      ],
      description: "The Player Efficiency Report has its primary objective to provide a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. In addition to presenting the data, the report also includes a detailed plan for improving performance, highlighting areas of strength and suggesting pathways for progress.",
      price: "From £95.00",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="font-bebas text-5xl md:text-8xl text-primary text-center mb-4">
              ANALYSIS
            </h1>
            <p className="font-bebas text-2xl md:text-4xl text-center text-foreground mb-12">
              <span className="text-primary">SEE THE GAME</span> BEFORE IT HAPPENS
            </p>
            
            {/* Pillars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {pillars.map((pillar, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg bg-card/50 border border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <pillar.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="font-bebas text-sm tracking-wider text-foreground">{pillar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Sections */}
        {services.map((service, index) => (
          <section 
            key={service.id}
            className={`py-16 ${index % 2 === 0 ? 'bg-card/30' : 'bg-background'}`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="font-bebas text-3xl md:text-5xl text-primary mb-2 text-center">
                  {service.title}
                </h2>
                <p className="font-bebas text-xl md:text-2xl text-foreground/80 text-center mb-8">
                  {service.tagline}
                </p>
                
                {/* Benefits */}
                <div className="space-y-3 mb-8 max-w-2xl mx-auto">
                  {service.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
                      <p className="text-lg">
                        <span className="text-primary font-semibold">{benefit.highlight}</span>
                        <span className="text-muted-foreground"> {benefit.text}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto text-center mb-8">
                  {service.description}
                </p>

                {/* CTA */}
                <div className="text-center">
                  <p className="text-primary font-bebas text-xl mb-4">{service.price}</p>
                  <LocalizedLink to="/contact">
                    <Button className="font-bebas tracking-wider">
                      REQUEST A QUOTE
                    </Button>
                  </LocalizedLink>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* In Detail Section */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="font-bebas text-4xl md:text-6xl text-primary text-center mb-12">
              IN DETAIL
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-background/50 border border-border rounded-lg p-6">
                <h3 className="font-bebas text-2xl text-primary mb-4">Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The difference between a good player and a great player often lies in the depth of their game understanding. With our bespoke analysis services, we help you unlock new layers of your performance and rise above your competition.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The best athletes in the world invest significant time in performance analysis. It is not solely about enhancing tactical development - it is about uncovering insights into technical, physical, and psychological performance. These insights can transform your decision-making, your positional awareness, and your ability to adapt in real-time to the ever-changing dynamics of a game.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Our expert analysts employ expert coaching techniques and tools, dissecting your gameplay to provide an in-depth understanding of your strengths and areas to improve. Unlike team analysis, we are able to go deep into detail on your individual role within the team.
                </p>
              </div>

              <div className="bg-background/50 border border-border rounded-lg p-6">
                <h3 className="font-bebas text-2xl text-primary mb-4">Pre-Match</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our pre-match opposition analysis provides a competitive edge by examining the opposing team's tactics and formations before an upcoming game. We focus on their defensive and offensive patterns, directly relating to your position and tactics, to enhance your decision-making during the match.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Delivered at the start of the match week, our analysis allows you ample time to absorb and apply the information in your preparation. Unlike club-level analysis, we provide detailed insights tailored to your individual performance.
                </p>
              </div>

              <div className="bg-background/50 border border-border rounded-lg p-6">
                <h3 className="font-bebas text-2xl text-primary mb-4">Post-Match</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In post-match analysis, we focus on the strengths and areas for improvement, highlighting key moments that illustrate both. The key aim of our analysis is to offer specific advice around further integrating strengths, and developing the areas for improvement.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Post-match analysis is delivered in the days after the game, for the fastest download of information, allowing you to apply improvements into training and matches. Each analysis includes an extended PDF as well as annotated video with optional voiceover.
                </p>
              </div>

              <div className="bg-background/50 border border-border rounded-lg p-6">
                <h3 className="font-bebas text-2xl text-primary mb-4">Positional Guide</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A tactical positional guide is a valuable resource for players who want to enhance their performance on the field. It provides detailed information about the player's specific position and formation, enabling them to gain a better understanding of their role and how to optimise their impact.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  It is a comprehensive view into the decisions and execution of the best players in any position, formation or team. While it covers advanced topics that are typically exclusive to the players of great managers including Marcelo Bielsa or Pep Guardiola, it is written in an easily digestible format.
                </p>
              </div>

              <div className="bg-background/50 border border-border rounded-lg p-6">
                <h3 className="font-bebas text-2xl text-primary mb-4">Player Efficiency Report</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Most football clubs are data-driven, recruiting based on statistics. Our Player Efficiency Report offers a comprehensive analysis of your performance, improving on-pitch results in ways that show up on the data sheet, attracting greater interest from teams.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  It is a data-backed evaluation of a player's current levels of performance as compared to their team, league and impact on games. It can be used by players searching for a transfer as evidence of their performance level, or by players looking to develop their game.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-bebas text-3xl md:text-5xl text-foreground mb-4">
              Ready to <span className="text-primary">elevate your game</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Get in touch to discuss which analysis service is right for you and take the first step towards seeing the game differently.
            </p>
            <LocalizedLink to="/contact">
              <Button size="lg" className="font-bebas tracking-wider text-lg px-8">
                REQUEST A QUOTE
              </Button>
            </LocalizedLink>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Analysis;
