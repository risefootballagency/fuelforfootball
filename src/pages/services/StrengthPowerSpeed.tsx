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

const StrengthPowerSpeed = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_eb6331e862704a6baeacf4dc65adde63~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Strength.png", label: "STRENGTH" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_cf1cef6b92e74e1fb999c2e3739d2d6c~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Power.png", label: "POWER" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_a6cdb923e09d4ac4aec19e0302bdc01f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Speed.png", label: "SPEED" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f1a80188cda42339edc21be4fb126d6~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Agility.png", label: "AGILITY" },
  ];

  const tabContent = [
    {
      label: "Overview",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "Strength, power and speed are ever increasingly key components in the modern game, yet are often overlooked, or poorly trained, throughout the football world. Alike buying a car, we do not consider solely the size of the fuel tank, but more so the miles per gallon, speed, acceleration and physical output of the engine.",
            "Our individualised training sessions and programs are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact.",
            "In-depth programming with a high attention to detail. With a new player, we test first and organise the key goals for physical development. Programming is individualised with these in mind to make the greatest impact to performance."
          ]}
        />
      )
    },
    {
      label: "In-Person",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "In-person training sessions are available for UK-based players at our partner facilities. Each session is tailored to your specific physical profile and positional demands.",
            "Our SPS coach works 1:1 to offer full support during sessions with cues, technique corrections, and real-time program adjustments to maximise your development.",
            "Sessions include comprehensive warm-ups, position-specific drills, and recovery protocols to ensure you get the most out of every training session while minimising injury risk."
          ]}
        />
      )
    },
    {
      label: "Online",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "For players abroad, we provide remote support via FaceTime and video analysis. Your program is delivered digitally with detailed video demonstrations and written guidance.",
            "Our program is available in 6 or 12-month formats, adjusted to your club and individual schedule, season phase, and other factors affecting your training load.",
            "Daily support is provided via messaging, with regular video check-ins to review technique and make program adjustments based on your progress and feedback."
          ]}
        />
      )
    }
  ];

  const spsServices = [
    {
      title: "STRENGTH, POWER & SPEED TRAINING",
      subtitle: "IN-PERSON SESSIONS",
      description: "In-person training sessions are available for UK-based players at our partner facilities. Each session is tailored to your specific physical profile and positional demands. Our SPS coach works 1:1 to offer full support during sessions.",
      features: [
        "Personalised physical assessment",
        "Technique corrections in real-time",
        "Comprehensive warm-up protocols"
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png",
      price: "FROM £120.00",
    },
    {
      title: "STRENGTH, POWER & SPEED PROGRAMMING",
      subtitle: "REMOTE SUPPORT",
      description: "For players abroad, we provide remote support via FaceTime and video analysis. Your program is delivered digitally with detailed video demonstrations and written guidance. Available in 6 or 12-month formats.",
      features: [
        "Video demonstrations included",
        "Daily messaging support",
        "Monthly program adjustments"
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png",
      price: "FROM £200.00",
    },
  ];

  return (
    <ServicePageLayout
      category="STRENGTH, POWER & SPEED"
      title="RUN LIKE A SPORTS CAR, NOT A HATCHBACK"
      heroVideo="/videos/strength-power-speed-hero.mp4"
      heroVideoWithBorders
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

      {/* Our SPS Services */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>OUR SPS SERVICES</ServiceSectionTitle>
          
          <div className="space-y-6 max-w-6xl mx-auto mt-4">
            {spsServices.map((service, index) => (
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

      {/* Programming Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>PROGRAMMING</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4 grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
            <div className="rounded-xl overflow-hidden shadow-xl shadow-accent/5 border border-white/10">
              <img 
                src="https://static.wixstatic.com/media/c4f4b1_a6c9eb3e990c426385f9e145c4eec75c~mv2.png/v1/fill/w_600,h_339,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/e_g_.png"
                alt="Programming Example"
                className="w-full"
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3 text-white/80 text-sm md:text-base">
                <p>In-person training sessions for UK players and remote support for those abroad via FaceTime.</p>
                <p>Tailored components based on position and physical capabilities, maximising the player's threshold.</p>
                <p>Our program is available in 6 or 12-month programming, adjusted to your club and individual schedule, season, and other factors affecting your training.</p>
              </div>
              
              <div className="py-4">
                <h3 className="font-bebas text-lg md:text-xl text-accent leading-relaxed">
                  REDUCE THE RISK OF INJURY • TURN EVERY 50:50 IN YOUR FAVOUR • DEVELOP FASTER
                </h3>
              </div>
              
              <LocalizedLink to="/contact">
                <Button variant="outline" className="font-bebas tracking-wider border-white/30 text-white hover:border-accent hover:text-accent">
                  SEE EXAMPLE
                </Button>
              </LocalizedLink>
            </div>
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

export default StrengthPowerSpeed;
