"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { verifyAuthRequest } from "@/app/auth/verifyAuthRequest";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  // Confirm user exists in our DB with an allowed role before granting access
  const auth = await verifyAuthRequest();

  if (!auth.ok) {
    redirect(`/auth/login?error=${encodeURIComponent(auth.error)}`);
  }

  redirect("/dashboard");
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  });

  if (error) {
    redirect(`/auth/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/auth/reset-password?success=true");
}
