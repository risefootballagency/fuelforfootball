import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Target, Dumbbell, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/HeroSlider";
import { GrassBackground } from "@/components/GrassBackground";

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
      
      <main className="pt-24 md:pt-28">
        {/* Title Bar with grass background */}
        <section className="relative overflow-hidden py-4 border-b border-border/50">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('https://static.wixstatic.com/media/c4f4b1_152388c2eb9241f48863776d6ca92aff~mv2.jpg/v1/crop/x_0,y_113,w_2000,h_107/fill/w_1920,h_100,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Background%20Header.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 z-0 bg-background/40" />
          <div className="container mx-auto relative z-10">
            <h1 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider text-center text-foreground">
              Players
            </h1>
          </div>
        </section>

        {/* Grass top decoration */}
        <GrassBackground variant="top" />

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

        {/* Grass divider */}
        <GrassBackground variant="divider" />

        {/* What We Do Section */}
        <section className="py-16 md:py-24 px-4 relative overflow-hidden">
          <GrassBackground variant="section" />
          <div className="absolute inset-0 bg-background/80 z-[1]" />
          <div className="container mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider text-center text-foreground mb-8">
              What We Do
            </h2>
            <p className="text-center text-muted-foreground text-lg max-w-4xl mx-auto mb-16">
              At Fuel For Football, we cover every aspect of performance across all four corners of the game. Our tailored programs help you make smarter decisions, refine your technical skills, and build the mental resilience needed to consistently outplay your opponents. Through our comprehensive approach, we ensure you are always prepared and confident, enabling you to dominate every match. Longer-term, we reduce injury risk, develop faster, and maximise potential.
            </p>

            {/* Four Corners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="p-6">
                    <h3 className="text-2xl font-bebas uppercase tracking-wider text-foreground mb-3 group-hover:text-primary transition-colors">
                      {corner.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {corner.description}
                    </p>
                    <Link 
                      to={corner.link}
                      className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all"
                    >
                      Learn More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grass bottom divider */}
        <GrassBackground variant="bottom" />

        {/* Choose Your Fuel Section */}
        <section className="py-16 md:py-24 px-4 bg-background">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider text-center text-foreground mb-6">
              Choose Your Fuel
            </h2>
            <p className="text-center text-muted-foreground text-lg max-w-3xl mx-auto mb-12">
              Already aware of where you need to work to make the greatest improvements to your game? Click through to the related service to learn more about how we can help. Alternatively, scroll down for a more general overview of our work.
            </p>

            {/* Services Grid */}
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {services.map((service, index) => (
                <Link
                  key={index}
                  to={service.link}
                  className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-lg text-foreground font-bebas uppercase tracking-wider text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Needs Analysis Section with smoky background */}
        <section className="py-16 md:py-24 px-4 relative overflow-hidden">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('https://static.wixstatic.com/media/c4f4b1_8bec300b742b42df84829849d26331f1~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_8bec300b742b42df84829849d26331f1~mv2.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-background/70 z-[1]" />
          <div className="container mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider text-center text-foreground mb-16">
              Needs Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {needsAnalysisSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-3xl font-bebas text-primary">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bebas uppercase tracking-wider text-foreground mb-4">
                    {step.title}
                  </h3>
                  <ul className="text-muted-foreground text-sm space-y-2">
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
        <section className="py-16 md:py-24 px-4 bg-background border-t border-border/50">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider text-foreground mb-6">
              Ready to Elevate Your Game?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get in touch to discuss how we can help you reach your full potential as a footballer.
            </p>
            <Link to="/contact">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 font-bebas uppercase tracking-wider">
                Contact Us
                <ArrowRight className="w-5 h-5" />
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
