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

    const menuItems = await prisma.menuItem.findMany({
      where: {
        tenantId,
        isAvailable: showAll ? undefined : true,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Failed to fetch menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
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
      return NextResponse.json({ error: 'Menu item name is required' }, { status: 400 });
    }
    if (body.price === undefined || body.price === null) {
      return NextResponse.json({ error: 'Menu item price is required' }, { status: 400 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        tenantId,
        categoryId: body.categoryId || null,
        name: body.name,
        description: body.description || null,
        price: body.price,
        imageUrl: body.imageUrl || null,
        isAvailable: body.isAvailable ?? true,
        isPopular: body.isPopular ?? false,
        allergens: body.allergens || [],
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error('Failed to create menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

