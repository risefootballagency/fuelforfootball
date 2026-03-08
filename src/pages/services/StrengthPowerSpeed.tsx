import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_eb6331e862704a6baeacf4dc65adde63~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Strength.png", label: t("sps.pillar_strength", "STRENGTH") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_cf1cef6b92e74e1fb999c2e3739d2d6c~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Power.png", label: t("sps.pillar_power", "POWER") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_a6cdb923e09d4ac4aec19e0302bdc01f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Speed.png", label: t("sps.pillar_speed", "SPEED") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f1a80188cda42339edc21be4fb126d6~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Agility.png", label: t("sps.pillar_agility", "AGILITY") },
  ];

  const tabContent = [
    {
      label: t("sps.tab_overview", "Overview"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("sps.overview_p1", "Strength, power and speed are ever increasingly key components in the modern game, yet are often overlooked, or poorly trained, throughout the football world. Alike buying a car, we do not consider solely the size of the fuel tank, but more so the miles per gallon, speed, acceleration and physical output of the engine."),
            t("sps.overview_p2", "Our individualised training sessions and programs are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact."),
            t("sps.overview_p3", "In-depth programming with a high attention to detail. With a new player, we test first and organise the key goals for physical development. Programming is individualised with these in mind to make the greatest impact to performance.")
          ]}
        />
      )
    },
    {
      label: t("sps.tab_in_person", "In-Person"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("sps.in_person_p1", "In-person training sessions are available for UK-based players at our partner facilities. Each session is tailored to your specific physical profile and positional demands."),
            t("sps.in_person_p2", "Our SPS coach works 1:1 to offer full support during sessions with cues, technique corrections, and real-time program adjustments to maximise your development."),
            t("sps.in_person_p3", "Sessions include comprehensive warm-ups, position-specific drills, and recovery protocols to ensure you get the most out of every training session while minimising injury risk.")
          ]}
        />
      )
    },
    {
      label: t("sps.tab_online", "Online"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("sps.online_p1", "For players abroad, we provide remote support via FaceTime and video analysis. Your program is delivered digitally with detailed video demonstrations and written guidance."),
            t("sps.online_p2", "Our program is available in 6 or 12-month formats, adjusted to your club and individual schedule, season phase, and other factors affecting your training load."),
            t("sps.online_p3", "Daily support is provided via messaging, with regular video check-ins to review technique and make program adjustments based on your progress and feedback.")
          ]}
        />
      )
    }
  ];

  const spsServices = [
    {
      title: t("sps.service1_title", "STRENGTH, POWER & SPEED TRAINING"),
      subtitle: t("sps.service1_subtitle", "IN-PERSON SESSIONS"),
      description: t("sps.service1_desc", "In-person training sessions are available for UK-based players at our partner facilities. Each session is tailored to your specific physical profile and positional demands. Our SPS coach works 1:1 to offer full support during sessions."),
      features: [
        t("sps.service1_f1", "Personalised physical assessment"),
        t("sps.service1_f2", "Technique corrections in real-time"),
        t("sps.service1_f3", "Comprehensive warm-up protocols")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png",
      price: t("sps.service1_price", "FROM £120.00"),
    },
    {
      title: t("sps.service2_title", "STRENGTH, POWER & SPEED PROGRAMMING"),
      subtitle: t("sps.service2_subtitle", "REMOTE SUPPORT"),
      description: t("sps.service2_desc", "For players abroad, we provide remote support via FaceTime and video analysis. Your program is delivered digitally with detailed video demonstrations and written guidance. Available in 6 or 12-month formats."),
      features: [
        t("sps.service2_f1", "Video demonstrations included"),
        t("sps.service2_f2", "Daily messaging support"),
        t("sps.service2_f3", "Monthly program adjustments")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png",
      price: t("sps.service2_price", "FROM £200.00"),
    },
  ];

  return (
    <ServicePageLayout
      category={t("sps.category", "STRENGTH, POWER & SPEED")}
      title={t("sps.hero_title", "RUN LIKE A SPORTS CAR, NOT A HATCHBACK")}
      heroVideo="/videos/strength-power-speed-hero.mp4"
      heroVideoWithBorders
      statsPageKey="strength-power-speed"
    >
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <ServicePillars pillars={pillars} large />
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("sps.section_detail", "IN DETAIL")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceDetailTabs tabs={tabContent} />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("sps.section_services", "OUR SPS SERVICES")}</ServiceSectionTitle>
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

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("sps.section_programming", "PROGRAMMING")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4 grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
            <div className="rounded-xl overflow-hidden shadow-xl shadow-accent/5 border border-white/10">
              <img 
                src="https://static.wixstatic.com/media/c4f4b1_a6c9eb3e990c426385f9e145c4eec75c~mv2.png/v1/fill/w_600,h_339,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/e_g_.png"
                alt={t("sps.programming_img_alt", "Programming Example")}
                className="w-full"
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-3 text-white/80 text-sm md:text-base">
                <p>{t("sps.programming_p1", "In-person training sessions for UK players and remote support for those abroad via FaceTime.")}</p>
                <p>{t("sps.programming_p2", "Tailored components based on position and physical capabilities, maximising the player's threshold.")}</p>
                <p>{t("sps.programming_p3", "Our program is available in 6 or 12-month programming, adjusted to your club and individual schedule, season, and other factors affecting your training.")}</p>
              </div>
              <div className="py-4">
                <h3 className="font-bebas text-lg md:text-xl text-accent leading-relaxed">
                  {t("sps.programming_tagline", "REDUCE THE RISK OF INJURY • TURN EVERY 50:50 IN YOUR FAVOUR • DEVELOP FASTER")}
                </h3>
              </div>
              <LocalizedLink to="/contact">
                <Button variant="outline" className="font-bebas tracking-wider border-white/30 text-white hover:border-accent hover:text-accent">
                  {t("sps.see_example", "SEE EXAMPLE")}
                </Button>
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>

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
