"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ActiveOrder, PosOrderType, PosPaymentMethod } from "@/types";
import { useMenuData } from "@/hooks/useMenuData";
import { useCart } from "@/hooks/useCart";
import { OrderLine } from "./OrderLine";
import { CategoryTabs } from "./CategoryTabs";
import { ItemGrid } from "./ItemGrid";
import { CartPanel } from "./CartPanel";
import { OrderConfirmation } from "./OrderConfirmation";

const MOCK_ORDERS: ActiveOrder[] = [
  {
    id: "1",
    orderNumber: "Order #F0027",
    tableNumber: "03",
    type: "dine-in",
    itemCount: 8,
    status: "in-kitchen",
    createdAt: new Date(Date.now() - 2 * 60000),
  },
  {
    id: "2",
    orderNumber: "Order #F0028",
    tableNumber: "07",
    type: "dine-in",
    itemCount: 3,
    status: "wait-list",
    createdAt: new Date(Date.now() - 30000),
  },
  {
    id: "3",
    orderNumber: "Order #F0019",
    tableNumber: "09",
    type: "dine-in",
    itemCount: 2,
    status: "ready",
    createdAt: new Date(Date.now() - 25 * 60000),
  },
  {
    id: "4",
    orderNumber: "Order #F0031",
    tableNumber: null,
    type: "takeout",
    itemCount: 5,
    status: "in-kitchen",
    createdAt: new Date(Date.now() - 10 * 60000),
  },
  {
    id: "5",
    orderNumber: "Order #F0025",
    tableNumber: "02",
    type: "dine-in",
    itemCount: 4,
    status: "served",
    createdAt: new Date(Date.now() - 45 * 60000),
  },
];

export function PosTerminal() {
  const { categories, items, loading, error } = useMenuData();
  const { cart, subtotal, itemCount, addItem, removeItem, updateQuantity, clearCart } =
    useCart();

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<PosOrderType>("dine-in");
  const [tableNumber, setTableNumber] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<PosPaymentMethod>("card");
  const [orderFilter, setOrderFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategoryId === "all" || item.categoryId === selectedCategoryId;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleSelectOrder(order: ActiveOrder) {
    setSelectedOrderId(order.id);
    if (order.tableNumber) setTableNumber(order.tableNumber);
    setOrderType(order.type);
  }

  function handleSubmit() {
    setConfirmed(true);
    setShowCart(false);
  }

  function handleNewOrder() {
    clearCart();
    setConfirmed(false);
    setSelectedCategoryId("all");
    setSearchQuery("");
    setTableNumber("");
    setGuestCount(2);
    setOrderType("dine-in");
    setSelectedOrderId(null);
  }

  if (confirmed) {
    return (
      <OrderConfirmation
        cart={cart}
        subtotal={subtotal}
        orderType={orderType}
        tableNumber={tableNumber}
        onNewOrder={handleNewOrder}
      />
    );
  }

  const cartProps = {
    cart,
    subtotal,
    orderType,
    tableNumber,
    guestCount,
    paymentMethod,
    onOrderTypeChange: setOrderType,
    onTableNumberChange: setTableNumber,
    onGuestCountChange: setGuestCount,
    onPaymentMethodChange: setPaymentMethod,
    onRemove: removeItem,
    onClear: clearCart,
    onSubmit: handleSubmit,
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: menu + order line */}
      <div
        className={`flex flex-col flex-1 min-w-0 overflow-hidden ${showCart ? "hidden lg:flex" : "flex"
          }`}
      >
        {/* Order Line */}
        <div className="px-5 pt-5 pb-4 border-b border-border space-y-3 shrink-0">
          <h2 className="text-base font-bold text-foreground">Order Line</h2>
          <OrderLine
            orders={MOCK_ORDERS}
            selectedId={selectedOrderId}
            onSelect={handleSelectOrder}
            filter={orderFilter}
            onFilterChange={setOrderFilter}
          />
        </div>

        {/* Menu section */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Search + category tabs */}
          <div className="px-5 pt-4 pb-3 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Menu</h2>
              <div className="relative w-64">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search menu, orders and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-input text-foreground border border-transparent rounded-full pl-9 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <CategoryTabs
              categories={categories}
              items={items}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />
          </div>

          {/* Item grid */}
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <span className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl">
                {error}
              </div>
            ) : (
              <ItemGrid
                items={filteredItems}
                categories={categories}
                cart={cart}
                onAdd={addItem}
                onUpdateQuantity={updateQuantity}
              />
            )}
          </div>
        </div>

        {/* Mobile: view order button */}
        {itemCount > 0 && (
          <div className="lg:hidden px-4 pb-4 shrink-0">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-md hover:bg-[var(--color-brand-hover)] transition-all flex items-center justify-between px-5"
            >
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
              <span>View Order</span>
              <span>${subtotal.toFixed(2)}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile cart overlay */}
      {showCart && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col bg-background">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <button
              onClick={() => setShowCart(false)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-foreground" />
            </button>
            <h2 className="font-bold text-foreground">Your Order</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <CartPanel {...cartProps} />
          </div>
        </div>
      )}

      {/* Desktop cart panel */}
      <div className="hidden lg:flex lg:w-[360px] shrink-0 overflow-hidden">
        <CartPanel {...cartProps} />
      </div>
    </div>
  );
}
