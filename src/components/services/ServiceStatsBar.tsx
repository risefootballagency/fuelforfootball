import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, useInView } from "framer-motion";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-bebas text-3xl md:text-4xl text-accent">
      {displayed}{suffix}
    </span>
  );
};

export const ServiceStatsBar = ({ pageKey }: { pageKey: string }) => {
  const { data: stats } = useQuery({
    queryKey: ["service-page-stats", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_page_stats" as any)
        .select("stats")
        .eq("page_key", pageKey)
        .single();
      if (error || !data) return null;
      return (data as any).stats as StatItem[];
    },
  });

  if (!stats || stats.length === 0) return null;

  return (
    <section className="bg-black/40 backdrop-blur-sm border-y border-accent/20">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-0 divide-x divide-accent/10`}>
          {stats.slice(0, 4).map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center py-4 md:py-5"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-xs md:text-sm text-white/60 mt-0.5 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
