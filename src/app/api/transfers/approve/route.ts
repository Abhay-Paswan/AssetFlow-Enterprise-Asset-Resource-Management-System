import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/core/auth/jwt';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'Admin' && session.role !== 'Asset Manager' && session.role !== 'Department Head') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { transferRequestId } = await request.json();

    const transfer = await prisma.transferRequest.findUnique({
      where: { id: transferRequestId }
    });

    if (!transfer || transfer.status !== 'Requested') {
      return NextResponse.json({ error: 'Valid transfer request not found', status: 404 }, { status: 404 });
    }

    // Find active allocation to close it
    const activeAllocation = await prisma.allocation.findFirst({
      where: {
        assetId: transfer.assetId,
        assigneeId: transfer.fromUserId as string,
        status: 'Allocated'
      }
    });

    const updates: any[] = [];
    
    // Close old allocation
    if (activeAllocation) {
       updates.push(
         prisma.allocation.update({
           where: { id: activeAllocation.id },
           data: {
             status: 'Returned',
             returnedDate: new Date(),
             checkInNotes: 'Transferred'
           }
         })
       );
    }

    // Create new allocation
    updates.push(
      prisma.allocation.create({
        data: {
          assetId: transfer.assetId,
          assigneeId: transfer.toUserId,
          status: 'Allocated'
        }
      })
    );

    // Update transfer request status
    updates.push(
      prisma.transferRequest.update({
        where: { id: transferRequestId },
        data: { status: 'Approved' }
      })
    );

    // Re-affirm asset status
    updates.push(
      prisma.asset.update({
        where: { id: transfer.assetId },
        data: { status: 'Allocated' }
      })
    );

    await prisma.$transaction(updates);

    try {
      const { logActivity } = await import('@/lib/activity');
      await logActivity(session.userId, 'Transfer Approved', 'Asset', transfer.assetId, `Transfer to ${transfer.toUserId} approved`);
    } catch(e) {}

    return NextResponse.json({ message: 'Transfer Approved', status: 200 }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 });
  }
}
