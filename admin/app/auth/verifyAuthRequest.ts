"use server";

import { createClient } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import type { UserWithTenantsDto } from "@/prisma/dto/user.dto";

const ALLOWED_ROLES: UserRole[] = ["platform_admin", "restaurant_owner"];

export type VerifyAuthResult =
  | { ok: true; user: UserWithTenantsDto }
  | { ok: false; error: string };

/**
 * Verifies the current Supabase session and checks the user exists
 * in our database with an allowed role.
 *
 * Returns a result object — callers are responsible for redirecting on failure.
 */
export async function verifyAuthRequest(): Promise<VerifyAuthResult> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !authUser) {
    return { ok: false, error: "No active session" };
  }

  const user = await prisma.user.findUnique({
    where: { email: authUser.email! },
    include: {
      ownedTenants: {
        select: { id: true, slug: true, name: true, tier: true, isApproved: true, createdAt: true },
      },
    },
  });

  if (!user) {
    await supabase.auth.signOut();
    return { ok: false, error: "Account not found" };
  }

  if (!ALLOWED_ROLES.includes(user.role)) {
    await supabase.auth.signOut();
    return { ok: false, error: "Access denied" };
  }

  return { ok: true, user: user as UserWithTenantsDto };
}
