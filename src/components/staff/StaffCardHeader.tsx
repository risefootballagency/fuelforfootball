import { ReactNode } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StaffCardHeaderProps {
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  title?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const StaffCardHeader = ({
  children,
  className,
  titleClassName,
  title,
  icon,
  actions,
}: StaffCardHeaderProps) => {
  const baseClasses = cn(
    "relative overflow-hidden",
    "bg-[hsl(127,75%,10%)]",
    "bg-[url('/grass-smoky-3.png')] bg-cover bg-center bg-no-repeat",
    "border-b border-[hsl(47,100%,51%,0.15)]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.3)]",
    className
  );

  if (title) {
    return (
      <CardHeader className={baseClasses}>
        {/* Gradient overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.15) 100%)",
          }}
        />
        {/* Gold accent line at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(47,100%,51%,0.4) 50%, transparent 100%)",
          }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <CardTitle
            className={cn(
              "flex items-center gap-2 text-[hsl(0,0%,96%)]",
              titleClassName
            )}
          >
            {icon && (
              <span className="text-[hsl(47,100%,51%)] opacity-90">
                {icon}
              </span>
            )}
            <span className="tracking-wide">{title}</span>
          </CardTitle>
          {actions}
        </div>
      </CardHeader>
    );
  }

  return (
    <CardHeader className={baseClasses}>
      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.15) 100%)",
        }}
      />
      {/* Gold accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(47,100%,51%,0.4) 50%, transparent 100%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </CardHeader>
  );
};
