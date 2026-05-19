"use client";

import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { TabNav } from "./TabNav";

interface ApplicationLayoutProps {
  children: React.ReactNode;
}

export function ApplicationLayout({ children }: ApplicationLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 ml-[260px] flex flex-col">
        <TopHeader />
        <TabNav />

        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
