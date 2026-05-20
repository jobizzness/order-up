"use client";

import { AuthDecorativePanel } from "@/components/auth/AuthDecorativePanel";
import { useAuthVerify } from "@/hooks/useAuthVerify";

export default function PendingApprovalPage() {
  useAuthVerify("pending");
  return (
    <div className="w-full max-w-5xl min-h-[600px] bg-card rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* Left — status */}
      <div className="flex flex-col justify-between px-10 py-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">OU</span>
          </div>
          <span className="font-semibold text-foreground text-lg">Order Up</span>
        </div>

        <div className="mt-10 mb-auto flex flex-col gap-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--color-brand)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              You&apos;re on the list
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Your restaurant has been submitted and is pending review by our team.
              We&apos;ll notify you at your registered email once your account is approved —
              usually within 24 hours.
            </p>
          </div>

          {/* Status pill */}
          <div className="inline-flex items-center gap-2 self-start bg-[var(--color-status-medium)]/10 border border-[var(--color-status-medium)]/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-status-medium)] animate-pulse" />
            <span className="text-sm font-medium text-[var(--color-status-medium)]">
              Pending approval
            </span>
          </div>

          {/* What's next */}
          <div className="rounded-xl bg-muted p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              What happens next
            </p>
            {[
              "Our team reviews your restaurant details",
              "You receive an approval email",
              "Log back in to access your dashboard",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Need help?{" "}
          <a
            href="mailto:support@orderup.app"
            className="font-semibold text-foreground hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>

      {/* Right — decorative */}
      <AuthDecorativePanel />
    </div>
  );
}
