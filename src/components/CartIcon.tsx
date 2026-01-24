import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { LocalizedLink } from "@/components/LocalizedLink";

export const CartIcon = () => {
  const { totalItems } = useCart();

  return (
    <LocalizedLink
      to="/cart"
      className="relative p-2 hover:bg-accent/10 rounded-full transition-colors group"
      aria-label={`Cart with ${totalItems} items`}
    >
      <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-accent transition-colors" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </LocalizedLink>
  );
};
