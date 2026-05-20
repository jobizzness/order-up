"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase";
import { verifyAuthRequest } from "@/app/auth/verifyAuthRequest";

type AccessLevel = 'admin' | 'approved' | 'pending' | 'onboarding';

async function setAccessCookie(value: AccessLevel) {
  const jar = await cookies();
  jar.set('ou_access', value, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function loginAction(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Confirm user exists in our DB with an allowed role before granting access
  const auth = await verifyAuthRequest();

  if (!auth.ok) {
    return { error: auth.error };
  }

  const { user } = auth;

  // Platform admins always have full access
  if (user.role === "platform_admin") {
    await setAccessCookie("admin");
    redirect("/dashboard");
  }

  // Restaurant owners — check tenant state
  if (user.ownedTenants.length === 0) {
    await setAccessCookie("onboarding");
    redirect("/auth/onboarding");
  }

  const tenant = user.ownedTenants[0];
  if (!tenant.isApproved) {
    await setAccessCookie("pending");
    redirect("/auth/onboarding/pending");
  }

  await setAccessCookie("approved");
  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const jar = await cookies();
  jar.delete('ou_access');
  redirect("/auth/login");
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
