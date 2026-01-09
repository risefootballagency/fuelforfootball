import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";

const Analysis = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_3cb0b27e76454bdea2d63ff66acfddfa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Positioning.png", label: "POSITIONING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_34064a3af1fb4cda857abb786edea7ae~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Movement.png", label: "MOVEMENT" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_4f2f0e863b8949f19d464230d2ce0910~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Decision-Making.png", label: "DECISION-MAKING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_41d76a61f7a8411a8c48c65b0b350c64~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Vision%20(1).png", label: "VISION" },
  ];

  return (
    <ServicePageLayout
      category="ANALYSIS"
      title="SEE THE GAME\nBEFORE IT HAPPENS"
    >
      <ServicePillars pillars={pillars} />

      {/* Pre-Match Opposition Analysis */}
      <ServiceSection>
        <ServiceSectionTitle>PRE-MATCH OPPOSITION ANALYSIS</ServiceSectionTitle>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">READ AHEAD OF PLAY MORE EASILY</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">KNOW YOUR MATCHUP'S WEAKNESSES</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">FEEL PREPARED GOING INTO ANY GAME</h3>
            </div>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Pre-match opposition analysis is delivered to our players at the start of the match week, giving time to absorb the information and use it in preparation. Unlike the analysis delivered at club-level, we focus in much greater detail on what is important to you for a strong individual performance.
            </p>
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Example Pre-Match Analysis: Slovakia vs England (30/06/24)</p>
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
              className="rounded-xl w-full shadow-lg"
            />
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_76a25c0356644727afcfbae3da9165df~mv2.png/v1/fill/w_612,h_334,q_90,enc_avif,quality_auto/c4f4b1_76a25c0356644727afcfbae3da9165df~mv2.png"
              alt="Pre-match analysis example 2"
              className="rounded-xl w-full shadow-lg"
            />
          </div>
        </div>
      </ServiceSection>

      {/* Post-Match Analysis */}
      <ServiceSection dark>
        <ServiceSectionTitle>POST-MATCH ANALYSIS</ServiceSectionTitle>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg/v1/fill/w_940,h_334,q_90,enc_avif,quality_auto/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg"
              alt="Post-match analysis example"
              className="rounded-xl w-full shadow-lg"
            />
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_aabad9361c374361957951326c7b6634~mv2.png/v1/fill/w_591,h_334,q_90,enc_avif,quality_auto/c4f4b1_aabad9361c374361957951326c7b6634~mv2.png"
              alt="Post-match analysis example 2"
              className="rounded-xl w-full shadow-lg"
            />
          </div>
          
          <div className="space-y-6 order-1 lg:order-2">
            <div className="space-y-3">
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">SEE THE GAME THROUGH EXPERIENCED EYES</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">THE FASTEST WAY TO IMPROVING IN MATCHES</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">IT IS NOT WHAT YOU LOOK AT, IT IS WHAT YOU SEE</h3>
            </div>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses. Although highly critical, even with our Premier League level players, the detail in our analysis will make vast improvements to your game when applied.
            </p>
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Example Post-Match Analysis: Máté Sajbán vs Debrecen (13/08/23)</p>
              <p className="font-bebas text-xl text-primary mb-4">From £85.00</p>
              <LocalizedLink to="/contact">
                <Button className="font-bebas tracking-wider">REQUEST A QUOTE</Button>
              </LocalizedLink>
            </div>
          </div>
        </div>
      </ServiceSection>

      {/* Positional Guide */}
      <ServiceSection>
        <ServiceSectionTitle>POSITIONAL GUIDE</ServiceSectionTitle>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">BREAK DOWN ANY CONCEPT AT A HIGHER LEVEL</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">EASILY ACCESS SOLUTIONS TO THE PROBLEMS YOU FACE</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">SEE THE GAME DIFFERENTLY</h3>
            </div>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Positional guide pieces utilise the best players in the world to explain advanced tactical ideas, allowing you to see the game through a more intellectual lens. No matter the concept, we break down everything important to learn and apply in a simple format so that you can apply your learnings out on the pitch.
            </p>
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Example Positional Guide: Winger Positioning & Movement</p>
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
              className="rounded-xl w-full shadow-lg"
            />
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_a95a7a590b15494a88dcb0dfe1d6e4b5~mv2.png/v1/fill/w_585,h_334,q_90,enc_avif,quality_auto/c4f4b1_a95a7a590b15494a88dcb0dfe1d6e4b5~mv2.png"
              alt="Positional guide example 2"
              className="rounded-xl w-full shadow-lg"
            />
          </div>
        </div>
      </ServiceSection>

      {/* Player Efficiency Report */}
      <ServiceSection dark>
        <ServiceSectionTitle>PLAYER EFFICIENCY REPORT</ServiceSectionTitle>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="flex justify-center gap-4 order-2 lg:order-1">
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_170,h_486,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png"
              alt="Player efficiency report page 1"
              className="rounded-xl max-h-[350px] object-contain shadow-lg"
            />
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_6133d8c4af914df7b79d69bb05196698~mv2.png/v1/fill/w_170,h_486,q_90,enc_avif,quality_auto/c4f4b1_6133d8c4af914df7b79d69bb05196698~mv2.png"
              alt="Player efficiency report page 2"
              className="rounded-xl max-h-[350px] object-contain shadow-lg"
            />
          </div>
          
          <div className="space-y-6 order-1 lg:order-2">
            <div className="space-y-3">
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">EARN NEW CONTRACTS AND CLUB INTEREST</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">EVALUATE PERFORMANCE MORE OBJECTIVELY</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">MEASURE PROGRESS</h3>
            </div>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              The Player Efficiency Report has its primary objective to provide a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. In addition to presenting the data, the report also includes a detailed plan for improving performance.
            </p>
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Example Player Efficiency Report: Michael Mulligan (23/24)</p>
              <p className="font-bebas text-xl text-primary mb-4">From £95.00</p>
              <LocalizedLink to="/contact">
                <Button className="font-bebas tracking-wider">REQUEST A QUOTE</Button>
              </LocalizedLink>
            </div>
          </div>
        </div>
      </ServiceSection>

      {/* In Detail Section */}
      <ServiceSection>
        <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
            {["Overview", "Pre-Match", "Post-Match", "Positional Guide", "Player Efficiency Report"].map((tab, index) => (
              <button
                key={tab}
                className={`px-4 py-2.5 rounded-lg font-bebas text-xs md:text-sm tracking-wider transition-all duration-200 ${
                  index === 0 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border border-border hover:border-primary/50 text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <ServiceContentBlock
            paragraphs={[
              "The difference between a good player and a great player often lies in the depth of their game understanding. With our bespoke analysis services, we help you unlock new layers of your performance and rise above your competition.",
              "The best athletes in the world invest significant time in performance analysis. It is not solely about enhancing tactical development - it is about uncovering insights into technical, physical, and psychological performance. These insights can transform your decision-making, your positional awareness, and your ability to adapt in real-time to the ever-changing dynamics of a game.",
              "Our expert analysts employ expert coaching techniques and tools, dissecting your gameplay to provide an in-depth understanding of your strengths and areas to improve. Unlike team analysis, we are able to go deep into detail on your individual role within the team."
            ]}
          />
        </div>
      </ServiceSection>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default Analysis;
