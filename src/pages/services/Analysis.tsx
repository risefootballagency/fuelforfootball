import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServicePillars,
  ServiceSectionTitle,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";
import { ArrowRight, Eye } from "lucide-react";

const Analysis = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_3cb0b27e76454bdea2d63ff66acfddfa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Positioning.png", label: "POSITIONING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_34064a3af1fb4cda857abb786edea7ae~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Movement.png", label: "MOVEMENT" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_4f2f0e863b8949f19d464230d2ce0910~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Decision-Making.png", label: "DECISION-MAKING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_41d76a61f7a8411a8c48c65b0b350c64~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Vision%20(1).png", label: "VISION" },
  ];

  const analysisServices = [
    {
      title: "PRE-MATCH OPPOSITION ANALYSIS",
      subtitle: "KNOW YOUR ENEMY",
      features: [
        "Read ahead of play more easily",
        "Know your matchup's weaknesses", 
        "Feel prepared going into any game"
      ],
      description: "Our pre-match opposition analysis provides a competitive edge by examining the opposing team's tactics and formations before an upcoming game. We focus on their defensive and offensive patterns, directly relating to your position and tactics.",
      example: "Example: Slovakia vs England (30/06/24)",
      price: "FROM £85.00",
      productId: "6c369b05-d410-4955-98e6-20a936019079",
      image: "https://static.wixstatic.com/media/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg/v1/fill/w_940,h_334,q_90,enc_avif,quality_auto/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg",
    },
    {
      title: "POST-MATCH ANALYSIS",
      subtitle: "LEARN FROM EVERY PERFORMANCE",
      features: [
        "See the game through experienced eyes",
        "The fastest way to improving in matches",
        "It is not what you look at, it is what you see"
      ],
      description: "In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses. The detail in our analysis will make vast improvements to your game when applied.",
      example: "Example: Máté Sajbán vs Debrecen (13/08/23)",
      price: "FROM £85.00",
      productId: "bd421bfa-2819-444b-aaa7-8de168f2b171",
      image: "https://static.wixstatic.com/media/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg/v1/fill/w_940,h_334,q_90,enc_avif,quality_auto/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg",
    },
    {
      title: "POSITIONAL GUIDE",
      subtitle: "MASTER YOUR ROLE",
      features: [
        "Break down any concept at a higher level",
        "Easily access solutions to the problems you face",
        "See the game differently"
      ],
      description: "Positional guide pieces utilise the best players in the world to explain advanced tactical ideas, allowing you to see the game through a more intellectual lens. We break down everything important to learn and apply in a simple format.",
      example: "Example: Winger Positioning & Movement",
      price: "FROM £85.00",
      productId: "853b38f5-27f3-4482-9ad2-99c10983e988",
      image: "https://static.wixstatic.com/media/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg/v1/fill/w_848,h_334,q_90,enc_avif,quality_auto/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg",
    },
    {
      title: "PLAYER EFFICIENCY REPORT",
      subtitle: "DATA-DRIVEN INSIGHTS",
      features: [
        "Earn new contracts and club interest",
        "Evaluate performance more objectively",
        "Measure progress"
      ],
      description: "The Player Efficiency Report provides a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. In addition to presenting the data, the report includes a detailed plan for improving performance.",
      example: "Example: Michael Mulligan (23/24)",
      price: "FROM £95.00",
      productId: "309ecacf-22ee-4467-8674-c6686968f6db",
      image: "https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_400,h_300,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png",
    }
  ];

  const detailTabs = [
    {
      label: "Overview",
      paragraphs: [
        "The difference between a good player and a great player often lies in the depth of their game understanding. With our bespoke analysis services, we help you unlock new layers of your performance and rise above your competition.",
        "The best athletes in the world invest significant time in performance analysis. It is not solely about enhancing tactical development - it is about uncovering insights into technical, physical, and psychological performance.",
        "Our expert analysts employ expert coaching techniques and tools, dissecting your gameplay to provide an in-depth understanding of your strengths and areas to improve."
      ]
    },
    {
      label: "Pre-Match",
      paragraphs: [
        "Pre-match opposition analysis is delivered to our players at the start of the match week, giving time to absorb the information and use it in preparation.",
        "We analyse your direct opponents - their strengths, weaknesses, preferred movements, and tendencies. You'll know exactly what to expect and how to exploit their vulnerabilities.",
        "The analysis includes video clips, tactical diagrams, and clear action points for you to focus on during the match."
      ]
    },
    {
      label: "Post-Match",
      paragraphs: [
        "In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses.",
        "We review every touch, every decision, and every movement - identifying patterns in your play and specific moments where different choices could have led to better outcomes.",
        "Each analysis comes with a clear development plan and specific areas to work on before your next match."
      ]
    },
    {
      label: "Positional",
      paragraphs: [
        "Positional guide pieces utilise the best players in the world to explain advanced tactical ideas, allowing you to see the game through a more intellectual lens.",
        "We create bespoke content specific to your position and the areas you need to develop. Using examples from elite players, we show you exactly how to execute at the highest level.",
        "Guides cover positioning, movement patterns, decision-making triggers, and much more."
      ]
    },
    {
      label: "Efficiency",
      paragraphs: [
        "The Player Efficiency Report provides a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players.",
        "We compare your statistics against positional benchmarks, league averages, and top performers. This gives you clear evidence of your strengths and specific targets for improvement.",
        "Reports are formatted professionally for sharing with agents, clubs, and scouts - showcasing your value in the transfer market."
      ]
    }
  ];

  return (
    <ServicePageLayout
      category="ANALYSIS"
      title="SEE THE GAME BEFORE IT HAPPENS"
      heroVideo="/videos/players-hero.mp4"
    >
      {/* Four Pillars as Large Cards */}
      <ServicePillars pillars={pillars} large />

      {/* Our Analysis Services Title */}
      <ServiceSectionTitle>OUR ANALYSIS SERVICES</ServiceSectionTitle>

      {/* Analysis Service Cards - Alternating Layout */}
      <section className="py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 max-w-6xl mx-auto">
            {analysisServices.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index}
                  className="group bg-gradient-to-br from-black/80 to-black/60 border border-white/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-accent/40"
                >
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Image Section */}
                    <div className="relative lg:w-1/2 h-64 lg:h-auto min-h-[280px]">
                      <img 
                        src={service.image}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <p className="absolute bottom-4 left-4 text-sm text-white/70">{service.example}</p>
                      
                      {/* View Example Button */}
                      <LocalizedLink 
                        to="/player-hub/e3ae5dcd-0a67-4d49-bf04-879040c4b8c3?section=analysis"
                        className="absolute bottom-4 right-4 opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-black/40 border-white/30 text-white/80 hover:bg-black/60 hover:text-white text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Example
                        </Button>
                      </LocalizedLink>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-accent" />
                        </div>
                        <h3 className="font-bebas text-2xl lg:text-3xl text-white tracking-wide">
                          {service.title}
                        </h3>
                      </div>
                      
                      <p className="text-accent font-bebas text-sm tracking-widest mb-4">
                        {service.subtitle}
                      </p>

                      <p className="text-white/80 text-sm leading-relaxed mb-5">
                        {service.description}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-center gap-2 text-white/90 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between mt-auto">
                        <p className="font-bebas text-xl text-accent tracking-wide">{service.price}</p>
                        <LocalizedLink to={`/services?service=${service.productId}`}>
                          <Button className="font-bebas tracking-wider bg-transparent border-2 border-accent text-white hover:bg-accent hover:text-black px-6 group/btn">
                            REQUEST QUOTE
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </LocalizedLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* In Detail Section */}
      <section className="relative py-8 overflow-hidden">
        {/* Dark green gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
          
          <div className="max-w-5xl mx-auto mt-6">
            <ServiceDetailTabs tabs={detailTabs.map(tab => ({
              label: tab.label,
              content: (
                <div className="grid gap-4">
                  {tab.paragraphs.map((text, pIndex) => (
                    <div 
                      key={pIndex}
                      className="group/card relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-accent/50 hover:from-white/[0.12] hover:to-white/[0.05] hover:scale-[1.01] hover:shadow-lg hover:shadow-accent/5 cursor-default"
                    >
                      {/* Animated accent bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/30 rounded-l-xl transition-all duration-300 group-hover/card:bg-accent group-hover/card:w-1.5" />
                      
                      <p className="text-white/90 text-sm md:text-base leading-relaxed pl-3">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              )
            }))} />
          </div>
        </div>
      </section>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default Analysis;
