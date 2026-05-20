"use client";

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { logoutAction } from "@/app/auth/actions";
import { SidebarNav } from "./SidebarNav";
import { SidebarProjects } from "./SidebarProjects";

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[260px] flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground mb-8">
        <span className="text-xl">⊞</span>
        <span>Order Up</span>
      </div>

      <button className="w-full bg-primary hover:bg-[var(--color-brand-hover)] text-primary-foreground font-medium text-sm rounded-full py-2.5 px-4 mb-6 transition-colors">
        + Add new order
      </button>

      <SidebarNav />
      <SidebarProjects />

      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground">Free Plan</p>
        <p className="mt-1 text-xs text-muted-foreground">Orders: Unlimited</p>

        <form action={logoutAction} className="mt-4">
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <ArrowRightStartOnRectangleIcon className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
