import { ApplicationLayout } from "@/components/layout";
import { OrdersTable } from "@/components/orders";
import { mockOrders } from "@/utils/mock-orders";

export default function OrdersPage() {
  return (
    <ApplicationLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track all restaurant orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {mockOrders.length} orders
            </span>
          </div>
        </div>

        <OrdersTable orders={mockOrders} />
      </div>
    </ApplicationLayout>
  );
}
