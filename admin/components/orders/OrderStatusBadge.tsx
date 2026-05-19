"use client";

import { OrderStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-orange-100 text-orange-700",
  preparing: "bg-blue-100 text-blue-700",
  ready: "bg-green-100 text-green-700",
  served: "bg-gray-100 text-gray-500",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
