"use client";

import { NavPage as NavPageType } from "@/types";

interface NavPageProps {
  page: NavPageType;
}

export function NavPage({ page }: NavPageProps) {
  return (
    <a
      href={page.href}
      className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${page.active
          ? "text-foreground font-semibold bg-sidebar-accent"
          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
        }`}
    >
      {page.label}
    </a>
  );
}
