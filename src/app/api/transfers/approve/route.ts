import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
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

    return NextResponse.json({ message: 'Transfer Approved', status: 200 }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 });
  }
}
