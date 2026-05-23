import { redirect } from "next/navigation";
import { verifyAuthRequest } from "@/app/auth/verifyAuthRequest";
import { PosTerminal } from "@/components/pos/PosTerminal";

export default async function PosPage() {
  const auth = await verifyAuthRequest();
  if (!auth.ok) {
    redirect("/auth/login");
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <span className="text-lg">⊞</span>
          <span>Order Up</span>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">
            POS
          </span>
        </div>
        <a
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Dashboard
        </a>
      </header>

      {/* POS terminal fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <PosTerminal />
      </div>
    </div>
  );
}
