"use client";

import { Order } from "@/types";
import { OrderPriorityBadge } from "./OrderPriorityBadge";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderChannelBadge } from "./OrderChannelBadge";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white border border-[#e8e8e3] rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Order #{order.id}
          </h3>
          {order.tableNumber && (
            <p className="text-xs text-gray-500 mt-0.5">
              Table {order.tableNumber}
            </p>
          )}
          {order.customerName && (
            <p className="text-xs text-gray-500 mt-0.5">
              {order.customerName}
            </p>
          )}
        </div>
        <OrderPriorityBadge priority={order.priority} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <OrderStatusBadge status={order.status} />
        <OrderChannelBadge channel={order.channel} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
        <span>{order.createdAt}</span>
      </div>
    </div>
  );
}
