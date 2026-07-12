import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const now = new Date();

    const [
      assetsAvailable,
      assetsAllocated,
      maintenanceToday,
      activeBookings,
      pendingTransfers,
      upcomingReturnsCount,
      overdueAllocations
    ] = await Promise.all([
      prisma.asset.count({ where: { status: 'Available' } }),
      prisma.asset.count({ where: { status: 'Allocated' } }),
      prisma.maintenanceRequest.count({
        where: {
          createdAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),
      prisma.booking.count({
        where: {
          status: 'Ongoing',
        },
      }),
      prisma.transferRequest.count({ where: { status: 'Requested' } }),
      prisma.allocation.count({
        where: {
          status: 'Allocated',
          expectedReturnDate: {
            gte: now,
          },
        },
      }),
      prisma.allocation.findMany({
        where: {
          status: 'Allocated',
          expectedReturnDate: {
            lt: now,
          },
        },
        include: {
          asset: true,
        },
      }),
    ]);

    return NextResponse.json({
      kpis: {
        assetsAvailable,
        assetsAllocated,
        maintenanceToday,
        activeBookings,
        pendingTransfers,
        upcomingReturns: upcomingReturnsCount,
      },
      overdueAllocations,
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics', status: 500 }, { status: 500 });
  }
}
