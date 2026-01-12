import { motion } from "framer-motion";
import { TrendingUp, Users, Trophy, Zap, Target, Clock } from "lucide-react";

interface MetricProps {
  icon: React.ElementType;
  value: string;
  label: string;
  subtext?: string;
}

const Metric = ({ icon: Icon, value, label, subtext }: MetricProps) => (
  <div className="text-center group">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 mb-3 group-hover:bg-primary/20 transition-colors">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="text-3xl md:text-4xl font-bebas text-primary tracking-wider">{value}</div>
    <div className="text-xs font-bebas uppercase tracking-widest text-foreground/70 mt-1">{label}</div>
    {subtext && <div className="text-xs text-muted-foreground mt-0.5">{subtext}</div>}
  </div>
);

interface PropagandaMetricsProps {
  variant?: "full" | "compact" | "minimal";
  showSubtext?: boolean;
  className?: string;
}

// Anonymous success metrics - no names, just results
const METRICS = {
  playerStats: [
    { icon: Trophy, value: "147", label: "Goals Scored", subtext: "2024 Season" },
    { icon: Target, value: "89", label: "Assists", subtext: "This season alone" },
    { icon: Clock, value: "23,400", label: "Minutes Played", subtext: "At the highest level" },
  ],
  careerOutcomes: [
    { icon: Users, value: "74", label: "Pro Contracts", subtext: "Players signed" },
    { icon: TrendingUp, value: "€18.3M", label: "Transfer Fees", subtext: "Generated for clients" },
    { icon: Trophy, value: "23", label: "Promotions", subtext: "Players moved up" },
  ],
  performanceGains: [
    { icon: Zap, value: "+27%", label: "Speed Increase", subtext: "Average improvement" },
    { icon: Target, value: "67%", label: "Promoted", subtext: "Within 6 months" },
    { icon: TrendingUp, value: "-43%", label: "Injury Rate", subtext: "Reduction achieved" },
  ],
};

export const PropagandaMetrics = ({ 
  variant = "full", 
  showSubtext = true,
  className = ""
}: PropagandaMetricsProps) => {
  if (variant === "minimal") {
    return (
      <div className={`flex items-center justify-center gap-8 md:gap-16 ${className}`}>
        <div className="text-center">
          <span className="text-2xl md:text-3xl font-bebas text-primary">74</span>
          <span className="text-xs font-bebas uppercase tracking-widest text-foreground/70 ml-2">Pros</span>
        </div>
        <div className="text-center">
          <span className="text-2xl md:text-3xl font-bebas text-primary">€18.3M</span>
          <span className="text-xs font-bebas uppercase tracking-widest text-foreground/70 ml-2">Transfers</span>
        </div>
        <div className="text-center">
          <span className="text-2xl md:text-3xl font-bebas text-primary">+27%</span>
          <span className="text-xs font-bebas uppercase tracking-widest text-foreground/70 ml-2">Speed</span>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-3 gap-4 md:gap-8 ${className}`}>
        {METRICS.careerOutcomes.map((metric, i) => (
          <Metric key={i} {...metric} subtext={showSubtext ? metric.subtext : undefined} />
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-12 ${className}`}>
      {/* Career Outcomes */}
      <div className="text-center">
        <h3 className="text-sm font-bebas uppercase tracking-widest text-primary/80 mb-6">Career Impact</h3>
        <div className="grid grid-cols-3 gap-4 md:gap-12">
          {METRICS.careerOutcomes.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Metric {...metric} subtext={showSubtext ? metric.subtext : undefined} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Gains */}
      <div className="text-center">
        <h3 className="text-sm font-bebas uppercase tracking-widest text-primary/80 mb-6">Performance Gains</h3>
        <div className="grid grid-cols-3 gap-4 md:gap-12">
          {METRICS.performanceGains.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              viewport={{ once: true }}
            >
              <Metric {...metric} subtext={showSubtext ? metric.subtext : undefined} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Standalone metric banner for use between sections
export const MetricBanner = ({ className = "" }: { className?: string }) => (
  <div className={`py-8 bg-card/50 border-y border-border/30 ${className}`}>
    <div className="container mx-auto">
      <PropagandaMetrics variant="minimal" />
    </div>
  </div>
);

export default PropagandaMetrics;
