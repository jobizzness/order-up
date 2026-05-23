import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthRequest } from '@/app/auth/verifyAuthRequest';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    const auth = await verifyAuthRequest();
    if (!auth.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = auth.user;
    let tenantId: string;

    if (user.role === 'platform_admin') {
      const tenant = await prisma.tenant.findFirst();
      if (!tenant) {
        return NextResponse.json({ error: 'No tenants found' }, { status: 404 });
      }
      tenantId = tenant.id;
    } else {
      if (user.ownedTenants.length === 0) {
        return NextResponse.json({ error: 'No tenant associated with this account' }, { status: 403 });
      }
      tenantId = user.ownedTenants[0].id;
    }

    const categories = await prisma.menuCategory.findMany({
      where: {
        tenantId,
      },
      include: {
        items: {
          where: showAll ? undefined : { isAvailable: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAuthRequest();
    if (!auth.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = auth.user;
    let tenantId: string;

    if (user.role === 'platform_admin') {
      const tenant = await prisma.tenant.findFirst();
      if (!tenant) {
        return NextResponse.json({ error: 'No tenants found' }, { status: 404 });
      }
      tenantId = tenant.id;
    } else {
      if (user.ownedTenants.length === 0) {
        return NextResponse.json({ error: 'No tenant associated with this account' }, { status: 403 });
      }
      tenantId = user.ownedTenants[0].id;
    }

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const category = await prisma.menuCategory.create({
      data: {
        tenantId,
        name: body.name,
        sortOrder: body.sortOrder || 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

