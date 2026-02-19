import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";
import { ServiceOfferingCard } from "@/components/services/ServiceOfferingCard";

const Conditioning = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_9abe95cacd094c49b255413bb49ae654~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Anaerobic.png", label: "ANAEROBIC" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0817c68868ac432c9cdb4be011a328cc~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Aerobic.png", label: "AEROBIC" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_674e777eccd9459f8cacf5a826cba219~mv2.png/v1/fill/w_119,h_119,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Muscular%20Endurance.png", label: "MUSCULAR ENDURANCE" },
  ];

  const tabContent = [
    {
      label: "Overview",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "Conditioning is an essential aspect of football, often making the difference between victory and defeat in the final minutes of the game. A well-conditioned player can keep their pace, power, and precision long after others have faded. Our conditioning services are designed to ensure that you remain at peak performance, from the first whistle to the last.",
            "There are so many factors to be considered when training to improve endurance: ATP, pH, muscles, substrates, blood-glucose, circulation, and respiration; only some of the determinants of how well-conditioned a player will appear.",
            "As football is an intermittent sport with multiple different playing positions that each have different needs, following the right type of training program is vital."
          ]}
        />
      )
    },
    {
      label: "In-Person",
      content: (
        <>
          <ServiceContentBlock
            paragraphs={[
              "Our in-person conditioning sessions are available for UK-based players. Each session is tailored to your position and the specific energy systems you use most during matches.",
              "For new players, we start with a comprehensive assessment including fitness testing to identify key physical development goals, ensuring each session achieves the greatest performance improvements.",
              "Our players are typically the fittest in their clubs, consistently available, and rarely injured due to our tailored conditioning training."
            ]}
          />
          <p className="text-center text-muted-foreground italic text-sm mt-6">
            Please note: In-person sessions are only available to players in England.
          </p>
        </>
      )
    },
    {
      label: "Online",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "For players outside of England, we offer comprehensive remote conditioning programming with full support via video calls and messaging.",
            "Your bespoke conditioning plan is designed around your club schedule and personal load, with monthly reviews and adjustments to ensure continuous progress.",
            "24/7 support with training, including new cues, targets and feedback. Monitoring of performance metrics to track progress and optimise your programme."
          ]}
        />
      )
    }
  ];

  const conditioningServices = [
    {
      title: "CONDITIONING TRAINING",
      subtitle: "IN-PERSON SESSIONS",
      description: "Our in-person conditioning sessions take place across the UK with our expert conditioning coaches. Each session is tailored to your position and the specific energy systems you use most during matches.",
      features: [
        "Position-specific work ratios",
        "Fitness testing and assessment",
        "Real-time coaching feedback"
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_017fa5479b0149dc8131970689d6d548~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_017fa5479b0149dc8131970689d6d548~mv2.png",
      price: "FROM £120.00",
    },
    {
      title: "CONDITIONING PROGRAMMING",
      subtitle: "BESPOKE REMOTE SUPPORT",
      description: "Bespoke conditioning drills with position-specific and individualised work ratios. Periodisation to ensure progression and avoid overtraining, with monitoring of performance metrics to track progress.",
      features: [
        "Monthly review and redesign",
        "24/7 support with training",
        "Performance metrics tracking"
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_ff883ecdb84447798addc2bef1be7c2b~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_ff883ecdb84447798addc2bef1be7c2b~mv2.png",
      price: "FROM £200.00",
    },
  ];

  return (
    <ServicePageLayout
      category="CONDITIONING"
      title="THE CAPACITY TO COVER EVERY BLADE"
      heroVideo="/videos/players-hero.mp4"
      heroVideoWithBorders
      statsPageKey="conditioning"
    >
      {/* Pillars Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <ServicePillars pillars={pillars} large />
        </div>
      </section>

      {/* In Detail Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceDetailTabs tabs={tabContent} />
          </div>
        </div>
      </section>

      {/* Our Conditioning Services */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>OUR CONDITIONING SERVICES</ServiceSectionTitle>
          
          <div className="space-y-6 max-w-6xl mx-auto mt-4">
            {conditioningServices.map((service, index) => (
              <ServiceOfferingCard
                key={index}
                title={service.title}
                subtitle={service.subtitle}
                description={service.description}
                features={service.features}
                image={service.image}
                price={service.price}
                reverse={index % 2 !== 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sharpen Your Blade Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>SHARPEN YOUR BLADE</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4 grid sm:grid-cols-2 gap-4 md:gap-6">
            {[
              "Obtain your fully tailored training plan based on analysis and testing results. Absorb from the continuous support ensuring maximum results throughout your programming journey.",
              "We identify and prioritise training the energy systems predominantly used in your position to optimise performance.",
              "We conduct a specific-needs analysis and fitness testing to determine training priorities.",
              "We support you in understanding the key factors influencing endurance in football, such as ATP, pH, Blood-glucose, Respiration and much more."
            ].map((text, index) => (
              <div key={index} className="group/card relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-accent/50 hover:from-white/[0.12] hover:to-white/[0.05]">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/30 rounded-l-xl transition-all duration-300 group-hover/card:bg-accent group-hover/card:w-1.5" />
                <p className="text-white/70 text-sm md:text-base leading-relaxed pl-3">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Package */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 pt-0 pb-4">
          <ServiceFullPackage />
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Conditioning;
