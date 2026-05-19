"use client";

import { OrderPriority } from "@/types";

interface OrderPriorityBadgeProps {
  priority: OrderPriority;
}

const priorityStyles: Record<OrderPriority, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-500",
};

export function OrderPriorityBadge({ priority }: OrderPriorityBadgeProps) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
}
