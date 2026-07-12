import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { allocationId, checkInNotes } = await request.json();

    const allocation = await prisma.allocation.findUnique({
      where: { id: allocationId }
    });

    if (!allocation || allocation.status === 'Returned') {
       return NextResponse.json({ error: 'Valid allocation not found', status: 404 }, { status: 404 });
    }

    const [, returnAllocation] = await prisma.$transaction([
      prisma.asset.update({
        where: { id: allocation.assetId },
        data: { status: 'Available' }
      }),
      prisma.allocation.update({
        where: { id: allocationId },
        data: {
           status: 'Returned',
           returnedDate: new Date(),
           checkInNotes: checkInNotes || 'Good'
        }
      })
    ]);

    return NextResponse.json({ data: returnAllocation, status: 200 }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 });
  }
}
