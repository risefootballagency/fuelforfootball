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

const ElitePerformance = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_fa44f917083b4628bdadc5a271e841f8~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Receiving%20(1).png", label: t("elite.pillar_analysis", "ANALYSIS") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f23f93ab7f54ed4a8bd8fa19a26271f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Passing.png", label: t("elite.pillar_physical", "PHYSICAL") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_2669a5c5489d46eb8d08d0c4a00a2c23~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dribbling.png", label: t("elite.pillar_psychology", "PSYCHOLOGY") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_6424db6835ec4e968f7d1b5c317cc4fa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Finishing.png", label: t("elite.pillar_nutrition", "NUTRITION") },
  ];

  const tabContent = [
    {
      label: t("elite.tab_overview", "Overview"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("elite.overview_p1", "Our Elite Performance Programme is trusted by players across Europe's top 5 leagues to elevate every aspect of their game. The use of a dedicated performance team, as recognised by the very best like Cristiano Ronaldo, is pivotal to truly reach your potential."),
            t("elite.overview_p2", "From boosting sprint speed by up to 20% season-on-season to improving conditioning for late-game dominance, we develop individualised programming specifically designed for your unique needs, capacity and schedule."),
            t("elite.overview_p3", "Our expert coaches will help you fine-tune your skillset to reach new heights while remaining sharp throughout the season."),
          ]}
        />
      )
    },
    {
      label: t("elite.tab_analysis", "Analysis"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("elite.analysis_p1", "Pre-match opposition analysis is delivered to our players at the start of the match week, giving time to absorb the information and use it in preparation. Unlike the analysis delivered at club-level, we focus in much greater detail on what is important to you for a strong individual performance."),
            t("elite.analysis_p2", "With a breakdown of the opposition scheme, we allow you to know which options are likely to be free at which times, improving decision-making."),
            t("elite.analysis_p3", "In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses."),
          ]}
        />
      )
    },
    {
      label: t("elite.tab_physical", "Physical"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("elite.physical_p1", "You will go through a specific needs-analysis and then the relevant fitness testing to determine what your training priorities should be."),
            t("elite.physical_p2", "In-depth programming with a high attention to detail. With a new player, we test first and organise the key goals for physical development."),
            t("elite.physical_p3", "Our SPS coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations."),
          ]}
        />
      )
    },
    {
      label: t("elite.tab_psychology", "Psychology"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("elite.psychology_p1", "In psychological performance sessions we aim to give you a mental edge by boosting consistency, composure, commitment, confidence, and concentration levels."),
            t("elite.psychology_p2", "We progressively work on each component and through one-to-one sessions, to raise your performance levels via the development of mental toughness."),
            t("elite.psychology_p3", "Psychological development aims to enhance mental skills that directly impact on-pitch success."),
          ]}
        />
      )
    },
    {
      label: t("elite.tab_nutrition", "Nutrition"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("elite.nutrition_p1", "We offer a comprehensive nutritional review designed specifically for football players."),
            t("elite.nutrition_p2", "We will thoroughly discuss each of your unique needs and goals, ensuring your programming impacts your performance both on and off the pitch."),
            t("elite.nutrition_p3", "This will give great insight to the needed dietary adjustments to take your game to another level."),
          ]}
        />
      )
    }
  ];

  const includedServices = [
    t("elite.included_nutrition", "Nutrition Programming"),
    t("elite.included_sps", "Strength, Power & Speed Programming"),
    t("elite.included_conditioning", "Conditioning Programming"),
    t("elite.included_technical", "Technical Programming"),
    t("elite.included_recovery", "Recovery, Injury Prevention & Mobility"),
    t("elite.included_prematch", "Pre-Match Opposition Analysis"),
    t("elite.included_postmatch", "Post-Match Performance Analysis"),
    t("elite.included_mental", "Mental Skill and Will Sessions"),
    t("elite.included_consultations", "Unlimited Consultations"),
    t("elite.included_reports", "Player Efficiency Reports"),
    t("elite.included_mentorship", "Mentorship"),
    t("elite.included_plans", "All Plans & E-Books"),
  ];

  return (
    <ServicePageLayout
      category={t("elite.category", "ELITE PERFORMANCE PROGRAMME")}
      title={t("elite.hero_title", "THE FULL PACKAGE")}
      heroVideo="/videos/players-hero.mp4"
      heroVideoWithBorders
      statsPageKey="elite-performance"
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
          <ServiceSectionTitle>{t("elite.section_including", "INCLUDING")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceDetailTabs tabs={tabContent} />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("elite.section_comprehensive", "COMPREHENSIVE SERVICE")}</ServiceSectionTitle>
          <p className="text-white/80 text-center max-w-4xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
            {t("services.elite_performance.comprehensive_desc", "Our comprehensive service encompasses all aspects essential for peak performance:")}
          </p>
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3">
            {includedServices.map((service, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-center hover:border-accent/30 transition-colors">
                <span className="text-xs md:text-sm text-white/80">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("elite.section_mentorship", "MENTORSHIP")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceContentBlock
              paragraphs={[
                t("services.elite_performance.mentorship_1", "Mentoring consists of a long-term relationship focused on supporting the growth and development of yourself either as player, coach or trainer. The mentor, being the most suitable member of our team for your role, becomes a source of wisdom, teaching, and support as they work 1:1 with you to accelerate your career progress."),
                t("services.elite_performance.mentorship_2", "This is a completely individualised process, whereby a real connection is built. Your mentor will adapt their approach to reflect that. Some prefer to bring questions and work through Q&A, others will bring up topics and request workshops to gain insight."),
                t("services.elite_performance.mentorship_3", "More options include talking casually about the day-to-day and having back and forth dialogue about important situations. Ultimately, however you prefer to work, this can be accommodated."),
              ]}
            />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-bebas text-2xl md:text-3xl text-white mb-4">{t("elite.build_own", "BUILD YOUR OWN PROGRAMME")}</h3>
            <p className="text-white/70 text-sm md:text-base mb-6 leading-relaxed">
              {t("elite.build_own_desc", "Want to customize your training? Select individual services to create a personalized programme that fits your specific needs and budget.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/customisation" className="inline-flex items-center justify-center gap-2 bg-accent text-black font-bebas tracking-wider py-3 px-8 rounded-xl hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30">
                <span>{t("elite.customize_btn", "CUSTOMIZE YOUR PACKAGE")}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="/pro-performance" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bebas tracking-wider py-3 px-8 rounded-xl hover:border-accent hover:text-accent transition-all duration-300">
                <span>{t("elite.view_pro_btn", "VIEW PRO PROGRAMME")}</span>
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

export default ElitePerformance;
