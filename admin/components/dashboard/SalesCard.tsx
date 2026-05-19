"use client";

import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

export function SalesCard() {
  return (
    <div className="rounded-2xl p-6 flex flex-col justify-between shadow-sm bg-gradient-to-br from-[#2d9f8f] to-[#1a6b5f] text-white relative overflow-hidden">
      <div className="absolute top-3 right-3 opacity-20">
        <CurrencyDollarIcon className="w-16 h-16" />
      </div>

      <div>
        <p className="text-sm font-medium text-white/80">Sales Volume</p>
        <p className="text-3xl font-bold mt-1">$4,280</p>
        <p className="text-xs text-white/70 mt-1">Per Month</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
          ↑ 12% from last month
        </span>
      </div>
    </div>
  );
}
