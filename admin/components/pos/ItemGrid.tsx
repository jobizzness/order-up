"use client";

import { MinusIcon, PlusIcon, TagIcon } from "@heroicons/react/24/outline";
import { CartItem, Category, MenuItem } from "@/types";

interface ItemGridProps {
  items: MenuItem[];
  categories: Category[];
  cart: CartItem[];
  onAdd: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
}

export function ItemGrid({
  items,
  categories,
  cart,
  onAdd,
  onUpdateQuantity,
}: ItemGridProps) {
  function getQty(itemId: string): number {
    return cart.find((c) => c.menuItem.id === itemId)?.quantity ?? 0;
  }

  function getCategoryName(categoryId: string | null): string {
    if (!categoryId) return "";
    return categories.find((c) => c.id === categoryId)?.name ?? "";
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <TagIcon className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No items in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const qty = getQty(item.id);
        const hasQty = qty > 0;

        return (
          <div
            key={item.id}
            className={`group relative flex flex-col rounded-2xl border overflow-hidden transition-all ${hasQty
              ? "border-primary shadow-sm"
              : "border-border bg-card hover:shadow-sm hover:border-border/80"
              }`}
          >
            {/* Image */}
            <div
              className="w-full h-28 bg-muted overflow-hidden cursor-pointer"
              onClick={() => onAdd(item)}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <TagIcon className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-2 bg-card flex-1">
              {item.categoryId && (
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">
                  {getCategoryName(item.categoryId)}
                </p>
              )}
              <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                {item.name}
              </p>

              {/* Price + qty stepper */}
              <div className="flex items-center justify-between mt-auto pt-1">
                <span className="text-sm font-bold text-foreground">
                  ${Number(item.price).toFixed(2)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, qty - 1)}
                    className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <MinusIcon className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold w-4 text-center text-foreground">
                    {qty}
                  </span>
                  <button
                    onClick={() => onAdd(item)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${hasQty
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                  >
                    <PlusIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
