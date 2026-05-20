import Link from "next/link";
import { AuthDecorativePanel } from "@/components/auth/AuthDecorativePanel";
import { loginAction } from "../actions";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="w-full max-w-5xl min-h-[600px] bg-card rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col justify-between px-10 py-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">OU</span>
          </div>
          <span className="font-semibold text-foreground text-lg">Order Up</span>
        </div>

        {/* Form content */}
        <div className="flex flex-col gap-7 mt-10 mb-auto">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Login to Your Account
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form action={loginAction} className="flex flex-col gap-5">
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
                placeholder="you@restaurant.com"
                className="w-full border-b-2 border-input bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-[var(--color-brand)] transition-colors"
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
                placeholder="••••••••"
                className="w-full border-b-2 border-input bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-[var(--color-brand)] transition-colors"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="remember"
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

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-[var(--color-brand)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-hover)] transition-colors active:translate-y-px"
            >
              Login To Your Account
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-muted-foreground">
          Having trouble?{" "}
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
