import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
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
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_3cb0b27e76454bdea2d63ff66acfddfa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Positioning.png", label: "DATA ANALYSIS" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_34064a3af1fb4cda857abb786edea7ae~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Movement.png", label: "BENCHMARKING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_4f2f0e863b8949f19d464230d2ce0910~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Decision-Making.png", label: "PERFORMANCE METRICS" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_41d76a61f7a8411a8c48c65b0b350c64~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Vision%20(1).png", label: "SCOUT INSIGHTS" },
  ];

  const tabContent = [
    {
      label: "Overview",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "Our Player Efficiency Reports provide a data-backed evaluation of your performance compared to your team, league, and positional benchmarks. Using the same metrics that professional clubs and scouts analyse, we give you insights into how you're viewed in the transfer market.",
            "We comprehensively analyse the performance statistics clubs use to evaluate and recruit players. Through this analysis, we highlight your strengths in reports that can increase club interest and maximise the value of contracts you negotiate."
          ]}
        />
      )
    },
    {
      label: "Metrics",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "Each report breaks down key performance indicators specific to your position - from expected goals and assists for attackers, to defensive actions and passing accuracy for defenders. We compare your numbers against league averages and top performers to show exactly where you stand.",
            "We track metrics including xG, xA, progressive passes, ball recoveries, duels won, pressures, and many more position-specific KPIs. These are the exact numbers scouts and recruitment teams analyse when evaluating players.",
            "Our benchmarking system compares you against players in your league, your position, and your age group - giving you clear targets for improvement and evidence of your standout attributes."
          ]}
        />
      )
    },
    {
      label: "Reports",
      content: (
        <ServiceContentBlock
          paragraphs={[
            "Beyond raw statistics, we provide context and actionable recommendations. Understanding that numbers tell only part of the story, we combine data analysis with tactical insights to give you a complete picture of your on-pitch impact.",
            "Reports are delivered in a professional format suitable for sharing with agents, clubs, and scouts. We highlight your unique selling points and provide clear improvement plans for areas of development.",
            "Regular reports throughout the season allow you to track progress and demonstrate consistent improvement to interested parties."
          ]}
        />
      )
    }
  ];

  const efficiencyServices = [
    {
      title: "SINGLE EFFICIENCY REPORT",
      subtitle: "PERFORMANCE SNAPSHOT",
      description: "Comprehensive efficiency analysis covering one match period or season segment. Using the same metrics that professional clubs and scouts analyse, we give you insights into how you're viewed in the transfer market.",
      features: [
        "Positional benchmarking",
        "League percentile rankings",
        "Scout-view analysis"
      ],
      image: "https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_400,h_300,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png",
      price: "FROM £95.00",
    },
  ];

  return (
    <ServicePageLayout
      category="EFFICIENCY REPORTS"
      title="PERFORMANCES THAT SHOW UP IN THE DATA"
      heroVideo="/videos/players-hero.mp4"
      heroVideoWithBorders
      statsPageKey="efficiency-reports"
    >
      {/* Pillars Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10">
          <ServicePillars pillars={pillars} large />
        </div>
      </section>

      {/* In Detail Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4">
            <ServiceDetailTabs tabs={tabContent} />
          </div>
        </div>
      </section>

      {/* Our Efficiency Report Services */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>OUR EFFICIENCY REPORT SERVICES</ServiceSectionTitle>
          
          <div className="space-y-6 max-w-6xl mx-auto mt-4">
            {efficiencyServices.map((service, index) => (
              <ServiceOfferingCard
                key={index}
                title={service.title}
                subtitle={service.subtitle}
                description={service.description}
                features={service.features}
                image={service.image}
                price={service.price}
                reverse={index % 2 !== 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <ServiceSectionTitle>WHAT'S INCLUDED</ServiceSectionTitle>
          
          <div className="max-w-6xl mx-auto mt-4 grid sm:grid-cols-2 gap-6">
            <ServiceInfoCard
              title="POSITIONAL BENCHMARKING"
              content="Compare your performance metrics against players in your position across your league and beyond."
              items={["League percentile rankings", "Position-specific KPIs", "Peer comparison analysis", "Trend tracking over time"]}
            />
            <ServiceInfoCard
              title="SCOUT-VIEW ANALYSIS"
              content="Understand how professional scouts and recruitment teams evaluate players using industry-standard metrics."
              items={["Expected goals (xG) breakdown", "Passing network analysis", "Defensive contribution metrics", "Physical output data"]}
            />
            <ServiceInfoCard
              title="STRENGTHS IDENTIFICATION"
              content="Highlight your standout attributes with data-backed evidence that can be shared with clubs and agents."
              items={["Key strength areas", "Unique selling points", "Market positioning", "Value indicators"]}
            />
            <ServiceInfoCard
              title="IMPROVEMENT AREAS"
              content="Identify specific areas where focused development can elevate your overall performance rating."
              items={["Gap analysis", "Priority development areas", "Targeted recommendations", "Progress benchmarks"]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="font-bebas text-xl md:text-2xl text-accent mb-4">From £95.00</p>
            <LocalizedLink to="/contact">
              <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black px-8 py-3 text-lg group/btn">
                GET YOUR REPORT
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </LocalizedLink>
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
    </ServicePageLayout>
  );
};

export default EfficiencyReports;
