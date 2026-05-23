"use client";

import { Category, MenuItem } from "@/types";

interface CategoryTabsProps {
  categories: Category[];
  items: MenuItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({
  categories,
  items,
  selectedId,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onSelect("all")}
        className={`shrink-0 flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${selectedId === "all"
            ? "bg-primary/10 border-primary text-primary"
            : "border-transparent bg-muted text-muted-foreground hover:text-foreground"
          }`}
      >
        <span>All Menu</span>
        <span className="text-xs font-normal text-muted-foreground">
          {items.length} items
        </span>
      </button>
      {categories.map((cat) => {
        const count = items.filter((i) => i.categoryId === cat.id).length;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`shrink-0 flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${selectedId === cat.id
                ? "bg-primary/10 border-primary text-primary"
                : "border-transparent bg-muted text-muted-foreground hover:text-foreground"
              }`}
          >
            <span>{cat.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {count} items
            </span>
          </button>
        );
      })}
    </div>
  );
}
