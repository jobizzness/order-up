"use client";

interface ChannelStat {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

const channels: ChannelStat[] = [
  { label: "Dine-in", count: 48, percentage: 45, color: "bg-[var(--color-tag-green)]" },
  { label: "Takeout", count: 32, percentage: 30, color: "bg-[var(--color-tag-blue)]" },
  { label: "Delivery", count: 27, percentage: 25, color: "bg-[var(--color-tag-purple)]" },
];

export function ChannelBreakdown() {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <h3 className="text-base font-semibold text-foreground mb-4">Channel Breakdown</h3>
      <div className="space-y-4">
        {channels.map((channel) => (
          <div key={channel.label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{channel.label}</span>
              <span className="text-sm text-muted-foreground">{channel.count} orders</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${channel.color}`}
                style={{ width: `${channel.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
