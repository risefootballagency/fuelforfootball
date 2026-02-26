import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Calendar, MoreHorizontal } from "lucide-react";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMoreClick: () => void;
  hasAnalysis?: boolean;
  hasProgramming?: boolean;
}

const ALL_TABS: TabConfig[] = [
  { id: "hub", label: "HUB", icon: TrendingUp },
  { id: "analysis", label: "ANALYSIS", icon: BarChart3 },
  { id: "physical", label: "PROGRAMMING", icon: Calendar },
];

export const MobileBottomNav = ({
  activeTab,
  onTabChange,
  onMoreClick,
  hasAnalysis = true,
  hasProgramming = true,
}: MobileBottomNavProps) => {
  // Filter tabs based on available data
  const tabs = ALL_TABS.filter(tab => {
    if (tab.id === "analysis") return hasAnalysis;
    if (tab.id === "physical") return hasProgramming;
    return true;
  });

  const totalCols = tabs.length + 1; // +1 for MORE

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border/50 safe-area-bottom">
      <div className="grid h-16" style={{ gridTemplateColumns: `repeat(${totalCols}, 1fr)` }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 group hover:bg-[hsl(47,100%,51%)]"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-[15%] right-[15%] h-[2px] rounded-b bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="bottomNavGlow"
                  className="absolute inset-0 rounded-lg bg-white/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={isActive ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Icon
                  className={`h-5 w-5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-muted-foreground'} group-hover:text-[hsl(140,40%,20%)]`}
                />
              </motion.div>
              <span
                className={`text-[9px] tracking-wider transition-colors duration-200 ${isActive ? 'text-white' : 'text-muted-foreground'} group-hover:text-[hsl(140,40%,20%)]`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
        <button
          onClick={onMoreClick}
          className="relative flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 group hover:bg-[hsl(47,100%,51%)]"
        >
          <motion.div
            whileTap={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <MoreHorizontal className="h-5 w-5 text-muted-foreground group-hover:text-[hsl(140,40%,20%)] transition-colors duration-200" />
          </motion.div>
          <span className="text-[9px] tracking-wider text-muted-foreground group-hover:text-[hsl(140,40%,20%)] transition-colors duration-200">MORE</span>
        </button>
      </div>
    </nav>
  );
};
