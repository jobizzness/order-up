import { NextResponse } from 'next/server';

// TODO: Order model not yet in schema — implement when Order, OrderActivity are added
export async function GET() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
