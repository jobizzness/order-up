"use client";

import { OrderChannel } from "@/types";

interface OrderChannelBadgeProps {
  channel: OrderChannel;
}

const channelStyles: Record<OrderChannel, string> = {
  "dine-in": "bg-[#c8e44d]/20 text-[#5a6e10]",
  takeout: "bg-purple-100 text-purple-700",
  delivery: "bg-blue-100 text-blue-700",
};

const channelLabels: Record<OrderChannel, string> = {
  "dine-in": "Dine-In",
  takeout: "Takeout",
  delivery: "Delivery",
};

export function OrderChannelBadge({ channel }: OrderChannelBadgeProps) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${channelStyles[channel]}`}>
      {channelLabels[channel]}
    </span>
  );
}
