import { OrderChannel } from "@/types";
import { Badge } from "@/components/ui/badge";

const channelConfig: Record<OrderChannel, { label: string; className: string }> = {
  "dine-in": {
    label: "Dine-in",
    className: "bg-[var(--color-tag-green)]/15 text-[var(--color-tag-green)] border-[var(--color-tag-green)]/30",
  },
  takeout: {
    label: "Takeout",
    className: "bg-[var(--color-tag-blue)]/15 text-[var(--color-tag-blue)] border-[var(--color-tag-blue)]/30",
  },
  delivery: {
    label: "Delivery",
    className: "bg-[var(--color-tag-purple)]/15 text-[var(--color-tag-purple)] border-[var(--color-tag-purple)]/30",
  },
};

interface OrderChannelCellProps {
  channel: OrderChannel;
}

export function OrderChannelCell({ channel }: OrderChannelCellProps) {
  const config = channelConfig[channel];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
