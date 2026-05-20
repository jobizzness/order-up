export function AuthDecorativePanel() {
  return (
    <div className="relative hidden lg:flex flex-col items-center justify-center h-full overflow-hidden bg-[var(--color-brand)] rounded-2xl p-10">
      {/* Subtle dot-grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating stat card */}
      <div className="relative z-10 flex flex-col gap-6 w-full max-w-xs">
        <div className="bg-card rounded-2xl shadow-lg p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Today&apos;s Orders
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand)] bg-[var(--accent)] rounded-full px-2 py-0.5">
              +12%
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">148</p>
          <div className="flex gap-1 items-end h-10">
            {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  background:
                    i === 5
                      ? "var(--color-brand)"
                      : "var(--color-brand)",
                  opacity: i === 5 ? 1 : 0.3,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        {/* Revenue card */}
        <div className="bg-foreground text-background rounded-2xl shadow-lg p-5 flex flex-col gap-1">
          <p className="text-xs font-medium opacity-60 uppercase tracking-wide">
            Revenue
          </p>
          <p className="text-2xl font-bold">$6,421.50</p>
          <p className="text-xs opacity-50">Balance</p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs tracking-widest opacity-40">
              ★★ ★★★★ 3667
            </span>
          </div>
        </div>

        {/* Notification card */}
        <div className="bg-card rounded-2xl shadow-lg p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white font-bold text-sm shrink-0">
            OU
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">Order Up</p>
            <p className="text-xs text-muted-foreground truncate">
              New order received — Table 5
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">
            Just now
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p className="relative z-10 mt-8 text-center text-sm text-white/70 font-medium">
        Manage your restaurant with confidence
      </p>
    </div>
  );
}
