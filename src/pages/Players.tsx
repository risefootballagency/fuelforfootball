import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Target, Dumbbell, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/HeroSlider";

const Players = () => {
  const { t } = useLanguage();

  const fourCorners = [
    {
      icon: Target,
      title: "Tactical",
      description: "Sharpen your decision-making and see the game in a different light. Read several passes ahead of play to consistently gain the advantage over your matchups.",
      link: "/services",
      image: "https://static.wixstatic.com/media/c4f4b1_2cc70832de7149aa87f67a71d4390f00~mv2.jpg/v1/fill/w_285,h_173,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/c4f4b1_2cc70832de7149aa87f67a71d4390f00~mv2.jpg"
    },
    {
      icon: Brain,
      title: "Psychological",
      description: "Develop mental skills in consistency, commitment, confidence, resilience, and focus. Outwill opponents to overcome skill differences and dominate on the pitch.",
      link: "/services",
      image: "https://static.wixstatic.com/media/c4f4b1_aed8df24614a45b29533fede6bae55c7~mv2.jpg/v1/fill/w_285,h_173,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/gran.jpg"
    },
    {
      icon: Lightbulb,
      title: "Technical",
      description: "Master your touch, be more unpredictable and finish at will. Consistently deal with difficult balls into you and find ways to open up into what you do best.",
      link: "/services",
      image: "https://static.wixstatic.com/media/c4f4b1_c627e66f4e68449590b6f4f745b91472~mv2.jpg/v1/fill/w_285,h_173,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/got.jpg"
    },
    {
      icon: Dumbbell,
      title: "Physical",
      description: "Become stronger, faster and more powerful to dominate on the pitch. Condition and develop a capacity for training to progress more quickly and reduce injuries.",
      link: "/services",
      image: "https://static.wixstatic.com/media/c4f4b1_73a12b8d527341e594f266e5b77de8fe~mv2.jpg/v1/fill/w_285,h_173,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Copy%20of%20We%20play%20out%20from%20the%20back%20to%20advance%20into%20the%20opposition%20half_%20We%20then%20play%20throug.jpg"
    }
  ];

  const services = [
    { name: "Pro Performance", link: "/services" },
    { name: "Elite Performance", link: "/services" },
    { name: "Tactical", link: "/services" },
    { name: "Conditioning", link: "/services" },
    { name: "Strength, Power & Speed", link: "/services" },
    { name: "Nutrition", link: "/services" },
    { name: "Consultation", link: "/services" },
    { name: "Data Report", link: "/services" },
    { name: "Technical", link: "/services" },
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
        <section className="relative overflow-hidden py-3 md:py-4 border-b border-border/50 bg-primary">
          <div className="container mx-auto relative z-10 px-4">
            <h1 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider text-center text-primary-foreground">
              Players
            </h1>
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

        {/* What We Do Section */}
        <section className="py-10 md:py-24 px-3 md:px-4 bg-card/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <h2 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider text-center text-foreground mb-4 md:mb-8">
              What We Do
            </h2>
            <p className="text-center text-muted-foreground text-sm md:text-lg max-w-4xl mx-auto mb-8 md:mb-16 px-2">
              At Fuel For Football, we cover every aspect of performance across all four corners of the game. Our tailored programs help you make smarter decisions, refine your technical skills, and build the mental resilience needed to consistently outplay your opponents.
            </p>

            {/* Four Corners Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {fourCorners.map((corner, index) => (
                <div 
                  key={index}
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
                    <Link 
                      to={corner.link}
                      className="inline-flex items-center gap-1 md:gap-2 text-primary text-xs md:text-sm font-medium group-hover:gap-2 md:group-hover:gap-3 transition-all"
                    >
                      Learn More <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Choose Your Fuel Section */}
        <section className="py-10 md:py-24 px-3 md:px-4 bg-background">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider text-center text-foreground mb-4 md:mb-6">
              Choose Your Fuel
            </h2>
            <p className="text-center text-muted-foreground text-sm md:text-lg max-w-3xl mx-auto mb-6 md:mb-12 px-2">
              Already aware of where you need to work to make the greatest improvements to your game? Click through to the related service to learn more.
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
        <section className="py-10 md:py-24 px-3 md:px-4 bg-card/50">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-6xl font-bebas uppercase tracking-wider text-center text-foreground mb-8 md:mb-16">
              Needs Analysis
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {needsAnalysisSteps.map((step, index) => (
                <div key={index} className="text-center">
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

        {/* Bottom CTA Section */}
        <section className="py-10 md:py-24 px-4 border-t border-border/50" style={{ backgroundColor: '#fafafa' }}>
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
