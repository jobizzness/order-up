"use client";

interface DevCredentialsHintProps {
  email: string;
  password: string;
}

export function DevCredentialsHint({ email, password }: DevCredentialsHintProps) {
  function fill() {
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = password;
  }

  return (
    <button
      type="button"
      onClick={fill}
      className="w-full rounded-lg border border-dashed border-[var(--color-brand)]/40 bg-[var(--accent)] px-4 py-3 text-left transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--accent)]"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-brand)] mb-1">
        Dev — click to fill
      </p>
      <p className="text-xs text-muted-foreground font-mono">{email}</p>
      <p className="text-xs text-muted-foreground font-mono">{password}</p>
    </button>
  );
}
