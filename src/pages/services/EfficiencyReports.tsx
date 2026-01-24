import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServicePillars,
  ServiceContentBlock,
  ServiceInfoCard,
  ServiceFullPackage,
} from "@/components/services/ServicePageLayout";

const EfficiencyReports = () => {
  const pillars = [
    { icon: "https://static.wixstatic.com/media/c4f4b1_3cb0b27e76454bdea2d63ff66acfddfa~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Positioning.png", label: "DATA ANALYSIS" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_34064a3af1fb4cda857abb786edea7ae~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Movement.png", label: "BENCHMARKING" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_4f2f0e863b8949f19d464230d2ce0910~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Decision-Making.png", label: "PERFORMANCE METRICS" },
    { icon: "https://static.wixstatic.com/media/c4f4b1_41d76a61f7a8411a8c48c65b0b350c64~mv2.png/v1/fill/w_90,h_90,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Vision%20(1).png", label: "SCOUT INSIGHTS" },
  ];

  return (
    <ServicePageLayout
      category="TACTICAL"
      title="EFFICIENCY REPORTS"
      heroVideo="/videos/players-hero.mp4"
    >
      <ServicePillars pillars={pillars} />

      {/* In Detail Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>IN DETAIL</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
            {["Overview", "Metrics", "Reports"].map((tab, index) => (
              <button
                key={tab}
                className={`px-5 py-2.5 rounded-lg font-bebas text-sm md:text-base tracking-wider transition-all duration-200 ${
                  index === 0 
                    ? 'bg-accent text-black' 
                    : 'bg-black/40 border border-white/20 hover:border-accent/50 text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <ServiceContentBlock
            paragraphs={[
              "Our Player Efficiency Reports provide a data-backed evaluation of your performance compared to your team, league, and positional benchmarks. Using the same metrics that professional clubs and scouts analyse, we give you insights into how you're viewed in the transfer market.",
              "We comprehensively analyse the performance statistics clubs use to evaluate and recruit players. Through this analysis, we highlight your strengths in reports that can increase club interest and maximise the value of contracts you negotiate.",
              "Each report breaks down key performance indicators specific to your position - from expected goals and assists for attackers, to defensive actions and passing accuracy for defenders. We compare your numbers against league averages and top performers to show exactly where you stand.",
              "Beyond raw statistics, we provide context and actionable recommendations. Understanding that numbers tell only part of the story, we combine data analysis with tactical insights to give you a complete picture of your on-pitch impact."
            ]}
          />
        </div>
      </ServiceSection>

      {/* What's Included Section */}
      <ServiceSection>
        <ServiceSectionTitle>WHAT'S INCLUDED</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
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
      </ServiceSection>

      {/* Pricing Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>PRICING</ServiceSectionTitle>
        
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <ServiceInfoCard
            title="Single Report"
            content="Comprehensive efficiency analysis covering one match period or season segment."
            featured
          />
          <ServiceInfoCard
            title="Season Package"
            content="Regular efficiency reports throughout the season with trend analysis and progress tracking."
          />
        </div>
        
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <p className="font-bebas text-xl md:text-2xl text-accent mb-4">From £95.00</p>
          <LocalizedLink to="/contact">
            <Button className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black">
              Get Your Report
            </Button>
          </LocalizedLink>
        </div>
      </ServiceSection>

      <ServiceFullPackage />
    </ServicePageLayout>
  );
};

export default EfficiencyReports;
