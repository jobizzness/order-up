"use client";

import {
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { ApplicationLayout } from "@/components/layout";
import { StatCard, SalesCard, RecentOrders, OrderActivity, ChannelBreakdown, ActiveCustomers, LogisticsMap } from "@/components/dashboard";
import { mockOrders } from "@/utils/mock-orders";

export default function DashboardPage() {
  return (
    <ApplicationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome back!</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your orders today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="This Month Orders"
            value="132"
            change="↑ 25%"
            changeType="positive"
            icon={ClipboardDocumentListIcon}
          />
          <StatCard
            title="Avg. Prep Time"
            value="18m"
            change="↓ 3m"
            changeType="positive"
            icon={ClockIcon}
          />
          <SalesCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActiveCustomers />
            <RecentOrders orders={mockOrders} />
            <ChannelBreakdown />
            <OrderActivity />
          </div>
          <div className="lg:row-span-2">
            <LogisticsMap />
          </div>
        </div>
      </div>
    </ApplicationLayout>
  );
}
