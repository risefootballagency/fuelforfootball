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
  if (title) {
    return (
      <CardHeader className={cn("bg-title-bg bg-[url('/grass-smoky-3.png')] bg-cover bg-center bg-no-repeat", className)}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn("flex items-center gap-2", titleClassName)}>
            {icon}
            {title}
          </CardTitle>
          {actions}
        </div>
      </CardHeader>
    );
  }

  return (
    <CardHeader className={cn("bg-title-bg bg-[url('/grass-smoky-3.png')] bg-cover bg-center bg-no-repeat", className)}>
      {children}
    </CardHeader>
  );
};
