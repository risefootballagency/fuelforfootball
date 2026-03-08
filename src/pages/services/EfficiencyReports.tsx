import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import {
  ServicePageLayout,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceInfoCard,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";
import { ServiceDetailTabs } from "@/components/services/ServiceDetailTabs";
import { ServiceOfferingCard } from "@/components/services/ServiceOfferingCard";

const EfficiencyReports = () => {
  const { t } = useLanguage();

  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_3cb0b27e76454bdea2d63ff66acfddfa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Positioning.png", label: t("efficiency.pillar_data", "DATA ANALYSIS") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_34064a3af1fb4cda857abb786edea7ae~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Movement.png", label: t("efficiency.pillar_bench", "BENCHMARKING") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_4f2f0e863b8949f19d464230d2ce0910~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Decision-Making.png", label: t("efficiency.pillar_metrics", "PERFORMANCE METRICS") },
    { icon: "https://static.wixstatic.com/media/c4f4b1_41d76a61f7a8411a8c48c65b0b350c64~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Vision%20(1).png", label: t("efficiency.pillar_scout", "SCOUT INSIGHTS") },
  ];

  const tabContent = [
    {
      label: t("efficiency.tab_overview", "Overview"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("efficiency.overview_p1", "Our Player Efficiency Reports provide a data-backed evaluation of your performance compared to your team, league, and positional benchmarks. Using the same metrics that professional clubs and scouts analyse, we give you insights into how you're viewed in the transfer market."),
            t("efficiency.overview_p2", "We comprehensively analyse the performance statistics clubs use to evaluate and recruit players. Through this analysis, we highlight your strengths in reports that can increase club interest and maximise the value of contracts you negotiate.")
          ]}
        />
      )
    },
    {
      label: t("efficiency.tab_metrics", "Metrics"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("efficiency.metrics_p1", "Each report breaks down key performance indicators specific to your position - from expected goals and assists for attackers, to defensive actions and passing accuracy for defenders. We compare your numbers against league averages and top performers to show exactly where you stand."),
            t("efficiency.metrics_p2", "We track metrics including xG, xA, progressive passes, ball recoveries, duels won, pressures, and many more position-specific KPIs. These are the exact numbers scouts and recruitment teams analyse when evaluating players."),
            t("efficiency.metrics_p3", "Our benchmarking system compares you against players in your league, your position, and your age group - giving you clear targets for improvement and evidence of your standout attributes.")
          ]}
        />
      )
    },
    {
      label: t("efficiency.tab_reports", "Reports"),
      content: (
        <ServiceContentBlock
          paragraphs={[
            t("efficiency.reports_p1", "Beyond raw statistics, we provide context and actionable recommendations. Understanding that numbers tell only part of the story, we combine data analysis with tactical insights to give you a complete picture of your on-pitch impact."),
            t("efficiency.reports_p2", "Reports are delivered in a professional format suitable for sharing with agents, clubs, and scouts. We highlight your unique selling points and provide clear improvement plans for areas of development."),
            t("efficiency.reports_p3", "Regular reports throughout the season allow you to track progress and demonstrate consistent improvement to interested parties.")
          ]}
        />
      )
    }
  ];

  const efficiencyServices = [
    {
      title: t("efficiency.service1_title", "SINGLE EFFICIENCY REPORT"),
      subtitle: t("efficiency.service1_subtitle", "PERFORMANCE SNAPSHOT"),
      description: t("efficiency.service1_desc", "Comprehensive efficiency analysis covering one match period or season segment. Using the same metrics that professional clubs and scouts analyse, we give you insights into how you're viewed in the transfer market."),
      features: [
        t("efficiency.service1_f1", "Positional benchmarking"),
        t("efficiency.service1_f2", "League percentile rankings"),
        t("efficiency.service1_f3", "Scout-view analysis")
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_400,h_300,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png",
      price: t("efficiency.service1_price", "FROM £95.00"),
    },
  ];

  return (
    <ServicePageLayout
      category={t("efficiency.category", "EFFICIENCY REPORTS")}
      title={t("efficiency.hero_title", "PERFORMANCES THAT SHOW UP IN THE DATA")}
      heroVideo="/videos/players-hero.mp4"
      heroVideoWithBorders
      statsPageKey="efficiency-reports"
    >
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <ServicePillars pillars={pillars} large />
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("efficiency.section_detail", "IN DETAIL")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceDetailTabs tabs={tabContent} />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("efficiency.section_services", "OUR EFFICIENCY REPORT SERVICES")}</ServiceSectionTitle>
          <div className="space-y-6 max-w-6xl mx-auto mt-4">
            {efficiencyServices.map((service, index) => (
              <ServiceOfferingCard key={index} title={service.title} subtitle={service.subtitle} description={service.description} features={service.features} image={service.image} price={service.price} reverse={index % 2 !== 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>{t("efficiency.section_included", "WHAT'S INCLUDED")}</ServiceSectionTitle>
          <div className="max-w-6xl mx-auto mt-4 grid sm:grid-cols-2 gap-6">
            <ServiceInfoCard title={t("efficiency.included1_title", "POSITIONAL BENCHMARKING")} content={t("efficiency.included1_content", "Compare your performance metrics against players in your position across your league and beyond.")} items={[t("efficiency.included1_i1", "League percentile rankings"), t("efficiency.included1_i2", "Position-specific KPIs"), t("efficiency.included1_i3", "Peer comparison analysis"), t("efficiency.included1_i4", "Trend tracking over time")]} />
            <ServiceInfoCard title={t("efficiency.included2_title", "SCOUT-VIEW ANALYSIS")} content={t("efficiency.included2_content", "Understand how professional scouts and recruitment teams evaluate players using industry-standard metrics.")} items={[t("efficiency.included2_i1", "Expected goals (xG) breakdown"), t("efficiency.included2_i2", "Passing network analysis"), t("efficiency.included2_i3", "Defensive contribution metrics"), t("efficiency.included2_i4", "Physical output data")]} />
            <ServiceInfoCard title={t("efficiency.included3_title", "STRENGTHS IDENTIFICATION")} content={t("efficiency.included3_content", "Highlight your standout attributes with data-backed evidence that can be shared with clubs and agents.")} items={[t("efficiency.included3_i1", "Key strength areas"), t("efficiency.included3_i2", "Unique selling points"), t("efficiency.included3_i3", "Market positioning"), t("efficiency.included3_i4", "Value indicators")]} />
            <ServiceInfoCard title={t("efficiency.included4_title", "IMPROVEMENT AREAS")} content={t("efficiency.included4_content", "Identify specific areas where focused development can elevate your overall performance rating.")} items={[t("efficiency.included4_i1", "Gap analysis"), t("efficiency.included4_i2", "Priority development areas"), t("efficiency.included4_i3", "Targeted recommendations"), t("efficiency.included4_i4", "Progress benchmarks")]} />
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="font-bebas text-xl md:text-2xl text-accent mb-4">{t("efficiency.cta_price", "From £95.00")}</p>
            <LocalizedLink to="/contact">
              <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-8 py-3 text-lg group/btn">
                {t("efficiency.cta_button", "GET YOUR REPORT")}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
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

export default EfficiencyReports;
