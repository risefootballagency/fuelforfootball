import { ChevronRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StaffBreadcrumbProps {
  categoryTitle: string;
  categoryIcon: LucideIcon;
  sectionTitle: string;
  onCategoryClick: () => void;
}

export const StaffBreadcrumb = ({ categoryTitle, categoryIcon: CategoryIcon, sectionTitle, onCategoryClick }: StaffBreadcrumbProps) => {
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
      <button onClick={onCategoryClick} className="flex items-center gap-1 hover:text-foreground transition-colors">
        <CategoryIcon className="w-3.5 h-3.5" />
        <span>{categoryTitle}</span>
      </button>
      <ChevronRight className="w-3 h-3" />
      <span className="text-foreground font-medium">{sectionTitle}</span>
    </div>
  );
};
