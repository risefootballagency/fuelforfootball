import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Target, Dumbbell, Lightbulb, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/HeroSlider";
import { ServiceCarousel } from "@/components/ServiceCarousel";
import { VideoHeroBanner } from "@/components/VideoHeroBanner";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PlayersSubmenu } from "@/components/PlayersSubmenu";
import { WhatsAppPulse } from "@/components/WhatsAppPulse";
import { EliteMessaging, PropagandaBanner } from "@/components/EliteMessaging";
import { MetricBanner } from "@/components/PropagandaMetrics";
import { CaseStudySlider } from "@/components/CaseStudySlider";
import { ChooseYourFuel } from "@/components/ChooseYourFuel";
import { NeedsAnalysis } from "@/components/NeedsAnalysis";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { BRAND_CONTENT } from "@/data/brandContent";
import { GrassBackground, SmokyBackground, GRASS_BACKGROUNDS } from "@/components/GrassBackground";
import { HoverText } from "@/components/HoverText";

// New slide content based on marketing messaging
const HERO_SLIDE_CONTENT = [
  {
    title: "BY YOUR SIDE THROUGHOUT YOUR CAREER",
    subtitle: "Our performance team stays with you, providing unwavering support even through transfers and relocations. No matter where your career takes you, we ensure you have the same dedicated team behind you, committed to your success."
  },
  {
    title: "LONG-TERM SOLUTIONS",
    subtitle: "Our work centres around career goals and where our clients aim to reach. Through our expertise, we transform strengths into specialities and eliminate weaknesses, such that it is possible to level up to compete in the highest echelons of the game."
  },
  {
    title: "INDIVIDUALISED TRAINING",
    subtitle: "Considering the varying physiology of each professional player, in order for real progression and elite performance to be achieved, this attention to detail is a must-have. Fuel For Football provides this much-needed service."
  },
  {
    title: "24/7 SUPPORT EVERY DAY ALL YEAR",
    subtitle: "At the highest level, every action matters. We support our players 24/7, because the day is not done when leaving the training ground. Our team is always available to provide guidance, helping our players gain every possible advantage."
  },
  {
    title: "STRONGER FASTER FITTER",
    subtitle: "Our strong client base includes players from the English Premier League and many across Europe's top divisions, who have rocketed into prominence through our extensive training, analysis and recovery protocol."
  },
  {
    title: "WORKING HARD TO BETTER THE BEST",
    subtitle: "8 National Team Players. 18 'Big 5' League Players. 74 Professional Players. Our strong client base has rocketed into prominence through our extensive training, analysis and recovery protocol."
  }
];

// Dynamic Hero Slider that fetches images from landing folder
const DynamicHeroSlider = () => {
  const [slides, setSlides] = useState<{ image: string; title: string; subtitle?: string }[]>([]);

  useEffect(() => {
    const fetchLandingImages = async () => {
      const { data, error } = await supabase
        .from('marketing_gallery')
        .select('file_url, title')
        .eq('folder', 'landing')
        .not('file_url', 'is', null)
        .limit(6);

      if (data && data.length > 0) {
        // Map images to slide content, cycling through content if needed
        const dynamicSlides = data.map((item, index) => ({
          image: item.file_url,
          title: HERO_SLIDE_CONTENT[index % HERO_SLIDE_CONTENT.length].title,
          subtitle: HERO_SLIDE_CONTENT[index % HERO_SLIDE_CONTENT.length].subtitle
        }));
        setSlides(dynamicSlides);
      } else {
        // Fallback slides with placeholder images
        setSlides(HERO_SLIDE_CONTENT.slice(0, 3).map((content, index) => ({
          image: index === 0 
            ? "https://static.wixstatic.com/media/c4f4b1_7de02c74bb1142dea9ce0997961fd1f5~mv2.jpg/v1/fill/w_1920,h_600,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_7de02c74bb1142dea9ce0997961fd1f5~mv2.jpg"
            : index === 1
              ? "https://static.wixstatic.com/media/c4f4b1_2cc70832de7149aa87f67a71d4390f00~mv2.jpg/v1/fill/w_1920,h_600,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_2cc70832de7149aa87f67a71d4390f00~mv2.jpg"
              : "https://static.wixstatic.com/media/c4f4b1_73a12b8d527341e594f266e5b77de8fe~mv2.jpg/v1/fill/w_1920,h_600,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_73a12b8d527341e594f266e5b77de8fe~mv2.jpg",
          title: content.title,
          subtitle: content.subtitle
        })));
      }
    };

    fetchLandingImages();
  }, []);

  if (slides.length === 0) return null;

  return <HeroSlider slides={slides} autoplayDelay={5000} />;
};


// Service Section Component with Carousel
const ServiceSection = ({
  id,
  title,
  description,
  products,
  dailyFuelArticle,
  dailyFuelDescription,
  learnMoreLink,
  learnMoreText,
  reverse = false,
  hasTitleBackground = false
}: {
  id: string;
  title: string;
  hideBottomPadding?: boolean;
  description: string;
  products: { id?: string; image: string; title: string; link: string; description?: string }[];
  dailyFuelArticle?: { image: string; title: string; link: string };
  dailyFuelDescription?: string;
  learnMoreLink: string;
  learnMoreText: string;
  reverse?: boolean;
  hasTitleBackground?: boolean;
}) => (
  <section id={id} className="md:pt-16 md:pb-10 bg-card/30 min-h-[100svh] md:min-h-0 snap-start snap-always flex flex-col justify-center md:block py-4 md:py-0">
    <div className="container mx-auto">
      {hasTitleBackground ? (
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-12 md:mb-16">
          <Link 
            to={learnMoreLink}
            className="block w-screen relative left-1/2 -translate-x-1/2 py-5 md:py-8 overflow-hidden border-y-4 border-accent cursor-pointer hover:opacity-90 transition-opacity"
            style={{
              backgroundImage: `url('/grass-bg-smoky.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider text-center text-white container mx-auto drop-shadow-lg relative z-10">
              <HoverText text={title} />
            </h2>
          </Link>
        </div>
      ) : (
        <Link to={learnMoreLink} className="block mb-12 md:mb-16 hover:opacity-80 transition-opacity">
          <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider text-center text-foreground">
            <HoverText text={title} />
          </h2>
        </Link>
      )}
      
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        {/* Products Carousel */}
        <div className={`h-full ${reverse ? 'lg:order-2' : ''}`}>
          <ServiceCarousel products={products} />
        </div>
        
        {/* Description and Daily Fuel */}
        <div className={`flex flex-col h-full ${reverse ? 'lg:order-1' : ''}`}>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 flex-grow">
            {description}
          </p>
          
          <div className="mt-auto space-y-6">
            <Link to={learnMoreLink} className="block w-full">
              <Button 
                hoverEffect
                className="w-full justify-center font-bebas uppercase tracking-wider text-sm text-white relative overflow-hidden border-2 border-accent"
              >
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url('/grass-bg-smoky.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <HoverText text={learnMoreText.toUpperCase()} />
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>
          
            {dailyFuelArticle && (
              <div className="pt-6 border-t border-border/30">
                <p className="text-xs uppercase tracking-widest text-accent mb-3 font-bebas">Daily Fuel</p>
                <Link to={dailyFuelArticle.link} className="flex gap-4 group">
                  <img 
                    src={dailyFuelArticle.image} 
                    alt={dailyFuelArticle.title}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-bebas uppercase tracking-wider text-foreground group-hover:text-primary transition-colors mb-2">
                      {dailyFuelArticle.title}
                    </h4>
                    {dailyFuelDescription && (
                      <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">
                        {dailyFuelDescription}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
);

interface ServiceProduct {
  id?: string;
  image: string;
  title: string;
  link: string;
  description?: string;
}

const Players = () => {
  const { t } = useLanguage();
  
  // State for database products
  const [tacticalProducts, setTacticalProducts] = useState<ServiceProduct[]>([]);
  const [psychologicalProducts, setPsychologicalProducts] = useState<ServiceProduct[]>([]);
  const [technicalProducts, setTechnicalProducts] = useState<ServiceProduct[]>([]);
  const [spsProducts, setSpsProducts] = useState<ServiceProduct[]>([]);
  const [conditioningProducts, setConditioningProducts] = useState<ServiceProduct[]>([]);
  const [nutritionProducts, setNutritionProducts] = useState<ServiceProduct[]>([]);
  const [dataProducts, setDataProducts] = useState<ServiceProduct[]>([]);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      const categories = [
        { key: 'tactical', setter: setTacticalProducts, fallbackLink: '/analysis' },
        { key: 'psychological', setter: setPsychologicalProducts, fallbackLink: '/mental' },
        { key: 'technical', setter: setTechnicalProducts, fallbackLink: '/technical' },
        { key: 'strength', setter: setSpsProducts, fallbackLink: '/strength-power-speed' },
        { key: 'conditioning', setter: setConditioningProducts, fallbackLink: '/conditioning' },
        { key: 'nutrition', setter: setNutritionProducts, fallbackLink: '/nutrition' },
        { key: 'analysis', setter: setDataProducts, fallbackLink: '/analysis' },
      ];

      for (const { key, setter, fallbackLink } of categories) {
        const { data } = await supabase
          .from('service_catalog')
          .select('id, name, description, price, image_url, category')
          .ilike('category', `%${key}%`)
          .limit(5);

        if (data && data.length > 0) {
          setter(data.map(item => ({
            id: item.id,
            image: item.image_url || 'https://via.placeholder.com/300',
            title: item.name,
            link: fallbackLink,
            description: item.description || undefined,
          })));
        }
      }
    };

    fetchProducts();
  }, []);

  const fourCorners = [
    {
      icon: Target,
      title: "Tactical",
      description: "Sharpen your decision-making and see the game in a different light. Read several passes ahead of play to consistently gain the advantage over your matchups.",
      link: "/analysis",
      image: "https://static.wixstatic.com/media/c4f4b1_2cc70832de7149aa87f67a71d4390f00~mv2.jpg/v1/fill/w_285,h_173,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2cc70832de7149aa87f67a71d4390f00~mv2.jpg"
    },
    {
      icon: Brain,
      title: "Psychological",
      description: "Develop mental skills in consistency, commitment, confidence, resilience, and focus. Outwill opponents to overcome skill differences and dominate on the pitch.",
      link: "/mental",
      image: "https://static.wixstatic.com/media/c4f4b1_aed8df24614a45b29533fede6bae55c7~mv2.jpg/v1/fill/w_285,h_173,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/gran.jpg"
    },
    {
      icon: Lightbulb,
      title: "Technical",
      description: "Master your touch, be more unpredictable and finish at will. Consistently deal with difficult balls into you and find ways to open up into what you do best.",
      link: "/technical",
      image: "https://static.wixstatic.com/media/c4f4b1_c627e66f4e68449590b6f4f745b91472~mv2.jpg/v1/fill/w_285,h_173,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/got.jpg"
    },
    {
      icon: Dumbbell,
      title: "Physical",
      description: "Become stronger, faster and more powerful to dominate on the pitch. Condition and develop a capacity for training to progress more quickly and reduce injuries.",
      link: "/strength-power-speed",
      image: "https://static.wixstatic.com/media/c4f4b1_73a12b8d527341e594f266e5b77de8fe~mv2.jpg/v1/fill/w_285,h_173,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Copy%20of%20We%20play%20out%20from%20the%20back%20to%20advance%20into%20the%20opposition%20half_%20We%20then%20play%20throug.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-background md:[scroll-snap-type:none] [scroll-snap-type:y_mandatory] md:[scroll-snap-type:none] [scroll-snap-type:y_mandatory]">
      <SEO 
        title="Players - Football Performance Services | Fuel For Football"
        description="Fuel For Football is Football's leading performance consultancy. We work with Premier League and Football League players, offering strength, speed, power development, psychological performance sessions and game analysis."
        url="/players"
      />
   d:pt-28 md:snap-none snap-y snap-mandatory overflow-y-auto">
        {/* Video Hero Banner - Full width at top */}
        <VideoHeroBanner 
          videoSrc="/videos/players-hero.mp4"
          title="FUEL FOR FOOTBALL"
        />

        {/* Title Bar - Now below video */}
        <section className="relative overflow-hidden border-b border-border/50 bg-glossy-green">
          <div className="container mx-auto relative z-10 flex items-center justify-center py-3 md:py-4">
            <h1 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider text-center text-title leading-none">
              Players
            </h1>
          </div>
        </section>

        {/* Full-Width Navigation Submenu - Directly below title */}
        <PlayersSubmenu />

        {/* What We Do Section */}
        <section className="py-5 md:py-12 bg-card/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-accent/5 pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <h2 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider text-center text-white mb-2 md:mb-4">
              How We Fuel
            </h2>
            <p className="text-center text-accent font-bebas uppercase tracking-wider text-lg md:text-2xl mb-4 md:mb-8">
              Football's Leading Performance Consultancy
            </p>
            <p className="text-center text-muted-foreground text-sm md:text-base max-w-4xl mx-auto mb-8 md:mb-16">
              {BRAND_CONTENT.overview} {BRAND_CONTENT.valueProposition}
            </p>

            {/* Four Corners Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {fourCorners.map((corner, index) => (
                <Link 
                  key={index}
                  to={corner.link}
                  className="group relative overflow-hidden rounded-lg border-2 border-accent hover:border-accent transition-all duration-300"
                >
                  {/* Grass Background */}
                  <div 
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: `url(${GRASS_BACKGROUNDS.grassBackground})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 z-[1]" />
                  
                  <div className="aspect-video overflow-hidden relative z-[2]">
                    <img 
                      src={corner.image} 
                      alt={corner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 md:p-6 relative z-[2] text-center">
                    <h3 className="text-lg md:text-2xl font-bebas uppercase tracking-wider text-white mb-2 md:mb-3 group-hover:text-accent transition-colors">
                      {corner.title}
                    </h3>
                    <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-2 md:mb-4 line-clamp-3 md:line-clamp-none">
                      {corner.description}
                    </p>
                    <Button variant="link" className="p-0 h-auto text-accent text-xs md:text-sm font-medium group-hover:gap-2 md:group-hover:gap-3 transition-all">
                      LEARN MORE <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Hero Slider - with images from landing folder */}
        <DynamicHeroSlider />

        {/* Case Study Slider - Success Stories */}
        <CaseStudySlider />

        {/* While You're Reading This Section - transition divider */}
        <section className="py-6 md:py-10 bg-gradient-to-b from-background via-primary/5 to-background border-y border-border/30">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-2xl md:text-4xl font-bebas uppercase tracking-wider text-foreground mb-3">
                While You're Reading This, They're Training
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Every moment you hesitate is a moment your competition gets ahead.
              </p>
            </div>
          </div>
        </section>

        {/* Choose Your Fuel Section */}
        <ChooseYourFuel />

        {/* Needs Analysis Section */}
        <NeedsAnalysis />

      {/* Tactical Analysis Section */}
        <ServiceSection
          id="tactical"
          title="Tactical Analysis"
          description="Unlock new layers to your game and rise above the competition with our analysis. Transform your decision-making and positional awareness with insights into how you can be more effective. Develop strategies by studying the opponent and individual matchups through our pre-match analysis, to gain a competitive edge. Our post-match analysis provides detailed evaluations of your performance, highlighting strengths and areas for improvement with long-term development in mind."
          hasTitleBackground
          products={tacticalProducts}
          dailyFuelArticle={{
            image: "https://static.wixstatic.com/media/e2ec89_d105658f3d8f43eb99e7f91f4c91e73f~mv2.png/v1/fill/w_285,h_285,fp_0.50_0.50,q_95,enc_avif,quality_auto/e2ec89_d105658f3d8f43eb99e7f91f4c91e73f~mv2.webp",
            title: "The Jab Step - 1v1 Dribbling",
            link: "/daily-fuel"
          }}
          dailyFuelDescription="Breaking down the game with an advanced lens, showing technical breakdowns and discussing important tactical ideas from the POV of the player."
          learnMoreLink="/analysis"
          learnMoreText="Tactical"
        />

        {/* Psychological Performance Section */}
        <ServiceSection
          id="psychological"
          title="Psychological Performance"
          description="Football is not solely about skill; the fine margins are decided by will. Our psychological services fortify your mind, empowering you to tackle challenges, manage pressure, and perform consistently at the highest level. Whether battling performance anxiety or simply boosting mental resilience, our tailored 1:1 training provides the mental edge. We test your mental skills and develop individualised sessions to enhance consistency, confidence, resilience, and focus."
          hasTitleBackground
          products={psychologicalProducts}
          dailyFuelArticle={{
            image: "https://static.wixstatic.com/media/c4f4b1_e6957b16df764002bc44e76fef35a318~mv2.png/v1/fill/w_314,h_314,fp_0.50_0.50,q_95,enc_avif,quality_auto/c4f4b1_e6957b16df764002bc44e76fef35a318~mv2.webp",
            title: "Neuroticism & Performance",
            link: "/daily-fuel"
          }}
          dailyFuelDescription="Talking through the power of the mind and the specific interventions you can use to develop mental skills and will."
          learnMoreLink="/mental"
          learnMoreText="Psychology"
          reverse
        />

        {/* Technical Section */}
        <ServiceSection
          id="technical"
          title="Technical"
          description="Control the ball. Control the game. Technical aspects are the cornerstone of a player's ability to perform in matches. Ball mastery can mean the difference between a missed opportunity and a spectacular goal. Our tailored technical training services hone your ball manipulation, enabling precise passes, dribbling at speed, escaping pressure and accurate execution. Our evidence-based approaches refine your technical abilities through structured training and programming."
          hasTitleBackground
          products={technicalProducts}
          dailyFuelArticle={{
            image: "https://static.wixstatic.com/media/c4f4b1_7fe3d766e2174e22965f00b03c2e15ef~mv2.jpg/v1/fill/w_300,h_300,fp_0.50_0.50,q_90,enc_avif,quality_auto/c4f4b1_7fe3d766e2174e22965f00b03c2e15ef~mv2.webp",
            title: "The Key to Clinical Scoring",
            link: "/daily-fuel"
          }}
          dailyFuelDescription="Detailing a more scientific approach to developing technical ability ranging from training paradigms to the specific techniques to apply."
          learnMoreLink="/technical"
          learnMoreText="Technical"
        />

        {/* Strength, Power & Speed Section */}
        <ServiceSection
          id="sps"
          title="Strength, Power & Speed"
          description="Strength, power, and speed are vital in modern football. Our mission is to develop players physically with the best training for their individual needs. Our tailored sessions push you to new limits, expanding your capacity for training, in turn reducing injury risk, and maximising on-pitch impact. Through our individualised programming, we provide close 1:1 support with each session, whether delivered in-person or performed from afar, to make fast adjustments and retain good form."
          hasTitleBackground
          products={spsProducts}
          dailyFuelArticle={{
            image: "https://static.wixstatic.com/media/c4f4b1_5494ded726e64fb8ad5cc0d16ac46450~mv2.jpg/v1/fill/w_300,h_300,fp_0.50_0.50,q_90,enc_avif,quality_auto/c4f4b1_5494ded726e64fb8ad5cc0d16ac46450~mv2.webp",
            title: "Brain Entangled",
            link: "/daily-fuel"
          }}
          dailyFuelDescription="Debunking the many myths that surround developing physically for Football and discussing the principles that underpin all effective training."
          learnMoreLink="/strength-power-speed"
          learnMoreText="S.P.S."
          reverse
        />

        {/* Conditioning Section */}
        <ServiceSection
          id="conditioning"
          title="Conditioning"
          description="Building your capacity to cover every blade of grass. Top conditioning is essential, often deciding the victor in the latter stages of games. A well-conditioned player maintains pace, power, and precision when others fade. Our services ensure peak performance from start to finish, by extending capacity and workload tolerance. We tailor training to your individual needs, position and energy systems, building an engine that outperforms opponents."
          hasTitleBackground
          products={conditioningProducts}
          dailyFuelArticle={{
            image: "https://static.wixstatic.com/media/c4f4b1_b2b5a92faf5b464abacd7bd5034467be~mv2.jpg/v1/fill/w_300,h_300,fp_0.50_0.50,q_90,enc_avif,quality_auto/c4f4b1_b2b5a92faf5b464abacd7bd5034467be~mv2.webp",
            title: "VO2 Max",
            link: "/daily-fuel"
          }}
          dailyFuelDescription="Covering the full spectrum of the energy system and each type of endurance as it relates back to performance on the Football pitch."
          learnMoreLink="/conditioning"
          learnMoreText="Conditioning"
        />

        {/* Nutrition Section */}
        <ServiceSection
          id="nutrition"
          title="Nutrition"
          description="To unlock your full potential on the pitch, nutrition is key. Our bespoke services ensure you get the most out of every training session and match. Whether optimising match day preparation, changing body composition, or improving health, our plans help you achieve your goals. Our expertise removes the guesswork through tried and trusted strategies. Personalised programs ensure optimal nutrition for peak performance and long-term development, with daily 1:1 support from our team nutritionist."
          hasTitleBackground
          products={nutritionProducts}
          dailyFuelArticle={{
            image: "https://static.wixstatic.com/media/c4f4b1_57733fa62ff941c8b72ab6bbd5bf73f9~mv2.jpg/v1/fill/w_300,h_300,fp_0.50_0.50,q_90,enc_avif,quality_auto/c4f4b1_57733fa62ff941c8b72ab6bbd5bf73f9~mv2.webp",
            title: "Pre-Training Nutrition",
            link: "/daily-fuel"
          }}
          dailyFuelDescription="A view of nutrition for performance; ranging from body composition, hydration protocols, match day prep and recovery strategies to the nuances such as eating disorders."
          learnMoreLink="/nutrition"
          learnMoreText="Nutrition"
          reverse
        />

        {/* Data-Driven Section */}
        <ServiceSection
          id="data"
          title="Data-Driven"
          description="We comprehensively analyse the performance statistics clubs use to evaluate and recruit players. Through this, we highlight your strengths in transfer reports that increase club interest and maximise on the value of the contracts you negotiate. Our efficiency reports also enhance on-pitch performance with a greater focus on how you are viewed by scouts. The reports are a data-backed evaluation of your performance compared to your team, league, and impact on games."
          hasTitleBackground
          products={dataProducts}
          dailyFuelArticle={{
            image: "https://static.wixstatic.com/media/c4f4b1_7fe3d766e2174e22965f00b03c2e15ef~mv2.jpg/v1/fill/w_300,h_300,fp_0.50_0.50,q_90,enc_avif,quality_auto/c4f4b1_7fe3d766e2174e22965f00b03c2e15ef~mv2.webp",
            title: "The Key to Clinical Scoring",
            link: "/daily-fuel"
          }}
          dailyFuelDescription="Talking through the data and statistical side of the game to decipher what is important, what is a waste of your time and everything in between."
          learnMoreLink="/analysis"
          learnMoreText="Data"
        />

        {/* Consultation CTA Section */}
        <section className="py-8 md:py-12 bg-primary/5">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider text-center text-foreground mb-4">
              Not Sure What Will Make The Greatest Impact?
            </h2>
            <p className="text-center text-muted-foreground text-sm md:text-lg max-w-3xl mx-auto mb-8">
              Consider a <strong>Consultation</strong>, which runs like any good doctor's appointment. We discuss your game and get into the intricacies of your situation, to be able to provide a strong understanding of what to do and a comprehensive plan of action. Equally, our <strong>Player Efficiency Report</strong> can give a direct view on how you can improve in line with what clubs scout and make recruitment decisions based on.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 max-w-2xl mx-auto">
              <Link to="/services/consultation" className="flex-1">
                <Button size="lg" className="w-full gap-2 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 font-bebas uppercase tracking-wider relative overflow-hidden text-white border-2 border-accent">
                  <div 
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: `url('/grass-bg-smoky.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Book a Consultation
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </span>
                </Button>
              </Link>
              <Link to="/services/data" className="flex-1">
                <Button size="lg" className="w-full gap-2 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 font-bebas uppercase tracking-wider relative overflow-hidden text-white border-2 border-accent">
                  <div 
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: `url('/grass-bg-smoky.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Performance Efficiency Report
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </section>


        {/* Propaganda Banner */}
        <PropagandaBanner />

        {/* FOMO Messaging */}
        <EliteMessaging variant="exclusivity" className="bg-card/30" />

        {/* Metric Banner - no extra padding after */}
        <MetricBanner />
      </main>
      
      {/* Floating WhatsApp CTA */}
      <WhatsAppPulse showDelay={8000} />
      
      <Footer />
    </div>
  );
};

export default Players;
