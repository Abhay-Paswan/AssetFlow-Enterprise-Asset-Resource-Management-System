import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, managerId } = body;

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
        await logActivity(managerId || 'system', 'Maintenance Approved', 'Asset', currentRequest.assetId, 'Asset moved to Under Maintenance');
      } catch(e) {}
    } else if (status === 'Resolved') {
      await prisma.asset.update({
        where: { id: currentRequest.assetId },
        data: { status: 'Available' }
      });
      try {
        const { logActivity } = await import('@/lib/activity');
        await logActivity(managerId || 'system', 'Maintenance Resolved', 'Asset', currentRequest.assetId, 'Asset is now Available');
      } catch(e) {}
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    return NextResponse.json({ error: 'Failed to update maintenance request', status: 500 }, { status: 500 });
  }
}
