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

const StrengthPowerSpeed = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_eb6331e862704a6baeacf4dc65adde63~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Strength.png", label: "STRENGTH" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_cf1cef6b92e74e1fb999c2e3739d2d6c~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Power.png", label: "POWER" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_a6cdb923e09d4ac4aec19e0302bdc01f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Speed.png", label: "SPEED" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f1a80188cda42339edc21be4fb126d6~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Agility.png", label: "AGILITY" },
  ];

  return (
    <ServicePageLayout
      category="STRENGTH, POWER & SPEED"
      title="RUN LIKE A SPORTS CAR\nNOT A HATCHBACK"
      heroVideo="/videos/players-hero.mp4"
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
              "Strength, power and speed are ever increasingly key components in the modern game, yet are often overlooked, or poorly trained, throughout the football world. Alike buying a car, we do not consider solely the size of the fuel tank, but more so the miles per gallon, speed, acceleration and physical output of the engine.",
              "Our individualised training sessions and programs are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact.",
              "In-depth programming with a high attention to detail. With a new player, we test first and organise the key goals for physical development. Programming is individualised with these in mind to make the greatest impact to performance. Our SPS coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations."
            ]}
          />
        </div>
      </ServiceSection>

      {/* Training Section */}
      <ServiceSection>
        <ServiceSectionTitle>TRAINING</ServiceSectionTitle>
        
        <div className="max-w-md mx-auto">
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png"
            title="Strength, Power & Speed Training"
            price="From £120.00"
            link="/contact"
            featured
          />
        </div>
      </ServiceSection>

      {/* Programming Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>PROGRAMMING</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="rounded-xl overflow-hidden shadow-xl shadow-primary/5">
            <img 
              src="https://static.wixstatic.com/media/c4f4b1_a6c9eb3e990c426385f9e145c4eec75c~mv2.png/v1/fill/w_600,h_339,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/e_g_.png"
              alt="Programming Example"
              className="w-full"
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3 text-muted-foreground text-sm md:text-base">
              <p>In-person training sessions for UK players and remote support for those abroad via FaceTime.</p>
              <p>Tailored components based on position and physical capabilities, maximising the player's threshold.</p>
              <p>Our program is available in 6 or 12-month programming, adjusted to your club and individual schedule, season, and other factors affecting your training.</p>
            </div>
            
            <div className="py-4">
              <h3 className="font-bebas text-lg md:text-xl text-primary leading-relaxed">
                REDUCE THE RISK OF INJURY • TURN EVERY 50:50 IN YOUR FAVOUR • DEVELOP FASTER
              </h3>
            </div>
            
            <LocalizedLink to="/contact">
              <Button variant="outline" className="font-bebas tracking-wider">
                SEE EXAMPLE
              </Button>
            </LocalizedLink>
          </div>
        </div>
      </ServiceSection>

      {/* Options Section */}
      <ServiceSection>
        <ServiceSectionTitle>OPTIONS</ServiceSectionTitle>
        
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png"
            title="Strength, Power & Speed Programming"
            link="/contact"
          />
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png"
            title="Strength, Power & Speed Training"
            link="/contact"
          />
        </div>
      </ServiceSection>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default StrengthPowerSpeed;
