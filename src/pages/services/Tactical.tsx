import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceCard,
  ServiceInfoCard,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";

const Tactical = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_3cb0b27e76454bdea2d63ff66acfddfa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Positioning.png", label: "POSITIONING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_34064a3af1fb4cda857abb786edea7ae~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Movement.png", label: "MOVEMENT" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_4f2f0e863b8949f19d464230d2ce0910~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Decision-Making.png", label: "DECISION-MAKING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_41d76a61f7a8411a8c48c65b0b350c64~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Vision%20(1).png", label: "VISION" },
  ];

  return (
    <ServicePageLayout
      category="TACTICAL"
      title="SEE THE GAME\nBEFORE IT HAPPENS"
      heroVideo="/videos/players-hero.mp4"
    >
      <ServicePillars pillars={pillars} />

      {/* In Detail Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
            {["Overview", "Formation", "Positional"].map((tab, index) => (
              <button
                key={tab}
                className={`px-5 py-2.5 rounded-lg font-bebas text-sm md:text-base tracking-wider transition-all duration-200 ${
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
              "Understanding the tactical dimensions of football separates good players from great ones. While physical attributes and technical skills are essential, the ability to read the game, anticipate movements, and make split-second decisions elevates your performance to another level.",
              "Our tactical training focuses on developing your football intelligence - the ability to see patterns, understand positional responsibilities, and exploit spaces before they even appear. Whether you're looking to master your role within a specific formation or understand how to adapt to different tactical systems, our expert analysts provide the insights you need.",
              "Through detailed video analysis and personalised coaching sessions, we break down the complexities of modern football tactics into actionable knowledge. You'll learn to anticipate opposition movements, understand when to hold position versus when to break lines, and develop the spatial awareness that defines elite players.",
              "Our positional guides go beyond generic advice - they're tailored to your specific position and playing style, incorporating examples from the best players in the world to illustrate advanced concepts in an accessible way."
            ]}
          />
        </div>
      </ServiceSection>

      {/* Key Areas Section */}
      <ServiceSection>
        <ServiceSectionTitle>KEY AREAS</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          <ServiceInfoCard
            title="POSITIONAL UNDERSTANDING"
            content="Master your role within different formations and tactical systems. Understand when to hold your position, when to push forward, and when to cover for teammates."
            items={["Defensive responsibilities", "Attacking movements", "Transition play", "Set piece positioning"]}
          />
          <ServiceInfoCard
            title="GAME READING"
            content="Develop the ability to anticipate play before it happens. Learn to recognise patterns, identify opportunities, and make better decisions under pressure."
            items={["Pattern recognition", "Space identification", "Opposition analysis", "In-game adaptations"]}
          />
          <ServiceInfoCard
            title="FORMATION TACTICS"
            content="Understand the strengths and weaknesses of different formations and how to maximise your impact within each system."
            items={["4-3-3 principles", "4-4-2 dynamics", "3-5-2 variations", "Hybrid formations"]}
          />
          <ServiceInfoCard
            title="MATCH PREPARATION"
            content="Prepare for opponents with detailed pre-match analysis that highlights their weaknesses and gives you the tactical edge."
            items={["Opposition weaknesses", "Key matchup analysis", "Tactical triggers", "Game plan development"]}
          />
        </div>
      </ServiceSection>

      {/* Services Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>TACTICAL SERVICES</ServiceSectionTitle>
        
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <ServiceInfoCard
            title="Pre-Match Opposition Analysis"
            content="Detailed breakdown of upcoming opponents, focusing on their patterns of play, weaknesses to exploit, and your specific matchups."
          />
          <ServiceInfoCard
            title="Positional Guide"
            content="Bespoke analysis pieces using examples from elite players to explain advanced tactical concepts specific to your position."
          />
        </div>
        
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <p className="font-bebas text-xl md:text-2xl text-primary mb-4">From £85.00</p>
          <LocalizedLink to="/analysis">
            <Button className="font-bebas tracking-wider">
              Learn More
            </Button>
          </LocalizedLink>
        </div>
      </ServiceSection>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default Tactical;
