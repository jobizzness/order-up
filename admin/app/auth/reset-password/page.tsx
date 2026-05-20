import Link from "next/link";
import { AuthDecorativePanel } from "@/components/auth/AuthDecorativePanel";
import { resetPasswordAction } from "../actions";

interface ResetPasswordPageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { error, success } = await searchParams;

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
              Reset Your Password
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success ? (
            <div className="flex flex-col gap-5">
              <div className="rounded-lg bg-[var(--accent)] border border-[var(--color-brand)]/20 px-4 py-4 text-sm text-foreground">
                <p className="font-semibold text-[var(--color-brand)]">
                  Check your inbox
                </p>
                <p className="mt-1 text-muted-foreground">
                  If an account exists for that email, a password reset link has
                  been sent. It may take a few minutes to arrive.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-brand)] hover:underline"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <form action={resetPasswordAction} className="flex flex-col gap-5">
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

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-[var(--color-brand)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-hover)] transition-colors active:translate-y-px"
              >
                Send Reset Link
              </button>

              <Link
                href="/auth/login"
                className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to login
              </Link>
            </form>
          )}
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
