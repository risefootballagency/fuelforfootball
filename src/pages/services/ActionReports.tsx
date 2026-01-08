import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Play, Target, TrendingUp, BarChart3 } from "lucide-react";

const ActionReports = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-bebas text-xl md:text-2xl text-muted-foreground tracking-widest mb-4">
              TACTICAL
            </p>
            <h1 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              ACTION REPORTS
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Deep-dive analysis of your in-game actions with video clips, tactical breakdowns, and actionable insights to elevate every touch.
            </p>
          </div>
        </section>

        {/* What Is Section */}
        <section className="py-12 md:py-16 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-10 tracking-widest">
              WHAT ARE ACTION REPORTS?
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground text-sm md:text-base">
              <p className="leading-relaxed">
                An <strong className="text-foreground">Action Report</strong> is a granular breakdown of every significant action you take during a match. Unlike traditional post-match analysis that focuses on general performance trends, Action Reports zoom in on individual moments—passes, dribbles, defensive interventions, shots, runs, and more.
              </p>
              <p className="leading-relaxed">
                Each action is timestamped, clipped from match footage, and analysed against tactical principles specific to your position. You'll see exactly what you did well, what you could improve, and why certain decisions led to success or missed opportunities.
              </p>
              <p className="leading-relaxed">
                This micro-level analysis reveals patterns invisible to the naked eye: decision-making tendencies, spatial awareness gaps, timing issues, and technical habits that aggregate into your overall performance profile.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              HOW IT WORKS
            </h2>
            
            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bebas text-lg text-foreground mb-2">1. VIDEO SUBMISSION</h3>
                <p className="text-muted-foreground text-sm">
                  Upload your match footage or provide access to game recordings.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bebas text-lg text-foreground mb-2">2. ACTION LOGGING</h3>
                <p className="text-muted-foreground text-sm">
                  Our analysts log every significant action you take throughout the match.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bebas text-lg text-foreground mb-2">3. DEEP ANALYSIS</h3>
                <p className="text-muted-foreground text-sm">
                  Each action is rated, categorised, and analysed for tactical effectiveness.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bebas text-lg text-foreground mb-2">4. REPORT DELIVERY</h3>
                <p className="text-muted-foreground text-sm">
                  Receive a comprehensive report with clips, scores, and improvement priorities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 md:py-20 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              WHAT'S INCLUDED
            </h2>
            
            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-background border border-border rounded-lg p-6 md:p-8">
                <h3 className="font-bebas text-xl md:text-2xl text-primary mb-4">ACTION BREAKDOWN</h3>
                <ul className="space-y-2 text-muted-foreground text-sm md:text-base">
                  <li>- Every action timestamped and categorised</li>
                  <li>- Video clips of key moments</li>
                  <li>- Success/failure assessment per action</li>
                  <li>- Positional context for each play</li>
                  <li>- Minute-by-minute activity tracking</li>
                </ul>
              </div>
              
              <div className="bg-background border border-border rounded-lg p-6 md:p-8">
                <h3 className="font-bebas text-xl md:text-2xl text-primary mb-4">TACTICAL SCORING</h3>
                <ul className="space-y-2 text-muted-foreground text-sm md:text-base">
                  <li>- R90 performance score calculation</li>
                  <li>- Action-by-action ratings</li>
                  <li>- Category breakdowns (attacking, defensive, etc.)</li>
                  <li>- Zone-based analysis</li>
                  <li>- Comparison to positional benchmarks</li>
                </ul>
              </div>
              
              <div className="bg-background border border-border rounded-lg p-6 md:p-8">
                <h3 className="font-bebas text-xl md:text-2xl text-primary mb-4">VIDEO CLIPS</h3>
                <ul className="space-y-2 text-muted-foreground text-sm md:text-base">
                  <li>- Individual clips for every logged action</li>
                  <li>- Highlight reel of best moments</li>
                  <li>- Areas for improvement compilation</li>
                  <li>- Easy sharing with coaches</li>
                  <li>- Downloadable formats</li>
                </ul>
              </div>
              
              <div className="bg-background border border-border rounded-lg p-6 md:p-8">
                <h3 className="font-bebas text-xl md:text-2xl text-primary mb-4">INSIGHTS & RECOMMENDATIONS</h3>
                <ul className="space-y-2 text-muted-foreground text-sm md:text-base">
                  <li>- Performance overview narrative</li>
                  <li>- Key strengths identified</li>
                  <li>- Priority areas for development</li>
                  <li>- Specific drills and exercises</li>
                  <li>- Next match focus points</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary text-center mb-12 tracking-widest">
              PRICING
            </h2>
            
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <h3 className="font-bebas text-lg text-foreground mb-2">1 REPORT</h3>
                <p className="font-bebas text-3xl text-primary mb-4">£85</p>
                <p className="text-muted-foreground text-sm mb-4">Single match analysis</p>
                <LocalizedLink to="/services/action-reports">
                  <Button variant="outline" className="w-full font-bebas tracking-wider">
                    Get Started
                  </Button>
                </LocalizedLink>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <h3 className="font-bebas text-lg text-foreground mb-2">10 REPORTS</h3>
                <p className="font-bebas text-3xl text-primary mb-1">£499</p>
                <p className="text-xs text-green-500 mb-3">Save £351</p>
                <p className="text-muted-foreground text-sm mb-4">£49.90 per report</p>
                <LocalizedLink to="/services/action-reports">
                  <Button variant="outline" className="w-full font-bebas tracking-wider">
                    Get Started
                  </Button>
                </LocalizedLink>
              </div>
              
              <div className="bg-card border border-primary rounded-lg p-6 text-center">
                <h3 className="font-bebas text-lg text-foreground mb-2">20 REPORTS</h3>
                <p className="font-bebas text-3xl text-primary mb-1">£899</p>
                <p className="text-xs text-green-500 mb-3">Save £801</p>
                <p className="text-muted-foreground text-sm mb-4">£44.95 per report</p>
                <LocalizedLink to="/services/action-reports">
                  <Button className="w-full font-bebas tracking-wider">
                    Best Value
                  </Button>
                </LocalizedLink>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <h3 className="font-bebas text-lg text-foreground mb-2">40 REPORTS</h3>
                <p className="font-bebas text-3xl text-primary mb-1">£1,399</p>
                <p className="text-xs text-green-500 mb-3">Save £2,001</p>
                <p className="text-muted-foreground text-sm mb-4">£34.98 per report</p>
                <LocalizedLink to="/services/action-reports">
                  <Button variant="outline" className="w-full font-bebas tracking-wider">
                    Get Started
                  </Button>
                </LocalizedLink>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-card/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-bebas text-3xl md:text-4xl text-foreground mb-6">
              READY TO UNDERSTAND YOUR GAME?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Stop guessing about your performance. Get detailed, actionable insights from every match with our Action Reports.
            </p>
            <LocalizedLink to="/contact">
              <Button size="lg" className="font-bebas tracking-wider text-lg px-8">
                Book Your Report
              </Button>
            </LocalizedLink>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ActionReports;
