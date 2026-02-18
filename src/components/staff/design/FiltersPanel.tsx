import { Button } from '@/components/ui/button';
import { IMAGE_FILTERS } from './types';

interface FiltersPanelProps {
  currentFilter?: string;
  onApplyFilter: (filter: string) => void;
}

export function FiltersPanel({ currentFilter, onApplyFilter }: FiltersPanelProps) {
  return (
    <div className="p-3 space-y-2 text-xs">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Image Filters</p>
      <div className="grid grid-cols-2 gap-1.5">
        {IMAGE_FILTERS.map(f => (
          <Button
            key={f.name}
            variant={currentFilter === f.value ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-[10px] justify-start"
            onClick={() => onApplyFilter(f.value)}
          >
            {f.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
