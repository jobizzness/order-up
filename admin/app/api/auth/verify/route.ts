import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export type AccessLevel = 'admin' | 'approved' | 'pending' | 'onboarding';

export type VerifyResponse =
  | { access: AccessLevel; redirect?: never }
  | { access?: never; redirect: string };

function withAccessCookie(response: NextResponse<VerifyResponse>, access: AccessLevel): NextResponse<VerifyResponse> {
  const secure = process.env.NODE_ENV === 'production';
  const value = `ou_access=${access}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure ? '; Secure' : ''}`;
  response.headers.set('Set-Cookie', value);
  return response;
}

export async function GET(): Promise<NextResponse<VerifyResponse>> {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json<VerifyResponse>({ redirect: '/auth/login' }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      role: true,
      ownedTenants: {
        select: { isApproved: true },
        take: 1,
      },
    },
  });

  if (!dbUser) {
    await supabase.auth.signOut();
    return NextResponse.json<VerifyResponse>({ redirect: '/auth/login' }, { status: 401 });
  }

  if (dbUser.role === 'platform_admin') {
    return withAccessCookie(NextResponse.json<VerifyResponse>({ access: 'admin' }), 'admin');
  }

  const hasTenant = dbUser.ownedTenants.length > 0;
  const isApproved = hasTenant && dbUser.ownedTenants[0].isApproved;

  console.log(hasTenant, isApproved);

  if (!hasTenant) {
    return withAccessCookie(NextResponse.json<VerifyResponse>({ access: 'onboarding' }), 'onboarding');
  }

  if (!isApproved) {
    return withAccessCookie(NextResponse.json<VerifyResponse>({ access: 'pending' }), 'pending');
  }

  return withAccessCookie(NextResponse.json<VerifyResponse>({ access: 'approved' }), 'approved');
}
