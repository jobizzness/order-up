import { AuthDecorativePanel } from "@/components/auth/AuthDecorativePanel";
import { OnboardingWizard } from "@/components/auth/OnboardingWizard";

export default function OnboardingPage() {
  return (
    <div className="w-full max-w-5xl min-h-[600px] bg-card rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* Left — wizard */}
      <div className="flex flex-col justify-between px-10 py-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">OU</span>
          </div>
          <span className="font-semibold text-foreground text-lg">Order Up</span>
        </div>

        <div className="mt-10 mb-auto">
          <OnboardingWizard />
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Wrong account?{" "}
          <a href="/auth/login" className="font-semibold text-foreground hover:underline">
            Sign out
          </a>
        </p>
      </div>

      {/* Right — decorative */}
      <AuthDecorativePanel />
    </div>
  );
}
