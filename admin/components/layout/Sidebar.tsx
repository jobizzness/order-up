"use client";

import { SidebarNav } from "./SidebarNav";
import { SidebarProjects } from "./SidebarProjects";

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-sidebar border-r border-sidebar-border flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground mb-8">
        <span className="text-xl">⊞</span>
        <span>Order Up</span>
      </div>

      <button className="w-full bg-primary hover:bg-[var(--color-brand-hover)] text-primary-foreground font-medium text-sm rounded-full py-2.5 px-4 mb-6 transition-colors">
        + Add new order
      </button>

      <SidebarNav />
      <SidebarProjects />

      <div className="mt-auto pt-4 border-t border-sidebar-border text-xs text-muted-foreground">
        <p>Free Plan</p>
        <p className="mt-1">Orders: Unlimited</p>
      </div>
    </aside>
  );
}
