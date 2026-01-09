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

const Conditioning = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_9abe95cacd094c49b255413bb49ae654~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Anaerobic.png", label: "ANAEROBIC" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0817c68868ac432c9cdb4be011a328cc~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Aerobic.png", label: "AEROBIC" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_674e777eccd9459f8cacf5a826cba219~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Muscular%20Endurance.png", label: "MUSCULAR ENDURANCE" },
  ];

  return (
    <ServicePageLayout
      category="CONDITIONING"
      title="THE CAPACITY TO\nCOVER EVERY BLADE"
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
              "Conditioning is an essential aspect of football, often making the difference between victory and defeat in the final minutes of the game. A well-conditioned player can keep their pace, power, and precision long after others have faded. Our conditioning services are designed to ensure that you remain at peak performance, from the first whistle to the last.",
              "There are so many factors to be considered when training to improve endurance: ATP, pH, muscles, substrates, blood-glucose, circulation, and respiration; only some of the determinants of how well-conditioned a player will appear. A player trying to learn and understand each of these at the level of a scientist is difficult, and the far quicker and easier method to improve here is enlisting a conditioning expert.",
              "Our players are typically the fittest in their clubs, consistently available, and rarely injured due to our tailored conditioning training. These sessions are designed to fit your specific needs, pushing your capacity to new limits, in turn reducing injury incidence and maximising your on-pitch impact.",
              "For new players, we start with an assessment to identify key physical development goals, ensuring each session is designed to achieve the greatest performance improvements.",
              "As football is an intermittent sport with multiple different playing positions that each have different needs, following the right type of training program is vital. Beyond that, ensuring that training matches the different type of energy system used predominantly in your position on the pitch is an absolute must."
            ]}
          />
          
          <p className="text-center text-muted-foreground italic text-sm mt-6">
            Please note that this service is only available to players in England.
          </p>
        </div>
      </ServiceSection>

      {/* Sharpen Your Blade Section */}
      <ServiceSection>
        <ServiceSectionTitle>SHARPEN YOUR BLADE</ServiceSectionTitle>
        
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4 md:gap-6">
          {[
            "Obtain your fully tailored training plan based on analysis and testing results. Absorb from the continuous support ensuring maximum results throughout your programming journey.",
            "We identify and prioritise training the energy systems predominantly used in your position to optimise performance.",
            "We conduct a specific-needs analysis and fitness testing to determine training priorities.",
            "We support you in understanding the key factors influencing endurance in football, such as ATP, pH, Blood-glucose, Respiration and much more."
          ].map((text, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 transition-colors">
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </ServiceSection>

      {/* Programming Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>PROGRAMMING</ServiceSectionTitle>
        
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">
          {[
            "Bespoke conditioning drills with position-specific and individualised work ratios.",
            "Periodisation to ensure progression and avoid overtraining.",
            "Monitoring of performance metrics to track progress and adjust the programme.",
            "Choose from in-person training or extended programming.",
            "Monthly review and redesign of programming around club schedule and personal load.",
            "24/7 support with training, including new cues, targets and feedback."
          ].map((text, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-4 md:p-5">
              <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </ServiceSection>

      {/* Options Section */}
      <ServiceSection>
        <ServiceSectionTitle>OPTIONS</ServiceSectionTitle>
        
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_017fa5479b0149dc8131970689d6d548~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_017fa5479b0149dc8131970689d6d548~mv2.png"
            title="Conditioning Training"
            link="/contact"
          />
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_ff883ecdb84447798addc2bef1be7c2b~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_ff883ecdb84447798addc2bef1be7c2b~mv2.png"
            title="Conditioning Programming"
            price="From £200.00"
            link="/contact"
          />
        </div>
      </ServiceSection>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default Conditioning;
