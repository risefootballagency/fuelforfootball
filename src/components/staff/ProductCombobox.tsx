import { useState, useMemo, useRef, useEffect, KeyboardEvent } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

interface ProductComboboxProps {
  products: ProductOption[];
  value: string | null; // product id or 'custom'
  onChange: (id: string) => void;
  currencySymbol?: string;
  className?: string;
  placeholder?: string;
}

export const ProductCombobox = ({
  products,
  value,
  onChange,
  currencySymbol = '',
  className,
  placeholder = "Product",
}: ProductComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = products.find(p => p.id === value);
  const isCustom = value === 'custom' || !selected;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => p.name.toLowerCase().includes(q));
  }, [products, query]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filtered.length === 1) {
      e.preventDefault();
      handleSelect(filtered[0].id);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const label = selected ? `${selected.name} — ${currencySymbol}${Number(selected.price).toFixed(2)}` : 'Custom item';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("h-9 w-full justify-between font-normal", isCustom && "text-muted-foreground", className)}
        >
          <span className="truncate">{label || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[280px] p-0" align="start">
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a product name..."
            className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <ScrollArea className="max-h-[280px]">
          <div className="p-1">
            <button
              type="button"
              onClick={() => handleSelect('custom')}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
                isCustom && "bg-accent",
              )}
            >
              <Check className={cn("h-4 w-4", isCustom ? "opacity-100" : "opacity-0")} />
              <span>Custom item</span>
            </button>
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No products found</div>
            ) : (
              filtered.map((p) => {
                const isSel = p.id === value;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelect(p.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
                      isSel && "bg-accent",
                    )}
                  >
                    <Check className={cn("h-4 w-4 shrink-0", isSel ? "opacity-100" : "opacity-0")} />
                    <span className="truncate">{p.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{currencySymbol}{Number(p.price).toFixed(2)}</span>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
