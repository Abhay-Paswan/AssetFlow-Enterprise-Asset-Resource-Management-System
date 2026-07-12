import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const { assetId, toUserId } = await request.json();

    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        allocations: {
          where: { status: 'Allocated' },
          take: 1
        }
      }
    });

    if (!asset || asset.status !== 'Allocated' || asset.allocations.length === 0) {
      return NextResponse.json({ error: 'Asset is not eligible for transfer', status: 400 }, { status: 400 });
    }

    const fromUserId = asset.allocations[0].assigneeId;

    const transferRequest = await prisma.transferRequest.create({
      data: {
        assetId,
        fromUserId,
        toUserId,
        status: 'Requested'
      }
    });

    return NextResponse.json({ data: transferRequest, status: 201 }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 });
  }
}
