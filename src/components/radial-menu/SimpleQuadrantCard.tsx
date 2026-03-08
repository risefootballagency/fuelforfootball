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
      className="animate-[fade-in_0.3s_ease-out_forwards] w-full h-full px-3 py-2 flex flex-col justify-center overflow-hidden"
      style={{
        width: "100%",
        height: "100%",
        maxWidth: maxWidth ?? undefined,
        maxHeight: maxHeight ?? undefined,
      }}
    >
      <div className={`flex flex-col gap-1.5 ${alignment}`}>
        <div className="inline-flex items-center gap-1.5 bg-accent/90 px-2.5 py-0.5 rounded-sm">
          <div className="text-black">{icon}</div>
          <span className="text-[11px] font-bebas uppercase tracking-wider text-black">{title}</span>
        </div>

        {stat && (
          <div className="text-3xl font-bebas text-accent leading-none">{stat}</div>
        )}

        <p className="text-white/80 text-[11px] leading-snug break-words line-clamp-4 max-w-full">
          {description}
        </p>
      </div>
    </div>
  );
};
