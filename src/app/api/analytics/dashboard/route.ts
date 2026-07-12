import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/core/auth/jwt';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const now = new Date();

    // Scope filters based on role
    const isDeptHead = session.role === 'Department Head';
    const isEmployee = session.role === 'Employee';
    const deptId = session.departmentId;

    const assetWhere = (isDeptHead && deptId) ? { departmentId: deptId } : (isEmployee ? { allocations: { some: { assigneeId: session.userId, status: 'Allocated' } } } : {});
    
    // Build nested asset filter for where clauses that require it
    const nestedAssetWhere = (isDeptHead && deptId) ? { asset: { departmentId: deptId } } : (isEmployee ? { asset: { allocations: { some: { assigneeId: session.userId, status: 'Allocated' } } } } : {});

    const [
      assetsAvailable,
      assetsAllocated,
      maintenanceToday,
      activeBookings,
      pendingTransfers,
      upcomingReturnsCount,
      overdueAllocations,
      pendingMaintenanceApprovals,
      openAuditDiscrepancies
    ] = await Promise.all([
      prisma.asset.count({ where: { status: 'Available', ...assetWhere } }),
      prisma.asset.count({ where: { status: 'Allocated', ...assetWhere } }),
      prisma.maintenanceRequest.count({
        where: {
          createdAt: { gte: startOfToday, lte: endOfToday },
          ...nestedAssetWhere
        },
      }),
      prisma.booking.count({
        where: { status: 'Ongoing', ...nestedAssetWhere },
      }),
      prisma.transferRequest.count({ where: { status: 'Requested', ...nestedAssetWhere } }),
      prisma.allocation.count({
        where: {
          status: 'Allocated',
          expectedReturnDate: { gte: now },
          ...nestedAssetWhere
        },
      }),
      prisma.allocation.findMany({
        where: {
          status: 'Allocated',
          expectedReturnDate: { lt: now },
          ...nestedAssetWhere
        },
        include: { asset: true },
      }),
      prisma.maintenanceRequest.count({
        where: { status: 'Pending', ...nestedAssetWhere }
      }),
      prisma.auditItem.count({
        where: { status: { in: ['Missing', 'Damaged'] }, auditCycle: { status: 'Active' }, ...nestedAssetWhere }
      })
    ]);

    return NextResponse.json({
      kpis: {
        assetsAvailable,
        assetsAllocated,
        maintenanceToday,
        activeBookings,
        pendingTransfers,
        upcomingReturns: upcomingReturnsCount,
        pendingMaintenanceApprovals,
        openAuditDiscrepancies
      },
      overdueAllocations,
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics', status: 500 }, { status: 500 });
  }
}
