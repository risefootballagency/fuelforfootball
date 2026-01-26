import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, MessageCircle, Target, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverText } from "@/components/HoverText";

const steps = [
  {
    number: "1",
    icon: MessageCircle,
    title: "Tell Us About You",
    description: "Share your current situation, goals, and what you've been working on. We listen to understand your unique case."
  },
  {
    number: "2",
    icon: Search,
    title: "Expert Analysis",
    description: "Our team applies their expertise to analyse your game and identify the key factors affecting your development."
  },
  {
    number: "3",
    icon: Target,
    title: "Tailored Recommendations",
    description: "Receive specific, actionable suggestions on what will improve you the fastest as a player."
  },
  {
    number: "4",
    icon: Rocket,
    title: "Take Action",
    description: "Implement the plan with our support. Track progress, refine the approach, and accelerate your growth."
  }
];

export const NeedsAnalysis = () => {
  return (
    <section className="py-8 md:py-12 bg-card/50">
      <div className="container mx-auto">
        {/* Title with smoky background */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8 md:mb-12">
          <div 
            className="w-screen relative left-1/2 -translate-x-1/2 py-4 md:py-6 overflow-hidden border-y-4 border-accent"
            style={{
              backgroundImage: `url('/grass-bg-smoky.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bebas uppercase tracking-wider text-center text-white container mx-auto drop-shadow-lg">
              <HoverText text="Needs Analysis" />
            </h2>
          </div>
        </div>
        
        <p className="text-center text-muted-foreground text-sm md:text-lg max-w-3xl mx-auto mb-8 md:mb-12">
          Not sure where to start? Our expertise can help you understand yourself as a player first, identifying what will improve you the fastest and creating a clear path forward.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 rounded-lg border border-border/30 bg-card/50 hover:border-accent/50 transition-colors"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-6 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent/50">
                  <Icon className="w-5 h-5 md:w-7 md:h-7 text-accent" />
                </div>
                <div className="text-xs font-bebas uppercase tracking-wider text-accent mb-2">Step {step.number}</div>
                <h3 className="text-base md:text-xl font-bebas uppercase tracking-wider text-foreground mb-2 md:mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-2xl mx-auto">
            Book a consultation to discuss your game in depth. Like a good doctor's appointment, we'll diagnose the priorities and create a comprehensive plan of action.
          </p>
          <Link to="/consultation">
            <Button 
              size="lg"
              className="gap-2 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 font-bebas uppercase tracking-wider relative overflow-hidden text-white border-2 border-accent"
            >
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url('/grass-bg-smoky.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Book a Consultation
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};