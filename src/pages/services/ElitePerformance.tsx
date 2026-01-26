import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceCard,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";

const ElitePerformance = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'physical' | 'psychology' | 'nutrition'>('overview');

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_fa44f917083b4628bdadc5a271e841f8~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Receiving%20(1).png", label: "ANALYSIS" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f23f93ab7f54ed4a8bd8fa19a26271f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Passing.png", label: "PHYSICAL" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_2669a5c5489d46eb8d08d0c4a00a2c23~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dribbling.png", label: "PSYCHOLOGY" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_6424db6835ec4e968f7d1b5c317cc4fa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Finishing.png", label: "NUTRITION" },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "analysis", label: "Analysis" },
    { id: "physical", label: "Physical" },
    { id: "psychology", label: "Psychology" },
    { id: "nutrition", label: "Nutrition" },
  ];

  const tabContent: Record<string, { paragraphs: string[] }> = {
    overview: {
      paragraphs: [
        "Our Elite Performance Programme is trusted by players across Europe's top 5 leagues to elevate every aspect of their game. The use of a dedicated performance team, as recognised by the very best like Cristiano Ronaldo, is pivotal to truly reach your potential.",
        "From boosting sprint speed by up to 20% season-on-season to improving conditioning for late-game dominance, we develop individualised programming specifically designed for your unique needs, capacity and schedule.",
        "Our expert coaches will help you fine-tune your skillset to reach new heights while remaining sharp throughout the season."
      ]
    },
    analysis: {
      paragraphs: [
        "Pre-match opposition analysis is delivered to our players at the start of the match week, giving time to absorb the information and use it in preparation. Unlike the analysis delivered at club-level, we focus in much greater detail on what is important to you for a strong individual performance.",
        "With a breakdown of the opposition scheme, we allow you to know which options are likely to be free at which times, improving decision-making.",
        "In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses."
      ]
    },
    physical: {
      paragraphs: [
        "You will go through a specific needs-analysis and then the relevant fitness testing to determine what your training priorities should be.",
        "In-depth programming with a high attention to detail. With a new player, we test first and organise the key goals for physical development.",
        "Our SPS coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations."
      ]
    },
    psychology: {
      paragraphs: [
        "In psychological performance sessions we aim to give you a mental edge by boosting consistency, composure, commitment, confidence, and concentration levels.",
        "We progressively work on each component and through one-to-one sessions, to raise your performance levels via the development of mental toughness.",
        "Psychological development aims to enhance mental skills that directly impact on-pitch success."
      ]
    },
    nutrition: {
      paragraphs: [
        "We offer a comprehensive nutritional review designed specifically for football players.",
        "We will thoroughly discuss each of your unique needs and goals, ensuring your programming impacts your performance both on and off the pitch.",
        "This will give great insight to the needed dietary adjustments to take your game to another level."
      ]
    }
  };

  const includedServices = [
    "Nutrition Programming",
    "Strength, Power & Speed Programming",
    "Conditioning Programming",
    "Technical Programming",
    "Recovery, Injury Prevention & Mobility",
    "Pre-Match Opposition Analysis",
    "Post-Match Performance Analysis",
    "Mental Skill and Will Sessions",
    "Unlimited Consultations",
    "Player Efficiency Reports",
    "Mentorship",
    "All Plans & E-Books"
  ];

  return (
    <ServicePageLayout
      category="HOLISTIC"
      title="ELITE PERFORMANCE\nTHE FULL PACKAGE"
      heroVideo="/videos/players-hero.mp4"
    >
      <ServicePillars pillars={pillars} />

      {/* In Detail Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>INCLUDING</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-5 py-2.5 rounded-lg font-bebas text-sm md:text-base tracking-wider transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-accent text-black' 
                    : 'bg-black/40 border border-white/20 hover:border-accent/50 text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <ServiceContentBlock
            paragraphs={tabContent[activeTab].paragraphs}
          />
        </div>
      </ServiceSection>

      {/* What's Included */}
      <ServiceSection>
        <ServiceSectionTitle>COMPREHENSIVE SERVICE</ServiceSectionTitle>
        
        <p className="text-white/80 text-center max-w-4xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
          {t("services.elite_performance.comprehensive_desc", "Our comprehensive service encompasses all aspects essential for peak performance:")}
        </p>
        
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {includedServices.map((service, index) => (
            <div 
              key={index} 
              className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-center hover:border-accent/30 transition-colors"
            >
              <span className="text-xs md:text-sm text-white/80">{service}</span>
            </div>
          ))}
        </div>
      </ServiceSection>

      {/* Mentorship Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>MENTORSHIP</ServiceSectionTitle>
        
        <ServiceContentBlock
          paragraphs={[
            t("services.elite_performance.mentorship_1", "Mentoring consists of a long-term relationship focused on supporting the growth and development of yourself either as player, coach or trainer. The mentor, being the most suitable member of our team for your role, becomes a source of wisdom, teaching, and support as they work 1:1 with you to accelerate your career progress."),
            t("services.elite_performance.mentorship_2", "This is a completely individualised process, whereby a real connection is built. Your mentor will adapt their approach to reflect that. Some prefer to bring questions and work through Q&A, others will bring up topics and request workshops to gain insight."),
            t("services.elite_performance.mentorship_3", "More options include talking casually about the day-to-day and having back and forth dialogue about important situations. Ultimately, however you prefer to work, this can be accommodated."),
          ]}
        />
      </ServiceSection>

      {/* Custom Package CTA */}
      <ServiceSection>
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-bebas text-2xl md:text-3xl text-white mb-4">BUILD YOUR OWN PROGRAMME</h3>
          <p className="text-white/70 text-sm md:text-base mb-6 leading-relaxed">
            Want to customize your training? Select individual services to create a personalized programme that fits your specific needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/customisation" className="inline-flex items-center justify-center gap-2 bg-accent text-black font-bebas tracking-wider py-3 px-8 rounded-xl hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30">
              <span>CUSTOMIZE YOUR PACKAGE</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="/pro-performance" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bebas tracking-wider py-3 px-8 rounded-xl hover:border-accent hover:text-accent transition-all duration-300">
              <span>VIEW PRO PROGRAMME</span>
            </a>
          </div>
        </div>
      </ServiceSection>
    </ServicePageLayout>
  );
};

export default ElitePerformance;
