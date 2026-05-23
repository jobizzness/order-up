"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CartItem, PosOrderType } from "@/types";

interface OrderConfirmationProps {
  cart: CartItem[];
  subtotal: number;
  orderType: PosOrderType;
  tableNumber: string;
  onNewOrder: () => void;
}

export function OrderConfirmation({
  cart,
  subtotal,
  orderType,
  tableNumber,
  onNewOrder,
}: OrderConfirmationProps) {
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircleIcon className="w-10 h-10 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-foreground">Order Placed!</h2>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        {orderType === "dine-in" && tableNumber
          ? `Table ${tableNumber} · Dine In`
          : orderType === "takeout"
          ? "Takeout"
          : "Delivery"}
      </p>

      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-4 space-y-2 text-left mb-6">
        {cart.map((c) => (
          <div key={c.menuItem.id} className="flex justify-between text-sm">
            <span className="text-foreground">
              {c.quantity}× {c.menuItem.name}
            </span>
            <span className="font-semibold text-foreground">
              ${(c.menuItem.price * c.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t border-border pt-2 flex justify-between text-sm text-muted-foreground">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-foreground">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onNewOrder}
        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-[var(--color-brand-hover)] shadow-sm transition-all"
      >
        New Order
      </button>
    </div>
  );
}
