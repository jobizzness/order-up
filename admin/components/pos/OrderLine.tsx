"use client";

import { ActiveOrder, ActiveOrderStatus, PosOrderType } from "@/types";

interface OrderLineProps {
  orders: ActiveOrder[];
  selectedId: string | null;
  onSelect: (order: ActiveOrder) => void;
  filter: string;
  onFilterChange: (f: string) => void;
}

const STATUS_LABELS: Record<ActiveOrderStatus, string> = {
  "in-kitchen": "In Kitchen",
  "wait-list": "Wait List",
  ready: "Ready",
  served: "Served",
};

const STATUS_COLORS: Record<ActiveOrderStatus, string> = {
  "in-kitchen": "bg-emerald-100 text-emerald-700",
  "wait-list": "bg-orange-100 text-orange-700",
  ready: "bg-violet-100 text-violet-700",
  served: "bg-muted text-muted-foreground",
};

const TYPE_LABELS: Record<PosOrderType, string> = {
  "dine-in": "Dine In",
  takeout: "Take Away",
  delivery: "Delivery",
};

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just Now";
  return `${mins} min${mins !== 1 ? "s" : ""} ago`;
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Dine In", value: "dine-in" },
  { label: "Wait List", value: "wait-list" },
  { label: "Take Away", value: "takeout" },
  { label: "Served", value: "served" },
];

export function OrderLine({
  orders,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
}: OrderLineProps) {
  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "wait-list") return o.status === "wait-list";
    if (filter === "served") return o.status === "served";
    return o.type === filter;
  });

  const counts: Record<string, number> = {
    all: orders.length,
    "dine-in": orders.filter((o) => o.type === "dine-in").length,
    "wait-list": orders.filter((o) => o.status === "wait-list").length,
    takeout: orders.filter((o) => o.type === "takeout").length,
    served: orders.filter((o) => o.status === "served").length,
  };

  return (
    <div className="space-y-3">
      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              filter === f.value
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {f.label}
            {counts[f.value] > 0 && (
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  filter === f.value
                    ? "bg-white/20 text-inherit"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {String(counts[f.value]).padStart(2, "0")}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Order cards */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No active orders</p>
        ) : (
          filtered.map((order) => (
            <button
              key={order.id}
              onClick={() => onSelect(order)}
              className={`shrink-0 w-52 rounded-2xl p-4 text-left border transition-all ${
                selectedId === order.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground">
                  {order.orderNumber}
                </span>
                {order.tableNumber && (
                  <span className="text-xs text-muted-foreground">
                    Table {order.tableNumber}
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-foreground mb-0.5">
                Item: {order.itemCount}X
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {timeAgo(order.createdAt)}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    STATUS_COLORS[order.status]
                  }`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
