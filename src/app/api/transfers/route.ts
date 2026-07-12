import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (status) whereClause.status = status;

    const transfers = await prisma.transferRequest.findMany({
      where: whereClause,
      include: {
        asset: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ data: transfers, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 });
  }
}
