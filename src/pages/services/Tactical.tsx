import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";

const Tactical = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_3cb0b27e76454bdea2d63ff66acfddfa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Positioning.png", label: "POSITIONING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_34064a3af1fb4cda857abb786edea7ae~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Movement.png", label: "MOVEMENT" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_4f2f0e863b8949f19d464230d2ce0910~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Decision-Making.png", label: "DECISION-MAKING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_41d76a61f7a8411a8c48c65b0b350c64~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Vision%20(1).png", label: "VISION" },
  ];

  return (
    <ServicePageLayout
      category="ANALYSIS"
      title="SEE THE GAME BEFORE IT HAPPENS"
      heroVideo="/videos/players-hero.mp4"
    >
      <ServicePillars pillars={pillars} />

      {/* Pre-Match Opposition Analysis */}
      <ServiceSection className="py-12 md:py-16">
        <ServiceSectionTitle>PRE-MATCH OPPOSITION ANALYSIS</ServiceSectionTitle>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">READ AHEAD OF PLAY MORE EASILY</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">KNOW YOUR MATCHUP'S WEAKNESSES</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">FEEL PREPARED GOING INTO ANY GAME</h3>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              Our pre-match opposition analysis provides a competitive edge by examining the opposing team's tactics and formations before an upcoming game. We focus on their defensive and offensive patterns, directly relating to your position and tactics, to enhance your decision-making during the match.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Delivered at the start of the match week, our analysis allows you ample time to absorb and apply the information. Unlike club-level analysis, we provide detailed insights tailored to your individual performance.
            </p>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Example: Slovakia vs England (30/06/24)</p>
              <p className="font-bebas text-2xl text-primary mb-4">From £85.00</p>
              <LocalizedLink to="/contact">
                <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-8 py-6 text-lg">REQUEST A QUOTE</Button>
              </LocalizedLink>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg/v1/fill/w_400,h_280,q_90,enc_avif,quality_auto/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg"
              alt="Pre-match analysis"
              className="rounded-lg w-full h-44 md:h-56 object-cover shadow-xl"
            />
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_76a25c0356644727afcfbae3da9165df~mv2.png/v1/fill/w_400,h_280,q_90,enc_avif,quality_auto/c4f4b1_76a25c0356644727afcfbae3da9165df~mv2.png"
              alt="Pre-match analysis 2"
              className="rounded-lg w-full h-44 md:h-56 object-cover shadow-xl"
            />
          </div>
        </div>
      </ServiceSection>

      {/* Post-Match Analysis */}
      <ServiceSection dark className="py-12 md:py-16">
        <ServiceSectionTitle>POST-MATCH ANALYSIS</ServiceSectionTitle>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg/v1/fill/w_400,h_280,q_90,enc_avif,quality_auto/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg"
              alt="Post-match analysis"
              className="rounded-lg w-full h-44 md:h-56 object-cover shadow-xl"
            />
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_aabad9361c374361957951326c7b6634~mv2.png/v1/fill/w_400,h_280,q_90,enc_avif,quality_auto/c4f4b1_aabad9361c374361957951326c7b6634~mv2.png"
              alt="Post-match analysis 2"
              className="rounded-lg w-full h-44 md:h-56 object-cover shadow-xl"
            />
          </div>
          
          <div className="space-y-6 order-1 lg:order-2">
            <div className="space-y-2">
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">SEE THE GAME THROUGH EXPERIENCED EYES</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">THE FASTEST WAY TO IMPROVING IN MATCHES</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">IT IS NOT WHAT YOU LOOK AT, IT IS WHAT YOU SEE</h3>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              In post-match analysis, we focus on strengths and areas for improvement, highlighting key moments. We offer specific advice around further integrating strengths and developing areas for improvement—turning analysis into a tool for your development.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Delivered in the days after the game for the fastest download of information. Each analysis includes an extended PDF and annotated video with optional voiceover.
            </p>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Example: Máté Sajbán vs Debrecen (13/08/23)</p>
              <p className="font-bebas text-2xl text-primary mb-4">From £85.00</p>
              <LocalizedLink to="/contact">
                <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-8 py-6 text-lg">REQUEST A QUOTE</Button>
              </LocalizedLink>
            </div>
          </div>
        </div>
      </ServiceSection>

      {/* Positional Guide */}
      <ServiceSection className="py-12 md:py-16">
        <ServiceSectionTitle>POSITIONAL GUIDE</ServiceSectionTitle>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">BREAK DOWN ANY CONCEPT AT A HIGHER LEVEL</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">EASILY ACCESS SOLUTIONS TO THE PROBLEMS YOU FACE</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">SEE THE GAME DIFFERENTLY</h3>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              A tactical positional guide provides detailed information about your specific position and formation, enabling a better understanding of your role and how to optimise your impact. Perfect for players arriving at a new club or with a new manager.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Covers advanced topics typically exclusive to players of great managers like Marcelo Bielsa or Pep Guardiola, written in an easily digestible format with examples and clear explanations.
            </p>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Example: Winger Positioning & Movement</p>
              <p className="font-bebas text-2xl text-primary mb-4">From £85.00</p>
              <LocalizedLink to="/contact">
                <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-8 py-6 text-lg">REQUEST A QUOTE</Button>
              </LocalizedLink>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg/v1/fill/w_400,h_280,q_90,enc_avif,quality_auto/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg"
              alt="Positional guide"
              className="rounded-lg w-full h-44 md:h-56 object-cover shadow-xl"
            />
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_a95a7a590b15494a88dcb0dfe1d6e4b5~mv2.png/v1/fill/w_400,h_280,q_90,enc_avif,quality_auto/c4f4b1_a95a7a590b15494a88dcb0dfe1d6e4b5~mv2.png"
              alt="Positional guide 2"
              className="rounded-lg w-full h-44 md:h-56 object-cover shadow-xl"
            />
          </div>
        </div>
      </ServiceSection>

      {/* Player Efficiency Report */}
      <ServiceSection dark className="py-12 md:py-16">
        <ServiceSectionTitle>PLAYER EFFICIENCY REPORT</ServiceSectionTitle>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center gap-6 order-2 lg:order-1">
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_180,h_260,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png"
              alt="Report page 1"
              className="rounded-lg h-64 md:h-80 object-contain shadow-xl"
            />
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_6133d8c4af914df7b79d69bb05196698~mv2.png/v1/fill/w_180,h_260,q_90,enc_avif,quality_auto/c4f4b1_6133d8c4af914df7b79d69bb05196698~mv2.png"
              alt="Report page 2"
              className="rounded-lg h-64 md:h-80 object-contain shadow-xl"
            />
          </div>
          
          <div className="space-y-6 order-1 lg:order-2">
            <div className="space-y-2">
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">EARN NEW CONTRACTS AND CLUB INTEREST</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">EVALUATE PERFORMANCE MORE OBJECTIVELY</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">MEASURE PROGRESS</h3>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              A comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. Includes a detailed plan for improving performance, highlighting areas of strength and suggesting pathways for progress.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Most football clubs are data-driven, recruiting based on statistics. Our report helps you understand how scouts view you and what to improve—invaluable for players seeking transfers or looking to develop their game.
            </p>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Example: Michael Mulligan (23/24)</p>
              <p className="font-bebas text-2xl text-primary mb-4">From £95.00</p>
              <LocalizedLink to="/contact">
                <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-8 py-6 text-lg">REQUEST A QUOTE</Button>
              </LocalizedLink>
            </div>
          </div>
        </div>
      </ServiceSection>

      {/* In Detail Section */}
      <ServiceSection className="py-12 md:py-16">
        <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          <ServiceDetailTabs tabs={[
            {
              label: "Overview",
              content: (
                <ServiceContentBlock
                  paragraphs={[
                    "The difference between a good player and a great player often lies in the depth of their game understanding. With our bespoke analysis services, we help you unlock new layers of your performance and rise above your competition.",
                    "The best athletes in the world invest significant time in performance analysis. It is not solely about enhancing tactical development - it is about uncovering insights into technical, physical, and psychological performance.",
                    "Our expert analysts employ expert coaching techniques and tools, dissecting your gameplay to provide an in-depth understanding of your strengths and areas to improve. Unlike team analysis, we focus on your individual role within the team."
                  ]}
                />
              )
            },
            {
              label: "Pre-Match",
              content: (
                <ServiceContentBlock
                  paragraphs={[
                    "Our pre-match opposition analysis provides a competitive edge by examining the opposing team's tactics and formations before an upcoming game. We focus on their defensive and offensive patterns, directly relating to your position.",
                    "Delivered at the start of the match week, our analysis allows you ample time to absorb and apply the information. You will gain a thorough understanding of the opposition's schemes and individual matchups."
                  ]}
                />
              )
            },
            {
              label: "Post-Match",
              content: (
                <ServiceContentBlock
                  paragraphs={[
                    "In post-match analysis, we focus on strengths and areas for improvement, highlighting key moments that illustrate both. We offer specific advice around further integrating strengths and developing areas for improvement.",
                    "Post-match analysis is delivered in the days after the game for the fastest download of information. Each analysis includes an extended PDF and annotated video with optional voiceover."
                  ]}
                />
              )
            },
            {
              label: "Positional",
              content: (
                <ServiceContentBlock
                  paragraphs={[
                    "A tactical positional guide is a valuable resource for players who want to enhance their performance. It provides detailed information about your specific position and formation.",
                    "A positional guide is a comprehensive view into the decisions and execution of the best players in any position, formation or team. Perfect for players arriving at a new club or needing to develop tactically."
                  ]}
                />
              )
            },
            {
              label: "Efficiency",
              content: (
                <ServiceContentBlock
                  paragraphs={[
                    "The Player Efficiency Report provides a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. It includes a detailed plan for improving performance.",
                    "Our report is a data-backed evaluation of a player's current levels of performance compared to their team, league and impact on games. Invaluable for players seeking transfers or looking to develop their game."
                  ]}
                />
              )
            }
          ]} />
        </div>
      </ServiceSection>
    </ServicePageLayout>
  );
};

export default Tactical;