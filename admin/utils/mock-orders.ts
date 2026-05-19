import { Order } from "@/types";

export const mockOrders: Order[] = [
  {
    id: "1001",
    tableNumber: 5,
    items: [
      { id: "a1", name: "Grilled Salmon", quantity: 1 },
      { id: "a2", name: "Caesar Salad", quantity: 2 },
    ],
    status: "pending",
    priority: "high",
    channel: "dine-in",
    createdAt: "12:05 PM",
  },
  {
    id: "1002",
    customerName: "Sarah M.",
    items: [
      { id: "b1", name: "Margherita Pizza", quantity: 1 },
      { id: "b2", name: "Garlic Bread", quantity: 1 },
    ],
    status: "preparing",
    priority: "medium",
    channel: "takeout",
    createdAt: "12:10 PM",
  },
  {
    id: "1003",
    tableNumber: 12,
    items: [
      { id: "c1", name: "Burger & Fries", quantity: 2 },
      { id: "c2", name: "Milkshake", quantity: 2 },
    ],
    status: "preparing",
    priority: "medium",
    channel: "dine-in",
    createdAt: "12:15 PM",
  },
  {
    id: "1004",
    customerName: "John D.",
    items: [
      { id: "d1", name: "Pad Thai", quantity: 1 },
    ],
    status: "ready",
    priority: "low",
    channel: "delivery",
    createdAt: "11:50 AM",
  },
  {
    id: "1005",
    tableNumber: 3,
    items: [
      { id: "e1", name: "Steak Medium-Rare", quantity: 1 },
      { id: "e2", name: "Mashed Potatoes", quantity: 1 },
      { id: "e3", name: "Red Wine", quantity: 2 },
    ],
    status: "pending",
    priority: "high",
    channel: "dine-in",
    createdAt: "12:20 PM",
  },
  {
    id: "1006",
    customerName: "Emily R.",
    items: [
      { id: "f1", name: "Fish Tacos", quantity: 3 },
      { id: "f2", name: "Guacamole", quantity: 1 },
    ],
    status: "pending",
    priority: "low",
    channel: "takeout",
    createdAt: "12:22 PM",
  },
];
