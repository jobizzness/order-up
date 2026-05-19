"use client";

import { HeroIcon } from "@/types";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: HeroIcon;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon }: StatCardProps) {
  const changeColor = {
    positive: "text-[var(--color-tag-green)]",
    negative: "text-[var(--color-status-high)]",
    neutral: "text-muted-foreground",
  };

  return (
    <div className="rounded-2xl bg-card p-6 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {change && (
          <span className={`text-sm font-medium ${changeColor[changeType]}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
