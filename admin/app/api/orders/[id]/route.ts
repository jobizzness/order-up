import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase';
import type { OrderStatus, Prisma } from '@prisma/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Allow public access if device_id matches (customer viewing their order)
    const deviceId = request.headers.get('x-device-id');
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        activities: {
          include: {
            actor: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check authorization: staff or device owner
    const isStaff = user !== null;
    const isOwner = order.deviceId === deviceId;

    if (!isStaff && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updates: {
      status?: OrderStatus;
      priority?: 'low' | 'medium' | 'high';
      estimatedReadyAt?: Date;
      notes?: string;
    } = {};

    if (body.status) updates.status = body.status;
    if (body.priority) updates.priority = body.priority;
    if (body.estimatedReadyAt) updates.estimatedReadyAt = new Date(body.estimatedReadyAt);
    if (body.notes) updates.notes = body.notes;

    // Get staff record for activity logging
    const staff = await prisma.staff.findUnique({
      where: { authId: user.id },
    });

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.order.update({
        where: { id },
        data: updates,
        include: {
          items: true,
        },
      });

      // Log activity if status changed
      if (body.status) {
        await tx.orderActivity.create({
          data: {
            orderId: id,
            status: body.status,
            actorId: staff?.id,
          },
        });
      }

      return updated;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
