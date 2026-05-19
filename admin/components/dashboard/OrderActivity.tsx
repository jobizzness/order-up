"use client";

interface ActivityItem {
  id: string;
  label: string;
  time: string;
  type: "receipt" | "preparation" | "dispatch" | "completed";
}

const mockActivity: ActivityItem[] = [
  { id: "1", label: "Order #1005 received", time: "12:20 PM", type: "receipt" },
  { id: "2", label: "Order #1003 preparation started", time: "12:16 PM", type: "preparation" },
  { id: "3", label: "Order #1002 dispatched", time: "12:12 PM", type: "dispatch" },
  { id: "4", label: "Order #1004 completed", time: "12:00 PM", type: "completed" },
  { id: "5", label: "Order #1001 received", time: "11:55 AM", type: "receipt" },
];

const typeColors: Record<string, string> = {
  receipt: "bg-[var(--color-tag-blue)]",
  preparation: "bg-[var(--color-status-medium)]",
  dispatch: "bg-[var(--color-tag-purple)]",
  completed: "bg-[var(--color-tag-green)]",
};

export function OrderActivity() {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <h3 className="text-base font-semibold text-foreground mb-4">Order Activity</h3>
      <div className="space-y-4">
        {mockActivity.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="relative mt-1.5">
              <span className={`block w-2.5 h-2.5 rounded-full ${typeColors[item.type]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
