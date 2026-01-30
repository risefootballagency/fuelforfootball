import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServicePillars,
  ServiceSectionTitle,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";
import { WhatsIncludedDialog } from "@/components/services/WhatsIncludedDialog";
import { PortalExampleDialog } from "@/components/services/PortalExampleDialog";
import { ArrowRight, Info, Eye } from "lucide-react";

const Analysis = () => {
  const [whatsIncludedOpen, setWhatsIncludedOpen] = useState(false);
  const [portalExampleOpen, setPortalExampleOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState("post-match");

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
      serviceType: "pre-match",
      tabLabel: "Pre-Match Opposition Analysis",
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
      serviceType: "post-match",
      tabLabel: "Post-Match Analysis",
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
      serviceType: "positional",
      tabLabel: "Positional Guide",
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
      serviceType: "efficiency",
      tabLabel: "Player Efficiency Report",
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
      ],
      productId: null
    },
    {
      label: "Pre-Match Opposition Analysis",
      paragraphs: [
        "Pre-match opposition analysis is delivered to our players at the start of the match week, giving time to absorb the information and use it in preparation.",
        "We analyse your direct opponents - their strengths, weaknesses, preferred movements, and tendencies. You'll know exactly what to expect and how to exploit their vulnerabilities.",
        "The analysis includes video clips, tactical diagrams, and clear action points for you to focus on during the match."
      ],
      productId: "6c369b05-d410-4955-98e6-20a936019079"
    },
    {
      label: "Post-Match Analysis",
      paragraphs: [
        "In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses.",
        "We review every touch, every decision, and every movement - identifying patterns in your play and specific moments where different choices could have led to better outcomes.",
        "Each analysis comes with a clear development plan and specific areas to work on before your next match."
      ],
      productId: "bd421bfa-2819-444b-aaa7-8de168f2b171"
    },
    {
      label: "Positional Guide",
      paragraphs: [
        "Positional guide pieces utilise the best players in the world to explain advanced tactical ideas, allowing you to see the game through a more intellectual lens.",
        "We create bespoke content specific to your position and the areas you need to develop. Using examples from elite players, we show you exactly how to execute at the highest level.",
        "Guides cover positioning, movement patterns, decision-making triggers, and much more."
      ],
      productId: "853b38f5-27f3-4482-9ad2-99c10983e988"
    },
    {
      label: "Player Efficiency Report",
      paragraphs: [
        "The Player Efficiency Report provides a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players.",
        "We compare your statistics against positional benchmarks, league averages, and top performers. This gives you clear evidence of your strengths and specific targets for improvement.",
        "Reports are formatted professionally for sharing with agents, clubs, and scouts - showcasing your value in the transfer market."
      ],
      productId: "309ecacf-22ee-4467-8674-c6686968f6db"
    }
  ];

  const openWhatsIncluded = (serviceType: string) => {
    setSelectedServiceType(serviceType);
    setWhatsIncludedOpen(true);
  };

  return (
    <ServicePageLayout
      category="ANALYSIS"
      title="SEE THE GAME BEFORE IT HAPPENS"
      heroVideo="/videos/players-hero.mp4"
      heroVideoWithBorders
    >
      {/* Four Pillars with Dark Green Background - No extra spacing */}
      <section className="relative py-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <ServicePillars pillars={pillars} large />
        </div>
      </section>

      {/* Our Analysis Services - Seamless with above */}
      <section className="relative py-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ServiceSectionTitle>OUR ANALYSIS SERVICES</ServiceSectionTitle>
          
          <div className="space-y-6 max-w-6xl mx-auto mt-4">
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

                      <div className="flex flex-col gap-3 mt-auto">
                        <p className="font-bebas text-xl text-accent tracking-wide">{service.price}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button 
                            variant="ghost"
                            onClick={() => openWhatsIncluded(service.serviceType)}
                            className="font-bebas tracking-wider text-white/70 hover:text-white hover:bg-white/10 px-3 text-sm"
                          >
                            <Info className="w-4 h-4 mr-1" />
                            WHAT'S INCLUDED
                          </Button>
                          <LocalizedLink to={`/services?service=${service.productId}`}>
                            <Button className="font-bebas tracking-wider bg-transparent border-2 border-accent text-white hover:bg-accent hover:text-black px-4 text-sm group/btn">
                              LEARN MORE
                              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                          </LocalizedLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View Example Button */}
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => setPortalExampleOpen(true)}
              className="font-bebas tracking-wider bg-accent/20 border border-accent text-accent hover:bg-accent hover:text-black px-8 py-6 text-lg"
            >
              <Eye className="w-5 h-5 mr-3" />
              VIEW PLAYER PORTAL EXAMPLE
            </Button>
          </div>
        </div>
      </section>

      {/* In Detail Section - Seamless */}
      <section className="relative py-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
          
          <div className="max-w-5xl mx-auto mt-4">
            <ServiceDetailTabs tabs={detailTabs.map(tab => ({
              label: tab.label,
              content: (
                <div className="grid gap-4">
                  {tab.paragraphs.map((text, pIndex) => (
                    <div 
                      key={pIndex}
                      className="group/card relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-accent/50 hover:from-white/[0.12] hover:to-white/[0.05] hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/10 cursor-pointer"
                    >
                      {/* Animated accent bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/30 rounded-l-xl transition-all duration-300 group-hover/card:bg-accent group-hover/card:w-1.5 group-hover/card:shadow-lg group-hover/card:shadow-accent/50" />
                      
                      <p className="text-white/90 text-sm md:text-base leading-relaxed pl-3">
                        {text}
                      </p>
                    </div>
                  ))}
                  {/* Product Link at the end */}
                  {tab.productId && (
                    <div className="pt-2">
                      <LocalizedLink to={`/services?service=${tab.productId}`}>
                        <Button className="font-bebas tracking-wider bg-transparent border-2 border-accent text-white hover:bg-accent hover:text-black px-6 group/btn">
                          LEARN MORE ABOUT {tab.label.toUpperCase()}
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </LocalizedLink>
                    </div>
                  )}
                </div>
              )
            }))} />
          </div>
        </div>
      </section>

      {/* Full Package - Seamless with Dark Green Background */}
      <section className="relative py-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <ServiceFullPackage />
        </div>
      </section>

      {/* Dialogs */}
      <WhatsIncludedDialog 
        open={whatsIncludedOpen}
        onOpenChange={setWhatsIncludedOpen}
        serviceType={selectedServiceType}
      />
      <PortalExampleDialog
        open={portalExampleOpen}
        onOpenChange={setPortalExampleOpen}
      />
    </ServicePageLayout>
  );
};

export default Analysis;
