import { ApplicationLayout } from "@/components/layout";
import { OrdersToolbar, OrdersList } from "@/components/orders";
import { mockOrders } from "@/utils/mock-orders";

export default function Home() {
  return (
    <ApplicationLayout>
      <OrdersToolbar />
      <OrdersList orders={mockOrders} />
    </ApplicationLayout>
  );
}
