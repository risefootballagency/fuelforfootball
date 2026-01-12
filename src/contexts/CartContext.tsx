import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface CartItem {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  selectedOption: string | null;
  imageUrl: string | null;
  quantity: number;
}

interface CartNotificationState {
  show: boolean;
  itemName?: string;
  itemPrice?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  notification: CartNotificationState;
  dismissNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "fff_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState<CartNotificationState>({
    show: false,
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const dismissNotification = useCallback(() => {
    setNotification({ show: false });
  }, []);

  const addItem = (newItem: Omit<CartItem, "id" | "quantity">) => {
    setItems((prev) => {
      // Check if item already exists with same service and option
      const existingIndex = prev.findIndex(
        (item) => item.serviceId === newItem.serviceId && item.selectedOption === newItem.selectedOption
      );

      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      // Add new item
      return [...prev, { ...newItem, id: crypto.randomUUID(), quantity: 1 }];
    });

    // Show notification
    setNotification({
      show: true,
      itemName: newItem.name,
      itemPrice: newItem.price,
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        totalItems, 
        totalPrice,
        notification,
        dismissNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
