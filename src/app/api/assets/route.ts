import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const whereClause: any = {};
    if (categoryId) whereClause.categoryId = categoryId;
    if (status) whereClause.status = status;
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { tag: { contains: search } },
        { serialNumber: { contains: search } },
      ];
    }

    const assets = await prisma.asset.findMany({
      where: whereClause,
      include: {
        category: true,
        allocations: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ data: assets, status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate simple tag randomly if not provided
    const tag = body.tag || `AF-${Math.floor(1000 + Math.random() * 9000)}`;

    const asset = await prisma.asset.create({
      data: {
        name: body.name,
        tag: tag,
        categoryId: body.categoryId,
        serialNumber: body.serialNumber,
        acquisitionDate: body.acquisitionDate ? new Date(body.acquisitionDate) : null,
        acquisitionCost: body.acquisitionCost ? parseFloat(body.acquisitionCost) : null,
        condition: body.condition || 'New',
        location: body.location,
        imageUrl: body.imageUrl,
        isSharedResource: body.isSharedResource || false,
        status: 'Available',
      }
    });

    return NextResponse.json({ data: asset, status: 201 }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 }, { status: 500 });
  }
}
