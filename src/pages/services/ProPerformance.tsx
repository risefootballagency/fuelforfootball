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

const ProPerformance = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_fa44f917083b4628bdadc5a271e841f8~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Receiving%20(1).png", label: t("pro.pillar_strength", "STRENGTH") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f23f93ab7f54ed4a8bd8fa19a26271f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Passing.png", label: t("pro.pillar_conditioning", "CONDITIONING") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_2669a5c5489d46eb8d08d0c4a00a2c23~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dribbling.png", label: t("pro.pillar_nutrition", "NUTRITION") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_6424db6835ec4e968f7d1b5c317cc4fa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Finishing.png", label: t("pro.pillar_technique", "TECHNIQUE") },
  ];

  const tabContent = [
    {
      label: t("pro.tab_overview", "Overview"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("services_pro_performance.overview_1", "Our Pro Performance Programme offers a comprehensive range of individualised services, including nutrition, strength, power and speed, technical, conditioning, mobility, injury prevention and recovery programming."),
            t("services_pro_performance.overview_2", "With our expert team of coaches and specialists, you will have everything you need to be at your best throughout the season."),
            t("services_pro_performance.overview_3", "Our individualised training sessions and programs are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact."),
          ]}
        />
      )
    },
    {
      label: t("pro.tab_sps", "Strength, Power & Speed"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("pro.sps_p1", "In-depth programming with a high attention to detail. With a new player, we test first and organise the key goals for physical development."),
            t("pro.sps_p2", "Programming is individualised with these in mind to make the greatest impact to performance. Our SPS coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations."),
            t("pro.sps_p3", "New phases are programmed to always know exactly what to focus on in the next sessions."),
          ]}
        />
      )
    },
    {
      label: t("pro.tab_conditioning", "Conditioning"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("pro.conditioning_p1", "Bespoke conditioning drills with position-specific and individualised work ratios to ensure you can perform at your peak for the full 90 minutes."),
            t("pro.conditioning_p2", "Periodisation to ensure progression and avoid overtraining, with monitoring of performance metrics to track progress."),
            t("pro.conditioning_p3", "Monthly review and redesign of programming around club schedule and personal load."),
          ]}
        />
      )
    },
    {
      label: t("pro.tab_nutrition", "Nutrition"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("pro.nutrition_p1", "Comprehensive nutritional review designed specifically for football players to optimise your match day preparation and recovery."),
            t("pro.nutrition_p2", "We thoroughly discuss each of your unique needs and goals, ensuring your programming impacts your performance both on and off the pitch."),
            t("pro.nutrition_p3", "Tailored meal plans and guidance to fuel your training and competition needs."),
          ]}
        />
      )
    },
    {
      label: t("pro.tab_technique", "Technique"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("pro.technique_p1", "Technical aspects are the cornerstone of a player's game. Our tailored technical training services are dedicated to honing your control over the ball."),
            t("pro.technique_p2", "Evidence-based approaches and methods of training to develop receiving, passing, dribbling, and finishing skills."),
            t("pro.technique_p3", "Sessions tailored to your position, playing style, and the specific technical areas you need to develop."),
          ]}
        />
      )
    }
  ];

  const benefits = [
    t("services_pro_performance.benefit_1", "Every aspect of training programmed with close 1:1 support from our team"),
    t("services_pro_performance.benefit_2", "Perfect for eliminating all doubts about training"),
    t("services_pro_performance.benefit_3", "The most assured way to improve"),
    t("services_pro_performance.benefit_4", "Training like the top players in the world do e.g. Cristiano Ronaldo and his performance team"),
  ];

  return (
    <ServicePageLayout
      category={t("pro.category", "PRO PERFORMANCE PROGRAMME")}
      title={t("pro.hero_title", "RUN THE SHOW")}
      heroVideo="/videos/pro-performance-hero.mp4"
      heroVideoWithBorders
      statsPageKey="pro-performance"
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
          <ServiceSectionTitle>{t("pro.section_detail", "IN DETAIL")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceDetailTabs tabs={tabContent} />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("pro.section_programming", "IN-DEPTH PROGRAMMING")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceContentBlock
              paragraphs={[
                t("services_pro_performance.programming_1", "In-depth programming with a high attention to detail. With a new player, we test first and organise the key goals for physical development. Programming is individualised with these in mind to make the greatest impact to performance."),
                t("services_pro_performance.programming_2", "Our SPS coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations. New phases are programmed to always know exactly what to focus on in the next sessions."),
              ]}
            />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("pro.section_included", "WHAT'S INCLUDED")}</ServiceSectionTitle>
          <p className="text-white/80 text-center max-w-4xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
            {t("services_pro_performance.included_desc", "The PPP includes programming of nutrition, strength power and speed, conditioning and technical training. The player works with our experts to ensure that they have every aspect of their physical preparation, recovery and development covered.")}
          </p>
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-center hover:border-accent/30 transition-colors">
                <span className="text-xs md:text-sm text-white/80">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-bebas text-2xl md:text-3xl text-white mb-4">{t("pro.build_own", "BUILD YOUR OWN PROGRAMME")}</h3>
            <p className="text-white/70 text-sm md:text-base mb-6 leading-relaxed">
              {t("pro.build_own_desc", "Want to customize your training? Select individual services to create a personalized programme that fits your specific needs and goals.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/customisation" className="inline-flex items-center justify-center gap-2 bg-accent text-black font-bebas tracking-wider py-3 px-8 rounded-xl hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30">
                <span>{t("pro.customize_btn", "CUSTOMIZE YOUR PACKAGE")}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="/elite-performance" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bebas tracking-wider py-3 px-8 rounded-xl hover:border-accent hover:text-accent transition-all duration-300">
                <span>{t("pro.view_elite_btn", "VIEW ELITE PROGRAMME")}</span>
              </a>
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

export default ProPerformance;
