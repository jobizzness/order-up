"use client";

interface Customer {
  id: string;
  name: string;
  table?: number;
  channel: string;
  orderTime: string;
}

const mockCustomers: Customer[] = [
  { id: "1", name: "Jane Foster", table: 5, channel: "Dine-in", orderTime: "12:05 PM" },
  { id: "2", name: "Sarah M.", channel: "Takeout", orderTime: "12:10 PM" },
  { id: "3", name: "Mike Chen", table: 12, channel: "Dine-in", orderTime: "12:15 PM" },
  { id: "4", name: "John D.", channel: "Delivery", orderTime: "11:50 AM" },
  { id: "5", name: "Emily R.", channel: "Takeout", orderTime: "12:22 PM" },
];

const channelDot: Record<string, string> = {
  "Dine-in": "bg-[var(--color-tag-green)]",
  Takeout: "bg-[var(--color-tag-blue)]",
  Delivery: "bg-[var(--color-tag-purple)]",
};

export function ActiveCustomers() {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Active Customers</h3>
        <span className="text-sm text-muted-foreground">{mockCustomers.length} active</span>
      </div>
      <div className="space-y-3">
        {mockCustomers.map((customer) => (
          <div
            key={customer.id}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                {customer.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{customer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {customer.table ? `Table ${customer.table}` : customer.channel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${channelDot[customer.channel]}`} />
              <span className="text-xs text-muted-foreground">{customer.orderTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
