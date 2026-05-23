"use client";

import {
  TrashIcon,
  PrinterIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { CartItem, PosOrderType, PosPaymentMethod } from "@/types";

interface CartPanelProps {
  cart: CartItem[];
  subtotal: number;
  orderType: PosOrderType;
  tableNumber: string;
  guestCount: number;
  paymentMethod: PosPaymentMethod;
  onOrderTypeChange: (type: PosOrderType) => void;
  onTableNumberChange: (value: string) => void;
  onGuestCountChange: (count: number) => void;
  onPaymentMethodChange: (method: PosPaymentMethod) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

const PAYMENT_OPTIONS: {
  value: PosPaymentMethod;
  label: string;
  icon: React.ReactNode;
}[] = [
    {
      value: "cash",
      label: "Cash",
      icon: <BanknotesIcon className="w-4 h-4" />,
    },
    {
      value: "card",
      label: "Card",
      icon: <CreditCardIcon className="w-4 h-4" />,
    },
    {
      value: "scan",
      label: "Scan",
      icon: <QrCodeIcon className="w-4 h-4" />,
    },
  ];

export function CartPanel({
  cart,
  subtotal,
  orderType,
  tableNumber,
  guestCount,
  paymentMethod,
  onOrderTypeChange,
  onTableNumberChange,
  onGuestCountChange,
  onPaymentMethodChange,
  onRemove,
  onClear,
  onSubmit,
}: CartPanelProps) {
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const itemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Table header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {orderType === "dine-in" && tableNumber
                ? `Table No #${tableNumber.padStart(2, "0")}`
                : orderType === "takeout"
                  ? "Takeout"
                  : "Delivery"}
            </h2>
            {cart.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {guestCount} {guestCount === 1 ? "Person" : "People"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Clear order"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order type selector */}
        <div className="flex gap-1.5 mt-3">
          {(["dine-in", "takeout", "delivery"] as PosOrderType[]).map((t) => (
            <button
              key={t}
              onClick={() => onOrderTypeChange(t)}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${orderType === t
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
            >
              {t === "dine-in" ? "Dine In" : t === "takeout" ? "Takeout" : "Delivery"}
            </button>
          ))}
        </div>

        {/* Table + guests (dine-in) */}
        {orderType === "dine-in" && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => onTableNumberChange(e.target.value)}
              placeholder="Table #"
              className="flex-1 bg-input text-foreground border border-transparent rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
            <input
              type="number"
              min={1}
              value={guestCount}
              onChange={(e) => onGuestCountChange(Number(e.target.value) || 1)}
              placeholder="Guests"
              className="w-20 bg-input text-foreground border border-transparent rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        )}
      </div>

      {/* Ordered items */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <ShoppingCartIcon className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">Tap items to add them</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Ordered Items</h3>
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {String(itemCount).padStart(2, "0")}
              </span>
            </div>
            <div className="space-y-3">
              {cart.map((cartItem) => (
                <div key={cartItem.menuItem.id} className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">
                      <span className="font-semibold text-muted-foreground mr-1">
                        {cartItem.quantity}x
                      </span>
                      {cartItem.menuItem.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-foreground">
                      ${(cartItem.menuItem.price * cartItem.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemove(cartItem.menuItem.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Payment summary */}
      <div className="px-5 pb-4 space-y-4 border-t border-border pt-4">
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-foreground text-base mt-3 pt-3 border-t border-border">
            <span>Total Payable</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment method */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-2">Payment Method</h3>
          <div className="flex gap-2">
            {PAYMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onPaymentMethodChange(opt.value)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-sm font-semibold transition-all ${paymentMethod === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 px-4 py-3 border border-border rounded-2xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
          >
            <PrinterIcon className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={onSubmit}
            disabled={cart.length === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-2xl hover:bg-[var(--color-brand-hover)] shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
