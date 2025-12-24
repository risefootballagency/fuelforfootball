import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Clubs = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'strategy' | 'recruitment' | 'optimisation'>('strategy');
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "https://static.wixstatic.com/media/c4f4b1_475a678199654632a0000d61ca6bbfef~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_475a678199654632a0000d61ca6bbfef~mv2.jpg",
    },
  ];

  const tabContent = {
    strategy: {
      paragraphs: [
        "In order to beat the competition, effective and innovative strategies must be employed. We work to build winning sides both in the short term and long term through our bespoke approach. Whether a board of directors or heading up technical staff, our consultation provides essential insights to gain an advantage for your team. The major advantage we can guarantee to our clients is national exclusivity, providing our undivided time and resources, resulting in greater domestic success due to the prioritisation of your club over all others.",
        "At the heart of our strategy-building is an individualised approach. Due diligence is put into fully understanding the way an organisation thinks about the game, the culture it aims to build and what is most important to the key decision-makers. This allows us to create and provide the tools for a completely unique and tailored strategy for success.",
        "Our extensive knowledge of what it takes to build a winning team and how to adapt the underlying protocols that lead to these, allows us to adapt approaches to the distinct needs of the club. These prove especially impactful in combination with our broad application of reasoning to get to the heart of any internal or external issue. Unlike the average organisation that remains reactive to changes in the footballing landscape, our team also works to stay ahead of the curve on key developments to avoid future pitfalls and be first to potential opportunities."
      ]
    },
    recruitment: {
      paragraphs: [
        "In a competitive market, the combination of greater finances, superior scouting and networking results in the greatest success on the pitch. Our work impacts all three to put your club in the prime position to execute at a higher level than all its competitors. Ensure that you find, convince and sign the greatest and best-fitted talent each and every season; while simultaneously making wise decisions on the timing of departures for expert squad-building.",
        "Our analysis extends across the entirety of professional football within Europe, allowing us to pick up on players that club scouting networks can easily miss. Furthermore, our talent identification ensures prudent signings including undervalued players and key contributors to success on the pitch. We consider not only the raw ability and potential of players, but also their technical and tactical adaptability to playstyles, as well as experience within related systems.",
        "A major aspect to this is our broad network which spans across half of the globe with key decision-makers in clubs at all levels of the game. This combined with our reputation for recruiting great fits for our clients allows us to tap into any market to ensure deals are completed."
      ]
    },
    optimisation: {
      paragraphs: [
        "Where we stand apart from other agencies and help to elevate your side is in our unique expertise in the domain of performance. With vast experience developing players and support staff, our consultation provides a platform to develop your personnel and improve results on the pitch.",
        "As part of our comprehensive approach to player development, we do not offer generic advice; instead, we provide analysis that is specific to the club's needs. This means understanding the parameters that allow for success at the current level while supporting the playing to strengths of individuals and overcoming any potential weaknesses.",
        "In terms of coach development, we work to achieve vertical and horizontal alignment of support staff and break down the silo effect which so easily sets in at clubs. To do this, we work actively with coaches and management to offer a unique perspective and provide key insights with timeliness."
      ]
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-[#0a3d0a]" key="clubs-page">
      <SEO 
        title="For Clubs - Strategic Football Partnerships | Fuel For Football"
        description="Work with Fuel For Football to strategise, recruit, and optimize your squad. Access our extensive network of talented players and expert player development programs."
        image="/og-preview-clubs.png"
        url="/clubs"
      />
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* CLUBS Title Banner */}
        <div className="bg-[#1a1a1a] py-3 md:py-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bebas uppercase tracking-[0.3em] text-white">
            CLUBS
          </h1>
        </div>

        {/* Hero Section with Carousel */}
        <section className="relative h-[500px] md:h-[600px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
          />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bebas uppercase tracking-wider mb-8">
                <span className="text-[#FFD700] bg-[#FFD700]/20 px-4 py-1 inline-block">THE COMPETITIVE</span>
                <br />
                <span className="text-[#FFD700] bg-[#FFD700]/20 px-4 py-1 inline-block mt-2">ADVANTAGE</span>
              </h2>
              
              <div className="bg-[#0a3d0a]/90 p-6 md:p-8 max-w-3xl mx-auto mb-6">
                <p className="text-white text-sm md:text-base leading-relaxed">
                  We partner with clubs to enhance their overall performance and operational efficiency. By providing comprehensive support in player development, tactical analysis, and strategic planning, we help clubs achieve sustained success on and off the pitch. Our bespoke services are tailored to meet the specific needs of each club, ensuring that every aspect of performance is optimised. From developing young talent to refining first-team operations and improving management, we offer the expertise and insights necessary to drive your club forward.
                </p>
              </div>

              <Button 
                asChild 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 font-bebas uppercase tracking-[0.2em] px-8 py-6 text-lg"
              >
                <Link to="/contact">BOOK A CONSULTATION</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* HOW WE FUEL Section */}
        <section 
          className="relative py-12 md:py-16"
          style={{
            backgroundImage: `url(https://static.wixstatic.com/media/c4f4b1_ecb5f8902dc448c4ae5f0739b810bd7b~mv2.png/v1/fill/w_1920,h_576,al_c,q_90,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_ecb5f8902dc448c4ae5f0739b810bd7b~mv2.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bebas uppercase tracking-[0.2em] text-white italic">
              HOW WE FUEL
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 px-4">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-0">
              <button
                onClick={() => setActiveTab('strategy')}
                className={`px-6 md:px-12 lg:px-16 py-3 md:py-4 font-bebas uppercase tracking-[0.1em] md:tracking-[0.15em] text-base md:text-lg lg:text-xl transition-all ${
                  activeTab === 'strategy' 
                    ? 'bg-[#FFD700] text-black' 
                    : 'bg-transparent text-white border border-white/30 hover:bg-white/10'
                }`}
              >
                STRATEGY
              </button>
              <button
                onClick={() => setActiveTab('recruitment')}
                className={`px-6 md:px-12 lg:px-16 py-3 md:py-4 font-bebas uppercase tracking-[0.1em] md:tracking-[0.15em] text-base md:text-lg lg:text-xl transition-all ${
                  activeTab === 'recruitment' 
                    ? 'bg-[#FFD700] text-black' 
                    : 'bg-transparent text-white border border-white/30 hover:bg-white/10'
                }`}
              >
                RECRUITMENT
              </button>
              <button
                onClick={() => setActiveTab('optimisation')}
                className={`px-6 md:px-12 lg:px-16 py-3 md:py-4 font-bebas uppercase tracking-[0.1em] md:tracking-[0.15em] text-base md:text-lg lg:text-xl transition-all ${
                  activeTab === 'optimisation' 
                    ? 'bg-[#FFD700] text-black' 
                    : 'bg-transparent text-white border border-white/30 hover:bg-white/10'
                }`}
              >
                OPTIMISATION
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="space-y-5 text-white text-sm md:text-base leading-relaxed">
              {tabContent[activeTab].paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* CHANGE THE GAME Section */}
        <section 
          className="relative py-16 md:py-20"
          style={{
            backgroundImage: `url(https://static.wixstatic.com/media/c4f4b1_151de22e2aae4c939735fc18e9e99715~mv2.png/v1/fill/w_1920,h_561,al_c,q_90,usm_2.00_1.00_0.00,enc_avif,quality_auto/c4f4b1_151de22e2aae4c939735fc18e9e99715~mv2.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bebas uppercase tracking-[0.2em] text-white">
                CHANGE THE GAME
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-5xl mx-auto">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bebas uppercase tracking-wider text-white mb-2">
                  Our MISSION
                </h3>
                <p className="text-[#FFD700] text-lg md:text-xl lg:text-2xl font-bebas uppercase tracking-wider mb-6">
                  TO CHANGE THE GAME
                </p>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  Our mission is to change the game by revolutionising the way football approaches performance. In an era where transfers are reaching nine figures, the cost-effectiveness of optimising performance provision has never been more crucial. We aim to provide innovative, data-driven solutions that maximise player and team performance, ensuring that every investment in talent yields the highest possible return.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src="https://static.wixstatic.com/media/e2ec89_b6260e4f33834298bae077df6596c010~mv2.jpg/v1/fill/w_588,h_441,al_c,q_80,usm_2.00_1.00_0.00,enc_avif,quality_auto/e2ec89_b6260e4f33834298bae077df6596c010~mv2.jpg"
                  alt="Football match"
                  className="rounded-lg shadow-xl max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* START NOW CTA Section */}
        <section className="py-16 md:py-20 bg-[#1a1a1a]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bebas uppercase tracking-[0.2em] text-white mb-6 md:mb-8">
              START NOW
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-4xl mx-auto mb-8 md:mb-10">
              In the world of football, every club yearns for success. Fuel for Football is your strategic ally in crafting this legacy. We deliver services designed to elevate every aspect of your club's performance - from fostering superior player development to bolstering cohesive team dynamics and honing cutting-edge tactical strategies. Our expert guidance does not stop at the first team, but extends to nurturing the stars of tomorrow within your youth ranks. By partnering with us, you are investing in the future success of your club on and off the pitch. Fuel for Football is more than just a support system; we are the fuel that powers your team to long-term success.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bebas uppercase tracking-[0.2em] px-8 md:px-10 py-5 md:py-6 text-base md:text-lg"
            >
              <Link to="/contact">BOOK A CONSULTATION</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Clubs;
