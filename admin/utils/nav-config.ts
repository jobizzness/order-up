import { NavModule } from "@/types";
import {
  ClipboardDocumentListIcon,
  TruckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export const navModules: NavModule[] = [
  {
    label: "Orders",
    icon: ClipboardDocumentListIcon,
    expanded: true,
    pages: [
      { label: "Active Orders", href: "/orders", active: true },
      { label: "Order History", href: "/orders/history" },
      { label: "New Order", href: "/orders/new" },
    ],
  },
  {
    label: "Logistics",
    icon: TruckIcon,
    expanded: false,
    pages: [
      { label: "Kitchen Display", href: "/logistics/kitchen" },
      { label: "Delivery Tracking", href: "/logistics/delivery" },
      { label: "Channels", href: "/logistics/channels" },
    ],
  },
  {
    label: "Auth",
    icon: LockClosedIcon,
    expanded: false,
    pages: [
      { label: "Staff", href: "/auth/staff" },
      { label: "Roles", href: "/auth/roles" },
      { label: "Settings", href: "/auth/settings" },
    ],
  },
];
