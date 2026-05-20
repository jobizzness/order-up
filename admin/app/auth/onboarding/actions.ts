"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAuthRequest } from "@/app/auth/verifyAuthRequest";

export type OnboardingState = { error: string | null };

export async function onboardingAction(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const auth = await verifyAuthRequest();

  if (!auth.ok) {
    redirect("/auth/login");
  }

  const name = (formData.get("name") as string).trim();
  const city = (formData.get("city") as string | null)?.trim() || null;
  const country = (formData.get("country") as string | null)?.trim() || null;
  const themeColor = (formData.get("themeColor") as string | null)?.trim() || "#2d9f8f";
  const logoUrl = (formData.get("logoUrl") as string | null)?.trim() || null;

  if (!name) {
    return { error: "Restaurant name is required." };
  }

  const baseSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.tenant.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  await prisma.tenant.create({
    data: {
      name,
      slug,
      city,
      country,
      ownerId: auth.user.id,
      isApproved: false,
      settings: {
        create: {
          primaryColor: themeColor,
          logoUrl,
          operatingHours: {},
        },
      },
    },
  });

  const jar = await cookies();
  jar.set('ou_access', 'pending', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/auth/onboarding/pending");
}
