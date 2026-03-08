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
  return (
    <div
      className="animate-[fade-in_0.3s_ease-out_forwards] text-center"
      style={{
        maxWidth: maxWidth ?? undefined,
        maxHeight: maxHeight ?? undefined,
      }}
    >
      {/* Label with icon */}
      <div className="inline-flex items-center gap-2 bg-accent px-4 py-1 mb-3">
        <div className="text-black">{icon}</div>
        <span className="text-sm font-bebas uppercase tracking-wider text-black">{title}</span>
      </div>
      
      {/* Stat if provided */}
      {stat && (
        <div className="text-5xl font-bebas text-accent leading-none mb-2">{stat}</div>
      )}
      
      {/* Description */}
      <p className="text-white/80 text-sm leading-relaxed">{description}</p>
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
    description="Our proprietary analysis system tracks every action to maximise player potential."
    position="top-right"
    {...props}
  />
);

export const InsightsQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<BookOpen className="w-4 h-4" />}
    title="Insights"
    description="Expert tactical analysis and exclusive content from inside the game."
    position="top-left"
    {...props}
  />
);

export const ContactQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<MessageCircle className="w-4 h-4" />}
    title="Get In Touch"
    description="Ready to elevate your career? Connect with our team today."
    position="bottom-right"
    {...props}
  />
);

export const PortalQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<Users className="w-4 h-4" />}
    title="Player Portal"
    description="Access your personalised dashboard with performance data, programmes, and analysis."
    position="bottom-left"
    {...props}
  />
);

export const ShopQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<Package className="w-4 h-4" />}
    title="Shop"
    description="Browse our collection of training resources, e-books, and performance packages."
    position="top-left"
    {...props}
  />
);

export const ScoutingQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<Search className="w-4 h-4" />}
    title="Scouting"
    description="Position-specific criteria across physical, mental, technical, and tactical domains."
    position="top-right"
    {...props}
  />
);

export const ClubSupportQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<Shield className="w-4 h-4" />}
    title="Club Services"
    description="Comprehensive player development solutions tailored for academy and first-team programmes."
    position="top-right"
    {...props}
  />
);

export const PackagesQuadrantCard = (props: QuadrantCardProps) => (
  <SimpleQuadrantCard
    icon={<Trophy className="w-4 h-4" />}
    title="Packages"
    description="Flexible business packages designed to support your organisation's football goals."
    position="top-right"
    {...props}
  />
);
