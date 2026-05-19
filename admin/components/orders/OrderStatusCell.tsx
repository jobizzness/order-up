import { OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-[var(--color-status-medium)]/15 text-[var(--color-status-medium)] border-[var(--color-status-medium)]/30",
  },
  preparing: {
    label: "Preparing",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  ready: {
    label: "Ready",
    className: "bg-[var(--color-tag-green)]/15 text-[var(--color-tag-green)] border-[var(--color-tag-green)]/30",
  },
  served: {
    label: "Served",
    className: "bg-muted text-muted-foreground border-border",
  },
};

interface OrderStatusCellProps {
  status: OrderStatus;
}

export function OrderStatusCell({ status }: OrderStatusCellProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
