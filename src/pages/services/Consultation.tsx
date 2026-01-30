import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Target, ClipboardCheck, TrendingUp, Calendar, FileText, MessageSquare, ArrowRight } from "lucide-react";
import {
  ServicePageLayout,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";

const Consultation = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_fa44f917083b4628bdadc5a271e841f8~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Receiving%20(1).png", label: "PLAYER REVIEW" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f23f93ab7f54ed4a8bd8fa19a26271f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Passing.png", label: "CAREER STRATEGY" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_2669a5c5489d46eb8d08d0c4a00a2c23~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dribbling.png", label: "PERFORMANCE ANALYSIS" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_6424db6835ec4e968f7d1b5c317cc4fa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Finishing.png", label: "DEVELOPMENT PLAN" },
  ];

  const consultationServices = [
    {
      icon: Users,
      title: t("services_consultation.player_review_title", "Player Review"),
      description: t("services_consultation.player_review_desc", "Comprehensive evaluation of current abilities, potential, and areas for development with actionable insights."),
      price: t("services_consultation.player_review_price", "From £95")
    },
    {
      icon: Target,
      title: t("services_consultation.career_strategy_title", "Career Strategy Session"),
      description: t("services_consultation.career_strategy_desc", "One-on-one strategic planning to map out your football career goals and the steps to achieve them."),
      price: t("services_consultation.career_strategy_price", "From £150")
    },
    {
      icon: ClipboardCheck,
      title: t("services_consultation.performance_analysis_title", "Performance Analysis"),
      description: t("services_consultation.performance_analysis_desc", "In-depth match and training analysis to identify strengths and areas requiring improvement."),
      price: t("services_consultation.performance_analysis_price", "From £120")
    },
    {
      icon: TrendingUp,
      title: t("services_consultation.development_plan_title", "Development Plan"),
      description: t("services_consultation.development_plan_desc", "Customized long-term development roadmap with measurable milestones and progression targets."),
      price: t("services_consultation.development_plan_price", "From £200")
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: t("services_consultation.step_1_title", "Initial Contact"),
      description: t("services_consultation.step_1_desc", "Reach out to discuss your needs and goals. We'll understand your situation and requirements.")
    },
    {
      step: "02",
      title: t("services_consultation.step_2_title", "Assessment"),
      description: t("services_consultation.step_2_desc", "We conduct a thorough evaluation of your current position, abilities, and aspirations.")
    },
    {
      step: "03",
      title: t("services_consultation.step_3_title", "Strategy Development"),
      description: t("services_consultation.step_3_desc", "Based on our assessment, we develop a tailored strategy and action plan.")
    },
    {
      step: "04",
      title: t("services_consultation.step_4_title", "Implementation Support"),
      description: t("services_consultation.step_4_desc", "Ongoing guidance and support as you work through your personalized development plan.")
    }
  ];

  return (
    <ServicePageLayout
      category="GENERAL"
      title="CONSULTATION"
      heroVideo="/videos/players-hero.mp4"
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

      {/* What We Offer Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>WHAT WE OFFER</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceContentBlock
              paragraphs={[
                t("services_consultation.hero_desc", "Expert consultation services tailored to your specific needs. Whether you're a player, parent, or club, we provide professional advice to help you make informed decisions and achieve your football goals."),
                t("services_consultation.what_we_offer_desc", "Our consultation services cover every aspect of football performance and career development."),
              ]}
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>OUR SERVICES</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {consultationServices.map((service, index) => (
              <div 
                key={index}
                className="group bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-bebas text-xl md:text-2xl text-accent mb-2">{service.title}</h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">{service.description}</p>
                <p className="text-base font-semibold text-accent">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>HOW IT WORKS</ServiceSectionTitle>
          
          <p className="text-white/80 text-center max-w-4xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
            {t("services_consultation.how_it_works_desc", "Our consultation process is designed to be straightforward and effective.")}
          </p>
          
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="p-6 rounded-lg bg-black/40 border border-white/10 h-full">
                  <div className="text-4xl md:text-5xl font-bebas text-accent/30 mb-2">{step.step}</div>
                  <h3 className="font-bebas text-lg md:text-xl uppercase tracking-wider mb-2 text-white">{step.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-accent/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>WHO IT'S FOR</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 md:p-8 bg-black/40 border border-white/10 rounded-lg">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-bebas text-xl md:text-2xl text-accent mb-3">{t("services_consultation.for_players", "Players")}</h3>
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {t("services_consultation.for_players_desc", "Get expert guidance on your development, career decisions, and pathway to professional football.")}
              </p>
            </div>

            <div className="text-center p-6 md:p-8 bg-black/40 border border-white/10 rounded-lg">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-bebas text-xl md:text-2xl text-accent mb-3">{t("services_consultation.for_parents", "Parents")}</h3>
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {t("services_consultation.for_parents_desc", "Understand the football industry and make informed decisions about your child's development and opportunities.")}
              </p>
            </div>

            <div className="text-center p-6 md:p-8 bg-black/40 border border-white/10 rounded-lg sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-bebas text-xl md:text-2xl text-accent mb-3">{t("services_consultation.for_clubs", "Clubs")}</h3>
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {t("services_consultation.for_clubs_desc", "Receive strategic advice on player recruitment, development programs, and performance optimization.")}
              </p>
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

export default Consultation;
