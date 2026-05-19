"use client";

import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusCell } from "./OrderStatusCell";
import { OrderPriorityCell } from "./OrderPriorityCell";
import { OrderChannelCell } from "./OrderChannelCell";

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-muted-foreground font-medium">Order</TableHead>
            <TableHead className="text-muted-foreground font-medium">Customer</TableHead>
            <TableHead className="text-muted-foreground font-medium">Items</TableHead>
            <TableHead className="text-muted-foreground font-medium">Channel</TableHead>
            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
            <TableHead className="text-muted-foreground font-medium">Priority</TableHead>
            <TableHead className="text-muted-foreground font-medium">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium text-foreground">#{order.id}</TableCell>
              <TableCell className="text-foreground">
                {order.customerName || `Table ${order.tableNumber}`}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {order.items.length} {order.items.length === 1 ? "item" : "items"}
              </TableCell>
              <TableCell>
                <OrderChannelCell channel={order.channel} />
              </TableCell>
              <TableCell>
                <OrderStatusCell status={order.status} />
              </TableCell>
              <TableCell>
                <OrderPriorityCell priority={order.priority} />
              </TableCell>
              <TableCell className="text-muted-foreground">{order.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
