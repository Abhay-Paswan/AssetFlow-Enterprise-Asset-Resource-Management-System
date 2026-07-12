import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/core/auth/jwt';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { status } = await request.json();

    if (status !== 'Cancelled') {
      return NextResponse.json({ error: 'Only cancellation is supported here', status: 400 }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found', status: 404 }, { status: 404 });
    }
    
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (booking.userId !== session.userId && session.role !== 'Admin' && session.role !== 'Asset Manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (booking.status !== 'Upcoming') {
      return NextResponse.json({ error: 'Only upcoming bookings can be cancelled', status: 400 }, { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'Cancelled' }
    });

    try {
      const { logActivity } = await import('@/lib/activity');
      await logActivity(booking.userId, 'Booking Cancelled', 'Booking', id, `Booking for asset ${booking.assetId} cancelled`);
    } catch(e) {}

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ error: 'Failed to cancel booking', status: 500 }, { status: 500 });
  }
}
