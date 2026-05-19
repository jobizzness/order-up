export type OrderStatus = "pending" | "preparing" | "ready" | "served";

export type OrderPriority = "high" | "medium" | "low";

export type OrderChannel = "dine-in" | "takeout" | "delivery";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber?: number;
  customerName?: string;
  items: OrderItem[];
  status: OrderStatus;
  priority: OrderPriority;
  channel: OrderChannel;
  createdAt: string;
  estimatedReady?: string;
}
