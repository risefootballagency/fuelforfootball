import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ServicePageLayout,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceInfoCard,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";
import { ServiceOfferingCard } from "@/components/services/ServiceOfferingCard";

const Mental = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_b59f5998d4e44151801f114235ddc357~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Consistency%20(1).png", label: t("mental.pillar_consistency", "CONSISTENCY") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_6fd3b0e42de84e569be9f98ae5c93220~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Focus.png", label: t("mental.pillar_focus", "FOCUS") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_7449783a3dd94797974af0a97b3145f7~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Resilience.png", label: t("mental.pillar_resilience", "RESILIENCE") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_ce1710f714314eebba935e461609756b~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Confidence.png", label: t("mental.pillar_confidence", "CONFIDENCE") },
  ];

  const tabContent = [
    {
      label: t("mental.tab_overview", "Overview"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("mental.overview_p1", "It is the combination of skill and will which decides every victor. It does not matter how great a player you are if you suffer mental defeat to an opponent. Mastering your mind and possessing mental strength plays a pivotal role in Football. Our bespoke psychological support services aim to fortify your mind, empowering you to take on increasingly great challenges, manage pressure, and perform consistently at your highest level."),
            t("mental.overview_p2", "Whether you are battling performance anxiety, seeking to boost your mental resilience, or striving to enhance your concentration during high-stakes moments, our tailored and individualised 1:1 training will help you secure the mental edge over your competition. With Fuel for Football, you win the game with your mind, to in turn win on the pitch.")
          ]}
        />
      )
    },
    {
      label: t("mental.tab_skills", "Mental Skills"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("mental.skills_p1", "Mental skills are the foundation upon which all other abilities depend. Consistency on the pitch requires strong mental skills, a fact recognised by Sir Alex Ferguson as key to prolonged elite performance. Our Mental Skill Training focuses on developing consistency, confidence, resilience, and focus, all while maintaining complete confidentiality, most importantly including from your club's personnel."),
            t("mental.skills_p2", "We start by testing your mental skill level and comparing it to other elite athletes we have trained. Based on this assessment, we create bespoke individualised sessions tailored to your needs. These one-to-one sessions can be conducted in person or over the phone, ensuring you receive the personalised support necessary to strengthen your mental game."),
            t("mental.skills_p3", "Skills we develop include visualisation, goal-setting, positive self-talk, pre-performance routines, and concentration techniques.")
          ]}
        />
      )
    },
    {
      label: t("mental.tab_will", "Mental Will"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("mental.will_p1", "The difference between players of similar ability often lies in their mental will. With greater will than an opponent, it is possible to outperform them even with less skill. Mental will is developed like any muscle in the gym, through training."),
            t("mental.will_p2", "Mental will speaks to drive and determination. If you want something more than an opponent, it is often enough to overcome any skill deficit. This service is perfect for booking in before games to prepare the mind for action and to have the greatest performance possible."),
            t("mental.will_p3", "Our Mental Will training includes pre-match mindset conditioning, in-game mental strategies, and post-match psychological recovery.")
          ]}
        />
      )
    }
  ];

  const mentalServices = [
    {
      title: t("mental.service1_title", "PSYCHOLOGICAL PERFORMANCE"),
      subtitle: t("mental.service1_subtitle", "MENTAL WILL TRAINING"),
      description: t("mental.service1_desc", "Our psychological performance sessions provide tailored support by providing players with Mental Will training and Mindset Conditioning. Through performance reviews, players receive the support they need from game to game to develop their mental strength and increase consistency within their performance on and off the pitch."),
      features: [
        t("mental.service1_f1", "Pre-match mindset conditioning"),
        t("mental.service1_f2", "In-game mental strategies"),
        t("mental.service1_f3", "Post-match psychological recovery")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_121be4d22e6244d48dd94cacbf7bcf8c~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_121be4d22e6244d48dd94cacbf7bcf8c~mv2.png",
      price: t("mental.service1_price", "FROM £85.00"),
    },
    {
      title: t("mental.service2_title", "PSYCHOLOGICAL DEVELOPMENT"),
      subtitle: t("mental.service2_subtitle", "MENTAL SKILL TRAINING"),
      description: t("mental.service2_desc", "Psychological development is crucial for success. Mental skills sessions will help you improve your long-term psychological performance. By focusing on mental skills such as visualisation, goal-setting, and self-talk, you will develop the mental toughness and resilience needed to succeed at the highest level."),
      features: [
        t("mental.service2_f1", "Visualisation techniques"),
        t("mental.service2_f2", "Goal-setting frameworks"),
        t("mental.service2_f3", "Positive self-talk training")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_f85124e6d69542e4b4329bacafb454a3~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_f85124e6d69542e4b4329bacafb454a3~mv2.png",
      price: t("mental.service2_price", "FROM £150.00"),
    },
    {
      title: t("mental.service3_title", "FUELLED ELITE COACHING"),
      subtitle: t("mental.service3_subtitle", "COMPREHENSIVE MENTAL SUPPORT"),
      description: t("mental.service3_desc", "Complete psychological support combining both Mental Will and Mental Skill training. This comprehensive package ensures you develop both the short-term match preparation and long-term mental development needed to reach your full potential."),
      features: [
        t("mental.service3_f1", "Combined Will & Skill training"),
        t("mental.service3_f2", "Weekly 1:1 sessions"),
        t("mental.service3_f3", "24/7 support access")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_ec7282c95805482aaf5d9909b260c8ee~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_ec7282c95805482aaf5d9909b260c8ee~mv2.png",
      price: t("mental.service3_price", "FROM £300.00"),
    },
  ];

  return (
    <ServicePageLayout
      category={t("mental.category", "PSYCHOLOGICAL PERFORMANCE")}
      title={t("mental.hero_title", "SKILL + WILL = SUCCESS")}
      subtitle={t("mental.hero_subtitle", "Football is not solely about skill. The fine margins are decided by will.")}
      heroVideo="/videos/players-hero.mp4"
      heroVideoWithBorders
      statsPageKey="mental"
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
          <ServiceSectionTitle>{t("mental.section_detail", "IN DETAIL")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceDetailTabs tabs={tabContent} />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("mental.section_services", "OUR MENTAL SERVICES")}</ServiceSectionTitle>
          <div className="space-y-6 max-w-6xl mx-auto mt-4">
            {mentalServices.map((service, index) => (
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
          <ServiceSectionTitle>{t("mental.section_podcast", "PODCAST")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-xl shadow-primary/10 mb-6">
                <img 
                  src="https://static.wixstatic.com/media/c4f4b1_35ba4b19866d441e9c3da513d8efacc5~mv2.png/v1/fill/w_258,h_257,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design%20-%202024-07-13T172110_edited.png"
                  alt="Fuel For Football Podcast"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bebas text-xl md:text-2xl text-foreground mb-1">Fuel For Football</h3>
              <p className="font-bebas text-lg text-primary">{t("mental.podcast_label", "Podcast")}</p>
            </div>
            <div className="space-y-5">
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                {t("mental.podcast_desc", "Your host, sport psychologist Sanchez Bailey, provides psychological lessons for professional footballers from the heights of the Premier League right down to the grassroots level!")}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-[#1DB954] text-white font-bebas tracking-wider rounded-lg hover:opacity-90 transition-opacity text-sm">
                  Spotify
                </a>
                <a href="https://podcasts.apple.com" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-gradient-to-r from-[#9933FF] to-[#FC5C7D] text-white font-bebas tracking-wider rounded-lg hover:opacity-90 transition-opacity text-sm">
                  Apple Podcast
                </a>
              </div>
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

export default Mental;
