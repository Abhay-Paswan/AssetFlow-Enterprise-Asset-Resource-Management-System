import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { assetId, assigneeId, expectedReturnDate } = await request.json();

    // Query asset's current status
    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        allocations: {
          where: { status: 'Allocated' },
          take: 1
        }
      }
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found', status: 404 }, { status: 404 });
    }

    // CRITICAL CONFLICT RULE
    if (asset.status === 'Allocated') {
       // Find the current holder
       const currentAllocation = asset.allocations[0];
       let currentHolder = 'Unknown';
       if (currentAllocation) {
          const user = await prisma.user.findUnique({ where: { id: currentAllocation.assigneeId } });
          if (user) {
            currentHolder = user.name;
          } else {
             const dept = await prisma.department.findUnique({ where: { id: currentAllocation.assigneeId }});
             if (dept) currentHolder = dept.name;
          }
       }

       return NextResponse.json({
         error: `Asset currently held by ${currentHolder}`,
         currentHolder: currentHolder,
         canRequestTransfer: true,
         status: 409
       }, { status: 409 });
    }

    if (asset.status !== 'Available') {
      return NextResponse.json({ error: `Asset is not Available. Current status: ${asset.status}`, status: 400 }, { status: 400 });
    }

    // Wrap in transaction: update asset status and create allocation
    const [, newAllocation] = await prisma.$transaction([
      prisma.asset.update({
        where: { id: assetId },
        data: { status: 'Allocated' }
      }),
      prisma.allocation.create({
        data: {
          assetId,
          assigneeId,
          expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate) : null,
          status: 'Allocated'
        }
      })
    ]);

    return NextResponse.json({ data: newAllocation, status: 201 }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 });
  }
}
