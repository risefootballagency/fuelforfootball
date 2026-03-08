import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServicePillars,
  ServiceSectionTitle,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";
import { WhatsIncludedDialog } from "@/components/services/WhatsIncludedDialog";
import { PortalExampleDialog } from "@/components/services/PortalExampleDialog";
import { ArrowRight, Info, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Analysis = () => {
  const { t } = useLanguage();
  const [whatsIncludedOpen, setWhatsIncludedOpen] = useState(false);
  const [portalExampleOpen, setPortalExampleOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState("post-match");

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_3cb0b27e76454bdea2d63ff66acfddfa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Positioning.png", label: t("analysis.pillar_positioning", "POSITIONING") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_34064a3af1fb4cda857abb786edea7ae~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Movement.png", label: t("analysis.pillar_movement", "MOVEMENT") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_4f2f0e863b8949f19d464230d2ce0910~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Decision-Making.png", label: t("analysis.pillar_decision", "DECISION-MAKING") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_41d76a61f7a8411a8c48c65b0b350c64~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Vision%20(1).png", label: t("analysis.pillar_vision", "VISION") },
  ];

  const analysisServices = [
    {
      title: t("analysis.prematch_title", "PRE-MATCH OPPOSITION ANALYSIS"),
      subtitle: t("analysis.prematch_subtitle", "KNOW YOUR ENEMY"),
      features: [
        t("analysis.prematch_f1", "Read ahead of play more easily"),
        t("analysis.prematch_f2", "Know your matchup's weaknesses"),
        t("analysis.prematch_f3", "Feel prepared going into any game"),
      ],
      description: t("analysis.prematch_desc", "Our pre-match opposition analysis provides a competitive edge by examining the opposing team's tactics and formations before an upcoming game. We focus on their defensive and offensive patterns, directly relating to your position and tactics."),
      example: t("analysis.prematch_example", "Example: Slovakia vs England (30/06/24)"),
      price: t("analysis.prematch_price", "FROM £85.00"),
      productId: "6c369b05-d410-4955-98e6-20a936019079",
      serviceType: "pre-match",
      tabLabel: t("analysis.prematch_tab", "Pre-Match Opposition Analysis"),
      video: "https://wodoiizsonuwtniziicv.supabase.co/storage/v1/object/public/marketing-gallery/1769802291782_rhoue5.mp4",
    },
    {
      title: t("analysis.postmatch_title", "POST-MATCH ANALYSIS"),
      subtitle: t("analysis.postmatch_subtitle", "LEARN FROM EVERY PERFORMANCE"),
      features: [
        t("analysis.postmatch_f1", "See the game through experienced eyes"),
        t("analysis.postmatch_f2", "The fastest way to improving in matches"),
        t("analysis.postmatch_f3", "It is not what you look at, it is what you see"),
      ],
      description: t("analysis.postmatch_desc", "In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses. The detail in our analysis will make vast improvements to your game when applied."),
      example: t("analysis.postmatch_example", "Example: Máté Sajbán vs Debrecen (13/08/23)"),
      price: t("analysis.postmatch_price", "FROM £85.00"),
      productId: "bd421bfa-2819-444b-aaa7-8de168f2b171",
      serviceType: "post-match",
      tabLabel: t("analysis.postmatch_tab", "Post-Match Analysis"),
      video: "https://wodoiizsonuwtniziicv.supabase.co/storage/v1/object/public/marketing-gallery/1769802169267_m2rqay.mp4",
    },
    {
      title: t("analysis.positional_title", "POSITIONAL GUIDE"),
      subtitle: t("analysis.positional_subtitle", "MASTER YOUR ROLE"),
      features: [
        t("analysis.positional_f1", "Break down any concept at a higher level"),
        t("analysis.positional_f2", "Easily access solutions to the problems you face"),
        t("analysis.positional_f3", "See the game differently"),
      ],
      description: t("analysis.positional_desc", "Positional guide pieces utilise the best players in the world to explain advanced tactical ideas, allowing you to see the game through a more intellectual lens. We break down everything important to learn and apply in a simple format."),
      example: t("analysis.positional_example", "Example: Winger Positioning & Movement"),
      price: t("analysis.positional_price", "FROM £85.00"),
      productId: "853b38f5-27f3-4482-9ad2-99c10983e988",
      serviceType: "positional",
      tabLabel: t("analysis.positional_tab", "Positional Guide"),
      video: "https://wodoiizsonuwtniziicv.supabase.co/storage/v1/object/public/marketing-gallery/1769802237402_x0kyne.mp4",
    },
    {
      title: t("analysis.efficiency_title", "PLAYER EFFICIENCY REPORT"),
      subtitle: t("analysis.efficiency_subtitle", "DATA-DRIVEN INSIGHTS"),
      features: [
        t("analysis.efficiency_f1", "Earn new contracts and club interest"),
        t("analysis.efficiency_f2", "Evaluate performance more objectively"),
        t("analysis.efficiency_f3", "Measure progress"),
      ],
      description: t("analysis.efficiency_desc", "The Player Efficiency Report provides a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players. In addition to presenting the data, the report includes a detailed plan for improving performance."),
      example: t("analysis.efficiency_example", "Example: Michael Mulligan (23/24)"),
      price: t("analysis.efficiency_price", "FROM £95.00"),
      productId: "309ecacf-22ee-4467-8674-c6686968f6db",
      serviceType: "efficiency",
      tabLabel: t("analysis.efficiency_tab", "Player Efficiency Report"),
      image: "https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_400,h_300,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png",
    }
  ];

  const detailTabs = [
    {
      label: t("analysis.detail_overview", "Overview"),
      paragraphs: [
        t("analysis.detail_overview_p1", "The difference between a good player and a great player often lies in the depth of their game understanding. With our bespoke analysis services, we help you unlock new layers of your performance and rise above your competition."),
        t("analysis.detail_overview_p2", "The best athletes in the world invest significant time in performance analysis. It is not solely about enhancing tactical development - it is about uncovering insights into technical, physical, and psychological performance."),
        t("analysis.detail_overview_p3", "Our expert analysts employ expert coaching techniques and tools, dissecting your gameplay to provide an in-depth understanding of your strengths and areas to improve."),
      ],
      productId: null
    },
    {
      label: t("analysis.detail_prematch", "Pre-Match Opposition Analysis"),
      paragraphs: [
        t("analysis.detail_prematch_p1", "Pre-match opposition analysis is delivered to our players at the start of the match week, giving time to absorb the information and use it in preparation."),
        t("analysis.detail_prematch_p2", "We analyse your direct opponents - their strengths, weaknesses, preferred movements, and tendencies. You'll know exactly what to expect and how to exploit their vulnerabilities."),
        t("analysis.detail_prematch_p3", "The analysis includes video clips, tactical diagrams, and clear action points for you to focus on during the match."),
      ],
      productId: "6c369b05-d410-4955-98e6-20a936019079"
    },
    {
      label: t("analysis.detail_postmatch", "Post-Match Analysis"),
      paragraphs: [
        t("analysis.detail_postmatch_p1", "In post-match analysis, we cut through the game to focus on how to be more consistent with your strengths and how to eliminate your weaknesses."),
        t("analysis.detail_postmatch_p2", "We review every touch, every decision, and every movement - identifying patterns in your play and specific moments where different choices could have led to better outcomes."),
        t("analysis.detail_postmatch_p3", "Each analysis comes with a clear development plan and specific areas to work on before your next match."),
      ],
      productId: "bd421bfa-2819-444b-aaa7-8de168f2b171"
    },
    {
      label: t("analysis.detail_positional", "Positional Guide"),
      paragraphs: [
        t("analysis.detail_positional_p1", "Positional guide pieces utilise the best players in the world to explain advanced tactical ideas, allowing you to see the game through a more intellectual lens."),
        t("analysis.detail_positional_p2", "We create bespoke content specific to your position and the areas you need to develop. Using examples from elite players, we show you exactly how to execute at the highest level."),
        t("analysis.detail_positional_p3", "Guides cover positioning, movement patterns, decision-making triggers, and much more."),
      ],
      productId: "853b38f5-27f3-4482-9ad2-99c10983e988"
    },
    {
      label: t("analysis.detail_efficiency", "Player Efficiency Report"),
      paragraphs: [
        t("analysis.detail_efficiency_p1", "The Player Efficiency Report provides a comprehensive analysis of the performance statistics that clubs use to evaluate and recruit players."),
        t("analysis.detail_efficiency_p2", "We compare your statistics against positional benchmarks, league averages, and top performers. This gives you clear evidence of your strengths and specific targets for improvement."),
        t("analysis.detail_efficiency_p3", "Reports are formatted professionally for sharing with agents, clubs, and scouts - showcasing your value in the transfer market."),
      ],
      productId: "309ecacf-22ee-4467-8674-c6686968f6db"
    }
  ];

  const openWhatsIncluded = (serviceType: string) => {
    setSelectedServiceType(serviceType);
    setWhatsIncludedOpen(true);
  };

  return (
    <ServicePageLayout
      category={t("analysis.category", "ANALYSIS")}
      title={t("analysis.hero_title", "SEE THE GAME BEFORE IT HAPPENS")}
      heroVideo="/videos/players-hero.mp4"
      heroVideoWithBorders
      statsPageKey="analysis"
    >
      {/* Four Pillars with Dark Green Background */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <ServicePillars pillars={pillars} large />
        </div>
      </section>

      {/* Our Analysis Services */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("analysis.section_services", "OUR ANALYSIS SERVICES")}</ServiceSectionTitle>
          
          <div className="space-y-6 max-w-6xl mx-auto mt-4">
            {analysisServices.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index}
                  className="group bg-gradient-to-br from-black/80 to-black/60 border border-white/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-accent/40"
                >
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Media Section */}
                    <div className="relative lg:w-1/2 h-64 lg:h-auto min-h-[280px]">
                      {service.video ? (
                        <video 
                          autoPlay 
                          loop 
                          muted 
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        >
                          <source src={service.video} type="video/mp4" />
                        </video>
                      ) : service.image ? (
                        <img 
                          src={service.image}
                          alt={service.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <Button 
                        onClick={() => setPortalExampleOpen(true)}
                        className="absolute top-4 right-4 font-bebas tracking-wider bg-black/50 hover:bg-black/70 border border-accent/50 text-accent hover:text-white px-4 py-2 text-sm z-10 backdrop-blur-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t("analysis.view_example", "VIEW EXAMPLE")}
                      </Button>
                      
                      <p className="absolute bottom-4 left-4 text-sm text-white/70">{service.example}</p>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-accent" />
                        </div>
                        <h3 className="font-bebas text-2xl lg:text-3xl text-white tracking-wide">
                          {service.title}
                        </h3>
                      </div>
                      
                      <p className="text-accent font-bebas text-sm tracking-widest mb-4">
                        {service.subtitle}
                      </p>

                      <p className="text-white/80 text-sm leading-relaxed mb-5">
                        {service.description}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-center gap-2 text-white/90 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-col gap-3 mt-auto">
                        <p className="font-bebas text-xl text-accent tracking-wide">{service.price}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <LocalizedLink to={`/services?service=${service.productId}`}>
                            <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-6 py-2.5 text-base group/btn">
                              {t("analysis.learn_more", "LEARN MORE")}
                              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                          </LocalizedLink>
                          <Button 
                            variant="ghost"
                            onClick={() => openWhatsIncluded(service.serviceType)}
                            className="font-bebas tracking-wider text-white/60 hover:text-white hover:bg-white/10 px-3 text-sm"
                          >
                            <Info className="w-4 h-4 mr-1" />
                            {t("analysis.whats_included", "WHAT'S INCLUDED")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* In Detail Section */}
      <section className="relative overflow-hidden bg-[#051208]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("analysis.section_detail", "IN DETAIL")}</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceDetailTabs tabs={detailTabs.map(tab => ({
              label: tab.label,
              content: (
                <div className="space-y-3 max-w-6xl mx-auto">
                  {tab.paragraphs.map((text, pIndex) => (
                    <div 
                      key={pIndex}
                      className="group/card relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-5 transition-all duration-300 hover:border-accent/50 hover:from-white/[0.12] hover:to-white/[0.05] hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/10 cursor-pointer"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/30 rounded-l-xl transition-all duration-300 group-hover/card:bg-accent group-hover/card:w-1.5 group-hover/card:shadow-lg group-hover/card:shadow-accent/50" />
                      
                      <p className="text-white/90 text-sm md:text-base leading-relaxed pl-3">
                        {text}
                      </p>
                    </div>
                  ))}
                  {tab.productId && (
                    <div className="flex justify-center pt-4 pb-2">
                      <LocalizedLink to={`/services?service=${tab.productId}`}>
                        <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-10 py-3 text-lg group/btn">
                          {t("analysis.learn_more", "LEARN MORE")}
                          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </LocalizedLink>
                    </div>
                  )}
                </div>
              )
            }))} />
          </div>
        </div>
      </section>

      {/* Full Package */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 pt-0 pb-4">
          <ServiceFullPackage />
        </div>
      </section>

      {/* Dialogs */}
      <WhatsIncludedDialog 
        open={whatsIncludedOpen}
        onOpenChange={setWhatsIncludedOpen}
        serviceType={selectedServiceType}
      />
      <PortalExampleDialog
        open={portalExampleOpen}
        onOpenChange={setPortalExampleOpen}
      />
    </ServicePageLayout>
  );
};

export default Analysis;
