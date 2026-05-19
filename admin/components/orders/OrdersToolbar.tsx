"use client";

export function OrdersToolbar() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3 px-4 py-2 border border-[#e8e8e3] rounded-md bg-white text-sm text-gray-400 min-w-[240px]">
        <span>🔍</span>
        <span>Search orders...</span>
      </div>

      <div className="flex items-center gap-3">
        <select className="text-sm border border-[#e8e8e3] rounded-md px-3 py-2 bg-white text-gray-600">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Preparing</option>
          <option>Ready</option>
          <option>Served</option>
        </select>

        <select className="text-sm border border-[#e8e8e3] rounded-md px-3 py-2 bg-white text-gray-600">
          <option>All Channels</option>
          <option>Dine-In</option>
          <option>Takeout</option>
          <option>Delivery</option>
        </select>
      </div>
    </div>
  );
}
