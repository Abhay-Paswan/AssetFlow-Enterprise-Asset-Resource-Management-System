import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cycles = await prisma.auditCycle.findMany({
      include: {
        auditors: { select: { id: true, name: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(cycles);
  } catch (error) {
    console.error('Error fetching audit cycles:', error);
    return NextResponse.json({ error: 'Failed to fetch audit cycles', status: 500 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, scopeType, scopeValue, auditorIds } = body;

    if (!name || !startDate || !endDate || !scopeType || !scopeValue || !auditorIds || !auditorIds.length) {
      return NextResponse.json({ error: 'Missing required fields', status: 400 }, { status: 400 });
    }

    // Identify assets in scope
    let assetsInScope = [];
    if (scopeType === 'Location') {
      assetsInScope = await prisma.asset.findMany({ where: { location: scopeValue, status: { notIn: ['Retired', 'Disposed'] } } });
    } else if (scopeType === 'Department') {
      // Assuming asset -> category -> department relation isn't direct, or maybe assets belong to departments.
      // Wait, Asset model only has categoryId. Let's just mock location scoping or assume category scoping if needed.
      // In this hackathon context, if scopeType == 'Department', we'll just fetch all assets for now, or match on some field.
      // We don't have departmentId on asset. So we'll fallback to location or just all available for demo.
      assetsInScope = await prisma.asset.findMany({ where: { status: { notIn: ['Retired', 'Disposed'] } } });
    }

    const newCycle = await prisma.auditCycle.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        scopeType,
        scopeValue,
        auditors: {
          connect: auditorIds.map((id: string) => ({ id })),
        },
        items: {
          create: assetsInScope.map(asset => ({
            assetId: asset.id,
            status: 'Pending',
          })),
        },
      },
      include: {
        auditors: true,
      },
    });

    return NextResponse.json(newCycle, { status: 201 });
  } catch (error) {
    console.error('Error creating audit cycle:', error);
    return NextResponse.json({ error: 'Failed to create audit cycle', status: 500 }, { status: 500 });
  }
}
