import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const Technical = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_fa44f917083b4628bdadc5a271e841f8~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Receiving%20(1).png", label: t("technical.pillar_receiving", "RECEIVING") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_0f23f93ab7f54ed4a8bd8fa19a26271f~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Passing.png", label: t("technical.pillar_passing", "PASSING") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_2669a5c5489d46eb8d08d0c4a00a2c23~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dribbling.png", label: t("technical.pillar_dribbling", "DRIBBLING") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_6424db6835ec4e968f7d1b5c317cc4fa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Finishing.png", label: t("technical.pillar_finishing", "FINISHING") },
  ];

  const concepts = [
    t("technical.concept_paradigms", "Training paradigms (behaviourism, cognitivism, constructivism)"),
    t("technical.concept_cards", "CARDS"),
    t("technical.concept_embodied", "Embodied cognition"),
    t("technical.concept_realism", "Game realism"),
    t("technical.concept_ventral", "Ventral and Dorsal processing"),
    t("technical.concept_noncog", "Non-cognitive processing"),
    t("technical.concept_stability", "Stability bias"),
    t("technical.concept_problem", "Problem-creating"),
    t("technical.concept_learning", "Learning-rich environments"),
    t("technical.concept_constraints", "Constraints-based approaches"),
    t("technical.concept_dynamic", "Dynamic practice"),
    t("technical.concept_perception", "Perception-action coupling"),
    t("technical.concept_perceptual", "Perceptual-motor landscape"),
    t("technical.concept_degeneracy", "Degeneracy"),
    t("technical.concept_variability", "Structure variability")
  ];

  const tabContent = [
    {
      label: t("technical.tab_overview", "Overview"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("technical.overview_p1", "Technical aspects are the cornerstone of a player's game. Ball mastery can mean the difference between a missed opportunity and a spectacular goal, a fumbled pass and a game-changing assist. Our tailored technical training services are dedicated to honing your control over the ball and creating the ability to play precise passes, dribble, cut at speed, and finish with high accuracy."),
            t("technical.overview_p2", "Players are quick to acknowledge the need for expert coaching when it comes to the physical aspects of the game - both primary (strength, power, speed, conditioning) and secondary (nutrition). When it comes to technical aspects of play, however, there is a tendency to assume it can be done to the highest level by oneself. Some might stumble upon great training, but there are well-understood, reliable evidence-based approaches and methods of training which most players will miss out on.")
          ]}
        />
      )
    },
    {
      label: t("technical.tab_in_person", "In-Person"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("technical.in_person_p1", "Our in-person technical training sessions take place across the UK with our expert technical coaches. Unlike 1 to 1 sessions you may have seen online, our analysts break your game down in detail before training to key in on the details that actually matter for improving."),
            t("technical.in_person_p2", "We mainly work through workshops: for understanding new ideas, keying in on areas for development, walking through correct technique and decision-making in high detail. Sessions are tailored to your position, playing style, and the specific technical areas you need to develop."),
            t("technical.in_person_p3", "Our individualised training sessions are designed to fit your individual needs, pushing you to new limits, reducing the incidence of injury and helping you maximise your on-pitch impact.")
          ]}
        />
      )
    },
    {
      label: t("technical.tab_online", "Online"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("technical.online_p1", "For players abroad or those unable to attend in-person sessions, we offer comprehensive online technical support. This includes detailed video analysis of your technique with personalised feedback and improvement plans."),
            t("technical.online_p2", "In-depth programming with a high attention to detail. Programming is individualised to improve the key technical aspects for improving performance on the pitch. Our technical coach works 1:1 to offer full support on a daily basis with cues, advice and program alterations."),
            t("technical.online_p3", "Remote sessions via video call allow our coaches to provide real-time feedback and guidance, ensuring you receive the same quality of coaching regardless of your location.")
          ]}
        />
      )
    }
  ];

  const technicalServices = [
    {
      title: t("technical.service1_title", "TECHNICAL TRAINING"),
      subtitle: t("technical.service1_subtitle", "IN-PERSON SESSIONS"),
      description: t("technical.service1_desc", "Our in-person technical training sessions take place across the UK with our expert technical coaches. Unlike 1 to 1 sessions you may have seen online, our analysts break your game down in detail before training to key in on the details that actually matter."),
      features: [
        t("technical.service1_f1", "Video analysis before sessions"),
        t("technical.service1_f2", "Workshop-style coaching"),
        t("technical.service1_f3", "Position-specific training")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png",
      price: t("technical.service1_price", "FROM £120.00"),
    },
    {
      title: t("technical.service2_title", "TECHNICAL PROGRAMMING"),
      subtitle: t("technical.service2_subtitle", "REMOTE SUPPORT"),
      description: t("technical.service2_desc", "In-depth programming with a high attention to detail. Programming is individualised to improve the key technical aspects for improving performance on the pitch. Our technical coach works 1:1 to offer full support."),
      features: [
        t("technical.service2_f1", "Detailed video analysis"),
        t("technical.service2_f2", "Personalised improvement plans"),
        t("technical.service2_f3", "Daily coaching support")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png",
      price: t("technical.service2_price", "FROM £200.00"),
    },
  ];

  return (
    <ServicePageLayout
      category={t("technical.category", "TECHNICAL")}
      title={t("technical.hero_title", "CONTROL THE BALL, CONTROL THE GAME")}
      heroVideo="/videos/technical-hero.mp4"
      heroVideoWithBorders
      statsPageKey="technical"
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
          <ServiceSectionTitle>{t("technical.section_detail", "IN DETAIL")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceDetailTabs tabs={tabContent} />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("technical.section_services", "OUR TECHNICAL SERVICES")}</ServiceSectionTitle>
          <div className="space-y-6 max-w-6xl mx-auto mt-4">
            {technicalServices.map((service, index) => (
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
          <ServiceSectionTitle>{t("technical.section_more_than_cones", "MORE THAN CONES")}</ServiceSectionTitle>
          <p className="text-white/80 text-center max-w-4xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
            {t("technical.more_than_cones_desc", "Our technical sessions take a scientific approach to developing technical skills and include ideas such as:")}
          </p>
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3">
            {concepts.map((concept, index) => (
              <div 
                key={index} 
                className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-center hover:border-accent/30 transition-colors"
              >
                <span className="text-xs md:text-sm text-white/80">{concept}</span>
              </div>
            ))}
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

export default Technical;
