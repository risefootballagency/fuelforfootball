import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, Video, BarChart3, Target, Eye, TrendingUp, Users } from "lucide-react";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServicePillars,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  example?: string;
  features?: string[];
  icon?: React.ReactNode;
  reverse?: boolean;
}

const ServiceCard = ({ title, subtitle, description, price, image, example, features, icon, reverse }: ServiceCardProps) => (
  <Card className="overflow-hidden border-2 border-border hover:border-accent/50 transition-all duration-300 group">
    <div className={`grid lg:grid-cols-2 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      {/* Image Side */}
      <div className={`relative overflow-hidden ${reverse ? 'lg:order-2' : ''}`}>
        <img 
          src={image}
          alt={title}
          className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {example && (
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs text-white/70">Example: {example}</p>
          </div>
        )}
      </div>
      
      {/* Content Side */}
      <CardContent className={`p-6 lg:p-8 flex flex-col justify-center ${reverse ? 'lg:order-1' : ''}`}>
        <div className="flex items-start gap-3 mb-4">
          {icon && (
            <div className="p-2 rounded-lg bg-accent/20 text-accent shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-bebas text-2xl md:text-3xl text-foreground tracking-wider">{title}</h3>
            <p className="text-accent font-medium text-sm uppercase tracking-wider">{subtitle}</p>
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>
        
        {features && features.length > 0 && (
          <ul className="space-y-2 mb-6">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div>
            <p className="font-bebas text-2xl text-primary">{price}</p>
          </div>
          <LocalizedLink to="/contact">
            <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black group/btn">
              REQUEST QUOTE
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </LocalizedLink>
        </div>
      </CardContent>
    </div>
  </Card>
);

const Tactical = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_3cb0b27e76454bdea2d63ff66acfddfa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Positioning.png", label: "POSITIONING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_34064a3af1fb4cda857abb786edea7ae~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Movement.png", label: "MOVEMENT" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_4f2f0e863b8949f19d464230d2ce0910~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Decision-Making.png", label: "DECISION-MAKING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_41d76a61f7a8411a8c48c65b0b350c64~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Vision%20(1).png", label: "VISION" },
  ];

  const services = [
    {
      title: "PRE-MATCH OPPOSITION ANALYSIS",
      subtitle: "Know Your Enemy",
      description: "Our pre-match opposition analysis provides a competitive edge by examining the opposing team's tactics and formations before an upcoming game. We focus on their defensive and offensive patterns, directly relating to your position and tactics.",
      price: "From £85.00",
      image: "https://static.wixstatic.com/media/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg/v1/fill/w_600,h_400,q_90,enc_avif,quality_auto/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg",
      example: "Slovakia vs England (30/06/24)",
      features: [
        "Read ahead of play more easily",
        "Know your matchup's weaknesses",
        "Feel prepared going into any game"
      ],
      icon: <Target className="w-5 h-5" />,
    },
    {
      title: "POST-MATCH ANALYSIS",
      subtitle: "Learn From Every Performance",
      description: "In post-match analysis, we focus on strengths and areas for improvement, highlighting key moments. We offer specific advice around further integrating strengths and developing areas for improvement—turning analysis into a tool for your development.",
      price: "From £85.00",
      image: "https://static.wixstatic.com/media/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg/v1/fill/w_600,h_400,q_90,enc_avif,quality_auto/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg",
      example: "Máté Sajbán vs Debrecen (13/08/23)",
      features: [
        "See the game through experienced eyes",
        "The fastest way to improving in matches",
        "Extended PDF and annotated video included"
      ],
      icon: <Video className="w-5 h-5" />,
    },
    {
      title: "POSITIONAL GUIDE",
      subtitle: "Master Your Role",
      description: "A tactical positional guide provides detailed information about your specific position and formation, enabling a better understanding of your role and how to optimise your impact. Perfect for players arriving at a new club or with a new manager.",
      price: "From £85.00",
      image: "https://static.wixstatic.com/media/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg/v1/fill/w_600,h_400,q_90,enc_avif,quality_auto/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg",
      example: "Winger Positioning & Movement",
      features: [
        "Break down any concept at a higher level",
        "Access solutions to problems you face",
        "Covers advanced topics from top managers"
      ],
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "PLAYER EFFICIENCY REPORT",
      subtitle: "Data-Driven Development",
      description: "A comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. Includes a detailed plan for improving performance, highlighting areas of strength and suggesting pathways for progress.",
      price: "From £95.00",
      image: "https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_600,h_400,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png",
      example: "Michael Mulligan (23/24)",
      features: [
        "Earn new contracts and club interest",
        "Evaluate performance objectively",
        "Understand how scouts view you"
      ],
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  return (
    <ServicePageLayout
      category="ANALYSIS"
      title="SEE THE GAME BEFORE IT HAPPENS"
      heroVideo="/videos/players-hero.mp4"
    >
      <ServicePillars pillars={pillars} />

      {/* Services Grid */}
      <ServiceSection className="py-8 md:py-12">
        <ServiceSectionTitle>OUR ANALYSIS SERVICES</ServiceSectionTitle>
        
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.title}
              {...service}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </ServiceSection>

      {/* Quick Stats */}
      <ServiceSection dark className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { number: "500+", label: "Analyses Delivered" },
              { number: "74", label: "Professional Players" },
              { number: "18", label: "'Big 5' League Players" },
              { number: "8", label: "National Team Players" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-card/50 border-border">
                <CardContent className="p-4 md:p-6 text-center">
                  <p className="font-bebas text-3xl md:text-4xl text-accent">{stat.number}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ServiceSection>

      {/* In Detail Section */}
      <ServiceSection className="py-8 md:py-12">
        <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          <ServiceDetailTabs tabs={[
            {
              label: "Overview",
              content: (
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>The difference between a good player and a great player often lies in the depth of their game understanding. With our bespoke analysis services, we help you unlock new layers of your performance and rise above your competition.</p>
                  <p>The best athletes in the world invest significant time in performance analysis. It is not solely about enhancing tactical development - it is about uncovering insights into technical, physical, and psychological performance.</p>
                  <p>Our expert analysts employ expert coaching techniques and tools, dissecting your gameplay to provide an in-depth understanding of your strengths and areas to improve. Unlike team analysis, we focus on your individual role within the team.</p>
                </div>
              )
            },
            {
              label: "Pre-Match",
              content: (
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>Our pre-match opposition analysis provides a competitive edge by examining the opposing team's tactics and formations before an upcoming game. We focus on their defensive and offensive patterns, directly relating to your position.</p>
                  <p>Delivered at the start of the match week, our analysis allows you ample time to absorb and apply the information. You will gain a thorough understanding of the opposition's schemes and individual matchups.</p>
                </div>
              )
            },
            {
              label: "Post-Match",
              content: (
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>In post-match analysis, we focus on strengths and areas for improvement, highlighting key moments that illustrate both. We offer specific advice around further integrating strengths and developing areas for improvement.</p>
                  <p>Post-match analysis is delivered in the days after the game for the fastest download of information. Each analysis includes an extended PDF and annotated video with optional voiceover.</p>
                </div>
              )
            },
            {
              label: "Positional",
              content: (
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>A tactical positional guide is a valuable resource for players who want to enhance their performance. It provides detailed information about your specific position and formation.</p>
                  <p>A positional guide is a comprehensive view into the decisions and execution of the best players in any position, formation or team. Perfect for players arriving at a new club or needing to develop tactically.</p>
                </div>
              )
            },
            {
              label: "Efficiency",
              content: (
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>The Player Efficiency Report provides a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. It includes a detailed plan for improving performance.</p>
                  <p>Our report is a data-backed evaluation of a player's current levels of performance compared to their team, league and impact on games. Invaluable for players seeking transfers or looking to develop their game.</p>
                </div>
              )
            }
          ]} />
        </div>
      </ServiceSection>

      {/* CTA Section */}
      <ServiceSection dark className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-bebas text-3xl md:text-5xl text-foreground mb-4">READY TO SEE THE GAME DIFFERENTLY?</h2>
          <p className="text-muted-foreground mb-8">Get in touch to discuss which analysis service is right for your development.</p>
          <LocalizedLink to="/contact">
            <Button size="lg" className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-12 py-6 text-xl">
              GET STARTED TODAY
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </LocalizedLink>
        </div>
      </ServiceSection>
    </ServicePageLayout>
  );
};

export default Tactical;
