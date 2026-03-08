import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Target, Lightbulb, Shield, CheckCircle2 } from "lucide-react";
import {
  ServicePageLayout,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";

const Mentorship = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_fa44f917083b4628bdadc5a271e841f8~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Receiving%20(1).png", label: t("mentorship.pillar_support", "SUPPORT") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f23f93ab7f54ed4a8bd8fa19a26271f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Passing.png", label: t("mentorship.pillar_goals", "GOALS") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_2669a5c5489d46eb8d08d0c4a00a2c23~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dribbling.png", label: t("mentorship.pillar_wisdom", "WISDOM") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_6424db6835ec4e968f7d1b5c317cc4fa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Finishing.png", label: t("mentorship.pillar_resilience", "RESILIENCE") },
  ];

  const mentorshipPillars = [
    {
      icon: Heart,
      title: t("services_mentorship.pillar_support_title", "Personal Support"),
      description: t("services_mentorship.pillar_support_desc", "Regular one-on-one sessions providing guidance, motivation, and emotional support throughout your journey.")
    },
    {
      icon: Target,
      title: t("services_mentorship.pillar_goals_title", "Goal Setting"),
      description: t("services_mentorship.pillar_goals_desc", "Work with your mentor to set realistic, achievable goals and create actionable plans to reach them.")
    },
    {
      icon: Lightbulb,
      title: t("services_mentorship.pillar_wisdom_title", "Career Wisdom"),
      description: t("services_mentorship.pillar_wisdom_desc", "Benefit from the experience of those who have navigated the football industry successfully.")
    },
    {
      icon: Shield,
      title: t("services_mentorship.pillar_resilience_title", "Mental Resilience"),
      description: t("services_mentorship.pillar_resilience_desc", "Develop the psychological tools needed to handle pressure, setbacks, and the demands of professional football.")
    }
  ];

  const mentorshipBenefits = [
    t("services_mentorship.benefit_1", "Access to experienced professionals who have played at the highest levels"),
    t("services_mentorship.benefit_2", "Regular check-ins and progress reviews"),
    t("services_mentorship.benefit_3", "Personalized guidance tailored to your specific situation"),
    t("services_mentorship.benefit_4", "Network connections and introductions"),
    t("services_mentorship.benefit_5", "Career advice and decision-making support"),
    t("services_mentorship.benefit_6", "Life skills development for off-pitch success"),
    t("services_mentorship.benefit_7", "Confidential and supportive environment"),
    t("services_mentorship.benefit_8", "Long-term relationship building")
  ];

  const programmes = [
    {
      title: t("services_mentorship.youth_title", "Youth Development Programme"),
      description: t("services_mentorship.youth_desc", "For aspiring young players aged 12-18 looking to navigate the academy system."),
      features: [
        t("services_mentorship.youth_feature_1", "Monthly mentor sessions"),
        t("services_mentorship.youth_feature_2", "Parent involvement"),
        t("services_mentorship.youth_feature_3", "Academic balance guidance"),
        t("services_mentorship.youth_feature_4", "Character development")
      ],
      price: t("services_mentorship.youth_price", "From £150/month"),
      link: "/services"
    },
    {
      title: t("services_mentorship.pro_title", "Pro Mentorship"),
      description: t("services_mentorship.pro_desc", "For professional players seeking guidance on career decisions and personal growth."),
      features: [
        t("services_mentorship.pro_feature_1", "Weekly mentor sessions"),
        t("services_mentorship.pro_feature_2", "Career strategy"),
        t("services_mentorship.pro_feature_3", "Media training"),
        t("services_mentorship.pro_feature_4", "Financial guidance")
      ],
      price: t("services_mentorship.pro_price", "From £300/month"),
      link: "/services"
    },
  ];

  return (
    <ServicePageLayout
      category={t("mentorship.category", "MENTORSHIP")}
      title={t("mentorship.hero_title", "GUIDANCE FOR SUCCESS")}
      heroVideo="/videos/players-hero.mp4"
      heroVideoWithBorders
      statsPageKey="mentorship"
    >
      {/* Pillars Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <ServicePillars pillars={pillars} large />
        </div>
      </section>

      {/* The Four Pillars Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("mentorship.section_pillars", "THE FOUR PILLARS")}</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentorshipPillars.map((pillar, index) => (
              <div 
                key={index}
                className="group bg-black/40 border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-xl text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <pillar.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-bebas text-2xl text-accent mb-2">{pillar.title}</h3>
                <p className="text-white/70 text-sm">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Mentorship Matters */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("mentorship.section_why", "WHY MENTORSHIP MATTERS")}</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4 grid md:grid-cols-2 gap-12 items-center">
            <ServiceContentBlock
              paragraphs={[
                t("services_mentorship.why_matters_p1", "The football industry can be challenging to navigate alone. Having an experienced mentor by your side provides invaluable guidance, helping you avoid common pitfalls and make better decisions for your career."),
                t("services_mentorship.why_matters_p2", "Our mentors have been where you are now. They understand the pressures, the sacrifices, and the rewards of pursuing a football career. They're here to share their wisdom and help you write your own success story."),
              ]}
            />
            <div className="bg-black/40 border border-white/10 rounded-xl p-8">
              <h3 className="font-bebas text-2xl text-accent mb-6">{t("services_mentorship.key_benefits", "KEY BENEFITS")}</h3>
              <ul className="space-y-3">
                {mentorshipBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-white/70 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>OUR PROGRAMMES</ServiceSectionTitle>
          
          <p className="text-white/80 text-center max-w-4xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
            {t("services_mentorship.our_programmes_desc", "Choose the mentorship programme that best fits your current stage and goals.")}
          </p>
          
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {programmes.map((programme, index) => (
              <div 
                key={index}
                className="bg-black/40 border-2 border-white/10 rounded-xl p-8 hover:border-accent/50 transition-all duration-300"
              >
                <h3 className="font-bebas text-2xl text-accent mb-3">{programme.title}</h3>
                <p className="text-white/70 text-sm mb-6">{programme.description}</p>
                <ul className="space-y-2 mb-6">
                  {programme.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-accent">{programme.price}</p>
                  <LocalizedLink to={programme.link}>
                    <Button variant="outline" className="font-bebas tracking-wider border-accent text-accent hover:bg-accent hover:text-black">
                      LEARN MORE
                    </Button>
                  </LocalizedLink>
                </div>
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

export default Mentorship;
