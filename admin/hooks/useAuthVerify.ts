"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { VerifyResponse, AccessLevel } from "@/app/api/auth/verify/route";

const REDIRECT_MAP = {
  onboarding: "/auth/onboarding",
  pending: "/auth/onboarding/pending",
  approved: "/dashboard",
  admin: null, // no redirect needed
} as const;

/**
 * Call on every protected page mount.
 * Hits /api/auth/verify which checks live DB state, refreshes the ou_access
 * cookie, and returns the current access level. If the access level differs
 * from what the cookie had (e.g. admin just approved this tenant), the hook
 * redirects to the correct destination.
 */
export function useAuthVerify(currentAccess: AccessLevel) {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/verify")
      .then((res) => res.json() as Promise<VerifyResponse>)
      .then((data) => {
        if ("redirect" in data && data.redirect) {
          router.replace(data.redirect);
          return;
        }

        if ("access" in data && data.access && data.access !== currentAccess) {
          const destination = REDIRECT_MAP[data.access];
          if (destination) router.replace(destination);
        }
      })
      .catch(() => {
        // Silently fail — cookie routing still protects the page
      });
  }, []);
}
