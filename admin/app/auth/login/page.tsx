import { AuthDecorativePanel } from "@/components/auth/AuthDecorativePanel";
import { DevCredentialsHint } from "@/components/auth/DevCredentialsHint";
import { LoginForm } from "@/components/auth/LoginForm";

const IS_DEV = process.env.NODE_ENV === "development";

export default function LoginPage() {
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

          {IS_DEV && (
            <DevCredentialsHint
              email="restaurant@matarrhq.com"
              password="secret12restaurant"
            />
          )}

          <LoginForm />
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
