import { TrendingUp, BookOpen, MessageCircle, Search, Users, Package, Trophy, Shield } from "lucide-react";
import { ReactNode } from "react";

interface SimpleQuadrantCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  stat?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  maxWidth?: number;
  maxHeight?: number;
}

export const SimpleQuadrantCard = ({
  icon,
  title,
  description,
  stat,
  position,
  maxWidth,
  maxHeight,
}: SimpleQuadrantCardProps) => {
  const alignment = position.includes('right')
    ? 'items-end text-right'
    : 'items-start text-left';

  return (
    <div
      className="animate-[fade-in_0.3s_ease-out_forwards] w-full h-full"
      style={{
        maxWidth: maxWidth ?? undefined,
        minHeight: maxHeight ?? undefined,
      }}
    >
      <div className="w-full h-full rounded-xl border border-accent/35 bg-background/70 backdrop-blur-sm px-4 py-3 flex flex-col justify-center">
        <div className={`flex flex-col gap-2 ${alignment}`}>
          <div className="inline-flex items-center gap-2 bg-accent px-3 py-1 rounded-sm">
            <div className="text-black">{icon}</div>
            <span className="text-xs font-bebas uppercase tracking-wider text-black">{title}</span>
          </div>

          {stat && (
            <div className="text-4xl font-bebas text-accent leading-none">{stat}</div>
          )}

          <p className="text-white/85 text-xs md:text-sm leading-snug break-words">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Pre-configured cards for different menu items
type QuadrantCardProps = Pick<SimpleQuadrantCardProps, "maxWidth" | "maxHeight">;

export const PerformanceQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<TrendingUp className="w-4 h-4" />}
    title="Performance"
    stat="R90"
    description="Track actions, decisions, and progression with role-specific performance analysis."
    position="top-right"
    {...props}
  />
);

export const InsightsQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<BookOpen className="w-4 h-4" />}
    title="Insights"
    description="Get tactical insights, match breakdowns, and exclusive football intelligence."
    position="top-left"
    {...props}
  />
);

export const ContactQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<MessageCircle className="w-4 h-4" />}
    title="Get In Touch"
    description="Speak with the team to plan your next step and start immediately."
    position="bottom-right"
    {...props}
  />
);

export const PortalQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<Users className="w-4 h-4" />}
    title="Player Portal"
    description="Open your dashboard for reports, programmes, updates, and performance tracking."
    position="bottom-left"
    {...props}
  />
);

export const ShopQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<Package className="w-4 h-4" />}
    title="Shop"
    description="Explore resources, tools, and performance products built for serious players."
    position="top-left"
    {...props}
  />
);

export const ScoutingQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<Search className="w-4 h-4" />}
    title="Scouting"
    description="Apply position criteria across physical, mental, technical, and tactical areas."
    position="top-right"
    {...props}
  />
);

export const ClubSupportQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<Shield className="w-4 h-4" />}
    title="Club Services"
    description="Support academy and first-team development with tailored performance solutions."
    position="top-right"
    {...props}
  />
);

export const PackagesQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<Trophy className="w-4 h-4" />}
    title="Packages"
    description="Choose flexible business packages aligned to your club or organisation goals."
    position="top-right"
    {...props}
  />
);
