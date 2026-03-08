import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Target, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import {
  ServicePageLayout,
  ServiceSectionTitle,
  ServiceContentBlock,
  ServiceInfoCard,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";
import { ServiceOfferingCard } from "@/components/services/ServiceOfferingCard";

const ActionReports = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: Play, title: t("action_reports.step1_title", "VIDEO SUBMISSION"), description: t("action_reports.step1_desc", "Upload your match footage or provide access to game recordings.") },
    { icon: Target, title: t("action_reports.step2_title", "ACTION LOGGING"), description: t("action_reports.step2_desc", "Our analysts log every significant action you take throughout the match.") },
    { icon: BarChart3, title: t("action_reports.step3_title", "DEEP ANALYSIS"), description: t("action_reports.step3_desc", "Each action is rated, categorised, and analysed for tactical effectiveness.") },
    { icon: TrendingUp, title: t("action_reports.step4_title", "REPORT DELIVERY"), description: t("action_reports.step4_desc", "Receive a comprehensive report with clips, scores, and improvement priorities.") },
  ];

  const pricing = [
    { reports: t("action_reports.tier1_reports", "1 REPORT"), price: "£85", perReport: t("action_reports.tier1_per", "Single match analysis"), featured: false },
    { reports: t("action_reports.tier2_reports", "10 REPORTS"), price: "£499", perReport: t("action_reports.tier2_per", "£49.90 per report"), savings: t("action_reports.tier2_savings", "Save £351"), featured: false },
    { reports: t("action_reports.tier3_reports", "20 REPORTS"), price: "£899", perReport: t("action_reports.tier3_per", "£44.95 per report"), savings: t("action_reports.tier3_savings", "Save £801"), featured: true },
    { reports: t("action_reports.tier4_reports", "40 REPORTS"), price: "£1,399", perReport: t("action_reports.tier4_per", "£34.98 per report"), savings: t("action_reports.tier4_savings", "Save £2,001"), featured: false },
  ];

  const actionReportServices = [
    {
      title: t("action_reports.service1_title", "SINGLE ACTION REPORT"),
      subtitle: t("action_reports.service1_subtitle", "MATCH ANALYSIS"),
      description: t("action_reports.service1_desc", "A granular breakdown of every significant action you take during a match. Each action is timestamped, clipped from match footage, and analysed against tactical principles specific to your position."),
      features: [
        t("action_reports.service1_f1", "Every action timestamped and rated"),
        t("action_reports.service1_f2", "Video clips of key moments"),
        t("action_reports.service1_f3", "Tactical effectiveness scoring")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_400,h_300,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png",
      price: t("action_reports.service1_price", "FROM £85.00"),
    },
    {
      title: t("action_reports.service2_title", "10 REPORT PACKAGE"),
      subtitle: t("action_reports.service2_subtitle", "COMPREHENSIVE TRACKING"),
      description: t("action_reports.service2_desc", "Regular action reports throughout your season with trend analysis and progress tracking. See how your decision-making and execution improves over time with detailed performance data."),
      features: [
        t("action_reports.service2_f1", "Trend analysis over time"),
        t("action_reports.service2_f2", "Progress tracking dashboard"),
        t("action_reports.service2_f3", "Priority areas identified")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_400,h_300,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png",
      price: t("action_reports.service2_price", "FROM £499.00"),
    },
  ];

  return (
    <ServicePageLayout
      category={t("action_reports.category", "ACTION REPORTS")}
      title={t("action_reports.hero_title", "EVERY ACTION MATTERS")}
      subtitle={t("action_reports.hero_subtitle", "Deep-dive analysis of your in-game actions with video clips, tactical breakdowns, and actionable insights to elevate every touch.")}
      heroVideo="/videos/players-hero.mp4"
      heroVideoWithBorders
      statsPageKey="action-reports"
    >
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("action_reports.section_what", "WHAT ARE ACTION REPORTS?")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceContentBlock
              paragraphs={[
                t("action_reports.what_p1", "An Action Report is a granular breakdown of every significant action you take during a match. Unlike traditional post-match analysis that focuses on general performance trends, Action Reports zoom in on individual moments—passes, dribbles, defensive interventions, shots, runs, and more."),
                t("action_reports.what_p2", "Each action is timestamped, clipped from match footage, and analysed against tactical principles specific to your position. You'll see exactly what you did well, what you could improve, and why certain decisions led to success or missed opportunities."),
                t("action_reports.what_p3", "This micro-level analysis reveals patterns invisible to the naked eye: decision-making tendencies, spatial awareness gaps, timing issues, and technical habits that aggregate into your overall performance profile.")
              ]}
            />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("action_reports.section_how", "HOW IT WORKS")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-black/40 border border-white/10 rounded-xl p-6 text-center hover:border-accent/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bebas text-base md:text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-white/70 text-xs md:text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("action_reports.section_services", "OUR ACTION REPORT SERVICES")}</ServiceSectionTitle>
          <div className="space-y-6 max-w-6xl mx-auto mt-4">
            {actionReportServices.map((service, index) => (
              <ServiceOfferingCard key={index} title={service.title} subtitle={service.subtitle} description={service.description} features={service.features} image={service.image} price={service.price} reverse={index % 2 !== 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("action_reports.section_included", "WHAT'S INCLUDED")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4 grid sm:grid-cols-2 gap-6">
            <ServiceInfoCard title={t("action_reports.included1_title", "ACTION BREAKDOWN")} items={[t("action_reports.included1_i1", "Every action timestamped and categorised"), t("action_reports.included1_i2", "Video clips of key moments"), t("action_reports.included1_i3", "Success/failure assessment per action"), t("action_reports.included1_i4", "Positional context for each play"), t("action_reports.included1_i5", "Minute-by-minute activity tracking")]} />
            <ServiceInfoCard title={t("action_reports.included2_title", "TACTICAL SCORING")} items={[t("action_reports.included2_i1", "R90 performance score calculation"), t("action_reports.included2_i2", "Action-by-action ratings"), t("action_reports.included2_i3", "Category breakdowns (attacking, defensive, etc.)"), t("action_reports.included2_i4", "Zone-based analysis"), t("action_reports.included2_i5", "Comparison to positional benchmarks")]} />
            <ServiceInfoCard title={t("action_reports.included3_title", "VIDEO CLIPS")} items={[t("action_reports.included3_i1", "Individual clips for every logged action"), t("action_reports.included3_i2", "Highlight reel of best moments"), t("action_reports.included3_i3", "Areas for improvement compilation"), t("action_reports.included3_i4", "Easy sharing with coaches"), t("action_reports.included3_i5", "Downloadable formats")]} />
            <ServiceInfoCard title={t("action_reports.included4_title", "INSIGHTS & RECOMMENDATIONS")} items={[t("action_reports.included4_i1", "Performance overview narrative"), t("action_reports.included4_i2", "Key strengths identified"), t("action_reports.included4_i3", "Priority areas for development"), t("action_reports.included4_i4", "Specific drills and exercises"), t("action_reports.included4_i5", "Next match focus points")]} />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("action_reports.section_pricing", "PRICING")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pricing.map((tier, index) => (
              <div key={index} className={`bg-black/40 border rounded-xl p-5 md:p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1 ${tier.featured ? 'border-accent' : 'border-white/10 hover:border-accent/50'}`}>
                <h3 className="font-bebas text-base md:text-lg text-white mb-2">{tier.reports}</h3>
                <p className="font-bebas text-2xl md:text-3xl text-accent mb-1">{tier.price}</p>
                {tier.savings && <p className="text-xs text-green-500 mb-2">{tier.savings}</p>}
                <p className="text-white/70 text-xs md:text-sm mb-4">{tier.perReport}</p>
                <LocalizedLink to="/contact">
                  <Button variant={tier.featured ? "default" : "outline"} className="w-full font-bebas tracking-wider text-sm">
                    {tier.featured ? t("action_reports.best_value", "Best Value") : t("action_reports.get_started", "Get Started")}
                  </Button>
                </LocalizedLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <div className="text-center">
            <h2 className="font-bebas text-2xl md:text-3xl lg:text-4xl text-white mb-4">
              {t("action_reports.cta_title", "READY TO UNDERSTAND YOUR GAME?")}
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8 text-sm md:text-base">
              {t("action_reports.cta_desc", "Stop guessing about your performance. Get detailed, actionable insights from every match with our Action Reports.")}
            </p>
            <LocalizedLink to="/contact">
              <Button size="lg" className="font-bebas tracking-wider text-base md:text-lg px-8">
                {t("action_reports.cta_button", "Book Your Report")}
              </Button>
            </LocalizedLink>
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

export default ActionReports;
