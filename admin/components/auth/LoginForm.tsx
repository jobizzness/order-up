"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/auth/actions";

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, { error: null });
  const error = state.error;

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={isPending}
          placeholder="you@restaurant.com"
          className="w-full border-b-2 border-input bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-[var(--color-brand)] transition-colors disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={isPending}
          placeholder="••••••••"
          className="w-full border-b-2 border-input bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-[var(--color-brand)] transition-colors disabled:opacity-50"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            name="remember"
            disabled={isPending}
            className="w-4 h-4 rounded border-input accent-[var(--color-brand)]"
          />
          <span className="text-sm text-muted-foreground">Remember Me</span>
        </label>
        <Link
          href="/auth/reset-password"
          className="text-sm text-[var(--color-brand)] hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-lg bg-[var(--color-brand)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-hover)] transition-colors active:translate-y-px disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Signing in…
          </>
        ) : (
          "Login To Your Account"
        )}
      </button>
    </form>
  );
}
