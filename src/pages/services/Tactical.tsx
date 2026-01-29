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

      {/* In Detail Section - Overview */}
      <ServiceSection dark>
        <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto space-y-6">
          <ServiceContentBlock
            paragraphs={[
              "The difference between a good player and a great player often lies in the depth of their game understanding. With our bespoke analysis services, we help you unlock new layers of your performance and rise above your competition.",
              "The best athletes in the world invest significant time in performance analysis. It is not solely about enhancing tactical development - it is about uncovering insights into technical, physical, and psychological performance. These insights can transform your decision-making, your positional awareness, and your ability to adapt in real-time to the ever-changing dynamics of a game.",
              "Our expert analysts employ expert coaching techniques and tools, dissecting your gameplay to provide an in-depth understanding of your strengths and areas to improve. Unlike team analysis, we are able to go deep into detail on your individual role within the team. Likewise, we analyse opponents with a strong understanding of how your abilities intersect with those of the opposition and potential matchups, allowing you to play to your strengths and avoid the potential for mistakes."
            ]}
          />
        </div>
      </ServiceSection>

      {/* Pre-Match Opposition Analysis */}
      <ServiceSection>
        <ServiceSectionTitle>PRE-MATCH</ServiceSectionTitle>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">READ AHEAD OF PLAY MORE EASILY</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">KNOW YOUR MATCHUP'S WEAKNESSES</h3>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground">FEEL PREPARED GOING INTO ANY GAME</h3>
            </div>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Our pre-match opposition analysis provides a competitive edge by examining the opposing team's tactics and formations before an upcoming game. We focus on their defensive and offensive patterns, directly relating to your position and tactics, to enhance your decision-making during the match. By understanding these patterns, you can exploit weaknesses in their play while maximising your existing skills.
            </p>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Delivered at the start of the match week, our analysis allows you ample time to absorb and apply the information in your preparation. Unlike club-level analysis, we provide detailed insights tailored to your individual performance. You will gain a thorough understanding of the opposition's schemes, knowing which options are likely to be free at specific times, which improves your decision-making. Additionally, we break down broader patterns of play and how to respond defensively and offensively. Our focus on individual matchups helps you exploit their weaknesses and neutralise their strengths, ensuring a strong personal performance.
            </p>
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Example Pre-Match Analysis: Slovakia vs England (30/06/24)</p>
              <p className="font-bebas text-xl text-primary mb-4">From £85.00</p>
              <LocalizedLink to="/contact">
                <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black">REQUEST A QUOTE</Button>
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
        <ServiceSectionTitle>POST-MATCH</ServiceSectionTitle>
        
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
              In post-match analysis, we focus on the strengths and areas for improvement, highlighting key moments that illustrate both. We may use statistics and background information to further exemplify these points. The key aim of our analysis, which is unfortunately often overlooked within club analysis, is to offer specific advice around further integrating strengths, and developing the areas for improvement. We take a big step forward on statistical data, by offering coaching expertise to actually turn analysis into a massive tool for your development.
            </p>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Post-match analysis is delivered in the days after the game, for the fastest download of information, allowing you to apply improvements into training and then in turn, matches. Each analysis includes an extended PDF as well as annotated video with optional voiceover.
            </p>
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Example Post-Match Analysis: Máté Sajbán vs Debrecen (13/08/23)</p>
              <p className="font-bebas text-xl text-primary mb-4">From £85.00</p>
              <LocalizedLink to="/contact">
                <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black">REQUEST A QUOTE</Button>
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
              A tactical positional guide is a valuable resource for players who want to enhance their performance on the field. It provides detailed information about the player's specific position and formation, enabling them to gain a better understanding of their role and how to optimise their impact. Whether you play as a number 8 in a 4-3-2-1 formation or any other position, a tactical positional guide can help you elevate your game.
            </p>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              A positional guide is a comprehensive view into the decisions and execution of the best players in any position, formation or team. It is perfect for a player arriving at a new club or with a new manager who wants to understand the way they play at an elite level. It is also great for players who need to develop tactically to recognise the basis for their movements and decisions, on and off the ball. While it covers advanced topics that are typically exclusive to the players of great managers including Marcelo Bielsa or Pep Guardiola, it is written in an easily digestible format using examples and clear explanations to allow for easier learning. There is also plenty of footage and detail for the more visual learners to easily understand.
            </p>
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Example Positional Guide: Winger Positioning & Movement</p>
              <p className="font-bebas text-xl text-primary mb-4">From £85.00</p>
              <LocalizedLink to="/contact">
                <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black">REQUEST A QUOTE</Button>
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
              The Player Efficiency Report has its primary objective to provide a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. In addition to presenting the data, the report also includes a detailed plan for improving performance, highlighting areas of strength and suggesting pathways for progress.
            </p>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Most football clubs are data-driven, recruiting based on statistics. Our Player Efficiency Report offers a comprehensive analysis of your performance, improving on-pitch results in ways that show up on the data sheet, attracting greater interest from teams. It helps you understand how scouts view you and what to improve. This report is invaluable for players seeking transfers or looking to develop their game.
            </p>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Our Player Efficiency Report is also a data-backed evaluation of a player's current levels of performance as compared to their team, league and impact on games. It allows us to understand how a player is performing against the expectations of a player at their level and other levels. It can be used by players searching for a transfer, as a great piece of evidence of their performance level. It can also be used by players looking to develop their game to a new level who are not sure what they need to work on most as a good way of finding out their strengths and weaknesses.
            </p>
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Example Player Efficiency Report: Michael Mulligan (23/24)</p>
              <p className="font-bebas text-xl text-primary mb-4">From £95.00</p>
              <LocalizedLink to="/contact">
                <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black">REQUEST A QUOTE</Button>
              </LocalizedLink>
            </div>
          </div>
        </div>
      </ServiceSection>

      {/* Detail Tabs */}
      <ServiceSection>
        <ServiceSectionTitle>EXPLORE</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          <ServiceDetailTabs tabs={[
            {
              label: "Pre-Match",
              content: (
                <ServiceContentBlock
                  paragraphs={[
                    "Our pre-match opposition analysis provides a competitive edge by examining the opposing team's tactics and formations before an upcoming game. We focus on their defensive and offensive patterns, directly relating to your position and tactics, to enhance your decision-making during the match.",
                    "Delivered at the start of the match week, our analysis allows you ample time to absorb and apply the information in your preparation. Unlike club-level analysis, we provide detailed insights tailored to your individual performance.",
                    "You will gain a thorough understanding of the opposition's schemes, knowing which options are likely to be free at specific times. Our focus on individual matchups helps you exploit their weaknesses and neutralise their strengths, ensuring a strong personal performance."
                  ]}
                />
              )
            },
            {
              label: "Post-Match",
              content: (
                <ServiceContentBlock
                  paragraphs={[
                    "In post-match analysis, we focus on the strengths and areas for improvement, highlighting key moments that illustrate both. We may use statistics and background information to further exemplify these points.",
                    "The key aim of our analysis is to offer specific advice around further integrating strengths, and developing the areas for improvement. We take a big step forward on statistical data, by offering coaching expertise to actually turn analysis into a massive tool for your development.",
                    "Post-match analysis is delivered in the days after the game, for the fastest download of information, allowing you to apply improvements into training and then in turn, matches. Each analysis includes an extended PDF as well as annotated video with optional voiceover."
                  ]}
                />
              )
            },
            {
              label: "Positional Guide",
              content: (
                <ServiceContentBlock
                  paragraphs={[
                    "A tactical positional guide is a valuable resource for players who want to enhance their performance on the field. It provides detailed information about the player's specific position and formation, enabling them to gain a better understanding of their role.",
                    "It is a comprehensive view into the decisions and execution of the best players in any position, formation or team. Perfect for a player arriving at a new club or with a new manager who wants to understand the way they play at an elite level.",
                    "While it covers advanced topics that are typically exclusive to the players of great managers including Marcelo Bielsa or Pep Guardiola, it is written in an easily digestible format using examples and clear explanations."
                  ]}
                />
              )
            },
            {
              label: "Efficiency Report",
              content: (
                <ServiceContentBlock
                  paragraphs={[
                    "The Player Efficiency Report provides a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. In addition to presenting the data, the report includes a detailed plan for improving performance.",
                    "Most football clubs are data-driven, recruiting based on statistics. Our report offers a comprehensive analysis of your performance, improving on-pitch results in ways that show up on the data sheet, attracting greater interest from teams.",
                    "It can be used by players searching for a transfer, as great evidence of their performance level. It can also be used by players looking to develop their game to a new level who are not sure what they need to work on most."
                  ]}
                />
              )
            }
          ]} />
        </div>
      </ServiceSection>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default Tactical;
