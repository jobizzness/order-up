"use client";

import { TruckIcon } from "@heroicons/react/24/outline";

interface DeliveryRoute {
  id: string;
  orderId: string;
  driver: string;
  status: "en-route" | "delivering" | "returning";
  eta: string;
}

const mockRoutes: DeliveryRoute[] = [
  { id: "1", orderId: "#1004", driver: "Alex T.", status: "en-route", eta: "8 min" },
  { id: "2", orderId: "#1007", driver: "Maria L.", status: "delivering", eta: "2 min" },
  { id: "3", orderId: "#1009", driver: "Chris P.", status: "returning", eta: "12 min" },
];

const statusStyles: Record<string, { dot: string; label: string }> = {
  "en-route": { dot: "bg-[var(--color-tag-blue)]", label: "En Route" },
  delivering: { dot: "bg-[var(--color-tag-green)]", label: "Delivering" },
  returning: { dot: "bg-[var(--color-status-medium)]", label: "Returning" },
};

export function LogisticsMap() {
  return (
    <div className="rounded-2xl bg-card p-6 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Logistics Overview</h3>
        <a href="/logistics/delivery" className="text-sm text-primary hover:underline">
          Full map
        </a>
      </div>

      <div className="relative w-full flex-1 min-h-[300px] rounded-lg bg-muted flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }} />
        </div>
        <div className="relative flex flex-col items-center gap-2 text-muted-foreground">
          <TruckIcon className="w-8 h-8" />
          <span className="text-xs">Map integration placeholder</span>
        </div>

        <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-[var(--color-tag-blue)] animate-pulse" />
        <div className="absolute top-12 right-10 w-3 h-3 rounded-full bg-[var(--color-tag-green)] animate-pulse" />
        <div className="absolute bottom-8 left-1/3 w-3 h-3 rounded-full bg-[var(--color-status-medium)] animate-pulse" />
      </div>

    </div>
  );
}
