"use client";

import { navModules } from "@/utils/nav-config";
import { NavModule } from "./NavModule";

export function SidebarNav() {
  return (
    <nav className="flex flex-col">
      {navModules.map((module) => (
        <NavModule key={module.label} module={module} />
      ))}
    </nav>
  );
}
