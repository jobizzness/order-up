"use client";

import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";

interface RecentOrdersProps {
  orders: Order[];
}

const statusStyles: Record<string, string> = {
  pending: "bg-[var(--color-status-medium)]/15 text-[var(--color-status-medium)] border-[var(--color-status-medium)]/30",
  preparing: "bg-primary/15 text-primary border-primary/30",
  ready: "bg-[var(--color-tag-green)]/15 text-[var(--color-tag-green)] border-[var(--color-tag-green)]/30",
  served: "bg-muted text-muted-foreground border-border",
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  const completed = orders.filter((o) => o.status === "served" || o.status === "ready").length;
  const percentage = Math.round((completed / orders.length) * 100);

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Recent Orders</h3>
        <a href="/orders" className="text-sm text-primary hover:underline">
          View all
        </a>
      </div>

      <div className="flex items-center gap-4 mb-5 p-4 rounded-lg bg-muted/50">
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="var(--border)"
              strokeWidth="2.5"
            />
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeDasharray={`${percentage} ${100 - percentage}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
            {percentage}%
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Completed</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completed} of {orders.length} orders fulfilled
          </p>
        </div>
        <div className="flex gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">{orders.filter((o) => o.status === "pending").length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Pending</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{orders.filter((o) => o.status === "preparing").length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Preparing</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">#{order.id}</span>
              <span className="text-sm text-muted-foreground">
                {order.customerName || `Table ${order.tableNumber}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{order.createdAt}</span>
              <Badge variant="outline" className={statusStyles[order.status]}>
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
