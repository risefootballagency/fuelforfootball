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
import { PlayerRollingSlider } from "@/components/PlayerRollingSlider";
import { PlayersSubmenu } from "@/components/PlayersSubmenu";

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
  reverse = false
}: {
  id: string;
  title: string;
  description: string;
  products: { image: string; title: string; link: string }[];
  dailyFuelArticle?: { image: string; title: string; link: string };
  dailyFuelDescription?: string;
  learnMoreLink: string;
  learnMoreText: string;
  reverse?: boolean;
}) => (
  <section id={id} className="py-12 md:py-20 bg-card/30 border-y border-border/30">
    <div className="container mx-auto">
      <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider text-center text-foreground mb-8 md:mb-12">
        {title}
      </h2>
      
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        {/* Products Carousel */}
        <div className={`${reverse ? 'lg:order-2' : ''}`}>
          <ServiceCarousel products={products} />
        </div>
        
        {/* Description and Daily Fuel */}
        <div className={`space-y-6 ${reverse ? 'lg:order-1' : ''}`}>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {description}
          </p>
          
          <Link 
            to={learnMoreLink}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded font-bebas uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors"
          >
            {learnMoreText}
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          {dailyFuelArticle && (
            <div className="mt-8 pt-6 border-t border-border/30">
              <p className="text-xs uppercase tracking-widest text-primary mb-3 font-bebas">Daily Fuel</p>
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
  </section>
);

const Players = () => {
  const { t } = useLanguage();

  const fourCorners = [
    {
      icon: Target,
      title: "Tactical",
      description: "Sharpen your decision-making and see the game in a different light. Read several passes ahead of play to consistently gain the advantage over your matchups.",
      link: "/tactical",
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

  const services = [
    { name: "Pro Performance", link: "/pro-performance" },
    { name: "Elite Performance", link: "/elite-performance" },
    { name: "Tactical", link: "/tactical" },
    { name: "Conditioning", link: "/conditioning" },
    { name: "Strength, Power & Speed", link: "/strength-power-speed" },
    { name: "Nutrition", link: "/nutrition" },
    { name: "Consultation", link: "/consultation" },
    { name: "Data Report", link: "/analysis" },
    { name: "Technical", link: "/technical" },
  ];

  const needsAnalysisSteps = [
    {
      number: "1",
      title: "Identification of key areas",
      items: ["Inform us of what you are working on or need to improve", "Discuss this in depth with us through a consultation call"]
    },
    {
      number: "2",
      title: "Discussion of individualised approach",
      items: ["Helping you to understand the factors which affect your individual case and what we recommend to maximise your development"]
    },
    {
      number: "3",
      title: "Take Action",
      items: ["More Specific Testing", "Footage Gathering", "Further Discussion"]
    },
    {
      number: "4",
      title: "Be Fuelled",
      items: ["Learn", "Apply", "Outperform", "Review", "Fuel"]
    }
  ];

  // Tactical Analysis Products
  const tacticalProducts = [
    { image: "https://static.wixstatic.com/media/c4f4b1_290b7878ef8a4b2b9291117f1a47f12c~mv2.png/v1/fill/w_314,h_314,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_290b7878ef8a4b2b9291117f1a47f12c~mv2.png", title: "European Match Analysis Package", link: "/tactical" },
    { image: "https://static.wixstatic.com/media/c4f4b1_0644d43020e245e2a593e50e9242d8f4~mv2.png/v1/fill/w_314,h_314,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_0644d43020e245e2a593e50e9242d8f4~mv2.png", title: "Match Analysis (Pre & Post)", link: "/tactical" },
    { image: "https://static.wixstatic.com/media/c4f4b1_0644d43020e245e2a593e50e9242d8f4~mv2.png/v1/fill/w_314,h_314,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_0644d43020e245e2a593e50e9242d8f4~mv2.png", title: "Pre-Match Opposition Analysis", link: "/tactical" },
    { image: "https://static.wixstatic.com/media/c4f4b1_c3df57964c5242608b1ccd7430431fb9~mv2.png/v1/fill/w_314,h_314,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_c3df57964c5242608b1ccd7430431fb9~mv2.png", title: "Post-Match Analysis", link: "/tactical" },
  ];

  // Psychological Products
  const psychologicalProducts = [
    { image: "https://static.wixstatic.com/media/c4f4b1_ec7282c95805482aaf5d9909b260c8ee~mv2.png/v1/fill/w_312,h_312,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_ec7282c95805482aaf5d9909b260c8ee~mv2.png", title: "Fuelled Elite Coaching", link: "/mental" },
    { image: "https://static.wixstatic.com/media/c4f4b1_121be4d22e6244d48dd94cacbf7bcf8c~mv2.png/v1/fill/w_312,h_312,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_121be4d22e6244d48dd94cacbf7bcf8c~mv2.png", title: "Psychological Performance", link: "/mental" },
    { image: "https://static.wixstatic.com/media/c4f4b1_f85124e6d69542e4b4329bacafb454a3~mv2.png/v1/fill/w_312,h_312,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_f85124e6d69542e4b4329bacafb454a3~mv2.png", title: "Psychological Development", link: "/mental" },
    { image: "https://static.wixstatic.com/media/c4f4b1_2acec297d8d647188b1d38bd5fa71f69~mv2.png/v1/fill/w_312,h_312,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2acec297d8d647188b1d38bd5fa71f69~mv2.png", title: "Consultation", link: "/consultation" },
  ];

  // Technical Products
  const technicalProducts = [
    { image: "https://static.wixstatic.com/media/c4f4b1_913034088e8646d79d725095677b0b1a~mv2.png/v1/fill/w_312,h_312,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_913034088e8646d79d725095677b0b1a~mv2.png", title: "Recovery, Injury Prevention & Mobility", link: "/technical" },
    { image: "https://static.wixstatic.com/media/e2ec89_74879ef601434395a9d63a2a8888c97a~mv2.jpg/v1/fill/w_312,h_312,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/e2ec89_74879ef601434395a9d63a2a8888c97a~mv2.jpg", title: "Technical Programming", link: "/technical" },
    { image: "https://static.wixstatic.com/media/c4f4b1_3572b859d7e04a29a183836a276c0028~mv2.png/v1/fill/w_312,h_312,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_3572b859d7e04a29a183836a276c0028~mv2.png", title: "Technical Training", link: "/technical" },
  ];

  // SPS Products
  const spsProducts = [
    { image: "https://static.wixstatic.com/media/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png/v1/fill/w_305,h_305,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2caac0dc6395432482b5aba3d86c5766~mv2.png", title: "Strength, Power & Speed Training", link: "/strength-power-speed" },
    { image: "https://static.wixstatic.com/media/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png/v1/fill/w_305,h_305,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_9e15981f708d47ab9d94c8c8bf241a9d~mv2.png", title: "Strength, Power & Speed Programming", link: "/strength-power-speed" },
  ];

  // Conditioning Products
  const conditioningProducts = [
    { image: "https://static.wixstatic.com/media/c4f4b1_ff883ecdb84447798addc2bef1be7c2b~mv2.png/v1/fill/w_310,h_310,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_ff883ecdb84447798addc2bef1be7c2b~mv2.png", title: "Conditioning Programming", link: "/conditioning" },
    { image: "https://static.wixstatic.com/media/c4f4b1_017fa5479b0149dc8131970689d6d548~mv2.png/v1/fill/w_310,h_310,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_017fa5479b0149dc8131970689d6d548~mv2.png", title: "Conditioning Training", link: "/conditioning" },
  ];

  // Nutrition Products
  const nutritionProducts = [
    { image: "https://static.wixstatic.com/media/c4f4b1_8c340cc141d4403896766ed99062189d~mv2.png/v1/fill/w_311,h_311,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_8c340cc141d4403896766ed99062189d~mv2.png", title: "Nutrition Programming & Recipes", link: "/nutrition" },
    { image: "https://static.wixstatic.com/media/c4f4b1_a08f374420154bd881dd65c67a18eae3~mv2.png/v1/fill/w_311,h_311,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_a08f374420154bd881dd65c67a18eae3~mv2.png", title: "Nutrition Review", link: "/nutrition" },
    { image: "https://static.wixstatic.com/media/c4f4b1_2cf2ae92e59c4ae9a8dcffc79ea5fca9~mv2.png/v1/fill/w_311,h_311,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2cf2ae92e59c4ae9a8dcffc79ea5fca9~mv2.png", title: "Nutrition Programming", link: "/nutrition" },
  ];

  // Data Products
  const dataProducts = [
    { image: "https://static.wixstatic.com/media/e2ec89_721d94e739554b42bcee3366201be597~mv2.png/v1/fill/w_311,h_311,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/e2ec89_721d94e739554b42bcee3366201be597~mv2.png", title: "Player Review", link: "/analysis" },
    { image: "https://static.wixstatic.com/media/c4f4b1_68b329be4c5c4e78aa25bd6129bd4bc5~mv2.png/v1/fill/w_311,h_311,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_68b329be4c5c4e78aa25bd6129bd4bc5~mv2.png", title: "Transfer Efficiency Report", link: "/analysis" },
    { image: "https://static.wixstatic.com/media/e2ec89_1f3e61bf392a4cdc8a8f02483a6c5c29~mv2.png/v1/fill/w_311,h_311,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/e2ec89_1f3e61bf392a4cdc8a8f02483a6c5c29~mv2.png", title: "Performance Efficiency Report", link: "/analysis" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Players - Football Performance Services | Fuel For Football"
        description="Fuel For Football is Football's leading performance consultancy. We work with Premier League and Football League players, offering strength, speed, power development, psychological performance sessions and game analysis."
        url="/players"
      />
      <Header />
      
      <main className="pt-20 md:pt-28">
        {/* Title Bar */}
        <section className="relative overflow-hidden border-b border-border/50 bg-glossy-green">
          <div className="container mx-auto relative z-10 flex items-center justify-center py-3 md:py-4">
            <h1 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider text-center text-primary-foreground leading-none">
              Players
            </h1>
          </div>
        </section>

        {/* Video Hero Banner */}
        <VideoHeroBanner 
          videoSrc="/videos/players-hero.mp4"
          title="FUEL FOR FOOTBALL"
        />

        {/* Full-Width Navigation Submenu */}
        <PlayersSubmenu />

        {/* What We Do Section */}
        <section className="py-5 md:py-12 bg-card/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <h2 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider text-center text-foreground mb-4 md:mb-8">
              What We Do
            </h2>
            <p className="text-center text-muted-foreground text-sm md:text-lg max-w-4xl mx-auto mb-8 md:mb-16">
              At Fuel For Football, we cover every aspect of performance across all four corners of the game. Our tailored programs help you make smarter decisions, refine your technical skills, and build the mental resilience needed to consistently outplay your opponents. Through our comprehensive approach, we ensure you are always prepared and confident, enabling you to dominate every match. Longer-term, we reduce injury risk, develop faster, and maximise potential.
            </p>

            {/* Four Corners Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {fourCorners.map((corner, index) => (
                <Link 
                  key={index}
                  to={corner.link}
                  className="group bg-card border border-border/50 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={corner.image} 
                      alt={corner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 md:p-6">
                    <h3 className="text-lg md:text-2xl font-bebas uppercase tracking-wider text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors">
                      {corner.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-2 md:mb-4 line-clamp-3 md:line-clamp-none">
                      {corner.description}
                    </p>
                    <span className="inline-flex items-center gap-1 md:gap-2 text-primary text-xs md:text-sm font-medium group-hover:gap-2 md:group-hover:gap-3 transition-all">
                      Learn More <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Hero Slider */}
        <HeroSlider 
          slides={[
            {
              image: "https://static.wixstatic.com/media/c4f4b1_7de02c74bb1142dea9ce0997961fd1f5~mv2.jpg/v1/fill/w_1920,h_600,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_7de02c74bb1142dea9ce0997961fd1f5~mv2.jpg",
              title: "Change The Game",
              subtitle: "Fuel For Football is Football's leading performance consultancy, focusing on player development and performance."
            },
            {
              image: "https://static.wixstatic.com/media/c4f4b1_2cc70832de7149aa87f67a71d4390f00~mv2.jpg/v1/fill/w_1920,h_600,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_2cc70832de7149aa87f67a71d4390f00~mv2.jpg",
              title: "Tactical Excellence",
              subtitle: "Read several passes ahead of play to consistently gain the advantage over your matchups."
            },
            {
              image: "https://static.wixstatic.com/media/c4f4b1_73a12b8d527341e594f266e5b77de8fe~mv2.jpg/v1/fill/w_1920,h_600,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_73a12b8d527341e594f266e5b77de8fe~mv2.jpg",
              title: "Physical Dominance",
              subtitle: "Become stronger, faster and more powerful to dominate on the pitch."
            }
          ]}
          autoplayDelay={5000}
        />

        {/* Players We've Worked With Rolling Slider */}
        <PlayerRollingSlider />

        {/* Choose Your Fuel Section */}
        <section className="py-10 md:py-24 bg-background">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider text-center text-foreground mb-4 md:mb-6">
              Choose Your Fuel
            </h2>
            <p className="text-center text-muted-foreground text-sm md:text-lg max-w-3xl mx-auto mb-6 md:mb-12">
              Already aware of where you need to work to make the greatest improvements to your game? Click through to the related service to learn more about how we can help. Alternatively, scroll down for a more general overview of our work.
            </p>

            {/* Services Grid */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto">
              {services.map((service, index) => (
                <Link
                  key={index}
                  to={service.link}
                  className="px-3 md:px-6 py-2 md:py-3 bg-primary/10 border border-primary/30 rounded-lg text-foreground font-bebas uppercase tracking-wider text-xs md:text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Needs Analysis Section */}
        <section className="py-10 md:py-24 bg-card/50">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider text-center text-foreground mb-8 md:mb-16">
              Needs Analysis
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {needsAnalysisSteps.map((step, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg border border-border/30 bg-card/50"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bebas text-primary">{step.number}</span>
                  </div>
                  <h3 className="text-base md:text-xl font-bebas uppercase tracking-wider text-foreground mb-2 md:mb-4">
                    {step.title}
                  </h3>
                  <ul className="text-muted-foreground text-xs md:text-sm space-y-1 md:space-y-2">
                    {step.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tactical Analysis Section */}
        <ServiceSection
          id="tactical"
          title="Tactical Analysis"
          description="Unlock new layers to your game and rise above the competition with our analysis. Transform your decision-making and positional awareness with insights into how you can be more effective. Develop strategies by studying the opponent and individual matchups through our pre-match analysis, to gain a competitive edge. Our post-match analysis provides detailed evaluations of your performance, highlighting strengths and areas for improvement with long-term development in mind."
          products={tacticalProducts}
          dailyFuelArticle={{
            image: "https://static.wixstatic.com/media/e2ec89_d105658f3d8f43eb99e7f91f4c91e73f~mv2.png/v1/fill/w_285,h_285,fp_0.50_0.50,q_95,enc_avif,quality_auto/e2ec89_d105658f3d8f43eb99e7f91f4c91e73f~mv2.webp",
            title: "The Jab Step - 1v1 Dribbling",
            link: "/daily-fuel"
          }}
          dailyFuelDescription="Breaking down the game with an advanced lens, showing technical breakdowns and discussing important tactical ideas from the POV of the player."
          learnMoreLink="/tactical"
          learnMoreText="Tactical"
        />

        {/* Psychological Performance Section */}
        <ServiceSection
          id="psychological"
          title="Psychological Performance"
          description="Football is not solely about skill; the fine margins are decided by will. Our psychological services fortify your mind, empowering you to tackle challenges, manage pressure, and perform consistently at the highest level. Whether battling performance anxiety or simply boosting mental resilience, our tailored 1:1 training provides the mental edge. We test your mental skills and develop individualised sessions to enhance consistency, confidence, resilience, and focus."
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
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider text-center text-foreground mb-4">
              Not Sure What Will Make The Greatest Impact?
            </h2>
            <p className="text-center text-muted-foreground text-sm md:text-lg max-w-3xl mx-auto mb-8">
              Consider a <strong>Consultation</strong>, which runs like any good doctor's appointment. We discuss your game and get into the intricacies of your situation, to be able to provide a strong understanding of what to do and a comprehensive plan of action. Equally, our <strong>Player Efficiency Report</strong> can give a direct view on how you can improve in line with what clubs scout and make recruitment decisions based on.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/services/consultation">
                <Button size="lg" className="gap-2 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 font-bebas uppercase tracking-wider">
                  Book a Consultation
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>
              <Link to="/services/data">
                <Button size="lg" variant="outline" className="gap-2 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 font-bebas uppercase tracking-wider">
                  Performance Efficiency Report
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-10 md:py-24 border-t border-border/50 bg-[#fafafa]">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider mb-4 md:mb-6" style={{ color: '#008240' }}>
              Ready to Elevate Your Game?
            </h2>
            <p className="text-base md:text-lg mb-6 md:mb-8" style={{ color: '#008240' }}>
              Get in touch to discuss how we can help you reach your full potential as a footballer.
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 font-bebas uppercase tracking-wider">
                Contact Us
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Players;
