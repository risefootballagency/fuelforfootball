import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceCard,
  ServiceInfoCard,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";

const Mental = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_b59f5998d4e44151801f114235ddc357~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Consistency%20(1).png", label: "CONSISTENCY" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_6fd3b0e42de84e569be9f98ae5c93220~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Focus.png", label: "FOCUS" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_7449783a3dd94797974af0a97b3145f7~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Resilience.png", label: "RESILIENCE" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_ce1710f714314eebba935e461609756b~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Confidence.png", label: "CONFIDENCE" },
  ];

  return (
    <ServicePageLayout
      category="PSYCHOLOGICAL PERFORMANCE"
      title="SKILL + WILL = SUCCESS"
      subtitle="Football is not solely about skill. The fine margins are decided by will."
      heroVideo="/videos/players-hero.mp4"
    >
      <ServicePillars pillars={pillars} />

      {/* In Detail Section */}
      <ServiceSection>
        <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
            {["Overview", "Mental Skills", "Mental Will"].map((tab, index) => (
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
              "It is the combination of skill and will which decides every victor. It does not matter how great a player you are if you suffer mental defeat to an opponent. Mastering your mind and possessing mental strength plays a pivotal role in Football. Our bespoke psychological support services aim to fortify your mind, empowering you to take on increasingly great challenges, manage pressure, and perform consistently at your highest level.",
              "Whether you are battling performance anxiety, seeking to boost your mental resilience, or striving to enhance your concentration during high-stakes moments, our tailored and individualised 1:1 training will help you secure the mental edge over your competition. With Fuel for Football, you win the game with your mind, to in turn win on the pitch.",
              "Mental skills are the foundation upon which all other abilities depend. Consistency on the pitch requires strong mental skills, a fact recognised by Sir Alex Ferguson as key to prolonged elite performance. Our Mental Skill Training focuses on developing consistency, confidence, resilience, and focus, all while maintaining complete confidentiality, most importantly including from your club's personnel.",
              "We start by testing your mental skill level and comparing it to other elite athletes we have trained. Based on this assessment, we create bespoke individualised sessions tailored to your needs. These one-to-one sessions can be conducted in person or over the phone, ensuring you receive the personalised support necessary to strengthen your mental game.",
              "The difference between players of similar ability often lies in their mental will. With greater will than an opponent, it is possible to outperform them even with less skill. Mental will is developed like any muscle in the gym, through training. Mental will speaks to drive and determination. If you want something more than an opponent, it is often enough to overcome any skill deficit. This service is perfect for booking in before games to prepare the mind for action and to have the greatest performance possible."
            ]}
          />
        </div>
      </ServiceSection>

      {/* Options Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>OPTIONS</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 md:mb-14">
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_ec7282c95805482aaf5d9909b260c8ee~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_ec7282c95805482aaf5d9909b260c8ee~mv2.png"
            title="Fuelled Elite Coaching"
            link="/contact"
          />
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_f85124e6d69542e4b4329bacafb454a3~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_f85124e6d69542e4b4329bacafb454a3~mv2.png"
            title="Psychological Development"
            link="/contact"
          />
          <ServiceCard
            image="https://static.wixstatic.com/media/c4f4b1_121be4d22e6244d48dd94cacbf7bcf8c~mv2.png/v1/fill/w_386,h_386,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_121be4d22e6244d48dd94cacbf7bcf8c~mv2.png"
            title="Psychological Performance"
            link="/contact"
          />
        </div>
        
        {/* Performance & Development Details */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <ServiceInfoCard
            title="Performance"
            subtitle="(Mental Will Training)"
            content="Our psychological performance sessions provide tailored support by providing players with Mental Will training and Mindset Conditioning. Through performance reviews, players receive the support they need from game to game to develop their mental strength and increase consistency within their performance on and off the pitch."
          />
          <ServiceInfoCard
            title="Development"
            subtitle="(Mental Skill Training)"
            content="Psychological development is crucial for success. Mental skills sessions will help you improve your long-term psychological performance. By focusing on mental skills such as visualisation, goal-setting, and self-talk, you will develop the mental toughness and resilience needed to succeed at the highest level."
          />
        </div>
      </ServiceSection>

      {/* Podcast Section */}
      <ServiceSection>
        <ServiceSectionTitle>PODCAST</ServiceSectionTitle>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-xl shadow-primary/10 mb-6">
              <img 
                src="https://static.wixstatic.com/media/c4f4b1_35ba4b19866d441e9c3da513d8efacc5~mv2.png/v1/fill/w_258,h_257,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design%20-%202024-07-13T172110_edited.png"
                alt="Fuel For Football Podcast"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bebas text-xl md:text-2xl text-foreground mb-1">Fuel For Football</h3>
            <p className="font-bebas text-lg text-primary">Podcast</p>
          </div>
          
          <div className="space-y-5">
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Your host, sport psychologist Sanchez Bailey, provides psychological lessons for professional footballers from the heights of the Premier League right down to the grassroots level!
            </p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://open.spotify.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#1DB954] text-white font-bebas tracking-wider rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                Spotify
              </a>
              <a 
                href="https://podcasts.apple.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-gradient-to-r from-[#9933FF] to-[#FC5C7D] text-white font-bebas tracking-wider rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                Apple Podcast
              </a>
            </div>
          </div>
        </div>
      </ServiceSection>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default Mental;
