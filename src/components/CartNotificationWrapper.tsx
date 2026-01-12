import { CartNotification } from "@/components/CartNotification";
import { useCart } from "@/contexts/CartContext";

export const CartNotificationWrapper = () => {
  const { notification, dismissNotification } = useCart();

  return (
    <CartNotification
      show={notification.show}
      onDismiss={dismissNotification}
      itemName={notification.itemName}
      itemPrice={notification.itemPrice}
    />
  );
};
