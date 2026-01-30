import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServicePillars,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";

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
      features: [
        "Read ahead of play more easily",
        "Know your matchup's weaknesses", 
        "Feel prepared going into any game"
      ],
      description: "Pre-match opposition analysis is delivered to our players at the start of the match week, giving time to absorb the information and use it in preparation. Unlike the analysis delivered at club-level, we focus in much greater detail on what is important to you for a strong individual performance.",
      example: "Example Pre-Match Analysis: Slovakia vs England (30/06/24)",
      price: "From £85.00",
      productId: "6c369b05-d410-4955-98e6-20a936019079",
      images: [
        "https://static.wixstatic.com/media/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg/v1/fill/w_940,h_334,q_90,enc_avif,quality_auto/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg",
        "https://static.wixstatic.com/media/c4f4b1_76a25c0356644727afcfbae3da9165df~mv2.png/v1/fill/w_612,h_334,q_90,enc_avif,quality_auto/c4f4b1_76a25c0356644727afcfbae3da9165df~mv2.png"
      ]
    },
    {
      title: "POST-MATCH ANALYSIS",
      features: [
        "See the game through experienced eyes",
        "The fastest way to improving in matches",
        "It is not what you look at, it is what you see"
      ],
      description: "In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses. Although highly critical, even with our Premier League level players, the detail in our analysis will make vast improvements to your game when applied.",
      example: "Example Post-Match Analysis: Máté Sajbán vs Debrecen (13/08/23)",
      price: "From £85.00",
      productId: "bd421bfa-2819-444b-aaa7-8de168f2b171",
      images: [
        "https://static.wixstatic.com/media/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg/v1/fill/w_940,h_334,q_90,enc_avif,quality_auto/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg",
        "https://static.wixstatic.com/media/c4f4b1_aabad9361c374361957951326c7b6634~mv2.png/v1/fill/w_591,h_334,q_90,enc_avif,quality_auto/c4f4b1_aabad9361c374361957951326c7b6634~mv2.png"
      ]
    },
    {
      title: "POSITIONAL GUIDE",
      features: [
        "Break down any concept at a higher level",
        "Easily access solutions to the problems you face",
        "See the game differently"
      ],
      description: "Positional guide pieces utilise the best players in the world to explain advanced tactical ideas, allowing you to see the game through a more intellectual lens. No matter the concept, we break down everything important to learn and apply in a simple format so that you can apply your learnings out on the pitch.",
      example: "Example Positional Guide: Winger Positioning & Movement",
      price: "From £85.00",
      productId: "853b38f5-27f3-4482-9ad2-99c10983e988",
      images: [
        "https://static.wixstatic.com/media/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg/v1/fill/w_848,h_334,q_90,enc_avif,quality_auto/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg",
        "https://static.wixstatic.com/media/c4f4b1_a95a7a590b15494a88dcb0dfe1d6e4b5~mv2.png/v1/fill/w_585,h_334,q_90,enc_avif,quality_auto/c4f4b1_a95a7a590b15494a88dcb0dfe1d6e4b5~mv2.png"
      ]
    },
    {
      title: "PLAYER EFFICIENCY REPORT",
      features: [
        "Earn new contracts and club interest",
        "Evaluate performance more objectively",
        "Measure progress"
      ],
      description: "The Player Efficiency Report has its primary objective to provide a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. In addition to presenting the data, the report also includes a detailed plan for improving performance.",
      example: "Example Player Efficiency Report: Michael Mulligan (23/24)",
      price: "From £95.00",
      productId: "309ecacf-22ee-4467-8674-c6686968f6db",
      images: [
        "https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_170,h_486,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png",
        "https://static.wixstatic.com/media/c4f4b1_6133d8c4af914df7b79d69bb05196698~mv2.png/v1/fill/w_170,h_486,q_90,enc_avif,quality_auto/c4f4b1_6133d8c4af914df7b79d69bb05196698~mv2.png"
      ],
      isVertical: true
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

      {/* Analysis Service Cards */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {analysisServices.map((service, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10"
              >
                {/* Image Section */}
                <div className={`relative overflow-hidden ${service.isVertical ? 'h-48' : 'h-40'}`}>
                  <div className="absolute inset-0 flex gap-2 p-3">
                    {service.images.map((img, imgIndex) => (
                      <img 
                        key={imgIndex}
                        src={img}
                        alt={`${service.title} example ${imgIndex + 1}`}
                        className={`${service.isVertical ? 'h-full w-auto object-contain' : 'flex-1 object-cover'} rounded-lg`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <p className="absolute bottom-2 left-3 text-xs text-white/60">{service.example}</p>
                </div>

                {/* Content Section */}
                <div className="p-5 md:p-6 space-y-4">
                  <h3 className="font-bebas text-xl md:text-2xl text-accent tracking-wide">
                    {service.title}
                  </h3>

                  <ul className="space-y-2">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-white/90 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <p className="font-bebas text-xl text-accent">{service.price}</p>
                    <LocalizedLink to={`/services?service=${service.productId}`}>
                      <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-6">
                        LEARN MORE
                      </Button>
                    </LocalizedLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In Detail Section with improved background */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* Dark green gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(150,60%,8%)] via-[hsl(150,50%,6%)] to-[hsl(150,40%,4%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(150,60%,12%)_0%,transparent_70%)] opacity-30" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
          
          <div className="max-w-5xl mx-auto mt-8">
            <ServiceDetailTabs tabs={detailTabs.map(tab => ({
              label: tab.label,
              content: (
                <div className="grid gap-4">
                  {tab.paragraphs.map((text, pIndex) => (
                    <div 
                      key={pIndex}
                      className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-accent/40 hover:from-white/15 hover:to-white/8"
                    >
                      <p className="text-white/90 text-sm md:text-base leading-relaxed">
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