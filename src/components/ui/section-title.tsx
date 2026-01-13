import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * SectionTitle - Semantic title component for consistent theming
 * 
 * USAGE:
 * - Use this component for all page titles, section headers, and card titles
 * - Title text uses --title-text token (distinct from --primary)
 * - Title background uses --title-bg token (distinct from --accent)
 * 
 * This ensures changing primary button color won't affect titles,
 * and changing accent color won't affect title backgrounds.
 */

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The title text */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Whether to show the title bar background */
  withBackground?: boolean;
  /** Title heading level (h1-h6) */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Whether to use glossy background effect */
  glossy?: boolean;
}

const sizeClasses = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl md:text-4xl",
  lg: "text-3xl md:text-5xl",
  xl: "text-4xl md:text-6xl",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const SectionTitle = React.forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    withBackground = false, 
    as: Tag = "h2", 
    size = "lg",
    align = "center",
    glossy = false,
    ...props 
  }, ref) => {
    const titleContent = (
      <>
        <Tag 
          className={cn(
            "font-bebas uppercase tracking-wider leading-none",
            sizeClasses[size],
            alignClasses[align],
            // Use title-text token for all titles
            "text-title"
          )}
        >
          {title}
        </Tag>
        {subtitle && (
          <p className={cn(
            "text-muted-foreground mt-2",
            size === "sm" ? "text-sm" : "text-base md:text-lg",
            alignClasses[align]
          )}>
            {subtitle}
          </p>
        )}
      </>
    );

    if (withBackground) {
      return (
        <div 
          ref={ref}
          className={cn(
            "py-3 md:py-4",
            // Use title-bg token for title backgrounds
            glossy ? "bg-glossy-green" : "bg-title-bg",
            className
          )}
          {...props}
        >
          <div className="container mx-auto">
            {titleContent}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("mb-6 md:mb-8", className)} {...props}>
        {titleContent}
      </div>
    );
  }
);
SectionTitle.displayName = "SectionTitle";

/**
 * PageTitle - For main page titles with full-width background
 */
const PageTitle = React.forwardRef<HTMLDivElement, Omit<SectionTitleProps, "withBackground" | "as" | "size">>(
  ({ className, glossy = true, ...props }, ref) => (
    <SectionTitle 
      ref={ref}
      withBackground
      as="h1"
      size="xl"
      glossy={glossy}
      className={cn("border-b border-border/50", className)}
      {...props}
    />
  )
);
PageTitle.displayName = "PageTitle";

/**
 * CardTitle wrapper that uses proper title-text token
 */
const SemanticCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 
      ref={ref} 
      className={cn(
        "text-xl font-bebas uppercase tracking-wider leading-none text-title",
        className
      )} 
      {...props} 
    />
  )
);
SemanticCardTitle.displayName = "SemanticCardTitle";

export { SectionTitle, PageTitle, SemanticCardTitle };
