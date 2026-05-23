export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  items: { id: string }[];
}

export interface MenuItem {
  id: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isPopular: boolean;
  allergens: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

export type PosOrderType = "dine-in" | "takeout" | "delivery";

export type PosPaymentMethod = "cash" | "card" | "scan";

export type ActiveOrderStatus = "in-kitchen" | "wait-list" | "ready" | "served";

export interface ActiveOrder {
  id: string;
  orderNumber: string;
  tableNumber: string | null;
  type: PosOrderType;
  itemCount: number;
  status: ActiveOrderStatus;
  createdAt: Date;
}
