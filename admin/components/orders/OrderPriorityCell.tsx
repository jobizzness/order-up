import { OrderPriority } from "@/types";
import { Badge } from "@/components/ui/badge";

const priorityConfig: Record<OrderPriority, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "bg-[var(--color-status-high)]/15 text-[var(--color-status-high)] border-[var(--color-status-high)]/30",
  },
  medium: {
    label: "Medium",
    className: "bg-[var(--color-status-medium)]/15 text-[var(--color-status-medium)] border-[var(--color-status-medium)]/30",
  },
  low: {
    label: "Low",
    className: "bg-muted text-muted-foreground border-border",
  },
};

interface OrderPriorityCellProps {
  priority: OrderPriority;
}

export function OrderPriorityCell({ priority }: OrderPriorityCellProps) {
  const config = priorityConfig[priority];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
