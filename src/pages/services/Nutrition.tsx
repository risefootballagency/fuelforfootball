import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ServicePageLayout,
  ServiceSectionTitle,
  ServiceContentBlock,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";
import { ServiceOfferingCard } from "@/components/services/ServiceOfferingCard";

const Nutrition = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: "https://static.wixstatic.com/media/c4f4b1_35ba4b19866d441e9c3da513d8efacc5~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design%20-%202024-07-13T172110_edited.png",
      title: t("nutrition.benefit1_title", "RUN FURTHER"),
      description: t("nutrition.benefit1_desc", "Proper nutrition has shown to directly impact your performance on the pitch. Studies have shown that fuelling optimally can lead to a 24% improvement in time to fatigue.")
    },
    {
      icon: "https://static.wixstatic.com/media/c4f4b1_7dc31f57fd654cc3a293f7ab6506c3ea~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Run%20Faster.png",
      title: t("nutrition.benefit2_title", "RUN FASTER"),
      description: t("nutrition.benefit2_desc", "Evidence also shows increased ability to repeatedly sprint at high speeds over 90 minutes when fuelling adequately.")
    },
    {
      icon: "https://static.wixstatic.com/media/c4f4b1_ff6b2e4a13724662b03a6fd53f6d15a6~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Refuel.png",
      title: t("nutrition.benefit3_title", "RECOVER FASTER"),
      description: t("nutrition.benefit3_desc", "Without optimal nutrition, you are leaving training adaptation behind. Being able to speed up recovery through nutrition can lead to greater potential adaptations.")
    },
    {
      icon: "https://static.wixstatic.com/media/c4f4b1_0a8b3336bde3432d83faaecba7673780~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Prevent%20Injuries.png",
      title: t("nutrition.benefit4_title", "PREVENT INJURIES"),
      description: t("nutrition.benefit4_desc", "High levels of training without a good recovery strategy can lead to overtraining and overuse injuries. Nutrition plays a vital role in your recovery.")
    }
  ];

  const tabContent = [
    {
      label: t("nutrition.tab_overview", "Overview"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("nutrition.overview_p1", "To unlock your full potential on the pitch, nutrition is key. Our bespoke nutrition services give you the edge over the competition, ensuring you get the most out of every training session and match. Whether you are looking to optimise your match day preparation, change your body composition, or improve your health, our plans will help you achieve your goals."),
            t("nutrition.overview_p2", "Just as you would not run a car with the wrong fuel, your body needs the right nutrients for optimal physical performance. Planning nutritional intake throughout the year can be challenging, with many factors to consider for both performance and development. Our expertise removes the guesswork by implementing tried and trusted strategies, creating personalised programs tailored to your needs.")
          ]}
        />
      )
    },
    {
      label: t("nutrition.tab_review", "Review"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("nutrition.review_p1", "Given nutrition's importance for physical, psychological, and technical performance, as well as its role in recovery and injury prevention, it is imperative you maintain an adequate diet that contains the right amount of each key nutrient."),
            t("nutrition.review_p2", "Our Nutrition Review offers a comprehensive snapshot of your current dietary habits, providing specific recommendations and improvements that can be made. We analyse your macronutrient and micronutrient intake, meal timing, hydration, and supplementation."),
            t("nutrition.review_p3", "After the review, you receive a detailed report outlining your current nutritional status and a clear action plan for improvements.")
          ]}
        />
      )
    },
    {
      label: t("nutrition.tab_programming", "Programming"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("nutrition.programming_p1", "Considering many physiological factors, we can create personalised nutrition programming which is specific to your needs. By following the programme, you can ensure optimal nutrition throughout the season or off-season and build for long-term development."),
            t("nutrition.programming_p2", "Programming includes periodised nutrition plans that adapt to your training load, match schedule, and personal goals. We cover match day fuelling, recovery nutrition, and strategies for body composition management."),
            t("nutrition.programming_p3", "Daily support is provided to help you stick to your plan, with adjustments made based on your feedback and progress.")
          ]}
        />
      )
    },
    {
      label: t("nutrition.tab_recipes", "Recipes"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("nutrition.recipes_p1", "Our recipe packages provide footballer-specific meals designed to support performance and recovery. Each recipe is optimised for macronutrient content and ease of preparation."),
            t("nutrition.recipes_p2", "We include breakfast options for training days, post-training recovery meals, match day preparation meals, and healthy snack alternatives. All recipes are designed with busy schedules in mind."),
            t("nutrition.recipes_p3", "Recipes are tailored to your taste preferences and any dietary restrictions, ensuring you enjoy what you eat whilst fuelling your performance.")
          ]}
        />
      )
    }
  ];

  const nutritionServices = [
    {
      title: t("nutrition.service1_title", "NUTRITION REVIEW"),
      subtitle: t("nutrition.service1_subtitle", "COMPREHENSIVE ANALYSIS"),
      description: t("nutrition.service1_desc", "Our Nutrition Review offers a comprehensive snapshot of your current dietary habits, providing specific recommendations and improvements that can be made. We analyse your macronutrient and micronutrient intake, meal timing, hydration, and supplementation."),
      features: [
        t("nutrition.service1_f1", "Detailed dietary analysis"),
        t("nutrition.service1_f2", "Personalised recommendations"),
        t("nutrition.service1_f3", "Clear action plan")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_a08f374420154bd881dd65c67a18eae3~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_a08f374420154bd881dd65c67a18eae3~mv2.png",
      price: t("nutrition.service1_price", "FROM £85.00"),
    },
    {
      title: t("nutrition.service2_title", "NUTRITION PROGRAMMING"),
      subtitle: t("nutrition.service2_subtitle", "PERIODISED PLANS"),
      description: t("nutrition.service2_desc", "Personalised nutrition programming which is specific to your needs. Programming includes periodised nutrition plans that adapt to your training load, match schedule, and personal goals."),
      features: [
        t("nutrition.service2_f1", "Match day fuelling strategies"),
        t("nutrition.service2_f2", "Recovery nutrition protocols"),
        t("nutrition.service2_f3", "Body composition management")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_2cf2ae92e59c4ae9a8dcffc79ea5fca9~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2cf2ae92e59c4ae9a8dcffc79ea5fca9~mv2.png",
      price: t("nutrition.service2_price", "FROM £150.00"),
    },
    {
      title: t("nutrition.service3_title", "NUTRITION PROGRAMMING & RECIPES"),
      subtitle: t("nutrition.service3_subtitle", "COMPLETE PACKAGE"),
      description: t("nutrition.service3_desc", "Complete nutrition support including programming and tailored recipes. Our recipe packages provide footballer-specific meals designed to support performance and recovery."),
      features: [
        t("nutrition.service3_f1", "Full nutrition programming"),
        t("nutrition.service3_f2", "Tailored recipe collection"),
        t("nutrition.service3_f3", "24/7 daily support")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_8c340cc141d4403896766ed99062189d~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_8c340cc141d4403896766ed99062189d~mv2.png",
      price: t("nutrition.service3_price", "FROM £200.00"),
    },
  ];

  return (
    <ServicePageLayout
      category={t("nutrition.category", "NUTRITION")}
      title={t("nutrition.hero_title", "FUELLING PROPERLY IS A MUST")}
      heroVideo="/videos/players-hero.mp4"
      heroVideoWithBorders
      statsPageKey="nutrition"
    >
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <img src={benefit.icon} alt={benefit.title} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                </div>
                <h3 className="font-bebas text-lg md:text-xl text-accent mb-2">{benefit.title}</h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("nutrition.section_detail", "IN DETAIL")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceDetailTabs tabs={tabContent} />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("nutrition.section_services", "OUR NUTRITION SERVICES")}</ServiceSectionTitle>
          <div className="space-y-6 max-w-6xl mx-auto mt-4">
            {nutritionServices.map((service, index) => (
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 pt-0 pb-4">
          <ServiceFullPackage />
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Nutrition;
