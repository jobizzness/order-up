import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthRequest } from '@/app/auth/verifyAuthRequest';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
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

    // Verify category belongs to this tenant
    const existingCategory = await prisma.menuCategory.findUnique({
      where: { id },
    });

    if (!existingCategory || existingCategory.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const body = await request.json();

    const category = await prisma.menuCategory.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : undefined,
        isActive: body.isActive !== undefined ? body.isActive : undefined,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
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

    // Verify category belongs to this tenant
    const existingCategory = await prisma.menuCategory.findUnique({
      where: { id },
    });

    if (!existingCategory || existingCategory.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Delete category - Note: prisma.menuCategory.delete will delete the category.
    // If there are menu items in this category, we will set categoryId to null for them first.
    await prisma.menuItem.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await prisma.menuCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
