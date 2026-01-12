import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServiceContentBlock,
  ServiceCard,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";

const Nutrition = () => {
  const benefits = [
    {
      icon: "https://static.wixstatic.com/media/c4f4b1_35ba4b19866d441e9c3da513d8efacc5~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design%20-%202024-07-13T172110_edited.png",
      title: "RUN FURTHER",
      description: "Proper nutrition has shown to directly impact your performance on the pitch. Studies have shown that fuelling optimally can lead to a 24% improvement in time to fatigue."
    },
    {
      icon: "https://static.wixstatic.com/media/c4f4b1_7dc31f57fd654cc3a293f7ab6506c3ea~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Run%20Faster.png",
      title: "RUN FASTER",
      description: "Evidence also shows increased ability to repeatedly sprint at high speeds over 90 minutes when fuelling adequately."
    },
    {
      icon: "https://static.wixstatic.com/media/c4f4b1_ff6b2e4a13724662b03a6fd53f6d15a6~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Refuel.png",
      title: "RECOVER FASTER",
      description: "Without optimal nutrition, you are leaving training adaptation behind. Being able to speed up recovery through nutrition can lead to greater potential adaptations."
    },
    {
      icon: "https://static.wixstatic.com/media/c4f4b1_0a8b3336bde3432d83faaecba7673780~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Prevent%20Injuries.png",
      title: "PREVENT INJURIES",
      description: "High levels of training without a good recovery strategy can lead to overtraining and overuse injuries. Nutrition plays a vital role in your recovery."
    }
  ];

  return (
    <ServicePageLayout
      category="NUTRITION"
      title="TO GET THE MOST OUT OF YOURSELF\nFUELLING PROPERLY IS A MUST"
      heroVideo="/videos/players-hero.mp4"
    >
      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-card/60 to-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <img 
                    src={benefit.icon}
                    alt={benefit.title}
                    className="w-10 h-10 md:w-12 md:h-12 object-contain"
                  />
                </div>
                <h3 className="font-bebas text-lg md:text-xl text-primary mb-2">{benefit.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In Detail Section */}
      <ServiceSection>
        <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
            {["Overview", "Review", "Programming", "Recipes"].map((tab, index) => (
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
              "To unlock your full potential on the pitch, nutrition is key. Our bespoke nutrition services give you the edge over the competition, ensuring you get the most out of every training session and match. Whether you are looking to optimise your match day preparation, change your body composition, or improve your health, our plans will help you achieve your goals.",
              "Just as you would not run a car with the wrong fuel, your body needs the right nutrients for optimal physical performance. Planning nutritional intake throughout the year can be challenging, with many factors to consider for both performance and development. Our expertise removes the guesswork by implementing tried and trusted strategies, creating personalised programs tailored to your needs.",
              "Given nutrition's importance for physical, psychological, and technical performance, as well as its role in recovery and injury prevention, it is imperative you maintain an adequate diet that contains the right amount of each key nutrient. Our Nutrition Review offers a comprehensive snapshot of your current dietary habits, providing specific recommendations and improvements that can be made.",
              "Considering many physiological factors, we can create personalised nutrition programming which is specific to your needs. By following the programme, you can ensure optimal nutrition throughout the season or off-season and build for long-term development."
            ]}
          />
        </div>
      </ServiceSection>

      {/* Options Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>OPTIONS</ServiceSectionTitle>
        
        {/* Features Grid */}
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
          {[
            "Comprehensive Nutritional Analysis",
            "Daily Support",
            "1:1 Coaching",
            "In-Depth Programming",
            "Monitoring",
            "Tailored Recipes"
          ].map((feature, index) => (
            <div key={index} className="bg-card border border-border rounded-lg px-4 py-2.5 text-center">
              <span className="text-xs md:text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_a08f374420154bd881dd65c67a18eae3~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_a08f374420154bd881dd65c67a18eae3~mv2.png"
            title="Nutrition Review"
            link="/contact"
          />
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_2cf2ae92e59c4ae9a8dcffc79ea5fca9~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2cf2ae92e59c4ae9a8dcffc79ea5fca9~mv2.png"
            title="Nutrition Programming"
            link="/contact"
          />
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_8c340cc141d4403896766ed99062189d~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_8c340cc141d4403896766ed99062189d~mv2.png"
            title="Nutrition Programming & Recipes"
            link="/contact"
          />
        </div>
      </ServiceSection>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default Nutrition;
