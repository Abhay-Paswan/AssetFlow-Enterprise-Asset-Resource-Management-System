import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/core/auth/jwt';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.role !== 'Admin' && session.role !== 'Asset Manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, startDate, endDate, scopeType, scopeValue, auditorIds } = body;

    if (!name || !startDate || !endDate || !scopeType || !scopeValue || !auditorIds || !auditorIds.length) {
      return NextResponse.json({ error: 'Missing required fields', status: 400 }, { status: 400 });
    }

    // Identify assets in scope
    let assetsInScope: any[] = [];
    if (scopeType === 'Location') {
      assetsInScope = await prisma.asset.findMany({ where: { location: scopeValue, status: { notIn: ['Retired', 'Disposed'] } } });
    } else if (scopeType === 'Department') {
      assetsInScope = await prisma.asset.findMany({ where: { departmentId: scopeValue, status: { notIn: ['Retired', 'Disposed'] } } });
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
