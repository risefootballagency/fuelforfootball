import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceCard,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";

const Technical = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_fa44f917083b4628bdadc5a271e841f8~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Receiving%20(1).png", label: "RECEIVING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f23f93ab7f54ed4a8bd8fa19a26271f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Passing.png", label: "PASSING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_2669a5c5489d46eb8d08d0c4a00a2c23~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dribbling.png", label: "DRIBBLING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_6424db6835ec4e968f7d1b5c317cc4fa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Finishing.png", label: "FINISHING" },
  ];

  const concepts = [
    "Training paradigms (behaviourism, cognitivism, constructivism)",
    "CARDS",
    "Embodied cognition",
    "Game realism",
    "Ventral and Dorsal processing",
    "Non-cognitive processing",
    "Stability bias",
    "Problem-creating",
    "Learning-rich environments",
    "Constraints-based approaches",
    "Dynamic practice",
    "Perception-action coupling",
    "Perceptual-motor landscape",
    "Degeneracy",
    "Structure variability"
  ];

  return (
    <ServicePageLayout
      category="TECHNICAL"
      title="CONTROL THE BALL\nCONTROL THE GAME"
    >
      <ServicePillars pillars={pillars} />

      {/* In Detail Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
            {["Overview", "In-Person", "Online"].map((tab, index) => (
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
              "Technical aspects are the cornerstone of a player's game. Ball mastery can mean the difference between a missed opportunity and a spectacular goal, a fumbled pass and a game-changing assist. Our tailored technical training services are dedicated to honing your control over the ball and creating the ability to play precise passes, dribble, cut at speed, and finish with high accuracy.",
              "Players are quick to acknowledge the need for expert coaching when it comes to the physical aspects of the game - both primary (strength, power, speed, conditioning) and secondary (nutrition). When it comes to technical aspects of play, however, there is a tendency to assume it can be done to the highest level by oneself. Some might stumble upon great training, but there are well-understood, reliable evidence-based approaches and methods of training which most players will miss out on.",
              "Our individualised training sessions are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact.",
              "Unlike 1 to 1 sessions they may have seen online, our analysts break your game down in detail before training to key in on the details that actually matter for improving. We mainly work through workshops: for understanding new ideas, keying in on areas for development, walking through correct technique and decision-making in high detail.",
              "In-depth programming with a high attention to detail. Programming is individualised to improve the key technical aspects for improving performance on the pitch. Our technical coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations."
            ]}
          />
        </div>
      </ServiceSection>

      {/* Options Section */}
      <ServiceSection>
        <ServiceSectionTitle>OPTIONS</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_913034088e8646d79d725095677b0b1a~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_913034088e8646d79d725095677b0b1a~mv2.png"
            title="Recovery, Injury Prevention & Mobility Programming"
            link="/contact"
          />
          <ServiceCard
            image="https://static.wixstatic.com/media/e2ec89_74879ef601434395a9d63a2a8888c97a~mv2.jpg/v1/fill/w_386,h_386,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/e2ec89_74879ef601434395a9d63a2a8888c97a~mv2.jpg"
            title="Technical Programming"
            link="/contact"
          />
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_3572b859d7e04a29a183836a276c0028~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_3572b859d7e04a29a183836a276c0028~mv2.png"
            title="Technical Training"
            link="/contact"
          />
        </div>
      </ServiceSection>

      {/* More Than Cones Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>MORE THAN CONES</ServiceSectionTitle>
        
        <p className="text-muted-foreground text-center max-w-4xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
          Our technical sessions take a scientific approach to developing technical skills and include ideas such as:
        </p>
        
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {concepts.map((concept, index) => (
            <div 
              key={index} 
              className="bg-card border border-border rounded-lg px-4 py-2.5 text-center hover:border-primary/30 transition-colors"
            >
              <span className="text-xs md:text-sm text-muted-foreground">{concept}</span>
            </div>
          ))}
        </div>
      </ServiceSection>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default Technical;
