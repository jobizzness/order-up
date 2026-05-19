"use client";

const tabs = [
  { label: "Active Orders", active: false },
  { label: "Order Queue", active: false },
  { label: "Kanban Board", active: true },
];

export function TabNav() {
  return (
    <nav className="flex items-center gap-8 px-8">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`py-4 text-sm font-medium border-b-2 transition-colors ${tab.active
            ? "text-foreground border-primary"
            : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
