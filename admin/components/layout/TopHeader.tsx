"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/hooks/useTheme";

export function TopHeader() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-foreground">
          Nice Cafe
        </span>
        <span className="text-muted-foreground">▾</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Toggle dark mode"
        >
          {mounted && (theme === "light" ? (
            <MoonIcon className="w-5 h-5" />
          ) : (
            <SunIcon className="w-5 h-5" />
          ))}
        </button>


        <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-[var(--color-brand-hover)] transition-colors">
          + Add new order
        </button>
      </div>
    </header>
  );
}
