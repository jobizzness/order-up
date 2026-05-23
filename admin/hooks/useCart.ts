import { useState } from "react";
import { CartItem, MenuItem } from "@/types";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addItem(menuItem: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === menuItem.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { menuItem, quantity: 1, notes: "" }];
    });
  }

  function removeItem(menuItemId: string) {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== menuItemId));
  }

  function updateQuantity(menuItemId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) =>
        c.menuItem.id === menuItemId ? { ...c, quantity } : c
      )
    );
  }

  function updateNotes(menuItemId: string, notes: string) {
    setCart((prev) =>
      prev.map((c) =>
        c.menuItem.id === menuItemId ? { ...c, notes } : c
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  const subtotal = cart.reduce(
    (sum, c) => sum + c.menuItem.price * c.quantity,
    0
  );

  const itemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return {
    cart,
    subtotal,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
  };
}
