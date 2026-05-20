"use client";

import { useActionState, useState, useRef } from "react";
import { onboardingAction } from "@/app/auth/onboarding/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STEPS = ["Logo", "Name", "Theme", "Location"] as const;
type Step = 0 | 1 | 2 | 3;

const THEME_COLORS = [
  { label: "Teal", value: "#2d9f8f" },
  { label: "Indigo", value: "#4f46e5" },
  { label: "Rose", value: "#e11d48" },
  { label: "Amber", value: "#d97706" },
  { label: "Emerald", value: "#059669" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Sky", value: "#0284c7" },
  { label: "Slate", value: "#475569" },
];


export function OnboardingWizard() {
  const [step, setStep] = useState<Step>(0);
  const [state, action, isPending] = useActionState(onboardingAction, { error: null });
  const fileRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState("#2d9f8f");
  const [logoUrl, setLogoUrl] = useState("");

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    setLogoUrl(url);
  }

  function removeLogo() {
    setLogoPreview(null);
    setLogoUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function next() { setStep((s) => Math.min(s + 1, 3) as Step); }
  function back() { setStep((s) => Math.max(s - 1, 0) as Step); }

  return (
    <div className="w-full max-w-lg">
      {/* Step indicator */}
      <div className="flex items-center gap-1.5 mb-8 flex-wrap">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${i < step ? "bg-[var(--color-brand)] text-white" :
                i === step ? "bg-[var(--color-brand)] text-white ring-4 ring-[var(--color-brand)]/20" :
                  "bg-muted text-muted-foreground"
              }`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`text-xs transition-colors ${i === step ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-6 mx-1 transition-all duration-500 ${i < step ? "bg-[var(--color-brand)]" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/*
        All inputs are always in the DOM so their values submit with the form.
        Inactive steps use `hidden` (display:none) — hidden inputs still submit,
        only `disabled` inputs are excluded from FormData.
      */}
      <form action={action}>
        <input type="hidden" name="themeColor" value={themeColor} />
        <input type="hidden" name="logoUrl" value={logoUrl} />

        {/* Step 0 — Logo */}
        <div className={step === 0 ? "block" : "hidden"}>
          <h2 className="text-2xl font-bold text-foreground mb-1">Add your logo</h2>
          <p className="text-sm text-muted-foreground mb-6">Optional — you can always add it later.</p>

          <div
            onClick={() => fileRef.current?.click()}
            className="group flex flex-col items-center justify-center gap-3 w-full h-44 rounded-2xl border-2 border-dashed border-input hover:border-[var(--color-brand)] cursor-pointer transition-colors overflow-hidden bg-muted/50"
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain p-4" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[var(--color-brand)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click to upload <span className="text-[var(--color-brand)] font-medium">PNG, JPG, SVG</span>
                </p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />

          {logoPreview && (
            <button type="button" onClick={removeLogo} className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors">
              Remove logo
            </button>
          )}

          <button type="button" onClick={next} className="mt-6 w-full rounded-lg bg-[var(--color-brand)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-hover)] transition-colors">
            {logoPreview ? "Continue →" : "Skip for now →"}
          </button>
        </div>

        {/* Step 1 — Name */}
        <div className={step === 1 ? "block" : "hidden"}>
          <h2 className="text-2xl font-bold text-foreground mb-1">Name your restaurant</h2>
          <p className="text-sm text-muted-foreground mb-6">This is what customers will see.</p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Restaurant Name <span className="text-destructive">*</span></Label>
            <Input
              ref={nameRef}
              id="name"
              name="name"
              placeholder="The Golden Fork"
              required
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={back} className="rounded-lg border border-input px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">←</button>
            <button
              type="button"
              onClick={() => {
                if (!nameRef.current?.value.trim()) return;
                next();
              }}
              className="flex-1 rounded-lg bg-[var(--color-brand)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-hover)] transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>

        {/* Step 2 — Theme color */}
        <div className={step === 2 ? "block" : "hidden"}>
          <h2 className="text-2xl font-bold text-foreground mb-1">Pick a theme color</h2>
          <p className="text-sm text-muted-foreground mb-6">Used across your dashboard and menus.</p>

          <div className="grid grid-cols-4 gap-3">
            {THEME_COLORS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setThemeColor(value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${themeColor === value
                    ? "border-foreground scale-105 shadow-md"
                    : "border-transparent hover:border-muted-foreground/30"
                  }`}
              >
                <div className="w-10 h-10 rounded-full shadow-sm" style={{ background: value }} />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={back} className="rounded-lg border border-input px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">←</button>
            <button type="button" onClick={next} className="flex-1 rounded-lg py-3 text-sm font-semibold text-white transition-colors hover:opacity-90" style={{ background: themeColor }}>
              Continue →
            </button>
          </div>
        </div>

        {/* Step 3 — Location + submit */}
        <div className={step === 3 ? "block" : "hidden"}>
          <h2 className="text-2xl font-bold text-foreground mb-1">Where are you located?</h2>
          <p className="text-sm text-muted-foreground mb-6">Optional — helps customers find you.</p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" placeholder="New York" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" placeholder="United States" />
            </div>
          </div>

          {state.error && (
            <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={back} disabled={isPending} className="rounded-lg border border-input px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-40">←</button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
              style={{ background: themeColor }}
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting…
                </>
              ) : "Submit for Approval"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
