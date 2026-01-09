import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Play, Target, TrendingUp, BarChart3 } from "lucide-react";
import {
  ServicePageLayout,
  ServiceSection,
  ServiceSectionTitle,
  ServiceContentBlock,
  ServiceInfoCard,
} from "@/components/services/ServicePageLayout";

const ActionReports = () => {
  const steps = [
    { icon: Play, title: "VIDEO SUBMISSION", description: "Upload your match footage or provide access to game recordings." },
    { icon: Target, title: "ACTION LOGGING", description: "Our analysts log every significant action you take throughout the match." },
    { icon: BarChart3, title: "DEEP ANALYSIS", description: "Each action is rated, categorised, and analysed for tactical effectiveness." },
    { icon: TrendingUp, title: "REPORT DELIVERY", description: "Receive a comprehensive report with clips, scores, and improvement priorities." },
  ];

  const pricing = [
    { reports: "1 REPORT", price: "£85", perReport: "Single match analysis", featured: false },
    { reports: "10 REPORTS", price: "£499", perReport: "£49.90 per report", savings: "Save £351", featured: false },
    { reports: "20 REPORTS", price: "£899", perReport: "£44.95 per report", savings: "Save £801", featured: true },
    { reports: "40 REPORTS", price: "£1,399", perReport: "£34.98 per report", savings: "Save £2,001", featured: false },
  ];

  return (
    <ServicePageLayout
      category="TACTICAL"
      title="ACTION REPORTS"
      subtitle="Deep-dive analysis of your in-game actions with video clips, tactical breakdowns, and actionable insights to elevate every touch."
    >
      {/* What Is Section */}
      <ServiceSection dark>
        <ServiceSectionTitle>WHAT ARE ACTION REPORTS?</ServiceSectionTitle>
        
        <ServiceContentBlock
          paragraphs={[
            "An Action Report is a granular breakdown of every significant action you take during a match. Unlike traditional post-match analysis that focuses on general performance trends, Action Reports zoom in on individual moments—passes, dribbles, defensive interventions, shots, runs, and more.",
            "Each action is timestamped, clipped from match footage, and analysed against tactical principles specific to your position. You'll see exactly what you did well, what you could improve, and why certain decisions led to success or missed opportunities.",
            "This micro-level analysis reveals patterns invisible to the naked eye: decision-making tendencies, spatial awareness gaps, timing issues, and technical habits that aggregate into your overall performance profile."
          ]}
        />
      </ServiceSection>

      {/* How It Works */}
      <ServiceSection>
        <ServiceSectionTitle>HOW IT WORKS</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index} 
                className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bebas text-base md:text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </ServiceSection>

      {/* What's Included */}
      <ServiceSection dark>
        <ServiceSectionTitle>WHAT'S INCLUDED</ServiceSectionTitle>
        
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
          <ServiceInfoCard
            title="ACTION BREAKDOWN"
            items={[
              "Every action timestamped and categorised",
              "Video clips of key moments",
              "Success/failure assessment per action",
              "Positional context for each play",
              "Minute-by-minute activity tracking"
            ]}
          />
          <ServiceInfoCard
            title="TACTICAL SCORING"
            items={[
              "R90 performance score calculation",
              "Action-by-action ratings",
              "Category breakdowns (attacking, defensive, etc.)",
              "Zone-based analysis",
              "Comparison to positional benchmarks"
            ]}
          />
          <ServiceInfoCard
            title="VIDEO CLIPS"
            items={[
              "Individual clips for every logged action",
              "Highlight reel of best moments",
              "Areas for improvement compilation",
              "Easy sharing with coaches",
              "Downloadable formats"
            ]}
          />
          <ServiceInfoCard
            title="INSIGHTS & RECOMMENDATIONS"
            items={[
              "Performance overview narrative",
              "Key strengths identified",
              "Priority areas for development",
              "Specific drills and exercises",
              "Next match focus points"
            ]}
          />
        </div>
      </ServiceSection>

      {/* Pricing */}
      <ServiceSection>
        <ServiceSectionTitle>PRICING</ServiceSectionTitle>
        
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pricing.map((tier, index) => (
            <div 
              key={index} 
              className={`bg-card border rounded-xl p-5 md:p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${
                tier.featured ? 'border-primary' : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-bebas text-base md:text-lg text-foreground mb-2">{tier.reports}</h3>
              <p className="font-bebas text-2xl md:text-3xl text-primary mb-1">{tier.price}</p>
              {tier.savings && (
                <p className="text-xs text-green-500 mb-2">{tier.savings}</p>
              )}
              <p className="text-muted-foreground text-xs md:text-sm mb-4">{tier.perReport}</p>
              <LocalizedLink to="/contact">
                <Button 
                  variant={tier.featured ? "default" : "outline"} 
                  className="w-full font-bebas tracking-wider text-sm"
                >
                  {tier.featured ? 'Best Value' : 'Get Started'}
                </Button>
              </LocalizedLink>
            </div>
          ))}
        </div>
      </ServiceSection>

      {/* CTA */}
      <ServiceSection dark>
        <div className="text-center">
          <h2 className="font-bebas text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
            READY TO UNDERSTAND YOUR GAME?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-sm md:text-base">
            Stop guessing about your performance. Get detailed, actionable insights from every match with our Action Reports.
          </p>
          <LocalizedLink to="/contact">
            <Button size="lg" className="font-bebas tracking-wider text-base md:text-lg px-8">
              Book Your Report
            </Button>
          </LocalizedLink>
        </div>
      </ServiceSection>
    </ServicePageLayout>
  );
};

export default ActionReports;
