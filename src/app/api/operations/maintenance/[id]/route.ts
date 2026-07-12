import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/core/auth/jwt';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'Admin' && session.role !== 'Asset Manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;
    const managerId = session.userId;

    if (!status) {
      return NextResponse.json({ error: 'Status is required', status: 400 }, { status: 400 });
    }

    const currentRequest = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { asset: true }
    });

    if (!currentRequest) {
      return NextResponse.json({ error: 'Maintenance request not found', status: 404 }, { status: 404 });
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: { status },
      include: {
        asset: true,
        user: true
      }
    });

    // AUTOMATIC ASSET MUTATION
    if (status === 'Approved') {
      await prisma.asset.update({
        where: { id: currentRequest.assetId },
        data: { status: 'Under Maintenance' }
      });
      try {
        const { logActivity } = await import('@/lib/activity');
        await logActivity(managerId, 'Maintenance Approved', 'Asset', currentRequest.assetId, 'Asset moved to Under Maintenance');
      } catch(e) {}
    } else if (status === 'Resolved') {
      // Check if it has an active allocation
      const activeAlloc = await prisma.allocation.findFirst({
        where: { assetId: currentRequest.assetId, status: 'Allocated' }
      });
      const nextStatus = activeAlloc ? 'Allocated' : 'Available';
      
      await prisma.asset.update({
        where: { id: currentRequest.assetId },
        data: { status: nextStatus }
      });
      try {
        const { logActivity } = await import('@/lib/activity');
        await logActivity(managerId, 'Maintenance Resolved', 'Asset', currentRequest.assetId, `Asset is now ${nextStatus}`);
      } catch(e) {}
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    return NextResponse.json({ error: 'Failed to update maintenance request', status: 500 }, { status: 500 });
  }
}
