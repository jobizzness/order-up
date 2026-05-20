import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/auth/login', '/auth/reset-password'];
const ONBOARDING = '/auth/onboarding';
const PENDING = '/auth/onboarding/pending';

/**
 * Cookie `ou_access` values: 'admin' | 'approved' | 'pending' | 'onboarding'
 * Set by loginAction/onboardingAction after a DB check.
 * Re-verified client-side via GET /api/auth/verify on every page mount,
 * which refreshes the cookie and redirects if state has changed.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isOnboarding = pathname.startsWith(ONBOARDING);
  const isPending = pathname.startsWith(PENDING);

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!user) {
    if (isPublic || isOnboarding) return response;
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // ── Logged in — bounce away from login/reset ───────────────────────────────
  if (isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ── Cookie-based routing (set by server actions, re-verified by API) ───────
  const access = request.cookies.get('ou_access')?.value;

  if (!access) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (access === 'admin') return response;

  if (access === 'onboarding') {
    if (isOnboarding && !isPending) return response;
    return NextResponse.redirect(new URL(ONBOARDING, request.url));
  }

  if (access === 'pending') {
    if (isPending) return response;
    return NextResponse.redirect(new URL(PENDING, request.url));
  }

  if (access === 'approved') {
    if (isOnboarding) return NextResponse.redirect(new URL('/dashboard', request.url));
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
