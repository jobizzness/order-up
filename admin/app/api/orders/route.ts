import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deviceId = request.headers.get('x-device-id');

    const order = await prisma.order.create({
      data: {
        tableNumber: body.tableNumber,
        customerName: body.customerName,
        channel: body.channel,
        status: 'pending',
        priority: body.priority || 'medium',
        notes: body.notes,
        totalAmount: body.totalAmount,
        deviceId: deviceId || undefined,
        items: {
          create: body.items.map((item: {
            menuItemId: string;
            name: string;
            price: number;
            quantity: number;
            notes?: string;
          }) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
        activities: {
          create: {
            status: 'pending',
          },
        },
      },
      include: {
        items: true,
        activities: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
