import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');

    const bookings = await prisma.booking.findMany({
      where: assetId ? { assetId } : undefined,
      include: {
        asset: true,
        user: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings', status: 500 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assetId, userId, startTime, endTime, purpose } = body;

    if (!assetId || !userId || !startTime || !endTime || !purpose) {
      return NextResponse.json({ error: 'Missing required fields', status: 400 }, { status: 400 });
    }

    const requestStart = new Date(startTime);
    const requestEnd = new Date(endTime);

    // Verify asset is shared
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found', status: 404 }, { status: 404 });
    }
    if (!asset.isSharedResource) {
      return NextResponse.json({ error: 'Asset is not a shared resource', status: 400 }, { status: 400 });
    }

    // Overlap validation
    // Existing non-cancelled bookings for that assetId
    // Reject if: (RequestStart < ExistingEnd) AND (RequestEnd > ExistingStart)
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        assetId,
        status: { not: 'Cancelled' },
        startTime: { lt: requestEnd },
        endTime: { gt: requestStart }
      }
    });

    if (overlappingBookings.length > 0) {
      return NextResponse.json({ error: 'Time slot overlaps with existing booking', status: 409 }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        assetId,
        userId,
        startTime: requestStart,
        endTime: requestEnd,
        purpose,
        status: 'Upcoming'
      },
      include: {
        asset: true,
        user: true
      }
    });
    
    // Attempt to log activity
    try {
        const { logActivity } = await import('@/lib/activity');
        await logActivity(userId, 'Booking Confirmed', 'Asset', assetId, `Booked for ${purpose}`);
    } catch (e) {
        console.warn('Activity logging failed or not implemented yet');
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking', status: 500 }, { status: 500 });
  }
}
